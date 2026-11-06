package games.beagle.zdash.test

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class ObdService : Service() {
    private lateinit var prefs: TestPrefs
    private var engine: ObdEngine? = null

    override fun onCreate() {
        super.onCreate()
        prefs = TestPrefs(this)
        val created = ObdEngine(this, prefs, { text ->
            ObdRuntime.status = text
            updateNotification(text)
        }, { text -> ObdRuntime.deliver(text) })
        engine = created
        ObdRuntime.engine = created
        startAsForeground(ObdRuntime.status)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startAsForeground(ObdRuntime.status)
        when (intent?.action) {
            ACTION_STOP, ACTION_AUTO_OFF -> {
                prefs.autoConnect = false
                engine?.stopAll()
                ObdRuntime.status = "Collection is off."
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }
            ACTION_WEB_RESUME -> engine?.activityResumed()
            ACTION_WEB_PAUSE -> {
                if (prefs.autoConnect) {
                    engine?.activityPaused(true)
                    updateNotification("Background collection is on. The dash screen will not open by itself.")
                } else {
                    engine?.stopAll()
                    stopForeground(STOP_FOREGROUND_REMOVE)
                    stopSelf()
                }
            }
            ACTION_AUTO_ON -> {
                if (!prefs.autoConnect || prefs.address.isNullOrBlank()) {
                    engine?.stopAll()
                    stopForeground(STOP_FOREGROUND_REMOVE)
                    stopSelf()
                } else {
                    engine?.startNative(true)
                }
            }
        }
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        engine?.shutdown()
        if (ObdRuntime.engine === engine) ObdRuntime.engine = null
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startAsForeground(text: String) {
        val mgr = getSystemService(NotificationManager::class.java)
        mgr.createNotificationChannel(
            NotificationChannel(CHANNEL, "OBDLink collection", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Shown while the test app holds the OBDLink LX link."
            },
        )
        val note = notification(text)
        if (Build.VERSION.SDK_INT >= 29) {
            startForeground(NOTIF_ID, note, ServiceInfo.FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE)
        } else {
            startForeground(NOTIF_ID, note)
        }
    }

    private fun updateNotification(text: String) {
        val mgr = getSystemService(NotificationManager::class.java)
        mgr.notify(NOTIF_ID, notification(text))
    }

    private fun notification(text: String): Notification {
        val stop = PendingIntent.getService(
            this,
            1,
            Intent(this, ObdService::class.java).setAction(ACTION_STOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val open = PendingIntent.getActivity(
            this,
            2,
            Intent(this, SetupActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        return NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat)
            .setContentTitle("Z-DASH LX test")
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setContentIntent(open)
            .addAction(0, "Stop", stop)
            .build()
    }

    companion object {
        const val CHANNEL = "zdash-lx"
        const val NOTIF_ID = 42
        const val ACTION_STOP = "games.beagle.zdash.test.STOP"
        const val ACTION_AUTO_ON = "games.beagle.zdash.test.AUTO_ON"
        const val ACTION_AUTO_OFF = "games.beagle.zdash.test.AUTO_OFF"
        const val ACTION_WEB_RESUME = "games.beagle.zdash.test.WEB_RESUME"
        const val ACTION_WEB_PAUSE = "games.beagle.zdash.test.WEB_PAUSE"

        fun start(context: Context, action: String) {
            val intent = Intent(context, ObdService::class.java).setAction(action)
            androidx.core.content.ContextCompat.startForegroundService(context, intent)
        }
    }
}
