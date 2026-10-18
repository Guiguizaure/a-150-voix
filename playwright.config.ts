import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout sur l'export statique (pnpm build d'abord), servi au plus près de
// Cloudflare Pages (e2e/static-server.mjs). Chromium et WebKit (proche de Safari), chacun en
// mobile (390 px, tactile) et en desktop (1440 px).
const PORT = 4331;

const mobile = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};
const desktop = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
  },
  projects: [
    {
      name: "chromium-mobile",
      use: { ...devices["Desktop Chrome"], ...mobile },
    },
    { name: "webkit-mobile", use: { ...devices["Desktop Safari"], ...mobile } },
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], ...desktop },
    },
    {
      name: "webkit-desktop",
      use: { ...devices["Desktop Safari"], ...desktop },
    },
  ],
  webServer: {
    command: `PORT=${PORT} node e2e/static-server.mjs`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
