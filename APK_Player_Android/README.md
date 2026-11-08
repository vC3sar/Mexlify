# 📱 Mexlify Mobile — Android Player

Módulo móvil offline para Android de **Mexlify**, diseñado bajo la filosofía estética limpia de **Apple Music** con la paleta de identidad de Mexlify (`#080014` y `#ff0090`). Permite sincronizar por Wi-Fi canciones descargadas desde la PC, escuchar música sin conexión, visualizar letras sincronizadas con efecto de desenfoque dinámico y controlar la reproducción desde el sistema operativo (Notch / Dynamic Port, pantalla de bloqueo y barra de estado).

---

## 🚀 Características Móviles

- 🎨 **Diseño Apple Music:** Fondo oscuro profundo (`#080014`), tarjetas en gris grafito translúcido, acento carmesí/magenta (`#ff0090`) y fondo ambiental dinámico generado en tiempo real con la carátula de la canción en reproducción.
- 🏝️ **Compatibilidad con Notch y Cámaras Perforadas:** Integración con `LAYOUT_IN_DISPLAY_CUTOUT_MODE` para aprovechar la pantalla completa en dispositivos **Tecno (Dynamic Port)**, **Samsung (OneUI Media Panel)** y **Xiaomi**.
- 🔔 **Servicio Nativo `MediaSession` & `Notification.MediaStyle`:** Muestra la carátula de alta resolución, progreso interactivo y botones de control en la barra de notificaciones y la pantalla de bloqueo.
- 🎤 **Letras Sincronizadas (Apple Music Sing Style):** Desplazamiento suave con resaltado en vivo de la línea actual y desenfoque progresivo en las líneas restantes. Si una canción no vino con letra desde la PC, la obtiene automáticamente en segundo plano desde LRCLIB.
- ⚡ **Escaneo QR Rápido (<10ms):** Detección asistida por hardware con la API `BarcodeDetector` y fallback optimizado con recorte central mediante `jsQR`.
- 📴 **Almacenamiento 100% Offline:** Todas las canciones, carátulas y letras se guardan en IndexedDB localmente en el dispositivo.

---

## 🛠️ Compilación por Consola (Sin Android Studio)

Este módulo está preparado para compilarse y empaquetarse **exclusivamente por línea de comandos**:

```bash
# Instalar dependencias
npm install

# Compilar frontend, sincronizar con Capacitor y ensamblar APK
npm run build:apk
```

El APK resultante se genera en:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📲 Instalación en tu Celular por USB (ADB)

Conecta tu celular por USB con la depuración USB habilitada y ejecuta:

```powershell
adb install -r "android/app/build/outputs/apk/debug/app-debug.apk"
```

---

## 🧪 Pruebas Automatizadas

```bash
# Ejecutar suite de pruebas de Android
npm test

# Pruebas de escaneo QR
node tests/test_qr_sync.js

# Pruebas del motor de letras y fallback LRCLIB
node tests/test_lyrics_fallback.js
```

