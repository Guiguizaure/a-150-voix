import { describe, expect, it } from "vitest";
import { fixTypo, NBSP, NNBSP, typoIssues } from "./typo";

describe("fixTypo", () => {
  it("met une fine insécable avant ; ! ?", () => {
    expect(fixTypo("Pourquoi tirer au sort ?")).toBe(
      `Pourquoi tirer au sort${NNBSP}?`,
    );
    expect(fixTypo("Vraiment!")).toBe(`Vraiment${NNBSP}!`);
    expect(fixTypo("deux tiers ; le reste")).toBe(
      `deux tiers${NNBSP}; le reste`,
    );
  });

  it("met une insécable avant : et dans les guillemets", () => {
    expect(fixTypo("Essayez : faites")).toBe(`Essayez${NBSP}: faites`);
    expect(fixTypo("« sans filtre »")).toBe(`«${NBSP}sans filtre${NBSP}»`);
  });

  it("groupe les milliers et lie les unités", () => {
    expect(fixTypo("1 093 030 soutiens")).toBe(
      `1${NNBSP}093${NNBSP}030 soutiens`,
    );
    expect(fixTypo("20 000 € et 76 %")).toBe(
      `20${NNBSP}000${NBSP}€ et 76${NBSP}%`,
    );
    expect(fixTypo("≈ 3 M€")).toBe(`≈ 3${NBSP}M€`);
    expect(fixTypo("environ 3 millions")).toBe(`environ 3${NBSP}millions`);
  });

  it("ne groupe pas des nombres voisins qui n'en forment pas un", () => {
    expect(fixTypo("les 6 et 7 février 2027")).toBe("les 6 et 7 février 2027");
    expect(fixTypo("en 2015 avec 62")).toBe("en 2015 avec 62");
  });

  it("corrige apostrophes, points de suspension et intervalles", () => {
    expect(fixTypo("l'assemblée...")).toBe("l’assemblée…");
    expect(fixTypo("2019-2020 · 19-20 sept.")).toBe("2019–2020 · 19–20 sept.");
    expect(fixTypo("décision 2026-910 DC, n° 2019-1-8 RIP")).toBe(
      "décision 2026-910 DC, n° 2019-1-8 RIP",
    );
  });

  it("ne touche pas aux adresses", () => {
    const lien =
      "la [vidéothèque](https://www.uncommunaccord.fr/videotheque?x=1&y=l'a) : ici";
    expect(fixTypo(lien)).toBe(
      `la [vidéothèque](https://www.uncommunaccord.fr/videotheque?x=1&y=l'a)${NBSP}: ici`,
    );
  });

  it("est idempotente", () => {
    const t = "Où en est l'assemblée ? « 200 000 » : 102,16 € ; 2019-2020";
    expect(fixTypo(fixTypo(t))).toBe(fixTypo(t));
  });
});

describe("typoIssues", () => {
  it("ne signale rien sur un texte correct", () => {
    expect(typoIssues(fixTypo("Où en est l'assemblée ?"))).toEqual([]);
  });

  it("signale ce qui reste à corriger", () => {
    expect(typoIssues("Pourquoi ?")[0]).toMatch(/pnpm typo/);
    expect(typoIssues('un "mot"')).toContain(
      "guillemets droits : utiliser « »",
    );
    expect(typoIssues("200000 numéros")).toContain(
      "nombre sans espace fine entre les milliers",
    );
    expect(typoIssues("fin .")).toContain(
      "espace avant une virgule ou un point",
    );
  });
});
