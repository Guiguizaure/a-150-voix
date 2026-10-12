// Configuration du site : adresse et lancement public (fonctions pures, testées).
import type { Metadata, MetadataRoute } from "next";

export const SITE_NAME = "À 150 voix";

/**
 * Adresse publique du site (adresses canoniques, sitemap, images de partage, mentions
 * légales) : le domaine final. Les previews restent sur a-150-voix.pages.dev, en noindex.
 * Surchargée par la variable SITE_URL.
 */
export const DEFAULT_SITE_URL = "https://150voix.com";

type Env = Record<string, string | undefined>;

/**
 * Adresse du site pour ce build : SITE_URL si elle est posée ; sinon, sur une preview
 * Cloudflare Pages (branche autre que main), l'adresse de ce déploiement, pour que les
 * aperçus de lien montrent les images de la preview ; sinon le domaine final.
 */
export function siteUrl(env: Env = process.env): string {
  const preview =
    env.CF_PAGES_BRANCH && env.CF_PAGES_BRANCH !== "main"
      ? env.CF_PAGES_URL
      : undefined;
  return (env.SITE_URL || preview || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/**
 * Lancement public : SITE_LAUNCHED=1, posée seulement dans l'environnement Production de
 * Cloudflare Pages le jour de la mise en ligne. Sans elle (previews, CI, local), tout reste
 * en noindex : balise meta, robots.txt fermé et en-tête X-Robots-Tag.
 */
export function isLaunched(env: Env = process.env): boolean {
  return env.SITE_LAUNCHED === "1";
}

export function robotsMeta(launched: boolean): Metadata["robots"] {
  return launched
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export function robotsFile(
  launched: boolean,
  base: string,
): MetadataRoute.Robots {
  if (!launched) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}

/** Bornes du bloc de préversion dans public/_headers. */
export const PREVIEW_START = "# >>> préversion";
export const PREVIEW_END = "# <<< préversion";

/**
 * Contenu final de out/_headers : identique à public/_headers, sans le bloc de préversion
 * (X-Robots-Tag: noindex) une fois le site lancé. Lève une erreur si le bloc est absent ou
 * mal fermé, pour qu'une préversion ne parte jamais sans son noindex par accident.
 */
export function finalHeaders(source: string, launched: boolean): string {
  const lines = source.split("\n");
  const start = lines.indexOf(PREVIEW_START);
  const end = lines.indexOf(PREVIEW_END);
  if (start === -1 || end <= start) {
    throw new Error(
      `public/_headers : bloc « ${PREVIEW_START} » … « ${PREVIEW_END} » introuvable.`,
    );
  }
  if (!launched) return source;
  return [...lines.slice(0, start), ...lines.slice(end + 1)].join("\n");
}

/** Image de partage : une par page du guide, générée au build (scripts/og.ts). */
export const OG = { width: 1200, height: 630 } as const;

/** Pages publiques, pour le sitemap au lancement. */
export function sitemapEntries(
  launched: boolean,
  base: string,
  chemins: readonly string[],
): MetadataRoute.Sitemap {
  if (!launched) return [];
  return chemins.map((c) => ({ url: c === "/" ? base : `${base}${c}` }));
}

/**
 * Métadonnées d'une page : titre, description, adresse canonique, aperçu de partage (Open
 * Graph et carte large) avec l'image de la page.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  alt,
}: {
  title?: string;
  description: string;
  path: string;
  image: string;
  alt: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const images = [
    { url: `/og/${image}.png`, width: OG.width, height: OG.height, alt },
  ];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}
