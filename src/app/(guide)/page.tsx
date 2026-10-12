import type { Metadata } from "next";
import Link from "next/link";
import { ACCUEIL, ETAPES, PARTIES, type Partie } from "@content/etapes";
import { Markup } from "@/components/Markup";
import { chemin } from "@/lib/guide";
import { plainText } from "@/lib/markup";

export const metadata: Metadata = {
  description: plainText(ACCUEIL.description.texte),
  alternates: { canonical: "/" },
};

export default function Accueil() {
  return (
    <article className="step enter" aria-labelledby="titre-etape">
      <p className="eyebrow">{ACCUEIL.surtitre}</p>
      <h1 className="hero-title" id="titre-etape" tabIndex={-1}>
        <Markup texte={ACCUEIL.titre} />
      </h1>
      <p className="lead reveal" style={{ "--k": 0 } as React.CSSProperties}>
        <Markup texte={ACCUEIL.chapo.texte} />
      </p>
      {(Object.keys(PARTIES) as Partie[]).map((partie) => (
        <nav
          key={partie}
          className="reveal"
          style={{ "--k": 1 } as React.CSSProperties}
          aria-labelledby={`toc-${partie}`}
        >
          <p className="toc-k" id={`toc-${partie}`}>
            {PARTIES[partie]}
          </p>
          <ol className="toc">
            {ETAPES.filter((e) => e.partie === partie).map((e) => (
              <li key={e.slug}>
                <Link href={chemin(e.slug)}>
                  <em aria-hidden="true">{e.numero}</em> {e.court}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ))}
      <Link
        className="cta reveal"
        style={{ "--k": 2 } as React.CSSProperties}
        href={chemin(ETAPES[0].slug)}
      >
        {ACCUEIL.commencer} <span aria-hidden="true">→</span>
      </Link>
      <p className="fine">{ACCUEIL.dureeLecture}</p>
    </article>
  );
}
