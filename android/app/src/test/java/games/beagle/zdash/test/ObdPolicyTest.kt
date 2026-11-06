package games.beagle.zdash.test

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ObdPolicyTest {
    @Test
    fun backoffStopsAfterCap() {
        assertEquals(1000L, ObdPolicy.backoffMs(1))
        assertEquals(2000L, ObdPolicy.backoffMs(2))
        assertEquals(30_000L, ObdPolicy.backoffMs(8))
        assertNull(ObdPolicy.backoffMs(9))
        assertNull(ObdPolicy.backoffMs(0))
    }

    @Test
    fun onlyTheSelectedAdapterMatches() {
        assertTrue(ObdPolicy.sameDevice("AA:BB:CC:DD:EE:FF", "aa:bb:cc:dd:ee:ff"))
        assertFalse(ObdPolicy.sameDevice("AA:BB:CC:DD:EE:FF", "11:22:33:44:55:66"))
        assertFalse(ObdPolicy.sameDevice(null, "AA:BB:CC:DD:EE:FF"))
        assertFalse(ObdPolicy.sameDevice("", "AA:BB:CC:DD:EE:FF"))
    }

    @Test
    fun blocksWritesAndProprietaryRequests() {
        assertTrue(ObdPolicy.allowCommand("010C0D110B"))
        assertTrue(ObdPolicy.allowCommand("ATSP6\r"))
        assertTrue(ObdPolicy.allowCommand("ATE0"))
        assertTrue(ObdPolicy.allowCommand("0100"))
        assertTrue(ObdPolicy.allowCommand("03"))
        assertTrue(ObdPolicy.allowCommand("0902"))
        assertFalse(ObdPolicy.allowCommand("04"))
        assertFalse(ObdPolicy.allowCommand("04\r"))
        assertFalse(ObdPolicy.allowCommand("22F40C"))
        assertFalse(ObdPolicy.allowCommand("ATSH7E0"))
        assertFalse(ObdPolicy.allowCommand("ATMA"))
        assertFalse(ObdPolicy.allowCommand("08"))
    }

    @Test
    fun oneZeroRpmIsNotEngineOff() {
        val watch = ObdPolicy.LinkWatch()
        assertEquals(ObdPolicy.Pace.NORMAL, watch.onFrame(800, 1_000))
        assertEquals(ObdPolicy.Pace.NORMAL, watch.onFrame(0, 2_000))
        assertEquals(1, watch.zeroStreak())
        assertEquals(ObdPolicy.Pace.NORMAL, watch.onFrame(0, 3_000))
    }

    @Test
    fun sustainedSilenceStops() {
        val watch = ObdPolicy.LinkWatch()
        assertEquals(ObdPolicy.Pace.NORMAL, watch.onFrame(null, 0))
        assertEquals(ObdPolicy.Pace.SLOW, watch.onFrame(null, 30_000))
        assertEquals(ObdPolicy.Pace.STOP, watch.onFrame(null, 180_000))
    }

    @Test
    fun manyZerosSlowDownButDoNotRenameEngineOff() {
        val watch = ObdPolicy.LinkWatch()
        var pace = ObdPolicy.Pace.NORMAL
        for (i in 1..20) pace = watch.onFrame(0, i * 1000L)
        assertEquals(ObdPolicy.Pace.SLOW, pace)
        assertEquals(20, watch.zeroStreak())
    }
}
