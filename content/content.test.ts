// Garde-fous du contenu : typographie, chiffres sourcés, registre cohérent, symétrie des
// dilemmes, docs/sources.md à jour.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseMarkup, plainText, strayMarks } from "@/lib/markup";
import {
  aCompleter,
  CLES_SANS_FAIT,
  NOM_DU_SITE,
  estStrict,
  faitsCites,
  sourcesMarkdown,
  textes,
} from "@/lib/registre";
import { typoIssues } from "@/lib/typo";
import { EXEMPLES, type Option } from "./dilemmes";
import { FORMES } from "./democratie";
import { ETAPES } from "./etapes";
import { CONTENU } from "./index";
import { SESSIONS } from "./sessions";
import { FAITS, SOURCES, type Fait } from "./sources";

const affiches = textes(CONTENU);
const registre = textes({ SOURCES, FAITS });

describe("typographie", () => {
  it.each([...affiches, ...registre].filter((t) => !t.langue))(
    "$chemin",
    ({ valeur }) => {
      expect(typoIssues(valeur)).toEqual([]);
      expect(strayMarks(valeur)).toEqual([]);
    },
  );
});

describe("faits", () => {
  it("chaque texte qui contient un chiffre cite au moins un fait", () => {
    const orphelins = affiches
      .filter((t) => !CLES_SANS_FAIT.has(t.cle))
      .filter((t) =>
        /\d/.test(
          plainText(t.valeur.replace(NOM_DU_SITE, "")).replace(
            /https:\/\/\S+/g,
            "",
          ),
        ),
      )
      .filter((t) => t.faits.length === 0)
      .map((t) => `${t.chemin} : ${t.valeur}`);
    expect(orphelins).toEqual([]);
  });

  it("chaque fait du registre est cité, directement ou par un calcul", () => {
    const cites = faitsCites(CONTENU);
    for (const f of Object.values(FAITS) as Fait[])
      f.calcul?.depuis.forEach((d) => cites.add(d));
    expect(Object.keys(FAITS).filter((id) => !cites.has(id))).toEqual([]);
  });

  it("les faits cités existent", () => {
    const inconnus = [...faitsCites(CONTENU)].filter((id) => !(id in FAITS));
    expect(inconnus).toEqual([]);
  });

  it.each(Object.entries(FAITS as Record<string, Fait>))(
    "%s : statut cohérent",
    (_id, f) => {
      if (f.statut === "verifie") {
        expect(f.sources.length).toBeGreaterThan(0);
        expect(f.verifie).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      if (f.statut === "calcul") {
        expect(f.calcul?.depuis.length).toBeGreaterThan(0);
        f.calcul?.depuis.forEach((d) => expect(FAITS).toHaveProperty(d));
      } else expect(f.calcul).toBeUndefined();
      if (f.statut === "a-sourcer") expect(f.sources).toEqual([]);
    },
  );

  it("chaque source sert à au moins un fait", () => {
    const utilisees = new Set(
      (Object.values(FAITS) as Fait[]).flatMap((f) => f.sources),
    );
    expect(
      Object.keys(SOURCES).filter((s) => !utilisees.has(s as never)),
    ).toEqual([]);
  });

  it("les adresses sont en https", () => {
    const liens = [
      ...Object.values(SOURCES).map((s) => s.url),
      ...affiches.flatMap((t) =>
        parseMarkup(t.valeur).flatMap((s) =>
          s.type === "lien" ? [s.href] : [],
        ),
      ),
    ];
    for (const l of liens) expect(l).toMatch(/^https:\/\/[^\s]+$/);
  });
});

describe("étapes", () => {
  it("huit étapes numérotées dans l'ordre, slugs uniques", () => {
    expect(ETAPES.map((e) => e.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(ETAPES.map((e) => e.slug)).size).toBe(8);
    expect(ETAPES.filter((e) => e.partie === "comprendre")).toHaveLength(6);
  });

  it("dates de session valides et dans l'ordre", () => {
    const debuts = SESSIONS.flatMap((s) => (s.debut ? [s.debut] : []));
    expect([...debuts].sort()).toEqual(debuts);
    for (const s of SESSIONS) {
      if (s.debut) expect(s.debut.startsWith(s.moisIso)).toBe(true);
      expect(Boolean(s.debut)).toBe(Boolean(s.fin));
    }
  });

  it("six formes de participation, même structure", () => {
    expect(FORMES).toHaveLength(6);
    for (const f of FORMES) {
      expect(f.texte.length).toBeGreaterThan(0);
      expect(f.limite.length).toBeGreaterThan(0);
      expect(f.legende).toHaveLength(2);
    }
  });
});

describe("neutralité des dilemmes", () => {
  const mots = (s: string) => s.split(/\s+/).length;
  const champs: (keyof Option)[] = ["etiquette", "gain", "cout"];

  it.each(EXEMPLES.map((e) => [e.bouton, e] as const))(
    "%s : options A et B de longueurs proches",
    (_nom, e) => {
      for (const c of champs) {
        const [a, b] = [e.a[c], e.b[c]];
        const ratio =
          Math.max(a.length, b.length) / Math.min(a.length, b.length);
        expect(ratio, `${c} : « ${a} » / « ${b} »`).toBeLessThanOrEqual(1.25);
        expect(Math.abs(mots(a) - mots(b)), c).toBeLessThanOrEqual(2);
      }
    },
  );
});

describe("registre", () => {
  it("docs/sources.md est à jour (pnpm sources)", () => {
    const fichier = readFileSync(
      new URL("../docs/sources.md", import.meta.url),
      "utf8",
    );
    expect(fichier).toBe(sourcesMarkdown());
  });

  it("le mode strict suit STRICT=1 ou SITE_LAUNCHED=1", () => {
    expect(estStrict({})).toBe(false);
    expect(estStrict({ STRICT: "1" })).toBe(true);
    expect(estStrict({ SITE_LAUNCHED: "1" })).toBe(true);
  });

  it("repère les emplacements à compléter", () => {
    expect(aCompleter({ a: [{ aCompleter: true, indication: "x" }] })).toEqual([
      "a[0]",
    ]);
  });
});
