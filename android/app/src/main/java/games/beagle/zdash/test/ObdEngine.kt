package games.beagle.zdash.test

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothSocket
import android.content.Context
import java.io.File
import java.io.OutputStream
import java.util.UUID
import java.util.concurrent.CompletableFuture
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.concurrent.thread

/**
 * One classic-Bluetooth SPP socket to the adapter the user picked.
 * The WebView owns commands while the dash is open. When it is paused and
 * auto-connect is on, this engine polls standard Mode 01 itself.
 */
@android.annotation.SuppressLint("MissingPermission")
class ObdEngine(
    context: Context,
    private val prefs: TestPrefs,
    private val onStatus: (String) -> Unit,
    private val onBytesToWeb: (String) -> Unit,
) {
    enum class Owner { NONE, WEB, NATIVE }

    private val app = context.applicationContext
    private val spp = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    private val io = android.os.HandlerThread("obd-io").apply { start() }
    private val handler = android.os.Handler(io.looper)
    private val nativeBuf = StringBuilder()
    private val open = AtomicBoolean(false)
    private var socket: BluetoothSocket? = null
    private var output: OutputStream? = null
    private var reader: Thread? = null
    @Volatile var owner = Owner.NONE
    @Volatile var running = false
    private val pollRunnable = Runnable { tick() }
    private val timeoutRunnable = Runnable { if (waitingPrompt) onTimeout() }
    private var waitingPrompt = false
    private var inited = false
    private var initStep = 0
    private var attempt = 0
    private var zeroStreak = 0
    private var lastGoodMs = 0L
    private var log: File? = null
    private val initCommands = arrayOf("ATZ", "ATE0", "ATL0", "ATS0", "ATH0", "ATSP6")

    fun webConnectBlocking() {
        val address = prefs.address ?: error("Pick the paired OBDLink LX on the test screen first.")
        val fut = CompletableFuture<Unit>()
        handler.post {
            try {
                running = true
                owner = Owner.WEB
                openSocket(address)
                fut.complete(Unit)
            } catch (t: Throwable) {
                fut.completeExceptionally(t)
            }
        }
        fut.get(20, TimeUnit.SECONDS)
    }

    fun writeFromWeb(raw: String): String {
        if (!ObdPolicy.allowCommand(raw)) return "blocked: the test app does not send ECU writes or unverified requests"
        if (!ObdPolicy.sameDevice(prefs.address, currentAddress())) return "blocked: not the selected adapter"
        val fut = CompletableFuture<String>()
        handler.post {
            try {
                writeRaw(if (raw.endsWith("\r")) raw else raw + "\r")
                fut.complete("")
            } catch (t: Throwable) {
                fut.complete(t.message ?: "write failed")
            }
        }
        return fut.get(5, TimeUnit.SECONDS)
    }

    fun closeFromWeb() {
        handler.post {
            if (prefs.autoConnect && owner == Owner.NATIVE) return@post
            closeSocket("dash closed the link")
            if (!prefs.autoConnect) running = false
        }
    }

    fun activityPaused(auto: Boolean) {
        handler.post {
            if (!auto) {
                running = false
                closeSocket("dash closed, auto-connect off")
                return@post
            }
            running = true
            owner = Owner.NATIVE
            if (socket?.isConnected == true) inited = true
            waitingPrompt = false
            nativeBuf.setLength(0)
            schedule(400)
        }
    }

    fun activityResumed() {
        handler.post {
            owner = Owner.WEB
            waitingPrompt = false
            handler.removeCallbacks(pollRunnable)
            handler.removeCallbacks(timeoutRunnable)
        }
    }

    fun startNative(auto: Boolean) {
        handler.post {
            running = auto
            if (!auto) {
                closeSocket("collection off")
                return@post
            }
            owner = Owner.NATIVE
            attempt = 0
            schedule(200)
        }
    }

    fun stopAll() {
        handler.post {
            running = false
            owner = Owner.NONE
            handler.removeCallbacks(pollRunnable)
            handler.removeCallbacks(timeoutRunnable)
            closeSocket("stopped")
        }
    }

    fun shutdown() {
        stopAll()
        io.quitSafely()
    }

    private fun schedule(delayMs: Long) {
        handler.removeCallbacks(pollRunnable)
        handler.postDelayed(pollRunnable, delayMs.coerceAtLeast(200))
    }

    private fun armTimeout(ms: Long) {
        handler.removeCallbacks(timeoutRunnable)
        handler.postDelayed(timeoutRunnable, ms)
    }

    private fun tick() {
        if (!running || owner != Owner.NATIVE) return
        val address = prefs.address
        if (address.isNullOrBlank()) {
            onStatus("Pick a paired adapter. Collection is not scanning.")
            running = false
            return
        }
        val bt = bluetooth()
        if (bt == null || !bt.isEnabled) {
            onStatus("Bluetooth is off. Collection stopped.")
            running = false
            closeSocket("bluetooth off")
            return
        }
        if (socket?.isConnected != true) {
            try {
                openSocket(address)
                attempt = 0
                inited = false
                initStep = 0
            } catch (t: Throwable) {
                val wait = ObdPolicy.backoffMs(++attempt)
                if (wait == null) {
                    onStatus("Adapter not found. Collection stopped. Turn it on again from the test screen.")
                    running = false
                    return
                }
                onStatus("Selected adapter not connected (${t.message ?: "no socket"}). Retry in ${wait / 1000}s.")
                schedule(wait)
                return
            }
        }
        if (waitingPrompt) return
        if (!inited) {
            if (initStep >= initCommands.size) {
                inited = true
            } else {
                writeRaw(initCommands[initStep] + "\r")
                initStep++
                waitingPrompt = true
                armTimeout(2500)
                return
            }
        }
        writeRaw("010C0D110B\r")
        waitingPrompt = true
        armTimeout(2000)
    }

    private fun onTimeout() {
        waitingPrompt = false
        val now = android.os.SystemClock.elapsedRealtime()
        val pace = ObdPolicy.LinkWatch().let {
            // A timeout is a missing frame, not RPM 0.
            silencePace(now)
        }
        when (pace) {
            ObdPolicy.Pace.STOP -> {
                onStatus("No adapter data for 3 minutes. Collection stopped.")
                running = false
                closeSocket("quiet")
            }
            ObdPolicy.Pace.SLOW -> {
                onStatus("No ECU reply. Waiting. RPM 0 is not treated as engine off.")
                schedule(ObdPolicy.SLOW_MS)
            }
            ObdPolicy.Pace.NORMAL -> schedule(ObdPolicy.NORMAL_MS)
        }
    }

    private fun silencePace(now: Long): ObdPolicy.Pace {
        if (lastGoodMs == 0L) lastGoodMs = now
        val silent = now - lastGoodMs
        return when {
            silent >= ObdPolicy.SILENCE_STOP_MS -> ObdPolicy.Pace.STOP
            silent >= ObdPolicy.SILENCE_SLOW_MS -> ObdPolicy.Pace.SLOW
            else -> ObdPolicy.Pace.NORMAL
        }
    }

    private fun handleReply(reply: String) {
        if (!inited) {
            if (initStep >= initCommands.size) inited = true
            schedule(250)
            return
        }
        val sample = ElmCodec.parse(reply)
        val now = android.os.SystemClock.elapsedRealtime()
        val pace = if (sample.note == "frame") {
            lastGoodMs = now
            if (sample.rpm == 0) {
                zeroStreak++
                onStatus(if (zeroStreak >= ObdPolicy.ZERO_BEFORE_SLOW) "RPM 0 for a while. Still not calling the engine off." else "Link up. RPM ${sample.rpm}.")
                if (zeroStreak >= ObdPolicy.ZERO_BEFORE_SLOW) ObdPolicy.Pace.SLOW else ObdPolicy.Pace.NORMAL
            } else {
                zeroStreak = 0
                onStatus("Link up. RPM ${sample.rpm ?: "-"}.")
                ObdPolicy.Pace.NORMAL
            }
        } else {
            onStatus("ECU not answering (${sample.note}). Not treating that as engine off.")
            silencePace(now)
        }
        appendLog(sample)
        val delay = if (pace == ObdPolicy.Pace.SLOW) ObdPolicy.SLOW_MS else ObdPolicy.NORMAL_MS
        if (pace == ObdPolicy.Pace.STOP) {
            onStatus("No adapter data for 3 minutes. Collection stopped.")
            running = false
            closeSocket("quiet")
        } else {
            schedule(delay)
        }
    }

    private fun appendLog(sample: ObdSample) {
        try {
            val file = log ?: File(app.filesDir, "obd-logs").let { dir ->
                dir.mkdirs()
                File(dir, "lx-${System.currentTimeMillis()}.csv").also {
                    it.writeText("t_ms,rpm,speed_kph,throttle_pct,map_kpa,note\n")
                    log = it
                }
            }
            file.appendText("${System.currentTimeMillis()},${sample.rpm ?: ""},${sample.speedKph ?: ""},${sample.throttlePct ?: ""},${sample.mapKpa ?: ""},${sample.note}\n")
        } catch (_: Throwable) {
        }
    }

    @SuppressLint("MissingPermission")
    private fun openSocket(address: String) {
        if (!ObdPolicy.sameDevice(prefs.address, address)) error("Refusing an adapter that was not selected.")
        if (socket?.isConnected == true && ObdPolicy.sameDevice(currentAddress(), address)) return
        closeSocket("switching")
        val bt = bluetooth() ?: error("No Bluetooth on this phone.")
        if (!bt.isEnabled) error("Bluetooth is off.")
        val device = bt.bondedDevices.firstOrNull { ObdPolicy.sameDevice(it.address, address) }
            ?: error("Selected adapter is not in the paired list.")
        bt.cancelDiscovery()
        val sock = device.createRfcommSocketToServiceRecord(spp)
        sock.connect()
        socket = sock
        output = sock.outputStream
        open.set(true)
        inited = false
        initStep = 0
        reader = thread(name = "obd-read", isDaemon = true) {
            val buf = ByteArray(512)
            try {
                val input = sock.inputStream
                while (open.get() && sock.isConnected) {
                    val n = input.read(buf)
                    if (n < 0) break
                    val text = String(buf, 0, n, Charsets.ISO_8859_1)
                    handler.post { acceptText(text) }
                }
            } catch (_: Throwable) {
            } finally {
                handler.post {
                    if (running && owner == Owner.NATIVE) schedule(ObdPolicy.backoffMs(1) ?: ObdPolicy.SLOW_MS)
                }
            }
        }
        onStatus("Socket open to ${device.name ?: address}.")
    }

    private fun acceptText(text: String) {
        if (owner == Owner.WEB) {
            onBytesToWeb(text)
            return
        }
        if (owner != Owner.NATIVE) return
        nativeBuf.append(text)
        while (true) {
            val i = nativeBuf.indexOf(">")
            if (i < 0) break
            val reply = nativeBuf.substring(0, i)
            nativeBuf.delete(0, i + 1)
            waitingPrompt = false
            handleReply(reply)
        }
    }

    private fun writeRaw(text: String) {
        val out = output ?: error("adapter socket is closed")
        val payload = if (text.endsWith("\r")) text else "$text\r"
        if (!ObdPolicy.allowCommand(payload)) error("blocked command")
        out.write(payload.toByteArray(Charsets.US_ASCII))
        out.flush()
    }

    private fun closeSocket(why: String) {
        open.set(false)
        waitingPrompt = false
        try { output?.close() } catch (_: Throwable) {}
        try { socket?.close() } catch (_: Throwable) {}
        output = null
        socket = null
        reader = null
        if (why != "switching") onStatus(why)
    }

    @SuppressLint("MissingPermission")
    private fun currentAddress(): String {
        return try { socket?.remoteDevice?.address ?: prefs.address ?: "" } catch (_: Throwable) { prefs.address ?: "" }
    }

    private fun bluetooth(): BluetoothAdapter? {
        val mgr = app.getSystemService(BluetoothManager::class.java) ?: return null
        return mgr.adapter
    }

}
