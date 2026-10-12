// Polices du site, dans le dépôt (assets/fonts, licence OFL) : le build ne dépend d'aucun
// service extérieur. Mêmes fichiers que Google Fonts, un @font-face par sous-ensemble (latin
// préchargé, latin étendu à la demande), plages unicode de l'API CSS de Google Fonts écrites
// en toutes lettres (next/font exige des littéraux). Les variables --font-face-* ne servent
// qu'à inclure chaque @font-face ; les familles sont nommées dans globals.css.
import localFont from "next/font/local";

// Hanken Grotesk 300 à 700 (police variable) : le texte.
const hanken = localFont({
  src: "../../assets/fonts/hanken-grotesk-latin.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
  variable: "--font-face-hanken-latin",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Hanken Grotesk" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});
const hankenLatinExt = localFont({
  src: "../../assets/fonts/hanken-grotesk-latin-ext.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-face-hanken-latin-ext",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Hanken Grotesk" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

// Newsreader italique 500, axe de taille optique 6 à 72 conservé : les accents (wordmark, mot
// d'accent des titres, numéros, notes, citations, frise). Fichier allégé avec fonttools
// (scripts/subset-newsreader.sh) : graisse 500 seule, latin et caractères français, un seul
// fichier, préchargé.
const newsreader = localFont({
  src: "../../assets/fonts/newsreader-italic-500-opsz.woff2",
  weight: "500",
  style: "italic",
  display: "swap",
  variable: "--font-face-newsreader",
  adjustFontFallback: false,
  declarations: [{ prop: "font-family", value: "Newsreader" }],
});

/** Classes à poser sur <html> pour inclure les @font-face. */
export const fontClasses = [hanken, hankenLatinExt, newsreader]
  .map((f) => f.variable)
  .join(" ");
