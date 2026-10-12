import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ETAPES } from "@content/etapes";
import { Etape } from "@/components/Etape";
import { chemin, etape } from "@/lib/guide";
import { plainText } from "@/lib/markup";

export const dynamicParams = false;

export function generateStaticParams() {
  return ETAPES.map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = etape((await params).slug);
  if (!e) return {};
  return {
    title: e.court,
    description: plainText(e.description.texte),
    alternates: { canonical: chemin(e.slug) },
  };
}

export default async function PageEtape({ params }: Props) {
  const e = etape((await params).slug);
  if (!e) notFound();
  return <Etape etape={e} />;
}
