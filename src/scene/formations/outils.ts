// Outils de placement des sièges (fonctions pures).
import { lerp, rng, TAU, type Pt } from "../core/math";

/** Les 150 citoyens : un point par personne, dans toutes les scènes. */
export const N = 150;

/**
 * n sièges répartis sur des arcs de cercle concentriques, proportionnellement à leur
 * longueur (hémicycle, rangs face à l'orateur).
 */
export function arcSeats(
  n: number,
  cx: number,
  cy: number,
  radii: readonly number[],
  span: (r: number) => readonly [number, number],
): Pt[] {
  const rows = radii.map((r) => {
    const [a0, a1] = span(r);
    return { r, a0, a1, w: r * Math.abs(a1 - a0) };
  });
  const tot = rows.reduce((s, o) => s + o.w, 0) || 1;
  const counts = rows.map((o) => Math.max(1, Math.round((n * o.w) / tot)));
  let diff = n - counts.reduce((a, b) => a + b, 0);
  let j = counts.length - 1;
  // Au moins un siège par arc : impossible s'il y a plus d'arcs que de sièges.
  if (n < counts.length)
    throw new RangeError("arcSeats : plus d'arcs que de sièges");
  while (diff !== 0) {
    const s = Math.sign(diff);
    if (counts[j]! + s >= 1) {
      counts[j]! += s;
      diff -= s;
    }
    j = (j - 1 + counts.length) % counts.length;
  }
  const out: Pt[] = [];
  rows.forEach((o, k) => {
    const c = counts[k]!;
    for (let i = 0; i < c; i++) {
      const a = lerp(o.a0, o.a1, c === 1 ? 0.5 : i / (c - 1));
      out.push({ x: cx + Math.cos(a) * o.r, y: cy + Math.sin(a) * o.r });
    }
  });
  return out;
}

/** n points en spirale de tournesol dans un disque de rayon R. */
export function phyllo(
  n: number,
  cx: number,
  cy: number,
  R: number,
  off = 0,
): Pt[] {
  return Array.from({ length: n }, (_, k) => {
    const r = R * Math.sqrt((k + 0.5) / n);
    const a = k * 2.39996 + off;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

/** n points semés au hasard (graine fixe) dans une bande horizontale. */
export function band(
  n: number,
  seed: number,
  W: number,
  y0: number,
  y1: number,
): Pt[] {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({
    x: W * (0.06 + r() * 0.88),
    y: lerp(y0, y1, r()),
  }));
}

export function centroid(p: readonly Pt[]): Pt {
  let x = 0;
  let y = 0;
  for (const q of p) {
    x += q.x;
    y += q.y;
  }
  return { x: x / (p.length || 1), y: y / (p.length || 1) };
}

export const DEMI_TOUR: readonly [number, number] = [Math.PI + 0.1, TAU - 0.1];
