import { describe, expect, it } from "vitest";
import { sessionsPassees } from "./sessions";

const le = (iso: string) => Date.parse(iso);

describe("sessions passées", () => {
  it("aucune avant la première session", () => {
    expect(sessionsPassees(le("2026-09-01T12:00:00Z"))).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it("la session 1 est passée après le 20 septembre, pas pendant", () => {
    expect(sessionsPassees(le("2026-09-20T15:00:00+02:00"))[0]).toBe(false);
    expect(sessionsPassees(le("2026-09-21T12:00:00+02:00"))[0]).toBe(true);
  });

  it("les sessions sans dates publiées ne passent jamais", () => {
    const apres = sessionsPassees(le("2027-06-01T12:00:00Z"));
    expect(apres).toEqual([true, true, false, true, false]);
  });
});
