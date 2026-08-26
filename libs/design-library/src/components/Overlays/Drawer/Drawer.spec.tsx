import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { resetScrollLockForTests } from "../../../hooks/useScrollLock";
import { Drawer, type DrawerProps } from "./Drawer";

afterEach(() => {
  resetScrollLockForTests();
  document.body.style.overflow = "";
});

const sheet = (): HTMLElement => screen.getByRole("dialog");

const scrim = (): Element | null =>
  document.querySelector("[data-slot='drawer-scrim']");

type HarnessProps = Partial<Omit<DrawerProps, "open" | "onOpenChange">>;

const Harness = (props: HarnessProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Filters"}
      </button>
      <input aria-label="Search the page behind" />
      <Drawer open={open} onOpenChange={setOpen} title="Filters" {...props}>
        <input aria-label="Counterparty" />
      </Drawer>
    </>
  );
};

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Filters" });

const openSheet = async (
  props: HarnessProps = {},
): Promise<ReturnType<typeof userEvent.setup>> => {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(trigger());
  return user;
};

describe("Drawer", () => {
  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("takes its accessible name from its heading", async () => {
    await openSheet();
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
  });

  it("renders its body and footer", async () => {
    await openSheet({ footer: <button>{"Apply"}</button> });
    expect(screen.getByLabelText("Counterparty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  });

  it("renders into a portal", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Drawer open onOpenChange={vi.fn()} title="Filters">
          <span>{"Body"}</span>
        </Drawer>
      </div>,
    );
    expect(container.contains(sheet())).toBe(false);
  });

  it("sets its own foreground colour, because a portal inherits none", async () => {
    await openSheet();
    expect(sheet().className).toContain("text-fg-default");
  });

  it("scrolls only its body", async () => {
    await openSheet({ footer: <button>{"Apply"}</button> });
    const body = document.querySelector("[data-slot='drawer-body']");
    const header = document.querySelector("[data-slot='drawer-header']");
    expect(body?.className).toContain("overflow-y-auto");
    expect(header?.className).toContain("shrink-0");
  });

  describe("modal, the default", () => {
    it("says so, so the page behind is announced as unavailable", async () => {
      await openSheet();
      expect(sheet()).toHaveAttribute("aria-modal", "true");
    });

    it("dims the page", async () => {
      await openSheet();
      expect(scrim()).toBeInTheDocument();
    });

    it("traps Tab inside", async () => {
      const user = await openSheet();
      for (let index = 0; index < 5; index += 1) {
        await user.tab();
        expect(sheet().contains(document.activeElement)).toBe(true);
      }
    });

    it("locks page scroll", async () => {
      await openSheet();
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("closes on a scrim click", async () => {
      const user = await openSheet();
      await user.click(scrim() as HTMLElement);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("can refuse scrim dismissal", async () => {
      const user = await openSheet({ dismissOnScrimClick: false });
      await user.click(scrim() as HTMLElement);
      expect(sheet()).toBeInTheDocument();
    });

    it("returns focus to the trigger on close", async () => {
      const user = await openSheet();
      await user.keyboard("{Escape}");
      expect(trigger()).toHaveFocus();
    });
  });

  describe("non-modal", () => {
    const nonModal: HarnessProps = { modal: false };

    it("does not claim the page behind", async () => {
      await openSheet(nonModal);
      expect(sheet()).not.toHaveAttribute("aria-modal");
    });

    it("has no scrim, because the page behind is still in use", async () => {
      await openSheet(nonModal);
      expect(scrim()).not.toBeInTheDocument();
    });

    it("lets Tab leave, which is the whole point of it", async () => {
      const user = await openSheet(nonModal);
      screen.getByLabelText("Counterparty").focus();
      await user.tab();
      await user.tab();
      expect(sheet().contains(document.activeElement)).toBe(false);
    });

    it("leaves page scroll alone", async () => {
      await openSheet(nonModal);
      expect(document.body.style.overflow).toBe("");
    });

    it("still closes on Escape", async () => {
      const user = await openSheet(nonModal);
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("still closes on the close button", async () => {
      const user = await openSheet(nonModal);
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("side", () => {
    it("comes from the right by default", async () => {
      await openSheet();
      expect(sheet().className).toContain("right-0");
    });

    it("can come from the left", async () => {
      await openSheet({ side: "left" });
      expect(sheet().className).toContain("left-0");
    });

    it("sizes the horizontal edges by height, not width", async () => {
      await openSheet({ side: "bottom", size: "sm" });
      expect(sheet().className).toContain("h-[16rem]");
    });

    it("sizes the vertical edges by width", async () => {
      await openSheet({ side: "right", size: "lg" });
      expect(sheet().className).toContain("w-[40rem]");
    });
  });

  it("takes a caller-supplied close label", async () => {
    await openSheet({ closeLabel: "Fermer" });
    expect(screen.getByRole("button", { name: "Fermer" })).toBeInTheDocument();
  });

  it("reports closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Filters">
        <span>{"Body"}</span>
      </Drawer>,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
