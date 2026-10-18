// Typographie française des textes du contenu. `fixTypo` corrige ce qui peut l'être sans
// ambiguïté (pnpm typo l'applique aux fichiers de content/) ; `typoIssues` liste ce qui
// reste à corriger, et sert de garde-fou dans les tests.
//
// - espace fine insécable (U+202F) avant ; ! ? et entre les groupes de chiffres ;
// - espace insécable (U+00A0) avant : et %, €, entre « » et le texte ;
// - apostrophe typographique ’, points de suspension …, tiret demi-cadratin – des
//   intervalles (2019–2020, 19–20 sept.).

export const NBSP = "\u00A0";
export const NNBSP = "\u202F";

const MOIS =
  "janv|févr|mars|avr|mai|juin|juil|août|sept|oct|nov|déc|janvier|février|avril|juillet|septembre|octobre|novembre|décembre";

/** Adresses : cible des liens et URL nues, jamais retouchées. */
const URLS = /\]\([^)\s]*\)|https?:\/\/[^\s)]+/g;

/**
 * Applique `fix` au texte hors adresses : chaque adresse est remplacée par un caractère
 * d'usage privé le temps de la correction, pour que les règles voient ses voisins.
 */
function outsideUrls(source: string, fix: (text: string) => string): string {
  const adresses: string[] = [];
  const masque = source.replace(URLS, (m) => {
    adresses.push(m);
    return String.fromCharCode(0xe000 + adresses.length - 1);
  });
  return fix(masque).replace(
    /[\ue000-\uf8ff]/g,
    (c) => adresses[c.charCodeAt(0) - 0xe000]!,
  );
}

function fixText(t: string): string {
  return (
    t
      .replace(/'/g, "’")
      .replace(/\.\.\./g, "…")
      .replace(/ {2,}/g, " ")
      // Intervalles : années, puis jours suivis d'un mois.
      .replace(/\b((?:19|20)\d{2})-((?:19|20)\d{2})\b/g, "$1–$2")
      .replace(
        new RegExp(`\\b(\\d{1,2})-(\\d{1,2})(?= (?:${MOIS})\\b)`, "g"),
        "$1–$2",
      )
      // Milliers : 200 000, 1 093 030.
      .replace(/(\d)[ \u00A0](?=\d{3}(?!\d))/g, `$1${NNBSP}`)
      .replace(/(\d)[ \u00A0\u202F]?(%|€|M€|Md€)/g, `$1${NBSP}$2`)
      .replace(/(\d) (millions?|milliards?)\b/g, `$1${NBSP}$2`)
      .replace(/«[ \u00A0\u202F]?/g, `«${NBSP}`)
      .replace(/[ \u00A0\u202F]?»/g, `${NBSP}»`)
      .replace(/(\S)[ \u00A0\u202F]?([;!?])(?=[\s»)*]|$)/g, `$1${NNBSP}$2`)
      .replace(/(\S)[ \u00A0\u202F]?:(?=\s|$)/g, `$1${NBSP}:`)
  );
}

export function fixTypo(source: string): string {
  return outsideUrls(source, fixText);
}

/** Problèmes typographiques d'un texte (vide si tout va bien). */
export function typoIssues(source: string): string[] {
  const issues: string[] = [];
  const avant = [...source];
  const apres = [...fixTypo(source)];
  const i = apres.findIndex((c, k) => c !== avant[k]);
  if (i !== -1 || apres.length !== avant.length) {
    const k = i === -1 ? avant.length : i;
    const extrait = apres.slice(Math.max(0, k - 12), k + 12).join("");
    issues.push(`à corriger (pnpm typo) : « …${extrait}… »`);
  }
  const texte = source.replace(URLS, "\ue000");
  if (texte.includes('"')) issues.push("guillemets droits : utiliser « »");
  if (/\d{5,}/.test(texte))
    issues.push("nombre sans espace fine entre les milliers");
  if (/ [,.]/.test(texte)) issues.push("espace avant une virgule ou un point");
  if (/^\s|\s$/.test(source)) issues.push("espace en début ou en fin de texte");
  return issues;
}
