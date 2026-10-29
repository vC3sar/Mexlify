const DiscordRPC = require("discord-rpc");
const { app, BrowserWindow, ipcMain, shell, session, dialog, protocol, net } = require("electron");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const { spawn } = require("child_process");
const {
  createYtdlpResolver,
  extractVideoId,
} = require("./services/ytdlpResolver");
const { initLyricsTable, getSongLyrics } = require("./services/lyricsService");
// node fetch con required
const fetch = require("node-fetch");
// Solo estos cambios mínimos para mejorar sin romper nada
const isDev = !app.isPackaged; // ✅ Auto-detecta entorno (en lugar de hardcodear)
let debug = isDev; // ✅ Mantener como variable para poder cambiar

function logDebug(...args) {
  if (debug) console.log("[DEBUG]", ...args);
}

/////////////////////
// DISCORD PRESENCE
/////////////////////

const CLIENT_ID = "1417279389858529392"; // ← Cambiar por tu Discord Application ID
let rpc = null;

// ================ FUNCIONES ESENCIALES ================
async function initDiscord() {
  try {
    rpc = new DiscordRPC.Client({ transport: "ipc" });
    await rpc.login({ clientId: CLIENT_ID });
    console.log("✅ Discord RPC conectado.");
    return true;
  } catch (error) {
    console.log("❌ Discord no disponible:", error.message);
    rpc = null;
    return false;
  }
}

let rpcStartTimestamp = null; // timestamp global de inicio

async function updateActivity(details, state, image, resetTime = false) {
  if (!rpc) return;
  let imgurl = image;
  console.log("Imagen recibida:", image); // <-- Nuevo log
  if (
    typeof imgurl === "undefined" ||
    imgurl === null ||
    imgurl === "" ||
    (typeof imgurl === "string" && (imgurl.startsWith("mexlify://") || imgurl.startsWith("file://")))
  ) {
    imgurl = "logo_app_mexlify_center";
  }
  try {
    console.log("Usando imagen:", imgurl); // <-- Nuevo log

    if (resetTime || !rpcStartTimestamp) {
      rpcStartTimestamp = Math.floor(Date.now() / 1000); // inicializamos
    }
    // agregar presencia con denotacion en debug
    details = debug ? `[MODO DESARROLLO] - ${details}` : details;
    await rpc.setActivity({
      details: details,
      state: state,
      startTimestamp: rpcStartTimestamp, // usamos la misma referencia
      largeImageKey: imgurl,
      largeImageText: "Mexlify Music",
      type: 2, // <--- "Listening to"
      buttons: [{ label: "Ver proyecto", url: "https://mexlify.top" }],
    });

    console.log("✅ Rich Presence actualizado:", details, state);
  } catch (error) {
    console.log("❌ Error actualizando Discord:", error.message);
  }
}

// ================ IPC HANDLERS ================
ipcMain.handle(
  "discord-set-activity",
  async (event, details, state, image, resetTime) => {
    await updateActivity(details, state, image, resetTime);
    return true;
  }
);

ipcMain.handle("open-external", async (event, url) => {
  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error("Error al abrir URL externa:", error);
    return false;
  }
});

// ------------------- Paths de binarios (TU CÓDIGO ORIGINAL) -------------------
function getYtdlpPath() {
  if (!isDev) {
    return path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "node_modules",
      "yt-dlp-exec",
      "bin",
      "yt-dlp.exe"
    );
  } else {
    return path.join(
      __dirname,
      "node_modules",
      "yt-dlp-exec",
      "bin",
      "yt-dlp.exe"
    );
  }
}

function getFfmpegPath() {
  if (!isDev) {
    return path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "node_modules",
      "ffmpeg-static",
      "ffmpeg.exe"
    );
  } else {
    return path.join(__dirname, "node_modules", "ffmpeg-static", "ffmpeg.exe");
  }
}

console.dir(isDev);

function checkYtdlpUpdate(win) {
  return new Promise((resolve) => {
    if (!win) {
      logDebug(
        "La ventana no está lista para mostrar mensajes de actualización."
      );
      return resolve();
    }

    logDebug("Verificando version de yt-dlp...");
    win.webContents.send("ytdlp-update-status", {
      message: "Verificando version de yt-dlp...",
      type: "info",
    });

    const ytdlpPath = getYtdlpPath();
    const proc = spawn(ytdlpPath, ["--version"], { windowsHide: true });

    proc.stdout.on("data", (data) => {
      const message = data.toString();
      logDebug(`yt-dlp version: ${message}`);
      win.webContents.send("ytdlp-update-status", {
        message: `yt-dlp version: ${message.trim()}`,
        type: "info",
      });
    });

    proc.stderr.on("data", (data) => {
      const message = data.toString();
      logDebug(`yt-dlp version error: ${message}`);
      win.webContents.send("ytdlp-update-status", { message, type: "error" });
    });

    proc.on("error", (error) => {
      const message = `No se pudo ejecutar yt-dlp: ${error.message}`;
      logDebug(message);
      win.webContents.send("ytdlp-update-status", { message, type: "error" });
      resolve();
    });

    proc.on("close", (code) => {
      logDebug(`yt-dlp version process exited with code ${code}`);
      resolve();
    });
  });
}

