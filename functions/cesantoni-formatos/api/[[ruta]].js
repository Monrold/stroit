// API de los formatos Cesantoni: folios consecutivos y lista de vendedores.
// Requiere una base de datos D1 enlazada al proyecto de Pages con el nombre FORMATOS_DB.
// El acceso ya lo protege _middleware.js (sesión con contraseña).
//
//   GET  api/config                     → { vendedores, siguiente: { saldo, entrega } }
//   POST api/folio      { tipo }        → { folio: "SF-0001", numero }
//   PUT  api/vendedores { vendedores }  → { vendedores }
//   PUT  api/siguiente  { tipo, numero }→ { siguiente }

const TIPOS = { saldo: 'SF', entrega: 'EN' };
const MAX_VENDEDORES = 100;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function formatoFolio(tipo, n) {
  return TIPOS[tipo] + '-' + String(n).padStart(4, '0');
}

let esquemaListo = false;
async function esquema(db) {
  if (esquemaListo) return;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS contadores (tipo TEXT PRIMARY KEY, ultimo INTEGER NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY, valor TEXT NOT NULL)'),
  ]);
  esquemaListo = true;
}

async function leerVendedores(db) {
  const fila = await db.prepare("SELECT valor FROM ajustes WHERE clave = 'vendedores'").first();
  try { return fila ? JSON.parse(fila.valor) : []; } catch { return []; }
}

async function siguientes(db) {
  const { results } = await db.prepare('SELECT tipo, ultimo FROM contadores').all();
  const out = {};
  for (const t of Object.keys(TIPOS)) {
    const f = results.find((r) => r.tipo === t);
    out[t] = (f ? f.ultimo : 0) + 1;
  }
  return out;
}

async function cuerpo(request) {
  try { return await request.json(); } catch { return {}; }
}

export async function onRequest({ request, env, params }) {
  const db = env.FORMATOS_DB;
  if (!db) return json({ error: 'sin_db', mensaje: 'Falta enlazar la base de datos FORMATOS_DB.' }, 503);
  await esquema(db);

  const ruta = (params.ruta || []).join('/');
  const metodo = request.method;

  if (ruta === 'config' && metodo === 'GET') {
    return json({ vendedores: await leerVendedores(db), siguiente: await siguientes(db) });
  }

  if (ruta === 'folio' && metodo === 'POST') {
    const { tipo } = await cuerpo(request);
    if (!TIPOS[tipo]) return json({ error: 'tipo_invalido' }, 400);
    // Incremento atómico: dos personas nunca reciben el mismo folio
    const fila = await db
      .prepare('INSERT INTO contadores (tipo, ultimo) VALUES (?1, 1) ON CONFLICT(tipo) DO UPDATE SET ultimo = ultimo + 1 RETURNING ultimo')
      .bind(tipo)
      .first();
    return json({ folio: formatoFolio(tipo, fila.ultimo), numero: fila.ultimo });
  }

  if (ruta === 'vendedores' && metodo === 'PUT') {
    const { vendedores } = await cuerpo(request);
    if (!Array.isArray(vendedores)) return json({ error: 'lista_invalida' }, 400);
    const limpios = [];
    for (const v of vendedores) {
      const nombre = String(v || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      if (nombre && !limpios.some((x) => x.toLowerCase() === nombre.toLowerCase())) limpios.push(nombre);
    }
    if (limpios.length > MAX_VENDEDORES) return json({ error: 'demasiados' }, 400);
    await db
      .prepare("INSERT INTO ajustes (clave, valor) VALUES ('vendedores', ?1) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor")
      .bind(JSON.stringify(limpios))
      .run();
    return json({ vendedores: limpios });
  }

  if (ruta === 'siguiente' && metodo === 'PUT') {
    const { tipo, numero } = await cuerpo(request);
    const n = Number(numero);
    if (!TIPOS[tipo] || !Number.isInteger(n) || n < 1 || n > 999999) return json({ error: 'numero_invalido' }, 400);
    await db
      .prepare('INSERT INTO contadores (tipo, ultimo) VALUES (?1, ?2) ON CONFLICT(tipo) DO UPDATE SET ultimo = excluded.ultimo')
      .bind(tipo, n - 1)
      .run();
    return json({ siguiente: await siguientes(db) });
  }

  return json({ error: 'no_encontrado' }, 404);
}
