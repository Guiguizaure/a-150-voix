import type { Metadata, Viewport } from "next";
import { PALETTES, PALETTE_SCRIPT } from "@/lib/palette";
import { isLaunched, robotsMeta, SITE_NAME, siteUrl } from "@/lib/site";
import { fontClasses } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description:
    "Guide interactif et indépendant sur l’assemblée citoyenne Un commun accord.",
  robots: robotsMeta(isLaunched()),
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: PALETTES.nuit.bg },
    { media: "(prefers-color-scheme: light)", color: PALETTES.papier.bg },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-palette est posé avant le premier rendu par le script : React ne doit pas s'en
    // étonner à l'hydratation.
    <html lang="fr" className={fontClasses} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PALETTE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
