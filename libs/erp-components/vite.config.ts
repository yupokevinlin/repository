import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { defineConfig } from "vitest/config";

/**
 * Vitest only — the same arrangement as the design library, and for the same
 * reason: Storybook's react-vite framework merges this file into its own
 * config, so **do not add @vitejs/plugin-react here**. `.storybook/main.ts`
 * already supplies it, and two copies inject the Fast Refresh runtime twice:
 *
 *   SyntaxError: Identifier 'RefreshRuntime' has already been declared
 *
 * That breaks the Storybook dev server only. `build-storybook` does not inject
 * the refresh runtime, so it passes either way — the failure is invisible to
 * every check except opening the browser.
 */
export default defineConfig({
  root: __dirname,
  plugins: [nxViteTsPaths()],
  test: {
    name: "erp-components",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/testing/setupTests.ts"],
    include: ["src/**/*.spec.{ts,tsx}"],
    /**
     * The package is scaffolded and empty. Without this, `nx run-many -t test`
     * fails across the whole workspace because vitest treats "no test files"
     * as an error. It stops mattering the moment 7.1 lands, and it never hides
     * a failing test — only the absence of any.
     */
    passWithNoTests: true,
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
