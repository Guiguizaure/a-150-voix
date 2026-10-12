// Le hasard : des milliers de numéros composés s'allument, 150 personnes sont retenues,
// puis rejoignent l'hémicycle.
import { clamp, mix, rgba, rng } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import { hemicycle, hemicycleGeo, N } from "../formations";

/** Numéros composés, d'après Un commun accord (fait ucaNumeros). */
const APPELS = 200000;

interface Appel {
  readonly x: number;
  readonly y: number;
  readonly tr: number;
}

export function hasard(e: Engine): Scene {
  let appels: Appel[] = [];
  let choisis: number[] = [];
  let t0 = 0;
  let phase = 0;

  const construire = () => {
    const { W, H } = e;
    const m = Math.max(18, Math.min(W, H) * 0.05);
    const w = W - 2 * m;
    const h = H - 2 * m;
    const M = Math.round(clamp((w * h) / 240, 500, 2200));
    const cols = Math.max(8, Math.round(Math.sqrt((M * w) / h)));
    const rows = Math.ceil(M / cols);
    const r = rng(42);
    appels = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        appels.push({
          x: m + ((i + 0.5 + (r() - 0.5) * 0.8) * w) / cols,
          y: m + ((j + 0.5 + (r() - 0.5) * 0.8) * h) / rows,
          tr: Math.pow(r(), 0.9),
        });
      }
    }
    const idx = appels.map((_, k) => k);
    for (let k = idx.length - 1; k > 0; k--) {
      const j = Math.floor(r() * (k + 1));
      [idx[k], idx[j]] = [idx[j]!, idx[k]!];
    }
    choisis = idx.slice(0, N);
    e.sortie.publier({
      uniteAppels: Math.round(APPELS / appels.length / 10) * 10,
    });
  };

  const surLesAppels = () => {
    e.dots.forEach((d, i) => {
      const c = appels[choisis[i]!]!;
      d.bx = d.fx = d.tx = c.x;
      d.by = d.fy = d.ty = c.y;
      d.t0 = -1;
      d.follow = false;
    });
  };

  const entrer = () => {
    construire();
    t0 = e.now;
    phase = 0;
    e.oublierFormation();
    e.fadeTo(0, 0.3);
    e.sortie.publier({ compteurPhase: "appels", compteurN: 0 });
  };

  return {
    enter: entrer,
    resize() {
      construire();
      if (phase === 1) surLesAppels();
    },
    commande(c) {
      if (c.type === "rejouer") entrer();
    },
    draw() {
      const el = e.rm ? 99 : e.now - t0;
      const T0 = 0.3;
      const T1 = 2.6;
      if (phase < 1 && el >= 2.9) {
        phase = 1;
        surLesAppels();
        e.dots.forEach((d) => {
          d.glow = 1;
        });
        e.fadeTo(1, 0.35);
      }
      if (phase < 2 && el >= 3.9) {
        phase = 2;
        e.setFormation(() => hemicycle(e.W, e.H), { dur: 1.7, stagger: 0.8 });
      }
      e.updateDots();
      const opacite = el < 2.9 ? 1 : clamp(1 - (el - 2.9) / 0.9, 0, 1);
      let montres = 0;
      if (opacite > 0) {
        for (const c of appels) {
          const tc = T0 + c.tr * (T1 - T0);
          if (el < tc) continue;
          montres++;
          const fl = Math.exp(-(el - tc) / 0.28);
          const s = 1.6 + fl * 1.6;
          e.ctx.fillStyle = rgba(
            mix(e.P.fg, e.P.accent, fl),
            (0.13 + 0.87 * fl) * opacite,
          );
          e.ctx.fillRect(c.x - s / 2, c.y - s / 2, s, s);
        }
      }
      if (phase < 1) {
        e.sortie.publier({
          compteurPhase: "appels",
          compteurN:
            Math.round((APPELS * montres) / appels.length / 1000) * 1000,
        });
      } else {
        e.sortie.publier({ compteurPhase: "tires", compteurN: N });
      }
      if (phase >= 2) {
        const p = clamp((el - 4.4) / 1.2, 0, 1);
        if (p > 0) {
          const g = hemicycleGeo(e.W, e.H);
          e.halfLayers(g.cx, g.cy, g.R * 1.12, g.ri * 0.55, 5, 0.045 * p);
        }
      }
      e.drawDots({ drift: phase >= 2 ? 1 : 0, r: 3 });
    },
  };
}
