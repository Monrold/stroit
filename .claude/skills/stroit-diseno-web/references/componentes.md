# Componentes estándar (Tailwind)

Copia estos patrones en lugar de inventar estilos. Si uno aparece en más de una página, conviértelo en componente en `src/components/`.

## Botones
```html
<!-- Principal: la acción que vende -->
<a href="…" class="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#dbd6ca] text-black font-medium tracking-wide hover:bg-[#cbbfae] transition-colors">
  Solicitar muestra <span aria-hidden="true" class="ml-3">→</span>
</a>

<!-- Secundario: navegar a algo importante -->
<a href="…" class="inline-flex items-center justify-center min-h-[48px] px-8 border border-[#dbd6ca] text-[#dbd6ca] hover:bg-[#dbd6ca] hover:text-black transition-colors">
  Ver catálogo <span aria-hidden="true" class="ml-3">→</span>
</a>

<!-- Enlace con flecha (como "Ver color →" de Cosentino) -->
<a href="…" class="group inline-flex items-center gap-2 text-white underline underline-offset-8 decoration-white/30 hover:decoration-white">
  Ver modelo <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
</a>
```

## Encabezado de sección
```html
<header class="max-w-2xl">
  <p class="text-xs uppercase tracking-[0.2em] text-zinc-400">Dekton</p>
  <h2 class="mt-3 text-3xl md:text-4xl font-light text-white">Resiste el sol, el calor y el uso diario</h2>
  <p class="mt-4 text-zinc-400 leading-relaxed">Una frase que explica el beneficio. Dos como máximo.</p>
</header>
```

## Héroe con foto
```html
<section class="relative h-[70vh] min-h-[480px] flex items-end">
  <img src="…" alt="Cocina con isla de Dekton Laurent" class="absolute inset-0 h-full w-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
  <div class="relative max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-10 pb-16">
    <p class="text-sm text-zinc-200">Distribuidor Cosentino en el Bajío</p>
    <h1 class="mt-3 text-5xl md:text-7xl font-extralight uppercase tracking-tight leading-[0.95] text-white">Cocinas<br/>Baños<br/>Pisos<br/>Fachadas</h1>
    <p class="mt-6 text-xs text-zinc-300">Dekton · Laurent</p> <!-- modelo de la foto, como hace Cosentino -->
    <div class="mt-8 flex flex-wrap gap-4"><!-- botón principal + secundario --></div>
  </div>
</section>
```

## Imagen + texto alternado
```html
<section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-28">
  <div class="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
    <img src="…" alt="…" class="w-full aspect-[4/5] object-cover" />
    <div><!-- encabezado de sección + enlace con flecha --></div>
  </div>
</section>
<!-- La siguiente sección invierte el orden: en la imagen, `lg:order-2` -->
```

## Tarjeta de modelo (catálogo, muestra vertical como Cosentino)
```html
<a href="…" class="group block">
  <h3 class="text-base text-white">Kreta</h3>
  <p class="text-xs text-zinc-500">Dekton · Industrial</p>
  <div class="mt-3 overflow-hidden bg-zinc-950">
    <img src="…" alt="Placa de Dekton Kreta" class="w-full aspect-[3/5] object-cover transition-transform duration-500 group-hover:scale-105" />
  </div>
  <p class="mt-3 text-sm text-zinc-400">320 × 144 cm · 12 mm · Mate</p>
  <span class="mt-2 inline-flex items-center gap-2 text-sm text-white underline underline-offset-8 decoration-white/30 group-hover:decoration-white">Ver modelo <span aria-hidden="true">→</span></span>
</a>
```
En una cuadrícula: `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10`. En carrusel de celular, que se vea parte de la siguiente tarjeta (`w-[42vw] shrink-0 snap-start`).

## Indicador de carrusel (en lugar de "Desliza →")
```html
<div class="flex items-center gap-6">
  <span class="text-sm text-zinc-400 tabular-nums">01/04</span>
  <div class="relative h-px flex-1 bg-white/20"><div class="absolute inset-y-0 left-0 w-1/4 bg-white"></div></div>
  <button aria-label="Anterior" class="text-white/40">←</button>
  <button aria-label="Siguiente" class="text-white">→</button>
</div>
```

