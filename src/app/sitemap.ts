import type { MetadataRoute } from "next";
import { ETAPES } from "@content/etapes";
import { chemin } from "@/lib/guide";
import { isLaunched, siteUrl, sitemapEntries } from "@/lib/site";

export const dynamic = "force-static";

/** Vide tant que SITE_LAUNCHED=1 n'est pas posée. */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(isLaunched(), siteUrl(), [
    "/",
    ...ETAPES.map((e) => chemin(e.slug)),
    "/mentions-legales",
    "/sources",
  ]);
}
