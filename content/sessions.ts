// Étape 6 : le calendrier de l'assemblée. Une session est « passée » quand sa date de fin
// est derrière nous (calculé à l'affichage, pas au build). Les dates non publiées restent
// nulles : seul le mois est connu (« un week-end par mois »).
import type { FaitId } from "./sources";
import type { Texte } from "./types";

export interface Session {
  readonly numero: number;
  /** Mois abrégé, sous la frise. */
  readonly mois: string;
  /** Mois de référence (AAAA-MM), pour placer la session quand ses dates manquent. */
  readonly moisIso: string;
  /** Dates publiées (AAAA-MM-JJ), ou null si elles ne le sont pas encore. */
  readonly debut: string | null;
  readonly fin: string | null;
  readonly faits: readonly FaitId[];
}

export const SESSIONS = [
  {
    numero: 1,
    mois: "sept.",
    moisIso: "2026-09",
    debut: "2026-09-19",
    fin: "2026-09-20",
    faits: ["ucaAuditions1"],
  },
  {
    numero: 2,
    mois: "oct.",
    moisIso: "2026-10",
    debut: "2026-10-10",
    fin: "2026-10-11",
    faits: ["ucaSession2"],
  },
  {
    numero: 3,
    mois: "nov.",
    moisIso: "2026-11",
    debut: null,
    fin: null,
    faits: ["ucaCalendrier"],
  },
  {
    numero: 4,
    mois: "déc.",
    moisIso: "2026-12",
    debut: null,
    fin: null,
    faits: ["ucaCalendrier"],
  },
  {
    numero: 5,
    mois: "janv.",
    moisIso: "2027-01",
    debut: null,
    fin: null,
    faits: ["ucaCalendrier"],
  },
  {
    numero: 6,
    mois: "févr.",
    moisIso: "2027-02",
    debut: "2027-02-06",
    fin: "2027-02-07",
    faits: ["afpDerniereSession"],
  },
] as const satisfies readonly Session[];

export const PRESIDENTIELLE = {
  tours: ["2027-04-18", "2027-05-02"],
  faits: ["afpPresidentielle"],
} as const;

export interface EntreeJournal {
  /** Sessions couvertes par l'entrée. */
  readonly sessions: readonly number[];
  readonly quand: string;
  readonly titre: string;
  readonly resume?: Texte;
  /** L'élection : affichée à part, au loin. */
  readonly election?: true;
  readonly faits: readonly FaitId[];
}

export const JOURNAL = [
  {
    sessions: [1],
    quand: "19–20 sept. 2026",
    titre: "Session 1 · S’informer",
    resume: {
      texte:
        "Auditions d’introduction : climat, limites physiques, géopolitique, économie, finances publiques.",
      faits: ["ucaAuditions1"],
    },
    faits: ["ucaAuditions1"],
  },
  {
    sessions: [2],
    quand: "10–11 oct. 2026",
    titre: "Session 2 · Les dilemmes",
    resume: {
      texte:
        "Présentation des six dilemmes. Les citoyens commencent à les examiner en petits groupes.",
      faits: ["ucaSession2"],
    },
    faits: ["ucaSession2"],
  },
  {
    sessions: [3, 4, 5],
    quand: "nov. 2026 → janv. 2027",
    titre: "Sessions 3 à 5 · Délibérer",
    resume: { texte: "Dates à confirmer.", faits: [] },
    faits: ["ucaCalendrier", "ucaDeroule"],
  },
  {
    sessions: [6],
    quand: "6–7 févr. 2027",
    titre: "Session 6 · Arbitrer",
    resume: {
      texte: "Arbitrage et finalisation des propositions.",
      faits: ["ucaDeroule"],
    },
    faits: ["afpDerniereSession"],
  },
  {
    sessions: [],
    quand: "18 avril et 2 mai 2027",
    titre: "Élection présidentielle",
    election: true,
    faits: ["afpPresidentielle"],
  },
] as const satisfies readonly EntreeJournal[];
