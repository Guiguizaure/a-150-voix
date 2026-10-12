// Formations : où se placent les 150 points dans chaque scène, pour une scène de W × H.
// Fonctions pures (testées sur une grille de tailles), reprises du prototype.
import { FORMES, type FormeId } from "@content/democratie";
import { PRESIDENTIELLE, SESSIONS } from "@content/sessions";
import { clamp, lerp, rng, TAU, type Pt } from "../core/math";
import { arcSeats, band, DEMI_TOUR, N, phyllo } from "./outils";

export { N } from "./outils";

/* Accueil : un nuage dispersé. */
export function intro(W: number, H: number): Pt[] {
  const r = rng(7);
  const m = Math.min(W, H) * 0.1;
  return Array.from({ length: N }, () => ({
    x: m + r() * (W - 2 * m),
    y: m + r() * (H - 2 * m),
  }));
}

/* Hémicycle (le hasard, soutenir). */
export function hemicycleGeo(W: number, H: number) {
  const R = Math.min(W * 0.44, H * 0.64);
  return { cx: W / 2, cy: H * 0.8, R, ri: R * 0.42 };
}
export function hemicycle(W: number, H: number): Pt[] {
  const g = hemicycleGeo(W, H);
  const radii = Array.from({ length: 7 }, (_, j) => lerp(g.ri, g.R, j / 6));
  return arcSeats(N, g.cx, g.cy, radii, () => DEMI_TOUR);
}

/* Écouter : des rangs face à l'orateur, à gauche. */
export function ecouterSource(W: number, H: number): Pt {
  return { x: Math.max(28, W * 0.11), y: H * 0.52 };
}
export function ecouterPortee(W: number, H: number): number {
  return Math.min(W * 0.84, W - ecouterSource(W, H).x - 16);
}
export function ecouter(W: number, H: number): Pt[] {
  const S = ecouterSource(W, H);
  const rmax = ecouterPortee(W, H);
  const rmin = Math.min(rmax * 0.6, Math.max(64, Math.min(W, H) * 0.24));
  const radii = Array.from({ length: 7 }, (_, j) => lerp(rmin, rmax, j / 6));
  return arcSeats(N, S.x, S.y, radii, (r) => {
    const th = Math.min(1, Math.asin(Math.min(1, (H * 0.4) / r)));
    return [-th, th];
  });
}

