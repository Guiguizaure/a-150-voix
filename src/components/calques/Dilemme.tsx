"use client";

// Calque du dilemme : les deux options, la phrase du verdict et le curseur (équivalent
// clavier du nœud que l'on fait glisser sur la scène).
import { EXEMPLES, verdict, type Intensite } from "@content/dilemmes";
import { SCENES } from "@content/etapes";
import { useEtat } from "@/lib/guide-store";
import { commander } from "@/scene/commandes";
import { useScene } from "@/scene/store";
import { Markup } from "../Markup";

const T = SCENES.dilemme;
const INTENSITE: Record<number, Intensite> = {
  0: "neutre",
  1: "plutot",
  2: "nettement",
};

export function CalqueDilemme() {
  const k = useEtat((e) => e.exemple);
  const v = useScene((s) => s.dilemmeV);
  const p = useScene((s) => s.palier);
  const ex = EXEMPLES[k] ?? EXEMPLES[0];
  const option = p < 0 ? ex.a : ex.b;
  return (
    <div className="ov">
      <div className="pole pole-l">
        <span className="pole-k">{T.optionA}</span>
        <span>{ex.a.etiquette}</span>
      </div>
      <div className="pole pole-r">
        <span className="pole-k">{T.optionB}</span>
        <span>{ex.b.etiquette}</span>
      </div>
      <div className="verdict">
        <p aria-live="polite">
          <Markup texte={verdict(INTENSITE[Math.abs(p)] ?? "neutre", option)} />
        </p>
        <label>
          <span className="sr-only">{T.curseur}</span>
          <input
            type="range"
            min={-100}
            max={100}
            step={1}
            value={v}
            aria-valuetext={
              v === 0
                ? T.positionCentre
                : T.positionVers
                    .replace("{option}", (v < 0 ? ex.a : ex.b).etiquette)
                    .replace("{n}", String(Math.abs(v)))
            }
            onChange={(ev) =>
              commander({ type: "dilemme", v: Number(ev.target.value) / 100 })
            }
          />
        </label>
      </div>
    </div>
  );
}
