# Auditoría del sitio actual (octubre 2026)

Hecha leyendo el código y revisando capturas en escritorio (1440 px) y celular (390 px) de `/`, `/showroom` y `/trazo`. Las páginas con Contentful (`/dekton`, `/silestone`, `/sensa`, `/catalogo`) no cargaron en local por falta de token, así que se revisaron por código.

## Stack
- **Astro 5** + **Tailwind 3**, con `@tailwindcss/typography`. `tailwind.config.mjs` **no tiene tema propio**: todos los colores están sueltos en las clases.
- Contenido de modelos en **Contentful** (`src/lib/contentful.ts`, content type `stroit`).
- Imágenes en `src/images/` y en `cdn.stroitsurfaces.com`.
- `Layout.astro` incluye nav, footer, PostHog, Google, el pageview de Meta y el pixel de Meta.

## Lo que funciona y hay que conservar
- **Identidad oscura**: nav y footer negros, el logo blanco de STROIT y el co-branding "STROIT | COSENTINO" en el footer. Se siente premium.
- **El acento piedra `#dbd6ca`**: botón "Catálogo" con borde y "Solicitar muestra" en tono piedra. Es el color más "Stroit" del sitio y el más repetido (12 usos).
- **Héroes con foto a todo lo ancho y velo oscuro** (inicio, Dekton, Earthic/Le Chic).
- **Patrón imagen + texto alternado** en Sensa y Dekton.
- **Carruseles horizontales con snap** para ventajas y modelos en celular.
- **Catálogo de promociones**: nombre del modelo grande y ligero, ficha (medidas, espesor, acabado) y precio de lista tachado frente al precio de promoción. Es un buen esquema; solo falta pulirlo.
- **Formulario de Trazo**: etiquetas en mayúsculas con espaciado, campos oscuros y buen orden en dos columnas. Es la página más moderna; su estilo de formulario es la referencia (pero con esquinas rectas).

## Inconsistencias que hay que corregir cuando se toque cada página
1. **Cuatro negros de fondo distintos**: `Layout` usa `bg-zinc-800`, inicio y Sensa lo cambian a `black`, Trazo usa `#080b0f` y el bloque "Soluciones arquitectónicas" se ve gris carbón. → Un solo `bg-black`.
2. **"Aplicaciones" del inicio en `bg-gray-200`**: un gris frío que rompe con la paleta cálida. → `bg-[#f1ede7]`.
3. **Botones grises** `bg-zinc-600 rounded` ("Ver más sobre Earthic", "Ver más sobre Lechic") que parecen deshabilitados. → Botón secundario de borde piedra, con textos "Ver Earthic" y "Ver Le Chic".
4. **Degradados en botones** (`from-[#313131] to-[#141414]` y `from-[#f0f2ed] to-[#dbd6ca]` en `showroom.astro`). → Colores sólidos.
5. **Precio de promoción en `border-red-500 text-red-300` con `opacity-50`**: el precio que vende se ve apagado y en rojo de error. → Precio grande en blanco y etiqueta de promoción en piedra.
6. **Barra "Catálogo de promociones 🔥" en `bg-orange-300`** a todo lo ancho: rompe la sobriedad.
7. **Esquinas mezcladas**: `rounded`, `rounded-xl` (Trazo, 21 usos), `rounded-2xl` y rectas. → Rectas.
8. **Títulos con `font-bold` o `font-semibold`** en Dekton y showroom, junto a otros `font-thin`. → Peso ligero y consistente.
9. **Jerarquía del héroe del inicio**: el subtítulo "Alternativas de Calidad Superior al Mármol…" está en `font-thin`, en mayúsculas de título y se pierde sobre la foto.
10. **Muchas imágenes con `alt=""`** (Sensa, logos del catálogo).
11. **Clases rotas**: `w-[400wv]` y `md:w-[w-90]` en Sensa, y `background-position:;` vacío en el inicio.
12. **El inicio no tiene un CTA de conversión**: termina en "Aplicaciones" sin muestra, WhatsApp ni showroom.
13. **Dato de negocio por confirmar**: `/showroom` y `detalle-producto/showroom.astro` dicen "Pachuca o Querétaro"; el equipo de ventas habla de Querétaro y de León (en construcción). **Pregunta antes de cambiarlo.**

## Páginas
| Ruta | Estado |
|---|---|
| `/` | Héroe, Earthic/Le Chic, "Soluciones", "Aplicaciones". Sin CTA final. |
| `/dekton`, `/silestone`, `/sensa` | Landings de marca: portada, carrusel de ventajas, imagen + texto y `Moreproducts*` (Contentful). |
| `/catalogo` | Cuadrícula de modelos desde Contentful. |
| `/catalogo-promos`, `/catalogo-promociones` | Catálogo de promociones escrito a mano (más de 2,000 líneas por archivo). Candidatos a convertirse en componente `TarjetaPromo`. |
| `/earthic`, `/lechic` | Lanzamientos de Silestone. |
| `/showroom`, `/agenda`, `/enviado`, `/confirm-calendly` | Conversión y confirmaciones. |
| `/trazo` | Formulario de registro para Cesantoni/Trazo (diseño más reciente). |
| `/blog`, `/posts/[slug]`, `/tags` | Blog. |
