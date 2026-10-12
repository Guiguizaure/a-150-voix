// Textes du guide : l'accueil et les huit étapes, dans l'ordre. Repris du prototype
// (_references/prototype.html), ajustés aux sources (voir les notes du registre).
import type { Texte } from "./types";

export type Slug =
  | "hasard"
  | "ecouter"
  | "dilemme"
  | "deliberer"
  | "accord"
  | "suivre"
  | "democratie"
  | "soutenir";

/** Scène du canvas : celle de l'accueil, puis une par étape. */
export type SceneId = "intro" | Slug;

export type Partie = "comprendre" | "aller-plus-loin";

export interface Note extends Texte {
  readonly etiquette: string;
}

export interface Etape {
  readonly slug: Slug;
  readonly numero: number;
  readonly partie: Partie;
  /** Nom court : sommaire, navigation, fil de l'étape. */
  readonly court: string;
  readonly titre: string;
  /** Description de la page (moteurs de recherche, partage). */
  readonly description: Texte;
  readonly paragraphes: readonly Texte[];
  readonly note?: Note;
  /** Petite ligne en fin d'étape (sources, précision). */
  readonly fin?: Texte;
}

export const PARTIES: Record<Partie, string> = {
  comprendre: "Comprendre",
  "aller-plus-loin": "Aller plus loin",
};

export const ACCUEIL = {
  surtitre: "Guide indépendant · Assemblée citoyenne 2026–2027",
  titre: "À 150 *voix*",
  description: {
    texte:
      "Comment fonctionne Un commun accord, l’assemblée de 150 citoyens tirés au sort avant la présidentielle 2027 : un guide interactif et indépendant, en huit étapes.",
    faits: ["ucaTirage150", "afpPresidentielle"],
  },
  chapo: {
    texte:
      "150 Français tirés au sort se retrouvent un week-end par mois, de septembre 2026 à février 2027, pour chercher des points d’accord sur six grands dilemmes de société. Ce guide explique en six étapes comment fonctionne leur assemblée, [Un commun accord](https://www.uncommunaccord.fr/), et où elle en est. Deux étapes de plus la replacent parmi d’autres façons de faire vivre la démocratie, et expliquent comment la soutenir.",
    faits: ["ucaTirage150", "ucaCalendrier", "ucaSixDilemmes"],
  },
  commencer: "Commencer",
  dureeLecture: "Environ 8 minutes. Le son est coupé par défaut.",
  /** Faits du surtitre et du titre. */
  faits: ["ucaTirage150", "ucaCalendrier"],
} as const satisfies Record<string, unknown>;

const SOURCES_SUIVRE: Texte = {
  texte:
    "Sources : site et FAQ d’Un commun accord, dépêche AFP du 19 septembre 2026.",
  faits: ["afpParticipants"],
};

