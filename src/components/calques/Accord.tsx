"use client";

// Calque de S'accorder : curseur du désaccord à l'accord, bouton qui accorde (ou
// désaccorde) en quelques secondes, et bouton de son.
import { SCENES } from "@content/etapes";
import { commander } from "@/scene/commandes";
import { useScene } from "@/scene/store";

const T = SCENES.accord;

export function CalqueAccord() {
  const c = useScene((s) => s.accordC);
  const son = useScene((s) => s.son);
  return (
    <div className="ov">
      <div className="accord-ctl">
        <span className="lbl" aria-hidden="true">
          {T.desaccord}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={c}
          aria-label={T.curseur}
          onChange={(ev) =>
            commander({ type: "accord", c: Number(ev.target.value) / 100 })
          }
        />
        <span className="lbl" aria-hidden="true">
          {T.accord}
        </span>
        <button
          type="button"
          className="ghost"
          onClick={() => commander({ type: "accorder" })}
        >
          {c >= 50 ? T.desaccorder : T.accorder}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => commander({ type: "son", actif: !son })}
        >
          {son ? T.couper : T.ecouter}
        </button>
      </div>
    </div>
  );
}
