import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AA_GRAPHIC,
  AA_TEXT,
  contrast,
  contrastRgb,
  hexToRgb,
  mixRgb,
} from "./contrast";
import { PALETTES, PALETTE_SCRIPT, type PaletteId } from "./palette";

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

describe.each(
  Object.entries(PALETTES) as [PaletteId, (typeof PALETTES)[PaletteId]][],
)("palette %s", (id, p) => {
  const bg = hexToRgb(p.bg);
  const fg = hexToRgb(p.fg);

  it("textes au moins à 4,5:1", () => {
    expect(contrast(p.fg, p.bg)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(p.muted, p.bg)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(p.hi, p.bg)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRgb(mixRgb(fg, bg, 0.8), bg)).toBeGreaterThanOrEqual(
      AA_TEXT,
    );
    expect(contrast(p.bg, p.fg)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("graphiques au moins à 3:1 (accent, siège vide à 60 %)", () => {
    expect(contrast(p.accent, p.bg)).toBeGreaterThanOrEqual(AA_GRAPHIC);
    expect(contrastRgb(mixRgb(fg, bg, 0.6), bg)).toBeGreaterThanOrEqual(
      AA_GRAPHIC,
    );
  });

  it("globals.css reprend les mêmes valeurs", () => {
    for (const [nom, valeur] of Object.entries(p)) {
      expect(css, `${id} --${nom}`).toContain(`--${nom}: ${valeur};`);
    }
  });
});

it("le script de <head> n'accepte que les deux palettes", () => {
  expect(PALETTE_SCRIPT).toContain('"a150-palette"');
  expect(PALETTE_SCRIPT).toMatch(/p==="nuit"\|\|p==="papier"/);
});
