import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MenuGroup } from "../Menu/MenuGroup";
import { MenuItem } from "../Menu/MenuItem";
import { MenuSeparator } from "../Menu/MenuSeparator";
import { DropdownMenu } from "./DropdownMenu";

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Deal actions" });

const menu = (): HTMLElement => screen.getByRole("menu");

const item = (name: string): HTMLElement =>
  screen.getByRole("menuitem", { name });

const Basic = ({ onPick }: { onPick?: () => void }) => (
  <DropdownMenu
    aria-label="Deal actions"
    content={
      <>
        <MenuItem onClick={onPick}>{"Duplicate"}</MenuItem>
        <MenuItem>{"Amend"}</MenuItem>
        <MenuSeparator />
        <MenuItem severity="error">{"Delete deal"}</MenuItem>
      </>
    }
  >
    <button>{"Deal actions"}</button>
  </DropdownMenu>
);

describe("DropdownMenu", () => {
  it("is a menu of commands, not a listbox", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(menu()).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("says the trigger opens a menu", () => {
    render(<Basic />);
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("names the menu", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(
      screen.getByRole("menu", { name: "Deal actions" }),
    ).toBeInTheDocument();
  });

  it("renders its commands", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("renders a separator as one", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  describe("focus", () => {
    it("moves to the first command on opening, unlike a listbox", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      expect(item("Duplicate")).toHaveFocus();
    });

    it("returns to the trigger on close", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(trigger()).toHaveFocus();
    });
  });

  describe("keyboard", () => {
    it("moves down with ArrowDown", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{ArrowDown}");
      expect(item("Amend")).toHaveFocus();
    });

    it("wraps from the last command to the first", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
      expect(item("Duplicate")).toHaveFocus();
    });

    it("moves up with ArrowUp, wrapping to the end", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{ArrowUp}");
      expect(item("Delete deal")).toHaveFocus();
    });

    it("jumps with Home and End", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{End}");
      expect(item("Delete deal")).toHaveFocus();
      await user.keyboard("{Home}");
      expect(item("Duplicate")).toHaveFocus();
    });

    it("jumps by first letter", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("a");
      expect(item("Amend")).toHaveFocus();
    });

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes on Tab rather than hanging over the next control", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.tab();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("skips a disabled command", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu
          aria-label="Deal actions"
          content={
            <>
              <MenuItem>{"Duplicate"}</MenuItem>
              <MenuItem disabled>{"Settle"}</MenuItem>
              <MenuItem>{"Amend"}</MenuItem>
            </>
          }
        >
          <button>{"Deal actions"}</button>
        </DropdownMenu>,
      );
      await user.click(trigger());
      await user.keyboard("{ArrowDown}");
      expect(item("Amend")).toHaveFocus();
    });
  });

  describe("running a command", () => {
    it("calls the item's handler", async () => {
      const user = userEvent.setup();
      const onPick = vi.fn();
      render(<Basic onPick={onPick} />);
      await user.click(trigger());
      await user.click(item("Duplicate"));
      expect(onPick).toHaveBeenCalledTimes(1);
    });

    it("closes afterwards", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.click(item("Duplicate"));
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("stays open when the click misses every command", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.click(screen.getByRole("separator"));
      expect(menu()).toBeInTheDocument();
    });
  });

  it("groups commands under a labelled group", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        aria-label="Export"
        content={
          <MenuGroup label="Download">
            <MenuItem>{"CSV"}</MenuItem>
            <MenuItem>{"PDF"}</MenuItem>
          </MenuGroup>
        }
      >
        <button>{"Deal actions"}</button>
      </DropdownMenu>,
    );
    await user.click(trigger());
    expect(screen.getByRole("group", { name: "Download" })).toBeInTheDocument();
  });

  it("closes on a click outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Basic />
        <button>{"Outside"}</button>
      </>,
    );
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders into a portal", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Basic />
      </div>,
    );
    await user.click(trigger());
    expect(container.contains(menu())).toBe(false);
  });

  it("reports opening and closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        aria-label="Deal actions"
        onOpenChange={onOpenChange}
        content={<MenuItem>{"Duplicate"}</MenuItem>}
      >
        <button>{"Deal actions"}</button>
      </DropdownMenu>,
    );
    await user.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
