// Types communs du contenu. Les textes utilisent un mini-balisage (src/lib/markup.ts) :
// **gras**, *accent* (italique Newsreader), [lien](https://…) et ^exposant^.
import type { FaitId } from "./sources";

/** Texte qui affirme quelque chose : il cite les faits du registre qui le fondent. */
export interface Texte {
  readonly texte: string;
  readonly faits: readonly FaitId[];
}

/**
 * Emplacement pas encore rempli, affiché en pointillés. Interdit à la mise en ligne
 * publique (STRICT=1 ou SITE_LAUNCHED=1).
 */
export interface ACompleter {
  readonly aCompleter: true;
  /** Ce qu'il faut y mettre, affiché en attendant. */
  readonly indication: string;
}

export function estACompleter(x: unknown): x is ACompleter {
  return (
    typeof x === "object" &&
    x !== null &&
    (x as { aCompleter?: unknown }).aCompleter === true
  );
}
