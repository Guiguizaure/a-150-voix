#!/usr/bin/env bash
# Newsreader italique allégée : graisse 500 seule (axe wght figé), axe de taille optique (opsz
# 6 à 72) conservé, sous-ensemble latin de base + Latin-1 + caractères français (œ Œ Ÿ, ’ ‘ “ ”,
# « », espaces insécables et fines, tirets, points de suspension, €). Fait avec fonttools.
#
# Usage : scripts/subset-newsreader.sh <Newsreader-Italic[opsz,wght].ttf> [python avec fonttools]
# Source : https://github.com/google/fonts/tree/main/ofl/newsreader (licence OFL, assets/fonts).
set -euo pipefail

SRC="${1:?Chemin du fichier Newsreader-Italic[opsz,wght].ttf}"
PY="${2:-python3}"
OUT="assets/fonts/newsreader-italic-500-opsz.woff2"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

"$PY" -m fontTools.varLib.instancer "$SRC" wght=500 -o "$TMP/instance.ttf"

"$PY" -m fontTools.subset "$TMP/instance.ttf" \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+02BC,U+2009,U+2013-2014,U+2018-201D,U+2026,U+202F,U+20AC" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk" \
  --no-hinting --desubroutinize \
  --flavor=woff2 --output-file="$OUT"

# Newsreader n'a pas d'espace fine insécable : on l'ajoute (voir le script).
"$PY" "$(dirname "$0")/add-narrow-nbsp.py" "$OUT"

ls -l "$OUT"
