"use client";

// Bouton à deux états Nuit / Papier. Nuit par défaut, quel que soit le réglage du système ;
// le choix de Papier est gardé dans localStorage (s'il est disponible).
import { useSyncExternalStore } from "react";
import { INTERFACE } from "@content/interface";
import { estPalette, PALETTE_KEY, type PaletteId } from "@/lib/palette";

const CHANGE = "a150:palette";

function effective(): PaletteId {
  const choix = document.documentElement.dataset.palette;
  return estPalette(choix) ? choix : "nuit";
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  return () => window.removeEventListener(CHANGE, cb);
}

export function choisirPalette(p: PaletteId) {
  document.documentElement.dataset.palette = p;
  try {
    localStorage.setItem(PALETTE_KEY, p);
  } catch {
    // Stockage indisponible (navigation privée, réglages) : le choix vaut pour la page.
  }
  window.dispatchEvent(new Event(CHANGE));
}

export function usePalette(): PaletteId {
  return useSyncExternalStore(subscribe, effective, () => "nuit");
}

export function ThemeToggle() {
  const palette = usePalette();
  const papier = palette === "papier";
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={papier}
      aria-label={INTERFACE.palette.claire}
      title={INTERFACE.palette.claire}
      onClick={() => choisirPalette(papier ? "nuit" : "papier")}
    >
      {papier ? (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7z" />
        </svg>
      )}
    </button>
  );
}
