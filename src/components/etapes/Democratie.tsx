"use client";

// Étape 7 : six autres formes de participation, une carte à la fois, même structure pour
// toutes (quand, comment, limite).
import { SCENES } from "@content/etapes";
import { FORMES } from "@content/democratie";
import { INTERFACE } from "@content/interface";
import { majEtat, useEtat } from "@/lib/guide-store";
import { Markup } from "../Markup";

export function BlocDemocratie() {
  const k = useEtat((e) => e.forme);
  const f = FORMES[k] ?? FORMES[0];
  return (
    <>
      <div className="chips" role="group" aria-label={SCENES.democratie.formes}>
        {FORMES.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className="chip"
            aria-pressed={i === k}
            onClick={() => majEtat({ forme: i })}
          >
            {x.bouton}
          </button>
        ))}
      </div>
      <article
        className="demo-card"
        aria-live="polite"
        aria-labelledby="forme-titre"
      >
        <h2 id="forme-titre">{f.titre}</h2>
        <p className="quand accent">
          <Markup texte={f.quand} />
        </p>
        <p>
          <Markup texte={f.texte} />
        </p>
        <p className="lim">
          <b>{INTERFACE.limite}</b> <Markup texte={f.limite} />
        </p>
      </article>
    </>
  );
}
