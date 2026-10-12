// Tout le contenu affiché, pour les garde-fous (typographie, faits cités, à compléter).
import { EXEMPLES, verdict, type Intensite } from "./dilemmes";
import * as dilemmes from "./dilemmes";
import * as democratie from "./democratie";
import * as etapes from "./etapes";
import * as sessions from "./sessions";

const INTENSITES: readonly Intensite[] = ["neutre", "plutot", "nettement"];

/** Les phrases du curseur, pour chaque exemple, option et intensité. */
const VERDICTS = EXEMPLES.map((e) => ({
  textes: INTENSITES.flatMap((i) => [verdict(i, e.a), verdict(i, e.b)]),
  faits: e.faits,
}));

export const CONTENU = {
  etapes,
  dilemmes: { ...dilemmes, verdicts: VERDICTS },
  democratie,
  sessions,
} as const;
