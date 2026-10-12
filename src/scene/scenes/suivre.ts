// Suivre : la frise des six sessions jusqu'à la présidentielle ; le groupe des 150 se
// tient au-dessus du jour présent. Les sessions passées sont pleines.
import { SCENES } from "@content/etapes";
import { SESSIONS } from "@content/sessions";
import { clamp, ease, lerp, rgba, TAU } from "../core/math";
import { SANS, SERIF, type Engine, type Scene } from "../core/engine";
import { suivre as sieges, suivreGeo } from "../formations";

const T = SCENES.suivre;

function passee(fin: string | null, maintenant: number): boolean {
  return fin !== null && Date.parse(`${fin}T23:59:59+01:00`) < maintenant;
}

export function suivre(e: Engine): Scene {
  let t0 = 0;

  return {
    enter() {
      e.setFormation(() => sieges(e.W, e.H, e.maintenant()), {
        dur: 1.6,
        stagger: 0.6,
      });
      e.fadeTo(1, 0.5);
      t0 = e.now - (e.arrivee ? 99 : 0);
    },
    draw() {
      const { ctx, now } = e;
      const maintenant = e.maintenant();
      e.updateDots();
      const g = suivreGeo(e.W, e.H, maintenant);
      const n = g.nodes.length;
      const p = e.rm ? 1 : ease(clamp((now - t0) / 1.4, 0, 1));
      const premier = g.nodes[0]!;
      const dernier = g.nodes[n - 1]!;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(e.P.fg, 0.28);
      ctx.beginPath();
      ctx.moveTo(premier.x, g.y);
      ctx.lineTo(lerp(premier.x, dernier.x, p), g.y);
      ctx.stroke();
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(dernier.x, g.y);
      ctx.lineTo(lerp(dernier.x, g.xe, p), g.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = rgba(e.P.accent, 0.95);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(premier.x, g.y);
      ctx.lineTo(lerp(premier.x, g.tx, p), g.y);
      ctx.stroke();
      ctx.strokeStyle = rgba(e.P.accent, 0.45);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.tx, g.y - 4);
      ctx.lineTo(g.nuage.x, g.nuage.y + g.R + 6);
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      g.nodes.forEach((nd, k) => {
        const s = SESSIONS[k]!;
        if (passee(s.fin, maintenant)) {
          e.layers(nd.x, nd.y, 18, 3, 0.1 * p, now, k, 0.6, 0.5);
          e.dot(nd.x, nd.y, 6, 1, 1);
        } else {
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 5.5, 0, TAU);
          ctx.fillStyle = rgba(e.P.bg, 1);
          ctx.fill();
          ctx.strokeStyle = rgba(e.P.fg, 0.55);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.fillStyle = rgba(e.P.fg, 0.9);
        ctx.font = `italic 500 15px ${SERIF}`;
        ctx.fillText(String(s.numero), nd.x, nd.y - 15);
        ctx.fillStyle = rgba(e.P.muted, 1);
        ctx.font = `500 11px ${SANS}`;
        ctx.fillText(s.mois, nd.x, nd.y + 24);
      });
      ctx.save();
      ctx.translate(g.xe, g.y);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = rgba(e.P.fg, 0.6);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-4, -4, 8, 8);
      ctx.restore();
      e.label(T.presidentielle, g.xe + 6, g.y + 44, "right");
      e.label(T.aujourdhui, g.tx, g.y + 44, "center", e.P.hi);
      e.drawDots({ drift: 0.6, r: 2.6 });
    },
  };
}
