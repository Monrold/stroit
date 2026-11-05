// Guarda la app en el equipo para que abra y genere PDF sin conexión.
// La API (folios, historial) nunca se guarda aquí: la app maneja sola los pendientes.
const CACHE = 'cesantoni-formatos-v1';
const BASE = new URL('./', self.location).pathname; // /cesantoni-formatos/
const APP = [
  './',
  'assets/formatos.css',
  'assets/app.css',
  'assets/app.js',
  'assets/vendor/html2pdf.bundle.min.js',
  'assets/cesantoni-logo.svg',
  'assets/icon-192.png',
  'manifest.webmanifest',
];
const FUENTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(APP.map((u) =>
        fetch(u, { credentials: 'same-origin', cache: 'no-store' })
          .then((r) => (r.ok && !r.redirected ? cache.put(u, r) : null))
          .catch(() => null)
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('cesantoni-formatos-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Red primero para la página (así el acceso con contraseña sigue funcionando); sin red, la copia guardada
function pagina(request) {
  return fetch(request).then((r) => {
    if (r.ok && !r.redirected) {
      const copia = r.clone();
      caches.open(CACHE).then((c) => c.put(BASE, copia));
    }
    return r;
  }).catch(() => caches.match(BASE).then((r) => r || Response.error()));
}

// Copia guardada al instante y se actualiza en segundo plano
function recurso(request, event) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request).then((guardado) => {
      const red = fetch(request).then((r) => {
        if (r.ok || r.type === 'opaque') cache.put(request, r.clone());
        return r;
      });
      if (guardado) {
        event.waitUntil(red.catch(() => null));
        return guardado;
      }
      return red;
    })
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (FUENTES.includes(url.hostname)) { event.respondWith(recurso(request, event)); return; }
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (url.pathname.startsWith(BASE + 'api/')) return;

  if (request.mode === 'navigate') { event.respondWith(pagina(request)); return; }
  if (url.pathname.startsWith(BASE + 'assets/') || url.pathname === BASE + 'manifest.webmanifest') {
    event.respondWith(recurso(request, event));
  }
});
