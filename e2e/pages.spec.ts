import { SOURCES } from "../content/sources";
import {
  acceptDocument404,
  expect,
  expectNoAxeViolations,
  test,
} from "./fixtures";

test("mentions légales : éditeur, hébergeur, aucun cookie", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Mentions légales" })
    .click();
  await expect(page).toHaveURL(/\/mentions-legales$/);
  const main = page.getByRole("main");
  await expect(main).toContainText(
    "Guillaume Salle, entrepreneur individuel (Webjuno)",
  );
  await expect(main).toContainText("SIRET 931 695 365 00011");
  await expect(main).toContainText("Cloudflare, Inc.");
  await expect(main).toContainText(
    "101 Townsend St, San Francisco, CA 94107, États-Unis",
  );
  await expect(main).toContainText("aucun cookie");
  await expect(main).toContainText("aucune donnée personnelle");
  await expect(main).toContainText("sans cookie");
  await expect(main).toContainText(
    "sans lien avec les organisateurs d’Un commun accord",
  );
});

test("sources : chaque source du registre, avec ses faits", async ({
  page,
}) => {
  await page.goto("/sources");
  await expect(page.locator("ol.sources > li")).toHaveCount(
    Object.keys(SOURCES).length,
  );
  await expect(page.locator("#ucaDilemmes")).toContainText(
    "La liste finale des six dilemmes a été publiée le 10 octobre 2026.",
  );
  await expect(page.locator("#ucaDilemmes a")).toHaveAttribute(
    "target",
    "_blank",
  );
});

test("page introuvable : un titre, un retour à l'accueil, sans violation axe", async ({
  page,
  consoleErrors,
}) => {
  const reponse = await page.goto("/nulle-part");
  acceptDocument404(consoleErrors);
  expect(reponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page introuvable",
  );
  await expectNoAxeViolations(page);
  await page.getByRole("link", { name: "Revenir à l’accueil" }).click();
  await expect(page).toHaveURL(/\/$/);
});
