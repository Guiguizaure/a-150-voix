// Contraste WCAG 2.x entre deux couleurs hexadécimales (#rrggbb).

export type Rgb = readonly [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(n))
    throw new Error(`Couleur invalide : ${hex}`);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mélange façon color-mix(in srgb, a part, b) : part = proportion de a (0 à 1). */
export function mixRgb(a: Rgb, b: Rgb, part: number): Rgb {
  return [0, 1, 2].map(
    (i) => a[i]! * part + b[i]! * (1 - part),
  ) as unknown as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRgb(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

export function contrast(a: string, b: string): number {
  return contrastRgb(hexToRgb(a), hexToRgb(b));
}

/** Seuils RGAA / WCAG AA : texte courant 4,5:1, élément graphique porteur de sens 3:1. */
export const AA_TEXT = 4.5;
export const AA_GRAPHIC = 3;
