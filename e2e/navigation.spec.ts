import { expect, test } from "./fixtures";

test("les flèches du clavier changent d'étape et donnent le focus au titre", async ({
  page,
}) => {
  await page.goto("/hasard");
  await page.locator("body").press("ArrowRight");
  await expect(page).toHaveURL(/\/ecouter$/);
  const titre = page.getByRole("heading", { level: 1 });
  await expect(titre).toContainText("D’abord, écouter les faits");
  await expect(titre).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/hasard$/);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/$/);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/$/);
});

test("les flèches gardent leur rôle sur un curseur", async ({ page }) => {
  await page.goto("/dilemme");
  await page.getByRole("slider").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/dilemme$/);
  await expect(page.getByRole("slider")).toHaveValue("1");
});

test("chaque scène est décrite pour les lecteurs d'écran", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("main .sr-only", { hasText: "Illustration" }),
  ).toContainText("150 points, un par citoyen tiré au sort");
  await page.goto("/soutenir");
  await expect(
    page.locator("main .sr-only", { hasText: "Illustration" }),
  ).toContainText("les deux tiers sont pleins");
});

test("balayer le texte vers la gauche passe à l'étape suivante", async ({
  page,
  browserName,
}) => {
  test.skip(!test.info().project.use.hasTouch, "écran tactile seulement");
  // WebKit ne permet pas de fabriquer un Touch depuis la page : geste testé sur Chromium.
  test.skip(browserName === "webkit", "Touch non constructible dans WebKit");
  await page.goto("/hasard");
  await page.locator(".panel").evaluate((panel) => {
    const point = (x: number) =>
      new Touch({ identifier: 1, target: panel, clientX: x, clientY: 600 });
    panel.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [point(300)],
        changedTouches: [point(300)],
        bubbles: true,
      }),
    );
    panel.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [],
        changedTouches: [point(120)],
        bubbles: true,
      }),
    );
  });
  await expect(page).toHaveURL(/\/ecouter$/);
});
