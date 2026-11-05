// Protege /cesantoni-formatos/ con una pantalla de acceso propia (solo contraseña).
//
// Configuración en Cloudflare Pages → Settings → Variables and Secrets:
//   FORMATOS_PASSWORD  (obligatoria, como Secret)
// Si no existe, la ruta queda cerrada para todos.
//
// Al entrar con la contraseña correcta se guarda una cookie firmada (HttpOnly)
// válida por SESION_DIAS. Cambiar la contraseña invalida todas las sesiones.

const BASE = '/cesantoni-formatos';
const LOGIN = BASE + '/acceso';
const SALIR = BASE + '/salir';
const COOKIE = 'cesantoni_formatos';
const SESION_DIAS = 7;
// El logo y los íconos de la app instalable se piden sin sesión
const PUBLICOS = new Set([
  BASE + '/assets/cesantoni-logo.svg',
  BASE + '/assets/icon-192.png',
  BASE + '/assets/icon-512.png',
  BASE + '/assets/apple-touch-icon.png',
  BASE + '/assets/favicon.svg',
  BASE + '/assets/favicon-32.png',
  BASE + '/assets/og-image.png',
  BASE + '/manifest.webmanifest',
]);

const enc = new TextEncoder();

async function firmar(secreto, dato) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secreto), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(dato));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function igual(a, b) {
  // Comparación de tiempo constante sobre el hash de ambos valores
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const va = new Uint8Array(ha), vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

function leerCookie(request, nombre) {
  const raw = request.headers.get('Cookie') || '';
  for (const parte of raw.split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nombre) return v.join('=');
  }
  return null;
}

async function sesionValida(request, password) {
  const valor = leerCookie(request, COOKIE);
  if (!valor) return false;
  const [exp, sig] = valor.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return igual(sig, await firmar(password, 'formatos:' + exp));
}

// Vista previa al compartir el enlace (WhatsApp, etc.): los bots no tienen sesión y leen esta página
function metaCompartir(origen) {
  const img = origen + BASE + '/assets/og-image.png';
  return `<meta name="description" content="Formatos internos de Cesantoni Porcelanato Premium.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cesantoni Porcelanato Premium">
<meta property="og:title" content="Formatos Cesantoni">
<meta property="og:description" content="Saldo a favor y registro de entrega a domicilio.">
<meta property="og:url" content="${origen}${BASE}/">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cesantoni Porcelanato Premium · Formatos">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">`;
}

function paginaAcceso(error, status = 200, origen = '') {
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Formatos Cesantoni</title>
${metaCompartir(origen)}
<link rel="icon" href="${BASE}/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${BASE}/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${BASE}/assets/apple-touch-icon.png">
<meta name="theme-color" content="#000000">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{background:#141518;font-family:Figtree,Arial,sans-serif;color:#111;display:flex;align-items:center;justify-content:center;padding:16px}
.card{width:100%;max-width:420px;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.head{background:#000;padding:38px 32px 30px;display:flex;justify-content:center}
.head img{width:220px;max-width:80%;height:auto;display:block}
form{padding:28px 32px 32px}
.sub{color:#8a8a8a;font-size:16px;margin:0 0 22px}
label{display:block;font-size:14px;font-weight:600;color:#333;margin-bottom:8px}
input{width:100%;font:inherit;font-size:16px;padding:13px 14px;border:1px solid #d4d4d4;border-radius:12px;outline:none}
input:focus{border-color:#000;box-shadow:0 0 0 3px rgba(0,0,0,.08)}
button{margin-top:16px;width:100%;font:inherit;font-size:16px;font-weight:600;padding:14px;border:0;border-radius:999px;background:#000;color:#fff;cursor:pointer}
button:hover{background:#222}
.err{margin:12px 0 0;color:#b00020;font-size:14px}
</style></head>
<body>
<main class="card">
  <div class="head"><img src="${BASE}/assets/cesantoni-logo.svg" alt="Cesantoni Porcelanato Premium"></div>
  <form method="post" action="${LOGIN}" autocomplete="on">
    <p class="sub">Formatos internos</p>
    <label for="password">Contraseña</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
    ${error ? `<p class="err" role="alert">${error}</p>` : ''}
    <button type="submit">Entrar</button>
  </form>
</main>
</body></html>`;
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Formatos-Acceso': '1', // sw.js no guarda esta página como la app
    },
  });
}

function redirigir(destino, cookie) {
  const headers = new Headers({ Location: destino, 'Cache-Control': 'no-store' });
  if (cookie) headers.append('Set-Cookie', cookie);
  return new Response(null, { status: 303, headers });
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (PUBLICOS.has(path)) return next();

  const password = env.FORMATOS_PASSWORD;
  if (!password) {
    return new Response('Formatos no configurados: falta FORMATOS_PASSWORD.', { status: 503 });
  }

  if (path === SALIR) {
    return redirigir(BASE + '/', `${COOKIE}=; Path=${BASE}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  }

  if (path === LOGIN) {
    if (request.method !== 'POST') return redirigir(BASE + '/');
    let intento = '';
    try {
      const form = await request.formData();
      intento = String(form.get('password') || '');
    } catch { /* cuerpo inválido */ }
    if (!(await igual(intento, password))) {
      await new Promise((r) => setTimeout(r, 700)); // frena intentos repetidos
      return paginaAcceso('Contraseña incorrecta.', 401, url.origin);
    }
    const exp = Date.now() + SESION_DIAS * 864e5;
    const valor = exp + '.' + (await firmar(password, 'formatos:' + exp));
    const cookie = `${COOKIE}=${valor}; Path=${BASE}; Max-Age=${SESION_DIAS * 86400}; HttpOnly; Secure; SameSite=Lax`;
    return redirigir(BASE + '/', cookie);
  }

  if (!(await sesionValida(request, password))) {
    if (path.startsWith(BASE + '/api/')) {
      return new Response(JSON.stringify({ error: 'sin_sesion', mensaje: 'Inicia sesión de nuevo.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    // 200 para que WhatsApp y otros muestren la vista previa del enlace
    return paginaAcceso('', 200, url.origin);
  }

  const response = await next();
  const res = new Response(response.body, response);
  res.headers.set('Cache-Control', 'private, no-store');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}
