import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Fieldset, fieldsetDensities, fieldsetOrientations } from "./Fieldset";

const slot = (container: HTMLElement, name = "fieldset"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

const controls = (
  <>
    <input aria-label="Incoterm" />
    <input aria-label="Port" />
  </>
);

describe("Fieldset", () => {
  it("renders a real fieldset element", () => {
    const { container } = render(
      <Fieldset legend="Delivery terms">{controls}</Fieldset>,
    );
    expect(slot(container).tagName).toBe("FIELDSET");
  });

  it("renders a real legend element", () => {
    const { container } = render(
      <Fieldset legend="Delivery terms">{controls}</Fieldset>,
    );
    expect(slot(container, "fieldset-legend").tagName).toBe("LEGEND");
  });

  it("names the group for assistive technology", () => {
    render(<Fieldset legend="Delivery terms">{controls}</Fieldset>);
    expect(
      screen.getByRole("group", { name: "Delivery terms" }),
    ).toBeInTheDocument();
  });

  it("renders its controls", () => {
    render(<Fieldset legend="Delivery terms">{controls}</Fieldset>);
    expect(screen.getByLabelText("Incoterm")).toBeInTheDocument();
    expect(screen.getByLabelText("Port")).toBeInTheDocument();
  });

  describe("disabled", () => {
    it("disables every control inside, natively", () => {
      render(
        <Fieldset legend="Delivery terms" disabled>
          {controls}
        </Fieldset>,
      );
      expect(screen.getByLabelText("Incoterm")).toBeDisabled();
      expect(screen.getByLabelText("Port")).toBeDisabled();
    });

    it("leaves them alone otherwise", () => {
      render(<Fieldset legend="Delivery terms">{controls}</Fieldset>);
      expect(screen.getByLabelText("Incoterm")).toBeEnabled();
    });

    it("marks the fieldset itself disabled", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms" disabled>
          {controls}
        </Fieldset>,
      );
      expect(slot(container)).toBeDisabled();
    });

    it("greys the legend through the group, since :disabled never matches it", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms" disabled>
          {controls}
        </Fieldset>,
      );
      expect(slot(container).className).toContain("group");
      expect(slot(container, "fieldset-legend").className).toContain(
        "group-disabled:text-fg-disabled",
      );
    });
  });

  describe("required", () => {
    it("renders no marker unless asked for", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms">{controls}</Fieldset>,
      );
      expect(
        container.querySelector("[data-slot='fieldset-required-marker']"),
      ).toBeNull();
    });

    it("renders the marker on the legend", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms" required>
          {controls}
        </Fieldset>,
      );
      expect(slot(container, "fieldset-required-marker").textContent).toBe("*");
    });

    it("hides the asterisk from assistive technology", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms" required>
          {controls}
        </Fieldset>,
      );
      expect(slot(container, "fieldset-required-marker")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("folds the meaning into the group's accessible name", () => {
      render(
        <Fieldset legend="Delivery terms" required>
          {controls}
        </Fieldset>,
      );
      expect(
        screen.getByRole("group", { name: "Delivery terms (required)" }),
      ).toBeInTheDocument();
    });

    it("takes a caller-supplied wording", () => {
      render(
        <Fieldset legend="Conditions" required requiredLabel="(obligatoire)">
          {controls}
        </Fieldset>,
      );
      expect(screen.getByText("(obligatoire)")).toBeInTheDocument();
    });
  });

  describe("orientation", () => {
    it("stacks controls by default", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms">{controls}</Fieldset>,
      );
      expect(slot(container, "fieldset-content").className).toContain(
        "flex-col",
      );
    });

    it("runs them in a row when horizontal", () => {
      const { container } = render(
        <Fieldset legend="Filters" orientation="horizontal">
          {controls}
        </Fieldset>,
      );
      expect(slot(container, "fieldset-content").className).toContain(
        "flex-row",
      );
    });

    it("gives every orientation a distinct set of classes", () => {
      const classNames: Array<string> = fieldsetOrientations.map(
        (orientation) => {
          const { container, unmount } = render(
            <Fieldset legend="Filters" orientation={orientation}>
              {controls}
            </Fieldset>,
          );
          const className: string = slot(
            container,
            "fieldset-content",
          ).className;
          unmount();
          return className;
        },
      );
      expect(new Set(classNames).size).toBe(fieldsetOrientations.length);
    });
  });

  describe("density", () => {
    it("defaults to comfortable", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms">{controls}</Fieldset>,
      );
      expect(slot(container, "fieldset-legend").className).toContain("mb-2");
    });

    it("tightens the gap when compact", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms" density="compact">
          {controls}
        </Fieldset>,
      );
      expect(slot(container, "fieldset-legend").className).toContain("mb-1.5");
    });

    it("spaces the legend with a margin, since a legend ignores flex gap", () => {
      const { container } = render(
        <Fieldset legend="Delivery terms">{controls}</Fieldset>,
      );
      expect(slot(container).className).not.toContain("gap-");
      expect(slot(container, "fieldset-legend").className).toContain("mb-");
    });

    it("gives every density a distinct set of classes", () => {
      const classNames: Array<string> = fieldsetDensities.map((density) => {
        const { container, unmount } = render(
          <Fieldset legend="Delivery terms" density={density}>
            {controls}
          </Fieldset>,
        );
        const className: string = slot(container, "fieldset-legend").className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(fieldsetDensities.length);
    });
  });

  it("can shrink inside a grid, despite the UA min-width on fieldsets", () => {
    const { container } = render(
      <Fieldset legend="Delivery terms">{controls}</Fieldset>,
    );
    expect(slot(container).className).toContain("min-w-0");
  });

  it("drops the browser's default border and padding", () => {
    const { container } = render(
      <Fieldset legend="Delivery terms">{controls}</Fieldset>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("border-0");
    expect(className).toContain("p-0");
  });

  it("merges className rather than replacing the layout classes", () => {
    const { container } = render(
      <Fieldset legend="Delivery terms" className="mt-4">
        {controls}
      </Fieldset>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("mt-4");
    expect(className).toContain("min-w-0");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Fieldset legend="Delivery terms" ref={ref}>
        {controls}
      </Fieldset>,
    );
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <Fieldset legend="Delivery terms" data-testid="terms">
        {controls}
      </Fieldset>,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "terms");
  });
});
