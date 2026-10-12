// Registre des sources et des faits : il fait foi. docs/sources.md en est généré
// (pnpm sources), et un test vérifie qu'il est à jour.
//
// Un fait est une affirmation du site. Chaque texte qui la porte la cite (champ `faits`).
// Statuts :
// - verifie : la source a été relue et dit bien ce que le site affirme (date de relecture) ;
// - calcul : déduit d'autres faits par un calcul simple, présenté comme tel ;
// - a-sourcer : aucune source encore ;
// - a-reverifier : source à relire ou à confirmer.
// STRICT=1 (ou SITE_LAUNCHED=1) fait échouer le build s'il reste un fait à sourcer ou à
// revérifier.

export interface Source {
  readonly titre: string;
  readonly editeur: string;
  readonly url: string;
  readonly auteur?: string;
  /** Date de publication ou de mise à jour (AAAA-MM-JJ), si la page l'indique. */
  readonly publie?: string;
  /** Dernière consultation (AAAA-MM-JJ). */
  readonly consulte: string;
  /** Langue de la page si elle n'est pas en français. */
  readonly langue?: "en";
}

export const SOURCES = {
  uncommunaccord: {
    titre: "Un commun accord, l’assemblée citoyenne pour 2027 (accueil et FAQ)",
    editeur: "Un commun accord",
    url: "https://www.uncommunaccord.fr/",
    consulte: "2026-10-12",
  },
  ucaDilemmes: {
    titre:
      "Voici les 6 dilemmes sur lesquels les 150 citoyens vont devoir plancher !",
    editeur: "Un commun accord",
    url: "https://www.uncommunaccord.fr/actualites/voici-la-liste-finale-des-6-dilemmes-un-commun-accord",
    publie: "2026-10-10",
    consulte: "2026-10-12",
  },
  ucaSession2: {
    titre:
      "« Un commun accord » : découvrez le programme de la deuxième session de l’assemblée citoyenne",
    editeur: "Un commun accord",
    url: "https://www.uncommunaccord.fr/actualites/decouvrez-le-programme-deuxieme-session",
    publie: "2026-10-09",
    consulte: "2026-10-12",
  },
  ucaVideotheque: {
    titre: "Les auditions des experts",
    editeur: "Un commun accord",
    url: "https://www.uncommunaccord.fr/videotheque",
    consulte: "2026-10-12",
  },
  afp: {
    titre:
      "Présidentielle : lancement d’une assemblée citoyenne pour nourrir le débat démocratique",
    editeur: "L’info durable, dépêche AFP",
    url: "https://www.linfodurable.fr/presidentielle-lancement-dune-assemblee-citoyenne-pour-nourrir-le-debat-democratique-59048",
    publie: "2026-09-19",
    consulte: "2026-10-12",
  },
  publicSenatCevipof: {
    titre:
      "78 % des Français n’ont pas confiance dans la politique, selon le baromètre Cevipof",
    editeur: "Public Sénat",
    auteur: "Guillaume Cros",
    url: "https://www.publicsenat.fr/actualitudes/politique/78-des-francais-nont-pas-confiance-en-la-politique-selon-le-barometre-de-cevipof",
    publie: "2026-02-10",
    consulte: "2026-10-12",
  },
  reporterreCcc: {
    titre:
      "Convention pour le climat : seules 10 % des propositions ont été reprises par le gouvernement",
    editeur: "Reporterre",
    url: "https://reporterre.net/Convention-pour-le-climat-seules-10-des-propositions-ont-ete-reprises-par-le-gouvernement",
    consulte: "2026-10-12",
  },
  macommuneFinDeVie: {
    titre:
      "Fin de vie : la convention citoyenne largement favorable à une « aide active à mourir »",
    editeur: "macommune.info",
    url: "https://www.macommune.info/fin-de-vie-la-convention-citoyenne-largement-favorable-a-une-aide-active-a-mourir",
    publie: "2023-02-20",
    consulte: "2026-10-12",
  },
  mondeDuDroitFinDeVie: {
    titre: "Fin de vie : la loi est publiée",
    editeur: "Le Monde du Droit",
    url: "https://www.lemondedudroit.fr/secteurs/288-sante-pharmacie/99269-fin-de-vie-validation-sous-trois-reserves-par-le-conseil-constitutionnel.html",
    publie: "2026-08-19",
    consulte: "2026-10-12",
  },
  ersIrlande: {
    titre:
      "The Irish abortion referendum: How a Citizens' Assembly helped to break years of political deadlock",
    editeur: "Electoral Reform Society",
    auteur: "Michela Palese",
    url: "https://www.electoral-reform.org.uk/the-irish-abortion-referendum-how-a-citizens-assembly-helped-to-break-years-of-political-deadlock/",
    publie: "2018-05-29",
    consulte: "2026-10-12",
    langue: "en",
  },
  equalityByLotBelgique: {
    titre: "New permanent sortition assembly in Belgium",
    editeur: "Equality by lot",
    auteur: "Pierre-Etienne Vandamme",
    url: "https://equalitybylot.com/2019/03/01/new-permanent-sortition-assembly-in-belgium/",
    publie: "2019-03-01",
    consulte: "2026-10-12",
    langue: "en",
  },
  landotRip: {
    titre: "ADP : que le RIP repose en paix…",
    editeur: "Landot & associés, blog juridique",
    auteur: "Éric Landot",
    url: "https://blog.landot-avocats.net/2020/03/27/adp-que-le-rip-repose-en-paix/",
    publie: "2020-03-27",
    consulte: "2026-10-12",
  },
  parisBudgetParticipatif: {
    titre:
      "Budget participatif : « Il y a une véritable appropriation par les Parisiens »",
    editeur: "Ville de Paris",
    url: "https://www.paris.fr/pages/budget-participatif-il-y-a-une-veritable-appropriation-par-les-parisiens-6083",
    publie: "2018-09-23",
    consulte: "2026-10-12",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export type Statut = "verifie" | "calcul" | "a-sourcer" | "a-reverifier";

export interface Fait {
  /** Ce que le site affirme, en une phrase. */
  readonly enonce: string;
  readonly statut: Statut;
  readonly sources: readonly SourceId[];
  /** Date de la dernière relecture de la source (statut verifie). */
  readonly verifie?: string;
  /** Court extrait de la source qui fonde le fait. */
  readonly extrait?: string;
  /** Statut calcul : l'opération et les faits dont elle part. */
  readonly calcul?: {
    readonly formule: string;
    readonly depuis: readonly string[];
  };
  readonly note?: string;
}

const RELU = "2026-10-12";
const REPORTERRE_NON_RELU =
  "Page protégée par un contrôle anti-robots : non relue lors de la vérification du 12 octobre 2026. À relire à la main.";

export const FAITS = {
  // Un commun accord : l'assemblée
  ucaTirage150: {
    enonce:
      "L’assemblée réunit 150 Français tirés au sort, représentatifs de la société française.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "150 Français tirés au sort et représentatifs de la société française",
  },
  ucaCalendrier: {
    enonce:
      "Les citoyens se réunissent six week-ends, un par mois, de septembre 2026 à février 2027, au Conservatoire national des arts et métiers à Paris.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait: "un week-end par mois entre septembre 2026 et février 2027",
  },
  ucaNumeros: {
    enonce:
      "L’institut Toluna Harris Interactive a composé environ 200 000 numéros de téléphone tirés au sort en juillet et août 2026.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "environ 200 000 numéros de téléphones ont été composés durant les mois de juillet et août 2026",
  },
  ucaCriteres: {
    enonce:
      "Le panel est représentatif selon le genre, l’âge, le niveau de diplôme, la catégorie socioprofessionnelle et la région.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "selon le genre, l’âge, le niveau de diplôme, la catégorie socio-professionnelle, la région",
    note: "Le prototype ajoutait « ville ou campagne », absent de la source : retiré.",
  },
  ucaCandidature: {
    enonce:
      "Seules les personnes tirées au sort peuvent participer à l’assemblée.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "Seules les personnes tirées au sort peuvent participer à l’assemblée citoyenne",
  },
  ucaIndemnite: {
    enonce:
      "Les citoyens sont indemnisés comme un juré d’assises, 102,16 € par jour.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "au même montant journalier qu’un juré d’assises (102,16 € par jour)",
  },
  ucaMethodeCcc: {
    enonce:
      "La méthode de tirage au sort est la même que celle de la Convention citoyenne pour le climat.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "identique à celle qui a été utilisée par l’Etat pour constituer notamment la Convention Citoyenne pour le Climat",
  },
  afpParticipants: {
    enonce:
      "Le plus jeune participant a 17 ans ; certains viennent de Nouvelle-Calédonie.",
    statut: "verifie",
    sources: ["afp"],
    verifie: RELU,
    extrait: "dont le plus jeune a 17 ans",
  },
  ucaDeroule: {
    enonce:
      "Les deux premiers week-ends servent à s’informer auprès de scientifiques et d’experts ; les suivants à délibérer, en sous-groupes ou à 150 ; les derniers jours à arbitrer et finaliser les propositions.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    note: "FAQ « Comment se dérouleront les travaux de l’assemblée ? ». La FAQ parle de finaliser les propositions, pas de les adopter : texte du prototype ajusté.",
  },
  ucaAuditions1: {
    enonce:
      "À la première session, les 19 et 20 septembre 2026, cinq auditions d’introduction : le climat (Valérie Masson-Delmotte), les limites physiques (Jean-Marc Jancovici), la géopolitique (Pascal Ausseur), l’économie (Patrice Geoffron) et les finances publiques (Selma Mahfouz).",
    statut: "verifie",
    sources: ["ucaVideotheque"],
    verifie: RELU,
    note: "Le prototype ne citait que trois des cinq auditions.",
  },
  ucaInitiateur: {
    enonce:
      "Un commun accord est une initiative citoyenne et apartisane, lancée par Jean-Marc Jancovici.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "une initiative citoyenne et apartisane, initiée par Jean-Marc Jancovici",
  },
  ucaResPublica: {
    enonce: "Le cabinet Res publica anime les travaux de l’assemblée.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "Le cabinet Res publica assure l’animation des travaux de l’assemblée",
    note: "Le prototype ajoutait « spécialisé dans la concertation », absent de la source : retiré.",
  },
  ucaPlateforme: {
    enonce:
      "Une plateforme en ligne permet à chacun de suivre les travaux et d’y contribuer.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
  },
  afpDerniereSession: {
    enonce: "La dernière session a lieu les 6 et 7 février 2027.",
    statut: "verifie",
    sources: ["afp"],
    verifie: RELU,
  },
  ucaSuite: {
    enonce:
      "Après février 2027, les citoyens décideront eux-mêmes s’ils s’adressent aux candidats à la présidentielle, et comment.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
  },
  ucaNonOrientation: {
    enonce:
      "L’initiateur et les soutiens s’engagent à ne pas chercher à orienter les conclusions de l’assemblée.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait:
      "L’initiateur et les soutiens s’engagent à ne pas chercher à orienter les conclusions",
  },
  ucaExemples: {
    enonce:
      "La FAQ donnait trois exemples de dilemmes : les voitures, les métaux et les déplacements.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
  },
  ucaSixDilemmes: {
    enonce:
      "La liste finale des six dilemmes a été publiée le 10 octobre 2026.",
    statut: "verifie",
    sources: ["ucaDilemmes"],
    verifie: RELU,
  },
  ucaSession2: {
    enonce:
      "La deuxième session, les 10 et 11 octobre 2026, présente les six dilemmes, que les citoyens commencent à examiner en petits groupes.",
    statut: "verifie",
    sources: ["ucaSession2"],
    verifie: RELU,
  },
  afpPresidentielle: {
    enonce: "L’élection présidentielle a lieu les 18 avril et 2 mai 2027.",
    statut: "a-reverifier",
    sources: ["afp"],
    extrait: "des 18 avril et 2 mai",
    note: "Dates à revérifier au décret de convocation des électeurs.",
  },

  // Financement
  ucaBudget: {
    enonce: "Le budget de l’assemblée est estimé à 3 millions d’euros.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait: "un budget estimé à 3 000 000 d’euros",
  },
  ucaDons: {
    enonce:
      "Les premiers dons venaient uniquement de particuliers et couvraient les deux tiers du budget ; un financement participatif sur Ulule cherche le reste.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
    extrait: "aucune contribution d’entreprise ou d’organisation",
    note: "Le prototype disait « financé uniquement par des dons de particuliers » : la FAQ ne le dit que des dons du lancement.",
  },
  ucaCharte: {
    enonce:
      "Les donateurs signent une charte des financeurs qui les engage à ne pas intervenir dans le processus ni ses conclusions.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
  },
  ucaPostes: {
    enonce:
      "Le budget paie le transport, l’hébergement et les repas, les indemnités, le tirage au sort, l’animation, les salles, l’équipe, la plateforme, la communication et, pour certains publics, la garde d’enfants.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
  },
  ucaContribuer: {
    enonce:
      "On peut soutenir le projet par un don, même d’un euro symbolique, relayer avec le kit de communication et s’inscrire à la lettre d’information.",
    statut: "verifie",
    sources: ["uncommunaccord"],
    verifie: RELU,
  },
  coutParCitoyen: {
    enonce: "Le budget représente environ 20 000 € par citoyen, tout compris.",
    statut: "calcul",
    sources: ["uncommunaccord"],
    calcul: {
      formule: "3 000 000 € ÷ 150 citoyens = 20 000 €",
      depuis: ["ucaBudget", "ucaTirage150"],
    },
  },

  // Démocratie : chiffres et repères
  cevipof76: {
    enonce:
      "Selon le baromètre du Cevipof publié en février 2026, 76 % des Français interrogés jugent le système démocratique défaillant.",
    statut: "verifie",
    sources: ["publicSenatCevipof"],
    verifie: RELU,
    extrait: "76 % qualifient le système démocratique comme défaillant",
    note: "Terrain du 12 au 28 janvier 2026. Le prototype disait « ne fonctionne pas bien » : reformulé au plus près de la source.",
  },
  cccConvention: {
    enonce:
      "La Convention citoyenne pour le climat (2019–2020) a réuni 150 citoyens tirés au sort, qui ont adopté 149 propositions.",
    statut: "a-reverifier",
    sources: ["reporterreCcc"],
    note: REPORTERRE_NON_RELU,
  },
  cccSansFiltre: {
    enonce:
      "Le président de la République s’était engagé à soumettre ces propositions « sans filtre ».",
    statut: "a-reverifier",
    sources: ["reporterreCcc"],
    note: REPORTERRE_NON_RELU,
  },
  cccDecompte: {
    enonce:
      "15 propositions reprises sans modification selon Reporterre ; 75 mesures mises en œuvre selon le gouvernement.",
    statut: "a-reverifier",
    sources: ["reporterreCcc"],
    note: `${REPORTERRE_NON_RELU} Le chiffre de 75 attribué au gouvernement est à retrouver dans l’article ou dans une source gouvernementale.`,
  },
  finDeVieConvention: {
    enonce:
      "La convention citoyenne sur la fin de vie a réuni 184 citoyens, qui se sont prononcés à 75 % pour ouvrir l’aide active à mourir (vote du 19 février 2023).",
    statut: "verifie",
    sources: ["macommuneFinDeVie"],
    verifie: RELU,
    extrait: "75 % ont voté “oui”, 19 % ont voté “non”",
  },
  finDeVieLoi: {
    enonce:
      "La loi relative au droit à l’aide à mourir a été adoptée le 15 juillet 2026, puis validée sous trois réserves par le Conseil constitutionnel le 14 août 2026.",
    statut: "verifie",
    sources: ["mondeDuDroitFinDeVie"],
    verifie: RELU,
  },
  irlandeConvention: {
    enonce:
      "La Convention sur la Constitution irlandaise (2012–2014) a mené au référendum de 2015 sur le mariage entre personnes de même sexe.",
    statut: "verifie",
    sources: ["ersIrlande"],
    verifie: RELU,
  },
  irlandeConventionChiffres: {
    enonce:
      "Cette convention réunissait 66 citoyens tirés au sort et 33 élus ; le référendum de 2015 a recueilli 62 % de oui.",
    statut: "a-sourcer",
    sources: [],
  },
  irlandeAssemblee: {
    enonce:
      "L’assemblée citoyenne irlandaise sur l’avortement réunissait 99 citoyens tirés au sort et une présidence nommée par le gouvernement ; ses recommandations ont ouvert la voie au référendum de 2018.",
    statut: "verifie",
    sources: ["ersIrlande"],
    verifie: RELU,
  },
  irlandeAssembleeDetails: {
    enonce:
      "L’assemblée était présidée par une femme ; le référendum de 2018 a recueilli 66 % de oui.",
    statut: "a-sourcer",
    sources: [],
  },
  belgiqueDialogue: {
    enonce:
      "Dans la Communauté germanophone de Belgique, un conseil de 24 citoyens tirés au sort pour 18 mois choisit les sujets ; des assemblées de 25 à 50 citoyens tirés au sort font des recommandations, que le Parlement doit examiner. Décidé en 2019.",
    statut: "verifie",
    sources: ["equalityByLotBelgique"],
    verifie: RELU,
  },
  belgiquePopulation: {
    enonce: "La Communauté germanophone compte environ 77 000 habitants.",
    statut: "verifie",
    sources: ["equalityByLotBelgique"],
    verifie: RELU,
    note: "Le prototype disait environ 80 000 ; corrigé d’après la source (77 000 en 2019).",
  },
  ripSeuils: {
    enonce:
      "Le référendum d’initiative partagée (article 11 de la Constitution, en vigueur depuis 2015) : une proposition d’un cinquième des parlementaires, soutenue par un dixième des électeurs inscrits en neuf mois.",
    statut: "a-sourcer",
    sources: [],
  },
  ripAdp: {
    enonce:
      "La proposition contre la privatisation d’Aéroports de Paris (2019–2020) a recueilli 1 093 030 soutiens, pour 4 717 396 requis.",
    statut: "verifie",
    sources: ["landotRip"],
    verifie: RELU,
    note: "Décision du Conseil constitutionnel n° 2019-1-8 RIP du 26 mars 2020.",
  },
  ripAucunReferendum: {
    enonce: "Aucun référendum d’initiative partagée n’a encore eu lieu.",
    statut: "a-reverifier",
    sources: [],
  },
  budgetParticipatifParis: {
    enonce:
      "Né à Porto Alegre en 1989, le budget participatif a été adopté par Paris en 2014 : environ 5 % du budget d’investissement, soit un demi-milliard d’euros entre 2014 et 2020.",
    statut: "verifie",
    sources: ["parisBudgetParticipatif"],
    verifie: RELU,
  },
  budgetParticipatifPrincipe: {
    enonce:
      "Dans un budget participatif, les habitants proposent des projets, puis votent pour choisir ceux qui seront financés.",
    statut: "a-sourcer",
    sources: [],
  },
  athenes: {
    enonce:
      "À Athènes, la plupart des magistrats et les 500 membres de la Boulè étaient tirés au sort, parfois avec un klérôtérion ; seuls les hommes libres nés de parents athéniens étaient citoyens.",
    statut: "a-sourcer",
    sources: [],
  },
  critiquesMiniPublics: {
    enonce:
      "Critiques adressées aux assemblées tirées au sort : pas de mandat électif, participants pas toujours représentatifs, questions qui peuvent orienter les débats, propositions qui dépendent des élus.",
    statut: "a-sourcer",
    sources: [],
    note: "Une ou deux références de recherche sur les mini-publics délibératifs.",
  },
} as const satisfies Record<string, Fait>;

export type FaitId = keyof typeof FAITS;
