"use client";

// Étape 3 : exemples du curseur (puces et question), puis les six dilemmes retenus, leur fil
// rouge et la façon dont ils ont été choisis.
import { SCENES } from "@content/etapes";
import {
  DILEMMES,
  DILEMMES_TITRE,
  EXEMPLES,
  EXEMPLES_SOURCE,
  FIL_ROUGE,
  SELECTION,
} from "@content/dilemmes";
import { majEtat, useEtat } from "@/lib/guide-store";
import { Markup } from "../Markup";

export function BlocDilemme() {
  const exemple = useEtat((e) => e.exemple);
  const courant = EXEMPLES[exemple] ?? EXEMPLES[0];
  return (
    <>
      <div className="chips" role="group" aria-label={SCENES.dilemme.exemples}>
        {EXEMPLES.map((e, k) => (
          <button
            key={e.bouton}
            type="button"
            className="chip"
            aria-pressed={k === exemple}
            onClick={() => majEtat({ exemple: k })}
          >
            {e.bouton}
          </button>
        ))}
      </div>
      <p className="q" aria-live="polite">
        <Markup texte={`« ${courant.texte} »`} />
      </p>
      <p className="q-src">{EXEMPLES_SOURCE}</p>
      <h2 className="k-label">{DILEMMES_TITRE}</h2>
      <ol className="dilemmes">
        {DILEMMES.map((d) => (
          <li key={d.theme}>
            <span>
              <Markup texte={d.texte} />
            </span>
          </li>
        ))}
      </ol>
      <p>
        <Markup texte={FIL_ROUGE.texte} />
      </p>
      <p>
        <Markup texte={SELECTION.texte} />
      </p>
    </>
  );
}
