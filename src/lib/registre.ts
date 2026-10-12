// Parcours du contenu et du registre des sources : textes à contrôler, faits cités, bilan
// pour le build et génération de docs/sources.md.
import { CONTENU } from "@content/index";
import {
  FAITS,
  SOURCES,
  type Fait,
  type FaitId,
  type Source,
  type Statut,
} from "@content/sources";
import { estACompleter } from "@content/types";

/** Clés dont la valeur n'est pas du texte affiché (adresses, identifiants, dates ISO). */
export const CLES_TECHNIQUES = new Set([
  "href",
  "url",
  "slug",
  "id",
  "partie",
  "debut",
  "fin",
  "moisIso",
  "tours",
  "numero",
  "sessions",
  "principal",
  "aCompleter",
  "election",
  "faits",
  "depuis",
  "langue",
  "statut",
  "verifie",
  "publie",
  "consulte",
]);

/** Textes où un chiffre n'est pas une affirmation (estimation du guide lui-même). */
export const CLES_SANS_FAIT = new Set(["dureeLecture"]);

export interface TexteTrouve {
  readonly chemin: string;
  readonly cle: string;
  readonly valeur: string;
  /** Faits cités par l'objet le plus proche qui en cite (vide sinon). */
  readonly faits: readonly string[];
  /** Langue de l'objet, si elle n'est pas le français. */
  readonly langue?: string;
}

function faitsDe(x: object): readonly string[] | undefined {
  const f = (x as { faits?: unknown }).faits;
  return Array.isArray(f) && f.length > 0 ? (f as string[]) : undefined;
}

/** Tous les textes d'un arbre de contenu, avec les faits qui les couvrent. */
export function textes(racine: unknown, chemin = ""): TexteTrouve[] {
  const out: TexteTrouve[] = [];
  const visite = (
    x: unknown,
    ch: string,
    cle: string,
    faits: readonly string[],
    langue?: string,
  ) => {
    if (typeof x === "string") {
      out.push({ chemin: ch, cle, valeur: x, faits, langue });
    } else if (Array.isArray(x)) {
      x.forEach((v, i) => visite(v, `${ch}[${i}]`, cle, faits, langue));
    } else if (typeof x === "object" && x !== null) {
      const f = faitsDe(x) ?? faits;
      const l = (x as { langue?: string }).langue ?? langue;
      for (const [k, v] of Object.entries(x)) {
        if (!CLES_TECHNIQUES.has(k)) visite(v, ch ? `${ch}.${k}` : k, k, f, l);
      }
    }
  };
  visite(racine, chemin, "", []);
  return out;
}

/** Identifiants de faits cités dans un arbre (champs `faits`). */
export function faitsCites(racine: unknown): Set<string> {
  const out = new Set<string>();
  const visite = (x: unknown) => {
    if (Array.isArray(x)) x.forEach(visite);
    else if (typeof x === "object" && x !== null) {
      for (const [k, v] of Object.entries(x)) {
        if (k === "faits" && Array.isArray(v))
          v.forEach((id) => out.add(String(id)));
        else visite(v);
      }
    }
  };
  visite(racine);
  return out;
}

/** Emplacements à compléter (chemins). */
export function aCompleter(racine: unknown, chemin = ""): string[] {
  const out: string[] = [];
  const visite = (x: unknown, ch: string) => {
    if (estACompleter(x)) out.push(ch);
    else if (Array.isArray(x)) x.forEach((v, i) => visite(v, `${ch}[${i}]`));
    else if (typeof x === "object" && x !== null)
      for (const [k, v] of Object.entries(x)) visite(v, ch ? `${ch}.${k}` : k);
  };
  visite(racine, chemin);
  return out;
}

const faits = FAITS as Record<FaitId, Fait>;
const sources = SOURCES as Record<string, Source>;

export const LIBELLES: Record<Statut, string> = {
  verifie: "vérifié",
  calcul: "calcul",
  "a-sourcer": "à sourcer",
  "a-reverifier": "à revérifier",
};

