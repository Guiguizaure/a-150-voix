import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@content": path.resolve(import.meta.dirname, "content"),
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: [
      "src/**/*.test.ts",
      "content/**/*.test.ts",
      "scripts/**/*.test.ts",
    ],
  },
});
