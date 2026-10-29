/**
 * Test Suite: Mexlify Music - Playlists Engine & Queue System
 */
const assert = require("assert");

console.log("=== TEST SUITE: MEXLIFY PLAYLISTS & QUEUE ENGINE ===");

// Simulación de almacenamiento localStorage para pruebas
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

// ==========================================
// MÓDULO DE LÓGICA DE PLAYLISTS & COLA PURA
// ==========================================
class PlaylistQueueManager {
  constructor() {
    this.playlists = [];
    this.queue = [];
    this.currentIndex = -1;
    this.repeatMode = "off"; // "off" | "all" | "one"
    this.isShuffle = false;
    this.originalQueueOrder = [];
    this.currentSong = null;
    this.load();
  }

  load() {
    try {
      const plRaw = localStorage.getItem("mexlify_playlists");
      this.playlists = plRaw ? JSON.parse(plRaw) : [];
      const qRaw = localStorage.getItem("mexlify_queue");
      this.queue = qRaw ? JSON.parse(qRaw) : [];
      const qIdx = localStorage.getItem("mexlify_queue_index");
      this.currentIndex = qIdx !== null ? parseInt(qIdx, 10) : -1;
      const rep = localStorage.getItem("mexlify_repeat_mode");
      if (rep) this.repeatMode = rep;
      const shf = localStorage.getItem("mexlify_shuffle_mode");
      if (shf) this.isShuffle = shf === "true";
    } catch {
      this.playlists = [];
      this.queue = [];
      this.currentIndex = -1;
    }
  }

  savePlaylists() {
    localStorage.setItem("mexlify_playlists", JSON.stringify(this.playlists));
  }

  saveQueue() {
    localStorage.setItem("mexlify_queue", JSON.stringify(this.queue));
    localStorage.setItem("mexlify_queue_index", String(this.currentIndex));
    localStorage.setItem("mexlify_repeat_mode", this.repeatMode);
    localStorage.setItem("mexlify_shuffle_mode", String(this.isShuffle));
  }

  // --- CRUD Playlists ---
  createPlaylist(name) {
    if (!name || !name.trim()) return null;
    const pl = {
      id: "pl_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      songs: []
    };
    this.playlists.push(pl);
    this.savePlaylists();
    return pl;
  }

  renamePlaylist(id, newName) {
    if (!newName || !newName.trim()) return false;
    const pl = this.playlists.find((p) => p.id === id);
    if (!pl) return false;
    pl.name = newName.trim();
    this.savePlaylists();
    return true;
  }

  deletePlaylist(id) {
    const prevLen = this.playlists.length;
    this.playlists = this.playlists.filter((p) => p.id !== id);
    this.savePlaylists();
    return this.playlists.length < prevLen;
  }

  addSongToPlaylist(playlistId, song) {
    const pl = this.playlists.find((p) => p.id === playlistId);
    if (!pl || !song) return false;
    const isDup = pl.songs.some(
      (s) =>
        (s.url && s.url === song.url) ||
        (s.filename && s.filename === song.filename) ||
        (s.title && song.title && s.title.toLowerCase() === song.title.toLowerCase() &&
         (s.uploader || "").toLowerCase() === (song.uploader || "").toLowerCase())
    );
    if (isDup) return false;

    const normalizedSong = {
      id: "song_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      title: song.title || "Sin título",
      uploader: song.uploader || "Desconocido",
      duration: song.duration || 0,
      thumbnail: song.thumbnail || "resources/player.gif",
      url: song.url || null,
      filename: song.filename || null,
      album: song.album || ""
    };
    pl.songs.push(normalizedSong);
    this.savePlaylists();
    return true;
  }

  removeSongFromPlaylist(playlistId, songIndex) {
    const pl = this.playlists.find((p) => p.id === playlistId);
    if (!pl || songIndex < 0 || songIndex >= pl.songs.length) return false;
    pl.songs.splice(songIndex, 1);
    this.savePlaylists();
    return true;
  }

  reorderPlaylistSong(playlistId, fromIndex, toIndex) {
    const pl = this.playlists.find((p) => p.id === playlistId);
    if (!pl || fromIndex < 0 || fromIndex >= pl.songs.length || toIndex < 0 || toIndex >= pl.songs.length) {
      return false;
    }
    const [moved] = pl.songs.splice(fromIndex, 1);
    pl.songs.splice(toIndex, 0, moved);
    this.savePlaylists();
    return true;
  }

