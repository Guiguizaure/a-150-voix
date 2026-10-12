// Le son de l'étape 5 : neuf oscillateurs désaccordés qui convergent vers un accord
// la–mi–la quand les citoyens s'accordent. Coupé par défaut ; l'AudioContext n'est créé
// qu'au premier clic sur un bouton de son (exigence des navigateurs).
import { rng } from "../core/math";

export interface Son {
  /** Active ou coupe le son ; renvoie l'état obtenu (faux si l'audio est indisponible). */
  activer(actif: boolean): boolean;
  /** Degré d'accord (0 à 1) et son audible ou non (étape 5 affichée et son activé). */
  regler(c: number, audible: boolean): void;
}

type FenetreAudio = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

export function creerSon(): Son {
  let ac: AudioContext | null = null;
  let master: GainNode | null = null;
  const voix: { o: OscillatorNode; d0: number }[] = [];
  let audibleAvant: boolean | null = null;
  let dernierReglage = 0;

  const preparer = (): boolean => {
    if (ac) return true;
    const AC =
      window.AudioContext ?? (window as FenetreAudio).webkitAudioContext;
    if (!AC) return false;
    try {
      ac = new AC();
    } catch {
      return false;
    }
    const filtre = ac.createBiquadFilter();
    filtre.type = "lowpass";
    filtre.frequency.value = 1400;
    master = ac.createGain();
    master.gain.value = 0;
    master.connect(filtre);
    filtre.connect(ac.destination);
    const notes = [110, 164.81, 220];
    const r = rng(3);
    for (let k = 0; k < 9; k++) {
      const o = ac.createOscillator();
      o.type = k % 3 === 0 ? "triangle" : "sine";
      const g = ac.createGain();
      g.gain.value = k % 3 === 0 ? 0.08 : 0.11;
      o.frequency.value = notes[k % 3]!;
      const d0 = (r() * 2 - 1) * 420;
      o.detune.value = d0;
      o.connect(g);
      g.connect(master);
      o.start();
      voix.push({ o, d0 });
    }
    return true;
  };

  return {
    activer(actif) {
      if (!actif) {
        if (ac && master) master.gain.setTargetAtTime(0, ac.currentTime, 0.15);
        audibleAvant = false;
        return false;
      }
      if (!preparer() || !ac) return false;
      if (ac.state === "suspended") void ac.resume();
      return true;
    },
    regler(c, audible) {
      if (!ac || !master) return;
      const t = ac.currentTime;
      if (audible === audibleAvant && t - dernierReglage < 0.05) return;
      dernierReglage = t;
      audibleAvant = audible;
      const k = (1 - c) * (1 - c);
      master.gain.setTargetAtTime(audible ? 0.16 : 0, t, audible ? 0.4 : 0.15);
      for (const x of voix) x.o.detune.setTargetAtTime(x.d0 * k, t, 0.08);
    },
  };
}
