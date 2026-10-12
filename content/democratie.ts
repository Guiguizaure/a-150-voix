// Étape 7 : six autres formes de participation. Chacune a la même structure : ce que
// c'est, quand, comment ça marche (texte), sa limite, et la légende de sa scène.
import type { FaitId } from "./sources";
import type { Texte } from "./types";

export type FormeId =
  "france" | "irlande" | "belgique" | "rip" | "budget" | "athenes";

export interface Forme extends Texte {
  readonly id: FormeId;
  readonly bouton: string;
  readonly titre: string;
  readonly quand: string;
  readonly limite: string;
  /** Légende de la scène : étiquette, puis phrase. */
  readonly legende: readonly [string, string];
  /** Étiquettes dessinées dans la scène (texte du canvas). */
  readonly etiquettes?: Readonly<Record<string, string>>;
  /** Tous les faits cités par la carte : texte, date, limite, légende. */
  readonly faits: readonly FaitId[];
}

export const FORMES = [
  {
    id: "france",
    bouton: "Conventions françaises",
    titre: "Les conventions citoyennes françaises",
    quand: "2019–2020 · 2022–2023",
    texte:
      "La Convention citoyenne pour le climat a réuni 150 citoyens tirés au sort, qui ont adopté 149 propositions. Le président de la République s’était engagé à les soumettre « sans filtre ». Sur la fin de vie, 184 citoyens se sont prononcés à 75 % pour ouvrir une aide active à mourir. Une loi sur l’aide à mourir a été adoptée en juillet 2026.",
    limite:
      "Combien de propositions ont été reprises ? Les décomptes divergent : 15 retranscrites selon Reporterre, quand le gouvernement affirme en avoir repris la quasi-totalité.",
    legende: [
      "Convention pour le climat",
      "149 propositions adoptées par les citoyens",
    ],
    faits: [
      "cccConvention",
      "cccSansFiltre",
      "finDeVieConvention",
      "finDeVieLoi",
      "cccDecompteReporterre",

      "cccDecompteGouvernement",
    ],
  },
  {
    id: "irlande",
    bouton: "Irlande",
    titre: "Les assemblées citoyennes irlandaises",
    quand: "2013–2018",
    texte:
      "Une convention réunissant 66 citoyens tirés au sort et 33 élus a recommandé d’ouvrir le mariage aux couples de même sexe, approuvé par référendum en 2015 avec 62 % de oui. Puis 99 citoyens tirés au sort ont travaillé sur l’avortement. Leurs recommandations ont ouvert la voie au référendum de 2018, gagné avec 66 % de oui.",
    limite:
      "Le gouvernement reste libre de suivre ou non les recommandations, et toutes ne l’ont pas été.",
    legende: [
      "Assemblée citoyenne",
      "99 citoyens et une présidente, puis un référendum",
    ],
    etiquettes: { referendum: "référendum" },
    faits: ["irlandeConvention", "irlandeAssemblee", "irlandeReferendum2018"],
  },
  {
    id: "belgique",
    bouton: "Belgique",
    titre: "Le conseil citoyen permanent",
    quand: "Communauté germanophone de Belgique, depuis 2019",
    texte:
      "Un conseil de 24 citoyens tirés au sort, nommés pour 18 mois, choisit les sujets à débattre. Des assemblées de 25 à 50 citoyens, eux aussi tirés au sort, en discutent et font des recommandations. Le Parlement doit ensuite leur répondre.",
    limite:
      "C’est une petite région d’environ 77 000 habitants. Rien ne dit que le modèle fonctionnerait tel quel à l’échelle d’un grand pays.",
    legende: ["Dialogue permanent", "24 au conseil, 25 à 50 par assemblée"],
    etiquettes: { conseil: "Conseil · 24", assemblee: "Assemblée · 25 à 50" },
    faits: ["belgiqueDialogue", "belgiquePopulation"],
  },
  {
    id: "rip",
    bouton: "Référendum d’initiative partagée",
    titre: "Le référendum d’initiative partagée",
    quand: "France, depuis 2015",
    texte:
      "Un cinquième des parlementaires peut proposer une loi. Si un dixième des électeurs la soutient en neuf mois, elle peut être soumise à référendum. En 2019–2020, la proposition contre la privatisation d’Aéroports de Paris a recueilli 1 093 030 soutiens, pour 4 717 396 requis.",
    limite:
      "Le seuil est très élevé : aucun référendum d’initiative partagée n’a encore eu lieu.",
    legende: ["Jauge", "1 093 030 soutiens sur 4 717 396 requis"],
    etiquettes: {
      requis: "4 717 396 requis",
      soutiens: "1 093 030 soutiens",
    },
    faits: ["ripSeuils", "ripAdp", "ripAucunReferendum"],
  },
  {
    id: "budget",
    bouton: "Budget participatif",
    titre: "Le budget participatif",
    quand: "Porto Alegre, 1989 · Paris, depuis 2014",
    texte:
      "Les habitants proposent des projets, puis votent pour décider d’une partie des dépenses de leur ville. Né à Porto Alegre, au Brésil, en 1989, ce dispositif a été adopté par Paris en 2014 : environ 5 % du budget d’investissement, soit un demi-milliard d’euros entre 2014 et 2020.",
    limite:
      "Il porte sur des projets locaux et une petite part du budget, pas sur les grands choix de société.",
    legende: [
      "Budget d’investissement",
      "la part décidée par les habitants : environ 5 %",
    ],
    faits: ["budgetParticipatifPrincipe", "budgetParticipatifParis"],
  },
  {
    id: "athenes",
    bouton: "Athènes",
    titre: "Le tirage au sort à Athènes",
    quand: "V^e^ et IV^e^ siècles av. J.-C.",
    texte:
      "Dans l’Athènes antique, les 500 membres du Conseil, la Boulè, et des centaines de magistrats étaient tirés au sort parmi les citoyens, parfois à l’aide d’une machine en pierre, le klèrôtèrion. L’idée : permettre à tous les citoyens de participer à la vie politique à tour de rôle.",
    limite:
      "Seuls les citoyens, des hommes, participaient. Les femmes, les esclaves et les étrangers résidents étaient exclus.",
    legende: ["Klèrôtèrion", "un cube blanc, une rangée tirée au sort"],
    faits: ["athenes"],
  },
] as const satisfies readonly Forme[];
