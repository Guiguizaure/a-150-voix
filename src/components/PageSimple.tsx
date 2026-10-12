// Pages hors du guide (mentions légales, sources, page introuvable) : même en-tête, même
// mention d'indépendance et même pied de page, sans la scène.
import Link from "next/link";
import { INTERFACE } from "@content/interface";
import { Mention, Pied } from "./Shell";
import { ThemeToggle } from "./ThemeToggle";

export function PageSimple({ children }: { children: React.ReactNode }) {
  return (
    <div className="simple">
      <a className="lien-evitement" href="#contenu">
        {INTERFACE.evitement}
      </a>
      <header className="topbar">
        <div className="brand">
          <Link className="wordmark" href="/" aria-label={INTERFACE.accueil}>
            À 150&nbsp;<em>voix</em>
          </Link>
          <Mention className="badge" />
        </div>
        <div className="tools">
          <ThemeToggle />
        </div>
      </header>
      <Mention className="indep" />
      <div className="simple-corps">
        <main id="contenu" className="page" tabIndex={-1}>
          {children}
        </main>
        <Pied />
      </div>
    </div>
  );
}
