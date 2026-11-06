package games.beagle.zdash.test

data class ObdSample(
    val rpm: Int?,
    val speedKph: Int?,
    val throttlePct: Int?,
    val mapKpa: Int?,
    val note: String,
)

object ElmCodec {
    fun parse(raw: String): ObdSample {
        val flat = raw.uppercase().replace(Regex("[^0-9A-F]"), "")
        val text = raw.uppercase()
        val bad = listOf("UNABLE", "ERROR", "NODATA", "NO DATA", "STOPPED", "?")
        if (bad.any { text.contains(it.replace(" ", "")) || text.contains(it) }) {
            return ObdSample(null, null, null, null, "no-ecu")
        }
        if (!flat.contains("410C") && !flat.contains("410D") && !flat.contains("4111") && !flat.contains("410B")) {
            return ObdSample(null, null, null, null, "no-pid")
        }
        val rpmFixed = word(flat, "410C")?.let { it / 4 }
        val speed = byte(flat, "410D")
        val throttle = byte(flat, "4111")?.let { it * 100 / 255 }
        val map = byte(flat, "410B")
        return ObdSample(rpmFixed, speed, throttle, map, "frame")
    }

    private fun word(flat: String, tag: String): Int? {
        val i = flat.indexOf(tag)
        if (i < 0 || i + tag.length + 4 > flat.length) return null
        return flat.substring(i + tag.length, i + tag.length + 4).toIntOrNull(16)
    }

    private fun byte(flat: String, tag: String): Int? {
        val i = flat.indexOf(tag)
        if (i < 0 || i + tag.length + 2 > flat.length) return null
        return flat.substring(i + tag.length, i + tag.length + 2).toIntOrNull(16)
    }
}
