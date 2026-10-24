# Stroit Surfaces: resumen del proyecto (al 24 de octubre de 2026)

Documento de contexto para el proyecto **Stroit Surfaces** en Claude. Reúne lo que se ha construido en el repositorio `monrold/stroit`: el sitio web, la infraestructura de catálogos y los dos skills (atención de leads y diseño web).

---

## 1. El negocio

- **Stroit Surfaces** es distribuidor de **Cosentino**: **Dekton** (ultracompacto, interior y exterior, 25 años de garantía), **Silestone** (cuarzo, solo interior) y **Sensa** (granito y cuarcita natural con tratamiento antimanchas, 15 años de garantía).
- **Dos regiones:**
  - **Bajío**: bodega y showroom en Querétaro (TerraPark Centenario, bodega 61E, El Marqués). Tel. 442 269 0555. Showroom de León en construcción. Cubre Querétaro, Guanajuato, Aguascalientes y San Luis Potosí.
  - **Hidalgo/Centro**: bodega en Pachuca (Blvd. Santa Catarina 2503-k, int. 11). Tels. 771 262 0413 y 771 489 6576. Cubre Hidalgo, CDMX, Edomex, Puebla, Veracruz, Morelos y Guerrero.
- **Qué vendemos y qué no:** se vende **por placa completa** (≈3.20 x 1.45 m, ≈4.6 m²; las jumbo llegan a ≈3.36 x 1.67 m). **No instalamos, no cortamos a medida y no hacemos bases ni muebles**; sí recomendamos instalador.
- **Envío sin costo:**
  - Bajío: Querétaro siempre y sin esperar. Guanajuato, Aguascalientes y SLP en flete consolidado (sin fecha fija, no se promete día).
  - Hidalgo: Pachuca, CDMX y Edomex.
  - Al resto se cotiza flete; si es urgente, flete dedicado aparte.
- **Profesionales** (arquitectos, carpinteros, marmolerías, constructores): 15 % de descuento sobre lista.
- **Origen de los leads:** casi todos llegan de anuncios de **Meta** (Facebook/Instagram → WhatsApp) con "¡Hola! Quiero más información". Se atienden en **ParrotCRM**.

---

## 2. Sitio web: stroitsurfaces.com

- **Stack:** Astro 5 + Tailwind 3 + React. El contenido de los modelos viene de **Contentful** (content type `stroit`, `src/lib/contentful.ts`).
- **Analítica:** PostHog, Google, Pixel de Meta y evento de pageview (todo dentro de `Layout.astro`).
- **Páginas principales:**

| Ruta | Qué es |
|---|---|
| `/` | Inicio: héroe, Earthic y Le Chic, "Soluciones" y "Aplicaciones" |
| `/dekton`, `/silestone`, `/sensa` | Landings por marca, con modelos desde Contentful |
| `/catalogo` | Cuadrícula de modelos (Contentful) |
| `/catalogo-promos`, `/catalogo-promociones` | Catálogo de promociones escrito a mano |
| `/earthic`, `/lechic` | Lanzamientos de Silestone |
| `/showroom`, `/agenda`, `/enviado`, `/confirm-calendly` | Citas, agenda y confirmaciones |
| `/trazo` | Formulario de registro para Cesantoni/Trazo (el diseño más reciente) |
| `/blog`, `/posts/[slug]`, `/tags`, `/articulos/que-es-dekton` | Blog y SEO |
| `/privacy`, `/404`, `/cards/mayra`, `/invitacion` | Aviso de privacidad, error y tarjetas digitales |

- **Ya hecho en el sitio:** sitemap y slugs por marca, redirects (`public/_redirects`), página 404, aviso de privacidad, blog con etiquetas, landing de citas con agenda, Pixel de Meta, PostHog, catálogo de promociones y la tarjeta digital de vendedora (vCard en `public/sindy.vcf`).

---

## 3. Catálogos y fotos en Cloudflare R2

