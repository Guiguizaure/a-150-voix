// Le dilemme : une corde tendue entre deux options ; les 150 points sont des perles sur la
// corde. Le nœud se déplace au curseur, au doigt ou à la souris, et l'option vers laquelle
// on penche grossit.
import { clamp, rgba } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import { corde, cordeGeo } from "../formations";

/** Palier du verdict : 0 au centre, ±1 « plutôt », ±2 « nettement ». */
export function palier(v: number): number {
  if (Math.abs(v) < 0.15) return 0;
  return Math.sign(v) * (Math.abs(v) > 0.6 ? 2 : 1);
}

/** Position du curseur (-1 à 1) pour un point de la scène, d'après l'abscisse du nœud. */
export function vDepuisX(x: number, W: number, H: number): number {
  const g = cordeGeo(W, H, 0);
  return clamp(((x - g.k0) / (g.k1 - g.k0)) * 2 - 1, -1, 1);
}

export function dilemme(e: Engine): Scene {
  let v = 0;
  let vs = 0;
  let touche = false;
  let exemple = 0;
  let perleDe: number[] = [];

  const publier = () =>
    e.sortie.publier({ dilemmeV: Math.round(v * 100), palier: palier(v) });

  return {
    enter() {
      const ordre = e.dots
        .map((_, i) => i)
        .sort((p, q) => e.dots[p]!.bx - e.dots[q]!.bx);
      perleDe = new Array<number>(e.dots.length);
      ordre.forEach((i, n) => {
        perleDe[i] = n;
      });
      e.oublierFormation();
      e.dots.forEach((d) => {
        d.follow = true;
      });
      e.fadeTo(1, 0.5);
      v = vs = 0;
      touche = false;
      if (e.arrivee) {
        const { perles } = corde(e.W, e.H, 0);
        e.dots.forEach((d, i) => {
          d.bx = d.tx = perles[perleDe[i]!]!.x;
          d.by = d.ty = perles[perleDe[i]!]!.y;
        });
      }
      publier();
    },
    exit() {
      e.dots.forEach((d) => {
        d.follow = false;
      });
    },
    commande(c) {
      if (c.type === "exemple" && c.k !== exemple) {
        exemple = c.k;
        v = 0;
        touche = false;
        publier();
      }
      if (c.type === "dilemme") {
        v = clamp(c.v, -1, 1);
        touche = true;
        publier();
      }
    },
    draw() {
      const { ctx, now } = e;
      vs += (v - vs) * Math.min(1, e.dt * (e.rm ? 60 : 7));
      const g = corde(e.W, e.H, vs);
      e.dots.forEach((d, i) => {
        const b = g.perles[perleDe[i]!]!;
        d.tx = b.x;
        d.ty = b.y;
        if (e.rm) {
          d.bx = b.x;
          d.by = b.y;
        }
      });
      e.updateDots();
      const base = Math.min(e.W, e.H) * 0.13;
      e.layers(g.L.x, g.L.y, base * (1 - 0.42 * vs), 5, 0.075, now, 1, 0.75);
      e.layers(
        g.R.x,
        g.R.y,
        base * (1 + 0.42 * vs),
        5,
        0.075,
        now * 1.1,
        7,
        0.75,
      );
      e.dot(g.L.x, g.L.y, 4, 0.9, 1);
      e.dot(g.R.x, g.R.y, 4, 0.9, 1);
      ctx.beginPath();
      g.pts.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
      );
      ctx.strokeStyle = rgba(e.P.fg, 0.2);
      ctx.lineWidth = 1;
      ctx.stroke();
      e.drawDots({ drift: 0.4, r: 2.4 });
      e.layers(g.K.x, g.K.y, 24, 3, 0.13, now, 3, 0.6, 0.6);
      e.dot(g.K.x, g.K.y, 8, 1, 1);
      if (!touche && !e.rm) {
        // Deux chevrons invitent à faire glisser le nœud.
        const a = 0.35 + 0.3 * Math.sin(now * 3);
        const o = 22 + Math.sin(now * 3) * 3;
        ctx.strokeStyle = rgba(e.P.fg, a);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(g.K.x - o, g.K.y - 5);
        ctx.lineTo(g.K.x - o - 5, g.K.y);
        ctx.lineTo(g.K.x - o, g.K.y + 5);
        ctx.moveTo(g.K.x + o, g.K.y - 5);
        ctx.lineTo(g.K.x + o + 5, g.K.y);
        ctx.lineTo(g.K.x + o, g.K.y + 5);
        ctx.stroke();
      }
    },
  };
}