const TITRES: Record<Statut, string> = {
  verifie: "Faits vérifiés",
  calcul: "Faits calculés",
  "a-sourcer": "Faits à sourcer",
  "a-reverifier": "Faits à revérifier",
};

export function bilan() {
  const parStatut: Record<Statut, FaitId[]> = {
    verifie: [],
    calcul: [],
    "a-sourcer": [],
    "a-reverifier": [],
  };
  for (const [id, f] of Object.entries(faits))
    parStatut[f.statut].push(id as FaitId);
  return { parStatut, aCompleter: aCompleter(CONTENU) };
}

/** Ce qui interdit la mise en ligne publique (vide si rien). */
export function bloquantsLancement(): string[] {
  const { parStatut, aCompleter: trous } = bilan();
  return [
    ...parStatut["a-sourcer"].map((id) => `fait à sourcer : ${id}`),
    ...parStatut["a-reverifier"].map((id) => `fait à revérifier : ${id}`),
    ...trous.map((ch) => `emplacement à compléter : ${ch}`),
  ];
}

/** Mode strict : demandé (STRICT=1) ou implicite au lancement (SITE_LAUNCHED=1). */
export function estStrict(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.STRICT === "1" || env.SITE_LAUNCHED === "1";
}

function ligneSource(id: string): string {
  const s = sources[id];
  if (!s) return `- ${id} (source inconnue)`;
  const meta = [
    s.editeur,
    s.auteur,
    s.publie && `publié le ${s.publie}`,
    `consulté le ${s.consulte}`,
    s.langue === "en" && "en anglais",
  ].filter(Boolean);
  return `- [${s.titre}](${s.url}) : ${meta.join(", ")}.`;
}

/** docs/sources.md, généré depuis le registre (ne pas modifier à la main). */
export function sourcesMarkdown(): string {
  const { parStatut, aCompleter: trous } = bilan();
  const cites = faitsCites(CONTENU);
  const ordre: Statut[] = ["a-sourcer", "a-reverifier", "calcul", "verifie"];
  const lignes = [
    "# Sources",
    "",
    "Fichier généré par `pnpm sources` depuis `content/sources.ts`, qui fait foi : ne pas le modifier à la main.",
    "",
    "## Bilan",
    "",
    ...ordre.map((s) => `- ${LIBELLES[s]} : ${parStatut[s].length}`),
    `- emplacements à compléter : ${trous.length}`,
    "",
    "La mise en ligne publique (`STRICT=1` ou `SITE_LAUNCHED=1`) exige zéro fait à sourcer ou à revérifier et zéro emplacement à compléter.",
  ];
  if (trous.length) {
    lignes.push("", "## À compléter", "", ...trous.map((t) => `- \`${t}\``));
  }
  for (const statut of ordre) {
    const ids = parStatut[statut];
    if (!ids.length) continue;
    lignes.push("", `## ${TITRES[statut]}`);
    for (const id of ids) {
      const f = faits[id];
      lignes.push("", `### \`${id}\``, "", f.enonce, "");
      if (f.calcul)
        lignes.push(
          `- Calcul : ${f.calcul.formule} (depuis ${f.calcul.depuis.map((d) => `\`${d}\``).join(", ")})`,
        );
      if (f.extrait) lignes.push(`- Extrait : « ${f.extrait} »`);
      if (f.verifie) lignes.push(`- Relu le ${f.verifie}`);
      if (f.note) lignes.push(`- Note : ${f.note}`);
      if (!cites.has(id) && statut !== "calcul")
        lignes.push("- Cité nulle part dans le contenu");
      if (f.sources.length)
        lignes.push(
          "- Sources :",
          ...f.sources.map((s) => `  ${ligneSource(s)}`),
        );
      else lignes.push("- Sources : aucune");
    }
  }
  lignes.push(
    "",
    "## Toutes les sources",
    "",
    ...Object.keys(sources).map(ligneSource),
    "",
  );
  return lignes.join("\n");
}
