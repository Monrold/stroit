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
    actual = doc;
    document.querySelectorAll('.tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.doc === doc)); });
    Object.keys(docs).forEach(function (k) {
      docs[k].form.hidden = k !== doc;
      docs[k].sheet.hidden = k !== doc;
    });
    statusEl.textContent = '';
    pintar();
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
      Object.keys(docs).forEach(function (k) {
        var f = docs[k].form, v = o[k] || {};
        Object.keys(v).forEach(function (name) {
          var els = f.elements[name];
          if (!els) return;
          if (els.length && els[0] && els[0].type === 'radio') {
            Array.prototype.forEach.call(els, function (r) { r.checked = r.value === v[name]; });
          } else if (els.type !== 'radio') { els.value = v[name]; }
          else { els.checked = els.value === v[name]; }
        });
      });
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
    statusEl.className = 'status';
    statusEl.textContent = 'Generando PDF…';
    // Copia a tamaño real (sin la escala de la vista previa); html2pdf la monta en su propio contenedor
    var copia = docs[actual].sheet.cloneNode(true);
    copia.removeAttribute('id');
    var opciones = {
      margin: 0,
      filename: nombreArchivo(),
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    document.fonts.ready
      .then(function () { return window.html2pdf().set(opciones).from(copia).outputPdf('blob'); })
      .then(function (blob) {
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = opciones.filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
      })
      .then(function () { statusEl.textContent = 'PDF descargado: ' + opciones.filename; })
      .catch(function (e) {
        statusEl.className = 'status err';
        statusEl.textContent = 'No se pudo generar el PDF. Usa "Imprimir" y elige "Guardar como PDF".';
        if (window.console) console.error(e);
      })
      .then(function () { btn.disabled = false; });
  }

  function imprimir() {
    if (!validar()) return;
    var prev = document.title;
    document.title = nombreArchivo().replace(/\.pdf$/, '');
    window.print();
    document.title = prev;
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
  window.addEventListener('resize', escalar);
  window.addEventListener('beforeprint', function () { scaler.style.transform = 'none'; });
  window.addEventListener('afterprint', escalar);

  cargar();
  escalar();
  cambiar(actual);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(pintar);

  // para pruebas
  window.__formatos = { letras: letras };
})();
