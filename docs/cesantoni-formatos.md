# Formatos Cesantoni

Formulario web para llenar y descargar en PDF tamaño carta dos formatos de Cesantoni Porcelanato Premium:

- **Saldo a favor**
- **Registro de entrega a domicilio**

Es un sitio estático (HTML, CSS y JS sin compilación). No tiene servidor ni base de datos: el PDF se arma en el navegador. Vive en `public/` del sitio de Stroit y Astro la copia sin procesarla.

## Uso

1. Elige el formato en la pestaña de arriba.
2. Llena el formulario; la vista previa se actualiza al momento.
3. **Descargar PDF** baja el archivo listo para imprimir. **Imprimir** abre el diálogo del navegador (también sirve "Guardar como PDF").

El navegador guarda un borrador de lo capturado en ese equipo. **Limpiar** vacía el formato actual. Nada se envía a ningún servidor.

## Dónde vive

Está dentro de `public/cesantoni-formatos/` del sitio de Stroit. Astro copia esa carpeta tal cual, así que se publica junto con el sitio en:

https://stroitsurfaces.com/cesantoni-formatos/

No necesita un proyecto aparte en Cloudflare. No sale en el menú ni en el sitemap, y `robots.txt` y la etiqueta `noindex` piden a los buscadores que no la indexen. Cualquiera que tenga el enlace la puede abrir. Si se quiere limitar al personal, se puede proteger esa ruta con Cloudflare Zero Trust → Access (gratis hasta 50 usuarios).

## Archivos

- `index.html`: formularios y hojas carta.
- `assets/formatos.css`: diseño de las hojas (el mismo de las plantillas PDF).
- `assets/app.css`: diseño de la página del formulario.
- `assets/app.js`: vista previa, cantidad con letra, borrador local y generación del PDF.
- `assets/vendor/html2pdf.bundle.min.js`: html2pdf.js 0.10.1 (MIT), incluido para no depender de un CDN.
- `assets/cesantoni-logo.svg`: logo.

Para probarlo localmente: `python3 -m http.server -d public/cesantoni-formatos` y abrir http://localhost:8000.
