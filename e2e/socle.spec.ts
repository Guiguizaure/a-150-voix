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

test("la préversion est en noindex partout", async ({ page, request }) => {
  const response = await page.goto("/");
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toMatch(/User-Agent: \*\nDisallow: \/\n/);
});
