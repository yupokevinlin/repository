import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Kbd, kbdSizes } from "./Kbd";

const slot = (container: HTMLElement, name = "kbd"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Kbd", () => {
  it("renders every key", () => {
    render(<Kbd keys={["Ctrl", "K"]} />);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("renders one inner kbd per key inside an outer kbd", () => {
    const { container } = render(<Kbd keys={["Ctrl", "K"]} />);
    expect(slot(container)).toBeInstanceOf(HTMLElement);
    expect(slot(container).tagName).toBe("KBD");
    const keys = container.querySelectorAll("[data-slot='kbd-key']");
    expect(keys).toHaveLength(2);
    for (const key of keys) {
      expect(key.tagName).toBe("KBD");
    }
  });

  it("renders a single key without a separator", () => {
    const { container } = render(<Kbd keys={["Esc"]} separator="+" />);
    expect(container.querySelector("[data-slot='kbd-separator']")).toBeNull();
  });

  it("renders a separator between keys but not around them", () => {
    const { container } = render(
      <Kbd keys={["Ctrl", "Shift", "K"]} separator="+" />,
    );
    expect(
      container.querySelectorAll("[data-slot='kbd-separator']"),
    ).toHaveLength(2);
  });

  it("hides the separator from assistive technology", () => {
    const { container } = render(<Kbd keys={["Ctrl", "K"]} separator="+" />);
    expect(slot(container, "kbd-separator")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps the separator out of the accessible name", () => {
    const { container } = render(<Kbd keys={["Ctrl", "K"]} separator="+" />);
    expect(slot(container).textContent).toContain("Ctrl");
    expect(slot(container).textContent).toContain("K");
    expect(slot(container, "kbd-separator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("spaces the keys when no separator is given", () => {
    const { container } = render(<Kbd keys={["Ctrl", "K"]} />);
    expect(slot(container).className).toContain("gap-");
  });

  it("does not add spacing when a separator supplies it", () => {
    const { container } = render(<Kbd keys={["Ctrl", "K"]} separator="+" />);
    expect(slot(container).className).not.toContain("gap-");
  });

  it("applies the default size", () => {
    const { container } = render(<Kbd keys={["K"]} />);
    expect(slot(container, "kbd-key").className).toContain("h-6");
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = kbdSizes.map((size) => {
      const { container, unmount } = render(<Kbd keys={["K"]} size={size} />);
      const className: string = slot(container, "kbd-key").className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(kbdSizes.length);
  });

  it("renders nothing when given no keys", () => {
    const { container } = render(<Kbd keys={[]} />);
    expect(container.querySelector("[data-slot='kbd-key']")).toBeNull();
  });

  it("does not detect the platform — it renders exactly what it is given", () => {
    render(<Kbd keys={["⌘", "K"]} />);
    expect(screen.getByText("⌘")).toBeInTheDocument();
    expect(screen.queryByText("Ctrl")).toBeNull();
  });

  it("handles a repeated key without colliding", () => {
    const { container } = render(<Kbd keys={["K", "K"]} />);
    expect(container.querySelectorAll("[data-slot='kbd-key']")).toHaveLength(2);
  });

  it("merges className rather than replacing the wrapper classes", () => {
    const { container } = render(<Kbd keys={["K"]} className="ml-2" />);
    const className: string = slot(container).className;
    expect(className).toContain("ml-2");
    expect(className).toContain("inline-flex");
  });

  it("forwards a ref to the outer kbd", () => {
    const ref = createRef<HTMLElement>();
    render(<Kbd keys={["K"]} ref={ref} />);
    expect(ref.current?.tagName).toBe("KBD");
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Kbd keys={["K"]} title="Shortcut" />);
    expect(slot(container)).toHaveAttribute("title", "Shortcut");
  });
});
