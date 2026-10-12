import { expect, test } from "./fixtures";

/** Vrai si le canvas de la scène contient au moins un pixel dessiné. */
async function dessine(
  page: import("@playwright/test").Page,
): Promise<boolean> {
  return page.locator("canvas.scene").evaluate((cv: HTMLCanvasElement) => {
    const ctx = cv.getContext("2d");
    if (!ctx || !cv.width || !cv.height) return false;
    const { data } = ctx.getImageData(0, 0, cv.width, cv.height);
    for (let i = 3; i < data.length; i += 4) if (data[i]! > 0) return true;
    return false;
  });
}

test("la scène dessine les 150 points dès l'accueil", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("canvas.scene")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect.poll(() => dessine(page)).toBe(true);
});

test("le canvas n'est jamais rechargé d'une étape à l'autre", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("canvas.scene").evaluate((cv) => {
    (cv as HTMLCanvasElement & { marque?: string }).marque = "même";
  });
  const nav = page.getByRole("navigation", { name: "Étapes du guide" });
  await nav.getByRole("link", { name: /^Commencer/ }).click();
  await expect(page).toHaveURL(/\/hasard$/);
  await nav.getByRole("link", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/\/ecouter$/);
  const marque = await page
    .locator("canvas.scene")
    .evaluate((cv) => (cv as HTMLCanvasElement & { marque?: string }).marque);
  expect(marque).toBe("même");
  await expect(page.locator("canvas.scene")).toHaveAttribute(
    "data-scene",
    "ecouter",
  );
});

test("une arrivée directe sur une étape affiche sa scène", async ({ page }) => {
  await page.goto("/soutenir");
  await expect(page.locator("canvas.scene")).toHaveAttribute(
    "data-scene",
    "soutenir",
  );
  await expect.poll(() => dessine(page)).toBe(true);
});
