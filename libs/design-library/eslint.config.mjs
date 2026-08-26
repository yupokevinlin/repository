// @ts-check
import nx from "@nx/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

import baseConfig from "../../eslint.config.mjs";

export default tseslint.config(
  ...baseConfig,

  // ── React ─────────────────────────────────────────────────────────────────
  {
    files: ["**/*.tsx", "**/*.jsx"],
    extends: [...nx.configs["flat/react"]],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
      "react/prop-types": "off", // TypeScript handles this

      // Hooks
      ...reactHooks.configs.recommended.rules,

      // Accessibility
      ...jsxA11y.configs.recommended.rules,

      /**
       * A separator is non-interactive only while it is static. One that is
       * focusable and carries aria-valuenow is the ARIA window splitter — a
       * widget by definition, and what Resizable is built on. The rule ships a
       * roles allowlist for exactly this case.
       */
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        {
          tags: [],
          roles: ["tabpanel", "separator"],
          allowExpressionValues: true,
        },
      ],
    },
  },

  // ── The window splitter ───────────────────────────────────────────────────
  {
    /**
     * The other half of the same case. This rule classifies every separator as
     * non-interactive and, unlike the one above, has no per-role lever — so it
     * is turned off for the one file that implements the pattern rather than
     * weakened everywhere.
     *
     * Scoped here rather than suppressed inline because the pre-commit hook
     * runs eslint from the repo root, where these rules are not enabled: it
     * therefore reads any inline directive in this file as unused and deletes
     * it, and the next full lint fails.
     */
    files: ["src/components/Surfaces/Resizable/Resizable.tsx"],
    rules: {
      "jsx-a11y/no-noninteractive-element-interactions": "off",
    },
  },
);
