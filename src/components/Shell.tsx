// Coquille du guide : en-tête, mention d'indépendance, panneau de texte avec la navigation
// et le pied de page, et l'emplacement de la scène. Reste montée d'une étape à l'autre.
import Link from "next/link";
import { INTERFACE } from "@content/interface";
import { Gestes } from "./Gestes";
import { GuideNav } from "./GuideNav";
import { Lien, Markup } from "./Markup";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";

function Mention({ className }: { className: string }) {
  return (
    <p className={className}>
      <strong>{INTERFACE.mention.fort}</strong>
      {INTERFACE.mention.suite}
    </p>
  );
}

export function Pied() {
  const P = INTERFACE.pied;
  return (
    <footer className="foot">
      <p className="foot-indep">{P.mention}</p>
      <p>
        <Markup texte={P.concu} />
      </p>
      <ul className="foot-links">
        <li>
          <Lien href="/mentions-legales">{P.mentionsLegales}</Lien>
        </li>
        <li>
          <Lien href="/sources">{P.sources}</Lien>
        </li>
      </ul>
    </footer>
  );
}

export function Shell({
  children,
  scene,
}: {
  children: React.ReactNode;
  scene?: React.ReactNode;
}) {
  return (
    <div className="app">
      <Gestes />
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
          <SoundToggle />
          <ThemeToggle />
        </div>
      </header>
      <Mention className="indep" />
      <div className="main">
        <div className="panel">
          <main id="contenu" className="contenu" tabIndex={-1}>
            {children}
          </main>
          <GuideNav />
          <Pied />
        </div>
        <div className="art">{scene}</div>
      </div>
    </div>
  );
}
