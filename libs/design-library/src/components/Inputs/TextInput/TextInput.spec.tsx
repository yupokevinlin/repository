import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { TextInput, textInputSizes } from "./TextInput";

const slot = (container: HTMLElement, name = "text-input"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("TextInput", () => {
  it("renders a text input", () => {
    render(<TextInput label="Deal number" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("renders its own label, tied to the field", () => {
    render(<TextInput label="Deal number" />);
    expect(
      screen.getByRole("textbox", { name: "Deal number" }),
    ).toBeInTheDocument();
  });

  it("focuses the field when its label is clicked", async () => {
    const user = userEvent.setup();
    render(<TextInput label="Deal number" />);
    await user.click(screen.getByText("Deal number"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("takes typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextInput label="Deal number" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "NPM");
    expect(onChange).toHaveBeenCalled();
  });

  it("works with an aria-label instead of a visible one", () => {
    const { container } = render(<TextInput aria-label="Quantity" />);
    expect(
      screen.getByRole("textbox", { name: "Quantity" }),
    ).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });

  describe("hint and error", () => {
    it("describes the field with its hint", () => {
      render(<TextInput label="Counterparty" hint="Legal entity name." />);
      expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
        "Legal entity name.",
      );
    });

    it("marks the field invalid from the error alone", () => {
      render(<TextInput label="Deal number" error="Already in use." />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("draws the invalid border from the same prop", () => {
      const { container } = render(
        <TextInput label="Deal number" error="Already in use." />,
      );
      expect(slot(container).className).toContain("border-border-error");
    });

    it("draws the normal border when valid", () => {
      const { container } = render(<TextInput label="Deal number" />);
      const className: string = slot(container).className;
      expect(className).toContain("border-border-strong");
      expect(className).not.toContain("border-border-error");
    });
  });

  describe("required", () => {
    it("marks the field required", () => {
      render(<TextInput label="Deal number" required />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-required",
        "true",
      );
    });

    it("renders the marker in its label", () => {
      render(<TextInput label="Deal number" required />);
      expect(
        screen.getByRole("textbox", { name: "Deal number (required)" }),
      ).toBeInTheDocument();
    });
  });

  describe("size", () => {
    it("defaults to 40px", () => {
      const { container } = render(<TextInput label="Deal number" />);
      expect(slot(container).className).toContain("h-10");
    });

    it("gives every size a distinct set of classes", () => {
      const classNames: Array<string> = textInputSizes.map((size) => {
        const { container, unmount } = render(
          <TextInput label="Deal number" size={size} />,
        );
        const className: string = slot(container).className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(textInputSizes.length);
    });

    it("keeps its height under compact density — the axes are orthogonal", () => {
      const { container } = render(
        <TextInput label="Deal number" size="10" density="compact" />,
      );
      expect(slot(container).className).toContain("h-10");
    });
  });

  describe("icons", () => {
    it("renders neither by default", () => {
      const { container } = render(<TextInput label="Deal number" />);
      expect(
        container.querySelector("[data-slot='text-input-start-icon']"),
      ).toBeNull();
      expect(
        container.querySelector("[data-slot='text-input-end-icon']"),
      ).toBeNull();
    });

    it("renders a start icon", () => {
      const { container } = render(
        <TextInput label="Search" startIcon={<svg data-testid="icon" />} />,
      );
      expect(slot(container, "text-input-start-icon")).toBeInTheDocument();
    });

    it("renders an end icon", () => {
      const { container } = render(
        <TextInput label="Rate" endIcon={<svg data-testid="icon" />} />,
      );
      expect(slot(container, "text-input-end-icon")).toBeInTheDocument();
    });

    it("sizes icons with the control", () => {
      const { container } = render(
        <TextInput
          label="Search"
          size="12"
          startIcon={<svg data-testid="icon" />}
        />,
      );
      expect(slot(container, "text-input-start-icon").className).toContain(
        "size-6",
      );
    });
  });

  describe("disabled", () => {
    it("disables the control", () => {
      render(<TextInput label="Deal number" disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("greys the box through the input's own state", () => {
      const { container } = render(<TextInput label="Deal number" disabled />);
      expect(slot(container).className).toContain(
        "has-[:disabled]:bg-bg-disabled",
      );
    });
  });

  it("puts the focus ring on the box, so it surrounds the icons too", () => {
    const { container } = render(
      <TextInput label="Search" startIcon={<svg />} />,
    );
    expect(slot(container).className).toContain(
      "has-[:focus-visible]:outline-2",
    );
  });

  it("applies className to the field, not the input", () => {
    const { container } = render(
      <TextInput label="Deal number" className="w-64" />,
    );
    expect(container.querySelector("[data-slot='field']")?.className).toContain(
      "w-64",
    );
  });

  it("forwards a ref to the input itself", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput label="Deal number" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards arbitrary native props to the input", () => {
    render(<TextInput label="Deal number" placeholder="NPM-1042" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "NPM-1042",
    );
  });

  it("lets a caller override the type, for email and the like", () => {
    render(<TextInput label="Email" type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });
});
