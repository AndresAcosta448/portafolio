"""
Extrae las imagenes incrustadas de un .docx del portafolio y las deja
optimizadas (JPEG) en assets/img, con el mismo nombre que usa index.html.

Uso:
    python extraer_imagenes.py "ruta al PORTAFOLIO_REDES.docx"
"""

import sys
import zipfile
from pathlib import Path
from PIL import Image

# mapea el n-esimo image{N} embebido en el docx al nombre final usado en la web
MAPEO = {
    "image3": ("comic-premisa1.jpg", 1600, 85),
    "image4": ("packet-tracer-premisa3.jpg", None, 90),
    "image5": ("infografia-premisa4.jpg", None, 92),
    "image6": ("periodico-premisa7.jpg", 1100, 88),
}

DEST_DIR = Path(__file__).resolve().parent.parent / "assets" / "img"


def convertir(origen_bytes, destino, max_ancho, calidad):
    from io import BytesIO
    im = Image.open(BytesIO(origen_bytes))
    if im.mode in ("RGBA", "P", "LA"):
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        fondo.paste(im, mask=im.split()[-1])
        im = fondo
    else:
        im = im.convert("RGB")
    if max_ancho and im.width > max_ancho:
        ratio = max_ancho / im.width
        im = im.resize((max_ancho, int(im.height * ratio)), Image.LANCZOS)
    im.save(destino, "JPEG", quality=calidad, optimize=True)
    print(f"  -> {destino.name} ({im.size[0]}x{im.size[1]})")


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    docx_path = Path(sys.argv[1])
    if not docx_path.exists():
        print(f"No se encontro el archivo: {docx_path}")
        sys.exit(1)

    DEST_DIR.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(docx_path) as z:
        media_files = [n for n in z.namelist() if n.startswith("word/media/")]
        print(f"Imagenes encontradas en el docx: {len(media_files)}")

        for nombre in media_files:
            stem = Path(nombre).stem  # ej: "image3"
            if stem in MAPEO:
                destino_nombre, max_ancho, calidad = MAPEO[stem]
                destino = DEST_DIR / destino_nombre
                convertir(z.read(nombre), destino, max_ancho, calidad)

    print("Listo. Revisa assets/img/ y recarga index.html.")


if __name__ == "__main__":
    main()
