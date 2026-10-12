// Parcours complet : toutes les adresses, clavier, mouvement réduit, absence de défilement
// horizontal, et captures de chaque page (jointes au rapport, à relire à l'œil).
import { ETAPES } from "../content/etapes";
import {
  expect,
  expectNoAxeViolations,
  test,
  waitForAnimations,
} from "./fixtures";

const PAGES = [
  "/",
  ...ETAPES.map((e) => `/${e.slug}`),
  "/mentions-legales",
  "/sources",
];

test("chaque page : un titre de document distinct, en français, un seul h1", async ({
  page,
}) => {
  const titres = new Set<string>();
  for (const adresse of PAGES) {
    await page.goto(adresse);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    titres.add(await page.title());
  }
  expect(titres.size).toBe(PAGES.length);
});

test("les liens sortants s'ouvrent dans un nouvel onglet, annoncé", async ({
  page,
}) => {
  for (const adresse of ["/", "/suivre", "/soutenir", "/mentions-legales"]) {
    await page.goto(adresse);
    const sortants = page.locator('a[href^="http"]');
    const n = await sortants.count();
    expect(n, adresse).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const lien = sortants.nth(i);
      await expect(lien).toHaveAttribute("target", "_blank");
      await expect(lien).toHaveAttribute("rel", /noopener/);
      await expect(lien).toContainText("nouvel onglet");
    }
  }
});

test.describe("clavier", () => {
  test("le lien d'évitement mène au contenu", async ({ page, browserName }) => {
    // WebKit ne met pas les liens dans l'ordre de tabulation par défaut (réglage du
    // système) : parcours au clavier vérifié sur Chromium.
    test.skip(
      browserName === "webkit",
      "tabulation des liens désactivée dans WebKit",
    );
    await page.goto("/hasard");
    await page.keyboard.press("Tab");
    const evitement = page.getByRole("link", { name: "Aller au contenu" });
    await expect(evitement).toBeFocused();
    await expect(evitement).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("#contenu")).toBeFocused();
  });

  test("le Sommaire s'ouvre et se parcourt au clavier", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "tabulation des liens désactivée dans WebKit",
    );
    await page.goto("/hasard");
    await page.getByRole("button", { name: /^Sommaire/ }).focus();
    await page.keyboard.press("Enter");
    const dialogue = page.getByRole("dialog", { name: "Sommaire" });
    await expect(dialogue).toBeVisible();
    // Le focus entre dans le dialogue, sur le bouton de fermeture, puis la première étape.
    await expect(
      dialogue.getByRole("button", { name: "Fermer le sommaire" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialogue.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/ecouter$/);
    await expect(dialogue).toBeHidden();
  });

  test("tout le guide se parcourt aux flèches, de l'accueil à Soutenir", async ({
    page,
  }) => {
    await page.goto("/");
    for (const e of ETAPES) {
      await page.keyboard.press("ArrowRight");
      await expect(page).toHaveURL(new RegExp(`/${e.slug}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    }
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/soutenir$/);
  });
});

test.describe("mouvement réduit", () => {
  test.use({ reducedMotion: "reduce" });

  test("aucune animation de texte, chaque scène dessinée, sans violation axe", async ({
    page,
  }) => {
    for (const adresse of PAGES.slice(0, 10)) {
      await page.goto(adresse);
      const animations = await page.evaluate(
        () =>
          document.getAnimations().filter((a) => a.playState === "running")
            .length,
      );
      expect(animations, adresse).toBe(0);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    await expectNoAxeViolations(page);
  });
});

test.describe("petits écrans", () => {
  for (const largeur of [320, 390]) {
    test(`aucun défilement horizontal à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 700 });
      for (const adresse of PAGES) {
        await page.goto(adresse);
        await waitForAnimations(page);
        const deborde = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(deborde, adresse).toBe(false);
      }
    });
  }
});

test.describe("captures", () => {
  test("chaque page, en Nuit puis en Papier (jointes au rapport)", async ({
    page,
    browserName,
  }, testInfo) => {
    test.skip(
      browserName === "webkit",
      "captures faites une fois, sur Chromium",
    );
    test.setTimeout(120_000);
    for (const palette of ["nuit", "papier"]) {
      for (const adresse of PAGES) {
        await page.goto(adresse);
        await page.evaluate((p) => {
          localStorage.setItem("a150-palette", p);
          document.documentElement.dataset.palette = p;
          window.dispatchEvent(new Event("a150:palette"));
        }, palette);
        await waitForAnimations(page);
        await page.waitForTimeout(1500);
        const nom = `${adresse === "/" ? "accueil" : adresse.slice(1)}-${palette}`;
        const chemin = testInfo.outputPath(`${nom}.png`);
        await page.screenshot({ path: chemin, fullPage: true });
        await testInfo.attach(nom, { path: chemin, contentType: "image/png" });
      }
    }
  });
});
