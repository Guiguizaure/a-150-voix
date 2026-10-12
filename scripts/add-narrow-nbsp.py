"""Ajoute l'espace fine insécable (U+202F) à une police variable qui n'en a pas.

Glyphe vide, chasse fixe de 1/8 de cadratin (espace fine de la typographie française), la
même sur tous les axes (aucune variation dans gvar ni dans HVAR). Hanken Grotesk et Newsreader
n'ont pas ce glyphe : sans lui, le navigateur prend celui de la police système, et le canvas
des images Open Graph (Node) n'aurait aucune police de repli. Licence OFL, sans nom réservé :
la version modifiée garde son nom.

Usage : python scripts/add-narrow-nbsp.py <police.woff2> (fichier modifié sur place, fonttools)
"""

import sys

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph
from fontTools.ttLib.tables.otTables import NO_VARIATION_INDEX

NAME, CODE = "uni202F", 0x202F


def main(path: str) -> None:
    font = TTFont(path)
    cmap = font.getBestCmap()
    if CODE in cmap:
        print(f"{path} : U+202F déjà présente")
        return
    for tag in font.keys():  # lire toutes les tables avant de changer l'ordre des glyphes
        font[tag]
    width = round(font["head"].unitsPerEm / 8)
    font.setGlyphOrder(font.getGlyphOrder() + [NAME])
    font["glyf"][NAME] = Glyph()
    font["hmtx"][NAME] = (width, 0)
    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[CODE] = NAME
    if "gvar" in font:
        font["gvar"].variations[NAME] = []
    if "HVAR" in font:
        hvar = font["HVAR"].table
        for mapping in (hvar.AdvWidthMap, hvar.LsbMap, hvar.RsbMap):
            if mapping is not None:
                mapping.mapping[NAME] = NO_VARIATION_INDEX
    font.save(path)
    print(f"{path} : U+202F ajoutée ({width} unités sur {font['head'].unitsPerEm})")


if __name__ == "__main__":
    main(sys.argv[1])
