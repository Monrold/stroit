# Referencia: cosentino.com

✅ **Verificado en vivo el 13-oct-2026** con capturas en escritorio (1440 px) y celular (390 px) de `/es-mx/`, `/es-mx/dekton/`, `/es-mx/colores/dekton/nara/`, `/es-mx/cocinas/` y `/es-mx/donde-comprar/`, más los estilos calculados del navegador. Si el sitio cambia, vuelve a capturarlo y actualiza esta página.

## Regla de uso (indicada por el dueño)
- **Diseño**: puedes analizar **todo** cosentino.com, en cualquier país o idioma: layout, componentes, tipografía, ritmo, fotos y navegación.
- **Información** (textos, datos de producto, colecciones, garantías, acabados, formatos, colores disponibles): tómala **solo de `https://www.cosentino.com/es-mx/`**. Otras versiones de país pueden tener catálogo, garantías o nombres distintos que no aplican en México. Si un dato no está en /es-mx, no lo uses; márcalo como `[confirmar]`.
- Acceso desde el entorno en la nube: el dominio `*.cosentino.com` ya está permitido en la red.

## Lo que se observó

### Tipografía
- Fuente propia **Diagramm** (comercial, con licencia; **no la uses**). Es una grotesca limpia y algo geométrica. Alternativas libres parecidas en Google Fonts: **Hanken Grotesk** o **Manrope** (pregunta antes de agregar una fuente).
- **Títulos en MAYÚSCULAS y muy ligeros** en el inicio: el héroe "COCINAS / BAÑOS / FACHADAS / CONTRACT" va a 75 px con peso 200, y "MEANINGFUL DESIGN TO INSPIRE PEOPLE'S LIVES" o "GALERÍAS DE INSPIRACIÓN" a unos 38 px con peso 300. Es su firma visual.
- En las páginas de marca y de color mezclan títulos en minúsculas con peso 400–500 ("Tú las imaginas, Dekton las hace realidad" a 48 px; "Nara" a 40 px).
- Antetítulos pequeños sobre el título: "Cosentino Architectural Surfaces", "¿QUÉ ES DEKTON?" a 20 px en mayúsculas.
- Texto corrido de 14 a 16 px, gris oscuro `#3c3c3b`, con interlineado amplio.

### Color
- Base **clara**: blanco, grises cálidos (`#ececE8` y `#e5e5e1`) en bloques alternos, texto `#232323` / `#3c3c3b`.
- Footer gris carbón `#232323`, con 4 columnas de enlaces.
- En la página de Dekton aparecen bloques de color apagado (azul grisáceo, verde salvia) para destacar secciones.
- Un único acento chillón: el botón flotante **"Pide presupuesto"** en amarillo `#ffed72`.

### Botones y enlaces
- **Rectangulares, sin esquinas redondeadas** (`border-radius: 0`): borde de 1 px gris oscuro o relleno `#3f3f3e`, texto de 14 px, relleno de 11×23 px y **flecha →** ("Dónde comprar →", "Saber más sobre Hybriq+ →", "Quiero suscribirme →").
- **Enlaces de texto con flecha y subrayado**: "Ver color →".
- Botones en forma de píldora **solo en el menú** ("Dónde Comprar", "Área Profesional").
- **CTA flotante fijo** "Pide presupuesto" al costado derecho en escritorio y como barra superior en celular. Está siempre visible.

### Estructura del inicio
1. Menú blanco y delgado: logo, selector de país, Colores, Nuestras Marcas, Espacios, Inspiración, Showrooms, Profesionales y la píldora "Dónde Comprar".
2. Héroe a pantalla completa con foto de un espacio real y palabras grandes y ligeras, con el modelo usado en la esquina ("Dekton · Trevi & Polar").
3. Frase de marca centrada, en mayúsculas ligeras.
4. **Explorar por espacio**: pestañas subrayadas (Cocinas, Baños, Otros interiores, Exterior, Contract) y un carrusel de fotos verticales con etiqueta ("Encimeras", "Revestimientos y aplacados", "Fregaderos").
5. **Novedades**: carrusel de tarjetas con antetítulo de marca, título en mayúsculas y la etiqueta "New".
6. **Selector de colores**: filtro de marcas a la izquierda; a la derecha, muestras **verticales y altas** (proporción de 1:2) con el nombre arriba y "Ver color →" abajo, en un carrusel con contador "01/04" y barra de progreso.
7. **Galerías de inspiración**: pestañas por espacio y cuadrícula de fotos de proyectos.
8. Bloques de 50/50 imagen y texto ("¿Tienes una reforma? Podemos ayudarte" → "Dónde comprar →").
9. Newsletter y footer oscuro.

