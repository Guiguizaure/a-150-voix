import {
  acceptDocument404,
  expect,
  expectNoAxeViolations,
  test,
} from "./fixtures";

test("l'accueil est servi en français, sans violation axe", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoAxeViolations(page);
});

test("une adresse inconnue répond 404", async ({ page, consoleErrors }) => {
  const response = await page.goto("/cette-page-n-existe-pas");
  acceptDocument404(consoleErrors);
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});
