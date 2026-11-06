package games.beagle.zdash.test

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import java.io.ByteArrayInputStream

class DashActivity : AppCompatActivity() {
    private lateinit var web: WebView
    private val localHost = "appassets.androidplatform.net"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        web = WebView(this)
        setContentView(web)
        ObdRuntime.web = java.lang.ref.WeakReference(web)
        val loader = WebViewAssetLoader.Builder()
            .setDomain(localHost)
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.allowFileAccess = false
        web.settings.allowContentAccess = false
        web.settings.cacheMode = WebSettings.LOAD_NO_CACHE
        web.settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        web.addJavascriptInterface(ZdBridge(this), "ZdBridge")
        if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            WebViewCompat.addDocumentStartJavaScript(web, ZdBridge.JS, setOf("https://$localHost"))
        }
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                val url = request.url
                if (url.host != localHost) return blocked()
                if (!url.path.orEmpty().startsWith("/www/")) return blocked()
                return loader.shouldInterceptRequest(url)
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                return url.host != localHost || !url.path.orEmpty().startsWith("/www/")
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                if (url != null && url.startsWith("https://$localHost/www/")) {
                    view?.evaluateJavascript(ZdBridge.JS, null)
                }
            }
        }
        web.loadUrl("https://$localHost/www/index.html")
    }

    override fun onStart() {
        super.onStart()
        if (ObdRuntime.engine != null) ObdService.start(this, ObdService.ACTION_WEB_RESUME)
        web.onResume()
        web.resumeTimers()
    }

    override fun onStop() {
        web.pauseTimers()
        web.onPause()
        if (ObdRuntime.engine != null || TestPrefs(this).autoConnect) {
            ObdService.start(this, ObdService.ACTION_WEB_PAUSE)
        }
        super.onStop()
    }

    override fun onDestroy() {
        if (ObdRuntime.web?.get() === web) ObdRuntime.web = null
        web.removeJavascriptInterface("ZdBridge")
        web.destroy()
        super.onDestroy()
    }

    fun hasBluetoothPermission(): Boolean {
        val perm = if (Build.VERSION.SDK_INT >= 31) Manifest.permission.BLUETOOTH_CONNECT else Manifest.permission.BLUETOOTH
        return ContextCompat.checkSelfPermission(this, perm) == PackageManager.PERMISSION_GRANTED
    }

    fun shareText(name: String, text: String) {
        val send = Intent(Intent.ACTION_SEND)
            .setType("text/plain")
            .putExtra(Intent.EXTRA_SUBJECT, name)
            .putExtra(Intent.EXTRA_TEXT, text)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(Intent.createChooser(send, name))
    }

    private fun blocked(): WebResourceResponse {
        return WebResourceResponse("text/plain", "utf-8", 403, "blocked", emptyMap(), ByteArrayInputStream(ByteArray(0)))
    }
}
