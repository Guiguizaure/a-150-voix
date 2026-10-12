import { describe, expect, it } from "vitest";
import { ETAPES } from "@content/etapes";
import { adresse, etape, fil, rang, scene, TOTAL } from "./guide";

describe("ordre du guide", () => {
  it("donne le rang de chaque adresse", () => {
    expect(rang("/")).toBe(0);
    expect(rang("/hasard")).toBe(1);
    expect(rang("/hasard/")).toBe(1);
    expect(rang("/soutenir.html")).toBe(8);
    expect(rang("/mentions-legales")).toBe(-1);
  });

  it("fait l'aller-retour entre rang et adresse", () => {
    for (let r = 0; r <= TOTAL; r++) expect(rang(adresse(r))).toBe(r);
    expect(adresse(99)).toBe("/soutenir");
  });

  it("associe une scène à chaque adresse", () => {
    expect(scene("/")).toBe("intro");
    expect(scene("/dilemme")).toBe("dilemme");
    expect(scene("/sources")).toBe("intro");
  });

  it("écrit le fil de l'étape", () => {
    expect(fil(etape("dilemme")!)).toEqual({
      numero: 3,
      texte: "sur 6 · Le dilemme",
    });
    expect(fil(ETAPES[7]!).texte).toBe("Aller plus loin · Soutenir");
  });
});
