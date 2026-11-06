package games.beagle.zdash.test

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ElmCodecTest {
    @Test
    fun parsesStandardFastPoll() {
        // RPM bytes 0C 80 = 3200, /4 = 800. Speed 0. Throttle 0x80 = 50%. MAP 101.
        val s = ElmCodec.parse("41 0C 0C 80 41 0D 00 41 11 80 41 0B 65")
        assertEquals(800, s.rpm)
        assertEquals(0, s.speedKph)
        assertEquals(50, s.throttlePct)
        assertEquals(101, s.mapKpa)
        assertEquals("frame", s.note)
    }

    @Test
    fun noDataIsNotAZeroRpmFrame() {
        val s = ElmCodec.parse("NO DATA")
        assertNull(s.rpm)
        assertEquals("no-ecu", s.note)
    }

    @Test
    fun searchingIsNotEngineOff() {
        val s = ElmCodec.parse("SEARCHING...")
        assertNull(s.rpm)
        assertEquals("no-pid", s.note)
    }
}
