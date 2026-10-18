// Écouter : des rangs face à l'orateur ; ses paroles se propagent en ondes qui allument
// les rangs au passage. La légende fait défiler les auditions de la première session.
import { SCENES } from "@content/etapes";
import { rgba } from "../core/math";
import type { Engine, Scene } from "../core/engine";
import { ecouter as sieges, ecouterPortee, ecouterSource } from "../formations";

const AUDITIONS = SCENES.ecouter.auditions.length;

export function ecouter(e: Engine): Scene {
  let ondes: { t0: number }[] = [];
  let prochaine = 0;
  let t0 = 0;

  return {
    enter() {
      e.setFormation(() => sieges(e.W, e.H), {
        dur: 1.5,
        stagger: 0.6,
        center: () => ecouterSource(e.W, e.H),
      });
      e.fadeTo(1, 0.5);
      ondes = [];
      prochaine = e.now + 1.2;
      t0 = e.now;
      e.sortie.publier({ audition: 0 });
    },
    draw() {
      const S = ecouterSource(e.W, e.H);
      const portee = ecouterPortee(e.W, e.H) * 1.12;
      const vitesse = portee / 3.2;
      if (!e.rm && e.now >= prochaine) {
        ondes.push({ t0: e.now });
        prochaine = e.now + 2.4;
      }
      ondes = ondes.filter((o) => (e.now - o.t0) * vitesse < portee);
      e.updateDots();
      if (e.rm) {
        for (let k = 1; k <= 4; k++) {
          e.blobPath(S.x, S.y, (portee * k) / 4.6, 0, k, 0.6);
          e.ctx.fillStyle = rgba(e.P.accent, 0.035);
          e.ctx.fill();
        }
      }
      for (const o of ondes) {
        const rr = (e.now - o.t0) * vitesse;
        const fade = 1 - rr / portee;
        for (let k = 0; k < 4; k++) {
          const ri = rr - k * 15;
          if (ri <= 2) continue;
          e.blobPath(S.x, S.y, ri, e.now, k + o.t0, 0.6);
          e.ctx.fillStyle = rgba(e.P.accent, 0.05 * fade);
          e.ctx.fill();
        }
        for (const d of e.dots) {
          const g =
            (1 - Math.abs(Math.hypot(d.bx - S.x, d.by - S.y) - rr) / 16) *
            (0.35 + 0.65 * fade);
          if (g > d.glow) d.glow = g;
        }
      }
      e.layers(S.x, S.y, 16, 3, 0.14, e.now, 1, 0.6, 0.5);
      e.dot(S.x, S.y, 5, 1, 1);
      // La légende défile aussi en mouvement réduit : ce n'est pas une animation.
      const audition =
        Math.floor(Math.max(0, e.now - t0 - 1.2) / 7.2) % AUDITIONS;
      e.sortie.publier({ audition });
      e.drawDots({ drift: 0.8, r: 3, decay: 3 });
    },
  };
}