/* Délibérer : 15 tables de 10, puis la plénière. */
export function tablesColonnes(W: number, H: number): number {
  return W / H > 1.15 ? 5 : 3;
}
export function tables(W: number, H: number) {
  const cols = tablesColonnes(W, H);
  const rows = Math.ceil(15 / cols);
  const top = Math.max(64, H * 0.14);
  const bot = H * 0.06;
  const mx = W * 0.07;
  const cw = (W - 2 * mx) / cols;
  const ch = (H - top - bot) / rows;
  const rt = clamp(Math.min(cw, ch) * 0.27, 12, 42);
  const centers: Pt[] = [];
  const seats: Pt[] = [];
  for (let k = 0; k < 15; k++) {
    const cx = mx + cw * ((k % cols) + 0.5);
    const cy = top + ch * (Math.floor(k / cols) + 0.5);
    centers.push({ x: cx, y: cy });
    for (let s = 0; s < 10; s++) {
      const a = (s / 10) * TAU + k * 0.7;
      seats.push({ x: cx + Math.cos(a) * rt, y: cy + Math.sin(a) * rt });
    }
  }
  return { seats, centers, rt, rows };
}
export function plenierCentre(W: number, H: number): Pt {
  return { x: W / 2, y: H * 0.54 };
}
export function pleniere(W: number, H: number): Pt[] {
  const c = plenierCentre(W, H);
  const R = Math.min(W, H) * 0.36;
  return Array.from({ length: N }, (_, n) => {
    const r = n % 2 ? R * 0.82 : R;
    const a = (n / N) * TAU;
    return { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
  });
}

/* S'accorder : une colonne à gauche, d'où partent les cordes. */
export function accordColonneX(W: number): number {
  return Math.max(18, W * 0.07);
}
export function accord(W: number, H: number): Pt[] {
  const x = accordColonneX(W);
  const top = H * 0.07;
  const h = H * 0.62;
  return Array.from({ length: N }, (_, n) => ({
    x,
    y: top + ((n + 0.5) / N) * h,
  }));
}

/* Le dilemme : une corde entre deux pôles, le nœud déplacé par v (-1 à 1). */
export function cordeGeo(W: number, H: number, vs: number) {
  const L = { x: W * 0.17, y: H * 0.44 };
  const R = { x: W * 0.83, y: H * 0.44 };
  const k0 = L.x + W * 0.1;
  const k1 = R.x - W * 0.1;
  const K = {
    x: lerp(k0, k1, (vs + 1) / 2),
    y: L.y + Math.min(H * 0.11, 80) * (1 - 0.55 * vs * vs),
  };
  return { L, R, K, k0, k1 };
}
export function corde(W: number, H: number, vs: number) {
  const g = cordeGeo(W, H, vs);
  const sag = Math.min(H * 0.05, 28) * (1 - 0.6 * Math.abs(vs));
  const segs: [Pt, Pt, Pt][] = [
    [g.L, { x: (g.L.x + g.K.x) / 2, y: Math.max(g.L.y, g.K.y) + sag }, g.K],
    [g.K, { x: (g.K.x + g.R.x) / 2, y: Math.max(g.K.y, g.R.y) + sag }, g.R],
  ];
  const pts: Pt[] = [];
  for (const [a, c, b] of segs) {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const u = 1 - t;
      pts.push({
        x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
        y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
      });
    }
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(
      cum[i - 1]! +
        Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y),
    );
  }
  const total = cum[cum.length - 1]!;
  const perles: Pt[] = [];
  let j = 1;
  for (let n = 0; n < N; n++) {
    const s = lerp(total * 0.07, total * 0.93, n / (N - 1));
    while (j < cum.length - 1 && cum[j]! < s) j++;
    const t = (s - cum[j - 1]!) / (cum[j]! - cum[j - 1]! || 1);
    perles.push({
      x: lerp(pts[j - 1]!.x, pts[j]!.x, t),
      y: lerp(pts[j - 1]!.y, pts[j]!.y, t),
    });
  }
  return { ...g, pts, perles };
}

/* Suivre : la frise des six sessions, et le groupe au-dessus du jour présent. */
/** Date de référence d'une session : sa date publiée, sinon le 15 du mois (frise seulement). */
export function dateSession(s: (typeof SESSIONS)[number]): number {
  return Date.parse(`${s.debut ?? `${s.moisIso}-15`}T12:00:00Z`);
}
export function suivreGeo(W: number, H: number, maintenant: number) {
  const y = H * 0.64;
  const x0 = Math.max(28, W * 0.08);
  const x1 = W * 0.78;
  const xe = W - Math.max(28, W * 0.07);
  const n = SESSIONS.length;
  const nodes = SESSIONS.map((_, k) => ({ x: lerp(x0, x1, k / (n - 1)), y }));
  const ts = SESSIONS.map(dateSession);
  const election = Date.parse(`${PRESIDENTIELLE.tours[0]}T12:00:00Z`);
  let tx: number;
  if (maintenant <= ts[0]!) tx = nodes[0]!.x;
  else if (maintenant >= ts[n - 1]!) {
    tx = lerp(
      nodes[n - 1]!.x,
      xe,
      clamp((maintenant - ts[n - 1]!) / (election - ts[n - 1]!), 0, 1),
    );
  } else {
    let k = 0;
    while (maintenant > ts[k + 1]!) k++;
    tx = lerp(
      nodes[k]!.x,
      nodes[k + 1]!.x,
      (maintenant - ts[k]!) / (ts[k + 1]! - ts[k]!),
    );
  }
  const R = Math.min(W, H) * 0.13;
  return {
    y,
    nodes,
    xe,
    tx,
    R,
    nuage: {
      x: clamp(tx, R + 12, W - R - 12),
      y: y - Math.min(H * 0.32, R * 2.3),
    },
  };
}
export function suivre(W: number, H: number, maintenant: number): Pt[] {
  const g = suivreGeo(W, H, maintenant);
  return phyllo(N, g.nuage.x, g.nuage.y, g.R);
}

