#!/usr/bin/env node
/**
 * Copies libs/design-library from this repo into a consuming one.
 *
 * This repo is authoritative for the design library. Everything in it is
 * copied verbatim **except the brand layer** (§17.1 of the library's
 * AGENTS.md): the primitives, the two themes, the fonts and the type scale
 * belong to whichever product the copy serves, and overwriting them would
 * repaint that product in this one's colours.
 *
 * Rather than list what to copy — a list that goes stale the moment someone
 * adds a directory — this walks the whole library and skips four things: the
 * brand files, node_modules, and the two build outputs. Anything new is
 * carried across without anyone remembering to add it.
 *
 * Usage:
 *   node tools/sync-design-library.mjs <path-to-target-repo> [--dry-run]
 *
 * Afterwards, in the target repo:
 *   npx nx run design-library:test
 *   npx nx run design-library:lint
 *   npx nx run design-library:typecheck
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, "..", "libs", "design-library");

/**
 * Never copied. Each copy of the library keeps its own values, and this is the
 * entire reason the two trees are allowed to differ at all.
 */
const BRAND = new Set([
  "src/css/primitives.css",
  "src/css/themes/light.css",
  "src/css/themes/dark.css",
  "src/css/fonts.css",
  "src/css/typography.css",
  "src/css/elevation.css",
]);

/** Build output and installed packages — not source, never copied. */
const IGNORED_DIRS = new Set(["node_modules", "dist", "out-tsc", ".nx"]);

const toPosix = (value) => value.split("\\").join("/");

const walk = (dir, base = SOURCE) => {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      found.push(...walk(full, base));
      continue;
    }
    found.push(toPosix(relative(base, full)));
  }
  return found;
};

const [targetArg, ...flags] = process.argv.slice(2);
const dryRun = flags.includes("--dry-run");

if (targetArg === undefined) {
  console.error(
    "usage: node tools/sync-design-library.mjs <target-repo> [--dry-run]",
  );
  process.exit(1);
}

const target = join(resolve(targetArg), "libs", "design-library");
if (!existsSync(target)) {
  console.error(`No design library at ${target}`);
  process.exit(1);
}

const files = walk(SOURCE);
let copied = 0;
let unchanged = 0;
const skipped = [];

for (const file of files) {
  if (BRAND.has(file)) {
    skipped.push(file);
    continue;
  }

  const from = join(SOURCE, file);
  const to = join(target, file);

  const source = readFileSync(from);
  if (existsSync(to) && readFileSync(to).equals(source)) {
    unchanged += 1;
    continue;
  }

  copied += 1;
  if (dryRun) {
    console.log(`  would copy  ${file}`);
    continue;
  }
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, source);
}

// Anything in the target that is not in the source and is not a brand file has
// been deleted here. Reporting rather than removing: a stray file is worth a
// human look, and this script should not be able to delete work.
const orphans = walk(target, target).filter(
  (file) => !BRAND.has(file) && !files.includes(file),
);

console.log(
  `${dryRun ? "[dry run] " : ""}design library -> ${toPosix(target)}`,
);
console.log(
  `  ${copied} copied, ${unchanged} already current, ${skipped.length} brand files left alone`,
);
if (orphans.length > 0) {
  console.log(
    `  ${orphans.length} file(s) present in the target but not here — not touched:`,
  );
  for (const orphan of orphans) console.log(`    ${orphan}`);
}
