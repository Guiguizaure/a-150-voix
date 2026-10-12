// Calendrier : quelles entrées du journal sont passées à une date donnée (fonction pure).
import { JOURNAL, SESSIONS } from "@content/sessions";

/** Fin d'une session : minuit passé, heure de Paris (marge large : UTC+1 ou +2). */
function finSession(jour: string): number {
  return Date.parse(`${jour}T23:59:59+01:00`);
}

/**
 * Pour chaque entrée du journal : vrai si toutes ses sessions ont des dates publiées et sont
 * terminées. L'élection n'est jamais marquée passée ici.
 */
export function sessionsPassees(maintenant: number): boolean[] {
  return JOURNAL.map((entree) => {
    if (!entree.sessions.length) return false;
    return entree.sessions.every((n) => {
      const fin = SESSIONS.find((s) => s.numero === n)?.fin;
      return fin != null && finSession(fin) < maintenant;
    });
  });
}
