package games.beagle.zdash.test

import android.webkit.JavascriptInterface
import kotlin.concurrent.thread

class ZdBridge(private val activity: DashActivity) {
    @JavascriptInterface
    fun connect(id: String, optsJson: String) {
        if (optsJson.length > 4000) {
            ObdRuntime.result(id, false, "Connect options were too large.")
            return
        }
        val prefs = TestPrefs(activity)
        if (prefs.address.isNullOrBlank()) {
            ObdRuntime.result(id, false, "Pick the paired OBDLink LX on the test screen first.")
            return
        }
        if (!activity.hasBluetoothPermission()) {
            ObdRuntime.result(id, false, "Bluetooth permission is not granted.")
            return
        }
        ObdService.start(activity, ObdService.ACTION_WEB_RESUME)
        thread(name = "zd-connect") {
            val deadline = System.currentTimeMillis() + 4000
            while (ObdRuntime.engine == null && System.currentTimeMillis() < deadline) {
                Thread.sleep(50)
            }
            val engine = ObdRuntime.engine
            if (engine == null) {
                ObdRuntime.result(id, false, "Link service did not start.")
                return@thread
            }
            try {
                engine.webConnectBlocking()
                ObdRuntime.result(id, true, null)
            } catch (t: Throwable) {
                ObdRuntime.result(id, false, t.message ?: "connect failed")
            }
        }
    }

    @JavascriptInterface
    fun write(raw: String): String {
        val engine = ObdRuntime.engine ?: return "link service is not running"
        return try {
            engine.writeFromWeb(raw)
        } catch (t: Throwable) {
            t.message ?: "write failed"
        }
    }

    @JavascriptInterface
    fun close() {
        ObdRuntime.engine?.closeFromWeb()
    }

    @JavascriptInterface
    fun shareFile(name: String, text: String) {
        activity.shareText(name, text)
    }

    companion object {
        const val JS = """
            (function(){
              if (window.ZDNative && window.ZDNative.__native) return;
              window.__zdNativePending = {};
              window.__zdNativeResult = function(id, ok, err){
                var p = window.__zdNativePending[id];
                if (!p) return;
                delete window.__zdNativePending[id];
                if (ok) p.resolve(); else p.reject(new Error(err || 'connect failed'));
              };
              window.__zdNativeBytes = function(s){ if (window.__zdOnNativeData) window.__zdOnNativeData(s); };
              window.ZDNative = {
                __native: true,
                connect: function(){
                  return new Promise(function(resolve, reject){
                    var id = 'c' + Math.random().toString(16).slice(2);
                    window.__zdNativePending[id] = {resolve: resolve, reject: reject};
                    ZdBridge.connect(id, '{}');
                  });
                },
                write: function(s){
                  return new Promise(function(resolve, reject){
                    try {
                      var err = ZdBridge.write(String(s));
                      if (err) reject(new Error(err)); else resolve();
                    } catch (e) { reject(e); }
                  });
                },
                onData: function(cb){ window.__zdOnNativeData = cb; },
                close: function(){ try { ZdBridge.close(); } catch (e) {} },
                shareFile: function(name, text){
                  try { ZdBridge.shareFile(String(name||'log.txt'), String(text||'')); } catch (e) {}
                  return Promise.resolve('shared');
                }
              };
            })();
        """
    }
}
