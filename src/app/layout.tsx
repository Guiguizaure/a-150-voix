import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "À 150 voix",
  description:
    "Guide interactif et indépendant sur l’assemblée citoyenne Un commun accord.",
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
