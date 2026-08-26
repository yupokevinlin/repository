// @ts-check
import nx from "@nx/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ── Nx module-boundary enforcement (applies workspace-wide) ──────────────
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],

  // ── Files to ignore globally ─────────────────────────────────────────────
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.nx/**",
      "**/coverage/**",
      "**/out-tsc/**",
      "**/storybook-static/**",
    ],
  },

  // ── jsx-a11y is registered here as well as in the design library's own
  //    config. Not to enforce it workspace-wide — the rules stay off — but so
  //    that eslint invoked from the repo root (which is what the pre-commit
  //    hook does) can resolve rule names the library legitimately suppresses.
  //    Without it, a disable comment for a rule this config has never heard of
  //    is itself an error, and the hook rejects a commit that the project's
  //    own lint target passes.
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: { "jsx-a11y": jsxA11y },
  },

  // ── TypeScript — all TS/TSX files ────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        // Type-aware linting: each project supplies its own tsconfig
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── TypeScript tweaks ──────────────────────────────────────────────
      // CLAUDE.md mandates Array<T> over T[]; the default preset autofixes
      // the other way, which silently contradicts the documented convention.
      "@typescript-eslint/array-type": [
        "error",
        { default: "generic", readonly: "generic" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      // Allow `||` for boolean logic (e.g. `a || b` where both are boolean | undefined)
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        { ignoreBooleanCoercion: true },
      ],
    },
  },

  // ── Import ordering (all JS/TS files) ────────────────────────────────────
  {
    files: [
      "**/*.js",
      "**/*.jsx",
      "**/*.ts",
      "**/*.tsx",
      "**/*.mjs",
      "**/*.cjs",
    ],
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
);
