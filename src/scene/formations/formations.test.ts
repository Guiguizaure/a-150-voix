import { describe, expect, it } from "vitest";
import type { Pt } from "../core/math";
import {
  accord,
  corde,
  democratie,
  ecouter,
  FORME_IDS,
  hemicycle,
  intro,
  N,
  pleniere,
  suivre,
  tables,
} from "./index";
import { arcSeats } from "./outils";

// De la plus petite scène mobile (320 × 260) au grand écran.
const TAILLES: [number, number][] = [
  [320, 260],
  [360, 300],
  [390, 405],
  [430, 460],
  [700, 460],
  [835, 760],
  [1024, 700],
  [1440, 843],
  [1920, 1080],
];

const DATES = [
  Date.parse("2026-08-01T12:00:00Z"),
  Date.parse("2026-10-12T12:00:00Z"),
  Date.parse("2027-01-20T12:00:00Z"),
  Date.parse("2027-03-01T12:00:00Z"),
  Date.parse("2027-06-01T12:00:00Z"),
];

function verifier(nom: string, pts: Pt[], W: number, H: number) {
  expect(pts, nom).toHaveLength(N);
  for (const p of pts) {
    expect(Number.isFinite(p.x) && Number.isFinite(p.y), nom).toBe(true);
    expect(p.x, `${nom} x`).toBeGreaterThanOrEqual(0);
    expect(p.x, `${nom} x`).toBeLessThanOrEqual(W);
    expect(p.y, `${nom} y`).toBeGreaterThanOrEqual(0);
    expect(p.y, `${nom} y`).toBeLessThanOrEqual(H);
  }
}

describe.each(TAILLES)("scène de %i × %i", (W, H) => {
  it("150 sièges dans le cadre, pour chaque formation", () => {
    verifier("intro", intro(W, H), W, H);
    verifier("hémicycle", hemicycle(W, H), W, H);
    verifier("écouter", ecouter(W, H), W, H);
    verifier("tables", tables(W, H).seats, W, H);
    verifier("plénière", pleniere(W, H), W, H);
    verifier("accord", accord(W, H), W, H);
    for (const v of [-1, -0.4, 0, 0.7, 1])
      verifier(`corde ${v}`, corde(W, H, v).perles, W, H);
    for (const d of DATES) verifier(`suivre ${d}`, suivre(W, H, d), W, H);
    for (const f of FORME_IDS)
      verifier(`démocratie ${f}`, democratie(f, W, H), W, H);
  });

  it("des sièges distincts dans l'hémicycle", () => {
    const pts = hemicycle(W, H);
    const cles = new Set(pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`));
    expect(cles.size).toBe(N);
  });
});

describe("arcSeats", () => {
  it("place exactement n sièges, même sur des arcs très inégaux", () => {
    for (const n of [3, 24, 99, 150]) {
      expect(arcSeats(n, 0, 0, [1, 10, 100], () => [0, Math.PI])).toHaveLength(
        n,
      );
    }
    expect(() => arcSeats(2, 0, 0, [1, 10, 100], () => [0, Math.PI])).toThrow(
      RangeError,
    );
  });
});

describe("tables", () => {
  it("15 tables de 10, sur 3 colonnes en portrait et 5 en paysage", () => {
    expect(tables(390, 405).centers).toHaveLength(15);
    expect(tables(390, 405).rows).toBe(5);
    expect(tables(1440, 843).rows).toBe(3);
  });
});

describe("corde", () => {
  it("le nœud suit v, du pôle A au pôle B", () => {
    const a = corde(1000, 600, -1);
    const b = corde(1000, 600, 1);
    expect(a.K.x).toBeCloseTo(a.k0);
    expect(b.K.x).toBeCloseTo(b.k1);
  });
});
