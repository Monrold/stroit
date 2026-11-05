# Formatos Cesantoni

Formulario web para llenar y descargar en PDF tamaño carta dos formatos de Cesantoni Porcelanato Premium:

- **Saldo a favor**
- **Registro de entrega a domicilio**

Es un sitio estático (HTML, CSS y JS sin compilación). No tiene servidor ni base de datos: el PDF se arma en el navegador. Esta carpeta es independiente del sitio de Stroit y no la toca el build de Astro.

## Uso

1. Elige el formato en la pestaña de arriba.
2. Llena el formulario; la vista previa se actualiza al momento.
3. **Descargar PDF** baja el archivo listo para imprimir. **Imprimir** abre el diálogo del navegador (también sirve "Guardar como PDF").

El navegador guarda un borrador de lo capturado en ese equipo. **Limpiar** vacía el formato actual. Nada se envía a ningún servidor.

## Publicar en Cloudflare Pages

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → repo `Monrold/stroit`.
2. Configuración de build:
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: *(vacío)*
   - Build output directory: `cesantoni-formatos`
3. (Recomendado) Settings → Builds → Build watch paths → Include: `cesantoni-formatos/*`, para que solo se republique cuando cambie esta carpeta.
4. (Opcional) Custom domains: por ejemplo `formatos.tudominio.com`.
5. (Opcional) Restringir el acceso al personal con Cloudflare Zero Trust → Access → Applications (gratis hasta 50 usuarios), con acceso por correo.

## Archivos

- `index.html`: formularios y hojas carta.
- `assets/formatos.css`: diseño de las hojas (el mismo de las plantillas PDF).
- `assets/app.css`: diseño de la página del formulario.
- `assets/app.js`: vista previa, cantidad con letra, borrador local y generación del PDF.
- `assets/vendor/html2pdf.bundle.min.js`: html2pdf.js 0.10.1 (MIT), incluido para no depender de un CDN.
- `assets/cesantoni-logo.svg`: logo.

Para probarlo localmente: `python3 -m http.server -d cesantoni-formatos` y abrir http://localhost:8000.
