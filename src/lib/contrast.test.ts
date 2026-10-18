import { describe, expect, it } from "vitest";
import { contrast, contrastRgb, hexToRgb, mixRgb } from "./contrast";

describe("contraste WCAG", () => {
  it("donne 21:1 entre le noir et le blanc, 1:1 entre deux couleurs égales", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrast("#ece5d5", "#ece5d5")).toBeCloseTo(1, 5);
  });

  it("est symétrique", () => {
    expect(contrast("#0e1014", "#f1d06b")).toBeCloseTo(
      contrast("#f1d06b", "#0e1014"),
      10,
    );
  });

  it("retrouve les valeurs mesurées au labo (accent Lampe, sièges vides à 60 %)", () => {
    expect(contrast("#f1d06b", "#0e1014")).toBeCloseTo(12.67, 2);
    expect(contrast("#956f00", "#ece5d5")).toBeCloseTo(3.68, 2);
    const bg = hexToRgb("#ece5d5");
    expect(contrastRgb(mixRgb(hexToRgb("#1c1b1f"), bg, 0.6), bg)).toBeCloseTo(
      4.17,
      2,
    );
  });

  it("accepte la forme courte et refuse une couleur invalide", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(() => hexToRgb("#12")).toThrow();
  });
});
