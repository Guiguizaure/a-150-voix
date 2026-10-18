import { describe, expect, it } from "vitest";
import { PALETTES } from "@/lib/palette";
import { hemicycle, intro } from "../formations";
import { fauxContexte } from "../test/faux-canvas";
import { creerScenes } from "../scenes";
import { Engine } from "./engine";
import { rng } from "./math";

function moteur(options: ConstructorParameters<typeof Engine>[2] = {}) {
  const e = new Engine(fauxContexte(), PALETTES.nuit, {
    rng: rng(1),
    ...options,
  });
  e.resize(800, 500);
  e.poser(intro(e.W, e.H));
  return e;
}

describe("moteur", () => {
  it("150 points, chacun sur un siège distinct de la formation", () => {
    const e = moteur();
    const assign = e.setFormation(() => hemicycle(e.W, e.H));
    expect(new Set(assign).size).toBe(150);
  });

  it("l'horloge n'avance qu'à chaque image, et pas plus de 50 ms à la fois", () => {
    const e = moteur();
    expect(e.now).toBe(0);
    e.frame(0.016);
    e.frame(3);
    expect(e.now).toBeCloseTo(0.066);
  });

  it("une transition mène chaque point à son siège", () => {
    const e = moteur();
    const sieges = hemicycle(e.W, e.H);
    const assign = e.setFormation(() => sieges, { dur: 0.5, stagger: 0.2 });
    for (let i = 0; i < 40; i++) e.frame(0.05);
    e.updateDots();
    e.dots.forEach((d, i) => {
      expect(d.bx).toBeCloseTo(sieges[assign[i]!]!.x);
      expect(d.by).toBeCloseTo(sieges[assign[i]!]!.y);
    });
  });

  it("à l'arrivée directe ou en mouvement réduit, les points sont posés sans transition", () => {
    for (const e of [moteur({ reducedMotion: true }), moteur()]) {
      e.arrivee = !e.rm;
      const sieges = hemicycle(e.W, e.H);
      const assign = e.setFormation(() => sieges, { dur: 2 });
      e.fadeTo(1, 2);
      e.dots.forEach((d, i) => {
        expect(d.bx).toBe(sieges[assign[i]!]!.x);
        expect(d.a).toBe(1);
      });
    }
  });

  it("redimensionner recale la formation en cours", () => {
    const e = moteur();
    const assign = e.setFormation(() => hemicycle(e.W, e.H));
    e.resize(390, 405);
    const sieges = hemicycle(390, 405);
    e.dots.forEach((d, i) => expect(d.bx).toBe(sieges[assign[i]!]!.x));
  });

  it("dessine chaque scène enregistrée sans erreur", () => {
    const e = moteur();
    const scenes = creerScenes(e);
    e.enregistrer(scenes);
    for (const id of Object.keys(scenes) as (keyof typeof scenes)[]) {
      e.aller(id);
      for (let i = 0; i < 120; i++) e.frame(0.05);
    }
    expect(
      e.dots.every((d) => Number.isFinite(d.bx) && Number.isFinite(d.by)),
    ).toBe(true);
  });
});
