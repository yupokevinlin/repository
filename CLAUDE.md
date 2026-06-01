<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Design Library (`libs/design-library`)

### Tailwind CSS (v4)
- Theme is configured via `@theme {}` in CSS — there is **no** `tailwind.config.js`
- Custom color and font-size names are defined in `src/tailwind/theme/` (TypeScript) and must match the `--color-*` / `--font-size-*` CSS variables in `src/styles.css`

### tailwind-merge v3 — `extendTailwindMerge` theme key names
When extending `tailwindMerge` with custom theme values, use the correct `DefaultThemeGroupIds` keys:

| What you're adding | Correct key | Wrong keys (TS2561) |
|--------------------|-------------|---------------------|
| Custom colors      | `color`     | `colors`, `colour`  |
| Custom font sizes  | `text`      | `fontSize`, `font-size` |

The `font-size` class group internally references `{theme: 'text'}` — so custom font-size scale values must be registered under `text`, not `font-size` or `fontSize`.

```ts
// ✅ Correct
extendTailwindMerge({ extend: { theme: { color: [...], text: [...] } } });

// ❌ Wrong — TS2561
extendTailwindMerge({ extend: { theme: { colors: [...], fontSize: [...] } } });
```

### `cn()` utility
- Location: `src/tailwind/tailwindMerge/tailwindMerge.ts`
- Always use `cn()` (not raw string concatenation) for Tailwind class composition in all components
- `cn()` = `clsx` (conditional composition) + theme-aware `tailwind-merge` (conflict resolution)

```ts
cn('text-sm', 'text-bold');
```