## Ficha técnica de modelo (4 columnas, como la ficha de color de Cosentino)
```html
<dl class="grid grid-cols-2 lg:grid-cols-4 gap-8">
  <div><dt class="pb-2 border-b border-white/20 text-sm uppercase tracking-wider text-white">Acabados</dt><dd class="pt-3 text-zinc-400">Mate</dd></div>
  <div><dt class="pb-2 border-b border-white/20 text-sm uppercase tracking-wider text-white">Espesores</dt><dd class="pt-3 text-zinc-400">12 mm · 20 mm</dd></div>
  <div><dt class="pb-2 border-b border-white/20 text-sm uppercase tracking-wider text-white">Formato</dt><dd class="pt-3 text-zinc-400">320 × 144 cm</dd></div>
  <div><dt class="pb-2 border-b border-white/20 text-sm uppercase tracking-wider text-white">Precio</dt><dd class="pt-3 text-white">$17,929 <span class="text-zinc-400">por placa</span></dd></div>
</dl>
```

## Precio de promoción
```html
<div class="mt-6">
  <p class="text-sm text-zinc-500">Precio de lista <span class="line-through">$51,225</span></p>
  <p class="mt-1 flex items-baseline gap-3">
    <span class="text-3xl font-medium text-white">$17,929</span>
    <span class="text-sm text-zinc-400">MXN por placa</span>
    <span class="text-xs uppercase tracking-wider bg-[#dbd6ca] text-black px-2 py-1">Promoción</span>
  </p>
</div>
```
Formato de precio: `$17,929` (coma de miles sin espacio; el sitio actual tiene `$27, 063`, con un espacio de más). Siempre di "por placa".

## Campo de formulario (estilo Trazo, con esquinas rectas)
```html
<label for="nombre" class="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-400">Nombre <span class="text-[#dbd6ca]">*</span></label>
<input id="nombre" name="name" class="h-12 w-full border border-white/10 bg-[#111] px-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#dbd6ca]/60" />
```

## CTA flotante "Cotiza por WhatsApp" (páginas de producto y catálogo)
Equivalente al "Pide presupuesto" fijo de Cosentino, pero en piedra. Usa el mismo número y mensaje prellenado que `detalle-producto/showroom.astro`.
```html
<!-- Escritorio: pestaña lateral -->
<a href="https://api.whatsapp.com/send?phone=…&text=…" target="_blank" rel="noopener"
   class="hidden lg:flex fixed right-0 top-1/3 z-40 items-center gap-3 bg-[#dbd6ca] px-6 py-4 text-black font-medium shadow-lg hover:bg-[#cbbfae]">
  Cotiza por WhatsApp <span aria-hidden="true">→</span>
</a>
<!-- Celular: barra inferior fija (deja espacio al final de la página con pb-16) -->
<a href="https://api.whatsapp.com/send?phone=…&text=…" target="_blank" rel="noopener"
   class="lg:hidden fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-center gap-3 bg-[#dbd6ca] text-black font-medium">
  Cotiza por WhatsApp <span aria-hidden="true">→</span>
</a>
```
Si se usa en varias páginas, conviértelo en `src/components/CtaFlotante.astro` y agrégalo desde `Layout.astro` con una prop para activarlo.

## Preguntas frecuentes (acordeón sin JavaScript)
```html
<details class="group border-b border-white/10 py-5">
  <summary class="flex cursor-pointer list-none items-center justify-between text-lg text-white">
    ¿Se vende por metro cuadrado?
    <span class="text-2xl font-extralight transition-transform group-open:rotate-45">+</span>
  </summary>
  <p class="mt-3 text-zinc-400 leading-relaxed">No, se vende por placa completa…</p>
</details>
```

## Bloque CTA final (en cada página)
Reutiliza `components/detalle-producto/showroom.astro`. Si haces uno nuevo: foto del showroom o material a un lado; título, una línea y los botones "Solicitar muestra" (principal) y "Encontrar showroom" (secundario) al otro.
