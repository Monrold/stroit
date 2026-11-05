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

No necesita un proyecto aparte en Cloudflare. No sale en el menú ni en el sitemap, y `robots.txt` y la etiqueta `noindex` piden a los buscadores que no la indexen.

## Contraseña

Toda la ruta `/cesantoni-formatos/` muestra primero una pantalla de acceso con el logo de Cesantoni, que pide solo la contraseña. Esto lo hace `functions/cesantoni-formatos/_middleware.js`, una Pages Function que corre en Cloudflare. Sin sesión no se entrega ningún archivo del formulario; el logo es lo único público.

- La contraseña es la variable `FORMATOS_PASSWORD`, que va como **Secret** en Cloudflare → Workers & Pages → stroit → Settings → Variables and Secrets (en Production y, si se usan vistas previas, también en Preview). Sin ella la ruta responde "no configurado" y no deja entrar a nadie.
- Al entrar se guarda una cookie firmada que dura 7 días. "Salir", arriba a la derecha, cierra la sesión.
- Si se cambia la contraseña, todas las sesiones abiertas se cierran. Después de cambiarla hay que volver a desplegar (Deployments → Retry deployment).

## Folios automáticos y vendedores

El folio de cada formato (SF-0001, EN-0001…) se asigna solo, al dar **Descargar PDF** o **Imprimir**, y sigue un consecutivo compartido por todos los equipos. Si se vuelve a descargar el mismo formato, conserva su folio; **Limpiar** empieza uno nuevo. El campo Asesor es una lista que se llena desde la pestaña **Configuración**, donde también se puede fijar el siguiente número de cada folio.

Esto usa una base de datos D1 de Cloudflare. Se configura una sola vez:

1. Cloudflare → Storage & Databases → D1 SQL Database → Create → nombre `cesantoni-formatos`.
2. Workers & Pages → stroit → Settings → Bindings → Add → D1 database → Variable name `FORMATOS_DB` → elegir `cesantoni-formatos` → Save. Hazlo en Production (y en Preview si se usan vistas previas).
3. Deployments → Retry deployment del último de Production.

Las tablas se crean solas la primera vez. Si `FORMATOS_DB` no está enlazada, el formulario sigue funcionando, pero el folio y el asesor se escriben a mano y la pestaña Configuración lo avisa.

API (protegida por la misma sesión): `functions/cesantoni-formatos/api/[[ruta]].js`.

## Historial

Cada formato se guarda en la base (tabla `formatos`, por folio) cuando se descarga el PDF o se imprime. La pestaña Historial muestra los 200 más recientes, con búsqueda por folio, cliente o contacto, asesor y folio de venta, y filtro por tipo. Se puede filtrar por vendedor y por mes (según la fecha en que se hizo el formato, últimos 24 meses). Eliminar quita el registro (pide confirmación) y no regresa el consecutivo; para reiniciar tras borrar pruebas, ajustar el siguiente folio en Configuración. Abrir un formato lo carga en su formulario con el mismo folio; si se corrige y se vuelve a descargar, se actualiza el registro en lugar de crear uno nuevo. Para un formato nuevo, usar Limpiar primero.

## Sin conexión y celular

La página se guarda en el equipo (service worker `sw.js`) la primera vez que se abre con internet, y se puede instalar en el celular con "Agregar a pantalla de inicio" (`manifest.webmanifest`).

Sin internet se puede llenar y descargar o imprimir. Como el consecutivo lo da el servidor, el folio sale provisional (`SF-P7K3Q`, `EN-P…`) y el formato queda en una cola local. Al volver la conexión, la app pide el folio definitivo, sube cada pendiente al historial (guardando el provisional en `folioProvisional`, que también se puede buscar) y avisa el cambio, por ejemplo `SF-P7K3Q → SF-0015`. Para el PDF con el folio definitivo, abrirlo desde Historial y volver a descargarlo.

Los pendientes viven en el navegador de ese equipo: si se borran los datos del navegador antes de reconectar, se pierden. El historial y la configuración requieren conexión.

## Archivos

- `index.html`: formularios y hojas carta.
- `assets/formatos.css`: diseño de las hojas (el mismo de las plantillas PDF).
- `assets/app.css`: diseño de la página del formulario.
- `assets/app.js`: vista previa, cantidad con letra, borrador local y generación del PDF.
- `assets/vendor/html2pdf.bundle.min.js`: html2pdf.js 0.10.1 (MIT), incluido para no depender de un CDN.
- `assets/cesantoni-logo.svg`: logo.
- `functions/cesantoni-formatos/_middleware.js` (en la raíz del repo): la contraseña.
- `functions/cesantoni-formatos/api/[[ruta]].js`: folios consecutivos, vendedores e historial (D1).

Para probarlo localmente sin contraseña: `python3 -m http.server -d public/cesantoni-formatos` y abrir http://localhost:8000. Con contraseña y base de datos: `npx wrangler pages dev public --d1 FORMATOS_DB=local` desde la raíz del repo, con un archivo `.dev.vars` que tenga `FORMATOS_PASSWORD=...`.
