import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("====================================================");
console.log("🚀 MEXLIFY ANDROID - COMPILADOR DE APK POR CONSOLA");
console.log("====================================================");

const projectRoot = path.resolve(__dirname, "..");
const androidDir = path.join(projectRoot, "android");

// 1. Detectar SDK de Android
const possibleSdkPaths = [
  process.env.ANDROID_HOME,
  process.env.ANDROID_SDK_ROOT,
  path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk"),
];

let androidSdkPath = possibleSdkPaths.find((p) => p && fs.existsSync(p));

if (!androidSdkPath) {
  console.error("❌ No se encontró el SDK de Android en LOCALAPPDATA ni en variables de entorno.");
  process.exit(1);
}

console.log(`✅ Android SDK detectado en: ${androidSdkPath}`);

// 2. Compilar assets web con Vite
console.log("\n📦 1/4 Compilando interfaz web (Vite)...");
execSync("npx vite build", { cwd: projectRoot, stdio: "inherit" });

// 3. Verificar o inicializar proyecto Android con Capacitor
if (!fs.existsSync(androidDir)) {
  console.log("\n🤖 2/4 Inicializando proyecto nativo de Android con Capacitor...");
  execSync("npx cap add android", { cwd: projectRoot, stdio: "inherit" });
}

// 4. Asegurar local.properties para Gradle sin necesidad de Android Studio
const localPropsFile = path.join(androidDir, "local.properties");
const escapedSdk = androidSdkPath.replace(/\\/g, "\\\\");
fs.writeFileSync(localPropsFile, `sdk.dir=${escapedSdk}\n`, "utf8");
console.log(`✅ Archivo local.properties configurado para CLI.`);

// 5. Sincronizar proyecto con Capacitor
console.log("\n🔄 3/4 Sincronizando assets nativos...");
execSync("npx cap sync android", { cwd: projectRoot, stdio: "inherit" });

// 6. Compilar APK Debug con Gradle Wrapper
console.log("\n⚡ 4/4 Compilando APK nativo con Gradle CLI...");
const gradlewCmd = process.platform === "win32" ? "gradlew.bat assembleDebug" : "./gradlew assembleDebug";

try {
  execSync(gradlewCmd, {
    cwd: androidDir,
    stdio: "inherit",
    env: {
      ...process.env,
      ANDROID_HOME: androidSdkPath,
      ANDROID_SDK_ROOT: androidSdkPath,
    },
  });

  const apkOutput = path.join(androidDir, "app", "build", "outputs", "apk", "debug", "app-debug.apk");
  if (fs.existsSync(apkOutput)) {
    console.log("\n====================================================");
    console.log("🎉 ¡APK COMPILADA EXITOSAMENTE DESDE LA CONSOLA!");
    console.log(`📁 Ubicación del APK: ${apkOutput}`);
    console.log("====================================================");
    console.log("💡 Para instalar en tu teléfono por USB ejecuta:");
    console.log(`   adb install -r "${apkOutput}"`);
  } else {
    console.log("\n⚠️ La compilación finalizó pero verifica el directorio de salida de Gradle.");
  }
} catch (err) {
  console.error("\n❌ Error durante la compilación de Gradle:", err.message);
  process.exit(1);
}
