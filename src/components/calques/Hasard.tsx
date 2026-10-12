"use client";

import { SCENES } from "@content/etapes";
import { commander } from "@/scene/commandes";
import { useScene } from "@/scene/store";

const T = SCENES.hasard;
const nombre = new Intl.NumberFormat("fr-FR");

export function CalqueHasard() {
  const phase = useScene((s) => s.compteurPhase);
  const n = useScene((s) => s.compteurN);
  const unite = useScene((s) => s.uniteAppels);
  return (
    <div className="ov">
      <div className="counter" aria-hidden="true">
        <span className="counter-n">{nombre.format(n)}</span>
        <span className="counter-l">
          {phase === "appels" ? T.compteurAppels : T.compteurTires}
        </span>
        <span className="counter-u">
          {phase === "appels"
            ? T.uniteAppels.replace("{n}", nombre.format(unite))
            : T.uniteTires}
        </span>
      </div>
      <button
        type="button"
        className="ghost corner"
        onClick={() => commander({ type: "rejouer" })}
      >
        {T.rejouer}
      </button>
    </div>
  );
}
