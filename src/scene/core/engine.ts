// Moteur de la scène : les 150 points, leurs transitions, le dessin. Indépendant du DOM
// (le canvas, l'horloge et la taille lui sont donnés) : le même code anime le site et
// dessine les images de partage au build. Repris du prototype.
import type { SceneId } from "@content/etapes";
import { hexToRgb, type Rgb } from "@/lib/contrast";
import type { Palette } from "@/lib/palette";
import { centroid, N } from "../formations/outils";
import {
  clamp,
  ease,
  lerp,
  mix,
  rgba,
  rng,
  TAU,
  type Pt,
  type Rng,
} from "./math";

export const SANS = '"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif';
export const SERIF = '"Newsreader", Georgia, serif';

export interface Dot {
  readonly i: number;
  readonly seed: number;
  /** Position affichée, départ et cible de la transition. */
  bx: number;
  by: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  /** Début et durée de la transition (t0 < 0 : aucune). */
  t0: number;
  dur: number;
  /** Opacité, avec sa propre transition. */
  a: number;
  fa: number;
  ta: number;
  at0: number;
  adur: number;
  /** Éclat (surlignage passager, décroît tout seul). */
  glow: number;
  /** Paramètres de la dérive et du tremblement. */
  readonly f: number;
  readonly ph: number;
  readonly tf: number;
  readonly kx: number;
  /** Suit sa cible en continu (corde du dilemme) plutôt qu'en transition. */
  follow: boolean;
  /** États persistants : surligné, atténué, caché (valeur et cible). */
  hl: number;
  hlT: number;
  dm: number;
  dmT: number;
  hide: number;
  hideT: number;
}

export interface PaletteRgb {
  readonly bg: Rgb;
  readonly fg: Rgb;
  readonly muted: Rgb;
  readonly accent: Rgb;
  readonly hi: Rgb;
}

export function paletteRgb(p: Palette): PaletteRgb {
  return {
    bg: hexToRgb(p.bg),
    fg: hexToRgb(p.fg),
    muted: hexToRgb(p.muted),
    accent: hexToRgb(p.accent),
    hi: hexToRgb(p.hi),
  };
}

export interface FormationOptions {
  readonly dur?: number;
  readonly stagger?: number;
  readonly delay?: number;
  /** Centre pour le tri angulaire (par défaut : barycentre des sièges). */
  readonly center?: () => Pt;
  /** Clé de tri qui associe points et sièges (par défaut : l'angle autour du centre). */
  readonly key?: (p: Pt) => number;
}

/** Commandes venues de l'interface (curseurs, boutons, puces). */
export type Commande =
  | { readonly type: "rejouer" }
  | { readonly type: "exemple"; readonly k: number }
  | { readonly type: "dilemme"; readonly v: number }
  | { readonly type: "accord"; readonly c: number }
  | { readonly type: "accorder" }
  | { readonly type: "forme"; readonly k: number }
  | { readonly type: "son"; readonly actif: boolean };

export interface Scene {
  enter(): void;
  exit?(): void;
  resize?(): void;
  draw(): void;
  commande?(c: Commande): void;
}

/** Valeurs que la scène publie pour l'interface (compteur, légendes, curseurs). */
export interface SortieScene {
  publier(valeurs: Record<string, unknown>): void;
}

export interface EngineOptions {
  readonly rng?: Rng;
  readonly reducedMotion?: boolean;
  readonly maintenant?: () => number;
  readonly sortie?: SortieScene;
}

