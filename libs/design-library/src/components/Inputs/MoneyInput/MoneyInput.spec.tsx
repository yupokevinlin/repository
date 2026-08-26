import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import type { SelectOption } from "../Select";
import { type Money, MoneyInput } from "./MoneyInput";

const currencies: Array<SelectOption> = [
  { value: "CAD", label: "CAD" },
  { value: "USD", label: "USD" },
  { value: "JPY", label: "JPY" },
];

const amount = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("textbox");

const currency = (): HTMLElement => screen.getByRole("combobox");

describe("MoneyInput", () => {
  it("renders one label for the whole control, not two", () => {
    const { container } = render(
      <MoneyInput label="Unit price" currencies={currencies} />,
    );
    expect(container.querySelectorAll("label")).toHaveLength(1);
  });

  it("renders one field wrapper, not two", () => {
    const { container } = render(
      <MoneyInput label="Unit price" currencies={currencies} />,
    );
    expect(container.querySelectorAll("[data-slot='field']")).toHaveLength(1);
  });

  it("is a text input with a numeric keypad, never type=number", () => {
    render(<MoneyInput label="Unit price" currencies={currencies} />);
    expect(amount()).toHaveAttribute("type", "text");
    expect(amount()).toHaveAttribute("inputmode", "decimal");
  });

  it("offers the currencies given", async () => {
    const user = userEvent.setup();
    render(<MoneyInput label="Unit price" currencies={currencies} />);
    await user.click(currency());
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("names the currency select, since it has no visible label", () => {
    render(<MoneyInput label="Unit price" currencies={currencies} />);
    expect(
      screen.getByRole("combobox", { name: "Currency" }),
    ).toBeInTheDocument();
  });

  describe("the value stays whole", () => {
    it("reports amount and currency together when the amount changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          defaultValue={{ amount: "", currency: "CAD" }}
          onValueChange={onValueChange}
        />,
      );
      await user.type(amount(), "40");

      const money = onValueChange.mock.lastCall?.[0] as Money;
      expect(money.amount).toBe("40");
      expect(money.currency).toBe("CAD");
    });

    it("keeps the amount when the currency changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          defaultValue={{ amount: "1200", currency: "CAD" }}
          onValueChange={onValueChange}
        />,
      );
      await user.click(currency());
      await user.click(screen.getByRole("option", { name: "USD" }));

      const money = onValueChange.mock.lastCall?.[0] as Money;
      expect(money.amount).toBe("1200");
      expect(money.currency).toBe("USD");
    });
  });

  describe("formatting", () => {
    it("groups and pads at rest", () => {
      render(
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          defaultValue={{ amount: "1234.5", currency: "CAD" }}
          locale="en-CA"
        />,
      );
      expect(amount().value).toBe("1,234.50");
    });

    it("shows the raw amount once focused", async () => {
      const user = userEvent.setup();
      render(
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          defaultValue={{ amount: "1234.5", currency: "CAD" }}
          locale="en-CA"
        />,
      );
      await user.click(amount());
      expect(amount().value).toBe("1234.5");
    });

    it("takes a decimal count", () => {
      render(
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          defaultValue={{ amount: "1234", currency: "JPY" }}
          decimals={0}
          locale="en-CA"
        />,
      );
      expect(amount().value).toBe("1,234");
    });
  });

  it("refuses letters in the amount", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MoneyInput
        label="Unit price"
        currencies={currencies}
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
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          defaultValue={{ amount: "", currency: "CAD" }}
          min={0}
          onValueChange={onValueChange}
        />
        <button>{"Elsewhere"}</button>
      </>,
    );
    await user.type(amount(), "-5");
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));

    const money = onValueChange.mock.lastCall?.[0] as Money;
    expect(money.amount).toBe("0");
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [money, setMoney] = useState<Money>({
        amount: "",
        currency: "CAD",
      });
      return (
        <MoneyInput
          label="Unit price"
          currencies={currencies}
          value={money}
          onValueChange={setMoney}
        />
      );
    };
    render(<Controlled />);
    await user.type(amount(), "42");
    expect(amount().value).toBe("42");
  });

  it("describes the field with its hint", () => {
    render(
      <MoneyInput
        label="Freight"
        currencies={currencies}
        hint="Excludes demurrage."
      />,
    );
    expect(amount()).toHaveAccessibleDescription("Excludes demurrage.");
  });

  it("marks the field invalid from its error", () => {
    render(
      <MoneyInput
        label="Unit price"
        currencies={currencies}
        error="A price is required."
      />,
    );
    expect(amount()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables both halves together", () => {
    render(<MoneyInput label="Unit price" currencies={currencies} disabled />);
    expect(amount()).toBeDisabled();
    expect(currency()).toBeDisabled();
  });
});
