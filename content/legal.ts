// Mentions légales : éditeur, hébergeur, données personnelles, indépendance, crédits.
// Identifiants (SIRET, code postal, adresses web) hors contrôle typographique.

export const EDITEUR = {
  nom: "Guillaume Salle",
  statut: "entrepreneur individuel (Webjuno)",
  siret: "931 695 365 00011",
  rue: "193 impasse d’Azur",
  codePostal: "83140",
  ville: "Six-Fours-les-Plages",
  email: "webjunopro@gmail.com",
} as const;

export const HEBERGEUR = {
  nom: "Cloudflare, Inc.",
  rue: "101 Townsend St",
  ville: "San Francisco, CA",
  codePostal: "94107",
  pays: "États-Unis",
  url: "https://www.cloudflare.com",
} as const;

export const MENTIONS = {
  titre: "Mentions légales",
  description:
    "Éditeur, hébergeur, données personnelles et crédits d’À 150 voix, guide indépendant sur Un commun accord.",
  editeur: "Éditeur",
  directeur: "Directeur de la publication : Guillaume Salle.",
  hebergeur: "Hébergeur",
  hebergeurTexte: "Le site est un site statique, hébergé par Cloudflare Pages.",
  donnees: "Cookies et données personnelles",
  donneesTexte: [
    "Ce site ne dépose **aucun cookie** et ne collecte **aucune donnée personnelle** : pas de compte, pas de formulaire, pas de publicité, pas de traceur, rien n’est enregistré quand vous utilisez les curseurs.",
    "La fréquentation est mesurée avec [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/), un outil **sans cookie** ni stockage dans le navigateur, qui ne cherche pas à identifier les visiteurs (pas d’empreinte numérique).",
    "Comme tout hébergeur, Cloudflare traite les données techniques nécessaires pour acheminer les pages et protéger le site, selon sa [politique de confidentialité](https://www.cloudflare.com/privacypolicy/).",
    "Seul votre choix de palette (Nuit ou Papier) est gardé dans le stockage local de votre navigateur, sur votre appareil ; il n’est jamais transmis.",
  ],
  independance: "Indépendance",
  independanceTexte: [
    "À 150 voix est un projet indépendant, sans lien avec les organisateurs d’Un commun accord. Il n’en reprend ni le logo, ni les photos, ni les vidéos : il renvoie vers [leur site](https://www.uncommunaccord.fr/).",
    "Chaque fait cité renvoie à une source, listée sur la page [Sources](/sources).",
  ],
  credits: "Crédits",
  creditsTexte: [
    "Conçu par Guillaume Salle ([webjuno.com](https://webjuno.com)).",
    "Polices Hanken Grotesk et Newsreader, sous licence SIL Open Font License 1.1. Le code source est consultable sur [GitHub](https://github.com/Guiguizaure/a-150-voix).",
  ],
} as const;

export const SOURCES_PAGE = {
  titre: "Sources",
  description:
    "Les sources de chaque fait cité par À 150 voix, avec la date de leur dernière vérification.",
  intro:
    "Chaque affirmation du guide renvoie à un fait de ce registre, et chaque fait à ses sources. Les sources ont été relues à la date indiquée ; un fait « à revérifier » attend encore une confirmation.",
  calcul: "Calcul",
  faits: "Ce que le guide en tire",
  aReverifier: "à revérifier",
  consulte: "consulté le",
  publie: "publié le",
  enAnglais: "en anglais",
} as const;

export const INTROUVABLE = {
  titre: "Page introuvable",
  texte: "Cette adresse ne mène à aucune page du guide.",
  retour: "Revenir à l’accueil",
} as const;
