package games.beagle.zdash.test

/**
 * Pure rules for the LX test app. No Bluetooth and no Android APIs.
 * RPM 0 is not treated as engine-off. OBD power is not ignition.
 */
object ObdPolicy {
    const val MAX_CONNECT_ATTEMPTS = 8
    const val NORMAL_MS = 1000L
    const val SLOW_MS = 15_000L
    const val SILENCE_SLOW_MS = 30_000L
    const val SILENCE_STOP_MS = 180_000L
    const val ZERO_BEFORE_SLOW = 20

    enum class Pace { NORMAL, SLOW, STOP }

    fun backoffMs(attempt: Int): Long? {
        if (attempt < 1 || attempt > MAX_CONNECT_ATTEMPTS) return null
        val shift = (attempt - 1).coerceAtMost(5)
        return minOf(30_000L, 1_000L shl shift)
    }

    fun sameDevice(selected: String?, address: String): Boolean {
        if (selected.isNullOrBlank() || address.isBlank()) return false
        return selected.equals(address, ignoreCase = true)
    }

    /** Read-only adapter setup and standard Mode 01/03/07/09. No clears, no Mode 22, no header changes. */
    fun allowCommand(raw: String): Boolean {
        val c = raw.trim().uppercase().replace(" ", "").replace("\r", "").replace("\n", "")
        if (c.isEmpty()) return true
        if (c.startsWith("ATSH") || c.startsWith("ATCRA") || c.startsWith("ATMA") || c.startsWith("ATMT")) return false
        if (c == "STI" || c == "ATI" || c == "ATD" || c == "ATDP" || c == "ATRV" || c == "ATZ") return true
        if (c == "ATE0" || c == "ATL0" || c == "ATS0" || c == "ATH0" || c == "ATSP0" || c == "ATSP6") return true
        if (c.startsWith("04") || c.startsWith("08") || c.startsWith("22") || c.startsWith("2F")) return false
        val mode = c[0]
        if (mode != '0') return false
        val service = c.getOrNull(1) ?: return false
        if (service != '1' && service != '3' && service != '7' && service != '9') return false
        return c.drop(2).all { it in '0'..'9' || it in 'A'..'F' }
    }

    class LinkWatch {
        private var zeroStreak = 0
        private var lastFrameMs = -1L

        fun onFrame(rpm: Int?, nowMs: Long): Pace {
            if (rpm == null) {
                if (lastFrameMs < 0) lastFrameMs = nowMs
                val silent = nowMs - lastFrameMs
                return when {
                    silent >= SILENCE_STOP_MS -> Pace.STOP
                    silent >= SILENCE_SLOW_MS -> Pace.SLOW
                    else -> Pace.NORMAL
                }
            }
            lastFrameMs = nowMs
            if (rpm == 0) {
                zeroStreak++
                return if (zeroStreak >= ZERO_BEFORE_SLOW) Pace.SLOW else Pace.NORMAL
            }
            zeroStreak = 0
            return Pace.NORMAL
        }

        fun zeroStreak(): Int = zeroStreak
    }
}