- La carpeta `catalogos/` del repo se sube sola al bucket de **Cloudflare R2** con una GitHub Action (`.github/workflows/sync-catalogos-r2.yml`) cada vez que cambia en `main`.
- Se publica en `https://cdn.stroitsurfaces.com/catalogos/<marca>/<archivo>` (nombres en minúsculas, con guiones y sin espacios).
- Ahí viven las **fotos reales de cada placa en bodega**, con su precio, los **catálogos PDF del mes** y las imágenes de las cuentas bancarias.
- **Catálogos de octubre 2026:**
  - Dekton promociones (55 págs.): `cdn.stroitsurfaces.com/catalogos/dekton/catalogo-dekton-octubre-stroitsurfaces.pdf`
  - Dekton Flash Sale, los más económicos (8 págs.): `cdn.stroitsurfaces.com/catalogos/flash-sale/catalogo-flashsale-octubre-stroitsurfaces.pdf`
  - Silestone (18 págs.): `cdn.stroitsurfaces.com/catalogos/silestone/catalogo-silestone-octubre-stroitsurfaces.pdf`
  - Sensa (29 págs.): `cdn.stroitsurfaces.com/catalogos/sensa/catalogo-sensa-octubre-stroitsurfaces.pdf`
- **Cada mes:** se suben las fotos nuevas de las placas y se regenera la tabla de modelos en existencia del skill de leads.

---

## 4. Skill `stroit-atencion-leads` (ventas por WhatsApp, Facebook e Instagram)

Ruta: `.claude/skills/stroit-atencion-leads/`. Atiende a un lead desde el primer mensaje hasta el pago, como asesor de ventas.

### Cómo responde
- **Dos modos de cliente:**
  - **PRISA** (pide precio o medidas): primero se le da el **rango de precio por placa** y después **una sola pregunta**. Nunca se contesta un precio con otra pregunta.
  - **EXPLORA** (no sabe qué quiere): perfilamiento con mensajes de 2 o 3 líneas y una pregunta a la vez.
- **Cinco datos para cotizar:** aplicación, color/estilo, medidas o m², ciudad y fecha/urgencia.
- **Método Campamento de Ventas:** situación → dolor → deseo → **urgencia** (la más importante). La urgencia se descubre, no se inventa.
- **Qué material recomendar:**
  - Exterior, fachada, piso de exterior o asador → **Dekton** siempre.
  - Interior con el mejor precio y look de cuarzo o mármol → **Silestone**.
  - Piedra natural auténtica → **Sensa**.
  - Muros ligeros → Dekton Slim (4 u 8 mm).
  - Pisos en baño o exterior → acabado Grip (sobre pedido).
- **Modelos solo cuando el cliente ya dijo un color.** Entonces se mandan al menos 6, agrupados por color, con foto, precio y por qué encajan. El color se traduce a **color base, subtono (frío o cálido) y vetas**.
- **Catálogo:** si lo pide, se manda el enlace del PDF de inmediato, sin recomendar modelos, y se pregunta el tono.
- **No dar precio por m²** salvo que lo pida.
- **Si dice "está caro":** se reconoce, se explica la inversión y se ofrecen opciones más baratas del mismo color (desde Sensa $9,310, Silestone $14,220 y Dekton Flash Sale $15,723).
- **Estilo:** español de México, tuteo, mensajes cortos, `*negritas*` de WhatsApp, 1 o 2 emojis. Cada mensaje termina con una pregunta o un siguiente paso; nunca "quedo al pendiente".
- **Antes de responder** se revisan: el anuncio de origen, las preguntas sin contestar, la ventana de 24 h de WhatsApp (fuera de ella solo va plantilla aprobada) y las respuestas del bot programadas, que hay que cancelar.

