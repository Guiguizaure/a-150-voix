import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

/**
 * Chaque test échoue si la console affiche une erreur (exception, ressource refusée par la
 * Content-Security-Policy, etc.). Le détail est joint au rapport (`erreurs-console.txt`).
 * Repris de Le poids des choses.
 */
/**
 * WebKit signale comme erreur (« due to access control checks ») les préchargements de
 * Next.js (requêtes _rsc) annulés quand la page change : ce n'est pas une erreur du site.
 */
function prechargementAnnule(texte: string): boolean {
  return /Fetch API cannot load .*_rsc=.* due to access control checks/.test(
    texte,
  );
}

export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      const details: string[] = [];
      const record = (summary: string, lines: string[]) => {
        errors.push(summary);
        details.push(
          [`${testInfo.project.name}`, `page : ${page.url()}`, ...lines].join(
            "\n",
          ),
        );
      };
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        // axe-core lit un petit canvas avec getImageData ; sous charge, WebKit refuse parfois.
        if (/^Unable to get image data from canvas\./.test(message.text()))
          return;
        if (prechargementAnnule(message.text())) return;
        const { url, lineNumber, columnNumber } = message.location();
        record(message.text(), [
          `console.error : ${message.text()}`,
          `emplacement : ${url || "(inconnu)"}:${lineNumber}:${columnNumber}`,
        ]);
      });
      page.on("pageerror", (error) => {
        if (prechargementAnnule(error.message)) return;
        record(error.message, [
          `exception : ${error.name}: ${error.message}`,
          `pile :\n${error.stack ?? ""}`,
        ]);
      });
      await use(errors);
      if (details.length > 0) {
        await testInfo.attach("erreurs-console.txt", {
          body: details.join("\n\n"),
          contentType: "text/plain",
        });
      }
      expect(errors, "erreurs dans la console").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Une page inexistante ouverte exprès : le 404 du document est attendu en console. */
export function acceptDocument404(errors: string[]): void {
  const index = errors.findIndex((e) => /status of 404/.test(e));
  if (index >= 0) errors.splice(index, 1);
}

/** Attend la fin des animations finies (entrée des étapes), pour mesurer l'état stable. */
export async function waitForAnimations(page: Page): Promise<void> {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

/** Aucune violation axe, critères WCAG 2.2 A et AA (proches du RGAA AA). */
export async function expectNoAxeViolations(page: Page): Promise<void> {
  await waitForAnimations(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );
  expect(summary, "violations axe").toEqual([]);
}
