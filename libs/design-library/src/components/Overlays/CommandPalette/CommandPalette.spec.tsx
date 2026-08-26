import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { resetScrollLockForTests } from "../../../hooks/useScrollLock";
import {
  CommandPalette,
  type CommandPaletteItem,
  type CommandPaletteProps,
} from "./CommandPalette";

afterEach(() => {
  resetScrollLockForTests();
  document.body.style.overflow = "";
});

const commands: Array<CommandPaletteItem> = [
  {
    value: "deal.new",
    label: "New deal",
    group: "Deals",
    shortcut: ["Ctrl", "N"],
  },
  { value: "deal.find", label: "Find a deal", group: "Deals" },
  {
    value: "party.new",
    label: "New counterparty",
    group: "Counterparties",
    description: "Adds a party to the book",
  },
  {
    value: "admin.users",
    label: "Manage users",
    group: "Counterparties",
    disabled: true,
  },
];

const palette = (): HTMLElement => screen.getByRole("dialog");

const input = (): HTMLElement => screen.getByRole("combobox");

const options = (): Array<HTMLElement> => screen.getAllByRole("option");

const active = (): HTMLElement | null => {
  const id: string | null = input().getAttribute("aria-activedescendant");
  return id === null ? null : document.getElementById(id);
};

type HarnessProps = Partial<
  Omit<
    CommandPaletteProps,
    "open" | "onOpenChange" | "query" | "onQueryChange" | "items"
  >
> & { items?: Array<CommandPaletteItem> };

/**
 * Filters app-side, exactly as a real caller would — the palette does no
 * matching of its own, so the harness has to.
 */
const Harness = ({ items, ...props }: HarnessProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const source: Array<CommandPaletteItem> = items ?? commands;
  const visible: Array<CommandPaletteItem> = useMemo(
    () =>
      source.filter((item: CommandPaletteItem) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [source, query],
  );

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Open palette"}
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        items={visible}
        onSelect={vi.fn()}
        label="Commands"
        placeholder="Search commands"
        {...props}
      />
    </>
  );
};

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Open palette" });

const openPalette = async (
  props: HarnessProps = {},
): Promise<ReturnType<typeof userEvent.setup>> => {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(trigger());
  return user;
};

