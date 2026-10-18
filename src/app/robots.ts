import type { MetadataRoute } from "next";
import { isLaunched, robotsFile, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Fermé à tous les robots tant que SITE_LAUNCHED=1 n'est pas posée. */
export default function robots(): MetadataRoute.Robots {
  return robotsFile(isLaunched(), siteUrl());
}
