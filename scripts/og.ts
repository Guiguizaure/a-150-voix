// Images de partage (1200 × 630), une par page du guide, générées au build dans public/og/
// avec le vrai moteur de la scène, figé après quelques secondes d'animation (hasard et
// horloge fixés : même image à chaque build, sauf la frise qui suit la date du jour).
import { mkdirSync, writeFileSync } from "node:fs";
import { createCanvas, GlobalFonts, type SKRSContext2D } from "@napi-rs/canvas";
import { ACCUEIL, ETAPES, type SceneId } from "@content/etapes";
import { INTERFACE } from "@content/interface";
import { fil } from "@/lib/guide";
import { plainText } from "@/lib/markup";
import { PALETTES } from "@/lib/palette";
import { Engine, SANS, SERIF } from "@/scene/core/engine";
import { rng } from "@/scene/core/math";
import { intro } from "@/scene/formations";
import { creerScenes } from "@/scene/scenes";
import { OG } from "@/lib/site";

const W = OG.width;
const H = OG.height;
const SCENE_X = 560;
const MARGE = 64;
const P = PALETTES.nuit;

GlobalFonts.registerFromPath(
  "assets/fonts/hanken-grotesk-latin.woff2",
  "Hanken Grotesk",
);
GlobalFonts.registerFromPath(
  "assets/fonts/newsreader-italic-500-opsz.woff2",
  "Newsreader",
);

/** Secondes d'animation avant l'image figée, par scène. */
const DUREE: Record<SceneId, number> = {
  intro: 3,
  hasard: 7,
  ecouter: 4.2,
  dilemme: 3,
  deliberer: 5,
  accord: 9,
  suivre: 3,
  democratie: 4,
  soutenir: 5,
};

function scene(id: SceneId) {
  const cv = createCanvas(W - SCENE_X, H);
  const ctx = cv.getContext("2d") as unknown as CanvasRenderingContext2D;
  const e = new Engine(ctx, P, { rng: rng(1) });
  e.enregistrer(creerScenes(e));
  e.resize(W - SCENE_X, H);
  e.poser(intro(e.W, e.H));
  e.aller(id);
  // Le dilemme reste au centre : aucune option ne doit paraître favorisée.
  for (let t = 0; t < DUREE[id]; t += 1 / 30) e.frame(1 / 30);
  return cv;
}

/** Coupe un texte en lignes d'au plus `largeur` pixels. */
function lignes(ctx: SKRSContext2D, texte: string, largeur: number): string[] {
  const out: string[] = [];
  let ligne = "";
  for (const mot of texte.split(" ")) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    if (ctx.measureText(essai).width > largeur && ligne) {
      out.push(ligne);
      ligne = mot;
    } else ligne = essai;
  }
  if (ligne) out.push(ligne);
  return out;
}

function image(
  id: SceneId,
  haut: { numero?: number; fil?: string },
  titre: string,
) {
  const cv = createCanvas(W, H);
  const ctx = cv.getContext("2d");
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(scene(id), SCENE_X, 0);
  ctx.textBaseline = "alphabetic";

  if (haut.numero === undefined) {
    // Accueil : surtitre et titre avec son mot d'accent.
    ctx.fillStyle = P.muted;
    ctx.font = `500 18px ${SANS}`;
    ctx.fillText(plainText(ACCUEIL.surtitre).toUpperCase(), MARGE, 200);
    ctx.fillStyle = P.fg;
    ctx.font = `300 112px ${SANS}`;
    ctx.fillText("À 150", MARGE, 330);
    const l = ctx.measureText("À 150 ").width;
    ctx.fillStyle = P.hi;
    ctx.font = `italic 500 118px ${SERIF}`;
    ctx.fillText("voix", MARGE + l, 330);
  } else {
    // Étape : marque, fil et titre.
    ctx.fillStyle = P.fg;
    ctx.font = `500 30px ${SANS}`;
    ctx.fillText("À 150", MARGE, 84);
    const l = ctx.measureText("À 150 ").width;
    ctx.fillStyle = P.hi;
    ctx.font = `italic 500 32px ${SERIF}`;
    ctx.fillText("voix", MARGE + l, 84);
    let y = 250;
    ctx.fillStyle = P.hi;
    ctx.font = `italic 500 56px ${SERIF}`;
    ctx.fillText(String(haut.numero), MARGE, y);
    const n = ctx.measureText(`${haut.numero} `).width;
    ctx.fillStyle = P.muted;
    ctx.font = `400 24px ${SANS}`;
    ctx.fillText(haut.fil ?? "", MARGE + n, y);
    y += 86;
    ctx.fillStyle = P.fg;
    ctx.font = `400 58px ${SANS}`;
    for (const ligne of lignes(ctx, titre, SCENE_X - MARGE - 24)) {
      ctx.fillText(ligne, MARGE, y);
      y += 66;
    }
  }

  // Mention d'indépendance
  ctx.fillStyle = P.hi;
  ctx.fillRect(MARGE, H - 92, 3, 46);
  ctx.fillStyle = P.fg;
  ctx.font = `600 20px ${SANS}`;
  ctx.fillText(INTERFACE.mention.fort, MARGE + 16, H - 76);
  ctx.fillStyle = P.muted;
  ctx.font = `400 20px ${SANS}`;
  ctx.fillText(INTERFACE.mention.suite.replace(/^, /, ""), MARGE + 16, H - 52);
  return cv.toBuffer("image/png");
}

const dossier = new URL("../public/og/", import.meta.url);
mkdirSync(dossier, { recursive: true });

const pages: [string, SceneId, { numero?: number; fil?: string }, string][] = [
  ["accueil", "intro", {}, plainText(ACCUEIL.titre)],
  ...ETAPES.map(
    (e): [string, SceneId, { numero?: number; fil?: string }, string] => {
      const f = fil(e);
      return [
        e.slug,
        e.slug,
        { numero: f.numero, fil: f.texte },
        plainText(e.titre),
      ];
    },
  ),
];

for (const [nom, id, haut, titre] of pages) {
  writeFileSync(new URL(`${nom}.png`, dossier), image(id, haut, titre));
}
console.log(`Images de partage : ${pages.length} dans public/og/.`);
