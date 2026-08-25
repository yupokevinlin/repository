import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Heading, headingElements } from "./Heading";

const slot = (container: HTMLElement): HTMLElement => {
  const element = container.querySelector<HTMLElement>("[data-slot='heading']");
  if (!element) {
    throw new Error("heading slot not found");
  }
  return element;
};

describe("Heading", () => {
  it("renders its children", () => {
    render(<Heading>Kanto Polymer KK</Heading>);
    expect(screen.getByText("Kanto Polymer KK")).toBeInTheDocument();
  });

  it("renders an h2 by default, not an h1", () => {
    const { container } = render(<Heading>Kanto Polymer KK</Heading>);
    expect(slot(container).tagName).toBe("H2");
  });

  it("supports all six heading levels", () => {
    for (const element of headingElements) {
      const { container, unmount } = render(
        <Heading as={element}>Kanto Polymer KK</Heading>,
      );
      expect(slot(container).tagName).toBe(element.toUpperCase());
      unmount();
    }
  });

  it("exposes the correct heading role and level to assistive technology", () => {
    render(<Heading as="h3">Cost sheet</Heading>);
    expect(
      screen.getByRole("heading", { level: 3, name: "Cost sheet" }),
    ).toBeInTheDocument();
  });

  it("applies the default size and weight when none are given", () => {
    const { container } = render(<Heading>Kanto Polymer KK</Heading>);
    const className: string = slot(container).className;
    expect(className).toContain("text-display-sm");
    expect(className).toContain("font-bold");
  });

  it("keeps level and size independent", () => {
    const { container } = render(
      <Heading as="h3" size="label-lg">
        Cost sheet
      </Heading>,
    );
    expect(slot(container).tagName).toBe("H3");
    expect(slot(container).className).toContain("text-label-lg");
  });

  it("balances its text, since headings wrap", () => {
    const { container } = render(<Heading>Kanto Polymer KK</Heading>);
    expect(slot(container).className).toContain("text-balance");
  });

  it("merges className rather than replacing the size classes", () => {
    const { container } = render(
      <Heading className="truncate">Kanto Polymer KK</Heading>,
    );
    expect(slot(container).className).toContain("truncate");
    expect(slot(container).className).toContain("text-display-sm");
  });

  it("forwards a ref to the rendered element", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>Kanto Polymer KK</Heading>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it("forwards arbitrary native props", () => {
    render(<Heading id="deal-title">NPM-2601</Heading>);
    expect(screen.getByText("NPM-2601")).toHaveAttribute("id", "deal-title");
  });
});
