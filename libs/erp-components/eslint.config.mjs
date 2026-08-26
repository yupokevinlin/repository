// @ts-check
import nx from "@nx/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

import baseConfig from "../../eslint.config.mjs";

/**
 * The same rules the design library holds itself to. Composites are built from
 * its primitives and are held to the same standard — a `Table` that gets its
 * header semantics wrong is worse than a `Button` that does, not better.
 *
 * The library's one file-scoped exception (the ARIA window splitter in
 * `Resizable`) is deliberately not carried over: nothing here implements that
 * pattern, and an exception copied forward without its reason is how a
 * codebase ends up with rules nobody can account for.
 */
export default tseslint.config(
  ...baseConfig,

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
    },
  },
);
