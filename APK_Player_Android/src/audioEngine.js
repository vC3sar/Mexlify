/**
 * Mexlify Android Player - Audio Playback Engine
 * Manejo robusto de reproducción offline, eventos de tiempo, shuffle, loop,
 * MediaSession API web y puente nativo Android (Notificación MediaStyle + Notch Dinámico).
 */

import { storage } from "./storage.js";

export class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "auto";
    this.queue = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.repeatMode = "off"; // "off" | "all" | "one"
    this.isShuffle = false;
    this.originalQueue = [];
    this.listeners = new Map();
    this.lastNativeProgressSync = 0;

    this.initAudioEvents();
    this.initMediaSessionBridge();
  }

  get currentTime() {
    return this.audio ? this.audio.currentTime || 0 : 0;
  }

  getEffectiveDuration() {
    if (this.audio && Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
      return this.audio.duration;
    }
    const cur = this.getCurrentSong();
    return cur && Number.isFinite(cur.duration) && cur.duration > 0 ? cur.duration : 0;
  }

  initAudioEvents() {
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      const song = this.getCurrentSong();
      this.emit("play", song);
      this.syncMediaNotification(true);
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      const song = this.getCurrentSong();
      this.emit("pause", song);
      this.syncMediaNotification(false);
    });

    this.audio.addEventListener("timeupdate", () => {
      const currentTime = this.audio.currentTime || 0;
      const duration = this.getEffectiveDuration();
      this.emit("timeupdate", { currentTime, duration });

      const now = Date.now();
      if (now - this.lastNativeProgressSync > 1000) {
        this.lastNativeProgressSync = now;
        this.syncPositionState(currentTime, duration);
      }
    });

    this.audio.addEventListener("loadedmetadata", () => {
      const duration = this.getEffectiveDuration();
      const song = this.getCurrentSong();
      if (song && duration > 0 && !song.duration) {
        song.duration = duration;
      }
      this.emit("loadedmetadata", { duration });
      this.syncMediaNotification(this.isPlaying);
    });

    this.audio.addEventListener("ended", () => {
      if (this.repeatMode === "one") {
        this.audio.currentTime = 0;
        this.audio.play().catch(console.warn);
      } else {
        this.next(true);
      }
    });

    this.audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      this.emit("error", e);
    });
  }

  initMediaSessionBridge() {
    // 1. Web MediaSession API
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", () => this.togglePlay(true));
        navigator.mediaSession.setActionHandler("pause", () => this.togglePlay(false));
        navigator.mediaSession.setActionHandler("previoustrack", () => this.prev());
        navigator.mediaSession.setActionHandler("nexttrack", () => this.next());
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          if (details && typeof details.seekTime === "number") {
            this.seek(details.seekTime);
          }
        });
      } catch (err) {
        console.warn("MediaSession action handler warning:", err);
      }
    }

    // 2. Native Android Foreground Service & Notch / Lockscreen Bridge
    if (typeof window !== "undefined") {
      window.__onNativeMediaCommand = (command, seekSeconds) => {
        switch (command) {
          case "play":
            this.togglePlay(true);
            break;
          case "pause":
            this.togglePlay(false);
            break;
          case "toggle":
            this.togglePlay();
            break;
          case "next":
            this.next();
            break;
          case "prev":
            this.prev();
            break;
          case "seek":
            if (typeof seekSeconds === "number" && seekSeconds >= 0) {
              this.seek(seekSeconds);
            }
            break;
        }
      };
    }
  }

  async syncMediaNotification(isPlayingState) {
    const song = this.getCurrentSong();
    if (!song) return;

    const title = song.title || song.filename || "Mexlify Music";
    const artist = song.artist || "Mexlify Offline";
    const currentTime = this.audio.currentTime || 0;
    const duration = this.getEffectiveDuration();
    const coverUrl = storage.getCoverUrl(song);

    // Actualizar Web MediaSession
    if (typeof navigator !== "undefined" && "mediaSession" in navigator && typeof MediaMetadata !== "undefined") {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          album: "Mexlify Music",
          artwork: [
            { src: coverUrl, sizes: "512x512", type: "image/png" },
          ],
        });
        navigator.mediaSession.playbackState = isPlayingState ? "playing" : "paused";
      } catch (_) {}
    }

    this.syncPositionState(currentTime, duration);

    // Actualizar Servicio Nativo Android (MediaStyle Notification + Tecno Dynamic Port + Samsung Media Panel)
    if (typeof window !== "undefined" && window.MexlifyNative && typeof window.MexlifyNative.updateMediaState === "function") {
      try {
        const coverBase64 = await storage.getCoverBase64(song);
        window.MexlifyNative.updateMediaState(
          title,
          artist,
          Boolean(isPlayingState),
          currentTime,
          duration,
          coverBase64 || ""
        );
      } catch (err) {
        console.warn("Native media state sync warning:", err);
      }
    }
  }

  syncPositionState(currentTime, duration) {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator && typeof navigator.mediaSession.setPositionState === "function") {
      if (duration > 0 && currentTime >= 0 && currentTime <= duration) {
        try {
          navigator.mediaSession.setPositionState({
            duration: duration,
            playbackRate: this.audio.playbackRate || 1,
            position: currentTime,
          });
        } catch (_) {}
      }
    }

    if (typeof window !== "undefined" && window.MexlifyNative && typeof window.MexlifyNative.updatePlaybackProgress === "function") {
      try {
        window.MexlifyNative.updatePlaybackProgress(
          currentTime,
          duration,
          Boolean(this.isPlaying)
        );
      } catch (_) {}
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error("Listener error:", err);
        }
      });
    }
  }

  setQueue(songs, startIndex = 0) {
    this.queue = [...songs];
    this.originalQueue = [...songs];
    if (this.isShuffle) {
      this.applyShuffle(startIndex);
    } else {
      this.currentIndex = startIndex;
    }
    this.playIndex(this.currentIndex);
  }

  getCurrentSong() {
    if (this.currentIndex >= 0 && this.currentIndex < this.queue.length) {
      return this.queue[this.currentIndex];
    }
    return null;
  }

  async playIndex(index) {
    if (index < 0 || index >= this.queue.length) return;
    this.currentIndex = index;
    const song = this.queue[index];

    try {
      const audioUrl = storage.getAudioUrl(song);
      if (!audioUrl) throw new Error("No hay URL de audio para la canción");

      this.audio.src = audioUrl;
      this.emit("trackchange", song);
      await this.audio.play();
      this.syncMediaNotification(true);
    } catch (err) {
      console.warn("Error reproduciendo pista:", err);
    }
  }

  togglePlay(forceState) {
    if (!this.audio.src) {
      if (this.queue.length > 0) {
        this.playIndex(0);
      }
      return;
    }

    const shouldPlay = typeof forceState === "boolean" ? forceState : this.audio.paused;
    if (shouldPlay) {
      this.audio.play().catch(console.warn);
    } else {
      this.audio.pause();
    }
  }

  seek(seconds) {
    if (!this.audio || isNaN(seconds)) return;
    const maxDur = this.getEffectiveDuration();
    const target = maxDur > 0 ? Math.max(0, Math.min(seconds, maxDur)) : Math.max(0, seconds);
    this.audio.currentTime = target;
    this.emit("timeupdate", {
      currentTime: target,
      duration: maxDur,
    });
    this.syncPositionState(target, maxDur);
  }

  next(fromAutoEnd = false) {
    if (this.queue.length === 0) return;
    let nextIdx = this.currentIndex + 1;
    if (nextIdx >= this.queue.length) {
      if (this.repeatMode === "all" || !fromAutoEnd) {
        nextIdx = 0;
      } else {
        return;
      }
    }
    this.playIndex(nextIdx);
  }

  prev() {
    if (this.queue.length === 0) return;
    if (this.audio.currentTime > 3) {
      this.seek(0);
      return;
    }
    let prevIdx = this.currentIndex - 1;
    if (prevIdx < 0) {
      prevIdx = this.queue.length - 1;
    }
    this.playIndex(prevIdx);
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    const current = this.getCurrentSong();

    if (this.isShuffle) {
      this.applyShuffle(this.currentIndex);
    } else {
      this.queue = [...this.originalQueue];
      this.currentIndex = this.queue.findIndex((s) => s.id === current?.id);
    }

    this.emit("shufflechange", this.isShuffle);
  }

  applyShuffle(currentIdx) {
    const currentSong = this.queue[currentIdx];
    const rest = this.queue.filter((_, idx) => idx !== currentIdx);

    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    this.queue = currentSong ? [currentSong, ...rest] : rest;
    this.currentIndex = currentSong ? 0 : -1;
  }

  toggleRepeat() {
    if (this.repeatMode === "off") {
      this.repeatMode = "all";
    } else if (this.repeatMode === "all") {
      this.repeatMode = "one";
    } else {
      this.repeatMode = "off";
    }
    this.emit("repeatchange", this.repeatMode);
  }
}

export const audioEngine = new AudioEngine();
