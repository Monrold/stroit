// Convierte el HTML de la cotización a PDF tamaño carta con Chromium (Playwright).
// Uso: node render.mjs cotizacion.html cotizacion.pdf
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const [, , entrada, salida] = process.argv;

// Busca playwright en el proyecto o en la instalación global de node.
let pw;
const require = createRequire(import.meta.url);
try {
  pw = require("playwright");
} catch {
  const global = execSync("npm root -g").toString().trim();
  pw = require(resolve(global, "playwright"));
}

const chromiumLocal = "/opt/pw-browsers/chromium";
const browser = await pw.chromium.launch(existsSync(chromiumLocal) ? { executablePath: chromiumLocal } : {});
const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
await page.goto("file://" + resolve(entrada), { waitUntil: "load" });
await page.pdf({ path: salida, width: "816px", height: "1056px", printBackground: true });
await browser.close();