// ------------------- Crear ventana (TU CÓDIGO ORIGINAL) -------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false,
      preload: path.join(__dirname, "preload.js"),
      backgroundThrottling: false,
    },
    icon: path.join(__dirname, "logo.png"), // aquí sí acepta PNG en Windows
  });
  win.icon = path.join(__dirname, "logo.png");
  win.webContents.setFrameRate(60);
  win.loadFile("index.html");
  if (debug) win.webContents.openDevTools();
  return win;
}
// ================ INICIALIZACIÓN ================
app.commandLine.appendSwitch("disable-features", "MediaSessionService");
app.commandLine.appendSwitch("disable-features", "PreloadMediaEngagementData");
app.commandLine.appendSwitch(
  "disable-features",
  "UseChromeOSDirectVideoDecoder"
);
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.commandLine.appendSwitch("disable-features", "UseAsyncDns");
app.setName("Mexlify");
app.setAboutPanelOptions({
  applicationName: "Mexlify",
  applicationVersion: "1.0.0",
  copyright: "© 2025 VAEN Systems",
});

// ⚠️ DEBE ir antes de app.whenReady()
// Registra mexlify:// como protocolo seguro para cargar archivos locales de AppData
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'mexlify',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
    },
  },
]);

// ==================== SQLite DATABASE SYSTEM ====================
let db = null;

function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "mexlify.db");
  logDebug("Inicializando base de datos SQLite en:", dbPath);
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("❌ Error al abrir la base de datos:", err.message);
      return;
    }
    logDebug("✅ Conectado a la base de datos SQLite.");
    
    // Crear tabla de reproducciones
    db.run(
      `CREATE TABLE IF NOT EXISTS play_counts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        uploader TEXT,
        thumbnail TEXT,
        duration INTEGER,
        url TEXT,
        filename TEXT,
        count INTEGER DEFAULT 1
      )`,
      (err2) => {
        if (err2) {
          console.error("❌ Error al crear la tabla play_counts:", err2.message);
        } else {
          logDebug("✅ Tabla play_counts verificada/creada.");
        }
        // Inicializar tabla de caché de letras
        initLyricsTable(db);
      }
    );
  });
}

// Handlers de base de datos
ipcMain.handle("incrementPlayCount", async (event, song) => {
  if (!song || !song.title) return false;
  
  const key = (song.title + "||" + (song.uploader || "")).toLowerCase();
  logDebug("Incrementando reproducción de:", song.title, "ID:", key);
  
  return new Promise((resolve) => {
    if (!db) {
      console.error("Base de datos no inicializada");
      return resolve(false);
    }
    
    const query = `
      INSERT INTO play_counts (id, title, uploader, thumbnail, duration, url, filename, count)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET 
        count = count + 1,
        thumbnail = COALESCE(excluded.thumbnail, thumbnail),
        url = COALESCE(excluded.url, url),
        filename = COALESCE(excluded.filename, filename)
    `;
    
    const params = [
      key,
      song.title,
      song.uploader || "",
      song.thumbnail || "",
      song.duration || 0,
      song.url || "",
      song.filename || ""
    ];
    
    db.run(query, params, function (err) {
      if (err) {
        console.error("❌ Error al incrementar play count en SQLite:", err.message);
        resolve(false);
      } else {
        logDebug(`✅ Play count actualizado para "${song.title}". Filas afectadas:`, this.changes);
        resolve(true);
      }
    });
  });
});

