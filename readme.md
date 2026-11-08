# 🎵 Mexlify — Reproductor de Música & Sincronización LAN

[![Node.js CI](https://github.com/vC3sar/Mexlify_Musica/actions/workflows/node.js.yml/badge.svg)](https://github.com/vC3sar/Mexlify_Musica/actions/workflows/node.js.yml)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Android-ff0090.svg)](https://github.com/vC3sar/Mexlify_Musica)
[![License](https://img.shields.io/badge/License-ISC-080014.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Alpha-55ff99.svg)](https://github.com/vC3sar/Mexlify_Musica)

**Mexlify** es un ecosistema musical moderno compuesto por una **aplicación de escritorio (Windows / Electron)** y una **aplicación móvil complementaria (Android / Capacitor + Vite)** diseñada para escuchar música sin interrupciones, descargar pistas en MP3 de alta calidad con carátulas y metadatos automáticos, y transferir tu biblioteca de la PC al celular **por Wi-Fi sin duplicar archivos**, con soporte para **letras sincronizadas offline**, **Discord Rich Presence estético** y controles integrados con el sistema operativo móvil (Notch dinámico, pantalla de bloqueo y barra de estado).

---

## 📑 Tabla de Contenidos

- [✨ Características Destacadas](#-características-destacadas)
  - [🖥️ Mexlify Desktop (Windows)](#️-mexlify-desktop-windows)
  - [📱 Mexlify Mobile (Android)](#-mexlify-mobile-android)
  - [📡 Sincronización LAN Inteligente (PC ⇄ Android)](#-sincronización-lan-inteligente-pc--android)
- [🧱 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [⚙️ Requisitos del Sistema](#️-requisitos-del-sistema)
- [🚀 Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [📖 Guía de Uso y Flujos de Trabajo](#-guía-de-uso-y-flujos-de-trabajo)
  - [1. Búsqueda y Reproducción en PC](#1-búsqueda-y-reproducción-en-pc)
  - [2. Descarga de Canciones](#2-descarga-de-canciones)
  - [3. Sincronización con tu Celular mediante Código QR](#3-sincronización-con-tu-celular-mediante-código-qr)
  - [4. Modo Pantalla Completa (F11)](#4-modo-pantalla-completa-f11)
  - [5. Presencia en Discord (Discord Rich Presence)](#5-presencia-en-discord-discord-rich-presence)
- [🛠️ Compilación desde Consola (100% CLI)](#️-compilación-desde-consola-100-cli)
  - [📦 Compilación para Windows (.exe)](#-compilación-para-windows-exe)
  - [🤖 Compilación del APK para Android (Sin Android Studio)](#-compilación-del-apk-para-android-sin-android-studio)
  - [📲 Instalación Directa al Celular por USB (ADB)](#-instalación-directa-al-celular-por-usb-adb)
- [🧪 Pruebas Automatizadas](#-pruebas-automatizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔒 Privacidad y Aviso Legal](#-privacidad-y-aviso-legal)
- [💬 Comunidad y Soporte](#-comunidad-y-soporte)

---

## ✨ Características Destacadas

### 🖥️ Mexlify Desktop (Windows)
- **Streaming y reproducción libre de anuncios:** Disfruta de tus canciones favoritas sin interrupciones publicitarias.
- **Búsqueda inteligente con autocorrección:** Corrección y normalización de metadatos cruzados con la API de iTunes para obtener nombres oficiales de artistas y álbumes.
- **Descargas en MP3 con carátula incrustada:** Conversión automática mediante `yt-dlp` y `ffmpeg` con portadas en alta resolución.
- **Indicador dinámico de estado:** Notificación visual interactiva (`OBTENIENDO...` al solicitar una canción y `REPRODUCIENDO` una vez iniciado el buffer).
- **Discord Rich Presence estético:** Muestra en tu perfil de Discord la canción en curso con portada del álbum, artista y barra de tiempo en tiempo real, con diseño minimalista sin redundancias.
- **Modo Pantalla Completa con tecla F11:** Alterna entre vista de ventana y pantalla completa con un solo toque o mediante el atajo estándar `F11`.
- **Motor de Letras Sincronizadas (LRCLIB + SQLite):** Búsqueda automática en dos fases con almacenamiento en caché local SQLite para disponibilidad inmediata.

### 📱 Mexlify Mobile (Android)
- **Estética minimalista inspirada en Apple Music:** Interfaz oscura profunda (`#080014`) con el color insignia de Mexlify (`#ff0090`), superficies en gris grafito translúcido y fondo ambiental reactivo con desenfoque de la carátula en reproducción.
- **Soporte para Notch y Cámaras Perforadas (Tecno, Samsung, Xiaomi):** Configuración nativa de visualización de borde a borde (`LAYOUT_IN_DISPLAY_CUTOUT_MODE`) e inyección dinámica de márgenes seguros (`--safe-top` y `--safe-bottom`).
- **Integración con Dynamic Port / Isla Dinámica:** Vinculación con `MediaSession` y `PlaybackState` nativo de Android, activando automáticamente la píldora interactiva del notch en dispositivos compatibles.
- **Notificaciones del Sistema `MediaStyle`:** Control total de la música desde la barra de estado y la pantalla de bloqueo (carátula, barra de tiempo interactiva, Anterior, Pausa/Play y Siguiente) compatible con audífonos Bluetooth y controles del automóvil.
- **Letras Sincronizadas Offline y en Vivo (Apple Music Sing):** Desplazamiento automático al ritmo de la música con desenfoque en líneas inactivas y enfoque nítido en la frase actual, además de un buscador de respaldo automático vía LRCLIB.
- **Gestos Táctiles Fluidos:**
  - *Swipe Down* en el reproductor o modales para minimizar.
  - *Swipe Left / Right* sobre la carátula para saltar pistas.
  - *Swipe Up* en el Mini Player para expandir.
  - Integración con el gesto nativo de **Volver** de Android para cerrar modales en pila sin cerrar la reproducción.

### 📡 Sincronización LAN Inteligente (PC ⇄ Android)
- **Cero duplicados garantizados:** Comprobación algorítmica por nombre de archivo y peso en bytes; únicamente se transfieren las canciones nuevas o actualizadas.
- **Servidor HTTP local integrado en Electron:** Inicia automáticamente en un puerto LAN seguro (ej. `:5055`) al abrir la opción de sincronizar.
- **Escaneo QR instantáneo (<10ms):** Código QR generado en la PC con contraste optimizado y marco de cristal, leído en el celular mediante aceleración nativa por hardware (`BarcodeDetector`) o recorte central (`jsQR`).
- **Transferencia completa de activos:** Envía el audio MP3, la carátula optimizada y el archivo de letra sincronizada `.lrc`. Si la PC no posee la letra, el móvil la obtiene por sí mismo en segundo plano y la almacena localmente en IndexedDB.

---

## 🧱 Tecnologías Utilizadas

| Componente | Tecnologías Clave |
| :--- | :--- |
| **Desktop Core** | [Electron](https://www.electronjs.org/) (v38), [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) (Servidor LAN) |
| **Audio & Metadatos** | [yt-dlp-exec](https://github.com/microlinkhq/yt-dlp-exec), [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static), [play-dl](https://github.com/play-dl/play-dl) |
| **Almacenamiento PC** | [SQLite3](https://github.com/TryGhost/node-sqlite3) (Caché local de letras y búsquedas) |
| **Integraciones PC** | [discord-rpc](https://github.com/discordjs/RPC), [qrcode](https://github.com/soldair/node-qrcode) |
| **Móvil (Android)** | [Capacitor](https://capacitorjs.com/) (v6 Android Bridge), [Vite](https://vitejs.dev/) (Bundler Frontend) |
| **Almacenamiento Móvil** | [IndexedDB](https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API) (Almacenamiento 100% offline para audios, carátulas y letras) |
| **Nativo Android** | Java, `MediaSession`, `Notification.MediaStyle`, `ForegroundService` de reproducción, `DisplayCutout` |
| **Decodificación QR** | `BarcodeDetector` (Hardware Web API) + [jsQR](https://github.com/cozmo/jsQR) (Fallback por software) |
| **Iconografía & Tipografía**| [Phosphor Icons](https://phosphoricons.com/), Fuentes SF Pro / Poppins |

---

## ⚙️ Requisitos del Sistema

### Para Mexlify Desktop (PC):
- **Sistema Operativo:** Windows 10 o Windows 11 (64-bit).
- **Entorno:** Node.js v18.0.0 o superior (recomendado Node.js LTS v20 o v22).
- **Red:** Conexión Wi-Fi compartida si deseas sincronizar con el móvil.

### Para Mexlify Mobile (Compilación y uso):
- **Dispositivo Móvil:** Android 8.0 (Oreo) o superior (API 26+; probado y optimizado para Android 13 y 14 con soporte para Notch / Dynamic Port).
- **Para compilar desde consola:** Android SDK instalado (mínimo `cmdline-tools` y `platform-tools`). No se requiere Android Studio.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/vC3sar/Mexlify_Musica.git
cd Mexlify_Musica
```

### 2. Instalar dependencias del cliente de escritorio
```bash
npm install
```

### 3. Instalar dependencias del reproductor móvil
```bash
cd APK_Player_Android
npm install
cd ..
```

### 4. Iniciar Mexlify Desktop en modo desarrollo
```bash
npm start
```

---

## 📖 Guía de Uso y Flujos de Trabajo

### 1. Búsqueda y Reproducción en PC
1. Escribe el título de una canción o el nombre del artista en la barra de búsqueda superior.
2. Haz clic sobre cualquier resultado de la lista.
3. Observarás que el reproductor muestra inmediatamente la etiqueta interactiva **`OBTENIENDO...`** mientras establece el buffer de audio, cambiando a **`REPRODUCIENDO`** al iniciar la pista.

### 2. Descarga de Canciones
- Pulsa el botón de descarga junto a la pista en la lista de resultados o en la barra inferior.
- Mexlify guardará el archivo en tu carpeta local con su carátula, metadatos ID3 y descargará automáticamente la letra sincronizada `.lrc` si está disponible.

### 3. Sincronización con tu Celular mediante Código QR
Asegúrate de que tu PC y tu teléfono estén conectados a la **misma red Wi-Fi**:

```
[ Mexlify PC ]  --- (Wi-Fi Local / HTTP :5055) ---  [ Mexlify Android ]
  Genera QR                                            Escanea con cámara
  Servidor LAN                                         Deduplica & Descarga
```

1. En Mexlify PC, haz clic en el icono **"Sincronizar con Android"** en la barra superior.
2. Se abrirá una tarjeta con el **código QR de sincronización** y la dirección IP local de tu máquina (ej. `http://192.168.1.86:5055`).
3. Abre **Mexlify Mobile** en tu teléfono y toca el botón **"Sincronizar con PC"** o el botón de cámara **"Escanear Código QR"**.
4. Apunta la cámara de tu teléfono a la pantalla de la PC. El lector detectará el código en menos de 10 milisegundos con vibración háptica.
5. La app móvil comparará automáticamente la biblioteca remota con la local:
   - Identificará cuántas canciones ya tienes (**0 duplicados transferidos**).
   - Te indicará cuántas canciones nuevas faltan por bajar.
6. Presiona **"Sincronizar Canciones"**. Verás la barra de progreso en vivo y las pistas quedarán almacenadas en tu teléfono listas para reproducirse sin conexión a Internet.

### 4. Modo Pantalla Completa (F11)
- Presiona la tecla **`F11`** en cualquier momento para maximizar la ventana sin bordes.
- Vuelve a presionar **`F11`** o `Esc` para restaurar el tamaño original de la ventana.

### 5. Presencia en Discord (Discord Rich Presence)
- Al iniciar Mexlify con Discord abierto en tu PC, tu perfil mostrará automáticamente el estado *"Escuchando Mexlify"*, exhibiendo la portada real de la canción, el artista y el temporizador exacto de reproducción con tipografía limpia estilo Spotify.

---

## 🛠️ Compilación desde Consola (100% CLI)

### 📦 Compilación para Windows (.exe)
Para generar el instalador y el ejecutable portátil para Windows:
```bash
npm run dist
```
El instalador ejecutable `.exe` se generará en la carpeta `dist/`.

---

### 🤖 Compilación del APK para Android (Sin Android Studio)
Mexlify cuenta con un script de compilación automatizado por línea de comandos que compila la aplicación web con Vite, sincroniza los activos con Capacitor y ejecuta el Gradle Wrapper directamente:

```bash
cd APK_Player_Android
npm run build:apk
```

El script ejecutará automáticamente los cuatro pasos:
1. 📦 Compilación frontend con Vite en modo producción.
2. ⚙️ Verificación y ajuste de `local.properties` con la ruta de tu Android SDK.
3. 🔄 Sincronización de activos nativos de Capacitor.
4. ⚡ Compilación del archivo APK mediante `./gradlew assembleDebug`.

El archivo compilado quedará listo en:
```text
APK_Player_Android/android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 📲 Instalación Directa al Celular por USB (ADB)
Con la depuración USB activa en tu celular, instala o actualiza la app directamente desde tu consola ejecutando:

```powershell
adb install -r "c:\Users\vCesar\OneDrive\Escritorio\Proyectos\Mexlify\APK_Player_Android\android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una batería completa de pruebas unitarias y de integración que verifican el correcto funcionamiento de cada subsistema:

Para ejecutar todas las pruebas automatizadas (PC y Android):
```bash
npm test
```

### Pruebas individuales disponibles:
- **Servidor de Sincronización LAN:**
  ```bash
  node tests/test_sync_server.js
  ```
- **Integración Electron IPC & Preload:**
  ```bash
  node tests/test_sync_integration.js
  ```
- **Discord Rich Presence:**
  ```bash
  node tests/test_discord_rich_presence.js
  ```
- **Pantalla Completa (F11):**
  ```bash
  node tests/test_fullscreen_f11.js
  ```
- **Insignia de Estado (OBTENIENDO / REPRODUCIENDO):**
  ```bash
  node tests/test_obteniendo_badge.js
  ```
- **Motor de Audio y Deduplicación en Android:**
  ```bash
  node APK_Player_Android/tests/test_android_player.js
  ```
- **Generación y Decodificación de Código QR:**
  ```bash
  node APK_Player_Android/tests/test_qr_sync.js
  ```
- **Servicio y Respaldo de Letras Online (LRCLIB):**
  ```bash
  node APK_Player_Android/tests/test_lyrics_fallback.js
  ```

---

## 📁 Estructura del Proyecto

```text
Mexlify/
├── APK_Player_Android/               # Módulo del reproductor móvil Android
│   ├── android/                      # Proyecto nativo Gradle / Capacitor
│   │   └── app/src/main/
│   │       ├── AndroidManifest.xml   # Permisos de red, cámara y foreground service
│   │       └── java/com/mexlify/player/
│   │           ├── MainActivity.java # Bridge nativo, Notch/Cutout insets y back gesture
│   │           └── MusicPlaybackService.java # MediaSession y notificación MediaStyle
│   ├── scripts/
│   │   └── build_apk.js              # Compilador de APK 100% por consola
│   ├── src/
│   │   ├── app.js                    # Lógica UI, gestos táctiles y eventos
│   │   ├── audioEngine.js            # Reproducción, cola y puente MediaSession
│   │   ├── lyricsEngine.js           # Parser .lrc y sincronización en vivo
│   │   ├── lyricsService.js          # Respaldo online de letras vía LRCLIB
│   │   ├── storage.js                # Almacenamiento local offline en IndexedDB
│   │   ├── style.css                 # Diseño Apple Music + paleta Mexlify (#080014)
│   │   └── syncClient.js             # Cliente LAN Wi-Fi y algoritmo anti-duplicados
│   ├── tests/                        # Suite de pruebas unitarias móviles
│   ├── index.html                    # Vistas del reproductor móvil
│   ├── package.json
│   └── vite.config.js
├── assets/                           # Estilos CSS, imágenes y scripts frontend de PC
├── services/
│   ├── lyricsService.js              # Integración LRCLIB, SQLite y normalización
│   └── syncServer.js                 # Servidor LAN HTTP Express para sincronizar con Android
├── tests/                            # Suite de pruebas para Electron y servidores
├── index.html                        # Interfaz principal de escritorio
├── main.js                           # Proceso principal de Electron, IPC handlers y Discord RPC
├── preload.js                        # ContextBridge seguro entre Node y el renderer
├── package.json                      # Configuración de dependencias y scripts de ejecución
└── readme.md                         # Documentación oficial del proyecto
```

---

## 🔒 Privacidad y Aviso Legal

1. **Sin recopilación de datos:** Mexlify no recopila, almacena ni transmite información privada, historial de navegación ni credenciales a servidores externos. Todo el almacenamiento de favoritos, historial y archivos descargados reside de forma local en tu equipo y dispositivo móvil.
2. **Aviso Legal:** Mexlify actúa como un intermediario técnico para interactuar con contenido de acceso público en plataformas multimedia. No aloja contenido protegido de manera directa en servidores propios.

---

## 💬 Comunidad y Soporte

¿Tienes sugerencias, ideas de diseño o encontraste algún problema? Únete a la comunidad de Mexlify:

- 💬 **Discord Oficial:** [https://discord.gg/JRTtZWhDF8](https://discord.gg/JRTtZWhDF8)
- 🌐 **Sitio Web:** [Mexlify.top](https://mexlify.top)
- 👤 **Autor:** [vC3sar](https://github.com/vC3sar)

---

<p align="center">
  Hecho con pasión por la música y el buen diseño. 🎧
</p>
