import { ETAPES } from "../content/etapes";
import {
  expect,
  expectNoAxeViolations,
  test,
  waitForAnimations,
} from "./fixtures";

const ADRESSES = [
  "/",
  ...ETAPES.map((e) => `/${e.slug}`),
  "/mentions-legales",
  "/sources",
];

for (const palette of ["nuit", "papier"] as const) {
  test.describe(`palette ${palette === "nuit" ? "Nuit" : "Papier"}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((p) => {
        try {
          localStorage.setItem("a150-palette", p);
        } catch {}
      }, palette);
    });

    for (const adresse of ADRESSES) {
      test(`${adresse} : un titre, sans violation axe`, async ({ page }) => {
        await page.goto(adresse);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      });
    }
  });
}

test("la mention d'indépendance est en tête et en pied de page", async ({
  page,
}) => {
  await page.goto("/dilemme");
  const tete = page.locator(".indep:visible, .badge:visible");
  await expect(tete).toHaveCount(1);
  await expect(tete).toContainText(
    "Projet indépendant, sans lien avec les organisateurs d’Un commun accord",
  );
  await expect(page.getByRole("contentinfo")).toContainText(
    "Projet indépendant, sans lien avec les organisateurs d’Un commun accord",
  );
  await expect(page.getByRole("contentinfo")).toContainText(
    "Conçu par Guillaume Salle",
  );
});

test("Suivant et Précédent enchaînent les étapes", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Étapes du guide" });
  await nav.getByRole("link", { name: /^Commencer/ }).click();
  await expect(page).toHaveURL(/\/hasard$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Pourquoi tirer au sort",
  );
  await nav.getByRole("link", { name: /^Suivant/ }).click();
  await expect(page).toHaveURL(/\/ecouter$/);
  await nav.getByRole("link", { name: /^Précédent/ }).click();
  await expect(page).toHaveURL(/\/hasard$/);
});

test("le Sommaire s'ouvre en dialogue et mène à l'étape choisie", async ({
  page,
}) => {
  await page.goto("/hasard");
  await page.getByRole("button", { name: /^Sommaire/ }).click();
  const dialogue = page.getByRole("dialog", { name: "Sommaire" });
  await expect(dialogue).toBeVisible();
  await expect(
    dialogue.getByRole("link", { name: /Le hasard/ }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(dialogue).toBeHidden();
  await page.getByRole("button", { name: /^Sommaire/ }).click();
  await dialogue.getByRole("link", { name: /Soutenir/ }).click();
  await expect(page).toHaveURL(/\/soutenir$/);
  await expect(dialogue).toBeHidden();
});

test.describe("palette", () => {
  test("Nuit par défaut, même si le système est en clair ; Papier au clic, gardée au rechargement", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const bouton = page.getByRole("button", { name: "Palette claire" });
    const fond = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await expect(bouton).toHaveAttribute("aria-pressed", "false");
    await expect.poll(fond).toBe("rgb(14, 16, 20)");

    await bouton.click();
    await expect(bouton).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute(
      "data-palette",
      "papier",
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute(
      "data-palette",
      "papier",
    );
    await expect.poll(fond).toBe("rgb(236, 229, 213)");
  });
});

test("les commandes font au moins 44 px", async ({ page }) => {
  for (const adresse of [
    "/",
    "/dilemme",
    "/suivre",
    "/democratie",
    "/soutenir",
  ]) {
    await page.goto(adresse);
    await waitForAnimations(page);
    const petites = await page
      .locator(
        ".topbar a, .topbar button, .nav a, .nav button, .chip, .btn, .toc a, .cta, .links a, .foot-links a, .ov button",
      )
      .evaluateAll((els) =>
        els
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { t: el.textContent?.trim() ?? "", w: r.width, h: r.height };
          })
          .filter((b) => b.w > 0 && (b.w < 44 || b.h < 44)),
      );
    expect(petites, adresse).toEqual([]);
  }
});
