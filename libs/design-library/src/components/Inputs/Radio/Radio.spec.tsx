import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Radio, radioSizes } from "./Radio";

const control = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("radio");

const slot = (container: HTMLElement, name: string): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Radio", () => {
  it("renders a native radio", () => {
    render(<Radio name="incoterm" value="FOB" label="FOB" />);
    expect(control()).toHaveAttribute("type", "radio");
  });

  it("takes its accessible name from its label", () => {
    render(<Radio name="incoterm" value="FOB" label="FOB" />);
    expect(screen.getByRole("radio", { name: "FOB" })).toBeInTheDocument();
  });

  it("selects when its label text is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Radio name="incoterm" value="FOB" label="FOB" onChange={onChange} />,
    );
    await user.click(screen.getByText("FOB"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("selects on click", async () => {
    const user = userEvent.setup();
    render(<Radio name="incoterm" value="FOB" label="FOB" />);
    await user.click(control());
    expect(control()).toBeChecked();
  });

  it("is exclusive with others sharing its name", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="incoterm" value="FOB" label="FOB" />
        <Radio name="incoterm" value="CIF" label="CIF" />
      </>,
    );
    await user.click(screen.getByRole("radio", { name: "FOB" }));
    await user.click(screen.getByRole("radio", { name: "CIF" }));
    expect(screen.getByRole("radio", { name: "FOB" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "CIF" })).toBeChecked();
  });

  it("is independent of a radio with a different name", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="incoterm" value="FOB" label="FOB" />
        <Radio name="terms" value="net30" label="Net 30" />
      </>,
    );
    await user.click(screen.getByRole("radio", { name: "FOB" }));
    await user.click(screen.getByRole("radio", { name: "Net 30" }));
    expect(screen.getByRole("radio", { name: "FOB" })).toBeChecked();
  });

  describe("size", () => {
    it("defaults to 16px", () => {
      const { container } = render(
        <Radio name="incoterm" value="FOB" label="FOB" />,
      );
      expect(slot(container, "radio-control").className).toContain("size-4");
    });

    it("gives every size a distinct set of classes", () => {
      const classNames: Array<string> = radioSizes.map((size) => {
        const { container, unmount } = render(
          <Radio name="incoterm" value="FOB" label="FOB" size={size} />,
        );
        const className: string = slot(container, "radio-control").className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(radioSizes.length);
    });

    it("is round, not a box", () => {
      const { container } = render(
        <Radio name="incoterm" value="FOB" label="FOB" />,
      );
      expect(slot(container, "radio-control").className).toContain(
        "rounded-full",
      );
    });

    it("scales the dot with the control", () => {
      const { container } = render(
        <Radio name="incoterm" value="FOB" label="FOB" size="5" />,
      );
      expect(slot(container, "radio-dot").className).toContain("size-2");
    });
  });

  describe("hint and error", () => {
    it("describes the control with its hint", () => {
      render(
        <Radio
          name="terms"
          value="net30"
          label="Net 30"
          hint="Standard terms."
        />,
      );
      expect(control()).toHaveAccessibleDescription("Standard terms.");
    });

    it("marks the control invalid from its error", () => {
      render(
        <Radio
          name="terms"
          value="net30"
          label="Net 30"
          error="Not available for this counterparty."
        />,
      );
      expect(control()).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("disables the control", () => {
    render(<Radio name="incoterm" value="FOB" label="FOB" disabled />);
    expect(control()).toBeDisabled();
  });

  it("works with an aria-label and no visible one", () => {
    const { container } = render(
      <Radio name="contact" value="1" aria-label="K. Lin" />,
    );
    expect(screen.getByRole("radio", { name: "K. Lin" })).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });

  it("puts the visibility toggle on a sibling of the input, where peer- works", () => {
    const { container } = render(
      <Radio name="incoterm" value="FOB" label="FOB" />,
    );
    const input = slot(container, "radio-control");
    const mark = slot(container, "radio-mark");
    expect(input.nextElementSibling).toBe(mark);
    expect(mark.className).toContain("peer-checked:opacity-100");
  });

  it("carries no indeterminate styling — on a radio that means something else", () => {
    // CSS :indeterminate matches a radio whose whole group is unchosen, so
    // the checkbox's indeterminate paint would light up every empty group.
    const { container } = render(
      <Radio name="incoterm" value="FOB" label="FOB" />,
    );
    expect(slot(container, "radio-control").className).not.toContain(
      "indeterminate:",
    );
  });

  it("keeps the dot out of the way of clicks", () => {
    const { container } = render(
      <Radio name="incoterm" value="FOB" label="FOB" />,
    );
    expect(slot(container, "radio-mark").className).toContain(
      "pointer-events-none",
    );
  });

  it("forwards a ref to the input itself", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio name="incoterm" value="FOB" label="FOB" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards arbitrary native props", () => {
    render(<Radio name="incoterm" value="FOB" label="FOB" />);
    expect(control()).toHaveAttribute("value", "FOB");
  });
});
