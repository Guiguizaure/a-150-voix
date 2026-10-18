import type { Metadata } from "next";
import Link from "next/link";
import { INTROUVABLE as T } from "@content/legal";
import { PageSimple } from "@/components/PageSimple";

export const metadata: Metadata = { title: T.titre };

export default function Introuvable() {
  return (
    <PageSimple>
      <h1 className="title">{T.titre}</h1>
      <p className="lead">{T.texte}</p>
      <Link className="cta" href="/">
        {T.retour}
      </Link>
    </PageSimple>
  );
}
