/**
 * Mexlify Android Player - Storage Engine (IndexedDB)
 * Almacenamiento local 100% offline para archivos de audio, carátulas y letras sincronizadas (.lrc)
 */

const DB_NAME = "MexlifyMobileDB";
const DB_VERSION = 1;
const STORE_SONGS = "offline_songs";

class StorageEngine {
  constructor() {
    this.db = null;
    this.blobUrlCache = new Map();
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_SONGS)) {
          const store = db.createObjectStore(STORE_SONGS, { keyPath: "id" });
          store.createIndex("filename", "filename", { unique: false });
          store.createIndex("title", "title", { unique: false });
          store.createIndex("artist", "artist", { unique: false });
          store.createIndex("size", "size", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getAllSongs() {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_SONGS, "readonly");
      const store = tx.objectStore(STORE_SONGS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getSong(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_SONGS, "readonly");
      const store = tx.objectStore(STORE_SONGS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async hasSong(filename, size) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_SONGS, "readonly");
      const store = tx.objectStore(STORE_SONGS);
      const index = store.index("filename");
      const request = index.getAll(filename);

      request.onsuccess = () => {
        const matches = request.result || [];
        if (matches.length === 0) return resolve(false);
        if (!size) return resolve(true);
        // Comparación de tamaño para evitar duplicados exactos
        const isExactMatch = matches.some((m) => Math.abs((m.size || 0) - size) < 100);
        resolve(isExactMatch);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSong(songRecord) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_SONGS, "readwrite");
      const store = tx.objectStore(STORE_SONGS);
      const request = store.put(songRecord);

      request.onsuccess = () => resolve(songRecord.id);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSongLyrics(id, lrcText, hasLyrics = true) {
    await this.init();
    return new Promise(async (resolve, reject) => {
      try {
        const song = await this.getSong(id);
        if (!song) return resolve(false);
        song.lrcText = lrcText;
        song.hasLyrics = hasLyrics;
        await this.saveSong(song);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteSong(id) {
    await this.init();
    this.revokeUrls(id);
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_SONGS, "readwrite");
      const store = tx.objectStore(STORE_SONGS);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  getAudioUrl(song) {
    if (!song || !song.audioBlob) return null;
    const key = `audio_${song.id}`;
    if (this.blobUrlCache.has(key)) {
      return this.blobUrlCache.get(key);
    }
    const url = URL.createObjectURL(song.audioBlob);
    this.blobUrlCache.set(key, url);
    return url;
  }

  getCoverUrl(song) {
    if (!song || !song.coverBlob) return "assets/default_cover.png";
    const key = `cover_${song.id}`;
    if (this.blobUrlCache.has(key)) {
      return this.blobUrlCache.get(key);
    }
    const url = URL.createObjectURL(song.coverBlob);
    this.blobUrlCache.set(key, url);
    return url;
  }

  async getCoverBase64(song) {
    if (!song || !song.coverBlob) return "";
    const key = `cover_b64_${song.id}`;
    if (this.blobUrlCache.has(key)) {
      return this.blobUrlCache.get(key);
    }
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const b64 = typeof reader.result === "string" ? reader.result : "";
          if (b64) this.blobUrlCache.set(key, b64);
          resolve(b64);
        };
        reader.onerror = () => resolve("");
        reader.readAsDataURL(song.coverBlob);
      } catch (_) {
        resolve("");
      }
    });
  }

  revokeUrls(id) {
    const aKey = `audio_${id}`;
    const cKey = `cover_${id}`;
    if (this.blobUrlCache.has(aKey)) {
      URL.revokeObjectURL(this.blobUrlCache.get(aKey));
      this.blobUrlCache.delete(aKey);
    }
    if (this.blobUrlCache.has(cKey)) {
      URL.revokeObjectURL(this.blobUrlCache.get(cKey));
      this.blobUrlCache.delete(cKey);
    }
  }
}

export const storage = new StorageEngine();

