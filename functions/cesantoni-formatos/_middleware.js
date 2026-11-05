// Protege /cesantoni-formatos/ con usuario y contraseña (HTTP Basic Auth).
// La contraseña se define en Cloudflare Pages → Settings → Variables and Secrets:
//   FORMATOS_PASSWORD  (obligatoria)
//   FORMATOS_USER      (opcional, por defecto "cesantoni")
// Si FORMATOS_PASSWORD no existe, la ruta queda cerrada.

const encoder = new TextEncoder();

async function igual(a, b) {
  // Comparación de tiempo constante usando el hash de ambos valores
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha), vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

function pedirAcceso() {
  return new Response('Acceso restringido', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Formatos Cesantoni", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequest({ request, env, next }) {
  const password = env.FORMATOS_PASSWORD;
  if (!password) {
    return new Response('Formatos no configurados: falta FORMATOS_PASSWORD.', { status: 503 });
  }
  const user = env.FORMATOS_USER || 'cesantoni';

  const header = request.headers.get('Authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) return pedirAcceso();

  let decoded;
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)));
  } catch {
    return pedirAcceso();
  }
  const sep = decoded.indexOf(':');
  if (sep < 0) return pedirAcceso();

  const okUser = await igual(decoded.slice(0, sep), user);
  const okPass = await igual(decoded.slice(sep + 1), password);
  if (!(okUser && okPass)) return pedirAcceso();

  const response = await next();
  const res = new Response(response.body, response);
  res.headers.set('Cache-Control', 'private, no-store');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}
