// Configuration du site : adresse et lancement public (fonctions pures, testées).
import type { Metadata, MetadataRoute } from "next";

export const SITE_NAME = "À 150 voix";

/**
 * Adresse publique du site (images de partage, sitemap) : l'adresse Cloudflare Pages du
 * projet tant que le domaine final n'est pas branché. Surchargée par la variable SITE_URL.
 */
export const DEFAULT_SITE_URL = "https://a-150-voix.pages.dev";

type Env = Record<string, string | undefined>;

export function siteUrl(env: Env = process.env): string {
  return (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
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
