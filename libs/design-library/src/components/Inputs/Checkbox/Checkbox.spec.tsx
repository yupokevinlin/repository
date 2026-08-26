import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox, checkboxSizes } from "./Checkbox";

const control = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("checkbox");

const slot = (container: HTMLElement, name: string): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Checkbox", () => {
  it("renders a native checkbox", () => {
    render(<Checkbox label="Include settled deals" />);
    expect(control()).toHaveAttribute("type", "checkbox");
  });

  it("takes its accessible name from its label", () => {
    render(<Checkbox label="Include settled deals" />);
    expect(
      screen.getByRole("checkbox", { name: "Include settled deals" }),
    ).toBeInTheDocument();
  });

  it("toggles when its label text is clicked, not just the box", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Include settled deals" onChange={onChange} />);
    await user.click(screen.getByText("Include settled deals"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include settled deals" />);
    await user.click(control());
    expect(control()).toBeChecked();
  });

  it("toggles on Space", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include settled deals" />);
    control().focus();
    await user.keyboard(" ");
    expect(control()).toBeChecked();
  });

  it("stays put when controlled and the owner ignores the change", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include settled deals" checked={false} readOnly />);
    await user.click(control());
    expect(control()).not.toBeChecked();
  });

  describe("indeterminate", () => {
    it("sets the native property, which cannot be set from JSX", () => {
      render(<Checkbox label="Select all" indeterminate />);
      expect(control().indeterminate).toBe(true);
    });

    it("announces as mixed rather than as checked or unchecked", () => {
      render(<Checkbox label="Select all" indeterminate />);
      expect(control()).toHaveAttribute("aria-checked", "mixed");
    });

    it("draws a dash rather than a tick", () => {
      const { container } = render(
        <Checkbox label="Select all" indeterminate />,
      );
      const path = slot(container, "checkbox-mark").querySelector("path");
      expect(path?.getAttribute("d")).toBe("M4 8h8");
    });

    it("clears the native property when it goes away", () => {
      const { rerender } = render(
        <Checkbox label="Select all" indeterminate />,
      );
      rerender(<Checkbox label="Select all" indeterminate={false} />);
      expect(control().indeterminate).toBe(false);
    });

    it("sets no aria-checked when it is an ordinary checkbox", () => {
      render(<Checkbox label="Select all" />);
      expect(control()).not.toHaveAttribute("aria-checked");
    });
  });

  describe("size", () => {
    it("defaults to 16px", () => {
      const { container } = render(<Checkbox label="Include settled deals" />);
      expect(slot(container, "checkbox-control").className).toContain("size-4");
    });

    it("gives every size a distinct set of classes", () => {
      const classNames: Array<string> = checkboxSizes.map((size) => {
        const { container, unmount } = render(
          <Checkbox label="Include settled deals" size={size} />,
        );
        const className: string = slot(container, "checkbox-control").className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(checkboxSizes.length);
    });

    it("is a box, not a dot", () => {
      const { container } = render(<Checkbox label="Include settled deals" />);
      const className: string = slot(container, "checkbox-control").className;
      expect(className).toContain("rounded-xs");
      expect(className).not.toContain("rounded-full");
    });
  });

  describe("hint and error", () => {
    it("describes the control with its hint", () => {
      render(
        <Checkbox label="Include settled deals" hint="Slows the search." />,
      );
      expect(control()).toHaveAccessibleDescription("Slows the search.");
    });

    it("marks the control invalid from its error", () => {
      render(<Checkbox label="I confirm" error="You must confirm." />);
      expect(control()).toHaveAttribute("aria-invalid", "true");
    });

    it("draws the invalid border from the same prop", () => {
      const { container } = render(
        <Checkbox label="I confirm" error="You must confirm." />,
      );
      expect(slot(container, "checkbox-control").className).toContain(
        "border-border-error",
      );
    });
  });

  it("marks the control required and shows the marker", () => {
    render(<Checkbox label="I confirm" required />);
    expect(control()).toHaveAttribute("aria-required", "true");
    expect(
      screen.getByRole("checkbox", { name: "I confirm (required)" }),
    ).toBeInTheDocument();
  });

  it("disables the control", () => {
    render(<Checkbox label="Include settled deals" disabled />);
    expect(control()).toBeDisabled();
  });

  it("works with an aria-label and no visible one", () => {
    const { container } = render(<Checkbox aria-label="Select row" />);
    expect(
      screen.getByRole("checkbox", { name: "Select row" }),
    ).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });

  it("puts the visibility toggle on a sibling of the input, where peer- works", () => {
    const { container } = render(<Checkbox label="Include settled deals" />);
    const input = slot(container, "checkbox-control");
    const mark = slot(container, "checkbox-mark");
    expect(input.nextElementSibling).toBe(mark);
    expect(mark.className).toContain("peer-checked:opacity-100");
  });

  it("keeps the tick permanently visible on the indeterminate dash", () => {
    const { container } = render(<Checkbox label="Select all" indeterminate />);
    expect(slot(container, "checkbox-mark").className).not.toContain(
      "opacity-0",
    );
  });

  it("keeps the indeterminate paint, which is meaningful on a checkbox", () => {
    const { container } = render(<Checkbox label="Select all" />);
    expect(slot(container, "checkbox-control").className).toContain(
      "indeterminate:bg-bg-primary",
    );
  });

  it("keeps the mark out of the way of clicks", () => {
    const { container } = render(<Checkbox label="Include settled deals" />);
    expect(slot(container, "checkbox-mark").className).toContain(
      "pointer-events-none",
    );
  });

  it("forwards a ref to the input itself", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Include settled deals" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("still sets indeterminate when a caller has taken the ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Select all" indeterminate ref={ref} />);
    expect(ref.current?.indeterminate).toBe(true);
  });

  it("forwards arbitrary native props", () => {
    render(<Checkbox label="Include settled deals" name="settled" />);
    expect(control()).toHaveAttribute("name", "settled");
  });
});
