import assert from "assert";
import QRCode from "qrcode";
import jsQR from "jsqr";

console.log("=== TEST SUITE: MEXLIFY QR SYNC (PC GENERATION & MOBILE DECODING) ===");

(async () => {
  console.log("Test 1: PC generates QR Code DataURL");
  const connectionUrl = "http://192.168.1.86:5055";
  const qrDataUrl = await QRCode.toDataURL(connectionUrl, {
    margin: 1,
    width: 200,
    color: { dark: "#000000", light: "#ffffff" },
  });

  assert(qrDataUrl.startsWith("data:image/png;base64,"), "QR code should be a base64 PNG data URL");
  console.log("  ✓ Test 1 passed: QRCode successfully generated data URL on PC");

  console.log("Test 2: Mobile jsQR decodes QR Code raw image");
  // Renderizar a imagen cruda para probar decodificación
  const rawQr = await QRCode.create(connectionUrl);
  const size = rawQr.modules.size;
  const scale = 4;
  const width = size * scale;
  const height = size * scale;
  const data = new Uint8ClampedArray(width * height * 4);

  // Llenar buffer RGBA blanco/negro
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const qrR = Math.floor(r / scale);
      const qrC = Math.floor(c / scale);
      const isDark = rawQr.modules.get(qrR, qrC);
      const idx = (r * width + c) * 4;
      const color = isDark ? 0 : 255;
      data[idx] = color;
      data[idx + 1] = color;
      data[idx + 2] = color;
      data[idx + 3] = 255;
    }
  }

  const decoded = jsQR(data, width, height);
  assert(decoded !== null, "jsQR should detect and decode QR pattern");
  assert.strictEqual(decoded.data, connectionUrl, "Decoded text must match original PC connection URL");
  console.log("  ✓ Test 2 passed: jsQR on mobile successfully decoded:", decoded.data);

  console.log("\nALL QR SYNC TESTS PASSED! (2/2) 🎉");
})();

