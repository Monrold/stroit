# Componentes estándar (Tailwind)

Copia estos patrones en lugar de inventar estilos. Si uno aparece en más de una página, conviértelo en componente en `src/components/`.

## Botones
```html
<!-- Principal: la acción que vende -->
<a href="…" class="inline-flex items-center justify-center min-h-[48px] px-8 bg-[#dbd6ca] text-black font-medium tracking-wide hover:bg-[#cbbfae] transition-colors">
  Solicitar muestra
</a>

<!-- Secundario: navegar a algo importante -->
<a href="…" class="inline-flex items-center justify-center min-h-[48px] px-8 border border-[#dbd6ca] text-[#dbd6ca] hover:bg-[#dbd6ca] hover:text-black transition-colors">
  Ver catálogo
</a>

<!-- Enlace con flecha -->
<a href="…" class="group inline-flex items-center gap-2 text-white hover:underline underline-offset-4">
  Ver Dekton <span class="transition-transform group-hover:translate-x-1">→</span>
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
    <p class="text-xs uppercase tracking-[0.2em] text-zinc-300">Distribuidor Cosentino en el Bajío</p>
    <h1 class="mt-3 text-4xl md:text-6xl font-light tracking-tight text-white max-w-3xl">Superficies que no se manchan, no se rayan y duran</h1>
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

## Tarjeta de modelo (catálogo)
```html
<article class="group">
  <div class="overflow-hidden bg-zinc-950">
    <img src="…" alt="Placa de Dekton Kreta" class="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
  </div>
  <p class="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-500">Dekton · Industrial</p>
  <h3 class="mt-1 text-2xl font-light text-white">Kreta</h3>
  <p class="mt-1 text-sm text-zinc-400">320 × 144 cm · 12 mm · Mate</p>
</article>
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

## Bloque CTA final (en cada página)
Reutiliza `components/detalle-producto/showroom.astro`. Si haces uno nuevo: foto del showroom o material a un lado; título, una línea y los botones "Solicitar muestra" (principal) y "Encontrar showroom" (secundario) al otro.
