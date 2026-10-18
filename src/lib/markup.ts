// Mini-balisage des textes du contenu : **gras**, *accent*, [lien](https://…), ^exposant^.
// Pas d'imbrication, sauf du texte simple dans chaque marque.

export type Segment =
  | { readonly type: "texte"; readonly texte: string }
  | { readonly type: "gras"; readonly texte: string }
  | { readonly type: "accent"; readonly texte: string }
  | { readonly type: "exposant"; readonly texte: string }
  | { readonly type: "lien"; readonly texte: string; readonly href: string };

const MARQUE =
  /\*\*([^*]+)\*\*|\*([^*]+)\*|\^([^^]+)\^|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseMarkup(source: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of source.matchAll(MARQUE)) {
    if (m.index > last)
      out.push({ type: "texte", texte: source.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ type: "gras", texte: m[1] });
    else if (m[2] !== undefined) out.push({ type: "accent", texte: m[2] });
    else if (m[3] !== undefined) out.push({ type: "exposant", texte: m[3] });
    else out.push({ type: "lien", texte: m[4]!, href: m[5]! });
    last = m.index + m[0].length;
  }
  if (last < source.length)
    out.push({ type: "texte", texte: source.slice(last) });
  return out;
}

/** Le texte lu, sans les marques ni les adresses des liens. */
export function plainText(source: string): string {
  return parseMarkup(source)
    .map((s) => s.texte)
    .join("");
}

/** Caractères de balisage restés seuls (marque mal fermée, lien cassé). */
export function strayMarks(source: string): string[] {
  return [...plainText(source).matchAll(/\*|\^|\[|\]\(/g)].map((m) => m[0]);
}