### Ficha de color (`/colores/dekton/nara/`)
- A la izquierda, una galería con miniaturas verticales; a la derecha, migas de pan, el nombre grande ("Nara"), "DEKTON · DK NATURAL", la descripción y certificados.
- **Ficha técnica en 4 columnas** con encabezado y línea: Acabados disponibles, Espesores (con iconos de grosor), Formato y Recursos profesionales.
- Foto de la **tabla (placa) completa** a todo lo ancho.
- "Proyectos realizados con este material" (cuadrícula de fotos).
- Bloque de 50/50: "Encuentra puntos de venta para ver este producto" → "DÓNDE COMPRAR".
- "Colores similares", "Combina Nara como un profesional" y "Solicita tus muestras".

### Página de marca (`/dekton/`)
- Héroe en blanco y negro con el logo de Dekton al centro.
- "¿QUÉ ES DEKTON?" + título en mayúsculas + 2 párrafos.
- Mosaico de bloques de color con titulares grandes.
- Colecciones en dos mitades con foto ("Pietra Kode", "Onirika") y "+ Descubre la colección".
- Acordeón con títulos gigantes ("VENTAJAS", "OPCIONES DE DISEÑO", "INNOVACIONES").
- Aplicaciones en carrusel y "Descubre nuestras novedades" con filtros en píldora por colección.
- **Preguntas frecuentes** en acordeón ("¿Qué suelen buscar los clientes?").

### Celular
- Todo en una columna, con carruseles horizontales que dejan ver la siguiente tarjeta.
- Los filtros de pestañas se vuelven menús desplegables.
- El CTA "Pide presupuesto" pasa a barra fija arriba y el footer se vuelve acordeón.

## Qué adoptar en Stroit
| Cosentino | En Stroit |
|---|---|
| Títulos en mayúsculas muy ligeros | Para héroes y títulos de sección: `uppercase font-extralight` o `font-light`, `tracking-tight`. En blanco sobre negro funcionan igual de bien. |
| Botones rectos con flecha | Botones de Stroit rectos y con `→` al final del texto |
| CTA flotante "Pide presupuesto" | **CTA flotante "Cotiza por WhatsApp"** en piedra `#dbd6ca`: lateral en escritorio y barra inferior en celular (ver `componentes.md`) |
| Muestras verticales con "Ver color →" | Tarjetas de modelo verticales (`aspect-[1/2]` o `aspect-[3/5]`), nombre arriba y "Ver modelo →" |
| Contador "01/04" y barra de progreso en carruseles | Carruseles de Stroit con el mismo indicador en lugar de "Desliza →" |
| Ficha técnica en 4 columnas | Ficha de modelo: Acabados, Espesores, Formato, Precio por placa |
| "Encuentra puntos de venta" 50/50 | Bloque showroom en Querétaro con foto, dirección y "Agendar visita →" |
| "Proyectos realizados con este material" | Fotos de instalaciones reales de clientes de Stroit en el Bajío |
| Preguntas frecuentes en acordeón | FAQ de Stroit (envío, instalación, por placa completa, muestras) |
| Explorar por espacio con pestañas | "Aplicaciones" del inicio convertido en pestañas con modelos recomendados |

## Qué NO copiar
- **La base blanca**: Stroit es oscuro y cálido. Toma el rigor y la estructura, no los colores. Para alternar bloques usa el claro cálido `#f1ede7`.
- **El amarillo** del CTA flotante: en Stroit el acento es el piedra.
- La fuente Diagramm, el logo, los textos o las fotos de Cosentino sin permiso.
- La navegación global (selector de país, Área Profesional, newsletter): Stroit necesita un camino corto, **ver → enamorarse → pedir muestra o cotizar por WhatsApp**.
