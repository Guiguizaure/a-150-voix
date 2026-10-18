import { attendreHydratation, expect, test } from "./fixtures";

test("les flèches du clavier changent d'étape et donnent le focus au titre", async ({
  page,
}) => {
  await page.goto("/hasard");
  await attendreHydratation(page);
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
  await attendreHydratation(page);
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

test("au changement d'étape, la page remonte et le titre est visible", async ({
  page,
}) => {
  await page.goto("/hasard");
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    document.querySelector(".panel")?.scrollTo(0, 10000);
  });
  const nav = page.getByRole("navigation", { name: "Étapes du guide" });
  await nav.getByRole("link", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/\/ecouter$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport({
    ratio: 1,
  });
});

test("s'accorder : les boutons ne bougent pas quand leur libellé change", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/accord");
  const son = page.getByRole("button", { name: "Écouter l’accord" });
  const avant = await son.boundingBox();
  await page
    .getByRole("slider", { name: "Du désaccord à l’accord" })
    .fill("80");
  await expect(page.getByRole("button", { name: "Désaccorder" })).toBeVisible();
  expect(await son.boundingBox()).toEqual(avant);
});
