// Soutenir : l'hémicycle du budget. 100 sièges pleins (les deux tiers couverts par des
// dons au lancement), 50 vides (le tiers recherché) ; un point ≈ 20 000 €.
import { rgba, TAU } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import { hemicycle, hemicycleGeo, N } from "../formations";

/** Sièges pleins : deux tiers des 150 (fait ucaDons). */
const PLEINS = Math.round((N * 2) / 3);
/** Opacité du contour d'un siège vide : 60 %, contraste ≥ 3:1 dans les deux palettes. */
const VIDE = 0.6;

export function soutenir(e: Engine): Scene {
  let t0 = 0;
  let assign: number[] = [];
  let rang: number[] = [];
  let plein: boolean[] = [];

  return {
    enter() {
      assign = e.setFormation(() => hemicycle(e.W, e.H), {
        dur: 1.5,
        stagger: 0.6,
      });
      e.fadeTo(1, 0.5);
      t0 = e.now - (e.arrivee ? 99 : 0);
      e.resetStates();
      const sieges = hemicycle(e.W, e.H);
      const ordre = sieges
        .map((_, k) => k)
        .sort((a, b) => sieges[a]!.x - sieges[b]!.x);
      rang = new Array<number>(N);
      ordre.forEach((k, r) => {
        rang[k] = r;
      });
      plein = new Array<boolean>(N).fill(false);
    },
    draw() {
      const { ctx, now, rm } = e;
      e.updateDots();
      const g = hemicycleGeo(e.W, e.H);
      const tf = rm ? 99 : now - t0 - 1.5;
      e.halfLayers(g.cx, g.cy, g.R * 1.12, g.ri * 0.55, 5, 0.035);
      const k = Math.exp(-e.dt * 2.2);
      e.dots.forEach((d, i) => {
        const r = rang[assign[i]!]!;
        const estPlein = r < PLEINS && tf > r * 0.014;
        if (estPlein && !plein[i]) d.glow = 1;
        plein[i] = estPlein;
        if (d.a > 0.01) {
          if (estPlein) e.dot(d.bx, d.by, 3.2 * (1 + d.glow * 0.5), d.a, 1);
          else {
            const pulse = rm ? 0 : 0.08 * (1 + Math.sin(now * 2 + d.ph)) * 0.5;
            ctx.strokeStyle = rgba(e.P.fg, d.a * (VIDE + pulse));
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(d.bx, d.by, 3, 0, TAU);
            ctx.stroke();
          }
        }
        d.glow *= k;
      });
    },
  };
}
