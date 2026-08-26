import { join } from "node:path";

import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

/**
 * Visual regression, one screenshot per story per theme.
 *
 * A component proven in one theme is not proven (the library's AGENTS.md says
 * so about galleries, and it is just as true here), so every story is captured
 * in light and in dark. Manual browser passes caught nine defects during the
 * build that the suite, lint and the type checker all passed — collapsed
 * spacing, an invisible tick, a connector drawn in a near-white token. None of
 * those are expressible as an assertion about the DOM. This is the check that
 * sees them.
 *
 * Baselines live in `visual/baselines/` and are **not** shared between repos:
 * the brand layer differs, so the same component is legitimately a different
 * picture in each copy. The sync tool skips that directory for the same reason
 * it skips the theme CSS.
 */

/** Both, always. */
const THEMES = ["theme-light", "theme-dark"] as const;

/**
 * Everything that would make the same component photograph differently twice.
 *
 * Without this the suite reports failures that are really just a caret
 * blinking or a transition caught mid-flight, and a check that cries wolf gets
 * turned off within a week.
 */
const FREEZE = `
  *, *::before, *::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    caret-color: transparent !important;
  }
  html { scrollbar-width: none; }
  ::-webkit-scrollbar { display: none; }
`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // Docs pages render every gallery at once — enormous, and already covered
    // story by story below.
    if (storyContext.parameters.docsOnly === true) {
      return;
    }

    // An escape hatch for a story that genuinely cannot be stable — one
    // showing a live clock, say. Nothing uses it yet, and adding it to a story
    // should need a reason in the commit.
    if (
      (storyContext.parameters.visual as { skip?: boolean } | undefined)
        ?.skip === true
    ) {
      return;
    }

    const origin = new URL(page.url()).origin;

    // Fixed, so a shot never depends on what the runner happened to set.
    await page.setViewportSize({ width: 1280, height: 720 });

    for (const theme of THEMES) {
      await page.goto(
        `${origin}/iframe.html?id=${context.id}&viewMode=story&globals=theme:${theme}`,
        { waitUntil: "load" },
      );

      await page.waitForSelector("#storybook-root", { state: "attached" });

      // The decorator puts the theme class on <html> from an effect, which
      // runs a tick after the first paint. Screenshotting before it lands
      // captures the *previous* theme — which is exactly what happened the
      // first time this ran: half the dark baselines were light, and they
      // disagreed with themselves on the very next run.
      await page.waitForFunction(
        (applied) => document.documentElement.classList.contains(applied),
        theme,
      );

      await page.addStyleTag({ content: FREEZE });

      // Web fonts land after first paint, and a screenshot taken before they
      // do is a screenshot of a fallback face.
      await page.evaluate(() => document.fonts.ready);

      // One frame for the freeze above to take effect.
      await page.evaluate(
        () =>
          new Promise((resolve) => requestAnimationFrame(() => resolve(null))),
      );

      const image = await page.screenshot({
        fullPage: true,
        animations: "disabled",
      });

      expect(image).toMatchImageSnapshot({
        customSnapshotsDir: join(process.cwd(), "visual", "baselines"),
        customDiffDir: join(process.cwd(), "visual", "diffs"),
        customSnapshotIdentifier: `${context.id}--${theme}`,
        // A hair of tolerance for antialiasing, which differs between a local
        // run and CI on the same commit. Tight enough that a one-token colour
        // change still fails.
        failureThreshold: 0.01,
        failureThresholdType: "percent",
      });
    }
  },
};

export default config;
