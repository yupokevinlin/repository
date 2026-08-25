import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  plugins: [react(), nxViteTsPaths()],
  test: {
    name: "design-library",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/testing/setupTests.ts"],
    include: ["src/**/*.spec.{ts,tsx}"],
    css: false,
    reporters: ["default"],
    coverage: {
      reportsDirectory: "./coverage",
      provider: "v8",
      include: ["src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
      exclude: ["src/**/storybook/**", "src/**/index.ts"],
    },
  },
});
