package com.mexlify.player;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Base64;

public class MusicPlaybackService extends Service {

    public static final String CHANNEL_ID = "mexlify_music_playback_channel";
    public static final int NOTIFICATION_ID = 5055;

    public static final String ACTION_PLAY = "com.mexlify.player.ACTION_PLAY";
    public static final String ACTION_PAUSE = "com.mexlify.player.ACTION_PAUSE";
    public static final String ACTION_TOGGLE = "com.mexlify.player.ACTION_TOGGLE";
    public static final String ACTION_NEXT = "com.mexlify.player.ACTION_NEXT";
    public static final String ACTION_PREV = "com.mexlify.player.ACTION_PREV";
    public static final String ACTION_STOP = "com.mexlify.player.ACTION_STOP";

    private final IBinder binder = new LocalBinder();
    private MediaSession mediaSession;
    private NotificationManager notificationManager;
    private PowerManager.WakeLock wakeLock;

    private String currentTitle = "Mexlify Music";
    private String currentArtist = "Reproductor Offline";
    private boolean isPlaying = false;
    private long currentPositionMs = 0L;
    private long currentDurationMs = 0L;
    private Bitmap currentCoverBitmap = null;

    public class LocalBinder extends Binder {
        public MusicPlaybackService getService() {
            return MusicPlaybackService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        createNotificationChannel();
        initMediaSession();
        initWakeLock();
    }