ipcMain.handle("getMostPlayedSongs", async () => {
  return new Promise((resolve) => {
    if (!db) {
      console.error("Base de datos no inicializada");
      return resolve([]);
    }
    
    const query = `
      SELECT title, uploader, thumbnail, duration, url, filename, count 
      FROM play_counts 
      ORDER BY count DESC 
      LIMIT 50
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener canciones más escuchadas de SQLite:", err.message);
        resolve([]);
      } else {
        const formattedRows = rows.map(row => ({
          title: row.title,
          uploader: row.uploader,
          thumbnail: row.thumbnail,
          duration: row.duration,
          url: row.url || null,
          filename: row.filename || null,
          playCount: row.count
        }));
        resolve(formattedRows);
      }
    });
  });
});

app.whenReady().then(() => {
  initDatabase();
  // Copiar cookies.txt a la carpeta userData para el proceso secundario de yt-dlp
  const cookiesSrcPath = path.join(__dirname, "cookies.txt");
  const cookiesDestPath = path.join(app.getPath("userData"), "cookies.txt");
  try {
    if (fs.existsSync(cookiesSrcPath)) {
      const destDir = path.dirname(cookiesDestPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(cookiesSrcPath, cookiesDestPath);
      logDebug(`[cookies] cookies.txt copiado a: ${cookiesDestPath}`);
    } else {
      logDebug(`[cookies] cookies.txt no encontrado en origen: ${cookiesSrcPath}`);
    }
  } catch (err) {
    console.error("❌ [cookies] Error al copiar cookies.txt:", err);
  }

  // Interceptar cabeceras salientes a googlevideo.com para evitar el error 403 Forbidden
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ["*://*.googlevideo.com/*"] },
    (details, callback) => {
      delete details.requestHeaders["Origin"];
      delete details.requestHeaders["Referer"];
      details.requestHeaders["User-Agent"] =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
      callback({ requestHeaders: details.requestHeaders });
    }
  );

  const win = createWindow();
  checkYtdlpUpdate(win);

  // Registrar protocolo mexlify:// para servir imágenes locales sin bloqueo CSP
  protocol.handle('mexlify', async (request) => {
    try {
      let rawPath = decodeURIComponent(request.url.slice('mexlify://'.length));
      // Fix Chromium converting C:/ into host c/ (e.g. mexlify://c/Users/...)
      rawPath = rawPath.replace(/^\/?([a-zA-Z])\//, (match, drive) => `${drive.toUpperCase()}:/`);
      
      const filePath = path.normalize(rawPath);
      if (!fs.existsSync(filePath)) {
        return new Response('File not found', { status: 404 });
      }
      return await net.fetch('file:///' + filePath.replace(/\\/g, '/'));
    } catch (err) {
      logDebug("Error en protocolo mexlify://", err);
      return new Response('File not found', { status: 404 });
    }
  });

  setTimeout(async () => {
    await initDiscord();
    await updateActivity("En hub", "Esperando canción...");
  }, 2000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ------------------- Cache -------------------
const itunesCache = new Map();
const ytdlpCache = new Map();

const cookiesDestPath = path.join(app.getPath("userData"), "cookies.txt");

const resolverCacheFile = path.join(
  app.getPath("userData"),
  "cache",
  "resolver-cache.json"
);

const ytdlpResolver = createYtdlpResolver({
  getYtdlpPath,
  cacheFile: resolverCacheFile,
  cookiesFile: cookiesDestPath,
  concurrency: 2,
  timeoutMs: 35000,
  logger: logDebug,
});

// ------------------- Utilidades (TU CÃ"DIGO ORIGINAL EXACTO) -------------------
function normalize(query) {
  return query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ------------------- FunciÃ³n helper para ejecutar yt-dlp (TU CÃ"DIGO ORIGINAL) -------------------
function execYtdlp(args = []) {
  return new Promise((resolve, reject) => {
    const ytdlpPath = getYtdlpPath();
    const finalArgs = [...args];
    const cookiesDestPath = path.join(app.getPath("userData"), "cookies.txt");
    if (fs.existsSync(cookiesDestPath) && !args.includes("--cookies")) {
      finalArgs.push("--cookies", cookiesDestPath);
    }
    const proc = spawn(ytdlpPath, finalArgs, { stdio: ["pipe", "pipe", "pipe"] });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => (stdout += data.toString()));
    proc.stderr.on("data", (data) => (stderr += data.toString()));

    proc.on("close", (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout));
        } catch (err) {
          reject(new Error("Error parsing JSON: " + err.message));
        }
      } else {
        reject(new Error(stderr || `yt-dlp exited with code ${code}`));
      }
    });
  });
}

function execYtdlpDownload(args = []) {
  return new Promise((resolve, reject) => {
    const ytdlpPath = getYtdlpPath();
    const finalArgs = [...args];
    const cookiesDestPath = path.join(app.getPath("userData"), "cookies.txt");
    if (fs.existsSync(cookiesDestPath) && !args.includes("--cookies")) {
      finalArgs.push("--cookies", cookiesDestPath);
    }
    const proc = spawn(ytdlpPath, finalArgs, { stdio: ["pipe", "pipe", "pipe"] });

    let stderr = "";

    proc.stderr.on("data", (data) => (stderr += data.toString()));

    proc.on("close", (code) => {
      if (code === 0) {
        // Éxito, simplemente resolvemos sin JSON
        resolve(true);
      } else {
        // Si falla por el formato volver a intentarlo de otra manera
        const newArgs = args.map((arg) =>
          arg === "-f" ? "-f bestaudio" : arg
        );
        if (newArgs.toString() !== args.toString()) {
          console.log("Reintentando descarga con otros parámetros...");
          execYtdlpDownload(newArgs).then(resolve).catch(reject);
        } else {
          reject(new Error(stderr || `yt-dlp exited with code ${code}`));
        }
      }
    });
  });
}

async function validateURL(url) {
  try {
    await execYtdlp([url, "--dump-single-json", "--quiet", "--no-warnings"]);
    return true;
  } catch (err) {
    console.error("URL inválida:", err.message);
    return false;
  }
}

async function getCorrectSongName(query) {
  // Consultar iTunes API para obtener resultados
  try {
    // Realizamos la búsqueda en iTunes
    const resp = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&entity=musicTrack&limit=5`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    if (!resp.ok) {
      // Si la respuesta no es correcta, devolvemos la consulta original
      return {
        corrected: query,
        cover: null,
        genre: null,
        source: "fallback",
      };
    }

    // Parseamos la respuesta de la API
    const data = await resp.json();

    if (data.results?.length > 0) {
      // Mapeamos los resultados para obtener el nombre corregido, portada y género
      const tracks = data.results.map((track) => ({
        corrected: `${track.trackName} ${track.artistName}`,
        cover: track.artworkUrl100?.replace("100x100bb.jpg", "500x500bb.jpg"), // Usamos una imagen más grande
        genre: track.primaryGenreName || null,
      }));
      // Retornamos los resultados procesados
      return tracks;
    } else {
      // Si no encontramos resultados, devolvemos la consulta original
      return { corrected: query, cover: null };
    }
  } catch (err) {
    // Manejo de errores
    console.error("Error consultando la API de iTunes:", err);
  }

  // Si ocurre algún error en la consulta, devolvemos la consulta original
  return { corrected: query, cover: null };
}

// NEW CODEEEEEEEEEEEEEEEEEEEEE
const { search } = require("youtube-sr").default;
// ------------------- IPC Handlers (TU CÓDIGO ORIGINAL EXACTO) -------------------
// ✨ BÚSQUEDA ULTRA-OPTIMIZADA CON YOUTUBE-SR
ipcMain.handle("searchSong", async (event, query) => {
  console.time("searchSong");
  logDebug("Buscando:", query);

  const limit = 5;
  const normalizedQuery = normalize(query);

  try {
    const cachedResults = ytdlpResolver.getCachedSearchResults(normalizedQuery);
    if (cachedResults?.length) {
      console.timeEnd("searchSong");
      return cachedResults;
    }

    // 1️⃣ Obtener metadatos de iTunes (para cover y género de alta calidad)
    let corrected = normalizedQuery;
    let itunesCover = null;
    let genre = null;

    try {
      // Llamar a la función correctamente
      const result = corrected; //await getCorrectSongName(normalizedQuery);

      // Verificar si hay resultados válidos
      if (result && Array.isArray(result) && result.length > 0) {
        corrected = result[0].corrected || normalizedQuery;
        itunesCover = result[0].cover || null;
        genre = result[0].genre || null;
      } else if (result && result.corrected) {
        // Si result es un objeto simple
        corrected = result.corrected || normalizedQuery;
        itunesCover = result.cover || null;
        genre = result.genre || null;
      }
    } catch (error) {
      console.error("Error al obtener datos de iTunes:", error);
    }

    logDebug("Búsqueda corregida:", corrected);
    logDebug("iTunes Cover:", itunesCover);
    logDebug("Genre:", genre);

    // 2️⃣ Búsqueda con youtube-sr (ULTRA RÁPIDO - reemplaza yt-dlp)
    const searchResults = await search(corrected, {
      limit: limit,
      type: "video",
      safeSearch: false,
    });

    if (!searchResults || searchResults.length === 0) {
      logDebug("⚠️ No se encontraron resultados");
      console.timeEnd("searchSong");
      return [];
    }

    // 3️⃣ Mapear resultados directamente (sin requests adicionales)
    const detailedResults = searchResults.map((video) => {
      // Priorizar cover de iTunes, luego thumbnail de YouTube en máxima calidad
      const thumbnail =
        itunesCover ||
        video.thumbnail?.url?.replace(/hqdefault\.jpg$/, "maxresdefault.jpg") ||
        video.thumbnail?.url ||
        null;

      return {
        videoId: video.id || extractVideoId(video.url),
        title: video.title,
        url: video.url,
        sourceUrl: video.url,
        duration: Math.floor(video.duration / 1000), // Convertir ms a segundos
        uploader: video.channel?.name || "Desconocido",
        artist: video.channel?.name || "Desconocido",
        thumbnail,
        genre,
      };
    });

    // 4️⃣ Filtrar canciones muy cortas (menos de 50 segundos)
    const filteredResults = detailedResults.filter(
      (song) => song.duration >= 50
    );

    console.timeEnd("searchSong");
    logDebug(`✅ Encontradas ${filteredResults.length} canciones válidas`);
    console.log("filteredResults:", filteredResults);

    const cached = ytdlpResolver.rememberSearchResults(
      normalizedQuery,
      filteredResults
    );

    return cached;
  } catch (err) {
    logDebug("❌ Error searchSong:", err);
    console.timeEnd("searchSong");
    return [];
  }
});

// ------------------- Descargas (TU CÓDIGO ORIGINAL EXACTO) -------------------
// Carpeta de descargas "segura" fuera de ASAR
const downloadsDir = path.join(app.getPath("userData"), "downloads");

// Asegurarse de que exista la carpeta y el archivo de metadata
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Carpeta para metadata independiente
const metadataDir = path.join(downloadsDir, "metadata");
if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir, { recursive: true });

function safeParseDate(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseMetadataFile(content) {
  const result = {};
  content.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) result[key] = value;
  });
  return result;
}

