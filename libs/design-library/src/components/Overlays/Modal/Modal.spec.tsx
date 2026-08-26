import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { resetScrollLockForTests } from "../../../hooks/useScrollLock";
import { Modal } from "./Modal";

afterEach(() => {
  resetScrollLockForTests();
  document.body.style.overflow = "";
});

const dialog = (): HTMLElement => screen.getByRole("dialog");

const Harness = ({
  dismissOnScrimClick,
}: {
  dismissOnScrimClick?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Amend"}
      </button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Amend deal"
        dismissOnScrimClick={dismissOnScrimClick}
        footer={<button>{"Save"}</button>}
      >
        <input aria-label="Deal number" />
      </Modal>
    </>
  );
};

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Amend" });

describe("Modal", () => {
  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a modal dialog, not a plain one", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(trigger());
    expect(dialog()).toHaveAttribute("aria-modal", "true");
  });

  it("takes its accessible name from its heading", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(trigger());
    expect(
      screen.getByRole("dialog", { name: "Amend deal" }),
    ).toBeInTheDocument();
  });

  it("renders its body and footer", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(trigger());
    expect(screen.getByLabelText("Deal number")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  describe("focus", () => {
    it("moves into the dialog", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      expect(dialog().contains(document.activeElement)).toBe(true);
    });

    it("traps Tab inside, unlike a Popover", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());

      for (let index = 0; index < 6; index += 1) {
        await user.tab();
        expect(dialog().contains(document.activeElement)).toBe(true);
      }
    });

    it("returns to the trigger on close", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(trigger()).toHaveFocus();
    });
  });

  describe("scroll lock", () => {
    it("locks the page while open", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("releases it on close", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("dismissal", () => {
    it("closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes on the close button", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes on a scrim click", async () => {
      const user = userEvent.setup();
      const { container } = render(<Harness />);
      await user.click(trigger());
      const scrim = document.querySelector("[data-slot='modal-scrim']");
      await user.click(scrim as HTMLElement);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it("ignores a click that lands on the panel rather than the scrim", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(trigger());
      await user.click(dialog());
      expect(dialog()).toBeInTheDocument();
    });

    it("can refuse scrim dismissal, for work worth protecting", async () => {
      const user = userEvent.setup();
      render(<Harness dismissOnScrimClick={false} />);
      await user.click(trigger());
      const scrim = document.querySelector("[data-slot='modal-scrim']");
      await user.click(scrim as HTMLElement);
      expect(dialog()).toBeInTheDocument();
    });
  });

  it("reports closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Amend deal">
        <span>{"Body"}</span>
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders into a portal", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Modal open onOpenChange={vi.fn()} title="Amend deal">
          <span>{"Body"}</span>
        </Modal>
      </div>,
    );
    expect(container.contains(dialog())).toBe(false);
  });

  it("scrolls only its body, so the title and actions stay put", () => {
    render(
      <Modal
        open
        onOpenChange={vi.fn()}
        title="Amend deal"
        footer={<button>{"Save"}</button>}
      >
        <span>{"Body"}</span>
      </Modal>,
    );
    const body = document.querySelector("[data-slot='modal-body']");
    const header = document.querySelector("[data-slot='modal-header']");
    expect(body?.className).toContain("overflow-y-auto");
    expect(header?.className).toContain("shrink-0");
  });

  it("sets its own foreground colour, because a portal inherits none", () => {
    render(
      <Modal open onOpenChange={vi.fn()} title="Amend deal">
        <span>{"Body"}</span>
      </Modal>,
    );
    expect(dialog().className).toContain("text-fg-default");
  });

  it("takes a size", () => {
    render(
      <Modal open onOpenChange={vi.fn()} title="Line items" size="lg">
        <span>{"Body"}</span>
      </Modal>,
    );
    expect(dialog().className).toContain("max-w-[48rem]");
  });

  it("takes a caller-supplied close label", () => {
    render(
      <Modal open onOpenChange={vi.fn()} title="Amend deal" closeLabel="Fermer">
        <span>{"Body"}</span>
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Fermer" })).toBeInTheDocument();
  });
});
