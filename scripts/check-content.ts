// Avant next build : bilan du registre. En mode strict (STRICT=1, ou SITE_LAUNCHED=1 pour
// la mise en ligne publique), échoue s'il reste un fait à sourcer ou à revérifier, ou un
// emplacement à compléter.
import {
  bilan,
  bloquantsLancement,
  estStrict,
  LIBELLES,
} from "../src/lib/registre";

const { parStatut, aCompleter } = bilan();
const resume = (Object.keys(parStatut) as (keyof typeof parStatut)[])
  .map((s) => `${parStatut[s].length} ${LIBELLES[s]}`)
  .join(", ");
console.log(`Registre : ${resume} ; ${aCompleter.length} à compléter.`);

const bloquants = bloquantsLancement();
if (estStrict() && bloquants.length) {
  console.error("Mode strict : mise en ligne impossible tant qu'il reste :");
  for (const b of bloquants) console.error(`  - ${b}`);
  process.exit(1);
}
