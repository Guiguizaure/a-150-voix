// Étape 3 : les exemples du curseur et les six dilemmes retenus.
//
// Neutralité : les deux options d'un exemple ont la même structure (étiquette, ce qu'on
// gagne, ce qu'on accepte) et des longueurs proches. Un test le vérifie (règle de
// longueur : écart de 25 % et de deux mots au plus, champ par champ). Les six dilemmes
// officiels n'ont pas d'options rédigées : le curseur garde les exemples de la FAQ.
import type { Texte } from "./types";

export interface Option {
  readonly etiquette: string;
  /** Complète « Vous gagnez … ». */
  readonly gain: string;
  /** Complète « Vous acceptez … ». */
  readonly cout: string;
}

export interface Exemple extends Texte {
  /** Nom court du bouton. */
  readonly bouton: string;
  /** La question, telle que formulée par les organisateurs (dans `texte`). */
  readonly a: Option;
  readonly b: Option;
}

export const EXEMPLES = [
  {
    bouton: "Voitures",
    texte:
      "Souhaitons-nous des automobiles moins chères, mais importées, ou des voitures françaises plus coûteuses pour soutenir l’emploi en France ?",
    faits: ["ucaExemples"],
    a: {
      etiquette: "Des voitures importées, moins chères",
      gain: "des voitures plus abordables",
      cout: "moins d’emplois industriels en France",
    },
    b: {
      etiquette: "Des voitures françaises, plus coûteuses",
      gain: "des emplois industriels en France",
      cout: "des voitures plus chères à l’achat",
    },
  },
  {
    bouton: "Métaux",
    texte:
      "Préférons-nous relocaliser sur notre sol des mines de métaux, avec les nuisances qu’elles impliquent, ou continuer à les importer, nous rendant vulnérables aux décisions commerciales des pays exportateurs ?",
    faits: ["ucaExemples"],
    a: {
      etiquette: "Ouvrir des mines en France",
      gain: "moins de dépendance aux pays exportateurs",
      cout: "les nuisances des mines sur notre sol",
    },
    b: {
      etiquette: "Continuer d’importer les métaux",
      gain: "un territoire épargné par les mines",
      cout: "une dépendance aux pays exportateurs",
    },
  },
  {
    bouton: "Déplacements",
    texte:
      "Comment arbitrer entre la liberté de chacun de se déplacer et les pollutions que ces déplacements engendrent pour tous ?",
    faits: ["ucaExemples"],
    a: {
      etiquette: "Préserver la liberté de se déplacer",
      gain: "la liberté de se déplacer comme on veut",
      cout: "plus de pollution pour tout le monde",
    },
    b: {
      etiquette: "Limiter la pollution des déplacements",
      gain: "moins de pollution pour tout le monde",
      cout: "des limites à la liberté de se déplacer",
    },
  },
] as const satisfies readonly Exemple[];

export const EXEMPLES_SOURCE =
  "Exemples donnés par les organisateurs avant le choix final des dilemmes.";

export type Intensite = "neutre" | "plutot" | "nettement";

/** Phrase sous le curseur (mini-balisage), même gabarit pour les deux options. */
export function verdict(intensite: Intensite, option: Option): string {
  if (intensite === "neutre") {
    return "**Les deux comptent.** Faites glisser le nœud vers l’option qui pèse le plus pour vous.";
  }
  const force = intensite === "plutot" ? "plutôt" : "nettement";
  return `Vous penchez **${force}** vers « ${option.etiquette} ». Vous gagnez ${option.gain}. Vous acceptez ${option.cout}.`;
}

export interface Dilemme extends Texte {
  /** Étiquette courte. La question officielle, mot pour mot, est dans `texte`. */
  readonly theme: string;
}

export const DILEMMES_TITRE = "Les six dilemmes retenus";

/** Liste finale publiée le 10 octobre 2026, mot pour mot et dans l'ordre des organisateurs. */
export const DILEMMES = [
  {
    theme: "Alimentation",
    texte:
      "Peut-on manger une nourriture saine et produite en France à un prix abordable ?",
    faits: ["ucaSixDilemmes"],
  },
  {
    theme: "Intelligence artificielle",
    texte: "Doit-on limiter le développement de l’intelligence artificielle ?",
    faits: ["ucaSixDilemmes"],
  },
  {
    theme: "Carburants fossiles",
    texte:
      "Peut-on s’affranchir rapidement des carburants fossiles sans contraindre la liberté de déplacement ?",
    faits: ["ucaSixDilemmes"],
  },
  {
    theme: "Territoires",
    texte:
      "Peut-on aménager et développer les territoires tout en préservant les espaces naturels ?",
    faits: ["ucaSixDilemmes"],
  },
  {
    theme: "Eau",
    texte:
      "Peut-on continuer à consommer de l’eau comme avant, alors que les sécheresses se multiplient ?",
    faits: ["ucaSixDilemmes"],
  },
  {
    theme: "Réindustrialisation",
    texte:
      "Doit-on réindustrialiser le pays quitte à en assumer les coûts économiques et environnementaux ?",
    faits: ["ucaSixDilemmes"],
  },
] as const satisfies readonly Dilemme[];

/** Le fil rouge des six dilemmes, cité avec sa source. */
export const FIL_ROUGE: Texte = {
  texte:
    "Leur fil rouge, selon [le mandat de l’assemblée](https://www.uncommunaccord.fr/le-mandat) : « Au 21ème siècle, pouvons-nous encore espérer tout avoir ? »",
  faits: ["ucaFilRouge"],
};

export const SELECTION: Texte = {
  texte:
    "Ils ont été choisis par le comité d’organisation parmi 14 propositions soumises à consultation, en tenant compte des priorités des internautes et des 150 citoyens.",
  faits: ["ucaSelectionDilemmes"],
};
