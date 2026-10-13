---
name: stroit-diseno-web
description: Diseña y modifica páginas del sitio web de Stroit Surfaces (stroitsurfaces.com, Astro + Tailwind), distribuidor de Cosentino (Dekton, Silestone, Sensa). Define la identidad visual (paleta, tipografía, espaciado, botones, imágenes), los componentes estándar, la referencia de diseño de cosentino.com y el proceso obligatorio de revisión con capturas en celular y escritorio. Úsalo siempre que el usuario pida crear, rediseñar, ajustar o "hacer más bonita" una página, sección, landing, formulario, catálogo o componente del sitio, o cambiar colores, textos visuales, layout o estilos.
---

# Diseño web – Stroit Surfaces

El sitio es un **showroom digital de superficies de lujo**. La protagonista es la **piedra**: fotos grandes, mucho aire y poco texto. Todo lo demás (botones, textos, marcos) está para que el material luzca y para llevar al visitante a **pedir muestra, cotizar por WhatsApp o visitar el showroom**.

Referencia de nivel: **cosentino.com** (ver `references/cosentino.md`). Stroit no copia a Cosentino. Mantiene su identidad oscura y cálida, pero con el mismo rigor: editorial, sobrio y con la foto del material primero.

## Antes de tocar nada

1. **Lee** `references/auditoria.md` (estado real del sitio e inconsistencias conocidas) y `references/preferencias.md` (lo que al dueño le ha gustado y lo que no). **Las preferencias mandan sobre cualquier regla de este skill.**
2. **Toma capturas del estado actual** de la página que vas a cambiar, en escritorio y celular (ver *Proceso de revisión*).
3. Si el pedido es vago ("hazla más bonita"), **no rediseñes todo**: propone 1 o 2 cambios concretos con su porqué, o pide una referencia visual.
4. **No cambies datos del negocio** (ciudades de showroom, teléfonos, precios, garantías) sin confirmarlo. Si ves algo que choca con lo que sabes, señálalo y pregunta.

## Identidad visual

### Paleta (usa solo esta)
| Rol | Valor | Uso |
|---|---|---|
| Fondo principal | `bg-black` | Nav, footer y fondo de página. **Un solo negro en todo el sitio.** |
| Superficie elevada | `bg-zinc-950` / `bg-[#111]` | Tarjetas, formularios, bloques sobre negro |
| Fondo claro cálido | `bg-[#f1ede7]` | Secciones claras para dar ritmo (en lugar de `bg-gray-200`, que es frío) |
| Texto principal | `text-white` (sobre oscuro) / `text-black` (sobre claro) | |
| Texto secundario | `text-zinc-400` (sobre oscuro) / `text-zinc-600` (sobre claro) | Párrafos y descripciones |
| **Acento piedra** | `#dbd6ca` (hover `#cbbfae`) | El color de marca: CTA principal, bordes de botón, líneas finas, detalles. Es el tono del botón "Catálogo" y de "Solicitar muestra". |
| Acento dorado (puntual) | `#bfa986` | Solo para detalles premium (una línea o una etiqueta). Nunca como fondo grande. |
| Bordes | `border-white/10` (oscuro) / `border-black/10` (claro) | Divisiones sutiles |
| Promoción | `#dbd6ca` o, si debe gritar, `bg-orange-500` solo en la **etiqueta del precio** | Nunca banners naranjas o rojos a todo lo ancho |

**Prohibido**: degradados de color en botones, `bg-zinc-600` gris en botones, `red-300`/`red-500` como estilo de precio, `amber-400` como acento (usa el piedra), y mezclar `bg-zinc-800`, `#080b0f` y `black` como fondo de página.

### Tipografía
- No hay fuente propia; se usa la del sistema. **No agregues fuentes sin preguntar.** Si el dueño quiere una, propón una sans geométrica y ligera (estilo de la marca Cosentino), por ejemplo *Manrope* o *Inter*, cargada desde Google Fonts.
- El carácter lo dan el **peso ligero y el tamaño**, no la negrita:
  - Eyebrow (antetítulo): `text-xs uppercase tracking-[0.2em] text-zinc-400`
  - H1: `text-4xl md:text-6xl font-light tracking-tight`
  - H2: `text-3xl md:text-4xl font-light`
  - H3: `text-xl md:text-2xl font-normal`
  - Párrafo: `text-base leading-relaxed text-zinc-400`, con un máximo de unas 65 letras por línea (`max-w-prose`)
- `font-bold` solo en precios y botones (`font-medium`). Nunca en títulos grandes.
- Nombres de modelo: grandes y ligeros (`text-4xl lg:text-6xl font-light`), como en el catálogo actual.

