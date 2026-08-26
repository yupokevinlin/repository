import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  HelperText,
  helperTextDensities,
  helperTextSeverities,
} from "./HelperText";

const slot = (container: HTMLElement, name = "helper-text"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("HelperText", () => {
  it("renders its text", () => {
    render(<HelperText>{"Mid-market rate at 16:00 UTC."}</HelperText>);
    expect(
      screen.getByText("Mid-market rate at 16:00 UTC."),
    ).toBeInTheDocument();
  });

  it("renders a paragraph, so it reads as prose", () => {
    const { container } = render(<HelperText>{"Hint"}</HelperText>);
    expect(slot(container).tagName).toBe("P");
  });

  it("describes the field it is wired to", () => {
    render(
      <>
        <input aria-describedby="rate-hint" aria-label="Rate" />
        <HelperText id="rate-hint">{"Mid-market rate."}</HelperText>
      </>,
    );
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Mid-market rate.",
    );
  });

  describe("severity", () => {
    it("defaults to neutral", () => {
      const { container } = render(<HelperText>{"Hint"}</HelperText>);
      expect(slot(container)).toHaveAttribute("data-severity", "neutral");
    });

    it("gives every severity a distinct set of classes", () => {
      const classNames: Array<string> = helperTextSeverities.map((severity) => {
        const { container, unmount } = render(
          <HelperText severity={severity}>{"Hint"}</HelperText>,
        );
        const className: string = slot(container).className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(helperTextSeverities.length);
    });

    it("draws no icon for a neutral hint", () => {
      const { container } = render(<HelperText>{"Hint"}</HelperText>);
      expect(
        container.querySelector("[data-slot='helper-text-icon']"),
      ).toBeNull();
    });

    it("draws an icon for a warning, so colour is not the only signal", () => {
      const { container } = render(
        <HelperText severity="warning">{"Careful"}</HelperText>,
      );
      expect(slot(container, "helper-text-icon")).toBeInTheDocument();
    });

    it("draws an icon for an error", () => {
      const { container } = render(
        <HelperText severity="error">{"Wrong"}</HelperText>,
      );
      expect(slot(container, "helper-text-icon")).toBeInTheDocument();
    });

    it("hides the icon from assistive technology — the words carry it", () => {
      const { container } = render(
        <HelperText severity="error">{"Wrong"}</HelperText>,
      );
      const svg = slot(container, "helper-text-icon").querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("uses error tokens for an error, not the warning family", () => {
      const { container } = render(
        <HelperText severity="error">{"Wrong"}</HelperText>,
      );
      const className: string = slot(container).className;
      expect(className).toContain("text-fg-error-default");
      expect(className).not.toContain("text-fg-warning-default");
    });

    it("exposes its severity for styling and tests", () => {
      const { container } = render(
        <HelperText severity="warning">{"Careful"}</HelperText>,
      );
      expect(slot(container)).toHaveAttribute("data-severity", "warning");
    });
  });

  describe("live", () => {
    it("stays silent by default — a static hint is not news", () => {
      const { container } = render(<HelperText>{"Hint"}</HelperText>);
      expect(slot(container)).not.toHaveAttribute("aria-live");
    });

    it("announces politely rather than cutting across the user", () => {
      const { container } = render(
        <HelperText live severity="error">
          {"Wrong"}
        </HelperText>,
      );
      expect(slot(container)).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("density", () => {
    it("defaults to comfortable", () => {
      const { container } = render(<HelperText>{"Hint"}</HelperText>);
      expect(slot(container).className).toContain("text-body-sm");
    });

    it("tightens the type step when compact", () => {
      const { container } = render(
        <HelperText density="compact">{"Hint"}</HelperText>,
      );
      expect(slot(container).className).toContain("text-body-xs");
    });

    it("gives every density a distinct set of classes", () => {
      const classNames: Array<string> = helperTextDensities.map((density) => {
        const { container, unmount } = render(
          <HelperText density={density}>{"Hint"}</HelperText>,
        );
        const className: string = slot(container).className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(helperTextDensities.length);
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(
      <HelperText className="mt-1">{"Hint"}</HelperText>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("mt-1");
    expect(className).toContain("text-body-sm");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<HelperText ref={ref}>{"Hint"}</HelperText>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <HelperText data-testid="hint">{"Hint"}</HelperText>,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "hint");
  });
});
