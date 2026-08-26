#!/usr/bin/env node
/**
 * Copies the shared libraries from this repo into a consuming one.
 *
 * This repo is authoritative for both `libs/design-library` and
 * `libs/erp-components`. Everything in them is copied verbatim **except the
 * design library's brand layer** (§17.1 of its AGENTS.md): the primitives, the
 * two themes, the fonts and the type scale belong to whichever product the
 * copy serves, and overwriting them would repaint that product in this one's
 * colours. `erp-components` has no brand layer — it is copied whole.
 *
 * Rather than list what to copy — a list that goes stale the moment someone
 * adds a directory — this walks each library and skips four things: the brand
 * files, node_modules, and the two build outputs. Anything new is carried
 * across without anyone remembering to add it.
 *
 * Usage:
 *   node tools/sync-libs.mjs <path-to-target-repo> [--dry-run] [--lib <name>]
 *
 * Afterwards, in the target repo:
 *   npx nx run-many -t test lint typecheck
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
const LIBS = ["design-library", "erp-components"];
const libRoot = (name) => resolve(HERE, "..", "libs", name);

/**
 * Never copied, and only present in the design library. Each copy keeps its
 * own values — this is the entire reason the two trees are allowed to differ.
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

const walk = (dir, base) => {
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

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const libFlag = args.indexOf("--lib");
const only = libFlag === -1 ? undefined : args[libFlag + 1];
const targetArg = args.find(
  (value, index) => !value.startsWith("--") && args[index - 1] !== "--lib",
);

if (targetArg === undefined) {
  console.error(
    "usage: node tools/sync-libs.mjs <target-repo> [--dry-run] [--lib <name>]",
  );
  process.exit(1);
}

const chosen = only === undefined ? LIBS : LIBS.filter((lib) => lib === only);
if (chosen.length === 0) {
  console.error(`Unknown library "${only}". Known: ${LIBS.join(", ")}`);
  process.exit(1);
}

let failed = false;

for (const lib of chosen) {
  const source = libRoot(lib);
  const target = join(resolve(targetArg), "libs", lib);

  if (!existsSync(target)) {
    // Not an error: a consumer may legitimately take one library and not the
    // other. Say so and move on.
    console.log(`${lib} -> not present in the target, skipped`);
    continue;
  }

  const files = walk(source, source);
  let copied = 0;
  let unchanged = 0;
  let brandFiles = 0;

  for (const file of files) {
    if (lib === "design-library" && BRAND.has(file)) {
      brandFiles += 1;
      continue;
    }

    const from = join(source, file);
    const to = join(target, file);
    const contents = readFileSync(from);

    if (existsSync(to) && readFileSync(to).equals(contents)) {
      unchanged += 1;
      continue;
    }

    copied += 1;
    if (dryRun) {
      console.log(`  would copy  ${file}`);
      continue;
    }
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, contents);
  }

  // Present in the target but not here. Reported, never removed: a stray file
  // is worth a human look, and a sync script should not be able to delete work.
  const orphans = walk(target, target).filter(
    (file) => !BRAND.has(file) && !files.includes(file),
  );

  console.log(`${dryRun ? "[dry run] " : ""}${lib} -> ${toPosix(target)}`);
  console.log(
    `  ${copied} copied, ${unchanged} already current` +
      (brandFiles > 0 ? `, ${brandFiles} brand files left alone` : ""),
  );
  if (orphans.length > 0) {
    failed = true;
    console.log(`  ${orphans.length} file(s) here only in the target:`);
    for (const orphan of orphans) console.log(`    ${orphan}`);
  }
}

if (failed) {
  console.log("");
  console.log(
    "Orphans were reported. Nothing was deleted — check them by hand.",
  );
}