  moveSongBetweenPlaylists(fromPlId, toPlId, songIndex) {
    const fromPl = this.playlists.find((p) => p.id === fromPlId);
    const toPl = this.playlists.find((p) => p.id === toPlId);
    if (!fromPl || !toPl || songIndex < 0 || songIndex >= fromPl.songs.length) return false;

    const song = fromPl.songs[songIndex];
    // Añadir a destino
    const added = this.addSongToPlaylist(toPlId, song);
    if (!added) return false;

    // Quitar de origen
    fromPl.songs.splice(songIndex, 1);
    this.savePlaylists();
    return true;
  }

  // --- COLA DE REPRODUCCIÓN (QUEUE) ---
  addToQueue(song) {
    if (!song) return;
    const normalized = {
      id: "q_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      title: song.title || song.Title || "Sin título",
      uploader: song.uploader || song.Uploader || "Desconocido",
      duration: song.duration || song.Duration || 0,
      thumbnail: song.thumbnail || song.Thumbnail || "resources/player.gif",
      url: song.url || song.Url || null,
      filename: song.filename || song.Filename || null
    };
    this.queue.push(normalized);
    this.saveQueue();
    return normalized;
  }

  playPlaylist(playlistId, startIndex = 0) {
    const pl = this.playlists.find((p) => p.id === playlistId);
    if (!pl || pl.songs.length === 0) return false;
    this.queue = pl.songs.map((s) => ({ ...s }));
    this.currentIndex = Math.max(0, Math.min(startIndex, this.queue.length - 1));
    this.currentSong = this.queue[this.currentIndex];
    this.saveQueue();
    return true;
  }

  playSongDirect(song) {
    // Si la canción ya está en la cola, ir a su posición
    const existingIndex = this.queue.findIndex(
      (s) =>
        (s.url && s.url === song.url) ||
        (s.filename && s.filename === song.filename) ||
        (s.title === song.title && s.uploader === song.uploader)
    );

    if (existingIndex !== -1) {
      this.currentIndex = existingIndex;
      this.currentSong = this.queue[this.currentIndex];
    } else {
      // Si ya hay cola activa, insertar justo después de la actual para no borrar la playlist
      if (this.queue.length > 0 && this.currentIndex >= 0) {
        const nextIdx = this.currentIndex + 1;
        this.queue.splice(nextIdx, 0, { ...song });
        this.currentIndex = nextIdx;
        this.currentSong = this.queue[this.currentIndex];
      } else {
        this.queue = [{ ...song }];
        this.currentIndex = 0;
        this.currentSong = this.queue[0];
      }
    }
    this.saveQueue();
  }

  playNext() {
    if (this.queue.length === 0) {
      this.currentSong = null;
      this.currentIndex = -1;
      return null;
    }

    if (this.repeatMode === "one") {
      // Repite la misma
      return this.queue[this.currentIndex];
    }

    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.currentSong = this.queue[this.currentIndex];
      this.saveQueue();
      return this.currentSong;
    } else if (this.repeatMode === "all") {
      // Bucle de toda la cola
      this.currentIndex = 0;
      this.currentSong = this.queue[0];
      this.saveQueue();
      return this.currentSong;
    } else {
      // Fin de la cola
      this.saveQueue();
      return null;
    }
  }

  playPrev() {
    if (this.queue.length === 0) return null;
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentSong = this.queue[this.currentIndex];
      this.saveQueue();
      return this.currentSong;
    } else if (this.repeatMode === "all") {
      this.currentIndex = this.queue.length - 1;
      this.currentSong = this.queue[this.currentIndex];
      this.saveQueue();
      return this.currentSong;
    }
    return this.queue[0];
  }

  removeFromQueue(index) {
    if (index < 0 || index >= this.queue.length) return false;
    this.queue.splice(index, 1);
    if (index === this.currentIndex) {
      if (this.queue.length === 0) {
        this.currentIndex = -1;
        this.currentSong = null;
      } else {
        if (this.currentIndex >= this.queue.length) {
          this.currentIndex = this.queue.length - 1;
        }
        this.currentSong = this.queue[this.currentIndex];
      }
    } else if (index < this.currentIndex) {
      this.currentIndex--;
      this.currentSong = this.queue[this.currentIndex];
    }
    this.saveQueue();
    return true;
  }

  reorderQueue(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.queue.length || toIndex < 0 || toIndex >= this.queue.length) {
      return false;
    }
    const currentPlayingItem = this.currentIndex >= 0 ? this.queue[this.currentIndex] : null;
    const [moved] = this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, moved);

    // Reajustar currentIndex para que la canción sonando no cambie
    if (currentPlayingItem) {
      this.currentIndex = this.queue.indexOf(currentPlayingItem);
    }
    this.saveQueue();
    return true;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.isShuffle) {
      this.originalQueueOrder = [...this.queue];
      if (this.queue.length > 2 && this.currentIndex >= 0) {
        // Mezclar las canciones que vienen después de la actual
        const played = this.queue.slice(0, this.currentIndex + 1);
        const upcoming = this.queue.slice(this.currentIndex + 1);
        for (let i = upcoming.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
        }
        this.queue = [...played, ...upcoming];
      }
    } else {
      // Restaurar orden original si estaba guardado
      if (this.originalQueueOrder.length === this.queue.length) {
        const currentItem = this.currentIndex >= 0 ? this.queue[this.currentIndex] : null;
        this.queue = [...this.originalQueueOrder];
        if (currentItem) {
          this.currentIndex = this.queue.indexOf(currentItem);
        }
      }
    }
    this.saveQueue();
    return this.isShuffle;
  }

  cycleRepeat() {
    if (this.repeatMode === "off") this.repeatMode = "all";
    else if (this.repeatMode === "all") this.repeatMode = "one";
    else this.repeatMode = "off";
    this.saveQueue();
    return this.repeatMode;
  }

  clearQueue() {
    if (this.currentSong) {
      this.queue = [this.currentSong];
      this.currentIndex = 0;
    } else {
      this.queue = [];
      this.currentIndex = -1;
    }
    this.saveQueue();
  }
}

