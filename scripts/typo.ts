// pnpm typo : corrige la typographie française des chaînes de content/*.ts (voir
// src/lib/typo.ts). Ne touche ni aux clés techniques (adresses, dates…), ni aux sources en
// anglais. --check : n'écrit rien et échoue s'il reste à corriger.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";
import { CLES_TECHNIQUES } from "../src/lib/registre";
import { fixTypo } from "../src/lib/typo";

const check = process.argv.includes("--check");
const dossier = new URL("../content/", import.meta.url);
const fichiers = readdirSync(dossier).filter(
  (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
);

function nomPropriete(node: ts.Node): string | undefined {
  const p = node.parent;
  if (ts.isPropertyAssignment(p) && p.initializer === node) {
    return p.name.getText().replace(/^["']|["']$/g, "");
  }
  return undefined;
}

function enAnglais(node: ts.Node): boolean {
  for (let n: ts.Node | undefined = node; n; n = n.parent) {
    if (ts.isObjectLiteralExpression(n)) {
      return n.properties.some(
        (p) =>
          ts.isPropertyAssignment(p) &&
          p.name.getText() === "langue" &&
          p.initializer.getText() === '"en"',
      );
    }
  }
  return false;
}

/** Remplacements [début, fin, texte] pour un fichier. */
function corrections(sf: ts.SourceFile): [number, number, string][] {
  const out: [number, number, string][] = [];
  const garder = (n: ts.Node) => {
    const cle = nomPropriete(n);
    return !(cle && CLES_TECHNIQUES.has(cle)) && !enAnglais(n);
  };
  const visite = (n: ts.Node) => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    if (ts.isStringLiteral(n) && garder(n)) {
      const fixed = fixTypo(n.text);
      if (fixed !== n.text)
        out.push([n.getStart(sf), n.getEnd(), JSON.stringify(fixed)]);
    } else if (ts.isNoSubstitutionTemplateLiteral(n) && garder(n)) {
      const raw = n.rawText ?? n.text;
      const fixed = fixTypo(raw);
      if (fixed !== raw) out.push([n.getStart(sf), n.getEnd(), `\`${fixed}\``]);
    } else if (ts.isTemplateExpression(n)) {
      const parts: [ts.Node, string, string, string][] = [
        [n.head, "`", n.head.rawText ?? n.head.text, "${"],
        ...n.templateSpans.map((s): [ts.Node, string, string, string] => [
          s.literal,
          "}",
          s.literal.rawText ?? s.literal.text,
          ts.isTemplateTail(s.literal) ? "`" : "${",
        ]),
      ];
      for (const [node, avant, raw, apres] of parts) {
        const fixed = fixTypo(raw);
        if (fixed !== raw)
          out.push([
            node.getStart(sf),
            node.getEnd(),
            `${avant}${fixed}${apres}`,
          ]);
      }
      n.templateSpans.forEach((s) => visite(s.expression));
      return;
    }
    ts.forEachChild(n, visite);
  };
  visite(sf);
  return out;
}

let restant = 0;
for (const f of fichiers) {
  const url = new URL(f, dossier);
  const source = readFileSync(url, "utf8");
  const sf = ts.createSourceFile(f, source, ts.ScriptTarget.Latest, true);
  const fixes = corrections(sf);
  if (!fixes.length) continue;
  restant += fixes.length;
  console.log(
    `content/${f} : ${fixes.length} chaîne(s) ${check ? "à corriger" : "corrigée(s)"}`,
  );
  if (check) continue;
  let out = source;
  for (const [debut, fin, texte] of fixes.sort((a, b) => b[0] - a[0])) {
    out = out.slice(0, debut) + texte + out.slice(fin);
  }
  writeFileSync(url, out);
}
if (check && restant) process.exit(1);
if (!restant) console.log("Typographie : rien à corriger.");
