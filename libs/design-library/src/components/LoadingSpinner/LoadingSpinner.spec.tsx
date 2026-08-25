import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  LoadingSpinner,
  loadingSpinnerSizes,
  loadingSpinnerVariants,
} from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("exposes a status role so assistive technology announces it", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it('defaults its accessible name to "Loading"', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("lets the consumer override the accessible name", () => {
    render(<LoadingSpinner label="Applying FX rates" />);
    expect(
      screen.getByRole("status", { name: "Applying FX rates" }),
    ).toBeInTheDocument();
  });

  it("hides the decorative svg from assistive technology", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("applies the default size and variant when none are given", () => {
    const { container } = render(<LoadingSpinner />);
    const className: string =
      container.querySelector("svg")?.getAttribute("class") ?? "";
    expect(className).toContain("size-5");
    expect(className).toContain("text-fg-default");
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = loadingSpinnerSizes.map((size) => {
      const { container, unmount } = render(<LoadingSpinner size={size} />);
      const className: string =
        container.querySelector("svg")?.getAttribute("class") ?? "";
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(loadingSpinnerSizes.length);
  });

  it("gives every variant a distinct set of classes", () => {
    const classNames: Array<string> = loadingSpinnerVariants.map((variant) => {
      const { container, unmount } = render(
        <LoadingSpinner variant={variant} />,
      );
      const className: string =
        container.querySelector("svg")?.getAttribute("class") ?? "";
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(loadingSpinnerVariants.length);
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<LoadingSpinner className="text-inherit" />);
    const className: string =
      container.querySelector("svg")?.getAttribute("class") ?? "";
    expect(className).toContain("text-inherit");
    expect(className).toContain("animate-spin");
  });

  it("forwards arbitrary native props to the wrapper", () => {
    render(<LoadingSpinner data-testid="spinner" />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
});