    private void initWakeLock() {
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Mexlify::MusicWakeLock");
                wakeLock.setReferenceCounted(false);
            }
        } catch (Exception ignored) {
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && notificationManager != null) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Reproducción de Música Mexlify",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Controles de reproducción de música en pantalla de bloqueo, barra de estado y notch dinámico");
            channel.setShowBadge(false);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private void initMediaSession() {
        mediaSession = new MediaSession(this, "MexlifyMediaSession");
        mediaSession.setCallback(new MediaSession.Callback() {
            @Override
            public void onPlay() {
                MainActivity.dispatchMediaCommandToWeb("play", -1);
            }

            @Override
            public void onPause() {
                MainActivity.dispatchMediaCommandToWeb("pause", -1);
            }

            @Override
            public void onSkipToNext() {
                MainActivity.dispatchMediaCommandToWeb("next", -1);
            }

            @Override
            public void onSkipToPrevious() {
                MainActivity.dispatchMediaCommandToWeb("prev", -1);
            }

            @Override
            public void onSeekTo(long pos) {
                currentPositionMs = pos;
                updatePlaybackStateOnly(pos, currentDurationMs, isPlaying);
                MainActivity.dispatchMediaCommandToWeb("seek", pos / 1000.0);
            }

            @Override
            public void onStop() {
                MainActivity.dispatchMediaCommandToWeb("pause", -1);
            }
        });
        mediaSession.setFlags(
            MediaSession.FLAG_HANDLES_MEDIA_BUTTONS |
            MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS
        );
        mediaSession.setActive(true);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.getAction() != null) {
            String action = intent.getAction();
            switch (action) {
                case ACTION_PLAY:
                    MainActivity.dispatchMediaCommandToWeb("play", -1);
                    break;
                case ACTION_PAUSE:
                    MainActivity.dispatchMediaCommandToWeb("pause", -1);
                    break;
                case ACTION_TOGGLE:
                    MainActivity.dispatchMediaCommandToWeb("toggle", -1);
                    break;
                case ACTION_NEXT:
                    MainActivity.dispatchMediaCommandToWeb("next", -1);
                    break;
                case ACTION_PREV:
                    MainActivity.dispatchMediaCommandToWeb("prev", -1);
                    break;
                case ACTION_STOP:
                    MainActivity.dispatchMediaCommandToWeb("pause", -1);
                    stopForeground(true);
                    stopSelf();
                    break;
            }
        }
        return START_STICKY;
    }

    public void updateMediaState(String title, String artist, boolean playing, long posMs, long durMs, String coverBase64) {
        this.currentTitle = (title != null && !title.isEmpty()) ? title : "Mexlify Music";
        this.currentArtist = (artist != null && !artist.isEmpty()) ? artist : "Desconocido";
        this.isPlaying = playing;
        this.currentPositionMs = Math.max(0L, posMs);
        this.currentDurationMs = Math.max(0L, durMs);

        if (coverBase64 != null && !coverBase64.isEmpty()) {
            Bitmap decoded = decodeBase64Bitmap(coverBase64);
            if (decoded != null) {
                this.currentCoverBitmap = decoded;
            }
        }
        if (this.currentCoverBitmap == null) {
            this.currentCoverBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
        }

        try {
            if (wakeLock != null) {
                if (playing && !wakeLock.isHeld()) {
                    wakeLock.acquire(4 * 60 * 60 * 1000L);
                } else if (!playing && wakeLock.isHeld()) {
                    wakeLock.release();
                }
            }
        } catch (Exception ignored) {
        }

        updateSessionMetadataAndState();
        Notification notification = buildMediaNotification();

        try {
            if (playing) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
                } else {
                    startForeground(NOTIFICATION_ID, notification);
                }
            } else {
                if (notificationManager != null) {
                    notificationManager.notify(NOTIFICATION_ID, notification);
                }
            }
        } catch (Exception e) {
            if (notificationManager != null) {
                notificationManager.notify(NOTIFICATION_ID, notification);
            }
        }
    }

    public void updatePlaybackStateOnly(long posMs, long durMs, boolean playing) {
        this.currentPositionMs = Math.max(0L, posMs);
        if (durMs > 0 && Math.abs(durMs - this.currentDurationMs) > 1000) {
            this.currentDurationMs = durMs;
            updateSessionMetadataAndState();
            return;
        }
        this.isPlaying = playing;
        if (mediaSession == null) return;

        long actions = PlaybackState.ACTION_PLAY
            | PlaybackState.ACTION_PAUSE
            | PlaybackState.ACTION_PLAY_PAUSE
            | PlaybackState.ACTION_SKIP_TO_NEXT
            | PlaybackState.ACTION_SKIP_TO_PREVIOUS
            | PlaybackState.ACTION_SEEK_TO
            | PlaybackState.ACTION_STOP;

        int state = playing ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED;
        float speed = playing ? 1.0f : 0.0f;

        PlaybackState playbackState = new PlaybackState.Builder()
            .setActions(actions)
            .setState(state, this.currentPositionMs, speed, SystemClock.elapsedRealtime())
            .build();

        mediaSession.setPlaybackState(playbackState);
    }

    private void updateSessionMetadataAndState() {
        if (mediaSession == null) return;

        MediaMetadata.Builder metaBuilder = new MediaMetadata.Builder()
            .putString(MediaMetadata.METADATA_KEY_TITLE, currentTitle)
            .putString(MediaMetadata.METADATA_KEY_DISPLAY_TITLE, currentTitle)
            .putString(MediaMetadata.METADATA_KEY_ARTIST, currentArtist)
            .putString(MediaMetadata.METADATA_KEY_ALBUM_ARTIST, currentArtist)
            .putString(MediaMetadata.METADATA_KEY_DISPLAY_SUBTITLE, currentArtist)
            .putString(MediaMetadata.METADATA_KEY_ALBUM, "Mexlify Music")
            .putLong(MediaMetadata.METADATA_KEY_DURATION, currentDurationMs);

        if (currentCoverBitmap != null) {
            metaBuilder.putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, currentCoverBitmap);
            metaBuilder.putBitmap(MediaMetadata.METADATA_KEY_ART, currentCoverBitmap);
            metaBuilder.putBitmap(MediaMetadata.METADATA_KEY_DISPLAY_ICON, currentCoverBitmap);
        }

        mediaSession.setMetadata(metaBuilder.build());
        mediaSession.setActive(true);
        updatePlaybackStateOnly(currentPositionMs, currentDurationMs, isPlaying);
    }

    private Notification buildMediaNotification() {
        Intent openAppIntent = new Intent(this, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            piFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent contentIntent = PendingIntent.getActivity(this, 100, openAppIntent, piFlags);

        PendingIntent prevPending = createServicePendingIntent(ACTION_PREV, 101, piFlags);
        PendingIntent togglePending = createServicePendingIntent(ACTION_TOGGLE, 102, piFlags);
        PendingIntent nextPending = createServicePendingIntent(ACTION_NEXT, 103, piFlags);

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(this, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(this);
        }

        int playPauseIcon = isPlaying ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play;
        String playPauseLabel = isPlaying ? "Pausar" : "Reproducir";

        Notification.Action prevAction = new Notification.Action.Builder(
            android.R.drawable.ic_media_previous, "Anterior", prevPending
        ).build();

        Notification.Action playPauseAction = new Notification.Action.Builder(
            playPauseIcon, playPauseLabel, togglePending
        ).build();

        Notification.Action nextAction = new Notification.Action.Builder(
            android.R.drawable.ic_media_next, "Siguiente", nextPending
        ).build();

        Notification.MediaStyle mediaStyle = new Notification.MediaStyle()
            .setMediaSession(mediaSession.getSessionToken())
            .setShowActionsInCompactView(0, 1, 2);

        builder.setStyle(mediaStyle)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setLargeIcon(currentCoverBitmap)
            .setContentTitle(currentTitle)
            .setContentText(currentArtist)
            .setSubText("Mexlify")
            .setContentIntent(contentIntent)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .setOngoing(isPlaying)
            .setShowWhen(false)
            .setColor(0xFFFF0090)
            .addAction(prevAction)
            .addAction(playPauseAction)
            .addAction(nextAction);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            builder.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
        }

        return builder.build();
    }

    private PendingIntent createServicePendingIntent(String action, int requestCode, int flags) {
        Intent intent = new Intent(this, MusicPlaybackService.class);
        intent.setAction(action);
        return PendingIntent.getService(this, requestCode, intent, flags);
    }

    private Bitmap decodeBase64Bitmap(String base64Str) {
        try {
            String clean = base64Str;
            int commaIdx = base64Str.indexOf(',');
            if (commaIdx != -1) {
                clean = base64Str.substring(commaIdx + 1);
            }
            byte[] decodedBytes = Base64.decode(clean, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onDestroy() {
        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
        } catch (Exception ignored) {
        }
        if (mediaSession != null) {
            mediaSession.setActive(false);
            mediaSession.release();
        }
        super.onDestroy();
    }
}

