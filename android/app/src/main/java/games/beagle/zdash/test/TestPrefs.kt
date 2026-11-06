package games.beagle.zdash.test

import android.content.Context

class TestPrefs(context: Context) {
    private val prefs = context.applicationContext.getSharedPreferences("zdash-lx-test", Context.MODE_PRIVATE)

    var autoConnect: Boolean
        get() = prefs.getBoolean(KEY_AUTO, false)
        set(value) { prefs.edit().putBoolean(KEY_AUTO, value).apply() }

    var address: String?
        get() = prefs.getString(KEY_ADDR, null)
        set(value) { prefs.edit().putString(KEY_ADDR, value).apply() }

    var deviceName: String?
        get() = prefs.getString(KEY_NAME, null)
        set(value) { prefs.edit().putString(KEY_NAME, value).apply() }

    companion object {
        private const val KEY_AUTO = "auto"
        private const val KEY_ADDR = "addr"
        private const val KEY_NAME = "name"
    }
}
