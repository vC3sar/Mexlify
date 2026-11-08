package com.mexlify.player;

import android.Manifest;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

import java.util.Locale;

public class MainActivity extends BridgeActivity {

    private static MainActivity instance;
    private MusicPlaybackService musicService;
    private boolean isServiceBound = false;

    private int safeTopDp = 28;
    private int safeBottomDp = 16;

    private final ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MusicPlaybackService.LocalBinder binder = (MusicPlaybackService.LocalBinder) service;
            musicService = binder.getService();
            isServiceBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            musicService = null;
            isServiceBound = false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;

        setupEdgeToEdgeAndNotch();
        requestNotificationPermissionIfNeeded();
        startAndBindMusicService();
        setupWebViewBridgeAndSettings();
        setupBackNavigationHandler();
    }

    private void setupEdgeToEdgeAndNotch() {
        Window window = getWindow();
        if (window == null) return;

        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.parseColor("#080014"));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = window.getAttributes();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
            } else {
                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            }
            window.setAttributes(lp);
        }

        View decorView = window.getDecorView();
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, decorView);
        if (controller != null) {
            controller.setAppearanceLightStatusBars(false);
            controller.setAppearanceLightNavigationBars(false);
        }

        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, windowInsets) -> {
            Insets sysBars = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
            Insets cutout = windowInsets.getInsets(WindowInsetsCompat.Type.displayCutout());

            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) density = 1f;

            int topPx = Math.max(sysBars.top, cutout.top);
            int bottomPx = Math.max(sysBars.bottom, cutout.bottom);

            safeTopDp = Math.max(24, Math.round(topPx / density));
            safeBottomDp = Math.max(10, Math.round(bottomPx / density));

            injectSafeInsetsToWebView();
            return WindowInsetsCompat.CONSUMED;
        });
    }

    private void injectSafeInsetsToWebView() {
        if (getBridge() == null || getBridge().getWebView() == null) return;
        final WebView webView = getBridge().getWebView();
        final String js = String.format(
            Locale.US,
            "(function(){ document.documentElement.style.setProperty('--safe-top', '%dpx'); document.documentElement.style.setProperty('--safe-bottom', '%dpx'); })();",
            safeTopDp,
            safeBottomDp
        );
        webView.post(() -> webView.evaluateJavascript(js, null));
    }

    private void requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    5055
                );
            }
        }
    }

    private void startAndBindMusicService() {
        try {
            Intent intent = new Intent(this, MusicPlaybackService.class);
            startService(intent);
            bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
        } catch (Exception ignored) {
        }
    }

    private void setupWebViewBridgeAndSettings() {
        if (getBridge() == null || getBridge().getWebView() == null) return;
        WebView webView = getBridge().getWebView();
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        webView.setBackgroundColor(Color.parseColor("#080014"));
        webView.addJavascriptInterface(new MexlifyJsBridge(), "MexlifyNative");
        webView.postDelayed(this::injectSafeInsetsToWebView, 350);
        webView.postDelayed(this::injectSafeInsetsToWebView, 1200);
    }

    private void setupBackNavigationHandler() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() != null && getBridge().getWebView() != null) {
                    WebView webView = getBridge().getWebView();
                    webView.evaluateJavascript(
                        "(function(){ return (typeof window.__handleAndroidBack === 'function') ? window.__handleAndroidBack() : false; })()",
                        result -> {
                            if (result == null || "false".equalsIgnoreCase(result.trim()) || "null".equalsIgnoreCase(result.trim())) {
                                moveTaskToBack(true);
                            }
                        }
                    );
                } else {
                    moveTaskToBack(true);
                }
            }
        });
    }

    public static void dispatchMediaCommandToWeb(final String command, final double seekSeconds) {
        if (instance == null || instance.getBridge() == null || instance.getBridge().getWebView() == null) {
            return;
        }
        final WebView webView = instance.getBridge().getWebView();
        final String js = String.format(
            Locale.US,
            "(function(){ if (typeof window.__onNativeMediaCommand === 'function') { window.__onNativeMediaCommand('%s', %f); } })();",
            command,
            seekSeconds
        );
        webView.post(() -> webView.evaluateJavascript(js, null));
    }

    @Override
    public void onPause() {
        super.onPause();
        // Mantener el motor de audio y timers del WebView activos en segundo plano / pantalla bloqueada
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.onResume();
            webView.resumeTimers();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        injectSafeInsetsToWebView();
    }

    @Override
    public void onDestroy() {
        if (isServiceBound) {
            try {
                unbindService(serviceConnection);
            } catch (Exception ignored) {
            }
            isServiceBound = false;
        }
        if (instance == this) {
            instance = null;
        }
        super.onDestroy();
    }

    public class MexlifyJsBridge {

        @JavascriptInterface
        public void updateMediaState(String title, String artist, boolean isPlaying, double positionSec, double durationSec, String coverBase64) {
            long posMs = Math.round(Math.max(0, positionSec) * 1000.0);
            long durMs = Math.round(Math.max(0, durationSec) * 1000.0);
            if (musicService != null) {
                musicService.updateMediaState(title, artist, isPlaying, posMs, durMs, coverBase64);
            } else {
                startAndBindMusicService();
            }
        }

        @JavascriptInterface
        public void updatePlaybackProgress(double positionSec, double durationSec, boolean isPlaying) {
            if (musicService != null) {
                long posMs = Math.round(Math.max(0, positionSec) * 1000.0);
                long durMs = Math.round(Math.max(0, durationSec) * 1000.0);
                musicService.updatePlaybackStateOnly(posMs, durMs, isPlaying);
            }
        }

        @JavascriptInterface
        public String getSafeInsets() {
            return String.format(Locale.US, "{\"top\":%d,\"bottom\":%d}", safeTopDp, safeBottomDp);
        }

        @JavascriptInterface
        public void minimizeApp() {
            runOnUiThread(() -> moveTaskToBack(true));
        }
    }
}
