/**
 * Mexlify Android Player - LAN Sync Client
 * Conexión ultrarrápida con Mexlify Desktop (Electron) por red local
 * Deduplicación inteligente: transfiere solo canciones nuevas o modificadas
 */

import { storage } from "./storage.js";
import { fetchSongLyricsFromLRCLIB } from "./lyricsService.js";

export class SyncClient {
  constructor() {
    this.defaultPort = 5055;
    this.isSyncing = false;
  }

  formatBaseUrl(hostOrIp) {
    let clean = (hostOrIp || "").trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `http://${clean}`;
    }
    if (!clean.includes(":", 6)) {
      clean = `${clean}:${this.defaultPort}`;
    }
    return clean.replace(/\/+$/, "");
  }

  async ping(serverAddress) {
    const url = `${this.formatBaseUrl(serverAddress)}/api/ping`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    try {
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      return { success: true, data };
    } catch (err) {
      clearTimeout(timeout);
      return { success: false, error: err.message };
    }
  }

  /**
   * Obtiene la lista remota de la PC y la compara con la local para evitar duplicados
   */
  async checkDifferences(serverAddress) {
    const baseUrl = this.formatBaseUrl(serverAddress);
    const songsUrl = `${baseUrl}/api/songs`;

    const resp = await fetch(songsUrl);
    if (!resp.ok) throw new Error("No se pudo obtener la biblioteca de la PC.");
    const remoteData = await resp.json();
    const remoteSongs = remoteData.songs || [];

    const localSongs = await storage.getAllSongs();
    const localMap = new Map();
    localSongs.forEach((s) => {
      localMap.set((s.filename || "").toLowerCase(), s);
    });

    const toDownload = [];
    const alreadySynced = [];

    for (const remote of remoteSongs) {
      const rFilename = (remote.filename || "").toLowerCase();
      const existing = localMap.get(rFilename);

      if (existing) {
        // Si ya existe y el tamaño coincide aproximadamente, no duplicar
        const sizeDiff = Math.abs((existing.size || 0) - (remote.size || 0));
        if (sizeDiff < 1024) {
          alreadySynced.push(remote);
          continue;
        }
      }

      toDownload.push(remote);
    }

    return {
      totalRemote: remoteSongs.length,
      alreadySyncedCount: alreadySynced.length,
      toDownloadCount: toDownload.length,
      toDownload: toDownload,
      alreadySynced: alreadySynced,
      baseUrl: baseUrl,
    };
  }

  /**
   * Ejecuta la sincronización descargando MP3 + Carátula + Letra y guardándolo en IndexedDB
   */
  async syncTracks(baseUrl, tracksToDownload, onProgress) {
    if (this.isSyncing) throw new Error("Sincronización en curso");
    this.isSyncing = true;

    const total = tracksToDownload.length;
    let completed = 0;
    const errors = [];

    try {
      for (let i = 0; i < total; i++) {
        const track = tracksToDownload[i];
        if (typeof onProgress === "function") {
          onProgress({
            current: i + 1,
            total: total,
            percent: Math.round(((i + 1) / total) * 100),
            trackTitle: track.title || track.filename,
          });
        }

        try {
          // 1. Descargar audio MP3
          const audioUrl = `${baseUrl}${track.songUrl}`;
          const audioResp = await fetch(audioUrl);
          if (!audioResp.ok) throw new Error(`Audio HTTP ${audioResp.status}`);
          const audioBlob = await audioResp.blob();

          // 2. Descargar carátula si existe
          let coverBlob = null;
          if (track.hasCover) {
            try {
              const coverUrl = `${baseUrl}${track.coverUrl}`;
              const coverResp = await fetch(coverUrl);
              if (coverResp.ok) {
                coverBlob = await coverResp.blob();
              }
            } catch (_) {}
          }

          // 3. Descargar letra sincronizada
          let lrcText = null;
          let hasLyrics = false;
          try {
            const lyricsUrl = `${baseUrl}${track.lyricsUrl}`;
            const lyricsResp = await fetch(lyricsUrl);
            if (lyricsResp.ok) {
              const lyricsJson = await lyricsResp.json();
              if (lyricsJson.syncedLyrics) {
                lrcText = lyricsJson.syncedLyrics;
                hasLyrics = true;
              } else if (lyricsJson.plainLyrics) {
                lrcText = lyricsJson.plainLyrics;
                hasLyrics = false;
              }
            }
          } catch (_) {}

          // Fallback: Si no se pudo transferir la letra de PC a Android,
          // usar el mismo método de Electron (LRCLIB) para encontrarla y guardarla en Android
          if (!lrcText) {
            try {
              const onlineLyrics = await fetchSongLyricsFromLRCLIB({
                title: track.title,
                artist: track.artist,
                duration: track.duration,
                album: track.album,
              });
              if (onlineLyrics && onlineLyrics.success) {
                if (onlineLyrics.syncedLyrics) {
                  lrcText = onlineLyrics.syncedLyrics;
                  hasLyrics = true;
                } else if (onlineLyrics.plainLyrics) {
                  lrcText = onlineLyrics.plainLyrics;
                  hasLyrics = false;
                }
              }
            } catch (lyrErr) {
              console.warn(`[SyncClient] Error buscando letra online para ${track.title}:`, lyrErr);
            }
          }

          // 4. Guardar registro completo en almacenamiento offline
          const songRecord = {
            id: track.filename,
            filename: track.filename,
            title: track.title,
            artist: track.artist,
            duration: track.duration,
            size: audioBlob.size,
            mtime: track.mtime || new Date().toISOString(),
            audioBlob: audioBlob,
            coverBlob: coverBlob,
            lrcText: lrcText,
            hasLyrics: hasLyrics,
            syncedAt: new Date().toISOString(),
          };

          await storage.saveSong(songRecord);
          completed++;
        } catch (err) {
          console.error(`Error sincronizando ${track.filename}:`, err);
          errors.push({ track: track.filename, error: err.message });
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return {
      success: true,
      completed,
      total,
      errors,
    };
  }
}

export const syncClient = new SyncClient();

