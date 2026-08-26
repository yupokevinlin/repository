import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePosition, type UsePositionOptions } from "./usePosition";

/**
 * jsdom gives every element a zero-sized rect, so sizes are stubbed per
 * element. Anchor and floating element are told apart by their test id.
 */
const stubRects = (rects: Record<string, Partial<DOMRect>>): void => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element): DOMRect {
      const id: string = this.getAttribute("data-testid") ?? "";
      const rect = rects[id] ?? {};
      const top: number = rect.top ?? 0;
      const left: number = rect.left ?? 0;
      const width: number = rect.width ?? 0;
      const height: number = rect.height ?? 0;
      return {
        top,
        left,
        width,
        height,
        bottom: top + height,
        right: left + width,
        x: left,
        y: top,
        toJSON: () => ({}),
      };
    },
  );
};
const Harness = (options: UsePositionOptions) => {
  const { anchorRef, floatingRef } = usePosition<
    HTMLButtonElement,
    HTMLDivElement
  >(options);
  return (
    <>
      <button data-testid="anchor" ref={anchorRef}>
        {"Open"}
      </button>
      {options.open && (
        <div data-testid="floating" ref={floatingRef}>
          {"Menu"}
        </div>
      )}
    </>
  );
};

const floating = (): HTMLElement => screen.getByTestId("floating");

describe("usePosition", () => {
  beforeEach(() => {
    window.innerWidth = 1000;
    window.innerHeight = 800;
    stubRects({
      anchor: { top: 400, left: 400, width: 100, height: 40 },
      floating: { width: 200, height: 120 },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("pins the floating element to the viewport", () => {
    render(<Harness open />);
    expect(floating().style.position).toBe("fixed");
  });

  it("places it below the anchor by default", () => {
    render(<Harness open />);
    expect(floating().style.top).toBe("444px");
    expect(floating().style.left).toBe("400px");
  });

  it("exposes the side it used, so CSS can animate the right way", () => {
    render(<Harness open />);
    expect(floating().dataset.placement).toBe("bottom");
  });

  it("flips and says so when there is no room below", () => {
    stubRects({
      anchor: { top: 700, left: 400, width: 100, height: 40 },
      floating: { width: 200, height: 120 },
    });
    render(<Harness open />);
    expect(floating().dataset.placement).toBe("top");
    expect(floating().style.top).toBe("576px");
  });

  it("takes the requested placement and alignment", () => {
    render(<Harness open placement="right" alignment="center" />);
    expect(floating().style.left).toBe("504px");
    expect(floating().style.top).toBe("360px");
  });

  it("takes the requested gap", () => {
    render(<Harness open offset={12} />);
    expect(floating().style.top).toBe("452px");
  });

  it("positions before paint, not after — no visible jump from 0,0", () => {
    // useLayoutEffect has already run by the time render() returns, so a
    // position being present at all is the assertion.
    render(<Harness open />);
    expect(floating().style.top).not.toBe("");
  });

  describe("matchTriggerWidth", () => {
    it("sets the floating width to the trigger's", () => {
      render(<Harness open matchTriggerWidth />);
      expect(floating().style.width).toBe("100px");
    });

    it("leaves the width alone otherwise", () => {
      render(<Harness open />);
      expect(floating().style.width).toBe("");
    });
  });

  describe("coordinates", () => {
    it("positions against the point rather than the trigger", () => {
      render(<Harness open coordinates={{ x: 300, y: 200 }} />);
      expect(floating().style.top).toBe("204px");
      expect(floating().style.left).toBe("300px");
    });

    it("follows the point when it moves — a cursor menu reopening elsewhere", () => {
      const { rerender } = render(
        <Harness open coordinates={{ x: 300, y: 200 }} />,
      );
      expect(floating().style.left).toBe("300px");

      rerender(<Harness open coordinates={{ x: 500, y: 400 }} />);
      expect(floating().style.left).toBe("500px");
    });

    it("still flips near the bottom edge", () => {
      render(<Harness open coordinates={{ x: 300, y: 750 }} />);
      expect(floating().dataset.placement).toBe("top");
    });
  });

  it("does nothing while closed", () => {
    render(<Harness open={false} />);
    expect(screen.queryByTestId("floating")).not.toBeInTheDocument();
  });

  it("keeps up with scrolling", () => {
    render(<Harness open />);
    expect(floating().style.top).toBe("444px");

    stubRects({
      anchor: { top: 200, left: 400, width: 100, height: 40 },
      floating: { width: 200, height: 120 },
    });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(floating().style.top).toBe("244px");
  });

  it("listens for scrolls in ancestors, not only on the window", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    render(<Harness open />);
    expect(addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      true,
    );
  });

  it("keeps up with resizing", () => {
    render(<Harness open />);
    window.innerHeight = 500;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    // 500 - 440 - 4 = 56, far less than the 120 it needs, so it flips.
    expect(floating().dataset.placement).toBe("top");
  });

  it("stops listening once closed", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { rerender } = render(<Harness open />);
    rerender(<Harness open={false} />);
    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      true,
    );
    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("stops listening once unmounted", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Harness open />);
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("recomputes on demand, for content that changed size", () => {
    const Manual = () => {
      const { anchorRef, floatingRef, update } = usePosition<
        HTMLButtonElement,
        HTMLDivElement
      >({ open: true });
      return (
        <>
          <button data-testid="anchor" ref={anchorRef}>
            {"Open"}
          </button>
          <div data-testid="floating" ref={floatingRef}>
            {"Menu"}
          </div>
          <button data-testid="update" onClick={update}>
            {"Update"}
          </button>
        </>
      );
    };

    render(<Manual />);
    expect(floating().style.top).toBe("444px");

    stubRects({
      anchor: { top: 100, left: 400, width: 100, height: 40 },
      floating: { width: 200, height: 120 },
    });
    act(() => {
      screen.getByTestId("update").click();
    });
    expect(floating().style.top).toBe("144px");
  });
});
