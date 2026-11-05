// API de los formatos Cesantoni: folios consecutivos y lista de vendedores.
// Requiere una base de datos D1 enlazada al proyecto de Pages con el nombre FORMATOS_DB.
// El acceso ya lo protege _middleware.js (sesión con contraseña).
//
//   GET  api/config                     → { vendedores, siguiente: { saldo, entrega } }
//   POST api/folio      { tipo }        → { folio: "SF-0001", numero }
//   PUT  api/vendedores { vendedores }  → { vendedores }
//   PUT  api/siguiente  { tipo, numero }→ { siguiente }
//   PUT  api/formato    { tipo, datos } → guarda el formato en el historial (por folio)
//   GET  api/historial?tipo=&asesor=&q= → { formatos: [...] (últimos 200), asesores: [...] }
//   DELETE api/formato?folio=SF-0001    → borra el formato del historial (el consecutivo no cambia)
//   GET  api/formato?folio=SF-0001      → { folio, tipo, datos, creado, actualizado }

const TIPOS = { saldo: 'SF', entrega: 'EN' };
const MAX_VENDEDORES = 100;
const MAX_DATOS = 8000; // bytes del JSON de un formato
const MAX_HISTORIAL = 200;

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
    db.prepare(
      'CREATE TABLE IF NOT EXISTS formatos (folio TEXT PRIMARY KEY, tipo TEXT NOT NULL, nombre TEXT, asesor TEXT, ' +
      'folio_venta TEXT, fecha TEXT, monto REAL, datos TEXT NOT NULL, creado TEXT NOT NULL, actualizado TEXT NOT NULL)'
    ),
    db.prepare('CREATE INDEX IF NOT EXISTS formatos_creado ON formatos (creado)'),
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

  if (ruta === 'formato' && metodo === 'PUT') {
    const { tipo, datos } = await cuerpo(request);
    if (!TIPOS[tipo] || !datos || typeof datos !== 'object') return json({ error: 'datos_invalidos' }, 400);
    const limpio = {};
    for (const [k, v] of Object.entries(datos)) {
      if (/^[a-zA-Z]{1,30}$/.test(k)) limpio[k] = String(v ?? '').slice(0, 400);
    }
    const folio = limpio.folio || '';
    if (!new RegExp('^' + TIPOS[tipo] + '-\\d{4,6}$').test(folio)) return json({ error: 'folio_invalido' }, 400);
    const texto = JSON.stringify(limpio);
    if (texto.length > MAX_DATOS) return json({ error: 'demasiado_grande' }, 400);
    const nombre = tipo === 'saldo' ? limpio.cliente : limpio.contacto;
    const fecha = tipo === 'saldo' ? limpio.fechaSaldo : limpio.fechaEntrega;
    const monto = tipo === 'saldo' && limpio.cantidad !== '' && isFinite(Number(limpio.cantidad)) ? Number(limpio.cantidad) : null;
    const ahora = new Date().toISOString();
    await db
      .prepare(
        'INSERT INTO formatos (folio, tipo, nombre, asesor, folio_venta, fecha, monto, datos, creado, actualizado) ' +
        'VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?9) ON CONFLICT(folio) DO UPDATE SET ' +
        'nombre = excluded.nombre, asesor = excluded.asesor, folio_venta = excluded.folio_venta, fecha = excluded.fecha, ' +
        'monto = excluded.monto, datos = excluded.datos, actualizado = excluded.actualizado'
      )
      .bind(folio, tipo, nombre || '', limpio.asesor || '', limpio.folioVenta || '', fecha || '', monto, texto, ahora)
      .run();
    return json({ folio });
  }

  if (ruta === 'formato' && metodo === 'GET') {
    const folio = new URL(request.url).searchParams.get('folio') || '';
    const fila = await db.prepare('SELECT folio, tipo, datos, creado, actualizado FROM formatos WHERE folio = ?1').bind(folio).first();
    if (!fila) return json({ error: 'no_encontrado' }, 404);
    let datos = {};
    try { datos = JSON.parse(fila.datos); } catch { /* dato dañado */ }
    return json({ ...fila, datos });
  }

  if (ruta === 'formato' && metodo === 'DELETE') {
    const folio = new URL(request.url).searchParams.get('folio') || '';
    const r = await db.prepare('DELETE FROM formatos WHERE folio = ?1').bind(folio).run();
    if (!r.meta || !r.meta.changes) return json({ error: 'no_encontrado' }, 404);
    return json({ borrado: folio });
  }

  if (ruta === 'historial' && metodo === 'GET') {
    const qs = new URL(request.url).searchParams;
    const tipo = qs.get('tipo');
    const q = (qs.get('q') || '').trim().slice(0, 60);
    const where = [], args = [];
    if (TIPOS[tipo]) { args.push(tipo); where.push('tipo = ?' + args.length); }
    const asesor = (qs.get('asesor') || '').trim().slice(0, 80);
    if (asesor) { args.push(asesor); where.push('asesor = ?' + args.length); }
    if (q) {
      args.push('%' + q.replace(/[\\%_]/g, (c) => '\\' + c) + '%');
      const n = args.length;
      where.push(`(folio LIKE ?${n} ESCAPE '\\' OR nombre LIKE ?${n} ESCAPE '\\' OR asesor LIKE ?${n} ESCAPE '\\' OR folio_venta LIKE ?${n} ESCAPE '\\')`);
    }
    const sql =
      'SELECT folio, tipo, nombre, asesor, folio_venta, fecha, monto, creado, actualizado FROM formatos' +
      (where.length ? ' WHERE ' + where.join(' AND ') : '') +
      ' ORDER BY creado DESC LIMIT ' + MAX_HISTORIAL;
    const [{ results }, nombres] = await Promise.all([
      db.prepare(sql).bind(...args).all(),
      db.prepare("SELECT DISTINCT asesor FROM formatos WHERE asesor <> '' ORDER BY asesor COLLATE NOCASE").all(),
    ]);
    return json({ formatos: results, asesores: nombres.results.map((r) => r.asesor) });
  }

  return json({ error: 'no_encontrado' }, 404);
}
