"use client";

// Bouton de son de l'en-tête : coupé par défaut, il accompagne l'étape « S'accorder ».
import { INTERFACE } from "@content/interface";
import { commander } from "@/scene/commandes";
import { useScene } from "@/scene/store";

export function SoundToggle() {
  const son = useScene((s) => s.son);
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={son}
      aria-label={INTERFACE.son.libelle}
      title={INTERFACE.son.titre}
      onClick={() => commander({ type: "son", actif: !son })}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" stroke="none" />
        {son ? (
          <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.3 3.6a6 6 0 0 1 0 8.8" />
        ) : (
          <path d="M10.5 6l4 4m0-4l-4 4" />
        )}
      </svg>
    </button>
  );
}
