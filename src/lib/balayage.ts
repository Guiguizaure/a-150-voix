// Balayage horizontal du texte sur écran tactile : vers la gauche, étape suivante ; vers la
// droite, étape précédente. Fonction pure, testée.

/** Distance minimale (px), rapport horizontal / vertical, durée maximale (ms). */
export const BALAYAGE = { distance: 60, rapport: 2, duree: 700 } as const;

/** 1 : étape suivante, -1 : précédente, 0 : pas un balayage. */
export function sensDuBalayage(dx: number, dy: number, ms: number): -1 | 0 | 1 {
  if (ms > BALAYAGE.duree) return 0;
  if (Math.abs(dx) < BALAYAGE.distance) return 0;
  if (Math.abs(dx) < Math.abs(dy) * BALAYAGE.rapport) return 0;
  return dx < 0 ? 1 : -1;
}
