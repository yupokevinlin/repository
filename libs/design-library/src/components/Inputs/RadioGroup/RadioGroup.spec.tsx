import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup, type RadioGroupOption } from "./RadioGroup";

const options: Array<RadioGroupOption> = [
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
  { value: "prepaid", label: "Prepaid" },
];

const radio = (name: string): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("radio", { name });

describe("RadioGroup", () => {
  it("is a radiogroup, the APG pattern for this widget", () => {
    render(<RadioGroup legend="Payment terms" options={options} />);
    expect(
      screen.getByRole("radiogroup", { name: "Payment terms" }),
    ).toBeInTheDocument();
  });

  it("renders a real fieldset", () => {
    const { container } = render(
      <RadioGroup legend="Payment terms" options={options} />,
    );
    expect(container.querySelector("fieldset")).toBeInTheDocument();
  });

  it("renders one radio per option", () => {
    render(<RadioGroup legend="Payment terms" options={options} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("gives every option the same generated name, so they are exclusive", () => {
    render(<RadioGroup legend="Payment terms" options={options} />);
    const names = screen
      .getAllByRole<HTMLInputElement>("radio")
      .map((element) => element.name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).not.toBe("");
  });

  it("takes a caller-supplied name", () => {
    render(
      <RadioGroup legend="Payment terms" options={options} name="terms" />,
    );
    expect(radio("Net 30")).toHaveAttribute("name", "terms");
  });

  it("starts from defaultValue", () => {
    render(
      <RadioGroup
        legend="Payment terms"
        options={options}
        defaultValue="net60"
      />,
    );
    expect(radio("Net 60")).toBeChecked();
  });

  it("selects on click and reports the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        legend="Payment terms"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await user.click(radio("Net 60"));
    expect(onValueChange).toHaveBeenCalledWith("net60");
  });

  it("allows only one at a time", async () => {
    const user = userEvent.setup();
    render(<RadioGroup legend="Payment terms" options={options} />);
    await user.click(radio("Net 30"));
    await user.click(radio("Net 60"));
    expect(radio("Net 30")).not.toBeChecked();
    expect(radio("Net 60")).toBeChecked();
  });

  describe("keyboard", () => {
    it("moves and selects with ArrowDown, as radios do", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          legend="Payment terms"
          options={options}
          defaultValue="net30"
        />,
      );
      radio("Net 30").focus();
      await user.keyboard("{ArrowDown}");
      expect(radio("Net 60")).toBeChecked();
      expect(radio("Net 60")).toHaveFocus();
    });

    it("moves backwards with ArrowUp", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          legend="Payment terms"
          options={options}
          defaultValue="net60"
        />,
      );
      radio("Net 60").focus();
      await user.keyboard("{ArrowUp}");
      expect(radio("Net 30")).toBeChecked();
    });

    it("wraps from the last option to the first", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          legend="Payment terms"
          options={options}
          defaultValue="prepaid"
        />,
      );
      radio("Prepaid").focus();
      await user.keyboard("{ArrowDown}");
      expect(radio("Net 30")).toBeChecked();
    });

    it("jumps to the first with Home and the last with End", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          legend="Payment terms"
          options={options}
          defaultValue="net60"
        />,
      );
      radio("Net 60").focus();
      await user.keyboard("{End}");
      expect(radio("Prepaid")).toBeChecked();
      await user.keyboard("{Home}");
      expect(radio("Net 30")).toBeChecked();
    });

    it("skips a disabled option when moving", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          legend="Payment terms"
          options={[
            { value: "net30", label: "Net 30" },
            { value: "net60", label: "Net 60", disabled: true },
            { value: "prepaid", label: "Prepaid" },
          ]}
          defaultValue="net30"
        />,
      );
      radio("Net 30").focus();
      await user.keyboard("{ArrowDown}");
      expect(radio("Prepaid")).toBeChecked();
    });
  });

  describe("roving tabindex", () => {
    it("makes the whole group one Tab stop", async () => {
      const user = userEvent.setup();
      render(
        <>
          <RadioGroup
            legend="Payment terms"
            options={options}
            defaultValue="net60"
          />
          <button>{"After"}</button>
        </>,
      );
      await user.tab();
      expect(radio("Net 60")).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it("makes the selected option the tabbable one", () => {
      render(
        <RadioGroup
          legend="Payment terms"
          options={options}
          defaultValue="prepaid"
        />,
      );
      expect(radio("Prepaid")).toHaveAttribute("tabindex", "0");
      expect(radio("Net 30")).toHaveAttribute("tabindex", "-1");
    });

    it("falls back to the first option when nothing is selected", () => {
      render(<RadioGroup legend="Payment terms" options={options} />);
      expect(radio("Net 30")).toHaveAttribute("tabindex", "0");
    });

    it("never makes a disabled option the tab stop", () => {
      render(
        <RadioGroup
          legend="Payment terms"
          options={[
            { value: "net30", label: "Net 30", disabled: true },
            { value: "net60", label: "Net 60" },
          ]}
        />,
      );
      expect(radio("Net 60")).toHaveAttribute("tabindex", "0");
    });
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState<string>("net30");
      return (
        <RadioGroup
          legend="Payment terms"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    };
    render(<Controlled />);
    await user.click(radio("Prepaid"));
    expect(radio("Prepaid")).toBeChecked();
  });

  it("disables every option", () => {
    render(<RadioGroup legend="Payment terms" options={options} disabled />);
    expect(radio("Net 30")).toBeDisabled();
  });

  it("shows a hint and an error for the group", () => {
    render(
      <RadioGroup
        legend="Payment terms"
        options={options}
        hint="Applies to this deal only."
        error="Choose terms before booking."
      />,
    );
    expect(screen.getByText("Applies to this deal only.")).toBeInTheDocument();
    expect(
      screen.getByText("Choose terms before booking."),
    ).toBeInTheDocument();
  });

  it("marks the legend required", () => {
    render(<RadioGroup legend="Payment terms" options={options} required />);
    expect(
      screen.getByRole("radiogroup", { name: "Payment terms (required)" }),
    ).toBeInTheDocument();
  });
});
