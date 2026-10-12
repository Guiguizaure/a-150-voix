// Accueil : les 150 points flottent au-dessus d'un hémicycle en couches.
import type { Engine, Scene } from "../core/engine";
import { intro as sieges } from "../formations";

export function intro(e: Engine): Scene {
  return {
    enter() {
      e.setFormation(() => sieges(e.W, e.H), { dur: 1.6, stagger: 0.7 });
      e.fadeTo(1, 0.8);
    },
    draw() {
      e.updateDots();
      const R = Math.min(e.W * 0.5, e.H * 0.95);
      e.halfLayers(e.W / 2, e.H * 1.02, R, R * 0.22, 6, 0.045);
      e.drawDots({ drift: 9, tremble: 1.3, r: 3 });
    },
  };
}
