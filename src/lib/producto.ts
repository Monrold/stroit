// Utilidades compartidas para las fichas de producto (Contentful "stroit").
// Centralizan el slug, el nombre de marca y la descarga del catálogo para que
// todas las páginas generen los mismos enlaces y no haya URLs rotas.
import type { Entry } from "contentful";
import { contentfulClient } from "./contentful";
import type { Surfaces } from "./contentful";

/** Contentful a veces entrega listas (["dekton"]) y a veces texto. */
export function aTexto(valor: unknown): string {
  if (Array.isArray(valor)) return valor.map((v) => String(v)).join(", ");
  if (valor === null || valor === undefined) return "";
  return String(valor);
}

/** Lista limpia a partir de un campo de Contentful (lista, texto u objeto). */
export function aLista(valor: unknown): string[] {
  if (Array.isArray(valor)) return valor.map((v) => String(v).trim()).filter(Boolean);
  if (typeof valor === "string") return valor.trim() ? [valor.trim()] : [];
  if (valor && typeof valor === "object") return Object.values(valor).map((v) => String(v).trim()).filter(Boolean);
  return [];
}

/** Clave de marca en minúsculas: "dekton", "silestone", "sensa"... */
export function marcaClave(marca: unknown): string {
  const primera = Array.isArray(marca) ? marca[0] : marca;
  return String(primera ?? "").trim().toLowerCase();
}

const NOMBRES_MARCA: Record<string, string> = {
  dekton: "Dekton",
  silestone: "Silestone",
  sensa: "Sensa",
  granitops: "Granitops",
};

/** Nombre de marca como lo escribe Cosentino: "Dekton", "Silestone", "Sensa". */
export function marcaNombre(marca: unknown): string {
  const clave = marcaClave(marca);
  return NOMBRES_MARCA[clave] ?? (clave ? clave.charAt(0).toUpperCase() + clave.slice(1) : "");
}

/**
 * Slug de la ficha: "dekton-laurent".
 * Es exactamente el mismo cálculo que se usaba antes en getStaticPaths y en el
 * catálogo; no cambiarlo, o todas las URLs ya indexadas en Google cambiarían.
 */
export function slugProducto(marca: unknown, nombre: unknown): string {
  if (!nombre || !marca) return "";
  return `${marca} ${nombre}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

/** URL relativa de la ficha: "/posts/dekton-laurent/". */
export function urlProducto(marca: unknown, nombre: unknown): string {
  const slug = slugProducto(marca, nombre);
  return slug ? `/posts/${slug}/` : "/catalogo/";
}

/** Asegura que las URLs de Contentful ("//assets...") tengan https:. */
export function urlAbsoluta(url: unknown): string {
  const u = String(url ?? "");
  if (!u) return "";
  return u.startsWith("//") ? `https:${u}` : u;
}

let catalogoCache: Promise<Entry<Surfaces>[]> | null = null;

/**
 * Descarga todo el catálogo una sola vez por build (Contentful entrega máximo
 * 100 por petición; antes los componentes solo veían los primeros 100).
 */
export function obtenerCatalogo(): Promise<Entry<Surfaces>[]> {
  if (!catalogoCache) {
    catalogoCache = (async () => {
      let skip = 0;
      const limit = 100;
      let total = 0;
      let todos: Entry<Surfaces>[] = [];
      do {
        const respuesta = await contentfulClient.getEntries<Surfaces>({
          content_type: "stroit",
          skip,
          limit,
        });
        todos = todos.concat(respuesta.items);
        total = respuesta.total;
        skip += limit;
      } while (skip < total);
      return todos;
    })();
  }
  return catalogoCache;
}

export interface ProductoRelacionado {
  nombre: string;
  marca: string;
  marcaNombre: string;
  coleccion: string;
  imagen: string;
  promocion: boolean;
  url: string;
}

function aRelacionado(entry: Entry<Surfaces>): ProductoRelacionado | null {
  const f = entry.fields as any;
  const url = urlProducto(f.marca, f.nombre);
  const imagen = urlAbsoluta(f.imagen?.[0]?.fields?.file?.url);
  if (url === "/catalogo/" || !imagen) return null;
  return {
    nombre: String(f.nombre ?? "").trim(),
    marca: marcaClave(f.marca),
    marcaNombre: marcaNombre(f.marca),
    coleccion: aTexto(f.coleccion),
    imagen,
    promocion: Boolean(f.promocion),
    url,
  };
}

function barajar<T>(lista: T[]): T[] {
  return [...lista].sort(() => Math.random() - 0.5);
}

/**
 * Productos relacionados: primero de la misma colección, luego de la misma
 * marca, luego cualquiera. Nunca incluye el producto actual.
 */
export async function obtenerRelacionados(opciones: {
  marca?: string;
  coleccion?: string;
  excluirUrl?: string;
  cantidad?: number;
}): Promise<ProductoRelacionado[]> {
  const cantidad = opciones.cantidad ?? 4;
  const marca = opciones.marca ? marcaClave(opciones.marca) : "";
  const coleccion = (opciones.coleccion ?? "").trim().toLowerCase();

  const todos = (await obtenerCatalogo())
    .map(aRelacionado)
    .filter((p): p is ProductoRelacionado => p !== null && p.url !== opciones.excluirUrl);

  const mismaColeccion = barajar(
    todos.filter((p) => marca && p.marca === marca && coleccion && p.coleccion.toLowerCase() === coleccion),
  );
  const mismaMarca = barajar(todos.filter((p) => marca && p.marca === marca && !mismaColeccion.includes(p)));
  const resto = marca ? [] : barajar(todos);

  return [...mismaColeccion, ...mismaMarca, ...resto].slice(0, cantidad);
}
