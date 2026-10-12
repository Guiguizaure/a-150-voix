// Délibérer : 15 tables de 10 où les échanges se croisent, quelques fils entre tables,
// puis tous ensemble en plénière, et retour.
import { clamp, rgba } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import { N, plenierCentre, pleniere, tables } from "../formations";

interface Fil {
  readonly a: number;
  readonly b: number;
  readonly t0: number;
  readonly life: number;
  readonly cross?: boolean;
}

export function deliberer(e: Engine): Scene {
  let mode: "tables" | "pleniere" = "tables";
  let depuis = 0;
  let bascule = 0;
  let membres: number[][] = [];
  let fils: Fil[] = [];
  let naissance = 0;
  let croisement = 0;
  const hasard = (n: number) => Math.floor(e.rng() * n);

  const versTables = () => {
    mode = "tables";
    depuis = e.now;
    const { rows } = tables(e.W, e.H);
    const assign = e.setFormation(() => tables(e.W, e.H).seats, {
      dur: 1.5,
      stagger: 0.6,
      key: (p) => Math.floor(clamp(p.y, 0, e.H - 1) / (e.H / rows)) * 1e5 + p.x,
    });
    membres = Array.from({ length: 15 }, () => []);
    assign.forEach((s, i) => membres[Math.floor(s / 10)]!.push(i));
    bascule = e.now + (e.rm ? 1e9 : 7.5);
    fils = [];
    e.sortie.publier({ moment: "tables" });
  };

  const versPleniere = () => {
    mode = "pleniere";
    depuis = e.now;
    e.setFormation(() => pleniere(e.W, e.H), {
      dur: 1.6,
      stagger: 0.5,
      center: () => plenierCentre(e.W, e.H),
    });
    bascule = e.now + 4.5;
    fils = [];
    e.sortie.publier({ moment: "pleniere" });
  };

  return {
    enter() {
      e.fadeTo(1, 0.5);
      versTables();
      naissance = e.now;
      croisement = e.now + 2;
    },
    draw() {
      if (e.now >= bascule) {
        if (mode === "tables") versPleniere();
        else versTables();
      }
      e.updateDots();
      const p = e.rm ? 1 : clamp((e.now - depuis - 1.1) / 0.8, 0, 1);
      if (mode === "tables") {
        const t = tables(e.W, e.H);
        t.centers.forEach((c, k) =>
          e.layers(c.x, c.y, t.rt * 2.05, 3, 0.05 * p, e.now, k, 0.55, 0.5),
        );
      } else {
        const c = plenierCentre(e.W, e.H);
        e.layers(
          c.x,
          c.y,
          Math.min(e.W, e.H) * 0.45,
          4,
          0.04 * p,
          e.now,
          3,
          0.5,
          0.5,
        );
      }
      if (!e.rm && e.now - depuis > 1.3) {
        if (e.now >= naissance) {
          naissance = e.now + (mode === "tables" ? 0.09 : 0.22);
          if (mode === "tables") {
            const m = membres[hasard(15)]!;
            if (m.length > 1) {
              const a = m[hasard(m.length)]!;
              const b = m[hasard(m.length)]!;
              if (a !== b) fils.push({ a, b, t0: e.now, life: 1.3 + e.rng() });
            }
          } else {
            const a = hasard(N);
            const b = hasard(N);
            if (a !== b) fils.push({ a, b, t0: e.now, life: 2.2 });
          }
        }
        if (mode === "tables" && e.now >= croisement) {
          croisement = e.now + 1.1;
          const k = hasard(15);
          const k2 = (k + 1 + hasard(14)) % 15;
          const m1 = membres[k]!;
          const m2 = membres[k2]!;
          if (m1.length && m2.length) {
            fils.push({
              a: m1[hasard(m1.length)]!,
              b: m2[hasard(m2.length)]!,
              t0: e.now,
              life: 2.4,
              cross: true,
            });
          }
        }
      }
      const { ctx } = e;
      ctx.lineWidth = 1;
      fils = fils.filter((l) => e.now - l.t0 < l.life);
      for (const l of fils) {
        const al =
          Math.sin((Math.PI * (e.now - l.t0)) / l.life) *
          (l.cross ? 0.45 : 0.6);
        const A = e.dots[l.a]!;
        const B = e.dots[l.b]!;
        ctx.strokeStyle = rgba(e.P.accent, al);
        ctx.beginPath();
        ctx.moveTo(A.bx, A.by);
        if (l.cross)
          ctx.quadraticCurveTo(
            (A.bx + B.bx) / 2,
            (A.by + B.by) / 2 - 36,
            B.bx,
            B.by,
          );
        else ctx.lineTo(B.bx, B.by);
        ctx.stroke();
        if (al > A.glow) A.glow = al;
        if (al > B.glow) B.glow = al;
      }
      e.drawDots({ drift: 0.6, r: 2.8 });
    },
  };
}
