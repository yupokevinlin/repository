import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Label, labelDensities } from "./Label";

const slot = (container: HTMLElement, name = "label"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Label", () => {
  it("renders a real label element", () => {
    const { container } = render(<Label htmlFor="deal">{"Deal number"}</Label>);
    expect(slot(container).tagName).toBe("LABEL");
  });

  it("points at the control it names", () => {
    const { container } = render(<Label htmlFor="deal">{"Deal number"}</Label>);
    expect(slot(container)).toHaveAttribute("for", "deal");
  });

  it("names the control for assistive technology", () => {
    render(
      <>
        <Label htmlFor="deal">{"Deal number"}</Label>
        <input id="deal" />
      </>,
    );
    expect(
      screen.getByRole("textbox", { name: "Deal number" }),
    ).toBeInTheDocument();
  });

  it("focuses the control when clicked", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="deal">{"Deal number"}</Label>
        <input id="deal" />
      </>,
    );
    await user.click(screen.getByText("Deal number"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  describe("required", () => {
    it("renders no marker unless asked for", () => {
      const { container } = render(
        <Label htmlFor="deal">{"Deal number"}</Label>,
      );
      expect(
        container.querySelector("[data-slot='label-required-marker']"),
      ).toBeNull();
    });

    it("renders the marker", () => {
      const { container } = render(
        <Label htmlFor="deal" required>
          {"Deal number"}
        </Label>,
      );
      expect(slot(container, "label-required-marker").textContent).toBe("*");
    });

    it("hides the asterisk from assistive technology", () => {
      const { container } = render(
        <Label htmlFor="deal" required>
          {"Deal number"}
        </Label>,
      );
      expect(slot(container, "label-required-marker")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("says what the marker means, since an asterisk announces as 'star'", () => {
      render(
        <Label htmlFor="deal" required>
          {"Deal number"}
        </Label>,
      );
      expect(screen.getByText("(required)")).toBeInTheDocument();
    });

    it("takes a caller-supplied wording, for other languages", () => {
      render(
        <Label htmlFor="deal" required requiredLabel="(obligatoire)">
          {"Numéro"}
        </Label>,
      );
      expect(screen.getByText("(obligatoire)")).toBeInTheDocument();
    });

    it("folds the marker into the control's accessible name", () => {
      render(
        <>
          <Label htmlFor="deal" required>
            {"Deal number"}
          </Label>
          <input id="deal" />
        </>,
      );
      expect(
        screen.getByRole("textbox", { name: "Deal number (required)" }),
      ).toBeInTheDocument();
    });
  });

  describe("optionalText", () => {
    it("renders nothing unless given", () => {
      const { container } = render(<Label htmlFor="notes">{"Notes"}</Label>);
      expect(
        container.querySelector("[data-slot='label-optional-text']"),
      ).toBeNull();
    });

    it("renders the wording given", () => {
      render(
        <Label htmlFor="notes" optionalText="Optional">
          {"Notes"}
        </Label>,
      );
      expect(screen.getByText("Optional")).toBeInTheDocument();
    });

    it("is visible text, not screen-reader-only — both audiences need it", () => {
      const { container } = render(
        <Label htmlFor="notes" optionalText="Optional">
          {"Notes"}
        </Label>,
      );
      expect(slot(container, "label-optional-text").className).not.toContain(
        "sr-only",
      );
    });
  });

  describe("density", () => {
    it("defaults to comfortable", () => {
      const { container } = render(
        <Label htmlFor="deal">{"Deal number"}</Label>,
      );
      expect(slot(container).className).toContain("text-label-md");
    });

    it("tightens the type step when compact", () => {
      const { container } = render(
        <Label htmlFor="deal" density="compact">
          {"Deal number"}
        </Label>,
      );
      expect(slot(container).className).toContain("text-label-sm");
    });

    it("gives every density a distinct set of classes", () => {
      const classNames: Array<string> = labelDensities.map((density) => {
        const { container, unmount } = render(
          <Label htmlFor="deal" density={density}>
            {"Deal number"}
          </Label>,
        );
        const className: string = slot(container).className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(labelDensities.length);
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(
      <Label htmlFor="deal" className="mb-1">
        {"Deal number"}
      </Label>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("mb-1");
    expect(className).toContain("text-label-md");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <Label htmlFor="deal" ref={ref}>
        {"Deal number"}
      </Label>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <Label htmlFor="deal" data-testid="deal-label">
        {"Deal number"}
      </Label>,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "deal-label");
  });
});
