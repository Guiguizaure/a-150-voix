// Contexte 2D factice pour les tests : chaque méthode est une fonction vide, chaque
// propriété s'écrit sans effet. Compte les appels de dessin.
export function fauxContexte(): CanvasRenderingContext2D & {
  appels: Record<string, number>;
} {
  const appels: Record<string, number> = {};
  const cible: Record<string, unknown> = { appels };
  return new Proxy(cible, {
    get(t, k: string) {
      if (k in t) return t[k];
      return () => {
        appels[k] = (appels[k] ?? 0) + 1;
      };
    },
    set(t, k: string, v) {
      t[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D & {
    appels: Record<string, number>;
  };
}
