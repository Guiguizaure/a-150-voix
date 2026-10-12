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

test.describe("calques", () => {
  test("le hasard : le compteur monte, puis montre les 150 tirés au sort", async ({
    page,
  }) => {
    await page.goto("/hasard");
    const compteur = page.locator(".counter");
    await expect(compteur).toContainText("numéros de téléphone composés");
    await expect(compteur).toContainText(
      "citoyennes et citoyens tirés au sort",
      {
        timeout: 8000,
      },
    );
    await expect(page.locator(".counter-n")).toHaveText("150");
    await page.getByRole("button", { name: "Rejouer le tirage" }).click();
    await expect(compteur).toContainText("numéros de téléphone composés");
  });

  test("mouvement réduit : le tirage s'affiche aussitôt", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/hasard");
    await expect(page.locator(".counter-n")).toHaveText("150");
  });

  test("écouter et délibérer : la légende de la scène", async ({ page }) => {
    await page.goto("/ecouter");
    await expect(page.locator(".cap")).toContainText(
      "Climat · Valérie Masson-Delmotte",
    );
    await page.goto("/deliberer");
    await expect(page.locator(".cap")).toContainText("En petits groupes");
  });
});

test.describe("le dilemme", () => {
  test("le curseur au clavier fait pencher le verdict, avec la même phrase des deux côtés", async ({
    page,
  }) => {
    await page.goto("/dilemme");
    const verdict = page.locator(".verdict p");
    await expect(verdict).toContainText("Les deux comptent.");
    const curseur = page.getByRole("slider", {
      name: "Position du curseur entre l’option A et l’option B",
    });
    await curseur.focus();
    await page.keyboard.press("End");
    await expect(verdict).toContainText(
      "Vous penchez nettement vers « Des voitures françaises, plus coûteuses ».",
    );
    await expect(verdict).toContainText(
      "Vous gagnez des emplois industriels en France.",
    );
    await page.keyboard.press("Home");
    await expect(verdict).toContainText(
      "Vous penchez nettement vers « Des voitures importées, moins chères ».",
    );
    await expect(verdict).toContainText(
      "Vous acceptez moins d’emplois industriels en France.",
    );
  });

  test("changer d'exemple remet le nœud au centre", async ({ page }) => {
    await page.goto("/dilemme");
    await page.getByRole("slider").focus();
    await page.keyboard.press("End");
    await page.getByRole("button", { name: "Déplacements" }).click();
    await expect(
      page.getByRole("button", { name: "Déplacements" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".pole-l")).toContainText(
      "Préserver la liberté de se déplacer",
    );
    await expect(page.locator(".verdict p")).toContainText(
      "Les deux comptent.",
    );
    await expect(page.getByRole("slider")).toHaveValue("0");
  });

  test("on fait glisser le nœud sur la scène", async ({ page }) => {
    await page.goto("/dilemme");
    const scene = page.locator("canvas.scene");
    const box = (await scene.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5, {
      steps: 5,
    });
    await page.mouse.up();
    await expect(page.locator(".verdict p")).toContainText(
      "Vous penchez nettement vers",
    );
    await expect(page.locator(".verdict p")).toContainText(
      "Des voitures importées",
    );
  });
});
