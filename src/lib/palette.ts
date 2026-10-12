// Palettes validées : Nuit (défaut, même si le système est en clair) et Papier (claire, au
// choix), accent Lampe. Source unique des couleurs : globals.css en reprend les valeurs
// (vérifié par palette.test.ts), le canvas les lit ici. L'accent ne sert jamais de couleur de texte : le texte d'accent est en `hi`.

export type PaletteId = "nuit" | "papier";

export interface Palette {
  readonly bg: string;
  readonly fg: string;
  readonly muted: string;
  /** Points et graphiques surlignés (contraste ≥ 3:1). */
  readonly accent: string;
  /** Texte d'accent : italiques, numéros, texte du canvas (contraste ≥ 4,5:1). */
  readonly hi: string;
  /** Bouton plein « Soutenir sur Ulule » : fond Lampe dans les deux palettes, texte foncé. */
  readonly cta: string;
  readonly ctaTexte: string;
}

export const PALETTES: Record<PaletteId, Palette> = {
  nuit: {
    bg: "#0e1014",
    fg: "#ece6d8",
    muted: "#958f84",
    accent: "#f1d06b",
    hi: "#f6dc8a",
    cta: "#f1d06b",
    ctaTexte: "#0e1014",
  },
  papier: {
    bg: "#ece5d5",
    fg: "#1c1b1f",
    muted: "#675f53",
    accent: "#956f00",
    hi: "#785800",
    cta: "#f1d06b",
    ctaTexte: "#1c1b1f",
  },
};

/** Clé du choix de palette dans localStorage (Nuit par défaut). */
export const PALETTE_KEY = "a150-palette";

export function estPalette(v: unknown): v is PaletteId {
  return v === "nuit" || v === "papier";
}

/**
 * Script inline posé dans <head>, avant le premier rendu : applique le choix enregistré.
 * Sans choix (ou sans JavaScript), la palette est Nuit, quel que soit le système.
 */
export const PALETTE_SCRIPT = `try{var p=localStorage.getItem(${JSON.stringify(PALETTE_KEY)});if(p==="nuit"||p==="papier")document.documentElement.dataset.palette=p}catch(e){}`;
