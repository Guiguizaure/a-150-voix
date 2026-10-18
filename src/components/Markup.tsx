// Rendu du mini-balisage du contenu (src/lib/markup.ts). Les liens sortants s'ouvrent dans
// un nouvel onglet, annoncé aux lecteurs d'écran.
import Link from "next/link";
import { Fragment } from "react";
import { INTERFACE } from "@content/interface";
import { parseMarkup } from "@/lib/markup";

export function Markup({ texte }: { texte: string }) {
  return (
    <>
      {parseMarkup(texte).map((s, i) => {
        switch (s.type) {
          case "gras":
            return <strong key={i}>{s.texte}</strong>;
          case "accent":
            return <em key={i}>{s.texte}</em>;
          case "exposant":
            return <sup key={i}>{s.texte}</sup>;
          case "lien":
            return (
              <Lien key={i} href={s.href}>
                {s.texte}
              </Lien>
            );
          default:
            return <Fragment key={i}>{s.texte}</Fragment>;
        }
      })}
    </>
  );
}

export function Lien({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  if (!/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener">
      {children}
      <span className="sr-only"> ({INTERFACE.nouvelOnglet})</span>
    </a>
  );
}
