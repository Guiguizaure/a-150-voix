"use client";

// Légende posée sur la scène : une étiquette et une phrase (Écouter, Délibérer, formes de
// démocratie).
import { SCENES } from "@content/etapes";
import { FORMES } from "@content/democratie";
import { useEtat } from "@/lib/guide-store";
import { useScene } from "@/scene/store";

function Legende({ etiquette, texte }: { etiquette: string; texte: string }) {
  return (
    <div className="ov">
      <p className="cap">
        <span className="cap-k">{etiquette}</span>
        <span className="cap-t">{texte}</span>
      </p>
    </div>
  );
}

export function CalqueEcouter() {
  const k = useScene((s) => s.audition);
  const T = SCENES.ecouter;
  return (
    <Legende etiquette={T.etiquette} texte={T.auditions[k] ?? T.auditions[0]} />
  );
}

export function CalqueDeliberer() {
  const moment = useScene((s) => s.moment);
  const T = SCENES.deliberer;
  return (
    <Legende
      etiquette={T.etiquette}
      texte={moment === "tables" ? T.petitsGroupes : T.tousEnsemble}
    />
  );
}

export function CalqueDemocratie() {
  const k = useEtat((e) => e.forme);
  const f = FORMES[k] ?? FORMES[0];
  return <Legende etiquette={f.legende[0]} texte={f.legende[1]} />;
}