describe("CommandPalette", () => {
  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a modal dialog", async () => {
    await openPalette();
    expect(palette()).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("dialog", { name: "Commands" }),
    ).toBeInTheDocument();
  });

  it("puts focus in the input, not on the list", async () => {
    await openPalette();
    expect(input()).toHaveFocus();
  });

  it("locks page scroll", async () => {
    await openPalette();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("renders into a portal", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <CommandPalette
          open
          onOpenChange={vi.fn()}
          query=""
          onQueryChange={vi.fn()}
          items={commands}
          onSelect={vi.fn()}
          label="Commands"
        />
      </div>,
    );
    expect(container.contains(palette())).toBe(false);
  });

  it("sets its own foreground colour, because a portal inherits none", async () => {
    await openPalette();
    expect(palette().className).toContain("text-fg-default");
  });

  describe("combobox semantics", () => {
    it("is a combobox over a listbox", async () => {
      await openPalette();
      expect(input()).toHaveAttribute("aria-expanded", "true");
      expect(input()).toHaveAttribute(
        "aria-controls",
        screen.getByRole("listbox").id,
      );
    });

    it("keeps DOM focus in the input as the highlight moves", async () => {
      const user = await openPalette();
      await user.keyboard("{ArrowDown}");
      expect(input()).toHaveFocus();
      expect(screen.getByRole("listbox").contains(document.activeElement)).toBe(
        false,
      );
    });

    it("publishes the highlight through aria-activedescendant", async () => {
      await openPalette();
      expect(active()).toHaveTextContent("New deal");
    });
  });

  describe("keyboard", () => {
    it("moves down", async () => {
      const user = await openPalette();
      await user.keyboard("{ArrowDown}");
      expect(active()).toHaveTextContent("Find a deal");
    });

    it("skips a command the user cannot run", async () => {
      const user = await openPalette();
      await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
      expect(active()).toHaveTextContent("New deal");
    });

    it("wraps from the top", async () => {
      const user = await openPalette();
      await user.keyboard("{ArrowUp}");
      expect(active()).toHaveTextContent("New counterparty");
    });

    it("runs the highlighted command on Enter", async () => {
      const onSelect = vi.fn();
      const user = await openPalette({ onSelect });
      await user.keyboard("{ArrowDown}{Enter}");
      expect(onSelect).toHaveBeenCalledWith("deal.find");
    });

    it("closes itself when a command runs", async () => {
      const user = await openPalette();
      await user.keyboard("{Enter}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes on Escape without running anything", async () => {
      const onSelect = vi.fn();
      const user = await openPalette({ onSelect });
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("returns focus to the trigger", async () => {
      const user = await openPalette();
      await user.keyboard("{Escape}");
      expect(trigger()).toHaveFocus();
    });
  });

  describe("searching, which the app owns", () => {
    it("renders exactly what it is handed, without filtering", () => {
      render(
        <CommandPalette
          open
          onOpenChange={vi.fn()}
          query="nothing like these"
          onQueryChange={vi.fn()}
          items={commands}
          onSelect={vi.fn()}
          label="Commands"
        />,
      );
      expect(options()).toHaveLength(commands.length);
    });

    it("reports what was typed", async () => {
      const onQueryChange = vi.fn();
      const user = userEvent.setup();
      render(
        <CommandPalette
          open
          onOpenChange={vi.fn()}
          query=""
          onQueryChange={onQueryChange}
          items={commands}
          onSelect={vi.fn()}
          label="Commands"
        />,
      );
      await user.type(input(), "f");
      expect(onQueryChange).toHaveBeenCalledWith("f");
    });

    it("moves the highlight back to the top of the new results", async () => {
      const user = await openPalette();
      await user.keyboard("{ArrowDown}");
      expect(active()).toHaveTextContent("Find a deal");

      await user.type(input(), "new");
      expect(active()).toHaveTextContent("New deal");
    });

    it("says so when there is nothing to show", async () => {
      const user = await openPalette();
      await user.type(input(), "zzz");
      expect(screen.getByText("No results")).toBeInTheDocument();
      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });

    it("takes a caller-supplied empty message", async () => {
      const user = await openPalette({ emptyMessage: "Nothing matches" });
      await user.type(input(), "zzz");
      expect(screen.getByText("Nothing matches")).toBeInTheDocument();
    });

    it("highlights nothing when there is nothing to highlight", async () => {
      const user = await openPalette();
      await user.type(input(), "zzz");
      expect(active()).toBeNull();
    });
  });

  describe("pointer", () => {
    it("highlights what the pointer is over", async () => {
      const user = await openPalette();
      await user.hover(options()[2]);
      expect(active()).toHaveTextContent("New counterparty");
    });

    it("runs a command on click", async () => {
      const onSelect = vi.fn();
      const user = await openPalette({ onSelect });
      await user.click(options()[1]);
      expect(onSelect).toHaveBeenCalledWith("deal.find");
    });

    it("refuses a command the user cannot run", async () => {
      const onSelect = vi.fn();
      const user = await openPalette({ onSelect });
      await user.click(options()[3]);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("rendering the items", () => {
    it("groups them under their headings, in the order given", async () => {
      await openPalette();
      const groups = screen.getAllByRole("group");
      expect(groups).toHaveLength(2);
      expect(groups[0]).toHaveAccessibleName("Deals");
      expect(groups[1]).toHaveAccessibleName("Counterparties");
    });

    it("shows the description", async () => {
      await openPalette();
      expect(screen.getByText("Adds a party to the book")).toBeInTheDocument();
    });

    it("puts the shortcut in the command's accessible name", async () => {
      await openPalette();
      expect(options()[0]).toHaveAccessibleName(/Ctrl.*N/s);
    });

    it("marks a command the user cannot run", async () => {
      await openPalette();
      expect(options()[3]).toHaveAttribute("aria-disabled", "true");
    });

    it("shows a spinner while the app is fetching", async () => {
      await openPalette({ loading: true });
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders a footer when given one", async () => {
      await openPalette({ footer: <span>{"Enter to run"}</span> });
      expect(screen.getByText("Enter to run")).toBeInTheDocument();
    });
  });

  it("closes on a scrim click", async () => {
    const user = await openPalette();
    const scrim = document.querySelector("[data-slot='command-palette-scrim']");
    await user.click(scrim as HTMLElement);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ignores a click that lands on the panel", async () => {
    const user = await openPalette();
    await user.click(palette());
    expect(palette()).toBeInTheDocument();
  });
});
