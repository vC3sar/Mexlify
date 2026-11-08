const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Obtiene las direcciones IPv4 de la red local
 */
function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

/**
 * Servidor de sincronización local para conectar Mexlify Desktop con Android
 */
class SyncServer {
  constructor(options = {}) {
    this.port = options.port || 5055;
    this.downloadsDir = options.downloadsDir || "";
    this.metadataDir = options.metadataDir || "";
    this.db = options.db || null;
    this.getDownloadedFn = options.getDownloadedFn || null;
    this.getSongLyricsFn = options.getSongLyricsFn || null;
    this.server = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return Promise.resolve(this.getStatus());

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      this.server.on("error", (err) => {
        console.error("❌ Error en SyncServer:", err.message);
        this.isRunning = false;
        reject(err);
      });

      this.server.listen(this.port, "0.0.0.0", () => {
        this.isRunning = true;
        console.log(`✅ Servidor de Sincronización Mexlify activo en puerto ${this.port}`);
        console.log(`📡 IPs disponibles: ${getLocalIps().join(", ")}`);
        resolve(this.getStatus());
      });
    });
  }

  stop() {
    if (!this.isRunning || !this.server) return Promise.resolve(false);
    return new Promise((resolve) => {
      this.server.close(() => {
        this.isRunning = false;
        this.server = null;
        console.log("🛑 Servidor de Sincronización detenido.");
        resolve(true);
      });
    });
  }

  getStatus() {
    return {
      running: this.isRunning,
      port: this.port,
      ips: getLocalIps(),
      url: getLocalIps().length > 0 ? `http://${getLocalIps()[0]}:${this.port}` : `http://localhost:${this.port}`,
    };
  }

  sendCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range, Authorization");
    res.setHeader("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length");
  }

  async handleRequest(req, res) {
    this.sendCors(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const pathname = parsedUrl.pathname;

      // 1. PING
      if (pathname === "/api/ping") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "ok",
            app: "Mexlify Music",
            version: "1.0.0",
            hostname: os.hostname(),
            ips: getLocalIps(),
          })
        );
        return;
      }

      // 2. LISTA DE CANCIONES (Para deduplicación y selección)
      if (pathname === "/api/songs") {
        let songs = [];
        if (typeof this.getDownloadedFn === "function") {
          songs = await this.getDownloadedFn();
        } else {
          songs = this.getDownloadedFallback();
        }

        // Formatear items con URLs y metadatos de deduplicación
        const formatted = songs.map((s) => {
          const fn = s.Filename || s.filename || "";
          const filePath = path.join(this.downloadsDir, fn);
          let size = 0;
          let mtime = null;
          if (fn && fs.existsSync(filePath)) {
            const st = fs.statSync(filePath);
            size = st.size;
            mtime = st.mtime.toISOString();
          }

          const baseName = fn.replace(/\.mp3$/i, "");
          const coverPath = path.join(this.metadataDir, `${baseName}.jpg`);
          const lrcPath = path.join(this.metadataDir, `${baseName}.lrc`);

          return {
            id: s.id || fn,
            filename: fn,
            title: s.Title || s.title || baseName,
            artist: s.Uploader || s.uploader || "Desconocido",
            duration: s.Duration || s.duration || 0,
            size: size,
            mtime: mtime,
            hasCover: fs.existsSync(coverPath),
            hasLyrics: fs.existsSync(lrcPath),
            coverUrl: `/api/cover/${encodeURIComponent(fn)}`,
            songUrl: `/api/song/${encodeURIComponent(fn)}`,
            lyricsUrl: `/api/lyrics/${encodeURIComponent(fn)}`,
          };
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ total: formatted.length, songs: formatted }));
        return;
      }

      // 3. STREAMING / DESCARGA DE AUDIO MP3
      if (pathname.startsWith("/api/song/")) {
        const rawFilename = decodeURIComponent(pathname.replace("/api/song/", ""));
        const safeFilename = path.basename(rawFilename);
        const filePath = path.join(this.downloadsDir, safeFilename);

        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Archivo de audio no encontrado" }));
          return;
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const file = fs.createReadStream(filePath, { start, end });

          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "audio/mpeg",
          });
          file.pipe(res);
        } else {
          res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "audio/mpeg",
            "Accept-Ranges": "bytes",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}"`,
          });
          fs.createReadStream(filePath).pipe(res);
        }
        return;
      }

      // 4. PORTADA DE ÁLBUM
      if (pathname.startsWith("/api/cover/")) {
        const rawFilename = decodeURIComponent(pathname.replace("/api/cover/", ""));
        const safeFilename = path.basename(rawFilename);
        const baseName = safeFilename.replace(/\.mp3$/i, "");
        const coverPath = path.join(this.metadataDir, `${baseName}.jpg`);

        if (fs.existsSync(coverPath)) {
          res.writeHead(200, {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          });
          fs.createReadStream(coverPath).pipe(res);
          return;
        }

        // Si no existe carátula física local, devolver imagen fallback
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Portada no encontrada" }));
        return;
      }

      // 5. LETRAS SINCRONIZADAS (.LRC / JSON)
      if (pathname.startsWith("/api/lyrics/")) {
        const rawFilename = decodeURIComponent(pathname.replace("/api/lyrics/", ""));
        const safeFilename = path.basename(rawFilename);
        const baseName = safeFilename.replace(/\.mp3$/i, "");
        const lrcPath = path.join(this.metadataDir, `${baseName}.lrc`);

        // A) Si existe archivo .lrc en metadata
        if (fs.existsSync(lrcPath)) {
          const lrcContent = fs.readFileSync(lrcPath, "utf8");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              isSynced: true,
              syncedLyrics: lrcContent,
              source: "file",
            })
          );
          return;
        }

        // B) Si tenemos función getSongLyrics conectada al servicio SQLite/LRCLIB
        if (typeof this.getSongLyricsFn === "function" && this.db) {
          let title = baseName;
          let artist = "";
          if (baseName.includes(" - ")) {
            const parts = baseName.split(" - ");
            artist = parts[0].trim();
            title = parts.slice(1).join(" - ").trim();
          }

          try {
            const lyricsData = await this.getSongLyricsFn(this.db, {
              title: title,
              uploader: artist,
            });

            if (lyricsData && (lyricsData.syncedLyrics || lyricsData.plainLyrics)) {
              // Si devolvió letra sincronizada, guardarla también en disco como .lrc para acelerar futuros syncs
              if (lyricsData.syncedLyrics && !fs.existsSync(lrcPath)) {
                try {
                  fs.writeFileSync(lrcPath, lyricsData.syncedLyrics, "utf8");
                } catch (_) {}
              }

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  isSynced: Boolean(lyricsData.isSynced && lyricsData.syncedLyrics),
                  syncedLyrics: lyricsData.syncedLyrics || null,
                  plainLyrics: lyricsData.plainLyrics || null,
                  source: "lyricsService",
                })
              );
              return;
            }
          } catch (lErr) {
            console.warn("SyncServer lyrics lookup error:", lErr.message);
          }
        }

        // C) Sin letra disponible
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            isSynced: false,
            syncedLyrics: null,
            plainLyrics: null,
            source: "none",
          })
        );
        return;
      }

      // Ruta no encontrada
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint no encontrado" }));
    } catch (err) {
      console.error("❌ Error en SyncServer request:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  getDownloadedFallback() {
    if (!this.downloadsDir || !fs.existsSync(this.downloadsDir)) return [];
    try {
      const files = fs.readdirSync(this.downloadsDir).filter((f) => f.endsWith(".mp3"));
      return files.map((file) => {
        const base = path.basename(file, ".mp3");
        let artist = "N/A";
        let title = base;
        if (base.includes(" - ")) {
          const parts = base.split(" - ");
          artist = parts[0].trim();
          title = parts.slice(1).join(" - ").trim();
        }
        return {
          Filename: file,
          Title: title,
          Uploader: artist,
        };
      });
    } catch (_) {
      return [];
    }
  }
}

module.exports = {
  SyncServer,
  getLocalIps,
};

