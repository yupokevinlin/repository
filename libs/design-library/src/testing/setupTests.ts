import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * jsdom does not implement `scrollIntoView` — it has no layout, so there is
 * nothing to scroll. Components that keep a highlighted row in view call it,
 * and would otherwise throw in tests for a reason that has nothing to do with
 * what is being tested. A no-op is honest here: the call is a side effect on a
 * viewport that does not exist.
 */
const elementPrototype = Element.prototype as {
  scrollIntoView?: () => void;
};
elementPrototype.scrollIntoView ??= (): void => undefined;

afterEach(() => {
  cleanup();
});
