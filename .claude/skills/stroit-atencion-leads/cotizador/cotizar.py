#!/usr/bin/env python3
"""Genera la cotización de Stroit Surfaces (PDF + HTML) a partir de un JSON.

Uso:
    python3 cotizar.py datos.json [carpeta_salida]

El JSON solo lleva los datos que cambian (ver ejemplos/luis-montano.json).
Todo lo fijo (empresa, sucursales, cuentas, tarifas de mano de obra) vive en
config.json, y el diseño en plantilla.html.

Salida: <carpeta>/cotizacion-<cliente>.pdf y .html (el HTML es el que se
exporta a Adobe Express). Imprime un resumen con los totales.
"""
import base64
import datetime as dt
import io
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
import urllib.request
from zoneinfo import ZoneInfo

AQUI = os.path.dirname(os.path.abspath(__file__))


def sin_acentos(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", sin_acentos(s).lower()).strip("-")


def dinero(x):
    return f"${x:,.2f}"


def data_uri(ruta_o_url, max_px=None):
    """Devuelve la imagen como data URI. Acepta ruta local o URL."""
    try:
        if ruta_o_url.startswith("http"):
            req = urllib.request.Request(ruta_o_url, headers={"User-Agent": "Mozilla/5.0 (cotizador Stroit)"})
            with urllib.request.urlopen(req, timeout=20) as r:
                datos = r.read()
        else:
            ruta = ruta_o_url if os.path.isabs(ruta_o_url) else os.path.join(AQUI, ruta_o_url)
            datos = open(ruta, "rb").read()
    except Exception as e:  # sin imagen no se detiene la cotización
        print(f"⚠️  No se pudo cargar la imagen {ruta_o_url}: {e}", file=sys.stderr)
        return ""
    mime = "image/png" if datos[:4] == b"\x89PNG" else "image/jpeg"
    if max_px:
        from PIL import Image  # miniatura ligera para que el HTML pese poco

        im = Image.open(io.BytesIO(datos)).convert("RGB")
        im.thumbnail((max_px, max_px))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=72)
        datos, mime = buf.getvalue(), "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(datos).decode()


def region_de(estado, cfg):
    e = sin_acentos(estado).lower().strip()
    for clave, reg in cfg["regiones"].items():
        if clave == e or e in reg["estados"]:
            return clave
    raise SystemExit(f"Estado '{estado}' sin región. Agrégalo en config.json › regiones.")


def rango(v):
    """Una tarifa es un número fijo o [mín, máx]."""
    return (v[0], v[1]) if isinstance(v, list) else (v, v)


def dinero_rango(a, b):
    return dinero(a) if a == b else f"{dinero(a)} – {dinero(b)}"


def mano_de_obra_html(q, cfg, regiones):
    filas, totales = [], {r: [0, 0] for r in regiones}
    hay_prueba = False
    for item in q.get("mano_de_obra", []):
        t = cfg["tarifas_mano_de_obra"][item["concepto"]]
        cant = item.get("cantidad", 1)
        etiqueta = item.get("texto", t["texto"])
        if t["unidad"] != "pza" or cant != 1:
            etiqueta += f" (≈{cant:g} {t['unidad']})"
        celdas = ""
        for r in regiones:
            mn, mx = rango(t[r])
            totales[r][0] += mn * cant
            totales[r][1] += mx * cant
            hay_prueba |= cfg.get("tarifas_prueba", False) and r not in t.get("confirmado", [])
            celdas += f"<td class='r'>{dinero_rango(mn * cant, mx * cant)}</td>"
        filas.append(f"<tr><td>{etiqueta}</td>{celdas}</tr>")
    if not filas:
        return "", totales
    enc = "".join(f"<th class='r'>{cfg['regiones'][r]['nombre']}</th>" for r in regiones)
    tot = "".join(f"<td class='r'>{dinero_rango(*totales[r])}</td>" for r in regiones)
    material = sum(p["cantidad"] * p["precio"] for p in q["partidas"])
    gran = "".join(f"<td class='r'>{dinero_rango(material + totales[r][0], material + totales[r][1])}</td>" for r in regiones)
    prueba = '<span class="prueba">PRECIOS DE PRUEBA</span>' if hay_prueba else ""
    html = f"""<div class="mo"><h2>Mano de obra aproximada (referencia){prueba}</h2>
  <p class="nota">Stroit Surfaces no realiza corte ni instalación. Montos estimados para que consideres el costo total de tu proyecto; el instalador te dará el precio final.</p>
  <table><thead><tr><th>Concepto</th>{enc}</tr></thead><tbody>{''.join(filas)}
  <tr class="t"><td>Mano de obra aproximada</td>{tot}</tr>
  <tr class="g"><td>Total estimado del proyecto (material + mano de obra)</td>{gran}</tr></tbody></table></div>"""
    return html, totales