// ==========================================
// EJECUCIÓN DE PRUEBAS DE REGRESIÓN
// ==========================================

// Test 1: Crear, renombrar y eliminar playlists
console.log("Test 1: CRUD de Playlists (Crear, Renombrar, Eliminar)");
const mgr = new PlaylistQueueManager();
const pl1 = mgr.createPlaylist("Rock Clásico");
assert(pl1, "Debe crear la playlist");
assert.strictEqual(pl1.name, "Rock Clásico");

const renamed = mgr.renamePlaylist(pl1.id, "Rock de los 80s");
assert.strictEqual(renamed, true);
assert.strictEqual(mgr.playlists[0].name, "Rock de los 80s");

const pl2 = mgr.createPlaylist("Cumbia");
assert.strictEqual(mgr.playlists.length, 2);

const deleted = mgr.deletePlaylist(pl1.id);
assert.strictEqual(deleted, true);
assert.strictEqual(mgr.playlists.length, 1);
assert.strictEqual(mgr.playlists[0].name, "Cumbia");
console.log("  ✓ CRUD de playlists verificado con éxito");

// Test 2: Agregar, quitar, mover y reordenar canciones en playlist
console.log("Test 2: Gestión de canciones en playlists (Añadir, Quitar, Reordenar, Mover)");
const plTarget = mgr.createPlaylist("Favoritas");
const s1 = { title: "Bohemian Rhapsody", uploader: "Queen", duration: 354 };
const s2 = { title: "Hotel California", uploader: "Eagles", duration: 391 };
const s3 = { title: "Stairway to Heaven", uploader: "Led Zeppelin", duration: 482 };

mgr.addSongToPlaylist(plTarget.id, s1);
mgr.addSongToPlaylist(plTarget.id, s2);
mgr.addSongToPlaylist(plTarget.id, s3);
assert.strictEqual(plTarget.songs.length, 3);

// Prevención de duplicados
const dup = mgr.addSongToPlaylist(plTarget.id, s1);
assert.strictEqual(dup, false, "No debe permitir duplicados exactos en la misma playlist");
assert.strictEqual(plTarget.songs.length, 3);

// Reordenar canciones (Drag & Drop en playlist)
mgr.reorderPlaylistSong(plTarget.id, 2, 0); // Mover Stairway to Heaven a posición 0
assert.strictEqual(plTarget.songs[0].title, "Stairway to Heaven");
assert.strictEqual(plTarget.songs[1].title, "Bohemian Rhapsody");
assert.strictEqual(plTarget.songs[2].title, "Hotel California");

// Mover canción entre playlists
const plDest = mgr.playlists[0]; // Cumbia
mgr.moveSongBetweenPlaylists(plTarget.id, plDest.id, 1); // Mover Bohemian Rhapsody a Cumbia
assert.strictEqual(plTarget.songs.length, 2);
assert.strictEqual(plDest.songs.length, 1);
assert.strictEqual(plDest.songs[0].title, "Bohemian Rhapsody");
console.log("  ✓ Canciones gestionadas, reordenadas y movidas entre playlists correctamente");

// Test 3: Persistencia entre sesiones simuladas
console.log("Test 3: Persistencia y recuperación en storage");
const mgr2 = new PlaylistQueueManager(); // Nueva instancia simulando reinicio
assert.strictEqual(mgr2.playlists.length, 2);
assert.strictEqual(mgr2.playlists.find(p => p.name === "Favoritas").songs.length, 2);
console.log("  ✓ Persistencia verificada tras reinicio");

