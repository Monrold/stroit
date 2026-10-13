// Sitemap generado en cada build: incluye todas las fichas que existen en
// Contentful, así nunca lista URLs que dan 404 ni olvida colores nuevos.
import type { APIRoute } from "astro";
import { obtenerCatalogo, urlProducto } from "../lib/producto";

const PAGINAS = [
  "/",
  "/catalogo/",
  "/catalogo-promos/",
  "/dekton/",
  "/silestone/",
  "/sensa/",
  "/showroom/",
  "/agenda/",
  "/blog/",
  "/earthic/",
  "/lechic/",
  "/privacy/",
];

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? "https://stroitsurfaces.com/").replace(/\/$/, "");
  const hoy = new Date().toISOString().slice(0, 10);

  const articulos = Object.keys(import.meta.glob("./articulos/*.md")).map(
    (ruta) => `/articulos/${ruta.split("/").pop()!.replace(/\.md$/, "")}/`,
  );

  const catalogo = await obtenerCatalogo();
  const fichas = [
    ...new Set(
      catalogo
        .map((entry) => urlProducto(entry.fields.marca, entry.fields.nombre))
        .filter((url) => url !== "/catalogo/"),
    ),
  ];

  const urls = [...PAGINAS, ...articulos, ...fichas];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc><lastmod>${hoy}</lastmod></url>`).join("\n")}
</urlset>
`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