export class Engine {
  W = 1;
  H = 1;
  /** Horloge de la scène (secondes) : n'avance que pendant l'animation. */
  now = 0;
  dt = 0.016;
  rm: boolean;
  P: PaletteRgb;
  readonly dots: Dot[];
  readonly rng: Rng;
  readonly maintenant: () => number;
  readonly sortie: SortieScene;
  /** Vrai pendant l'entrée d'une scène à l'arrivée directe sur une étape : pas de transition. */
  arrivee = false;
  private formation: { fn: () => Pt[]; assign: number[] } | null = null;
  private scenes: Partial<Record<SceneId, Scene>> = {};
  courante: SceneId | null = null;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    palette: Palette,
    options: EngineOptions = {},
  ) {
    this.P = paletteRgb(palette);
    this.rm = options.reducedMotion ?? false;
    this.rng = options.rng ?? Math.random;
    this.maintenant = options.maintenant ?? Date.now;
    this.sortie = options.sortie ?? { publier: () => {} };
    const r0 = rng(150);
    this.dots = Array.from({ length: N }, (_, i) => ({
      i,
      seed: r0(),
      bx: 0,
      by: 0,
      fx: 0,
      fy: 0,
      tx: 0,
      ty: 0,
      t0: -1,
      dur: 0,
      a: 0,
      fa: 0,
      ta: 1,
      at0: 0,
      adur: 0.8,
      glow: 0,
      f: 0.4 + r0() * 1.2,
      ph: r0() * TAU,
      tf: 9 + r0() * 14,
      kx: 2.5 + r0() * 4,
      follow: false,
      hl: 0,
      hlT: 0,
      dm: 0,
      dmT: 0,
      hide: 0,
      hideT: 0,
    }));
  }

  /* ---------- Scènes ---------- */

  enregistrer(scenes: Partial<Record<SceneId, Scene>>): void {
    this.scenes = { ...this.scenes, ...scenes };
  }

  scene(id: SceneId): Scene | undefined {
    return this.scenes[id];
  }

  /** Passe à une scène. `arrivee` : première scène affichée, posée sans transition. */
  aller(id: SceneId, { arrivee = false } = {}): void {
    if (this.courante === id) return;
    if (this.courante) this.scenes[this.courante]?.exit?.();
    this.courante = id;
    this.arrivee = arrivee;
    this.scenes[id]?.enter();
    this.arrivee = false;
  }

  commande(c: Commande): void {
    if (c.type === "son") {
      for (const s of Object.values(this.scenes)) s?.commande?.(c);
      return;
    }
    if (this.courante) this.scenes[this.courante]?.commande?.(c);
  }

  setPalette(p: Palette): void {
    this.P = paletteRgb(p);
  }

  resize(W: number, H: number): void {
    this.W = Math.max(1, W);
    this.H = Math.max(1, H);
    this.refreshFormation();
    if (this.courante) this.scenes[this.courante]?.resize?.();
  }

  /** Avance l'horloge de dt secondes et dessine une image. */
  frame(dt: number): void {
    this.dt = clamp(dt, 0, 0.05);
    this.now += this.dt;
    this.ctx.clearRect(0, 0, this.W, this.H);
    if (this.courante) this.scenes[this.courante]?.draw();
  }

  /** Place les points sur des sièges, sans transition (premier affichage). */
  poser(seats: readonly Pt[]): void {
    this.dots.forEach((d, i) => {
      const s = seats[i]!;
      d.bx = d.fx = d.tx = s.x;
      d.by = d.fy = d.ty = s.y;
      d.t0 = -1;
    });
  }

  /* ---------- Transitions ---------- */

  /**
   * Envoie les points vers une formation. Les sièges sont attribués en triant points et
   * sièges sur la même clé (l'angle autour du centre par défaut) : les trajets ne se
   * croisent presque pas. Renvoie, pour chaque point, l'indice de son siège.
   */
  setFormation(fn: () => Pt[], o: FormationOptions = {}): number[] {
    const seats = fn();
    const c = o.center ? o.center() : centroid(seats);
    const key = o.key ?? ((p: Pt) => Math.atan2(p.y - c.y, p.x - c.x));
    const S = seats.map((s, k) => ({ k, v: key(s) })).sort((p, q) => p.v - q.v);
    const D = this.dots
      .map((d, i) => ({ i, v: key({ x: d.bx, y: d.by }) }))
      .sort((p, q) => p.v - q.v);
    const assign = new Array<number>(N);
    D.forEach((e, j) => {
      assign[e.i] = S[j]!.k;
    });
    this.formation = { fn, assign };
    const immediat = this.rm || this.arrivee;
    const dur = immediat ? 0 : (o.dur ?? 1.4);
    const st = immediat ? 0 : (o.stagger ?? 0.5);
    const delay = immediat ? 0 : (o.delay ?? 0);
    this.dots.forEach((d, i) => {
      const s = seats[assign[i]!]!;
      d.follow = false;
      d.fx = d.bx;
      d.fy = d.by;
      d.tx = s.x;
      d.ty = s.y;
      d.dur = dur;
      d.t0 = this.now + delay + d.seed * st;
      if (immediat) {
        d.bx = s.x;
        d.by = s.y;
      }
    });
    return assign;
  }

  /** Recalcule les sièges de la formation en cours (après un redimensionnement). */
  refreshFormation(): void {
    if (!this.formation) return;
    const seats = this.formation.fn();
    this.dots.forEach((d, i) => {
      const s = seats[this.formation!.assign[i]!]!;
      d.tx = d.fx = d.bx = s.x;
      d.ty = d.fy = d.by = s.y;
      d.t0 = -1;
    });
  }

  oublierFormation(): void {
    this.formation = null;
  }

  fadeTo(a: number, dur = 0.5, delay = 0): void {
    const immediat = this.rm || this.arrivee;
    for (const d of this.dots) {
      d.fa = immediat ? a : d.a;
      d.ta = a;
      d.at0 = this.now + (immediat ? 0 : delay);
      d.adur = immediat ? 0 : dur;
      if (immediat) d.a = a;
    }
  }

  updateDots(): void {
    const { now, dt } = this;
    for (const d of this.dots) {
      if (d.follow) {
        const k = Math.min(1, dt * d.kx);
        d.bx += (d.tx - d.bx) * k;
        d.by += (d.ty - d.by) * k;
      } else if (d.t0 >= 0) {
        const p = d.dur ? clamp((now - d.t0) / d.dur, 0, 1) : 1;
        const e = ease(p);
        d.bx = lerp(d.fx, d.tx, e);
        d.by = lerp(d.fy, d.ty, e);
      }
      const pa = d.adur ? clamp((now - d.at0) / d.adur, 0, 1) : 1;
      d.a = lerp(d.fa, d.ta, pa);
    }
  }

  resetStates(): void {
    for (const d of this.dots) {
      d.hlT = 0;
      d.dmT = 0;
      d.hideT = 0;
    }
  }

  /* ---------- Dessin ---------- */

  /** Un point : g = 0 couleur du texte, g = 1 couleur d'accent. */
  dot(x: number, y: number, r: number, a: number, g: number): void {
    const { ctx } = this;
    ctx.fillStyle = rgba(mix(this.P.fg, this.P.accent, g), a);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  drawDots({ drift = 1, tremble = 0, r = 3, decay = 2.2 } = {}): void {
    const { now, rm } = this;
    const k = Math.exp(-this.dt * decay);
    for (const d of this.dots) {
      if (d.a > 0.01) {
        const dx = rm
          ? 0
          : Math.sin(now * d.f + d.ph) * drift +
            Math.sin(now * d.tf + d.ph * 3) * tremble;
        const dy = rm
          ? 0
          : Math.cos(now * d.f * 1.3 + d.ph) * drift +
            Math.cos(now * d.tf * 1.1 + d.ph * 2) * tremble;
        this.dot(d.bx + dx, d.by + dy, r * (1 + d.glow * 0.7), d.a, d.glow);
      }
      d.glow *= k;
    }
  }

  /** Points avec état : surlignés (hl), atténués (dm) ou cachés (hide). */
  drawStateDots({ r = 3, drift = 0.6 } = {}): void {
    const { now, rm, dt } = this;
    const k = Math.min(1, dt * 4);
    const gk = Math.exp(-dt * 2.2);
    for (const d of this.dots) {
      d.hl += (d.hlT - d.hl) * (rm ? 1 : k);
      d.dm += (d.dmT - d.dm) * (rm ? 1 : k);
      d.hide += (d.hideT - d.hide) * (rm ? 1 : Math.min(1, dt * 8));
      const al = d.a * (1 - 0.78 * d.dm) * (1 - d.hide);
      if (al > 0.01) {
        const dx = rm ? 0 : Math.sin(now * d.f + d.ph) * drift;
        const dy = rm ? 0 : Math.cos(now * d.f * 1.3 + d.ph) * drift;
        this.dot(
          d.bx + dx,
          d.by + dy,
          r * (1 + d.glow * 0.6),
          al,
          Math.max(d.hl, d.glow),
        );
      }
      d.glow *= gk;
    }
  }

  /** Contour à bords ondulants (les silhouettes empilées de la référence). */
  blobPath(
    x: number,
    y: number,
    r: number,
    t: number,
    seed: number,
    amp = 1,
  ): void {
    const { ctx } = this;
    ctx.beginPath();
    const n = 60;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU;
      const m =
        1 +
        amp *
          (0.045 * Math.sin(3 * a + t * 0.8 + seed) +
            0.028 * Math.sin(5 * a - t * 1.2 + seed * 1.7));
      const px = x + Math.cos(a) * r * m;
      const py = y + Math.sin(a) * r * m;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.closePath();
  }

  layers(
    x: number,
    y: number,
    r: number,
    n: number,
    alpha: number,
    t: number,
    seed: number,
    shrink = 0.8,
    amp = 1,
  ): void {
    if (r <= 0) return;
    for (let k = 0; k < n; k++) {
      this.blobPath(
        x,
        y,
        r * (1 - (k / n) * shrink),
        t + k * 0.35,
        seed + k,
        amp,
      );
      this.ctx.fillStyle = rgba(this.P.accent, alpha);
      this.ctx.fill();
    }
  }

  halfLayers(
    cx: number,
    cy: number,
    R: number,
    rIn: number,
    n: number,
    alpha: number,
  ): void {
    const { ctx } = this;
    for (let k = 0; k < n; k++) {
      const rr = lerp(R, rIn, k / Math.max(1, n - 1));
      ctx.beginPath();
      ctx.moveTo(cx - rr, cy);
      ctx.arc(cx, cy, rr, Math.PI, TAU);
      ctx.closePath();
      ctx.fillStyle = rgba(this.P.accent, alpha);
      ctx.fill();
    }
  }

  /** Texte du canvas : petite capitale de la scène, couleur atténuée par défaut. */
  label(
    t: string,
    x: number,
    y: number,
    align: CanvasTextAlign = "center",
    col?: Rgb,
  ): void {
    const { ctx } = this;
    ctx.font = `500 11px ${SANS}`;
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = rgba(col ?? this.P.muted, 1);
    ctx.fillText(t, x, y);
  }
}