function resolveDownloadTimestamp(metadata, metadataPath, filePath) {
  const candidates = [
    metadata.DownloadedAt,
    metadata.downloadedAt,
    metadata.CreatedAt,
    metadata.createdAt,
    metadata.SavedAt,
    metadata.savedAt,
  ];

  for (const value of candidates) {
    const parsed = safeParseDate(value);
    if (parsed) return parsed;
  }

  try {
    if (metadataPath && fs.existsSync(metadataPath)) {
      const stat = fs.statSync(metadataPath);
      if (stat?.mtimeMs) return stat.mtimeMs;
    }
  } catch {}

  try {
    if (filePath && fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat?.mtimeMs) return stat.mtimeMs;
    }
  } catch {}

  return null;
}

function embedCoverAndMetadata(mp3Path, coverPath, metadataObj = {}, outPath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(mp3Path)) return resolve(false);
    const hasCover = coverPath && fs.existsSync(coverPath);

    const args = ["-y", "-i", mp3Path];
    if (hasCover) {
      args.push("-i", coverPath);
      args.push("-map", "0:a", "-map", "1:v");
      args.push("-c:a", "copy", "-c:v", "mjpeg");
      args.push("-id3v2_version", "3");
      args.push("-metadata:s:v", "title=Album cover", "-metadata:s:v", "comment=Cover (front)");
    } else {
      args.push("-c:a", "copy");
      args.push("-id3v2_version", "3");
    }

    if (metadataObj.title && metadataObj.title !== "N/A") {
      args.push("-metadata", "title=" + metadataObj.title);
    }
    if (metadataObj.artist && metadataObj.artist !== "N/A") {
      args.push("-metadata", "artist=" + metadataObj.artist);
    }

    args.push(outPath);

    const proc = spawn(getFfmpegPath(), args, { windowsHide: true });
    proc.on("close", (code) => {
      resolve(code === 0);
    });
    proc.on("error", (err) => {
      console.error("Error al incrustar carátula en MP3:", err);
      resolve(false);
    });
  });
}

