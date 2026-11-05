(function () {
  'use strict';

  var docs = {
    saldo: { form: document.getElementById('form-saldo'), sheet: document.getElementById('sheet-saldo'), nombre: 'Saldo a favor' },
    entrega: { form: document.getElementById('form-entrega'), sheet: document.getElementById('sheet-entrega'), nombre: 'Entrega a domicilio' }
  };
  var actual = 'saldo';
  var scaler = document.getElementById('scaler');
  var statusEl = document.getElementById('status');
  var STORE = 'cesantoni-formatos-v1';

  // ---------- utilidades ----------
  function fecha(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  }
  function dinero(n) {
    return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mxn';
  }

  // Número a letras (pesos mexicanos)
  var U = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  var D = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  var C = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  function menorMil(n) {
    if (n === 0) return '';
    if (n === 100) return 'cien';
    var c = Math.floor(n / 100), r = n % 100, s = C[c];
    if (r) {
      var t = r < 30 ? U[r] : D[Math.floor(r / 10)] + (r % 10 ? ' y ' + U[r % 10] : '');
      s = (s ? s + ' ' : '') + t;
    }
    return s;
  }
  function apocope(s) { return s.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un'); }
  function enteroALetras(n) {
    if (n === 0) return 'cero';
    var millones = Math.floor(n / 1e6), miles = Math.floor((n % 1e6) / 1000), resto = n % 1000, partes = [];
    if (millones) partes.push(millones === 1 ? 'un millón' : apocope(enteroALetras(millones)) + ' millones');
    if (miles) partes.push(miles === 1 ? 'mil' : apocope(menorMil(miles)) + ' mil');
    if (resto) partes.push(menorMil(resto));
    return partes.join(' ');
  }
  function letras(valor) {
    var n = Math.round(Number(valor) * 100);
    if (!isFinite(n) || n < 0) return '';
    var enteros = Math.floor(n / 100), cent = n % 100;
    var txt = apocope(enteroALetras(enteros));
    var de = (enteros >= 1e6 && enteros % 1e6 === 0) ? ' de' : '';
    txt = txt.charAt(0).toUpperCase() + txt.slice(1);
    return txt + de + (enteros === 1 ? ' peso ' : ' pesos ') + String(cent).padStart(2, '0') + '/100 M.N.';
  }

  // Reparte las notas en los renglones del formato
  var medidor = document.createElement('canvas').getContext('2d');
  function repartir(texto, anchos, fuente) {
    medidor.font = fuente;
    var palabras = (texto || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    var lineas = [''], i = 0;
    palabras.forEach(function (p) {
      if (i >= anchos.length) return;
      var prueba = lineas[i] ? lineas[i] + ' ' + p : p;
      if (medidor.measureText(prueba).width <= anchos[i] || !lineas[i]) { lineas[i] = prueba; }
      else { i++; if (i < anchos.length) lineas[i] = p; }
    });
    while (lineas.length < anchos.length) lineas.push('');
    return lineas.slice(0, anchos.length);
  }

  // ---------- render ----------
  function datos(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { o[k] = String(v).trim(); });
    return o;
  }

  function pintar() {
    var d = datos(docs[actual].form), sheet = docs[actual].sheet, vals = {};
    Object.keys(d).forEach(function (k) { vals[k] = d[k]; });
    ['fechaVenta', 'fechaSaldo', 'fechaEntrega'].forEach(function (k) { if (k in vals) vals[k] = fecha(vals[k]); });

    if (actual === 'saldo') {
      var hay = d.cantidad !== '' && !isNaN(Number(d.cantidad));
      vals.cantidad = hay ? dinero(d.cantidad) : '';
      vals.letra = hay ? letras(d.cantidad) : '';
      document.getElementById('saldo-letra').textContent = vals.letra;
      var lineas = sheet.querySelectorAll('.notes .l');
      var w0 = lineas[0].clientWidth, w1 = lineas[1].clientWidth;
      var notas = repartir(d.notas, [w0, w1, w1, w1], '400 13px Figtree, Arial, sans-serif');
      notas.forEach(function (t, i) { vals['nota' + i] = t; });
    } else {
      if (d.peso) vals.peso = Number(d.peso).toLocaleString('es-MX');
    }

    sheet.querySelectorAll('[data-f]').forEach(function (el) { el.textContent = vals[el.dataset.f] || ''; });
    sheet.querySelectorAll('[data-ck]').forEach(function (el) {
      var p = el.dataset.ck.split('=');
      el.classList.toggle('on', d[p[0]] === p[1]);
    });
    guardar();
  }

  function escalar() {
    var disponible = scaler.parentElement.clientWidth;
    var s = Math.min(1, disponible / 816);
    scaler.style.width = '816px';
    scaler.style.transform = 'scale(' + s + ')';
    scaler.style.marginRight = (816 * s - 816) + 'px';
    scaler.style.marginBottom = (1056 * s - 1056) + 'px';
    scaler.parentElement.style.height = (1056 * s) + 'px';
  }

  function cambiar(doc) {
    var esConfig = doc === 'config', esHist = doc === 'historial', sinHoja = esConfig || esHist;
    if (!sinHoja) actual = doc;
    document.querySelectorAll('.tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.doc === doc)); });
    Object.keys(docs).forEach(function (k) {
      docs[k].form.hidden = sinHoja || k !== doc;
      docs[k].sheet.hidden = sinHoja || k !== doc;
    });
    configEl.hidden = !esConfig;
    histEl.hidden = !esHist;
    document.querySelector('.panel').classList.toggle('config-mode', sinHoja);
    document.querySelector('.layout').classList.toggle('config-mode', sinHoja);
    statusEl.textContent = '';
    if (esConfig) { pintarConfig(); return; }
    if (esHist) { cargarHistorial(); return; }
    escalar();
    pintar();
  }

  // ---------- API (folios y vendedores) ----------
  var configEl = document.getElementById('config');
  var configStatus = document.getElementById('config-status');
  var cfg = { ok: false, offline: false, vendedores: [], siguiente: {} };
  var CFG_STORE = 'cesantoni-formatos-config';
  var COLA_STORE = 'cesantoni-formatos-pendientes';

  function leerJSON(clave, defecto) {
    try { var v = JSON.parse(localStorage.getItem(clave) || 'null'); return v == null ? defecto : v; } catch (e) { return defecto; }
  }
  function escribirJSON(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  function api(metodo, ruta, cuerpo) {
    return fetch('api/' + ruta, {
      method: metodo,
      headers: cuerpo ? { 'Content-Type': 'application/json' } : {},
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      credentials: 'same-origin',
      cache: 'no-store'
    }).catch(function (err) {
      // Sin red: fetch falla antes de llegar al servidor
      var e = new Error('sin conexión'); e.red = true; e.causa = err; throw e;
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) { var e = new Error(data.mensaje || data.error || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return data;
      });
    });
  }

  function llenarSelects() {
    document.querySelectorAll('select.sel-asesor').forEach(function (sel) {
      var actualVal = sel.value || sel.dataset.pendiente || '';
      var nombres = cfg.vendedores.slice();
      if (actualVal && nombres.indexOf(actualVal) < 0) nombres.push(actualVal);
      sel.innerHTML = '';
      var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Selecciona…'; sel.appendChild(o0);
      nombres.forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
      sel.value = actualVal;
      delete sel.dataset.pendiente;
    });
  }

  // Sin base de datos: folio y asesor se capturan a mano
  function modoManual() {
    cfg.ok = false;
    document.querySelectorAll('input.folio-auto').forEach(function (i) {
      i.readOnly = false; i.classList.remove('folio-auto');
      i.placeholder = i.form.id === 'form-saldo' ? 'SF-0001' : 'EN-0001';
    });
    document.querySelectorAll('select.sel-asesor').forEach(function (sel) {
      var inp = document.createElement('input');
      inp.name = 'asesor'; inp.value = sel.value || sel.dataset.pendiente || '';
      sel.parentNode.replaceChild(inp, sel);
    });
    var aviso = document.getElementById('config-aviso');
    aviso.hidden = false;
    aviso.textContent = 'La base de datos no está conectada todavía, así que el folio y el asesor se escriben a mano. Revisa los pasos en las notas del proyecto (FORMATOS_DB).';
  }

  function cargarConfig() {
    return api('GET', 'config').then(function (data) {
      cfg.ok = true;
      cfg.offline = false;
      cfg.vendedores = data.vendedores || [];
      cfg.siguiente = data.siguiente || {};
      escribirJSON(CFG_STORE, { vendedores: cfg.vendedores });
      llenarSelects();
      pintarRed();
      sincronizar();
    }).catch(function (e) {
      var guardada = leerJSON(CFG_STORE, null);
      if (e.red && guardada) {
        // Sin conexión: se trabaja con la última lista de vendedores conocida
        cfg.ok = true;
        cfg.offline = true;
        cfg.vendedores = guardada.vendedores || [];
        llenarSelects();
        pintarRed();
        return;
      }
      if (window.console) console.warn('Configuración no disponible:', e.message);
      if (cfg.ok) { cfg.offline = !!e.red; pintarRed(); return; }
      modoManual();
    });
  }

  // ---------- sin conexión: folios provisionales y pendientes ----------
  var redEl = document.getElementById('red');
  var redTxt = document.getElementById('red-txt');
  var redBtn = document.getElementById('red-btn');
  var PREFIJO = { saldo: 'SF', entrega: 'EN' };
  var sincronizando = false;

  function esProvisional(folio) { return /^(SF|EN)-P[A-Z0-9]{4}$/.test(folio || ''); }
  function folioProvisional(tipo) {
    var abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', s = '';
    var n = new Uint32Array(4);
    (window.crypto || window.msCrypto).getRandomValues(n);
    for (var i = 0; i < 4; i++) s += abc.charAt(n[i] % abc.length);
    return PREFIJO[tipo] + '-P' + s;
  }
  function leerCola() { return leerJSON(COLA_STORE, []); }
  function guardarCola(c) { escribirJSON(COLA_STORE, c); }

  // Guarda (o actualiza) un formato para subirlo al historial cuando haya red
  function encolar(tipo, d) {
    var cola = leerCola(), i;
    for (i = 0; i < cola.length; i++) if (cola[i].datos.folio === d.folio) break;
    if (i < cola.length) cola[i].datos = d;
    else cola.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), tipo: tipo, datos: d });
    guardarCola(cola);
    pintarRed();
  }

  function pintarRed() {
    var n = leerCola().length, txt = '';
    var plural = n === 1 ? '1 formato pendiente' : n + ' formatos pendientes';
    if (cfg.offline) {
      txt = 'Sin conexión. Puedes seguir llenando y descargando; el folio sale provisional (SF-P…) y se cambia por el definitivo al reconectar.';
      if (n) txt += ' ' + plural + ' de subir.';
    } else if (n) {
      txt = plural + ' de subir al historial.';
    }
    redEl.hidden = !txt;
    redEl.classList.toggle('off', cfg.offline);
    redTxt.textContent = txt;
    redBtn.hidden = cfg.offline || !n || sincronizando;
  }

  // Sube los pendientes: primero pide el folio definitivo, luego guarda en el historial
  function sincronizar() {
    if (sincronizando || !cfg.ok || cfg.offline || !leerCola().length) { pintarRed(); return Promise.resolve(); }
    sincronizando = true;
    pintarRed();
    var cambios = [], subidos = 0;

    function siguiente() {
      var cola = leerCola(), item = cola[0];
      if (!item) return Promise.resolve();
      var paso = Promise.resolve();
      if (esProvisional(item.datos.folio)) {
        paso = api('POST', 'folio', { tipo: item.tipo }).then(function (r) {
          var prov = item.datos.folio;
          item.datos.folioProvisional = prov;
          item.datos.folio = r.folio;
          guardarCola(cola); // el definitivo queda guardado antes de subir
          cambios.push(prov + ' → ' + r.folio);
          var f = docs[item.tipo] && docs[item.tipo].form;
          if (f && f.elements.folio.value === prov) f.elements.folio.value = r.folio;
        });
      }
      return paso
        .then(function () { return api('PUT', 'formato', { tipo: item.tipo, datos: item.datos }); })
        .then(function () {
          guardarCola(leerCola().filter(function (x) { return x.id !== item.id; }));
          subidos++;
          return siguiente();
        });
    }

    return siguiente().catch(function (e) {
      if (e.red) cfg.offline = true;
      if (window.console) console.warn('No se pudieron subir los pendientes:', e.message);
    }).then(function () {
      sincronizando = false;
      pintarRed();
      if (subidos) {
        pintar();
        statusEl.className = 'status';
        statusEl.textContent = (subidos === 1 ? 'Se subió 1 formato hecho sin conexión' : 'Se subieron ' + subidos + ' formatos hechos sin conexión') +
          (cambios.length ? '. Folios definitivos: ' + cambios.join(', ') + '. Vuelve a descargarlos desde Historial si necesitas el PDF con el folio definitivo.' : '.');
      }
    });
  }

  function pintarConfig() {
    var ul = document.getElementById('lista-vendedores');
    ul.innerHTML = '';
    if (!cfg.vendedores.length) {
      var li0 = document.createElement('li'); li0.className = 'vacio'; li0.textContent = 'Aún no hay vendedores.'; ul.appendChild(li0);
    }
    cfg.vendedores.forEach(function (n, i) {
      var li = document.createElement('li');
      var span = document.createElement('span'); span.textContent = n;
      var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Quitar';
      b.addEventListener('click', function () {
        var lista = cfg.vendedores.slice(); lista.splice(i, 1); guardarVendedores(lista);
      });
      li.appendChild(span); li.appendChild(b); ul.appendChild(li);
    });
    var ff = document.getElementById('form-folios');
    ff.elements.saldo.value = cfg.siguiente.saldo || 1;
    ff.elements.entrega.value = cfg.siguiente.entrega || 1;
    var desactivar = !cfg.ok || cfg.offline;
    configEl.querySelectorAll('input,button').forEach(function (el) { el.disabled = desactivar; });
  }

  function avisoConfig(txt, err) {
    configStatus.className = 'status' + (err ? ' err' : '');
    configStatus.textContent = txt;
  }

  function guardarVendedores(lista) {
    return api('PUT', 'vendedores', { vendedores: lista }).then(function (data) {
      cfg.vendedores = data.vendedores;
      llenarSelects(); pintarConfig(); avisoConfig('Vendedores guardados.');
    }).catch(function (e) { avisoConfig('No se pudo guardar: ' + e.message, true); });
  }

  function asegurarFolio() {
    var f = docs[actual].form;
    if (!cfg.ok || f.elements.folio.value) return Promise.resolve();
    statusEl.className = 'status';
    statusEl.textContent = 'Asignando folio…';
    return api('POST', 'folio', { tipo: actual }).then(function (data) {
      f.elements.folio.value = data.folio;
      cfg.siguiente[actual] = data.numero + 1;
      if (cfg.offline) { cfg.offline = false; pintarRed(); }
      pintar();
    }, function (e) {
      if (!e.red) throw e;
      // Sin red: folio provisional; al reconectar se cambia por el definitivo
      cfg.offline = true;
      f.elements.folio.value = folioProvisional(actual);
      pintar();
      pintarRed();
    });
  }

  // ---------- historial ----------
  var histEl = document.getElementById('historial');
  var histForm = document.getElementById('form-historial');
  var histLista = document.getElementById('lista-historial');
  var histStatus = document.getElementById('historial-status');
  var histPeticion = 0;

  // Guarda el formato actual en la base (por folio). No detiene la descarga si falla.
  function registrar() {
    var d = datos(docs[actual].form);
    if (!cfg.ok || !d.folio) return Promise.resolve(null);
    if (esProvisional(d.folio)) { encolar(actual, d); return Promise.resolve('pendiente'); }
    return api('PUT', 'formato', { tipo: actual, datos: d }).then(function () { return true; }, function (e) {
      if (e.red) { cfg.offline = true; encolar(actual, d); return 'pendiente'; }
      if (window.console) console.warn('No se guardó en el historial:', e.message);
      statusEl.className = 'status err';
      statusEl.textContent = 'Ojo: no se guardó en el historial (' + e.message + ').';
      return false;
    });
  }

  function fechaHora(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
      d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function cargarHistorial(aviso) {
    histStatus.className = 'status';
    if (!cfg.ok) {
      histLista.innerHTML = '';
      histStatus.textContent = 'El historial necesita la base de datos conectada (FORMATOS_DB).';
      return;
    }
    if (cfg.offline) {
      histLista.innerHTML = '';
      histStatus.textContent = 'Sin conexión. El historial se ve al reconectar.';
      return;
    }
    var q = histForm.elements.q.value.trim(), tipo = histForm.elements.tipo.value, asesor = histForm.elements.asesor.value;
    var n = ++histPeticion;
    histStatus.textContent = 'Cargando…';
    api('GET', 'historial?tipo=' + encodeURIComponent(tipo) + '&asesor=' + encodeURIComponent(asesor) + '&q=' + encodeURIComponent(q)).then(function (data) {
      if (n !== histPeticion) return;
      histStatus.textContent = typeof aviso === 'string' ? aviso : '';
      llenarFiltroAsesor(data.asesores || []);
      histLista.innerHTML = '';
      var lista = data.formatos || [];
      if (!lista.length) {
        histLista.appendChild(el('li', 'vacio', q || tipo || asesor ? 'Sin resultados.' : 'Aún no hay formatos guardados.'));
        return;
      }
      lista.forEach(function (f) {
        var li = el('li'), main = el('div', 'h-main'), top = el('div', 'h-top');
        top.appendChild(el('span', 'h-folio', f.folio));
        top.appendChild(el('span', 'h-tag', f.tipo === 'saldo' ? 'Saldo' : 'Entrega'));
        top.appendChild(el('span', 'h-nombre', f.nombre || 'Sin nombre'));
        var sub = [];
        if (f.tipo === 'saldo' && f.monto != null) sub.push(dinero(f.monto));
        if (f.tipo === 'entrega' && f.fecha) sub.push('Entrega ' + fecha(f.fecha));
        if (f.folio_venta) sub.push('Venta ' + f.folio_venta);
        if (f.asesor) sub.push(f.asesor);
        sub.push(fechaHora(f.creado));
        main.appendChild(top);
        main.appendChild(el('div', 'h-sub', sub.join(' · ')));
        li.appendChild(main); li.appendChild(acciones(f.folio));
        histLista.appendChild(li);
      });
      if (lista.length >= 200) histStatus.textContent = 'Se muestran los 200 más recientes. Usa la búsqueda para encontrar otros.';
    }).catch(function (e) {
      if (n !== histPeticion) return;
      if (e.red) { cfg.offline = true; pintarRed(); }
      histStatus.className = 'status err';
      histStatus.textContent = e.red ? 'Sin conexión. El historial se ve al reconectar.' : 'No se pudo cargar el historial: ' + e.message;
    });
  }

  // Vendedores del filtro: los de Configuración más los que ya aparecen en el historial
  function llenarFiltroAsesor(enHistorial) {
    var sel = histForm.elements.asesor, val = sel.value, nombres = [];
    cfg.vendedores.concat(enHistorial).forEach(function (n) {
      if (n && !nombres.some(function (x) { return x.toLowerCase() === n.toLowerCase(); })) nombres.push(n);
    });
    if (val && nombres.indexOf(val) < 0) nombres.push(val);
    nombres.sort(function (a, b) { return a.localeCompare(b, 'es'); });
    sel.innerHTML = '';
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Todos los vendedores'; sel.appendChild(o0);
    nombres.forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
    sel.value = val;
  }

  function acciones(folio) {
    var box = el('div', 'h-acc');
    function normal() {
      box.innerHTML = '';
      var abrir = el('button', null, 'Abrir'); abrir.type = 'button';
      abrir.addEventListener('click', function () { abrirFormato(folio); });
      var borrar = el('button', 'h-del', 'Eliminar'); borrar.type = 'button';
      borrar.addEventListener('click', confirmar);
      box.appendChild(abrir); box.appendChild(borrar);
    }
    function confirmar() {
      box.innerHTML = '';
      var si = el('button', 'h-si', 'Sí, eliminar'); si.type = 'button';
      var no = el('button', null, 'No'); no.type = 'button';
      si.addEventListener('click', function () { si.disabled = no.disabled = true; eliminarFormato(folio); });
      no.addEventListener('click', normal);
      box.appendChild(el('span', 'h-preg', '¿Eliminar ' + folio + '?'));
      box.appendChild(si); box.appendChild(no);
      no.focus();
    }
    normal();
    return box;
  }

  function eliminarFormato(folio) {
    api('DELETE', 'formato?folio=' + encodeURIComponent(folio)).then(function () {
      // Si ese folio está abierto en su formulario, se limpia para no volver a guardarlo por error
      Object.keys(docs).forEach(function (k) {
        if (docs[k].form.elements.folio.value === folio) { docs[k].form.reset(); }
      });
      guardar();
      cargarHistorial(folio + ' eliminado.');
    }).catch(function (e) {
      histStatus.className = 'status err';
      histStatus.textContent = 'No se pudo eliminar: ' + e.message;
      cargarHistorial();
    });
  }

  function llenarForm(f, v) {
    f.reset();
    Object.keys(v).forEach(function (name) {
      var els = f.elements[name];
      if (!els) return;
      if (els.length && els[0] && els[0].type === 'radio') {
        Array.prototype.forEach.call(els, function (r) { r.checked = r.value === v[name]; });
      } else if (els.tagName === 'SELECT') { els.dataset.pendiente = v[name]; els.value = v[name]; }
      else if (els.type !== 'radio') { els.value = v[name]; }
      else { els.checked = els.value === v[name]; }
    });
  }

  function abrirFormato(folio) {
    histStatus.className = 'status';
    histStatus.textContent = 'Abriendo ' + folio + '…';
    api('GET', 'formato?folio=' + encodeURIComponent(folio)).then(function (r) {
      if (!docs[r.tipo]) throw new Error('tipo desconocido');
      llenarForm(docs[r.tipo].form, r.datos || {});
      llenarSelects();
      histStatus.textContent = '';
      cambiar(r.tipo);
      statusEl.className = 'status';
      statusEl.textContent = 'Abriste ' + folio + '. Si lo corriges y lo descargas de nuevo, se actualiza con el mismo folio.';
    }).catch(function (e) {
      histStatus.className = 'status err';
      histStatus.textContent = 'No se pudo abrir: ' + e.message;
    });
  }

  // ---------- guardado local (borrador) ----------
  function guardar() {
    try {
      var o = { actual: actual };
      Object.keys(docs).forEach(function (k) { o[k] = datos(docs[k].form); });
      localStorage.setItem(STORE, JSON.stringify(o));
    } catch (e) { /* sin almacenamiento */ }
  }
  function cargar() {
    try {
      var o = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (!o) return;
      Object.keys(docs).forEach(function (k) { llenarForm(docs[k].form, o[k] || {}); });
      if (o.actual && docs[o.actual]) actual = o.actual;
    } catch (e) { /* sin almacenamiento */ }
  }

  // ---------- validación y PDF ----------
  function validar() {
    var f = docs[actual].form;
    if (!f.checkValidity()) { f.reportValidity(); return false; }
    return true;
  }

  function nombreArchivo() {
    var d = datos(docs[actual].form);
    var id = d.folio || d.folioVenta || '';
    var quien = actual === 'saldo' ? d.cliente : d.contacto;
    return [docs[actual].nombre, id, quien].filter(Boolean).join(' - ').replace(/[\\/:*?"<>|]+/g, '') + '.pdf';
  }

  function descargarPDF() {
    if (!validar()) return;
    var btn = document.getElementById('btn-pdf');
    btn.disabled = true;
    var opciones, guardado;
    asegurarFolio()
      .catch(function (e) { e.folio = true; throw e; })
      .then(registrar)
      .then(function (ok) {
        guardado = ok;
        statusEl.className = 'status';
        statusEl.textContent = 'Generando PDF…';
        // Copia a tamaño real (sin la escala de la vista previa); html2pdf la monta en su propio contenedor
        var copia = docs[actual].sheet.cloneNode(true);
        copia.removeAttribute('id');
        opciones = {
          margin: 0,
          filename: nombreArchivo(),
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        return document.fonts.ready.then(function () { return window.html2pdf().set(opciones).from(copia).outputPdf('blob'); });
      })
      .then(function (blob) {
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = opciones.filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
      })
      .then(function () {
        statusEl.className = 'status' + (guardado === false ? ' err' : '');
        statusEl.textContent = 'PDF descargado: ' + opciones.filename +
          (guardado === false ? '. Ojo: no se guardó en el historial.' : '') +
          (guardado === 'pendiente' ? '. Sin conexión: se sube al historial al reconectar.' : '');
      })
      .catch(function (e) {
        statusEl.className = 'status err';
        statusEl.textContent = e.folio
          ? 'No se pudo asignar el folio (' + e.message + '). Revisa tu conexión e intenta de nuevo.'
          : 'No se pudo generar el PDF. Usa "Imprimir" y elige "Guardar como PDF".';
        if (window.console) console.error(e);
      })
      .then(function () { btn.disabled = false; });
  }

  function imprimir() {
    if (!validar()) return;
    asegurarFolio().then(function () {
      statusEl.textContent = '';
      return registrar();
    }).then(function () {
      var prev = document.title;
      document.title = nombreArchivo().replace(/\.pdf$/, '');
      window.print();
      document.title = prev;
    }).catch(function (e) {
      statusEl.className = 'status err';
      statusEl.textContent = 'No se pudo asignar el folio (' + e.message + '). Revisa tu conexión e intenta de nuevo.';
    });
  }

  function limpiar() {
    var f = docs[actual].form;
    f.reset();
    statusEl.textContent = '';
    pintar();
  }

  // ---------- eventos ----------
  document.querySelectorAll('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () { cambiar(b.dataset.doc); });
  });
  Object.keys(docs).forEach(function (k) {
    docs[k].form.addEventListener('input', pintar);
    docs[k].form.addEventListener('change', pintar);
    docs[k].form.addEventListener('submit', function (e) { e.preventDefault(); });
  });
  document.getElementById('btn-pdf').addEventListener('click', descargarPDF);
  document.getElementById('btn-print').addEventListener('click', imprimir);
  document.getElementById('btn-clear').addEventListener('click', limpiar);
  document.getElementById('form-vendedor').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = e.target.elements.nombre, nombre = inp.value.trim();
    if (!nombre) return;
    guardarVendedores(cfg.vendedores.concat([nombre])).then(function () { inp.value = ''; inp.focus(); });
  });
  document.getElementById('form-folios').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    Promise.all(['saldo', 'entrega'].map(function (t) {
      return api('PUT', 'siguiente', { tipo: t, numero: Number(f.elements[t].value) });
    })).then(function (res) {
      cfg.siguiente = res[res.length - 1].siguiente;
      pintarConfig(); avisoConfig('Folios guardados.');
    }).catch(function (err) { avisoConfig('No se pudo guardar: ' + err.message, true); });
  });
  var histTimer;
  histForm.addEventListener('input', function () { clearTimeout(histTimer); histTimer = setTimeout(cargarHistorial, 250); });
  histForm.addEventListener('submit', function (e) { e.preventDefault(); cargarHistorial(); });
  redBtn.addEventListener('click', sincronizar);
  window.addEventListener('online', function () { cfg.offline = false; pintarRed(); cargarConfig(); });
  window.addEventListener('offline', function () { if (cfg.ok) { cfg.offline = true; pintarRed(); } });
  window.addEventListener('resize', escalar);
  window.addEventListener('beforeprint', function () { scaler.style.transform = 'none'; });
  window.addEventListener('afterprint', escalar);

  cargar();
  escalar();
  cambiar(actual);
  cargarConfig().then(pintar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(pintar);

  // Guarda la app en el equipo para abrirla sin conexión
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) { if (window.console) console.warn('Sin modo offline:', e.message); });
    });
  }

  // para pruebas
  window.__formatos = { letras: letras };
})();
