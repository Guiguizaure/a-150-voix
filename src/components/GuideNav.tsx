"use client";

// Navigation (a) : segments indicatifs, Précédent, Sommaire « n / 8 » et Suivant. Le
// Sommaire s'ouvre dans un <dialog> modal (Échap et clic sur le fond le ferment).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ETAPES, PARTIES, type Partie } from "@content/etapes";
import { INTERFACE } from "@content/interface";
import { adresse, chemin, rang, TOTAL } from "@/lib/guide";

const T = INTERFACE.nav;
const NNBSP = " ";

function position(n: number): string {
  return T.position.replace("{n}", String(n)).replace("{total}", String(TOTAL));
}

export function GuideNav() {
  const r = Math.max(0, rang(usePathname()));
  const dialog = useRef<HTMLDialogElement>(null);
  const precedent = r > 0 ? ETAPES[r - 2] : undefined;
  const suivant = r < TOTAL ? ETAPES[r] : undefined;
  const fermer = () => dialog.current?.close();

  const libelleSuivant =
    r === 0 ? T.commencer : r === TOTAL ? T.recommencer : T.suivant;

  return (
    <nav className="nav" aria-label={T.region}>
      <ol className="segs" aria-hidden="true">
        {ETAPES.map((e, k) => {
          const n = k + 1;
          const classes = [
            e.partie === "aller-plus-loin" ? "ep" : "",
            k > 0 && e.partie !== ETAPES[k - 1]!.partie ? "sep" : "",
            n === r ? "cur" : n < r ? "vu" : "",
          ];
          return (
            <li
              key={e.slug}
              className={classes.join(" ").trim() || undefined}
            />
          );
        })}
      </ol>
      <div className="nav-row">
        <Link
          className="nav-btn"
          href={adresse(r - 1)}
          aria-disabled={r === 0 ? "true" : undefined}
          tabIndex={r === 0 ? -1 : undefined}
          aria-label={
            r === 0
              ? T.precedent
              : `${T.precedent}${NNBSP}: ${precedent ? precedent.court : INTERFACE.accueil}`
          }
        >
          <span aria-hidden="true">←</span>{" "}
          <span className="lbl">{T.precedent}</span>
        </Link>
        <button
          type="button"
          className="sommaire"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          {T.sommaire}
          {r > 0 && (
            <>
              <span className="compte" aria-hidden="true">
                {r}
                {NNBSP}/{NNBSP}
                {TOTAL}
              </span>
              <span className="sr-only">, {position(r)}</span>
            </>
          )}
        </button>
        <Link
          className="nav-btn"
          href={r === TOTAL ? "/" : adresse(r + 1)}
          aria-label={`${libelleSuivant}${NNBSP}: ${suivant ? suivant.court : INTERFACE.accueil}`}
        >
          <span className="lbl">{libelleSuivant}</span>{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <dialog
        ref={dialog}
        className="sheet"
        aria-labelledby="sommaire-titre"
        onClick={(e) => {
          if (e.target === dialog.current) fermer();
        }}
      >
        <div className="sheet-in">
          <div className="sheet-head">
            <h2 id="sommaire-titre">{T.sommaire}</h2>
            <button
              type="button"
              className="icon-btn"
              aria-label={T.fermer}
              onClick={fermer}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path d="M3.5 3.5l9 9m0-9l-9 9" />
              </svg>
            </button>
          </div>
          {(Object.keys(PARTIES) as Partie[]).map((partie) => (
            <section key={partie} aria-labelledby={`sommaire-${partie}`}>
              <p className="toc-k" id={`sommaire-${partie}`}>
                {PARTIES[partie]}
              </p>
              <ol className="sheet-list">
                {ETAPES.filter((e) => e.partie === partie).map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={chemin(e.slug)}
                      aria-current={e.numero === r ? "page" : undefined}
                      onClick={fermer}
                    >
                      <em aria-hidden="true">{e.numero}</em> {e.court}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </dialog>
    </nav>
  );
}
