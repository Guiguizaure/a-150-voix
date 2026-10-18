import { describe, expect, it } from "vitest";
import { sensDuBalayage } from "./balayage";

describe("balayage", () => {
  it("vers la gauche : suivante ; vers la droite : précédente", () => {
    expect(sensDuBalayage(-120, 10, 200)).toBe(1);
    expect(sensDuBalayage(120, -10, 200)).toBe(-1);
  });

  it("ignore les gestes courts, lents ou surtout verticaux (défilement)", () => {
    expect(sensDuBalayage(-40, 0, 200)).toBe(0);
    expect(sensDuBalayage(-120, 0, 1200)).toBe(0);
    expect(sensDuBalayage(-120, 90, 200)).toBe(0);
  });
});
