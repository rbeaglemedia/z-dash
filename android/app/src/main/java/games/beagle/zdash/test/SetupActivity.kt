package games.beagle.zdash.test

import android.Manifest
import android.bluetooth.BluetoothManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SwitchCompat
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class SetupActivity : AppCompatActivity() {
    private lateinit var prefs: TestPrefs
    private lateinit var status: TextView
    private lateinit var list: ListView
    private lateinit var auto: SwitchCompat
    private var devices: List<Pair<String, String>> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setup)
        prefs = TestPrefs(this)
        status = findViewById(R.id.status)
        list = findViewById(R.id.devices)
        auto = findViewById(R.id.auto)
        auto.isChecked = prefs.autoConnect
        findViewById<Button>(R.id.open).setOnClickListener {
            startActivity(Intent(this, DashActivity::class.java))
        }
        list.setOnItemClickListener { _, _, position, _ ->
            val (name, address) = devices[position]
            prefs.deviceName = name
            prefs.address = address
            status.text = "Selected $name ($address). Reconnect uses only this adapter."
        }
        auto.setOnCheckedChangeListener { _, checked ->
            if (checked) {
                if (prefs.address.isNullOrBlank()) {
                    auto.isChecked = false
                    status.text = "Pick a paired adapter before turning collection on."
                    return@setOnCheckedChangeListener
                }
                if (!ensurePermissions()) {
                    auto.isChecked = false
                    return@setOnCheckedChangeListener
                }
                prefs.autoConnect = true
                ObdService.start(this, ObdService.ACTION_AUTO_ON)
                status.text = "Collection is on for ${prefs.deviceName}. A notification with Stop is required. The dash will not open by itself."
            } else {
                prefs.autoConnect = false
                if (ObdRuntime.engine != null) ObdService.start(this, ObdService.ACTION_AUTO_OFF)
                status.text = "Collection is off."
            }
        }
    }

    override fun onResume() {
        super.onResume()
        if (hasBluetooth()) refreshDevices() else status.text = "Allow Bluetooth to list paired devices. Nothing is scanned."
        if (!prefs.autoConnect) auto.isChecked = false
    }

    private fun bluetoothPermission(): String {
        return if (Build.VERSION.SDK_INT >= 31) Manifest.permission.BLUETOOTH_CONNECT else Manifest.permission.BLUETOOTH
    }

    private fun hasBluetooth(): Boolean {
        val ok = ContextCompat.checkSelfPermission(this, bluetoothPermission()) == PackageManager.PERMISSION_GRANTED
        if (!ok) ensurePermissions()
        return ContextCompat.checkSelfPermission(this, bluetoothPermission()) == PackageManager.PERMISSION_GRANTED
    }

    private fun ensurePermissions(): Boolean {
        val need = mutableListOf(bluetoothPermission())
        if (Build.VERSION.SDK_INT >= 33) need += Manifest.permission.POST_NOTIFICATIONS
        val missing = need.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isEmpty()) return true
        ActivityCompat.requestPermissions(this, missing.toTypedArray(), 1)
        return false
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (grantResults.all { it == PackageManager.PERMISSION_GRANTED }) refreshDevices()
        else status.text = "Bluetooth permission is required to use the paired LX. Collection stays off."
    }

    private fun refreshDevices() {
        val adapter = getSystemService(BluetoothManager::class.java)?.adapter
        if (adapter == null) {
            status.text = "This phone has no Bluetooth."
            return
        }
        if (!adapter.isEnabled) {
            status.text = "Bluetooth is off. Pair the LX in system settings, then come back."
            return
        }
        val bonded = try {
            adapter.bondedDevices.orEmpty()
        } catch (t: SecurityException) {
            status.text = "Bluetooth permission is missing."
            return
        }
        devices = bonded.map { (it.name ?: "Unnamed") to it.address }.sortedBy { it.first }
        val labels = devices.map { (name, address) ->
            val mark = if (address.equals(prefs.address, true)) "selected" else "tap to select"
            "$name\n$address  $mark"
        }
        list.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, if (labels.isEmpty()) listOf("No paired devices") else labels)
        if (devices.isEmpty()) status.text = "No paired Bluetooth devices. Pair the OBDLink LX in system settings. This app will not scan for it."
        else if (prefs.address == null) status.text = "Tap the OBDLink LX in the list. Auto-connect is off."
        else status.text = ObdRuntime.status
    }
}
