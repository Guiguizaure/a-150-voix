import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_URL,
  finalHeaders,
  isLaunched,
  robotsFile,
  robotsMeta,
  siteUrl,
} from "./site";

const publicHeaders = readFileSync(
  new URL("../../public/_headers", import.meta.url),
  "utf8",
);

describe("lancement", () => {
  it("n'est lancé qu'avec SITE_LAUNCHED=1", () => {
    expect(isLaunched({})).toBe(false);
    expect(isLaunched({ SITE_LAUNCHED: "true" })).toBe(false);
    expect(isLaunched({ SITE_LAUNCHED: "0" })).toBe(false);
    expect(isLaunched({ SITE_LAUNCHED: "1" })).toBe(true);
  });

  it("prend l'adresse Pages par défaut, sans barre finale", () => {
    expect(siteUrl({})).toBe(DEFAULT_SITE_URL);
    expect(siteUrl({ SITE_URL: "https://preview.example/" })).toBe(
      "https://preview.example",
    );
  });

  it("ferme robots.txt et la balise meta avant le lancement", () => {
    expect(robotsMeta(false)).toEqual({ index: false, follow: false });
    expect(robotsFile(false, DEFAULT_SITE_URL)).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("les ouvre au lancement, avec le sitemap", () => {
    expect(robotsMeta(true)).toEqual({ index: true, follow: true });
    expect(robotsFile(true, "https://preview.example")).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://preview.example/sitemap.xml",
    });
  });
});

describe("en-têtes", () => {
  it("public/_headers pose le noindex sur toutes les pages", () => {
    expect(finalHeaders(publicHeaders, false)).toBe(publicHeaders);
    expect(publicHeaders).toMatch(
      /^\/\*\n {2}X-Robots-Tag: noindex, nofollow$/m,
    );
  });

  it("le retire au lancement, et lui seul", () => {
    const launched = finalHeaders(publicHeaders, true);
    expect(launched).not.toMatch(/^\s+X-Robots-Tag:/m);
    expect(launched).not.toContain("préversion\n/*");
    expect(launched.startsWith("# En-têtes Cloudflare Pages")).toBe(true);
  });

  it("refuse un fichier sans bloc de préversion", () => {
    expect(() => finalHeaders("/*\n  X-Frame-Options: DENY\n", false)).toThrow(
      /introuvable/,
    );
    expect(() =>
      finalHeaders("# <<< préversion\n# >>> préversion\n", true),
    ).toThrow(/introuvable/);
  });
});
