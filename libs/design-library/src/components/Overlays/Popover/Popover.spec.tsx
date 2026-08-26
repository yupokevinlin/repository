import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Popover } from "./Popover";

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Filters" });

const panel = (): HTMLElement => screen.getByRole("dialog");

const Basic = ({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) => (
  <Popover
    aria-label="Filters"
    onOpenChange={onOpenChange}
    content={
      <>
        <button>{"Only mine"}</button>
        <button>{"Reset"}</button>
      </>
    }
  >
    <button>{"Filters"}</button>
  </Popover>
);

describe("Popover", () => {
  it("stays closed until the trigger is used", () => {
    render(<Basic />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on click", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(panel()).toBeInTheDocument();
  });

  it("is a dialog, not a tooltip", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(panel()).toBeInTheDocument();
  });

  it("names the panel, so it is not announced as just 'dialog'", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
  });

  it("says the trigger opens a dialog", () => {
    render(<Basic />);
    expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the trigger expanded while open", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on a second click of the trigger", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(trigger());
    await user.click(trigger());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  describe("focus", () => {
    it("moves into the panel, so its controls are reachable at once", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      expect(screen.getByRole("button", { name: "Only mine" })).toHaveFocus();
    });

    it("falls back to the panel when it holds nothing focusable", async () => {
      const user = userEvent.setup();
      render(
        <Popover aria-label="Summary" content={<span>{"Nothing to do"}</span>}>
          <button>{"Filters"}</button>
        </Popover>,
      );
      await user.click(trigger());
      expect(panel()).toHaveFocus();
    });

    it("returns focus to the trigger on close", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(trigger()).toHaveFocus();
    });

    it("does not trap Tab — the page behind stays reachable", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Basic />
          <button>{"Outside"}</button>
        </>,
      );
      await user.click(trigger());
      await user.tab();
      await user.tab();
      // Past the last control in the panel, focus leaves rather than wrapping.
      expect(
        screen.getByRole("button", { name: "Only mine" }),
      ).not.toHaveFocus();
    });
  });

  describe("dismissal", () => {
    it("closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("stays open on a click inside", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.click(trigger());
      await user.click(screen.getByRole("button", { name: "Reset" }));
      expect(panel()).toBeInTheDocument();
    });
  });

  it("renders into a portal, so no panel can clip it", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Basic />
      </div>,
    );
    await user.click(trigger());
    expect(container.contains(panel())).toBe(false);
  });

  it("reports opening and closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Basic onOpenChange={onOpenChange} />);
    await user.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [open, setOpen] = useState<boolean>(false);
      return (
        <Popover
          aria-label="Filters"
          open={open}
          onOpenChange={setOpen}
          content={<button>{"Reset"}</button>}
        >
          <button>{"Filters"}</button>
        </Popover>
      );
    };
    render(<Controlled />);
    await user.click(trigger());
    expect(panel()).toBeInTheDocument();
  });

  it("stays put when controlled and the owner ignores the change", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        aria-label="Filters"
        open={false}
        content={<button>{"Reset"}</button>}
      >
        <button>{"Filters"}</button>
      </Popover>,
    );
    await user.click(trigger());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("takes a padding", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        aria-label="Columns"
        padding="none"
        content={<button>{"Reset"}</button>}
      >
        <button>{"Filters"}</button>
      </Popover>,
    );
    await user.click(trigger());
    expect(panel().className).toContain("p-0");
  });
});
