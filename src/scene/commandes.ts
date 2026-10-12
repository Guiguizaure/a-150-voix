// Les calques de la scène envoient leurs commandes (rejouer, curseurs, boutons) au moteur
// monté par Stage, sans dépendre de son cycle de vie.
import type { Commande, Engine } from "./core/engine";

let moteur: Engine | null = null;

export function brancherMoteur(e: Engine | null): void {
  moteur = e;
}

export function commander(c: Commande): void {
  moteur?.commande(c);
}
