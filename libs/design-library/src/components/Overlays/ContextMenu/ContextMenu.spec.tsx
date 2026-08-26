import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MenuItem } from "../Menu/MenuItem";
import { MenuSeparator } from "../Menu/MenuSeparator";
import { ContextMenu } from "./ContextMenu";

const region = (): HTMLElement => screen.getByTestId("row");

const menu = (): HTMLElement => screen.getByRole("menu");

const item = (name: string): HTMLElement =>
  screen.getByRole("menuitem", { name });

const Basic = ({ onPick }: { onPick?: () => void }) => (
  <ContextMenu
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
    <div data-testid="row">{"NPM-1042"}</div>
  </ContextMenu>
);

const rightClick = (element: HTMLElement, x = 120, y = 240): void => {
  fireEvent.contextMenu(element, { clientX: x, clientY: y });
};

describe("ContextMenu", () => {
  it("stays closed until a right-click", () => {
    render(<Basic />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on right-click", () => {
    render(<Basic />);
    rightClick(region());
    expect(menu()).toBeInTheDocument();
  });

  it("does not open on an ordinary click", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(region());
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("is a menu of commands, named", () => {
    render(<Basic />);
    rightClick(region());
    expect(
      screen.getByRole("menu", { name: "Deal actions" }),
    ).toBeInTheDocument();
  });

  it("renders the same children a DropdownMenu takes", () => {
    render(<Basic />);
    rightClick(region());
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("positions itself at the pointer", () => {
    render(<Basic />);
    rightClick(region(), 200, 300);
    expect(menu().style.position).toBe("fixed");
    expect(menu().style.left).toBe("200px");
  });

  it("moves to the new pointer position on a second right-click", () => {
    render(<Basic />);
    rightClick(region(), 100, 100);
    rightClick(region(), 250, 260);
    expect(menu().style.left).toBe("250px");
  });

  it("moves focus to the first command", () => {
    render(<Basic />);
    rightClick(region());
    expect(item("Duplicate")).toHaveFocus();
  });

  it("drives the same keyboard as DropdownMenu", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    rightClick(region());
    await user.keyboard("{ArrowDown}");
    expect(item("Amend")).toHaveFocus();
    await user.keyboard("{End}");
    expect(item("Delete deal")).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    rightClick(region());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("runs a command and closes", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<Basic onPick={onPick} />);
    rightClick(region());
    await user.click(item("Duplicate"));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on a click outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Basic />
        <button>{"Outside"}</button>
      </>,
    );
    rightClick(region());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders into a portal", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Basic />
      </div>,
    );
    rightClick(region());
    expect(container.contains(menu())).toBe(false);
  });

  it("leaves the region's own layout alone", () => {
    const { container } = render(<Basic />);
    const wrapper = container.querySelector(
      "[data-slot='context-menu-region']",
    );
    // display:contents, so wrapping a table row does not break the table.
    expect(wrapper?.className).toContain("contents");
  });

  it("reports opening and closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ContextMenu
        aria-label="Deal actions"
        onOpenChange={onOpenChange}
        content={<MenuItem>{"Duplicate"}</MenuItem>}
      >
        <div data-testid="row">{"NPM-1042"}</div>
      </ContextMenu>,
    );
    rightClick(region());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