def renderizar_pdf(html_path, pdf_path):
    node = shutil.which("node")
    if not node:
        print("⚠️  Sin node: solo se generó el HTML.", file=sys.stderr)
        return False
    subprocess.run([node, os.path.join(AQUI, "render.mjs"), html_path, pdf_path], check=True)
    return True


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    q = json.load(open(sys.argv[1], encoding="utf-8"))
    salida = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()
    os.makedirs(salida, exist_ok=True)
    cfg = json.load(open(os.path.join(AQUI, "config.json"), encoding="utf-8"))

    region = q.get("region") or region_de(q["estado"], cfg)
    reg = cfg["regiones"][region]
    regiones_mo = q.get("mano_de_obra_regiones", [region])

    ahora = dt.datetime.strptime(q["fecha"], "%Y-%m-%d %H:%M") if q.get("fecha") else dt.datetime.now(ZoneInfo("America/Mexico_City")).replace(tzinfo=None)
    vigencia = ahora + dt.timedelta(days=q.get("vigencia_dias", 3))

    partidas, subtotal, piezas = [], 0, 0
    for p in q["partidas"]:
        imp = p["cantidad"] * p["precio"]
        subtotal += imp
        piezas += p["cantidad"]
        img = data_uri(p["imagen"], max_px=116) if p.get("imagen") else ""
        img_html = f'<img class="thumb" src="{img}" alt="">' if img else ""
        detalle = f'<div class="sub">{p["detalle"]}</div>' if p.get("detalle") else ""
        medida = f'<div class="sub">{p["medida"]}</div>' if p.get("medida") else ""
        partidas.append(
            f"<tr><td>{img_html}</td><td><b>{p['cantidad']:g} {p.get('unidad', 'PZA')}</b>{medida}</td>"
            f"<td>{p['descripcion']}{detalle}</td><td class='r'>{dinero(p['precio'])}</td>"
            f"<td class='r'>{dinero(imp)}</td></tr>"
        )

    mo_html, mo_tot = mano_de_obra_html(q, cfg, regiones_mo)
    cuenta = f'<p class="muted">{reg["cuenta_texto"]}</p>' if reg.get("cuenta_texto") else ""
    proyecto = f'<p class="lbl" style="margin-top:6px">Proyecto</p><p>{q["proyecto"]}</p>' if q.get("proyecto") else ""
    destino = q.get("ciudad") or q["estado"]
    lugares = [sin_acentos(x).lower().strip() for x in (q["estado"], q.get("ciudad", ""))]
    if any(x in reg.get("envio_directo", []) for x in lugares):
        envio_txt = "envío sin costo"
    elif any(x in reg["envio_gratis"] for x in lugares):
        envio_txt = "envío consolidado sin costo"
    else:
        envio_txt = "flete por cotizar"
    proyecto += f'<p class="lbl" style="margin-top:6px">Entrega</p><p>{destino} · {envio_txt}</p>'

    valores = {
        "titulo": f"Cotización {q['cliente']}",
        "logo": data_uri("assets/logo.png"),
        "qr": data_uri("assets/qr.png"),
        "empresa_nombre": reg["razon_social"].upper(),
        "rfc_bloque": f"<p><b>{reg['rfc']}</b></p>" if reg.get("rfc") else "",
        "email": cfg["empresa"]["email"],
        "web": cfg["empresa"]["web"],
        "direccion": reg["direccion"],
        "telefonos": reg["telefonos"],
        "cuenta_bloque": cuenta,
        "fecha": ahora.strftime("%m/%d/%Y %I:%M:%S %p"),
        "vigencia": vigencia.strftime("%m/%d/%Y"),
        "folio": str(q.get("folio", "PRUEBA")),
        "cliente": q["cliente"],
        "proyecto_bloque": proyecto,
        "partidas": "".join(partidas),
        "subtotal": dinero(subtotal),
        "total": dinero(subtotal),
        "num_piezas": f"{piezas:g}",
        "mano_de_obra": mo_html,
        "condiciones": cfg["condiciones"],
    }
    html = open(os.path.join(AQUI, "plantilla.html"), encoding="utf-8").read()
    for k, v in valores.items():
        html = html.replace("{{" + k + "}}", v)

    base = os.path.join(salida, f"cotizacion-{slug(q['cliente'])}")
    open(base + ".html", "w", encoding="utf-8").write(html)
    hecho_pdf = renderizar_pdf(base + ".html", base + ".pdf")

    print(f"Región: {reg['nombre']} | Material: {dinero(subtotal)} | Entrega {destino}: {envio_txt}")
    for r, (mn, mx) in mo_tot.items():
        print(f"Mano de obra {cfg['regiones'][r]['nombre']}: {dinero_rango(mn, mx)} → total proyecto {dinero_rango(subtotal + mn, subtotal + mx)}")
    print(f"Cuenta para transferencia: {reg['cuenta_imagen']}")
    print("PDF:", base + ".pdf" if hecho_pdf else "(no generado)")
    print("HTML:", base + ".html", f"({os.path.getsize(base + '.html') // 1024} KB)")


if __name__ == "__main__":
    main()
