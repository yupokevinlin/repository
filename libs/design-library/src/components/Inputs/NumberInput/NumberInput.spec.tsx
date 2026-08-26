import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { NumberInput } from "./NumberInput";

const control = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("textbox");

describe("NumberInput", () => {
  it("is a text input, never type='number'", () => {
    render(<NumberInput label="Quantity" />);
    expect(control()).toHaveAttribute("type", "text");
  });

  it("still asks for a numeric keypad on a phone", () => {
    render(<NumberInput label="Quantity" />);
    expect(control()).toHaveAttribute("inputmode", "decimal");
  });

  it("renders its own label, tied to the field", () => {
    render(<NumberInput label="Quantity" />);
    expect(
      screen.getByRole("textbox", { name: "Quantity" }),
    ).toBeInTheDocument();
  });

  it("reports the raw string, not a number", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Quantity" onValueChange={onValueChange} />);
    await user.type(control(), "12");
    expect(onValueChange).toHaveBeenLastCalledWith("12");
  });

  it("lets a half-typed decimal through, so the field can be typed in", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Quantity" onValueChange={onValueChange} />);
    await user.type(control(), "1.");
    expect(onValueChange).toHaveBeenLastCalledWith("1.");
  });

  it("refuses letters rather than silently dropping them", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Quantity" onValueChange={onValueChange} />);
    await user.type(control(), "a");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("refuses a second decimal point", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Quantity" defaultValue="1.5" />);
    await user.type(control(), ".");
    expect(control().value).toBe("1.5");
  });

  describe("formatting", () => {
    it("groups thousands at rest", () => {
      render(
        <NumberInput label="Quantity" defaultValue="1234567" locale="en-CA" />,
      );
      expect(control().value).toBe("1,234,567");
    });

    it("shows the raw value once focused, so it can be edited", async () => {
      const user = userEvent.setup();
      render(
        <NumberInput label="Quantity" defaultValue="1234567" locale="en-CA" />,
      );
      await user.click(control());
      expect(control().value).toBe("1234567");
    });

    it("re-formats on blur", async () => {
      const user = userEvent.setup();
      render(
        <>
          <NumberInput label="Quantity" defaultValue="1234567" locale="en-CA" />
          <button>{"Elsewhere"}</button>
        </>,
      );
      await user.click(control());
      await user.click(screen.getByRole("button"));
      expect(control().value).toBe("1,234,567");
    });

    it("pads to a fixed number of decimals at rest", () => {
      render(
        <NumberInput
          label="Unit price"
          defaultValue="1234.5"
          decimals={2}
          locale="en-CA"
        />,
      );
      expect(control().value).toBe("1,234.50");
    });

    it("can be told not to group", () => {
      render(
        <NumberInput
          label="Containers"
          defaultValue="1234"
          grouping={false}
          locale="en-CA"
        />,
      );
      expect(control().value).toBe("1234");
    });
  });

  describe("bounds", () => {
    it("clamps on blur, not while typing", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <>
          <NumberInput
            label="Quantity"
            max={100}
            onValueChange={onValueChange}
          />
          <button>{"Elsewhere"}</button>
        </>,
      );
      await user.type(control(), "150");
      expect(onValueChange).toHaveBeenLastCalledWith("150");

      await user.click(screen.getByRole("button"));
      expect(onValueChange).toHaveBeenLastCalledWith("100");
    });

    it("raises a value below the minimum on blur", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <>
          <NumberInput label="Quantity" min={0} onValueChange={onValueChange} />
          <button>{"Elsewhere"}</button>
        </>,
      );
      await user.type(control(), "-5");
      await user.click(screen.getByRole("button"));
      expect(onValueChange).toHaveBeenLastCalledWith("0");
    });
  });

  describe("controlled and uncontrolled", () => {
    it("manages its own value when uncontrolled", async () => {
      const user = userEvent.setup();
      render(<NumberInput label="Quantity" />);
      await user.type(control(), "42");
      expect(control().value).toBe("42");
    });

    it("follows its owner when controlled", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [value, setValue] = useState<string>("");
        return (
          <NumberInput
            label="Quantity"
            value={value}
            onValueChange={setValue}
          />
        );
      };
      render(<Controlled />);
      await user.type(control(), "42");
      expect(control().value).toBe("42");
    });

    it("stays put when controlled and the owner ignores the change", async () => {
      const user = userEvent.setup();
      render(<NumberInput label="Quantity" value="7" />);
      await user.type(control(), "9");
      expect(control().value).toBe("7");
    });
  });

  it("renders a suffix", () => {
    const { container } = render(<NumberInput label="Quantity" suffix="kg" />);
    expect(
      container.querySelector("[data-slot='number-input-suffix']")?.textContent,
    ).toBe("kg");
  });

  it("marks the field invalid from its error", () => {
    render(<NumberInput label="Quantity" error="Exceeds allocation." />);
    expect(control()).toHaveAttribute("aria-invalid", "true");
  });

  it("describes the field with its hint", () => {
    render(<NumberInput label="Quantity" hint="Metric tonnes." />);
    expect(control()).toHaveAccessibleDescription("Metric tonnes.");
  });

  it("marks the field required", () => {
    render(<NumberInput label="Quantity" required />);
    expect(control()).toHaveAttribute("aria-required", "true");
  });

  it("disables the control", () => {
    render(<NumberInput label="Quantity" disabled />);
    expect(control()).toBeDisabled();
  });
});