export const ETAPES = [
  {
    slug: "hasard",
    numero: 1,
    partie: "comprendre",
    court: "Le hasard",
    titre: "Pourquoi tirer au sort ?",
    description: {
      texte:
        "Comment les 150 membres d’Un commun accord ont été tirés au sort, et pourquoi.",
      faits: ["ucaTirage150"],
    },
    paragraphes: [
      {
        texte:
          "Pour réunir des personnes qui ressemblent au pays, sans élection ni candidature. Personne ne peut postuler : on est appelé, ou pas.",
        faits: ["ucaCandidature"],
      },
      {
        texte:
          "Cet été, l’institut Toluna Harris Interactive a composé environ **200 000 numéros** de téléphone tirés au hasard. Parmi les personnes jointes qui ont accepté, 150 ont été retenues pour que le groupe reflète la France : genre, âge, diplôme, catégorie socioprofessionnelle, région.",
        faits: ["ucaNumeros", "ucaTirage150", "ucaCriteres"],
      },
      {
        texte:
          "Le plus jeune a 17 ans, et certains viennent de Nouvelle-Calédonie. Chacun est indemnisé comme un juré d’assises, 102,16 € par jour.",
        faits: ["afpParticipants", "ucaIndemnite"],
      },
    ],
    note: {
      etiquette: "Repère",
      texte:
        "La Convention citoyenne pour le climat, en 2019, avait été constituée de la même façon.",
      faits: ["ucaMethodeCcc", "cccConvention"],
    },
  },
  {
    slug: "ecouter",
    numero: 2,
    partie: "comprendre",
    court: "Écouter",
    titre: "D’abord, écouter les faits",
    description: {
      texte:
        "Les deux premiers week-ends d’Un commun accord : des auditions de scientifiques et d’experts.",
      faits: [],
    },
    paragraphes: [
      {
        texte:
          "Les deux premiers week-ends servent à s’informer. Des scientifiques et des experts présentent l’état des connaissances, avec une approche factuelle.",
        faits: ["ucaDeroule"],
      },
      {
        texte:
          "À la première session, cinq auditions d’introduction : le climat avec la paléoclimatologue Valérie Masson-Delmotte, les limites physiques avec l’ingénieur Jean-Marc Jancovici, initiateur du projet, la géopolitique avec l’amiral Pascal Ausseur, l’économie avec Patrice Geoffron, les finances publiques avec Selma Mahfouz.",
        faits: ["ucaAuditions1", "ucaInitiateur"],
      },
      {
        texte:
          "Les experts disent ce que l’on sait. Décider de ce qu’on en fait, c’est le travail des citoyens.",
        faits: [],
      },
    ],
    note: {
      etiquette: "Replay",
      texte:
        "Toutes les auditions sont en ligne sur la [vidéothèque de l’assemblée](https://www.uncommunaccord.fr/videotheque).",
      faits: ["ucaAuditions1"],
    },
  },
  {
    slug: "dilemme",
    numero: 3,
    partie: "comprendre",
    court: "Le dilemme",
    titre: "Un dilemme n’a pas de bonne réponse",
    description: {
      texte:
        "Ce qu’est un dilemme, avec un curseur à essayer, et les six dilemmes retenus par Un commun accord.",
      faits: [],
    },
    paragraphes: [
      {
        texte:
          "Un dilemme oppose deux objectifs légitimes. Avancer vers l’un, c’est s’éloigner un peu de l’autre. Il faut décider où placer le curseur.",
        faits: [],
      },
      {
        texte:
          "Essayez : faites glisser le nœud vers l’option qui pèse le plus pour vous. Rien n’est enregistré.",
        faits: [],
      },
    ],
  },
  {
    slug: "deliberer",
    numero: 4,
    partie: "comprendre",
    court: "Délibérer",
    titre: "Ensuite, délibérer",
    description: {
      texte:
        "Comment les citoyens d’Un commun accord délibèrent, en petits groupes et tous ensemble.",
      faits: [],
    },
    paragraphes: [
      {
        texte:
          "À partir du troisième week-end, les citoyens délibèrent sur les dilemmes, tantôt en petits groupes, tantôt tous ensemble.",
        faits: ["ucaDeroule"],
      },
      {
        texte:
          "Délibérer, c’est écouter les autres, défendre un point de vue, et parfois changer d’avis. Les travaux sont animés par le cabinet Res publica.",
        faits: ["ucaResPublica"],
      },
      {
        texte:
          "Pendant ce temps, chacun peut suivre les débats et donner son avis sur la plateforme en ligne de l’assemblée.",
        faits: ["ucaPlateforme"],
      },
    ],
  },
  {
    slug: "accord",
    numero: 5,
    partie: "comprendre",
    court: "S’accorder",
    titre: "S’accorder sans penser pareil",
    description: {
      texte:
        "Le dernier week-end d’Un commun accord : arbitrer et finaliser des propositions qui rassemblent.",
      faits: [],
    },
    paragraphes: [
      {
        texte:
          "Au dernier week-end, les 6 et 7 février 2027, les citoyens arbitrent et finalisent leurs propositions. Le but est de trouver ce qui peut rassembler des personnes très différentes.",
        faits: ["afpDerniereSession", "ucaDeroule"],
      },
      {
        texte:
          "Comme un orchestre qui s’accorde : chaque instrument garde sa voix, et l’ensemble sonne juste.",
        faits: [],
      },
      {
        texte:
          "Ensuite, les citoyens décideront eux-mêmes s’ils s’adressent aux candidats à la présidentielle, et comment. L’initiateur et les soutiens du projet se sont engagés à ne pas orienter leurs conclusions.",
        faits: ["ucaSuite", "ucaNonOrientation"],
      },
    ],
  },
  {
    slug: "suivre",
    numero: 6,
    partie: "comprendre",
    court: "Suivre",
    titre: "Où en est l’assemblée ?",
    description: {
      texte:
        "Le calendrier d’Un commun accord, session par session, jusqu’à la présidentielle 2027.",
      faits: ["afpPresidentielle"],
    },
    paragraphes: [],
    fin: SOURCES_SUIVRE,
  },
  {
    slug: "democratie",
    numero: 7,
    partie: "aller-plus-loin",
    court: "Une autre démocratie",
    titre: "Voter, et aussi délibérer",
    description: {
      texte:
        "Les assemblées tirées au sort parmi d’autres façons de faire vivre la démocratie, avec leurs limites et leurs critiques.",
      faits: [],
    },
    paragraphes: [
      {
        texte:
          "Dans une démocratie représentative, on élit des représentants qui décident ensuite pendant leur mandat. Beaucoup doutent que ce modèle suffise : selon le baromètre du Cevipof publié en février 2026, 76 % des Français interrogés jugent le système démocratique défaillant.",
        faits: ["cevipof76"],
      },
      {
        texte:
          "Les assemblées tirées au sort ne remplacent pas le vote. Elles y ajoutent des citoyens ordinaires, informés, qui prennent le temps de chercher un terrain d’entente. D’autres outils existent, en France et ailleurs :",
        faits: [],
      },
    ],
    note: {
      etiquette: "Critiques",
      texte:
        "Ces assemblées n’ont pas de mandat électif. Les personnes qui acceptent d’y participer ne sont pas toujours représentatives. La façon de poser les questions peut orienter les débats. Et leurs propositions ne pèsent que si les élus s’en saisissent.",
      faits: ["critiquesMiniPublics"],
    },
  },
  {
    slug: "soutenir",
    numero: 8,
    partie: "aller-plus-loin",
    court: "Soutenir",
    titre: "Pourquoi les soutenir",
    description: {
      texte:
        "Combien coûte Un commun accord, qui le finance, et comment le soutenir.",
      faits: [],
    },
    paragraphes: [
      {
        texte:
          "Réunir 150 personnes venues de toute la France pendant six week-ends coûte environ 3 millions d’euros, soit à peu près 20 000 € par citoyen, tout compris.",
        faits: ["ucaTirage150", "ucaBudget", "coutParCitoyen"],
      },
      {
        texte:
          "Les premiers dons venaient uniquement de particuliers, sans entreprise ni organisation. Ils couvraient les deux tiers du budget ; le reste est recherché par un financement participatif.",
        faits: ["ucaDons"],
      },
      {
        texte:
          "Les donateurs signent une charte qui leur interdit d’intervenir dans les travaux. Donner, même un euro symbolique, montre que cette façon de faire vivre la démocratie compte pour vous.",
        faits: ["ucaCharte", "ucaContribuer"],
      },
    ],
    fin: {
      texte:
        "Chiffres tirés de la FAQ d’Un commun accord. L’état actuel de la cagnotte est visible sur Ulule.",
      faits: ["ucaBudget", "ucaDons"],
    },
  },
] as const satisfies readonly Etape[];

