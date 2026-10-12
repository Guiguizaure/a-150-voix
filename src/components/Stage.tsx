"use client";

// La scène : un canvas persistant dans la coquille du guide, jamais rechargé d'une étape à
// l'autre (les 150 points glissent d'une formation à la suivante). Une arrivée directe sur
// une étape pose les points dans la bonne formation, sans transition. L'animation s'arrête
// quand l'onglet est masqué ; la résolution du canvas est limitée à 2 × la taille CSS.
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PALETTES } from "@/lib/palette";
import { abonner as abonnerGuide, lireEtat } from "@/lib/guide-store";
import { scene as sceneDe } from "@/lib/guide";
import { Engine } from "@/scene/core/engine";
import { intro } from "@/scene/formations";
import { creerScenes } from "@/scene/scenes";
import { brancherMoteur } from "@/scene/commandes";
import { sortieScene } from "@/scene/store";
import { Calques } from "./calques";
import { usePalette } from "./ThemeToggle";

const MOUVEMENT_REDUIT = "(prefers-reduced-motion: reduce)";

export function Stage() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const moteur = useRef<Engine | null>(null);
  const pathname = usePathname();
  const palette = usePalette();
  const sceneVoulue = sceneDe(pathname);
  const premiere = useRef(sceneVoulue);

  // Création du moteur, boucle d'animation, taille du canvas.
  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const mq = window.matchMedia(MOUVEMENT_REDUIT);
    const e = new Engine(ctx, PALETTES.nuit, {
      reducedMotion: mq.matches,
      sortie: sortieScene,
    });
    e.enregistrer(creerScenes(e));
    moteur.current = e;
    brancherMoteur(e);

    let dpr = 1;
    const mesurer = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      e.resize(r.width, r.height);
    };
    mesurer();
    e.poser(intro(e.W, e.H));
    const id = premiere.current;
    e.aller(e.scene(id) ? id : "intro", { arrivee: id !== "intro" });

    let raf = 0;
    let dernier = 0;
    const image = (ts: number) => {
      const dt = dernier ? (ts - dernier) / 1000 : 1 / 60;
      dernier = ts;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      e.frame(dt);
      raf = requestAnimationFrame(image);
    };
    const demarrer = () => {
      if (raf || document.hidden) return;
      dernier = 0;
      raf = requestAnimationFrame(image);
    };
    const arreter = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const visibilite = () => (document.hidden ? arreter() : demarrer());
    const mouvement = () => {
      e.rm = mq.matches;
    };

    const ro = new ResizeObserver(mesurer);
    ro.observe(cv);
    document.addEventListener("visibilitychange", visibilite);
    mq.addEventListener("change", mouvement);
    const desabonner = abonnerGuide(() => {
      const { exemple, forme } = lireEtat();
      e.commande({ type: "exemple", k: exemple });
      e.commande({ type: "forme", k: forme });
    });
    demarrer();
    return () => {
      arreter();
      ro.disconnect();
      document.removeEventListener("visibilitychange", visibilite);
      mq.removeEventListener("change", mouvement);
      desabonner();
      e.commande({ type: "son", actif: false });
      moteur.current = null;
      brancherMoteur(null);
    };
  }, []);

  // Changement d'étape : la scène suit l'adresse.
  useEffect(() => {
    const e = moteur.current;
    if (!e) return;
    e.aller(e.scene(sceneVoulue) ? sceneVoulue : "intro");
  }, [sceneVoulue]);

  // Changement de palette : le canvas relit ses couleurs.
  useEffect(() => {
    moteur.current?.setPalette(PALETTES[palette]);
  }, [palette]);

  return (
    <>
      <canvas
        ref={canvas}
        className="scene"
        data-scene={sceneVoulue}
        aria-hidden="true"
      />
      <Calques scene={sceneVoulue} />
    </>
  );
}
