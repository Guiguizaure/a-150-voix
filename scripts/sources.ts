// pnpm sources : régénère docs/sources.md depuis content/sources.ts.
import { writeFileSync } from "node:fs";
import { sourcesMarkdown } from "../src/lib/registre";

writeFileSync(
  new URL("../docs/sources.md", import.meta.url),
  sourcesMarkdown(),
);
console.log("docs/sources.md régénéré.");
