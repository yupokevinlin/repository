import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  FieldShell,
  type FieldShellOwnProps,
  useFieldShell,
} from "./FieldShell";

/**
 * A minimal control built the way every Wave 3 control will be — the shell
 * only makes sense through one.
 */
const TextField = ({
  id,
  ...ownProps
}: FieldShellOwnProps & { id?: string }) => {
  const { controlProps, fieldProps } = useFieldShell({ id, ...ownProps });
  return (
    <FieldShell {...fieldProps}>
      <input data-slot="control" {...controlProps} />
    </FieldShell>
  );
};

const control = (): HTMLElement => screen.getByRole("textbox");

describe("useFieldShell", () => {
  it("ties the label to the control", () => {
    render(<TextField label="Deal number" />);
    expect(
      screen.getByRole("textbox", { name: "Deal number" }),
    ).toBeInTheDocument();
  });

  it("focuses the control when its label is clicked", async () => {
    const user = userEvent.setup();
    render(<TextField label="Deal number" />);
    await user.click(screen.getByText("Deal number"));
    expect(control()).toHaveFocus();
  });

  it("takes a caller-supplied id", () => {
    render(<TextField label="Deal number" id="deal" />);
    expect(control()).toHaveAttribute("id", "deal");
  });

  it("generates distinct ids for two fields", () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
      </>,
    );
    const [first, second] = screen.getAllByRole("textbox");
    expect(first?.id).not.toBe(second?.id);
  });

  describe("hint", () => {
    it("describes the control", () => {
      render(<TextField label="Rate" hint="Mid-market rate." />);
      expect(control()).toHaveAccessibleDescription("Mid-market rate.");
    });

    it("adds no description when there is no hint", () => {
      render(<TextField label="Rate" />);
      expect(control()).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("error", () => {
    it("describes the control", () => {
      render(<TextField label="Quantity" error="Exceeds allocation." />);
      expect(control()).toHaveAccessibleDescription("Exceeds allocation.");
    });

    it("marks the control invalid, without a separate prop", () => {
      render(<TextField label="Quantity" error="Exceeds allocation." />);
      expect(control()).toHaveAttribute("aria-invalid", "true");
    });

    it("leaves a valid control unmarked", () => {
      render(<TextField label="Quantity" />);
      expect(control()).not.toHaveAttribute("aria-invalid");
    });

    it("wins over the hint in the description rather than concatenating", () => {
      render(
        <TextField
          label="Quantity"
          hint="Mid-market rate."
          error="Exceeds allocation."
        />,
      );
      expect(control()).toHaveAccessibleDescription("Exceeds allocation.");
    });

    it("still shows the hint on screen — it explains the field either way", () => {
      render(
        <TextField
          label="Quantity"
          hint="Mid-market rate."
          error="Exceeds allocation."
        />,
      );
      expect(screen.getByText("Mid-market rate.")).toBeInTheDocument();
      expect(screen.getByText("Exceeds allocation.")).toBeInTheDocument();
    });

    it("announces the error, since it appears after the user has moved on", () => {
      const { container } = render(
        <TextField label="Quantity" error="Exceeds allocation." />,
      );
      const errorNode = container.querySelector("[data-severity='error']");
      expect(errorNode).toHaveAttribute("aria-live", "polite");
    });

    it("does not announce a static hint", () => {
      const { container } = render(
        <TextField label="Rate" hint="Mid-market rate." />,
      );
      const hintNode = container.querySelector("[data-severity='neutral']");
      expect(hintNode).not.toHaveAttribute("aria-live");
    });
  });

  describe("required", () => {
    it("marks the control required", () => {
      render(<TextField label="Deal number" required />);
      expect(control()).toHaveAttribute("aria-required", "true");
    });

    it("renders the marker in the label", () => {
      render(<TextField label="Deal number" required />);
      expect(
        screen.getByRole("textbox", { name: "Deal number (required)" }),
      ).toBeInTheDocument();
    });

    it("leaves an optional control unmarked", () => {
      render(<TextField label="Deal number" />);
      expect(control()).not.toHaveAttribute("aria-required");
    });
  });
});

describe("FieldShell", () => {
  it("renders the control it is given", () => {
    render(<TextField label="Deal number" />);
    expect(control()).toBeInTheDocument();
  });

  it("renders no label element when there is no label", () => {
    const { container } = render(<TextField />);
    expect(container.querySelector("label")).toBeNull();
  });

  it("still works with an aria-label instead of a label", () => {
    const Bare = () => {
      const { controlProps, fieldProps } = useFieldShell({});
      return (
        <FieldShell {...fieldProps}>
          <input aria-label="Search" {...controlProps} />
        </FieldShell>
      );
    };
    render(<Bare />);
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });

  it("puts the label above the control and the error below it", () => {
    const { container } = render(
      <TextField label="Quantity" error="Exceeds allocation." />,
    );
    const field = container.querySelector("[data-slot='field']");
    const order: Array<string> = Array.from(field?.children ?? []).map(
      (child) => child.getAttribute("data-slot") ?? child.tagName,
    );
    expect(order[0]).toBe("label");
    expect(order[1]).toBe("control");
    expect(order[2]).toBe("helper-text");
  });

  it("tightens its spacing when compact", () => {
    const { container } = render(
      <TextField label="Deal number" density="compact" />,
    );
    const field = container.querySelector("[data-slot='field']");
    expect(field?.className).toContain("gap-1");
  });

  it("passes density down to the label and helper text", () => {
    const { container } = render(
      <TextField label="Rate" hint="Mid-market rate." density="compact" />,
    );
    expect(container.querySelector("[data-slot='label']")?.className).toContain(
      "text-label-sm",
    );
    expect(
      container.querySelector("[data-slot='helper-text']")?.className,
    ).toContain("text-body-xs");
  });

  it("can shrink inside a grid column", () => {
    const { container } = render(<TextField label="Deal number" />);
    expect(container.querySelector("[data-slot='field']")?.className).toContain(
      "min-w-0",
    );
  });
});
