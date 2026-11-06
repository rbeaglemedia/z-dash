package games.beagle.zdash.test

import android.webkit.WebView
import org.json.JSONObject
import java.lang.ref.WeakReference

object ObdRuntime {
    @Volatile var engine: ObdEngine? = null
    @Volatile var status: String = "Idle. Auto-connect is off."
    @Volatile var web: WeakReference<WebView>? = null

    fun deliver(text: String) {
        val view = web?.get() ?: return
        val quoted = JSONObject.quote(text)
        view.post {
            view.evaluateJavascript("window.__zdNativeBytes&&window.__zdNativeBytes($quoted)", null)
        }
    }

    fun result(id: String, ok: Boolean, err: String?) {
        val view = web?.get() ?: return
        val idq = JSONObject.quote(id)
        val errq = JSONObject.quote(err ?: "")
        view.post {
            view.evaluateJavascript(
                "window.__zdNativeResult&&window.__zdNativeResult($idq, ${if (ok) "true" else "false"}, $errq)",
                null,
            )
        }
    }
}
