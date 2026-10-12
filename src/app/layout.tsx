import type { Metadata } from "next";
import { isLaunched, robotsMeta, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: SITE_NAME,
  description:
    "Guide interactif et indépendant sur l’assemblée citoyenne Un commun accord.",
  robots: robotsMeta(isLaunched()),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
