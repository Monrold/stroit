// Capturas de página completa en escritorio (1440 px) y celular (390 px).
// Uso: node .claude/skills/stroit-diseno-web/scripts/capturas.cjs <carpeta-salida> /ruta1 /ruta2 ...
// Requiere el sitio corriendo: npx astro dev --host 127.0.0.1 --port 4321
// Variables opcionales: BASE_URL (por defecto http://127.0.0.1:4321).
const path = require("path");
const { execSync } = require("child_process");

function cargarPlaywright() {
  try {
    return require("playwright");
  } catch {
    const global = execSync("npm root -g").toString().trim();
    return require(path.join(global, "playwright"));
  }
}

const { chromium } = cargarPlaywright();
const [salida, ...rutas] = process.argv.slice(2);
if (!salida || rutas.length === 0) {
  console.error("Uso: node capturas.cjs <carpeta-salida> /ruta1 /ruta2 ...");
  process.exit(1);
}
const base = process.env.BASE_URL || "http://127.0.0.1:4321";
const vistas = [
  ["escritorio", { width: 1440, height: 900 }],
  ["celular", { width: 390, height: 844 }],
];

(async () => {
  require("fs").mkdirSync(salida, { recursive: true });
  const navegador = await chromium.launch();
  for (const [nombre, viewport] of vistas) {
    const pagina = await navegador.newPage({ viewport });
    for (const ruta of rutas) {
      try {
        await pagina.goto(base + ruta, { waitUntil: "networkidle", timeout: 30000 });
      } catch (e) {
        console.log(`${ruta}: ${e.message}`);
      }
      await pagina.waitForTimeout(800);
      const archivo = path.join(salida, `${nombre}${ruta === "/" ? "_inicio" : ruta.replace(/\//g, "_")}.png`);
      await pagina.screenshot({ path: archivo, fullPage: true });
      console.log(archivo);
    }
    await pagina.close();
  }
  await navegador.close();
})();
