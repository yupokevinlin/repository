#!/usr/bin/env node
/**
 * Runs the visual-regression suite for whichever library it is invoked in.
 *
 * `test-storybook` needs a Storybook to talk to and does not start one. The
 * usual recipe reaches for concurrently, wait-on and http-server to fill that
 * gap; this does the same job with node's own http module, so the check has no
 * dependencies beyond the runner itself and behaves the same on Windows as it
 * does in CI.
 *
 * Run from a library directory (the nx target sets `cwd`):
 *
 *   node ../../tools/visual-test.mjs [-- <test-storybook args>]
 *
 * Anything after `--` is passed through, which is how baselines get updated:
 *
 *   npm run test:visual:update
 */
import { spawn } from "node:child_process";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const STATIC_DIR = resolve(process.cwd(), "storybook-static");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

if (!existsSync(STATIC_DIR)) {
  console.error(
    `No storybook-static in ${process.cwd()}.\n` +
      `The nx target builds it first; if you are running this by hand, run\n` +
      `  npx nx run <library>:build-storybook\n`,
  );
  process.exit(1);
}

/**
 * A library with no stories yet is not a failure — erp-components is
 * scaffolded and empty. The runner has no flag for this that it will accept,
 * and it is a clearer thing to say out loud than to encode in a CLI switch:
 * if the build has nothing to photograph, there is nothing to check.
 */
const indexFile = join(STATIC_DIR, "index.json");
if (existsSync(indexFile)) {
  const index = JSON.parse(readFileSync(indexFile, "utf8"));
  const stories = Object.values(index.entries ?? {}).filter(
    (entry) => entry.type === "story",
  );
  if (stories.length === 0) {
    console.log("No stories in this library yet — nothing to photograph.");
    process.exit(0);
  }
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const requested = decodeURIComponent(url.pathname);
  let file = join(STATIC_DIR, requested === "/" ? "/index.html" : requested);

  // Anything outside the build directory is not ours to serve.
  if (!file.startsWith(STATIC_DIR)) {
    response.writeHead(403).end();
    return;
  }

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, "index.html");
  }

  if (!existsSync(file)) {
    response.writeHead(404).end();
    return;
  }

  response.writeHead(200, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    // The suite is comparing pictures; a cached one from a previous build is
    // exactly the wrong answer.
    "Cache-Control": "no-store",
  });
  createReadStream(file).pipe(response);
});

const stop = () =>
  new Promise((done) => {
    server.close(() => done(undefined));
  });

// Port 0 lets the OS pick a free one, so two libraries can be tested at once
// and nothing collides with a Storybook someone left running.
server.listen(0, "127.0.0.1", () => {
  const address = server.address();
  const port =
    typeof address === "object" && address !== null ? address.port : 0;
  const url = `http://127.0.0.1:${String(port)}`;

  const passthrough = process.argv.slice(2);
  const runner = spawn(
    "npx",
    ["test-storybook", "--url", url, "--maxWorkers", "2", ...passthrough],
    { stdio: "inherit", shell: process.platform === "win32" },
  );

  runner.on("exit", (code) => {
    void stop().then(() => {
      process.exit(code ?? 1);
    });
  });

  runner.on("error", (error) => {
    console.error(error);
    void stop().then(() => {
      process.exit(1);
    });
  });
});