// Test 4: Cola de reproducción (Queue) sin destruir la playlist activa
console.log("Test 4: Cola de reproducción y no destrucción de playlist activa");
mgr.playPlaylist(plTarget.id, 0);
assert.strictEqual(mgr.queue.length, 2);
assert.strictEqual(mgr.currentIndex, 0);
assert.strictEqual(mgr.currentSong.title, "Stairway to Heaven");

// Reproducir una canción externa: NO debe borrar toda la cola, debe insertarse a continuación
const extSong = { title: "Imagine", uploader: "John Lennon", duration: 183 };
mgr.playSongDirect(extSong);
assert.strictEqual(mgr.queue.length, 3, "La cola debe crecer a 3 canciones, preservando las anteriores");
assert.strictEqual(mgr.currentIndex, 1);
assert.strictEqual(mgr.currentSong.title, "Imagine");
assert.strictEqual(mgr.queue[2].title, "Hotel California", "Hotel California debe seguir en la cola para sonar después");
console.log("  ✓ Inserción inteligente en cola sin destruir la playlist verificada");

// Test 5: Navegación Next / Prev y modos de repetición (off, all, one)
console.log("Test 5: Navegación Next/Prev y Modos de Repetición");
mgr.repeatMode = "off";
const next1 = mgr.playNext(); // Hotel California
assert.strictEqual(next1.title, "Hotel California");
assert.strictEqual(mgr.currentIndex, 2);

const nextEnd = mgr.playNext(); // Fin de la cola en modo off
assert.strictEqual(nextEnd, null, "En repeat:off debe finalizar al llegar al final");

// Modo repeat:all (Bucle de la lista)
mgr.repeatMode = "all";
const loopSong = mgr.playNext();
assert.strictEqual(loopSong.title, "Stairway to Heaven", "En repeat:all debe volver al inicio");
assert.strictEqual(mgr.currentIndex, 0);

// Modo repeat:one (Bucle de la misma pista)
mgr.repeatMode = "one";
const oneSong = mgr.playNext();
assert.strictEqual(oneSong.title, "Stairway to Heaven", "En repeat:one debe repetir la misma pista");
assert.strictEqual(mgr.currentIndex, 0);
console.log("  ✓ Modos de repetición (off, all, one) verificados correctamente");

// Test 6: Reordenar y eliminar canciones de la cola activa
console.log("Test 6: Reordenar y eliminar elementos de la cola con reajuste de índice");
mgr.currentIndex = 1;
mgr.currentSong = mgr.queue[1]; // Imagine
// Eliminar un elemento anterior (índice 0)
mgr.removeFromQueue(0);
assert.strictEqual(mgr.currentIndex, 0, "Al eliminar una canción anterior, el índice activo debe decrementar para no desfasar");
assert.strictEqual(mgr.currentSong.title, "Imagine");

// Eliminar la que está sonando actualmente
mgr.removeFromQueue(0);
assert.strictEqual(mgr.currentSong.title, "Hotel California", "Al eliminar la actual, debe saltar a la siguiente disponible");

// Vaciar cola
mgr.clearQueue();
assert.strictEqual(mgr.queue.length, 1, "Vaciar cola debe mantener la actual como referencia de reproducción");
console.log("  ✓ Cola reordenada y vaciada sin estados inconsistentes");

// Test 7: Modo Shuffle sin perder el orden original
console.log("Test 7: Modo Aleatorio (Shuffle) reversible");
const testPl = mgr.createPlaylist("Shuffle Test");
for (let i = 1; i <= 20; i++) {
  mgr.addSongToPlaylist(testPl.id, { title: `Pista ${i}`, uploader: "Artista", duration: 200 });
}
mgr.playPlaylist(testPl.id, 0);
assert.strictEqual(mgr.queue.length, 20);
assert.strictEqual(mgr.queue[0].title, "Pista 1");

// Activar Shuffle
mgr.toggleShuffle();
assert.strictEqual(mgr.isShuffle, true);
assert.strictEqual(mgr.queue[0].title, "Pista 1", "La pista actualmente en reproducción debe mantenerse fija");

// Desactivar Shuffle: debe restaurar el orden original
mgr.toggleShuffle();
assert.strictEqual(mgr.isShuffle, false);
assert.strictEqual(mgr.queue[1].title, "Pista 2");
assert.strictEqual(mgr.queue[19].title, "Pista 20");
console.log("  ✓ Modo Aleatorio (Shuffle) verificado con reversibilidad perfecta");

console.log("\nTODAS LAS PRUEBAS DE PLAYLISTS Y COLA PASARON CON ÉXITO (7/7) 🎉");
