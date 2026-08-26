import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Skeleton, skeletonVariants } from "./Skeleton";

const slot = (container: HTMLElement, name = "skeleton"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Skeleton", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton />);
    expect(slot(container)).toHaveAttribute("aria-hidden", "true");
  });

  it("contributes nothing to the accessible tree", () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.textContent).toBe("");
  });

  it("applies the default variant", () => {
    const { container } = render(<Skeleton />);
    expect(slot(container).className).toContain("h-[1em]");
  });

  it("gives every variant a distinct set of classes", () => {
    const classNames: Array<string> = skeletonVariants.map((variant) => {
      const { container, unmount } = render(<Skeleton variant={variant} />);
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(skeletonVariants.length);
  });

  it("animates by default", () => {
    const { container } = render(<Skeleton />);
    expect(slot(container).className).toContain("animate-pulse");
  });

  it("always disables the animation under prefers-reduced-motion", () => {
    const { container } = render(<Skeleton />);
    expect(slot(container).className).toContain("motion-reduce:animate-none");
  });

  it("can be rendered flat", () => {
    const { container } = render(<Skeleton animated={false} />);
    expect(slot(container).className).not.toContain("animate-pulse");
  });

  it("applies width and height as inline styles", () => {
    const { container } = render(
      <Skeleton variant="circle" width="2rem" height="2rem" />,
    );
    const element: HTMLElement = slot(container);
    expect(element.style.width).toBe("2rem");
    expect(element.style.height).toBe("2rem");
  });

  it("renders a single bar by default", () => {
    const { container } = render(<Skeleton />);
    expect(
      container.querySelectorAll("[data-slot='skeleton-line']"),
    ).toHaveLength(0);
  });

  describe("multi-line text", () => {
    it("renders one bar per line", () => {
      const { container } = render(<Skeleton lines={3} />);
      expect(
        container.querySelectorAll("[data-slot='skeleton-line']"),
      ).toHaveLength(3);
    });

    it("wraps the bars in a single hidden container", () => {
      const { container } = render(<Skeleton lines={3} />);
      expect(slot(container)).toHaveAttribute("aria-hidden", "true");
      expect(slot(container).className).toContain("flex-col");
    });

    it("renders the last line short, the way a paragraph ends", () => {
      const { container } = render(<Skeleton lines={3} />);
      const bars = container.querySelectorAll("[data-slot='skeleton-line']");
      expect(bars[0]?.className).not.toContain("w-[60%]");
      expect(bars[2]?.className).toContain("w-[60%]");
    });

    it("stays a single bar when lines is 1", () => {
      const { container } = render(<Skeleton lines={1} />);
      expect(
        container.querySelectorAll("[data-slot='skeleton-line']"),
      ).toHaveLength(0);
    });

    it("ignores lines for non-text variants", () => {
      const { container } = render(<Skeleton variant="rect" lines={3} />);
      expect(
        container.querySelectorAll("[data-slot='skeleton-line']"),
      ).toHaveLength(0);
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<Skeleton className="my-2" />);
    const className: string = slot(container).className;
    expect(className).toContain("my-2");
    expect(className).toContain("bg-bg-active");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    const { container } = render(<Skeleton className="rounded-none" />);
    const className: string = slot(container).className;
    expect(className).toContain("rounded-none");
    expect(className).not.toContain("rounded-[0.25rem]");
  });

  it("forwards a ref to the underlying element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Skeleton data-testid="placeholder" />);
    expect(slot(container)).toHaveAttribute("data-testid", "placeholder");
  });
});
