import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { type ListboxOption, useListbox } from "./useListbox";

const options: Array<ListboxOption> = [
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
  { value: "prepaid", label: "Prepaid" },
];

/** The shape every consumer of this hook has: a trigger plus a portal-less list. */
const Harness = ({
  listOptions = options,
  typeAhead = true,
  onValueChange,
}: {
  listOptions?: Array<ListboxOption>;
  typeAhead?: boolean;
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const listbox = useListbox({
    options: listOptions,
    value,
    onValueChange: (next: string) => {
      setValue(next);
      onValueChange?.(next);
    },
    open,
    onOpenChange: setOpen,
    idPrefix: "harness",
    typeAhead,
  });

  return (
    <>
      <button
        data-testid="trigger"
        // The same explicit role Select carries: without it the rule checks the
        // implicit button role, which does not support aria-activedescendant.
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? "harness-list" : undefined}
        aria-activedescendant={listbox.activeId}
        onKeyDown={listbox.onKeyDown}
      >
        {value === "" ? "Choose" : value}
      </button>
      {open && (
        <ul id="harness-list" role="listbox" data-testid="list">
          {listOptions.map((option: ListboxOption, index: number) => (
            <li
              key={option.value}
              id={listbox.optionId(index)}
              role="option"
              aria-selected={option.value === value}
              data-active={index === listbox.activeIndex ? "true" : undefined}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const trigger = (): HTMLElement => screen.getByTestId("trigger");

const activeLabel = (): string | undefined =>
  screen.queryByTestId("list")?.querySelector("[data-active='true']")
    ?.textContent ?? undefined;

describe("useListbox", () => {
  it("opens on ArrowDown from a closed list", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByTestId("list")).toBeInTheDocument();
  });

  it("opens on ArrowUp too", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByTestId("list")).toBeInTheDocument();
  });

  it("highlights the first option on opening when nothing is chosen", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    expect(activeLabel()).toBe("Net 30");
  });

  it("moves down through the list", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(activeLabel()).toBe("Net 60");
  });

  it("wraps from the last option to the first", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(activeLabel()).toBe("Net 30");
  });

  it("moves up, wrapping to the end", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}{ArrowUp}");
    expect(activeLabel()).toBe("Prepaid");
  });

  it("jumps to the first with Home and the last with End", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}{End}");
    expect(activeLabel()).toBe("Prepaid");
    await user.keyboard("{Home}");
    expect(activeLabel()).toBe("Net 30");
  });

  it("skips a disabled option", async () => {
    const user = userEvent.setup();
    render(
      <Harness
        listOptions={[
          { value: "net30", label: "Net 30" },
          { value: "net60", label: "Net 60", disabled: true },
          { value: "prepaid", label: "Prepaid" },
        ]}
      />,
    );
    trigger().focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(activeLabel()).toBe("Prepaid");
  });

  describe("Alt", () => {
    it("opens without moving the highlight on Alt+ArrowDown", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
      expect(screen.getByTestId("list")).toBeInTheDocument();
    });

    it("closes on Alt+ArrowUp", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
      expect(screen.queryByTestId("list")).not.toBeInTheDocument();
    });
  });

  describe("choosing", () => {
    it("chooses the highlighted option on Enter", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Harness onValueChange={onValueChange} />);
      trigger().focus();
      await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
      expect(onValueChange).toHaveBeenCalledWith("net60");
    });

    it("closes after choosing", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{ArrowDown}{Enter}");
      expect(screen.queryByTestId("list")).not.toBeInTheDocument();
    });

    it("opens on the chosen option next time, not the top", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
      await user.keyboard("{ArrowDown}");
      expect(activeLabel()).toBe("Net 60");
    });

    it("never chooses a disabled option", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Harness
          listOptions={[{ value: "net30", label: "Net 30", disabled: true }]}
          onValueChange={onValueChange}
        />,
      );
      trigger().focus();
      await user.keyboard("{ArrowDown}{Enter}");
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("dismissal", () => {
    it("closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{ArrowDown}{Escape}");
      expect(screen.queryByTestId("list")).not.toBeInTheDocument();
    });

    it("closes on Tab rather than leaving a popup over the next field", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{ArrowDown}");
      await user.tab();
      expect(screen.queryByTestId("list")).not.toBeInTheDocument();
    });
  });

  describe("type-ahead", () => {
    it("jumps to a matching option", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("{ArrowDown}p");
      expect(activeLabel()).toBe("Prepaid");
    });

    it("extends the search so two letters can separate similar labels", async () => {
      const user = userEvent.setup();
      render(
        <Harness
          listOptions={[
            { value: "net30", label: "Net 30" },
            { value: "net60", label: "Net 60" },
          ]}
        />,
      );
      trigger().focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("net 6");
      expect(activeLabel()).toBe("Net 60");
    });

    it("opens a closed list when a letter is typed", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      trigger().focus();
      await user.keyboard("p");
      expect(screen.getByTestId("list")).toBeInTheDocument();
    });

    it("stays out of the way when off, so a Combobox keeps its letters", async () => {
      const user = userEvent.setup();
      render(<Harness typeAhead={false} />);
      trigger().focus();
      await user.keyboard("{ArrowDown}p");
      expect(activeLabel()).toBe("Net 30");
    });
  });

  it("publishes the highlight through aria-activedescendant, not focus", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    expect(trigger()).toHaveAttribute(
      "aria-activedescendant",
      "harness-option-0",
    );
    // The whole point: DOM focus has not moved into the list.
    expect(trigger()).toHaveFocus();
  });

  it("clears the highlight when it closes", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    trigger().focus();
    await user.keyboard("{ArrowDown}{Escape}");
    expect(trigger()).not.toHaveAttribute("aria-activedescendant");
  });
});