### Espaciado y layout
- Contenedor: `max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10`.
- Separación entre secciones: `py-16 lg:py-28`. **Aire generoso**: si dudas, más espacio, no menos.
- Patrón base: **imagen grande + texto corto**, alternando lados (`lg:flex-row` / `lg:flex-row-reverse`).
- Esquinas **rectas** en fotos, tarjetas y botones (`rounded-none`, a lo mucho `rounded-sm`). Cosentino y la piedra son de líneas rectas; las esquinas muy redondeadas (`rounded-xl` o `rounded-2xl`) se ven a app, no a showroom.

### Imágenes
- La foto manda: a todo lo ancho o en bloques grandes, con `object-cover` y proporciones fijas (`aspect-[4/5]` vertical, `aspect-[16/9]` horizontal).
- Texto sobre foto, siempre con un velo: `linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.25))`, el que ya usa el sitio.
- Formatos `avif` o `webp`, siempre con `alt` descriptivo ("Cocina con isla de Dekton Laurent"), nunca vacío.
- Imágenes nuevas: desde `cdn.stroitsurfaces.com` o `src/images/`. **Nunca uses fotos de bancos genéricos ni inventes fotos de proyectos.**

### Botones y CTA
Solo 3 estilos (código en `references/componentes.md`):
1. **Principal**: fondo `#dbd6ca` y texto negro. Para la acción que vende: "Solicitar muestra", "Cotizar por WhatsApp".
2. **Secundario**: borde `#dbd6ca` y texto `#dbd6ca`; en hover se rellena. Para "Ver catálogo" y "Encontrar showroom".
3. **Enlace**: texto con flecha, por ejemplo `Ver más →`, subrayado al hacer hover. Para navegar a otra página.

Textos de CTA cortos y con verbo: "Solicitar muestra", "Cotizar por WhatsApp", "Ver catálogo", "Agendar visita". Nada de "Click aquí" ni "Ver más sobre Lechic".

**Cada página termina con un CTA de conversión** (muestra, WhatsApp o showroom). El WhatsApp de ventas y el mensaje prellenado deben ser los mismos que en `components/detalle-producto/showroom.astro`.

## Componentes: reutiliza, no reinventes
- `Layout.astro` envuelve todo: nav, footer, pixel, PostHog y pageview. Toda página nueva lo usa y le pasa `pageviewData`.
- `nav.astro` y `footer.astro`: no los dupliques en las páginas.
- `detalle-producto/showroom.astro`: el bloque de CTA de muestra y showroom.
- `detalle-producto/ventajas.astro`: los íconos de ventajas y aplicaciones por marca.
- `Moreproducts*.astro`: las cuadrículas de modelos desde Contentful.
- Para piezas nuevas que se repiten (tarjeta de modelo, encabezado de sección, precio de promoción), usa los patrones de `references/componentes.md` y, si aparecen en más de una página, conviértelas en componente en `src/components/`.

## Proceso de revisión (obligatorio)
Un cambio de diseño **no está terminado hasta que lo viste**.

1. Levanta el sitio: `npx astro dev --host 127.0.0.1 --port 4321` (instala antes con `npm ci` si falta `node_modules`).
2. Toma capturas antes y después con `node .claude/skills/stroit-diseno-web/scripts/capturas.cjs <carpeta> /ruta1 /ruta2`. El script genera escritorio (1440 px) y celular (390 px) de página completa.
3. **Mira las capturas** y revisa esta lista:
   - [ ] ¿Se ve bien a 390 px? Sin scroll horizontal, textos legibles, botones de al menos 44 px de alto.
   - [ ] ¿La foto del material es lo primero que se ve?
   - [ ] ¿Solo colores de la paleta, un solo negro de fondo y esquinas rectas?
   - [ ] ¿Títulos ligeros y párrafos cortos?
   - [ ] ¿Hay un CTA claro al final?
   - [ ] ¿Coincide con las páginas vecinas (nav, footer, espaciado)?
4. Corrige y repite hasta que pase. Muestra al usuario las capturas del antes y el después (con `SendUserFile`) **antes** de hacer commit, y espera su visto bueno en cambios grandes.
5. Trabaja **por secciones**: una sección, captura, visto bueno, y la siguiente. No rediseñes una página entera de golpe.

**Contentful:** las páginas que usan `Moreproducts*` (dekton, silestone, catálogo) necesitan `CONTENTFUL_DELIVERY_TOKEN` y el ID del espacio en `.env`. Sin ellos, la página falla en local. Si no los tienes, avísalo y revisa con capturas del sitio publicado o con las páginas que sí cargan; no inventes datos para rellenar.

**Red del entorno en la nube:** si `cdn.stroitsurfaces.com`, `stroitsurfaces.com` o `cosentino.com` están bloqueados, las imágenes del CDN saldrán vacías en las capturas. No confundas eso con un error de diseño. Pide al usuario que agregue esos dominios en *Allowed domains* de la configuración de red del entorno.

## Aprender de cada revisión
Cuando el usuario diga que algo le gusta o no le gusta, **anótalo en `references/preferencias.md`** con la fecha, la página, qué fue y la regla que se desprende. Esa lista es lo primero que se lee en cada tarea de diseño, para no repetir errores.
