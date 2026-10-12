// Ce que la scène publie pour l'interface (compteur, légendes, curseurs, son). Magasin
// externe lu avec useSyncExternalStore ; la scène n'écrit que les valeurs qui changent,
// et les abonnés ne sont prévenus que dans ce cas.
import { useSyncExternalStore } from "react";
import type { SortieScene } from "./core/engine";

export interface EtatScene {
  /** Le hasard : phase du compteur, nombre affiché, appels par point. */
  readonly compteurPhase: "appels" | "tires";
  readonly compteurN: number;
  readonly uniteAppels: number;
  /** Écouter : audition en cours (indice dans SCENES.ecouter.auditions). */
  readonly audition: number;
  /** Délibérer : en petits groupes ou tous ensemble. */
  readonly moment: "tables" | "pleniere";
  /** Le dilemme : position du curseur (-100 à 100) et palier (-2 à 2). */
  readonly dilemmeV: number;
  readonly palier: number;
  /** S'accorder : degré d'accord (0 à 100). */
  readonly accordC: number;
  /** Son activé (étape 5). */
  readonly son: boolean;
}

const INITIAL: EtatScene = {
  compteurPhase: "appels",
  compteurN: 0,
  uniteAppels: 0,
  audition: 0,
  moment: "tables",
  dilemmeV: 0,
  palier: 0,
  accordC: 0,
  son: false,
};

let etat: EtatScene = INITIAL;
const abonnes = new Set<() => void>();

export function lireScene(): EtatScene {
  return etat;
}

export function ecrireScene(partiel: Partial<EtatScene>): void {
  let change = false;
  for (const [k, v] of Object.entries(partiel)) {
    if (etat[k as keyof EtatScene] !== v) change = true;
  }
  if (!change) return;
  etat = { ...etat, ...partiel };
  abonnes.forEach((f) => f());
}

export const sortieScene: SortieScene = {
  publier: (valeurs) => ecrireScene(valeurs as Partial<EtatScene>),
};

function abonner(f: () => void): () => void {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

export function useScene<T>(choisir: (e: EtatScene) => T): T {
  return useSyncExternalStore(
    abonner,
    () => choisir(etat),
    () => choisir(INITIAL),
  );
}
