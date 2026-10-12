// Textes de l'interface : en-tête, navigation, pied de page.

export const INTERFACE = {
  evitement: "Aller au contenu",
  accueil: "Accueil d’À 150 voix",
  mention: {
    fort: "Projet indépendant",
    suite: ", sans lien avec les organisateurs d’Un commun accord",
  },
  nouvelOnglet: "nouvel onglet",
  limite: "Limite.",
  sessionPassee: "Session passée :",
  palette: {
    claire: "Palette claire",
  },
  nav: {
    region: "Étapes du guide",
    precedent: "Précédent",
    suivant: "Suivant",
    commencer: "Commencer",
    recommencer: "Recommencer",
    sommaire: "Sommaire",
    fermer: "Fermer le sommaire",
    /** « Étape 3 sur 8 » pour les lecteurs d'écran ; {n} et {total} remplacés. */
    position: "Étape {n} sur {total}",
  },
  pied: {
    mention:
      "Projet indépendant, sans lien avec les organisateurs d’Un commun accord",
    concu:
      "Conçu par Guillaume Salle · [webjuno.com](https://webjuno.com), avec Claude",
    mentionsLegales: "Mentions légales",
    sources: "Sources",
  },
} as const;
