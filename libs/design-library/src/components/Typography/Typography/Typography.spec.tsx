import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Typography,
  typographyElements,
  typographyFontFamilies,
  typographySizes,
  typographyWeights,
} from "./Typography";

const slot = (container: HTMLElement): HTMLElement => {
  const element = container.querySelector<HTMLElement>(
    "[data-slot='typography']",
  );
  if (!element) {
    throw new Error("typography slot not found");
  }
  return element;
};

describe("Typography", () => {
  it("renders its children", () => {
    render(<Typography>CIF Vancouver</Typography>);
    expect(screen.getByText("CIF Vancouver")).toBeInTheDocument();
  });

  it("renders a span by default", () => {
    const { container } = render(<Typography>CIF Vancouver</Typography>);
    expect(slot(container).tagName).toBe("SPAN");
  });

  it("renders every element the closed union allows", () => {
    for (const element of typographyElements) {
      const { container, unmount } = render(
        <Typography as={element}>CIF Vancouver</Typography>,
      );
      expect(slot(container).tagName).toBe(element.toUpperCase());
      unmount();
    }
  });

  it("applies the default size when none is given", () => {
    const { container } = render(<Typography>CIF Vancouver</Typography>);
    expect(slot(container).className).toContain("text-body-md");
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = typographySizes.map((size) => {
      const { container, unmount } = render(
        <Typography size={size}>CIF Vancouver</Typography>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(typographySizes.length);
  });

  it("gives every weight a distinct set of classes", () => {
    const classNames: Array<string> = typographyWeights.map((fontWeight) => {
      const { container, unmount } = render(
        <Typography fontWeight={fontWeight}>CIF Vancouver</Typography>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(typographyWeights.length);
  });

  it("gives every font family a distinct set of classes", () => {
    const classNames: Array<string> = typographyFontFamilies.map(
      (fontFamily) => {
        const { container, unmount } = render(
          <Typography fontFamily={fontFamily}>CIF Vancouver</Typography>,
        );
        const className: string = slot(container).className;
        unmount();
        return className;
      },
    );
    expect(new Set(classNames).size).toBe(typographyFontFamilies.length);
  });

  it("defaults label steps to medium weight, since they are UI text", () => {
    const { container } = render(
      <Typography size="label-md">Incoterm</Typography>,
    );
    expect(slot(container).className).toContain("font-medium");
  });

  it("defaults code steps to the mono family", () => {
    const { container } = render(
      <Typography size="code-sm">MSKU 447188-2</Typography>,
    );
    expect(slot(container).className).toContain("font-mono");
  });

  it("lets an explicit weight override the size-derived default", () => {
    const { container } = render(
      <Typography size="label-md" fontWeight="bold">
        Incoterm
      </Typography>,
    );
    expect(slot(container).className).toContain("font-bold");
    expect(slot(container).className).not.toContain("font-medium");
  });

  it("merges className rather than replacing the size classes", () => {
    const { container } = render(
      <Typography className="truncate">CIF Vancouver</Typography>,
    );
    expect(slot(container).className).toContain("truncate");
    expect(slot(container).className).toContain("text-body-md");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    const { container } = render(
      <Typography className="text-body-xs">CIF Vancouver</Typography>,
    );
    expect(slot(container).className).toContain("text-body-xs");
    expect(slot(container).className).not.toContain("text-body-md");
  });

  it("forwards a ref to the rendered element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Typography ref={ref}>CIF Vancouver</Typography>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("forwards arbitrary native props", () => {
    render(<Typography title="Incoterm 2020">CIF</Typography>);
    expect(screen.getByText("CIF")).toHaveAttribute("title", "Incoterm 2020");
  });
});