ipcMain.handle("downloadSong", async (event, song) => {
  try {
    // Validar datos
    if (!song?.url || !song?.title) {
      throw new Error("Datos de la canción inválidos");
    }

    // Nombre seguro del archivo
    const safeTitle = song.title.replace(/[<>:"/\\|?*]+/g, "_");
    const outputPath = path.join(downloadsDir, `${safeTitle}.mp3`);
    const metadataFile = path.join(metadataDir, `${safeTitle}.txt`);

    // Si ya existe, retornar
    if (fs.existsSync(outputPath)) {
      return { success: true, path: outputPath, alreadyExists: true };
    }

    // Validar URL
    const isValid = await validateURL(song.url);
    if (!isValid) throw new Error("URL inválida o inaccesible");
    console.log(song);
    // Ejecutar yt-dlp para descargar audio
    await execYtdlpDownload([
      song.url,
      "-o",
      outputPath,
      "-f",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--quiet",
      "--no-warnings",
      "--ffmpeg-location",
      getFfmpegPath(),
    ]);

    // Verificar descarga
    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      throw new Error("Descarga incompleta: archivo vacío");
    }

    // Guardar metadata de manera segura
    const downloadedAt = new Date().toISOString();
    
    // Descargar miniatura para disponibilidad offline
    let localThumbnail = song.thumbnail || "N/A";
    let downloadedImgPath = null;
    if (song.thumbnail && song.thumbnail.startsWith("http")) {
      try {
        downloadedImgPath = path.join(metadataDir, `${safeTitle}.jpg`);
        const response = await fetch(song.thumbnail);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          fs.writeFileSync(downloadedImgPath, Buffer.from(buffer));
          // Usar protocolo mexlify:// en lugar de file:// para evitar bloqueo CSP
          localThumbnail = 'mexlify:///' + downloadedImgPath.replace(/\\/g, '/');
        }
      } catch (e) {
        console.error("Error al descargar thumbnail:", e);
      }
    }

    // Incrustar la carátula y metadatos ID3v2 directamente dentro del archivo MP3
    if (downloadedImgPath && fs.existsSync(downloadedImgPath)) {
      try {
        const tempTaggedPath = path.join(downloadsDir, `temp_${Date.now()}_${safeTitle}.mp3`);
        const embedOk = await embedCoverAndMetadata(outputPath, downloadedImgPath, {
          title: song.title,
          artist: song.uploader || ""
        }, tempTaggedPath);
        if (embedOk && fs.existsSync(tempTaggedPath)) {
          fs.unlinkSync(outputPath);
          fs.renameSync(tempTaggedPath, outputPath);
          logDebug("Carátula y metadatos incrustados exitosamente en:", safeTitle);
        }
      } catch (embErr) {
        console.error("Error al incrustar carátula en MP3:", embErr);
      }
    }

    const metadata = [
      `Title: ${song.title}`,
      `Uploader: ${song.uploader || "N/A"}`,
      `Duration: ${song.duration || "N/A"}`,
      `Filename: ${safeTitle}.mp3`,
      `Thumbnail: ${localThumbnail}`,
      `DownloadedAt: ${downloadedAt}`,
      `CreatedAt: ${downloadedAt}`,
      `SavedAt: ${downloadedAt}`,
    ].join("\n");

    fs.writeFileSync(metadataFile, metadata, "utf-8");

    return { success: true, path: outputPath };
  } catch (err) {
    console.error("downloadSong error:", err);
    return { success: false, error: err.message };
  }
});
ipcMain.handle("deleteDownload", async (event, filename) => {
  try {
    if (!filename || typeof filename !== "string") {
      throw new Error("Nombre de archivo inválido");
    }
    const safeFilename = filename.replace(/[<>:"/\\|?*]+/g, "_");
    const filePath = path.join(downloadsDir, safeFilename);
    const metadataFile = path.join(
      metadataDir,
      safeFilename.replace(/\.mp3$/, ".txt")
    );

    // Eliminar archivos
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(metadataFile)) fs.unlinkSync(metadataFile);

    return { success: true };
  } catch (err) {
    console.error("deleteSong error:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle("getDownloaded", async () => {
  try {
    const metadataDir = path.join(downloadsDir, "metadata");
    if (!fs.existsSync(metadataDir)) return [];

    const files = fs.readdirSync(metadataDir).filter((f) => f.endsWith(".txt"));
    const downloaded = files.map((file) => {
      const metadataPath = path.join(metadataDir, file);
      const content = fs.readFileSync(metadataPath, "utf-8");
      const obj = parseMetadataFile(content);
      const fileName = obj.Filename || file.replace(/\.txt$/, ".mp3");
      const filePath = path.join(downloadsDir, fileName);
      const downloadedAtMs = resolveDownloadTimestamp(
        obj,
        metadataPath,
        filePath
      );

      return {
        ...obj,
        downloadedAt: obj.DownloadedAt || obj.downloadedAt || null,
        createdAt: obj.CreatedAt || obj.createdAt || null,
        savedAt: obj.SavedAt || obj.savedAt || null,
        fileMtime:
          filePath && fs.existsSync(filePath)
            ? new Date(fs.statSync(filePath).mtimeMs).toISOString()
            : null,
        downloadedAtMs,
      };
    });

    // También incluir cualquier mp3 en downloads que no tenga archivo .txt
    const allMp3s = fs.readdirSync(downloadsDir).filter((f) => f.endsWith(".mp3"));
    const knownMp3s = new Set(downloaded.map((d) => d.Filename || d.filename));
    for (const mp3 of allMp3s) {
      if (!knownMp3s.has(mp3)) {
        const base = path.basename(mp3, ".mp3");
        let artist = "N/A";
        let title = base;
        if (base.includes(" - ")) {
          const parts = base.split(" - ");
          artist = parts[0].trim();
          title = parts.slice(1).join(" - ").trim();
        }
        const filePath = path.join(downloadsDir, mp3);
        const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
        downloaded.push({
          Title: title,
          Uploader: artist,
          Filename: mp3,
          Thumbnail: "resources/player.gif",
          Duration: "0",
          downloadedAt: stat ? new Date(stat.mtimeMs).toISOString() : null,
          downloadedAtMs: stat ? stat.mtimeMs : Date.now(),
        });
      }
    }

    downloaded.sort((a, b) => {
      const aTime = a.downloadedAtMs;
      const bTime = b.downloadedAtMs;
      if (aTime == null && bTime == null) return 0;
      if (aTime == null) return 1;
      if (bTime == null) return -1;
      return bTime - aTime;
    });

    console.log(`Se encontraron ${downloaded.length} canciones descargadas.`);
    return downloaded;
  } catch (err) {
    console.error("getDownloaded error:", err);
    return [];
  }
});



ipcMain.handle("streamSong", async (event, song) => {
  if (!song?.url && !song?.filename) throw new Error("Objeto inválido");
  console.log("streamSong recibido:", song);
  if (song.filename) {
    const filePath = path.join(downloadsDir, song.filename);
    if (!fs.existsSync(filePath)) throw new Error("Archivo no encontrado");
    return `file://${filePath}`;
  }

  return ytdlpResolver.resolveTrack(song);
});

ipcMain.handle("prewarmSongs", async (event, songs, limit = 3) => {
  return ytdlpResolver.prewarmTracks(songs, limit);
});

ipcMain.handle("ytdlp-diagnostics", async () => {
  const version = await ytdlpResolver.getVersion();
  return {
    version,
    resolver: ytdlpResolver.stats(),
  };
});

ipcMain.handle("ytdlp-update-nightly", async () => {
  return new Promise((resolve) => {
    const win = BrowserWindow.getAllWindows()[0];
    const proc = spawn(getYtdlpPath(), ["--update-to", "nightly"], {
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      const message = data.toString();
      stdout += message;
      win?.webContents.send("ytdlp-update-status", {
        message,
        type: "info",
      });
    });

    proc.stderr.on("data", (data) => {
      const message = data.toString();
      stderr += message;
      win?.webContents.send("ytdlp-update-status", {
        message,
        type: "error",
      });
    });

    proc.on("error", (error) => {
      resolve({ success: false, error: error.message });
    });

    proc.on("close", (code) => {
      resolve({
        success: code === 0,
        output: stdout.trim(),
        error: code === 0 ? null : stderr.trim() || `yt-dlp exited ${code}`,
      });
    });
  });
});

ipcMain.handle("set-debug", async (event, value) => {
  debug = value;
  logDebug("Debug cambiado a", debug);
  return true;
});

ipcMain.handle("debug-log", async (event, msg) => {
  logDebug(msg);
  return true;
});

ipcMain.handle("get-app-path", async (event, filename) => {
  if (filename) {
    return path.join(downloadsDir, filename); // C:\...\downloads\song.mp3
  }
  return downloadsDir; // solo la carpeta
});

ipcMain.handle("exportDownloadsToZip", async (event, selectedFilenames) => {
  const win = BrowserWindow.getFocusedWindow();
  
  if (!fs.existsSync(downloadsDir)) {
    return { success: false, error: "No tienes canciones descargadas para exportar." };
  }
  let files = fs.readdirSync(downloadsDir).filter((f) => f.endsWith(".mp3"));
  if (files.length === 0) {
    return { success: false, error: "No tienes canciones descargadas para exportar." };
  }

  // Filtrar solo las canciones seleccionadas por el usuario si se proporcionan
  if (Array.isArray(selectedFilenames) && selectedFilenames.length > 0) {
    const selectedSet = new Set(selectedFilenames);
    files = files.filter((f) => selectedSet.has(f));
    if (files.length === 0) {
      return { success: false, error: "Ninguna de las canciones seleccionadas está disponible." };
    }
  }

  const { filePath } = await dialog.showSaveDialog(win, {
    title: "Exportar música fuera de línea",
    defaultPath: path.join(app.getPath("desktop"), "mexlify-musica-offline.zip"),
    filters: [
      { name: "Archivo ZIP", extensions: ["zip"] }
    ]
  });

  if (!filePath) {
    return { success: false, error: "Operación cancelada por el usuario" };
  }

  try {
    const AdmZip = require("adm-zip");
    const zip = new AdmZip();
    const tempFilesToClean = [];
    const successfullyExportedTracks = [];
    const totalFiles = files.length;
    let processedIndex = 0;

    logDebug(`Iniciando exportación de ${totalFiles} canciones con carátulas ID3...`);

    for (const file of files) {
      processedIndex++;
      const baseName = path.basename(file, ".mp3");
      const mp3Path = path.join(downloadsDir, file);
      const coverPath = path.join(metadataDir, `${baseName}.jpg`);
      const txtPath = path.join(metadataDir, `${baseName}.txt`);

      let parsedMeta = {};
      let meta = { title: baseName, artist: "", album: "", duration: 0 };
      if (fs.existsSync(txtPath)) {
        try {
          const metaContent = fs.readFileSync(txtPath, "utf-8");
          parsedMeta = parseMetadataFile(metaContent);
          if (parsedMeta.Title && parsedMeta.Title !== "N/A") meta.title = parsedMeta.Title;
          if (parsedMeta.Uploader && parsedMeta.Uploader !== "N/A") meta.artist = parsedMeta.Uploader;
          if (parsedMeta.Album && parsedMeta.Album !== "N/A") meta.album = parsedMeta.Album;
          if (parsedMeta.Duration && parsedMeta.Duration !== "N/A") meta.duration = parseInt(parsedMeta.Duration, 10) || 0;
        } catch {}
      }

      // Si no hay archivo txt, deducir Artista y Título del nombre si contiene ' - '
      if (!meta.artist && baseName.includes(' - ')) {
        const parts = baseName.split(' - ');
        meta.artist = parts[0].trim();
        meta.title = parts.slice(1).join(' - ').trim();
      }

      const songDisplayName = meta.artist ? `${meta.title} — ${meta.artist}` : meta.title;
      const progressPercent = Math.min(95, Math.round((processedIndex / (totalFiles + 1)) * 100));

      if (win && !win.isDestroyed()) {
        win.webContents.send("export-progress", {
          current: processedIndex,
          total: totalFiles,
          songTitle: songDisplayName,
          percent: progressPercent,
          phase: "embedding"
        });
      }

      let addedToZip = false;

      // Si existe carátula en metadata/, usarla; si no, usar logo.png como fallback elegante
      const defaultLogo = path.join(__dirname, 'logo.png');
      const finalCoverPath = fs.existsSync(coverPath)
        ? coverPath
        : (fs.existsSync(defaultLogo) ? defaultLogo : null);

      if (finalCoverPath) {
        const tempTaggedPath = path.join(downloadsDir, `export_temp_${Date.now()}_${baseName}.mp3`);
        const taggedOk = await embedCoverAndMetadata(mp3Path, finalCoverPath, meta, tempTaggedPath);
        if (taggedOk && fs.existsSync(tempTaggedPath)) {
          zip.addLocalFile(tempTaggedPath, "", `${baseName}.mp3`);
          addedToZip = true;
          // Si el archivo local no estaba ocupado, actualizarlo para que ya tenga carátula incrustada
          try {
            fs.unlinkSync(mp3Path);
            fs.renameSync(tempTaggedPath, mp3Path);
          } catch {
            tempFilesToClean.push(tempTaggedPath);
          }
        }
      }

      // Fallback si no hay carátula o si falló el empaquetado
      if (!addedToZip && fs.existsSync(mp3Path)) {
        zip.addLocalFile(mp3Path, "", `${baseName}.mp3`);
        addedToZip = true;
      }

      if (addedToZip) {
        // Extraer identificador de la fuente (Spotify, YouTube, local)
        let trackSource = "mexlify";
        let trackId = `mexlify:local:${baseName}`;
        if (parsedMeta.SpotifyUri && parsedMeta.SpotifyUri.startsWith("spotify:track:")) {
          trackSource = "spotify";
          trackId = parsedMeta.SpotifyUri;
        } else if (parsedMeta.VideoId && parsedMeta.VideoId !== "N/A") {
          trackSource = "youtube";
          trackId = `youtube:${parsedMeta.VideoId}`;
        } else if (parsedMeta.Url && parsedMeta.Url !== "N/A") {
          const ytMatch = parsedMeta.Url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{11})/);
          if (ytMatch) {
            trackSource = "youtube";
            trackId = `youtube:${ytMatch[1]}`;
          }
        }

        const artistList = meta.artist
          ? meta.artist.split(/,\s*|\s*&\s*|\s*ft\.\s*|\s*feat\.\s*/i).map(a => a.trim()).filter(Boolean)
          : ["Desconocido"];

        successfullyExportedTracks.push({
          id: trackId,
          source: trackSource,
          title: meta.title,
          artists: artistList.length > 0 ? artistList : [meta.artist || "Desconocido"],
          album: meta.album || undefined,
          durationMs: meta.duration ? meta.duration * 1000 : undefined,
          filename: file
        });
      }
    }

    if (win && !win.isDestroyed()) {
      win.webContents.send("export-progress", {
        current: totalFiles,
        total: totalFiles,
        songTitle: "Comprimiendo archivo ZIP...",
        percent: 98,
        phase: "zipping"
      });
    }

    // Escribir archivo ZIP
    zip.writeZip(filePath);

    // Limpiar archivos temporales generados
    for (const tempFile of tempFilesToClean) {
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {}
    }

    if (win && !win.isDestroyed()) {
      win.webContents.send("export-progress", {
        current: totalFiles,
        total: totalFiles,
        songTitle: "¡Exportación finalizada con éxito!",
        percent: 100,
        phase: "done"
      });
    }

    logDebug("Exportación a ZIP completada con éxito en:", filePath);
    return {
      success: true,
      path: filePath,
      exportedTracks: successfullyExportedTracks,
      totalExported: successfullyExportedTracks.length
    };
  } catch (err) {
    console.error("Error al exportar ZIP:", err);
    return { success: false, error: err.message };
  }
});

// Guardar archivo .mexref (Mexlify References)
ipcMain.handle("save-mexref-file", async (event, payload) => {
  const win = BrowserWindow.getFocusedWindow();
  const defaultName = (payload && payload.defaultName) ? payload.defaultName : "mexlify-export";
  const content = payload ? payload.content : {};

  const { filePath } = await dialog.showSaveDialog(win, {
    title: "Guardar referencias Mexlify (.mexref)",
    defaultPath: path.join(app.getPath("desktop"), `${defaultName}.mexref`),
    filters: [
      { name: "Mexlify References (*.mexref)", extensions: ["mexref"] }
    ]
  });

  if (!filePath) {
    return { success: false, cancelled: true };
  }

  try {
    const jsonStr = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    fs.writeFileSync(filePath, jsonStr, "utf-8");
    return { success: true, path: filePath };
  } catch (err) {
    console.error("Error al guardar archivo .mexref:", err);
    return { success: false, error: err.message };
  }
});

// Leer archivos .mexref para importación y exclusión
ipcMain.handle("read-mexref-files", async (event) => {
  const win = BrowserWindow.getFocusedWindow();
  const { filePaths, canceled } = await dialog.showOpenDialog(win, {
    title: "Seleccionar archivos de referencias (.mexref)",
    properties: ["openFile", "multiSelections"],
    filters: [
      { name: "Mexlify References (*.mexref)", extensions: ["mexref"] }
    ]
  });

  if (canceled || !filePaths || filePaths.length === 0) {
    return { success: false, cancelled: true };
  }

  try {
    const results = [];
    for (const fp of filePaths) {
      const raw = fs.readFileSync(fp, "utf-8");
      results.push({
        filePath: fp,
        fileName: path.basename(fp),
        content: raw
      });
    }
    return { success: true, files: results };
  } catch (err) {
    console.error("Error al leer archivos .mexref:", err);
    return { success: false, error: err.message };
  }
});

// ==================== LYRICS SYSTEM (LRCLIB + SQLite Cache) ====================
ipcMain.handle("get-lyrics", async (_event, songParams) => {
  try {
    return await getSongLyrics(db, songParams);
  } catch (err) {
    console.error("❌ Error en get-lyrics handler:", err);
    return { success: false, notAvailable: true, message: err.message };
  }
});

