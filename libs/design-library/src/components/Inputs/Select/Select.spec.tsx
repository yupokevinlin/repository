import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Select, type SelectOption } from "./Select";

const options: Array<SelectOption> = [
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
  { value: "prepaid", label: "Prepaid" },
];

const trigger = (): HTMLElement => screen.getByRole("combobox");

const listbox = (): HTMLElement => screen.getByRole("listbox");

describe("Select", () => {
  it("is a combobox, never a menu", async () => {
    const user = userEvent.setup();
    render(<Select label="Payment terms" options={options} />);
    expect(trigger()).toBeInTheDocument();
    await user.click(trigger());
    expect(listbox()).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders its own label, tied to the trigger", () => {
    render(<Select label="Payment terms" options={options} />);
    expect(
      screen.getByRole("combobox", { name: "Payment terms" }),
    ).toBeInTheDocument();
  });

  it("shows the placeholder when nothing is chosen", () => {
    render(
      <Select label="Terms" options={options} placeholder="Choose terms" />,
    );
    expect(screen.getByText("Choose terms")).toBeInTheDocument();
  });

  it("shows the chosen option's label", () => {
    render(<Select label="Terms" options={options} defaultValue="net60" />);
    expect(screen.getByText("Net 60")).toBeInTheDocument();
  });

  it("says it is collapsed until opened", () => {
    render(<Select label="Terms" options={options} />);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on click", async () => {
    const user = userEvent.setup();
    render(<Select label="Terms" options={options} />);
    await user.click(trigger());
    expect(listbox()).toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("renders one option per entry", async () => {
    const user = userEvent.setup();
    render(<Select label="Terms" options={options} />);
    await user.click(trigger());
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("marks the chosen option selected", async () => {
    const user = userEvent.setup();
    render(<Select label="Terms" options={options} defaultValue="net60" />);
    await user.click(trigger());
    expect(screen.getByRole("option", { name: "Net 60" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("chooses on click and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select label="Terms" options={options} onValueChange={onValueChange} />,
    );
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Prepaid" }));
    expect(onValueChange).toHaveBeenCalledWith("prepaid");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("returns focus to the trigger after a pointer choice", async () => {
    const user = userEvent.setup();
    render(<Select label="Terms" options={options} />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Prepaid" }));
    expect(trigger()).toHaveFocus();
  });

  it("ignores a click on a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        label="Terms"
        options={[{ value: "cod", label: "Cash on delivery", disabled: true }]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Cash on delivery" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe("keyboard", () => {
    it("opens on ArrowDown and chooses with Enter", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Select
          label="Terms"
          options={options}
          onValueChange={onValueChange}
        />,
      );
      trigger().focus();
      await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
      expect(onValueChange).toHaveBeenCalledWith("net60");
    });

    it("keeps DOM focus on the trigger while navigating", async () => {
      const user = userEvent.setup();
      render(<Select label="Terms" options={options} />);
      trigger().focus();
      await user.keyboard("{ArrowDown}{ArrowDown}");
      expect(trigger()).toHaveFocus();
      expect(trigger()).toHaveAttribute("aria-activedescendant");
    });

    it("points aria-activedescendant at a real option element", async () => {
      const user = userEvent.setup();
      render(<Select label="Terms" options={options} />);
      trigger().focus();
      await user.keyboard("{ArrowDown}");
      const activeId: string | null = trigger().getAttribute(
        "aria-activedescendant",
      );
      expect(activeId).not.toBeNull();
      expect(document.getElementById(activeId ?? "")).toHaveAttribute(
        "role",
        "option",
      );
    });

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Select label="Terms" options={options} />);
      trigger().focus();
      await user.keyboard("{ArrowDown}{Escape}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("jumps by type-ahead", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Select
          label="Terms"
          options={options}
          onValueChange={onValueChange}
        />,
      );
      trigger().focus();
      await user.keyboard("p{Enter}");
      expect(onValueChange).toHaveBeenCalledWith("prepaid");
    });
  });

  it("closes on a click outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Select label="Terms" options={options} />
        <button>{"Outside"}</button>
      </>,
    );
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders the listbox in a portal, so no panel can clip it", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Select label="Terms" options={options} />
      </div>,
    );
    await user.click(trigger());
    expect(container.contains(listbox())).toBe(false);
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState<string>("");
      return (
        <Select
          label="Terms"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    };
    render(<Controlled />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Prepaid" }));
    expect(screen.getByText("Prepaid")).toBeInTheDocument();
  });

  it("describes the field with its hint", () => {
    render(
      <Select label="Terms" options={options} hint="Applies to this deal." />,
    );
    expect(trigger()).toHaveAccessibleDescription("Applies to this deal.");
  });

  it("marks the field invalid from its error", () => {
    render(<Select label="Terms" options={options} error="Choose terms." />);
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the control", () => {
    render(<Select label="Terms" options={options} disabled />);
    expect(trigger()).toBeDisabled();
  });

  it("works with an aria-label and no visible one", () => {
    const { container } = render(
      <Select aria-label="Status" options={options} />,
    );
    expect(
      screen.getByRole("combobox", { name: "Status" }),
    ).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });
});
