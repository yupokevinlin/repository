import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Combobox, type ComboboxOption } from "./Combobox";

const options: Array<ComboboxOption> = [
  { value: "kanto", label: "Kanto Polymer KK" },
  { value: "maersk", label: "Maersk Line" },
  { value: "sinochem", label: "Sinochem International" },
];

const input = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("combobox");

const listbox = (): HTMLElement => screen.getByRole("listbox");

describe("Combobox", () => {
  it("is a combobox with a text input", () => {
    render(<Combobox label="Counterparty" options={options} />);
    expect(input()).toHaveAttribute("type", "text");
    expect(input()).toHaveAttribute("aria-autocomplete", "list");
  });

  it("renders its own label, tied to the input", () => {
    render(<Combobox label="Counterparty" options={options} />);
    expect(
      screen.getByRole("combobox", { name: "Counterparty" }),
    ).toBeInTheDocument();
  });

  it("opens as soon as the user types", async () => {
    const user = userEvent.setup();
    render(<Combobox label="Counterparty" options={options} />);
    await user.type(input(), "k");
    expect(listbox()).toBeInTheDocument();
  });

  describe("filtering", () => {
    it("narrows the list as the user types", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "maer");
      expect(screen.getAllByRole("option")).toHaveLength(1);
    });

    it("matches anywhere in the label, not only at the start", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "polymer");
      expect(
        screen.getByRole("option", { name: "Kanto Polymer KK" }),
      ).toBeInTheDocument();
    });

    it("ignores case", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "MAERSK");
      expect(screen.getAllByRole("option")).toHaveLength(1);
    });

    it("says so when nothing matches", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "zzz");
      expect(screen.getByText("No matches")).toBeInTheDocument();
      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });

    it("takes a caller-supplied empty message", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          label="Vessel"
          options={options}
          emptyText="No vessel by that name"
        />,
      );
      await user.type(input(), "zzz");
      expect(screen.getByText("No vessel by that name")).toBeInTheDocument();
    });

    it("can be handed over entirely, for a server-side search", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          label="Counterparty"
          options={options}
          filter={(all: Array<ComboboxOption>) => all}
        />,
      );
      await user.type(input(), "zzz");
      expect(screen.getAllByRole("option")).toHaveLength(3);
    });
  });

  describe("choosing", () => {
    it("reports the value and fills the input with its label", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox
          label="Counterparty"
          options={options}
          onValueChange={onValueChange}
        />,
      );
      await user.type(input(), "maer");
      await user.click(screen.getByRole("option", { name: "Maersk Line" }));
      expect(onValueChange).toHaveBeenCalledWith("maersk");
      expect(input().value).toBe("Maersk Line");
    });

    it("closes after choosing", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "maer");
      await user.click(screen.getByRole("option", { name: "Maersk Line" }));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("chooses the highlighted option on Enter", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox
          label="Counterparty"
          options={options}
          onValueChange={onValueChange}
        />,
      );
      await user.type(input(), "s");
      await user.keyboard("{ArrowDown}{Enter}");
      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("keyboard", () => {
    it("keeps DOM focus in the input while the highlight moves", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "a");
      await user.keyboard("{ArrowDown}");
      expect(input()).toHaveFocus();
      expect(input()).toHaveAttribute("aria-activedescendant");
    });

    it("sends letters to the input rather than to a jump-to search", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "sino");
      expect(input().value).toBe("sino");
    });

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Combobox label="Counterparty" options={options} />);
      await user.type(input(), "a");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("blur", () => {
    it("snaps the text back to the chosen option", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Combobox label="Counterparty" options={options} />
          <button>{"Elsewhere"}</button>
        </>,
      );
      await user.type(input(), "maer");
      await user.click(screen.getByRole("option", { name: "Maersk Line" }));
      await user.type(input(), "xyz");
      await user.click(screen.getByRole("button", { name: "Elsewhere" }));
      expect(input().value).toBe("Maersk Line");
    });

    it("clears a half-typed search when nothing was chosen", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Combobox label="Counterparty" options={options} />
          <button>{"Elsewhere"}</button>
        </>,
      );
      await user.type(input(), "maer");
      await user.click(screen.getByRole("button", { name: "Elsewhere" }));
      expect(input().value).toBe("");
    });
  });

  it("renders the listbox in a portal", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Combobox label="Counterparty" options={options} />
      </div>,
    );
    await user.type(input(), "a");
    expect(container.contains(listbox())).toBe(false);
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState<string>("");
      const [text, setText] = useState<string>("");
      return (
        <Combobox
          label="Counterparty"
          options={options}
          value={value}
          onValueChange={setValue}
          inputValue={text}
          onInputValueChange={setText}
        />
      );
    };
    render(<Controlled />);
    await user.type(input(), "maer");
    await user.click(screen.getByRole("option", { name: "Maersk Line" }));
    expect(input().value).toBe("Maersk Line");
  });

  it("describes the field with its hint", () => {
    render(
      <Combobox label="Counterparty" options={options} hint="Legal entity." />,
    );
    expect(input()).toHaveAccessibleDescription("Legal entity.");
  });

  it("marks the field invalid from its error", () => {
    render(
      <Combobox
        label="Counterparty"
        options={options}
        error="Unknown party."
      />,
    );
    expect(input()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the control", () => {
    render(<Combobox label="Counterparty" options={options} disabled />);
    expect(input()).toBeDisabled();
  });

  it("turns off the browser's own autocomplete, which would cover the list", () => {
    render(<Combobox label="Counterparty" options={options} />);
    expect(input()).toHaveAttribute("autocomplete", "off");
  });
});
