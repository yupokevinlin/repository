import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import type { SelectOption } from "../Select";
import { type Quantity, QuantityInput } from "./QuantityInput";

const units: Array<SelectOption> = [
  { value: "MT", label: "MT" },
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

const amount = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("textbox");

const unit = (): HTMLElement => screen.getByRole("combobox");

describe("QuantityInput", () => {
  it("renders one label for the whole control", () => {
    const { container } = render(
      <QuantityInput label="Quantity" units={units} />,
    );
    expect(container.querySelectorAll("label")).toHaveLength(1);
  });

  it("renders one field wrapper, not two", () => {
    const { container } = render(
      <QuantityInput label="Quantity" units={units} />,
    );
    expect(container.querySelectorAll("[data-slot='field']")).toHaveLength(1);
  });

  it("is a text input with a numeric keypad", () => {
    render(<QuantityInput label="Quantity" units={units} />);
    expect(amount()).toHaveAttribute("type", "text");
    expect(amount()).toHaveAttribute("inputmode", "decimal");
  });

  it("names the unit select", () => {
    render(<QuantityInput label="Quantity" units={units} />);
    expect(screen.getByRole("combobox", { name: "Unit" })).toBeInTheDocument();
  });

  describe("the value stays whole", () => {
    it("carries the unit when the amount changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "", unit: "MT" }}
          onValueChange={onValueChange}
        />,
      );
      await user.type(amount(), "40");

      const quantity = onValueChange.mock.lastCall?.[0] as Quantity;
      expect(quantity.amount).toBe("40");
      expect(quantity.unit).toBe("MT");
    });

    it("carries the amount when the unit changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "40", unit: "MT" }}
          onValueChange={onValueChange}
        />,
      );
      await user.click(unit());
      await user.click(screen.getByRole("option", { name: "kg" }));

      const quantity = onValueChange.mock.lastCall?.[0] as Quantity;
      expect(quantity.amount).toBe("40");
      expect(quantity.unit).toBe("kg");
    });
  });

  describe("the frozen conversion factor", () => {
    it("is shown in the hint", () => {
      render(
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "40", unit: "MT" }}
          conversionFactor={{ factor: "1,000", toUnit: "kg" }}
        />,
      );
      expect(screen.getByText(/1 MT = 1,000 kg/)).toBeInTheDocument();
    });

    it("says it is frozen, so nobody reads it as a live rate", () => {
      render(
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "40", unit: "MT" }}
          conversionFactor={{ factor: "1,000", toUnit: "kg" }}
        />,
      );
      expect(screen.getByText(/frozen at booking/)).toBeInTheDocument();
    });

    it("joins a caller's hint rather than replacing it", () => {
      render(
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "40", unit: "MT" }}
          hint="Gross weight."
          conversionFactor={{ factor: "1,000", toUnit: "kg" }}
        />,
      );
      expect(screen.getByText(/Gross weight\./)).toBeInTheDocument();
      expect(screen.getByText(/1,000 kg/)).toBeInTheDocument();
    });

    it("describes the field, so it is announced with it", () => {
      render(
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "40", unit: "MT" }}
          conversionFactor={{ factor: "1,000", toUnit: "kg" }}
        />,
      );
      expect(amount()).toHaveAccessibleDescription(/1 MT = 1,000 kg/);
    });

    it("is absent when no factor is given", () => {
      render(<QuantityInput label="Quantity" units={units} />);
      expect(screen.queryByText(/frozen at booking/)).not.toBeInTheDocument();
    });
  });

  it("groups and pads at rest, to three decimals by default", () => {
    render(
      <QuantityInput
        label="Quantity"
        units={units}
        defaultValue={{ amount: "1234.5", unit: "MT" }}
        locale="en-CA"
      />,
    );
    expect(amount().value).toBe("1,234.500");
  });

  it("shows the raw amount once focused", async () => {
    const user = userEvent.setup();
    render(
      <QuantityInput
        label="Quantity"
        units={units}
        defaultValue={{ amount: "1234.5", unit: "MT" }}
        locale="en-CA"
      />,
    );
    await user.click(amount());
    expect(amount().value).toBe("1234.5");
  });

  it("refuses letters", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <QuantityInput
        label="Quantity"
        units={units}
        onValueChange={onValueChange}
      />,
    );
    await user.type(amount(), "a");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clamps on blur", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <QuantityInput
          label="Quantity"
          units={units}
          defaultValue={{ amount: "", unit: "MT" }}
          min={0}
          onValueChange={onValueChange}
        />
        <button>{"Elsewhere"}</button>
      </>,
    );
    await user.type(amount(), "-5");
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));

    const quantity = onValueChange.mock.lastCall?.[0] as Quantity;
    expect(quantity.amount).toBe("0");
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [quantity, setQuantity] = useState<Quantity>({
        amount: "",
        unit: "MT",
      });
      return (
        <QuantityInput
          label="Quantity"
          units={units}
          value={quantity}
          onValueChange={setQuantity}
        />
      );
    };
    render(<Controlled />);
    await user.type(amount(), "42");
    expect(amount().value).toBe("42");
  });

  it("marks the field invalid from its error", () => {
    render(
      <QuantityInput
        label="Quantity"
        units={units}
        error="Exceeds the allocation."
      />,
    );
    expect(amount()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables both halves together", () => {
    render(<QuantityInput label="Quantity" units={units} disabled />);
    expect(amount()).toBeDisabled();
    expect(unit()).toBeDisabled();
  });
});
