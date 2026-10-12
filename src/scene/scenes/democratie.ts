// Une autre démocratie : une formation par forme de participation (conventions
// françaises, Irlande, Belgique, RIP, budget participatif, Athènes).
import { FORMES, type FormeId } from "@content/democratie";
import { clamp, ease, lerp, rgba, TAU, type Pt } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import {
  belgiqueGeo,
  budgetGeo,
  democratie as sieges,
  grille10Geo,
  irlandeGeo,
  jaugeGeo,
} from "../formations";

/** Tri des sièges par rangées (ligne puis abscisse). */
const parRangees = (rows: number, H: number) => (p: Pt) =>
  Math.floor(clamp(p.y, 0, H - 1) / (H / rows)) * 1e5 + p.x;

function etiquette(id: FormeId, cle: string): string {
  const f = FORMES.find((x) => x.id === id);
  const e =
    f && "etiquettes" in f ? (f.etiquettes as Record<string, string>) : {};
  return e[cle] ?? "";
}

export function democratie(e: Engine): Scene {
  let k = 0;
  let t0 = 0;
  let assign: number[] = [];
  let vus = new Set<number>();
  let tirages: boolean[] | null = null;
  let tirageAt = 0;
  let pulsation = 0;
  let onde = 0;

  const montrer = (n: number) => {
    k = n;
    t0 = e.now;
    e.resetStates();
    const id = FORMES[k]!.id;
    const key =
      id === "france"
        ? parRangees(10, e.H)
        : id === "athenes"
          ? parRangees(15, e.H)
          : id === "rip"
            ? (p: Pt) => p.x
            : undefined;
    assign = e.setFormation(() => sieges(id, e.W, e.H), {
      dur: 1.4,
      stagger: 0.5,
      key,
    });
    vus = new Set();
    tirages = null;
    pulsation = e.now + 1.6;
    onde = 0;
    const budget = budgetGeo(e.W, e.H);
    const siegesBudget = id === "budget" ? sieges("budget", e.W, e.H) : [];
    e.dots.forEach((d, i) => {
      const s = assign[i]!;
      if (id === "france") d.hideT = 1;
      if (id === "irlande") {
        d.hlT = s === 99 ? 1 : 0;
        d.dmT = s >= 100 ? 0.7 : 0;
      }
      if (id === "belgique") {
        d.hlT = s < 24 ? 1 : 0;
        d.dmT = s >= 64 ? 0.7 : 0;
      }
      if (id === "rip") d.dmT = 0.55;
      if (id === "budget") {
        const p = siegesBudget[s]!;
        const a =
          (((Math.atan2(p.y - budget.c.y, p.x - budget.c.x) + Math.PI / 2) %
            TAU) +
            TAU) %
          TAU;
        const dedans = a <= 0.05 * TAU;
        d.hlT = dedans ? 1 : 0;
        d.dmT = dedans ? 0 : 0.45;
      }
      if (id === "athenes") d.dmT = 0.2;
      if (e.rm || e.arrivee) {
        d.hl = d.hlT;
        d.dm = d.dmT;
        d.hide = d.hideT;
      }
    });
  };

  return {
    enter() {
      e.fadeTo(1, 0.5);
      montrer(k);
    },
    exit() {
      e.resetStates();
    },
    commande(c) {
      if (c.type === "forme" && c.k !== k && FORMES[c.k]) montrer(c.k);
    },
    draw() {
      const { ctx, now, W, H } = e;
      const id = FORMES[k]!.id;
      const el = now - t0;
      e.updateDots();
      if (id === "france") {
        e.dots.forEach((d, i) => {
          const s = assign[i]!;
          const visible = s < 149 && (e.rm || el > 0.9 + s * 0.012);
          if (visible && !vus.has(i)) {
            vus.add(i);
            d.glow = 1;
          }
          d.hideT = visible ? 0 : 1;
        });
      }
      if (id === "irlande") {
        const g = irlandeGeo(W, H);
        e.halfLayers(g.cx, g.cy, g.R * 1.1, g.ri * 0.6, 4, 0.04);
        if (!e.rm && now >= pulsation) {
          pulsation = now + 3.6;
          onde = now;
        }
        if (onde) {
          const rr = (now - onde) * H * 0.35;
          if (rr < H) {
            ctx.strokeStyle = rgba(e.P.accent, 0.35 * (1 - rr / H));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(g.cx, g.cy, rr, 0, Math.PI);
            ctx.stroke();
            e.dots.forEach((d, i) => {
              if (assign[i]! >= 100) {
                const v =
                  1 - Math.abs(Math.hypot(d.bx - g.cx, d.by - g.cy) - rr) / 18;
                if (v > d.glow) d.glow = v;
              }
            });
          }
        }
        e.label(etiquette("irlande", "referendum"), W / 2, H * 0.97);
      }
      if (id === "belgique") {
        const g = belgiqueGeo(W, H);
        e.layers(g.c.x, g.c.y, g.rc * 1.45, 3, 0.06, now, 2, 0.5, 0.4);
        e.layers(g.a.x, g.a.y, g.ra * 1.25, 3, 0.05, now, 5, 0.5, 0.4);
        ctx.strokeStyle = rgba(e.P.fg, 0.22);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(g.c.x + g.rc * 1.2, g.c.y);
        ctx.lineTo(g.a.x - g.ra * 1.15, g.a.y);
        ctx.stroke();
        if (!e.rm) {
          const t = (el % 2.4) / 2.4;
          e.dot(
            lerp(g.c.x + g.rc * 1.2, g.a.x - g.ra * 1.15, ease(t)),
            g.c.y,
            3.5,
            Math.sin(Math.PI * t),
            1,
          );
        }
        e.label(etiquette("belgique", "conseil"), g.c.x, g.c.y + g.rc + 26);
        e.label(etiquette("belgique", "assemblee"), g.a.x, g.a.y + g.ra + 22);
      }
      if (id === "rip") {
        const g = jaugeGeo(W, H);
        const colonnes = 7;
        const p = e.rm ? 1 : clamp((el - 1.2) / 1.6, 0, 1);
        e.dots.forEach((d, i) => {
          const s = assign[i]!;
          const allume = s < 35 && s / 35 <= p;
          if (allume && d.hlT === 0) d.glow = 1;
          d.hlT = allume ? 1 : 0;
          d.dmT = allume ? 0 : 0.55;
        });
        const yT = g.y0 - g.cell * 0.9;
        const yB = g.y0 + 4 * g.cell + g.cell * 0.9;
        ctx.strokeStyle = rgba(e.P.fg, 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(g.x1 + g.cell * 0.6, yT - 6);
        ctx.lineTo(g.x1 + g.cell * 0.6, yB);
        ctx.stroke();
        e.label(
          etiquette("rip", "requis"),
          g.x1 + g.cell * 0.6,
          yT - 12,
          "right",
          e.P.fg,
        );
        const xf = g.x0 + (colonnes - 0.5) * g.cell * p;
        ctx.strokeStyle = rgba(e.P.accent, 0.8 * p);
        ctx.beginPath();
        ctx.moveTo(xf, yT);
        ctx.lineTo(xf, yB + 6);
        ctx.stroke();
        if (p > 0.2)
          e.label(
            etiquette("rip", "soutiens"),
            g.x0 - g.cell * 0.4,
            yB + 22,
            "left",
            e.P.hi,
          );
      }
      if (id === "budget") {
        const { c, R } = budgetGeo(W, H);
        const p = e.rm ? 1 : clamp((el - 0.8) / 0.8, 0, 1);
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.arc(
            c.x,
            c.y,
            R * (1.16 - j * 0.14),
            -Math.PI / 2,
            -Math.PI / 2 + 0.05 * TAU * p,
          );
          ctx.closePath();
          ctx.fillStyle = rgba(e.P.accent, 0.12);
          ctx.fill();
        }
        ctx.strokeStyle = rgba(e.P.fg, 0.14);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, R * 1.16, 0, TAU);
        ctx.stroke();
      }
      if (id === "athenes") {
        const g = grille10Geo(W, H);
        if (!tirages || (!e.rm && el > tirageAt + 3.4)) {
          const nouveaux = Array.from({ length: 15 }, () => e.rng() < 0.34);
          if (!nouveaux.some(Boolean))
            nouveaux[Math.floor(e.rng() * 15)] = true;
          tirageAt = tirages ? el : Math.max(el, 1.2);
          tirages = nouveaux;
        }
        const tt = el - tirageAt;
        const tw = Math.min(16, g.ch * 0.9);
        ctx.strokeStyle = rgba(e.P.fg, 0.25);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          g.tube - tw / 2,
          g.y0 - tw,
          tw,
          g.ch * 14 + tw * 2,
          tw / 2,
        );
        ctx.stroke();
        for (let row = 0; row < 15; row++) {
          const visible = e.rm || tt > row * 0.08;
          const y = g.y0 + row * g.ch;
          if (!visible) continue;
          ctx.beginPath();
          ctx.arc(g.tube, y, Math.min(5, g.ch * 0.32), 0, TAU);
          if (tirages[row]) {
            ctx.fillStyle = rgba(e.P.fg, 1);
            ctx.fill();
          } else {
            ctx.fillStyle = rgba(e.P.bg, 1);
            ctx.fill();
            ctx.strokeStyle = rgba(e.P.fg, 0.45);
            ctx.stroke();
          }
        }
        const t = tirages;
        e.dots.forEach((d, i) => {
          const row = Math.floor(assign[i]! / 10);
          const visible = e.rm || tt > row * 0.08;
          const choisi = visible && t[row]!;
          if (choisi && d.hlT === 0) d.glow = 0.8;
          d.hlT = choisi ? 1 : 0;
          d.dmT = visible ? (choisi ? 0 : 0.6) : 0.2;
        });
      }
      e.drawStateDots({
        r: id === "rip" ? Math.min(3.4, jaugeGeo(W, H).cell * 0.3) : 2.9,
      });
    },
  };
}
