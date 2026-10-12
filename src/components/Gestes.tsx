"use client";

// Navigation entre les étapes au clavier (flèches gauche et droite) et au balayage du texte
// sur écran tactile ; à chaque changement d'étape, la page remonte en douceur et le titre
// reçoit le focus.
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { sensDuBalayage } from "@/lib/balayage";
import { adresse, rang, TOTAL } from "@/lib/guide";

/** Éléments où les flèches et le balayage gardent leur rôle habituel. */
const INTERACTIF =
  "input, textarea, select, [contenteditable], [role='slider'], dialog[open]";

export function Gestes() {
  const pathname = usePathname();
  const router = useRouter();
  const r = rang(pathname);
  const rangCourant = useRef(r);
  const premier = useRef(true);

  useEffect(() => {
    rangCourant.current = r;
  }, [r]);

  // Flèches et balayage.
  useEffect(() => {
    const aller = (sens: -1 | 1) => {
      const actuel = rangCourant.current;
      if (actuel < 0) return;
      const cible = actuel + sens;
      if (cible < 0 || cible > TOTAL) return;
      router.push(adresse(cible), { scroll: false });
    };
    const clavier = (ev: KeyboardEvent) => {
      if (
        ev.defaultPrevented ||
        ev.altKey ||
        ev.ctrlKey ||
        ev.metaKey ||
        ev.shiftKey
      )
        return;
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      const cible = ev.target as Element | null;
      if (
        cible?.closest?.(INTERACTIF) ||
        document.querySelector("dialog[open]")
      )
        return;
      ev.preventDefault();
      aller(ev.key === "ArrowRight" ? 1 : -1);
    };
    const zone = document.querySelector<HTMLElement>(".panel");
    let depart: { x: number; y: number; t: number } | null = null;
    const debut = (ev: TouchEvent) => {
      const t = ev.touches[0];
      const cible = ev.target as Element | null;
      depart =
        ev.touches.length === 1 && t && !cible?.closest?.(INTERACTIF)
          ? { x: t.clientX, y: t.clientY, t: ev.timeStamp }
          : null;
    };
    const fin = (ev: TouchEvent) => {
      const t = ev.changedTouches[0];
      if (!depart || !t) return;
      const sens = sensDuBalayage(
        t.clientX - depart.x,
        t.clientY - depart.y,
        ev.timeStamp - depart.t,
      );
      depart = null;
      if (sens) aller(sens);
    };
    window.addEventListener("keydown", clavier);
    zone?.addEventListener("touchstart", debut, { passive: true });
    zone?.addEventListener("touchend", fin, { passive: true });
    return () => {
      window.removeEventListener("keydown", clavier);
      zone?.removeEventListener("touchstart", debut);
      zone?.removeEventListener("touchend", fin);
    };
  }, [router]);

  // Changement d'étape : texte en haut, focus sur le titre (pas au premier affichage).
  useEffect(() => {
    if (premier.current) {
      premier.current = false;
      return;
    }
    // Next.js ne fait pas défiler (scroll={false}) : il amènerait le début du texte sous la
    // scène collée en haut de l'écran mobile, et le titre serait masqué.
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    const panneau = document.querySelector<HTMLElement>(".panel");
    panneau?.scrollTo({ top: 0, behavior: doux });
    window.scrollTo({ top: 0, behavior: doux });
    document.getElementById("titre-etape")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
