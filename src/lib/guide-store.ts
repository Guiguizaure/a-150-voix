// État partagé entre le texte et la scène (exemple de dilemme choisi, forme de démocratie
// affichée). Petit magasin externe lu avec useSyncExternalStore ; n'avertit que si une
// valeur change.
import { useSyncExternalStore } from "react";

export interface EtatGuide {
  /** Exemple du curseur de l'étape 3 (indice dans EXEMPLES). */
  readonly exemple: number;
  /** Forme de démocratie affichée à l'étape 7 (indice dans FORMES). */
  readonly forme: number;
}

const INITIAL: EtatGuide = { exemple: 0, forme: 0 };

let etat: EtatGuide = INITIAL;
const abonnes = new Set<() => void>();

export function lireEtat(): EtatGuide {
  return etat;
}

export function majEtat(partiel: Partial<EtatGuide>): void {
  const suivant = { ...etat, ...partiel };
  if (
    (Object.keys(suivant) as (keyof EtatGuide)[]).every(
      (k) => suivant[k] === etat[k],
    )
  )
    return;
  etat = suivant;
  abonnes.forEach((f) => f());
}

export function abonner(f: () => void): () => void {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

export function useEtat<T>(choisir: (e: EtatGuide) => T): T {
  return useSyncExternalStore(
    abonner,
    () => choisir(etat),
    () => choisir(INITIAL),
  );
}