### Cotizador en PDF
- Carpeta `cotizador/`: se escribe un JSON con los datos del cliente y `python3 cotizar.py <json> <salida>` genera el PDF con logo, región, cuenta bancaria y mano de obra.
- **Placas** = m² ÷ m² por placa, redondeado hacia arriba, más 10 a 15 % de desperdicio. De cada placa salen dos tiras de 60 cm de fondo.
- **Mano de obra aproximada** (siempre se incluye como referencia; no la cobra Stroit):
  - **Bajío (real):** $2,000 por metro lineal de cubierta (rango real $1,800 a $2,100; se da un solo número). Incluye tarja, parrilla y zoclo de hasta 20 cm. Backsplash, cascadas y zoclo de más de 20 cm se cobran aparte a $2,000 por ml.
  - **Hidalgo y piso/muro:** tarifas de prueba, por confirmar.
- **Condiciones:** material de promoción y sobre pedido, sin cambios ni devoluciones; no incluye maniobra de descarga.

### Formas de pago (primero se pregunta cómo quiere pagar)
- **Tarjeta:** link de Mercado Pago (lo genera el vendedor).
- **Transferencia:** imagen de la cuenta de su región:
  - Bajío (Santander): `cdn.stroitsurfaces.com/catalogos/cuenta-bajio.jpeg`
  - Hidalgo (Inbursa): `cdn.stroitsurfaces.com/catalogos/cuenta-centro.jpeg`
- **Efectivo:** se agenda cita en la bodega de su región.

### Notas de voz con ElevenLabs
- Voz femenina mexicana **Ana María** (modelo `eleven_v4`). Máximo ≈40 s, cifras escritas con palabras y una pregunta al final.
- **Audio o texto se decide en cada mensaje:**
  - Audio: cliente enfriándose, seguimiento tras silencio, explicaciones, objeciones, preguntas de dolor y urgencia, cotización y cierre.
  - Texto: modo PRISA, catálogos, modelos, cuentas, primer mensaje o si el audio anterior no tuvo respuesta.
- Formato del archivo: `.ogg` para WhatsApp y `.mp3` para Instagram y Facebook.

### Pruebas A/B en curso
- **Precio** (último dígito del WhatsApp o del ID de Instagram/Facebook): par → **A · Económicos**, impar → **B · Premium**, siempre dentro del color que pidió el cliente.
- **Formato** (penúltimo dígito, solo en zona gris): par → texto, impar → audio.
- Se registran en el lead de ParrotCRM con `abPrecio`, `abFormato` y `formatoMotivo`.

### Seguimiento
- A las 24 h, a los 3 días y a los 7 días, cada vez con algo nuevo (fotos instaladas, un modelo, la promo o una muestra gratis).
- Si el cliente vuelve desde otro anuncio, se retoma lo que ya se habló.
- No se usa la plantilla genérica con clientes que ya platicaron.
- **Caso real de referencia:** Luis Montaño (Instagram, octubre 2026). Dekton para cocina → Borealis → croquis → ciudad → PDF → "¿Te aparto la placa?".

### ParrotCRM
- Se lee la conversación con `read_crm`.
- Solo con aprobación del usuario: notas concisas (`add_note`), leads (`create_lead` o `update_lead`) y actividades de seguimiento.
- El MCP no envía mensajes: se entrega el texto listo para copiar.

### Referencias del skill
| Archivo | Qué contiene |
|---|---|
| `productos.md` | Ficha técnica de Dekton, Silestone y Sensa |
| `modelos.md` | 93 modelos en existencia de octubre 2026, con precio, look, foto y guía por color |
| `guiones.md` | Guiones de respuesta, recontacto, formas de pago y formato de nota |
| `preguntas-urgencia.md` | Banco de preguntas del método Campamento de Ventas |
| `audio.md` | Reglas y pasos de las notas de voz |
| `ab-testing.md` | Pruebas A/B de precio y formato |
| `errores-detectados.md` | Errores frecuentes de los vendedores y cómo corregirlos |

---

