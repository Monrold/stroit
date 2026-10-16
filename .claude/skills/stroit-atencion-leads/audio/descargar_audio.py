#!/usr/bin/env python3
"""Descarga una toma de ElevenLabs y la deja lista para enviar.

Uso:
    python3 descargar_audio.py <url> <salida_sin_extension>

Guarda <salida>.mp3 (Instagram/Facebook) y, si hay ffmpeg, <salida>.ogg
con Opus, que WhatsApp reproduce como nota de voz.
"""
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    url, salida = sys.argv[1], Path(sys.argv[2])
    salida.parent.mkdir(parents=True, exist_ok=True)

    mp3 = salida.with_suffix(".mp3")
    with urllib.request.urlopen(url) as r, open(mp3, "wb") as f:
        shutil.copyfileobj(r, f)
    print(f"MP3: {mp3} ({mp3.stat().st_size // 1024} KB)")

    if not shutil.which("ffmpeg"):
        print("Sin ffmpeg: no se generó el .ogg para WhatsApp.")
        return
    ogg = salida.with_suffix(".ogg")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3),
         "-c:a", "libopus", "-b:a", "32k", "-ac", "1", "-ar", "48000",
         "-application", "voip", str(ogg)],
        check=True,
    )
    print(f"OGG (nota de voz WhatsApp): {ogg} ({ogg.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