/** Textes des scènes et de leurs commandes (calques au-dessus du canvas). */
export const SCENES = {
  hasard: {
    compteurAppels: "numéros de téléphone composés",
    /** {n} : nombre d'appels représentés par un point, calculé par la scène. */
    uniteAppels: "1 point ≈ {n} appels",
    compteurTires: "citoyennes et citoyens tirés au sort",
    uniteTires: "Un point = une personne",
    rejouer: "Rejouer le tirage",
    faits: ["ucaNumeros", "ucaTirage150"],
  },
  ecouter: {
    etiquette: "Audition",
    auditions: [
      "Climat · Valérie Masson-Delmotte",
      "Limites physiques · Jean-Marc Jancovici",
      "Géopolitique · Pascal Ausseur",
      "Économie · Patrice Geoffron",
      "Finances publiques · Selma Mahfouz",
    ],
    faits: ["ucaAuditions1"],
  },
  dilemme: {
    optionA: "Option A",
    optionB: "Option B",
    curseur: "Position du curseur entre l’option A et l’option B",
    /** Position lue par les lecteurs d'écran ; {option} et {n} remplacés. */
    positionCentre: "Au centre, entre les deux options",
    positionVers: "Vers « {option} », {n} sur 100",
    exemples: "Exemples de dilemmes",
  },
  deliberer: {
    etiquette: "En ce moment",
    petitsGroupes: "En petits groupes",
    tousEnsemble: "Tous ensemble",
    faits: ["ucaDeroule"],
  },
  accord: {
    desaccord: "Désaccord",
    accord: "Accord",
    curseur: "Du désaccord à l’accord",
    accorder: "Accorder",
    desaccorder: "Désaccorder",
    ecouter: "Écouter l’accord",
    couper: "Couper le son",
  },
  suivre: {
    aujourdhui: "aujourd’hui",
    presidentielle: "Présidentielle · avril 2027",
    faits: ["afpPresidentielle"],
  },
  democratie: {
    formes: "Autres formes de participation",
  },
  soutenir: {
    montant: "≈ 3 M€",
    legende: "budget estimé de l’assemblée",
    dons: "couverts par des dons au lancement (2/3)",
    cagnotte: "recherchés via la cagnotte (1/3)",
    unite: "Un point ≈ 20 000 €",
    faits: ["ucaBudget", "ucaDons", "coutParCitoyen"],
  },
} as const;

