// Outils numériques de la scène, repris du prototype.
import type { Rgb } from "@/lib/contrast";

export const TAU = Math.PI * 2;

export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Accélération puis décélération (cubique). */
export const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
export type Rng = () => number;
export function rng(seed: number): Rng {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mélange de deux couleurs : t = 0 donne a, t = 1 donne b. */
export const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export const rgba = (c: Rgb, a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${clamp(a, 0, 1).toFixed(3)})`;

export interface Pt {
  readonly x: number;
  readonly y: number;
}
