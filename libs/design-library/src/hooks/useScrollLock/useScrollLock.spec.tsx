import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resetScrollLockForTests, useScrollLock } from "./useScrollLock";

const Harness = ({ active }: { active: boolean }) => {
  useScrollLock(active);
  return null;
};

/**
 * jsdom reports the same width for both, so there is no scrollbar unless one
 * is faked. `innerWidth` is writable; `clientWidth` has to be stubbed.
 */
const withScrollbar = (width: number): void => {
  Object.defineProperty(document.documentElement, "clientWidth", {
    configurable: true,
    value: window.innerWidth - width,
  });
};

describe("useScrollLock", () => {
  beforeEach(() => {
    resetScrollLockForTests();
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    window.innerWidth = 1000;
    withScrollbar(0);
  });

  afterEach(() => {
    resetScrollLockForTests();
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  it("locks the body while active", () => {
    render(<Harness active />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("does nothing while inactive", () => {
    render(<Harness active={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("unlocks when it closes", () => {
    const { rerender } = render(<Harness active />);
    rerender(<Harness active={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("unlocks when it unmounts", () => {
    const { unmount } = render(<Harness active />);
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("restores whatever overflow the page already had", () => {
    document.body.style.overflow = "auto";
    const { unmount } = render(<Harness active />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  describe("nested locks", () => {
    it("stays locked while a second overlay is still open", () => {
      const { unmount } = render(<Harness active />);
      render(<Harness active />);
      unmount();
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("unlocks only once the last one closes", () => {
      const first = render(<Harness active />);
      const second = render(<Harness active />);
      first.unmount();
      second.unmount();
      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("scrollbar compensation", () => {
    it("replaces the scrollbar's width with padding, so the page does not jump", () => {
      withScrollbar(15);
      render(<Harness active />);
      expect(document.body.style.paddingRight).toBe("15px");
    });

    it("adds to padding the page already had rather than replacing it", () => {
      document.body.style.paddingRight = "8px";
      withScrollbar(15);
      render(<Harness active />);
      expect(document.body.style.paddingRight).toBe("23px");
    });

    it("restores the original padding on unlock", () => {
      document.body.style.paddingRight = "8px";
      withScrollbar(15);
      const { unmount } = render(<Harness active />);
      unmount();
      expect(document.body.style.paddingRight).toBe("8px");
    });

    it("leaves padding alone when there is no scrollbar", () => {
      // Set here rather than relying on the reset, so this does not depend on
      // what another test left on the body.
      document.body.style.paddingRight = "8px";
      withScrollbar(0);
      render(<Harness active />);
      expect(document.body.style.paddingRight).toBe("8px");
    });
  });

  it("survives being toggled repeatedly", () => {
    const { rerender } = render(<Harness active />);
    rerender(<Harness active={false} />);
    rerender(<Harness active />);
    rerender(<Harness active={false} />);
    expect(document.body.style.overflow).toBe("");
  });
});
