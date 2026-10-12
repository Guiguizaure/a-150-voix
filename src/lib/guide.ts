// Ordre du guide : l'accueil (rang 0), puis les huit étapes. Fonctions pures, testées.
import { ETAPES, type Etape, type SceneId, type Slug } from "@content/etapes";

export const TOTAL = ETAPES.length;

export function chemin(slug: Slug): string {
  return `/${slug}`;
}

export function etape(slug: string): Etape | undefined {
  return ETAPES.find((e) => e.slug === slug);
}

/** Rang d'une adresse : 0 pour l'accueil, 1 à 8 pour les étapes, -1 sinon. */
export function rang(pathname: string): number {
  const p = pathname.replace(/\/+$/, "").replace(/\.html$/, "") || "/";
  if (p === "/") return 0;
  const i = ETAPES.findIndex((e) => chemin(e.slug) === p);
  return i === -1 ? -1 : i + 1;
}

/** Adresse d'un rang (0 : accueil). */
export function adresse(r: number): string {
  if (r <= 0) return "/";
  const e = ETAPES[Math.min(r, TOTAL) - 1]!;
  return chemin(e.slug);
}

/** Scène à afficher pour une adresse (l'accueil pour les pages hors guide). */
export function scene(pathname: string): SceneId {
  const r = rang(pathname);
  return r > 0 ? ETAPES[r - 1]!.slug : "intro";
}

/** Fil de l'étape : « 3 sur 6 · Le dilemme » ou « Aller plus loin · Soutenir ». */
export function fil(e: Etape): { numero: number; texte: string } {
  const comprendre = ETAPES.filter((x) => x.partie === "comprendre").length;
  return {
    numero: e.numero,
    texte:
      e.partie === "comprendre"
        ? `sur ${comprendre} · ${e.court}`
        : `Aller plus loin · ${e.court}`,
  };
}
