import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { TextArea, textAreaResizes } from "./TextArea";

const slot = (container: HTMLElement, name = "text-area"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

const control = (): HTMLTextAreaElement => screen.getByRole("textbox");

describe("TextArea", () => {
  it("renders a textarea", () => {
    render(<TextArea label="Notes" />);
    expect(control().tagName).toBe("TEXTAREA");
  });

  it("renders its own label, tied to the field", () => {
    render(<TextArea label="Notes" />);
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  });

  it("takes typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextArea label="Notes" onChange={onChange} />);
    await user.type(control(), "Shipped");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows three rows by default", () => {
    render(<TextArea label="Notes" />);
    expect(control()).toHaveAttribute("rows", "3");
  });

  it("takes a row count", () => {
    render(<TextArea label="Notes" rows={6} />);
    expect(control()).toHaveAttribute("rows", "6");
  });

  describe("hint and error", () => {
    it("describes the field with its hint", () => {
      render(<TextArea label="Notes" hint="Visible to the counterparty." />);
      expect(control()).toHaveAccessibleDescription(
        "Visible to the counterparty.",
      );
    });

    it("marks the field invalid from the error alone", () => {
      render(<TextArea label="Reason" error="A reason is required." />);
      expect(control()).toHaveAttribute("aria-invalid", "true");
    });

    it("draws the invalid border from the same prop", () => {
      const { container } = render(
        <TextArea label="Reason" error="A reason is required." />,
      );
      expect(slot(container).className).toContain("border-border-error");
    });
  });

  it("marks the field required", () => {
    render(<TextArea label="Reason" required />);
    expect(control()).toHaveAttribute("aria-required", "true");
  });

  describe("resize", () => {
    it("allows vertical dragging by default", () => {
      render(<TextArea label="Notes" />);
      expect(control().className).toContain("resize-y");
    });

    it("gives every axis a distinct class", () => {
      const classNames: Array<string> = textAreaResizes.map((resize) => {
        const { unmount } = render(<TextArea label="Notes" resize={resize} />);
        const className: string = control().className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(textAreaResizes.length);
    });

    it("can be pinned entirely", () => {
      render(<TextArea label="Notes" resize="none" />);
      expect(control().className).toContain("resize-none");
    });
  });

  describe("autoResize", () => {
    it("drops the vertical axis, which would fight the growing", () => {
      render(<TextArea label="Notes" autoResize resize="vertical" />);
      expect(control().className).toContain("resize-none");
    });

    it("turns both into horizontal only", () => {
      render(<TextArea label="Notes" autoResize resize="both" />);
      expect(control().className).toContain("resize-x");
    });

    it("leaves horizontal alone — it does not fight vertical growth", () => {
      render(<TextArea label="Notes" autoResize resize="horizontal" />);
      expect(control().className).toContain("resize-x");
    });

    it("leaves none alone", () => {
      render(<TextArea label="Notes" autoResize resize="none" />);
      expect(control().className).toContain("resize-none");
    });

    it("sets an explicit height so the box matches its content", () => {
      render(<TextArea label="Notes" autoResize defaultValue="One line" />);
      expect(control().style.height).not.toBe("");
    });

    it("resets the height before measuring, so it can shrink again", async () => {
      const user = userEvent.setup();
      render(<TextArea label="Notes" autoResize />);
      const element: HTMLTextAreaElement = control();

      // jsdom reports scrollHeight 0, so the assertion is that the reset
      // happened at all rather than the resulting pixel value.
      await user.type(element, "a");
      expect(element.style.height).toBe("0px");
    });

    it("does not touch height when off", () => {
      render(<TextArea label="Notes" defaultValue="One line" />);
      expect(control().style.height).toBe("");
    });
  });

  describe("density", () => {
    it("defaults to comfortable padding", () => {
      const { container } = render(<TextArea label="Notes" />);
      expect(slot(container).className).toContain("py-2");
    });

    it("tightens padding when compact", () => {
      const { container } = render(
        <TextArea label="Notes" density="compact" />,
      );
      expect(slot(container).className).toContain("py-1.5");
    });
  });

  it("disables the control", () => {
    render(<TextArea label="Notes" disabled />);
    expect(control()).toBeDisabled();
  });

  it("works with an aria-label instead of a visible one", () => {
    const { container } = render(<TextArea aria-label="Notes" />);
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });

  it("applies className to the field, not the textarea", () => {
    const { container } = render(<TextArea label="Notes" className="w-64" />);
    expect(container.querySelector("[data-slot='field']")?.className).toContain(
      "w-64",
    );
  });

  it("forwards a ref to the textarea itself", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea label="Notes" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("still auto-resizes when a caller has taken the ref", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea label="Notes" autoResize ref={ref} />);
    await user.type(control(), "a");
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(control().style.height).not.toBe("");
  });

  it("forwards arbitrary native props", () => {
    render(<TextArea label="Notes" placeholder="Anything to flag?" />);
    expect(control()).toHaveAttribute("placeholder", "Anything to flag?");
  });
});