## 5. Skill `stroit-diseno-web` (diseño del sitio)

Ruta: `.claude/skills/stroit-diseno-web/`.

- **Concepto:** showroom digital de lujo. La piedra es la protagonista: fotos grandes, mucho aire y poco texto. Referencia de nivel: **cosentino.com** (para diseño, todo el sitio; para información, solo `/es-mx/`), sin copiarlo.
- **Paleta:**
  - Fondo `bg-black` (un solo negro en todo el sitio) y superficies `zinc-950`.
  - Fondo claro cálido `#f1ede7`.
  - **Acento piedra `#dbd6ca`** (el color de marca) y dorado `#bfa986` solo en detalles.
  - Prohibido: degradados en botones, rojos o naranjas a todo lo ancho y grises fríos.
- **Tipografía:** la del sistema. Títulos ligeros (`font-extralight` o `font-light`) en mayúsculas para los héroes; nada de negritas en títulos.
- **Forma:** esquinas rectas. Tres estilos de botón (principal piedra, secundario con borde, enlace con flecha →). CTA flotante "Cotiza por WhatsApp" en las páginas de producto. Cada página termina con un CTA de conversión.
- **Proceso obligatorio:** capturas de antes y después en celular (390 px) y escritorio (1440 px) con `scripts/capturas.cjs`. Trabajar por secciones y pedir referencias si el pedido es vago.
- **Preferencia registrada del dueño (13-oct-2026):** no le gustaron cambios de diseño anteriores hechos sin mostrar avances. De ahí la regla: cambios por secciones, con capturas, antes de hacer commit.
- **Auditoría (`references/auditoria.md`):** se detectaron 13 inconsistencias para corregir cuando se toque cada página. Entre ellas: 4 negros distintos, botones grises, degradados, precio de promoción en rojo apagado, esquinas mezcladas, `alt` vacíos y un inicio sin CTA final.
- **Dato por confirmar:** el sitio dice showroom en "Pachuca o Querétaro", pero ventas habla de Querétaro y León.

---

## 6. Pendientes y datos por confirmar

1. Tarifas reales de mano de obra de **Hidalgo** y de **piso/muro** (hoy son de prueba).
2. Si **Querétaro** tiene envío directo sin costo siempre (está marcado como "por confirmar").
3. Las ciudades de showroom que muestra el sitio (Pachuca/Querétaro frente a Querétaro/León).
4. Actualizar `modelos.md` y los catálogos PDF cada mes con las fotos nuevas de bodega.
5. Medir los resultados de las pruebas A/B (económicos vs. premium; texto vs. audio).
6. Rediseño del sitio por secciones, aplicando la auditoría y con aprobación del dueño en cada paso.
7. Convertir los catálogos de promociones escritos a mano (más de 2,000 líneas) en un componente `TarjetaPromo`.

---

## 7. Historial resumido (pull requests)

| PR | Qué se hizo |
|---|---|
| #1 | GitHub Action para sincronizar `catalogos/` con Cloudflare R2 |
| #2 | Se crea el skill de atención de leads hasta la cotización |
| #3 | Skill de diseño web, con la referencia de cosentino.com verificada en vivo |
| #5 | Modelos en existencia de octubre con fotos en R2, catálogos PDF y Flash Sale; los modelos se mandan solo cuando el cliente dice un color |
| #6 | A/B por color, sin precio por m² y notas concisas |
| — | Cotizador con plantilla, formas de pago por región y fotos de las cuentas bancarias |
| #7 | Aprendizajes del caso Luis Montaño, cuentas reales y envíos por región |
| #8 | Notas de voz con ElevenLabs y prueba A/B de texto vs. audio |
| #10 | Método Campamento de Ventas (preguntas de urgencia) |
| #11 | Audio o texto según la conversación, con A/B solo en zona gris |
| #12 | Mano de obra del Bajío a $2,000/ml, envío por estado y descripciones precisas de cada modelo |
