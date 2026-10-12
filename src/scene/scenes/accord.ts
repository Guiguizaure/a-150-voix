// S'accorder : 150 cordes partent d'une colonne, chacune avec sa fréquence et sa phase ;
// en s'accordant, elles se rangent sur trois harmoniques et vibrent ensemble. Le son, s'il
// est activé, suit le même accord.
import { clamp, ease, lerp, mix, rgba, rng, TAU } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import { accord as sieges, accordColonneX, N } from "../formations";
import type { Son } from "../sound/accord";

interface Corde {
  readonly f0: number;
  readonly A0: number;
  readonly w0: number;
  ph: number;
  readonly res: number;
}

export function accord(e: Engine, son?: Son): Scene {
  let c = 0;
  let anim: { from: number; to: number; t0: number; dur: number } | null = null;
  let autoAt = Infinity;
  let t0 = 0;
  let cordes: Corde[] = [];
  let commun = 0;
  let rang: number[] = [];
  let sonActif = false;

  const publier = () => e.sortie.publier({ accordC: Math.round(c * 100) });

  const animer = (cible: number, dur = 5) => {
    anim = { from: c, to: cible, t0: e.now, dur: e.rm ? 0.001 : dur };
    autoAt = Infinity;
  };

  return {
    enter() {
      const r = rng(9);
      cordes = e.dots.map(() => ({
        f0: 0.6 + r() * 3.8,
        A0: 0.01 + r() * 0.06,
        w0: (0.5 + r() * 2.4) * (r() < 0.5 ? -1 : 1),
        ph: r() * TAU,
        res: r() - 0.5,
      }));
      commun = 0;
      rang = e.setFormation(() => sieges(e.W, e.H), {
        dur: 1.4,
        stagger: 0.5,
        key: (p) => p.y,
      });
      e.fadeTo(1, 0.5);
      t0 = e.now;
      c = 0;
      anim = null;
      autoAt = e.rm ? Infinity : e.now + 2.2;
      publier();
    },
    exit() {
      son?.regler(c, false);
    },
    commande(cmd) {
      if (cmd.type === "accord") {
        c = clamp(cmd.c, 0, 1);
        anim = null;
        autoAt = Infinity;
        publier();
      } else if (cmd.type === "accorder") {
        animer(c >= 0.5 ? 0 : 1, 4.5);
      } else if (cmd.type === "son") {
        sonActif = son ? son.activer(cmd.actif) : false;
        e.sortie.publier({ son: sonActif });
        if (!sonActif) son?.regler(c, false);
      }
    },
    draw() {
      const { ctx, now, dt, H, W } = e;
      if (now >= autoAt) animer(1);
      if (anim) {
        const p = clamp((now - anim.t0) / anim.dur, 0, 1);
        c = lerp(anim.from, anim.to, ease(p));
        if (p >= 1) anim = null;
        publier();
      }
      e.updateDots();
      const ce = ease(c);
      const la = e.rm ? 1 : clamp((now - t0 - 1.1) / 0.9, 0, 1);
      const x0 = accordColonneX(W);
      const span = W - 16 - x0;
      const mid = H * 0.4;
      const F = [1, 1.5, 2];
      const AT = [H * 0.085, H * 0.062, H * 0.045];
      const wT = 1.3;
      commun += wT * dt;
      const col = mix(e.P.fg, e.P.accent, c);
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        const d = e.dots[i]!;
        const L = cordes[i]!;
        const r = rang[i]!;
        const g = r % 3;
        const w = lerp(L.w0, wT, c);
        const diff = ((((commun - L.ph) % TAU) + TAU * 1.5) % TAU) - Math.PI;
        L.ph += w * dt + diff * Math.min(1, c * c * dt * 3);
        const f = lerp(L.f0, F[g]!, ce);
        const A = lerp(L.A0 * H, AT[g]!, ce);
        const base = lerp(
          d.by,
          mid + (r - N / 2) * 0.3 + L.res * 10 * (1 - c * 0.6),
          ce,
        );
        if (la > 0) {
          ctx.strokeStyle = rgba(col, (0.24 + 0.1 * c) * la * d.a);
          ctx.beginPath();
          for (let s = 0; s <= 56; s++) {
            const u = s / 56;
            const y =
              base + A * Math.sin(TAU * f * u - L.ph) * Math.min(1, u * 6);
            if (s) ctx.lineTo(x0 + u * span, y);
            else ctx.moveTo(x0, y);
          }
          ctx.stroke();
        }
        e.dot(d.bx, base, 1.8, d.a, c);
      }
      son?.regler(c, sonActif);
    },
  };
}
