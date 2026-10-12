import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_URL,
  pageMetadata,
  sitemapEntries,
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

  it("sur une preview Cloudflare, prend l'adresse du déploiement", () => {
    const preview = {
      CF_PAGES_BRANCH: "v1",
      CF_PAGES_URL: "https://abc.a-150-voix.pages.dev",
    };
    expect(siteUrl(preview)).toBe("https://abc.a-150-voix.pages.dev");
    expect(siteUrl({ ...preview, CF_PAGES_BRANCH: "main" })).toBe(
      DEFAULT_SITE_URL,
    );
    expect(siteUrl({ ...preview, SITE_URL: "https://150voix.com" })).toBe(
      "https://150voix.com",
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
    expect(launched).toMatch(
      /^ {2}Content-Security-Policy: default-src 'self';/m,
    );
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

describe("partage et sitemap", () => {
  it("sitemap vide avant le lancement, complet après", () => {
    expect(
      sitemapEntries(false, "https://150voix.com", ["/", "/hasard"]),
    ).toEqual([]);
    expect(
      sitemapEntries(true, "https://150voix.com", ["/", "/hasard"]),
    ).toEqual([
      { url: "https://150voix.com" },
      { url: "https://150voix.com/hasard" },
    ]);
  });

  it("chaque page a son image de partage et sa carte large", () => {
    const m = pageMetadata({
      title: "Le hasard",
      description: "Desc.",
      path: "/hasard",
      image: "hasard",
      alt: "Alt",
    });
    expect(m.alternates?.canonical).toBe("/hasard");
    expect(m.openGraph).toMatchObject({
      title: "Le hasard · À 150 voix",
      locale: "fr_FR",
      images: [{ url: "/og/hasard.png", width: 1200, height: 630, alt: "Alt" }],
    });
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