export const LIENS = {
  officiel: "https://www.uncommunaccord.fr/",
  videotheque: "https://www.uncommunaccord.fr/videotheque",
  ulule: "https://fr.ulule.com/un-commun-accord/",
  newsletter: "https://www.uncommunaccord.fr/#newsletter",
  kit: "https://drive.google.com/drive/folders/1aDIoYR94G_uyjUiKqcTipe1Dwjcri7Cc",
} as const;

export const BOUTONS_SOUTENIR = [
  { texte: "Soutenir sur Ulule", href: LIENS.ulule, principal: true },
  { texte: "Suivre les travaux", href: LIENS.newsletter, principal: false },
  { texte: "Kit pour relayer", href: LIENS.kit, principal: false },
] as const;

export const POSTES_BUDGET = {
  titre: "Ce que paie le budget",
  postes: [
    "Transport, hébergement, repas",
    "Indemnités des citoyens",
    "Garde d’enfants",
    "Tirage au sort",
    "Animation des débats",
    "Location des salles",
    "Équipe du projet",
    "Plateforme en ligne",
    "Communication",
  ],
  faits: ["ucaPostes"],
} as const;

export const LIENS_SUIVRE = [
  { texte: "Site officiel", href: LIENS.officiel },
  { texte: "Auditions en replay", href: LIENS.videotheque },
  { texte: "Financement participatif", href: LIENS.ulule },
] as const;
