// Après next build : écrit out/_headers depuis public/_headers, sans le bloc de préversion
// (noindex) si SITE_LAUNCHED=1. Échoue si le bloc manque.
import { readFileSync, writeFileSync } from "node:fs";
import { finalHeaders, isLaunched } from "../src/lib/site";

const source = readFileSync(
  new URL("../public/_headers", import.meta.url),
  "utf8",
);
const launched = isLaunched();
writeFileSync(
  new URL("../out/_headers", import.meta.url),
  finalHeaders(source, launched),
);
console.log(
  launched
    ? "out/_headers : site lancé, noindex retiré."
    : "out/_headers : préversion, noindex conservé.",
);