/* Une autre démocratie : une formation par forme. */
export function demoHaut(H: number): number {
  return Math.max(58, H * 0.13);
}
export function irlandeGeo(W: number, H: number) {
  const top = demoHaut(H);
  const R = Math.min(W * 0.4, (H * 0.7 - top) * 0.95);
  return { cx: W / 2, cy: H * 0.66, R, ri: R * 0.42 };
}
export function belgiqueGeo(W: number, H: number) {
  const m = Math.min(W, H);
  const top = demoHaut(H);
  const cy = top + (H * 0.74 - top) * 0.5;
  return {
    c: { x: W * 0.28, y: cy },
    rc: m * 0.13,
    a: { x: W * 0.7, y: cy },
    ra: m * 0.16,
  };
}
export function jaugeGeo(W: number, H: number) {
  const cell = Math.min((W * 0.8) / 29, 18);
  const x0 = (W - 29 * cell) / 2;
  return { cell, x0, x1: x0 + 29 * cell, y0: H * 0.55 - 2 * cell };
}
export function grille10Geo(W: number, H: number) {
  const top = demoHaut(H) + 10;
  const x0 = W * 0.3;
  const x1 = W * 0.9;
  const y1 = H * 0.92;
  return {
    x0,
    cw: (x1 - x0) / 9,
    y0: top,
    ch: (y1 - top) / 14,
    tube: W * 0.14,
  };
}
export function budgetGeo(W: number, H: number) {
  const top = demoHaut(H);
  return {
    c: { x: W / 2, y: top + (H - top) * 0.52 },
    R: Math.min(W, H - top) * 0.36,
  };
}
export function democratie(forme: FormeId, W: number, H: number): Pt[] {
  const top = demoHaut(H);
  switch (forme) {
    case "france": {
      const cols = 15;
      const rows = 10;
      const w = Math.min(W * 0.8, ((H - top - 40) * 14) / 9);
      const cell = w / (cols - 1);
      const x0 = (W - w) / 2;
      const y0 = top + (H - top - (rows - 1) * cell) / 2;
      return Array.from({ length: N }, (_, s) => ({
        x: x0 + (s % cols) * cell,
        y: y0 + Math.floor(s / cols) * cell,
      }));
    }
    case "irlande": {
      const g = irlandeGeo(W, H);
      const radii = Array.from({ length: 5 }, (_, j) => lerp(g.ri, g.R, j / 4));
      return [
        ...arcSeats(99, g.cx, g.cy, radii, () => [Math.PI + 0.12, TAU - 0.12]),
        { x: g.cx, y: g.cy - g.ri * 0.35 },
        ...band(50, 11, W, H * 0.74, H * 0.94),
      ];
    }
    case "belgique": {
      const g = belgiqueGeo(W, H);
      const ring = Array.from({ length: 24 }, (_, k) => ({
        x: g.c.x + Math.cos((k / 24) * TAU) * g.rc,
        y: g.c.y + Math.sin((k / 24) * TAU) * g.rc,
      }));
      return [
        ...ring,
        ...phyllo(40, g.a.x, g.a.y, g.ra),
        ...band(86, 13, W, H * 0.78, H * 0.95),
      ];
    }
    case "rip": {
      const g = jaugeGeo(W, H);
      return Array.from({ length: N }, (_, s) => ({
        x: g.x0 + Math.floor(s / 5) * g.cell,
        y: g.y0 + (4 - (s % 5)) * g.cell,
      }));
    }
    case "budget": {
      const g = budgetGeo(W, H);
      return phyllo(N, g.c.x, g.c.y, g.R, -Math.PI / 2);
    }
    case "athenes": {
      const g = grille10Geo(W, H);
      return Array.from({ length: N }, (_, s) => ({
        x: g.x0 + (s % 10) * g.cw,
        y: g.y0 + Math.floor(s / 10) * g.ch,
      }));
    }
  }
}

export const FORME_IDS: readonly FormeId[] = FORMES.map((f) => f.id);
