import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { resetScrollLockForTests } from "../../../hooks/useScrollLock";
import { ConfirmModal, type ConfirmModalProps } from "./ConfirmModal";

afterEach(() => {
  resetScrollLockForTests();
  document.body.style.overflow = "";
});

const dialog = (): HTMLElement => screen.getByRole("alertdialog");

const confirmButton = (): HTMLElement =>
  screen.getByRole("button", { name: "Delete deal" });

const cancelButton = (): HTMLElement =>
  screen.getByRole("button", { name: "Cancel" });

type HarnessProps = Partial<
  Omit<ConfirmModalProps, "open" | "onOpenChange" | "onConfirm">
> & {
  onConfirm?: (reason: string) => void;
};

const Harness = ({ onConfirm, ...props }: HarnessProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Delete"}
      </button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Delete this deal?"
        description="NPM-1042 and its four line items will be removed."
        confirmLabel="Delete deal"
        onConfirm={onConfirm ?? vi.fn()}
        {...props}
      />
    </>
  );
};

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Delete" });

const openDialog = async (
  props: HarnessProps = {},
): Promise<ReturnType<typeof userEvent.setup>> => {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(trigger());
  return user;
};

describe("ConfirmModal", () => {
  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("is an alertdialog, so it interrupts rather than waits to be read", async () => {
    await openDialog();
    expect(dialog()).toHaveAttribute("aria-modal", "true");
  });

  it("is named by its title and described by its consequence", async () => {
    await openDialog();
    expect(
      screen.getByRole("alertdialog", { name: "Delete this deal?" }),
    ).toBeInTheDocument();
    expect(dialog()).toHaveAccessibleDescription(
      "NPM-1042 and its four line items will be removed.",
    );
  });

  it("focuses cancel, so a reflexive Enter does not confirm", async () => {
    await openDialog();
    expect(cancelButton()).toHaveFocus();
  });

  it("traps Tab inside", async () => {
    const user = await openDialog();
    for (let index = 0; index < 5; index += 1) {
      await user.tab();
      expect(dialog().contains(document.activeElement)).toBe(true);
    }
  });

  it("locks page scroll while open", async () => {
    await openDialog();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("renders into a portal", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <ConfirmModal
          open
          onOpenChange={vi.fn()}
          title="Delete this deal?"
          description="Gone for good."
          confirmLabel="Delete deal"
          onConfirm={vi.fn()}
        />
      </div>,
    );
    expect(container.contains(dialog())).toBe(false);
  });

  it("sets its own foreground colour, because a portal inherits none", async () => {
    await openDialog();
    expect(dialog().className).toContain("text-fg-default");
  });

  describe("dismissal", () => {
    it("closes on cancel", async () => {
      const user = await openDialog();
      await user.click(cancelButton());
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("closes on Escape", async () => {
      const user = await openDialog();
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("cannot be dismissed by clicking past it, unlike a Modal", async () => {
      const user = await openDialog();
      const scrim = document.querySelector("[data-slot='confirm-modal-scrim']");
      await user.click(scrim as HTMLElement);
      expect(dialog()).toBeInTheDocument();
    });

    it("has no close button — the two actions are the only way out", async () => {
      await openDialog();
      expect(
        screen.queryByRole("button", { name: "Close" }),
      ).not.toBeInTheDocument();
    });

    it("returns focus to the trigger", async () => {
      const user = await openDialog();
      await user.click(cancelButton());
      expect(trigger()).toHaveFocus();
    });
  });

  describe("confirming", () => {
    it("reports the confirmation", async () => {
      const onConfirm = vi.fn();
      const user = await openDialog({ onConfirm });
      await user.click(confirmButton());
      expect(onConfirm).toHaveBeenCalledWith("");
    });

    it("does not close itself — the caller decides when the work is done", async () => {
      const user = await openDialog();
      await user.click(confirmButton());
      expect(dialog()).toBeInTheDocument();
    });

    it("takes a caller-supplied cancel label", async () => {
      await openDialog({ cancelLabel: "Keep it" });
      expect(
        screen.getByRole("button", { name: "Keep it" }),
      ).toBeInTheDocument();
    });
  });

  describe("severity", () => {
    it("paints the confirm button destructively for error", async () => {
      await openDialog({ severity: "error" });
      expect(confirmButton().className).toContain("bg-bg-error");
    });

    it("defaults to warning, which is not destructive paint", async () => {
      await openDialog();
      expect(confirmButton().className).not.toContain("bg-bg-error");
    });
  });

  describe("requireReason", () => {
    it("blocks confirmation until something is typed", async () => {
      await openDialog({ requireReason: true });
      expect(confirmButton()).toBeDisabled();
    });

    it("does not accept whitespace as a reason", async () => {
      const user = await openDialog({ requireReason: true });
      await user.type(screen.getByLabelText(/Reason/), "   ");
      expect(confirmButton()).toBeDisabled();
    });

    it("unblocks once a reason is given", async () => {
      const user = await openDialog({ requireReason: true });
      await user.type(
        screen.getByLabelText(/Reason/),
        "Price no longer viable",
      );
      expect(confirmButton()).toBeEnabled();
    });

    it("hands the reason to the caller", async () => {
      const onConfirm = vi.fn();
      const user = await openDialog({ requireReason: true, onConfirm });
      await user.type(screen.getByLabelText(/Reason/), "Late shipment");
      await user.click(confirmButton());
      expect(onConfirm).toHaveBeenCalledWith("Late shipment");
    });

    it("takes a caller-supplied reason label", async () => {
      await openDialog({
        requireReason: true,
        reasonLabel: "Rejection reason",
      });
      expect(screen.getByLabelText(/Rejection reason/)).toBeInTheDocument();
    });

    it("asks for no reason by default", async () => {
      await openDialog();
      expect(screen.queryByLabelText(/Reason/)).not.toBeInTheDocument();
    });

    it("forgets a reason typed and abandoned last time", async () => {
      const user = await openDialog({ requireReason: true });
      await user.type(screen.getByLabelText(/Reason/), "Late shipment");
      await user.click(cancelButton());
      await user.click(trigger());
      expect(screen.getByLabelText(/Reason/)).toHaveValue("");
    });
  });

  describe("requirePassword", () => {
    it("blocks confirmation until the password is entered", async () => {
      await openDialog({ requirePassword: true });
      expect(confirmButton()).toBeDisabled();
    });

    it("unblocks once it is", async () => {
      const user = await openDialog({ requirePassword: true });
      await user.type(screen.getByLabelText(/Password/), "hunter2");
      expect(confirmButton()).toBeEnabled();
    });

    it("masks what is typed", async () => {
      await openDialog({ requirePassword: true });
      expect(screen.getByLabelText(/Password/)).toHaveAttribute(
        "type",
        "password",
      );
    });

    it("hands the password to the caller — verifying it is the app's job", async () => {
      const onPasswordChange = vi.fn();
      const user = await openDialog({
        requirePassword: true,
        onPasswordChange,
      });
      await user.type(screen.getByLabelText(/Password/), "h");
      expect(onPasswordChange).toHaveBeenCalledWith("h");
    });

    it("asks for no password by default", async () => {
      await openDialog();
      expect(screen.queryByLabelText(/Password/)).not.toBeInTheDocument();
    });
  });

  describe("busy", () => {
    it("blocks both actions while the work is in flight", async () => {
      await openDialog({ busy: true });
      // Matched loosely: a loading Button appends its spinner's "Loading" to
      // its own name.
      expect(
        screen.getByRole("button", { name: /Delete deal/ }),
      ).toBeDisabled();
      expect(cancelButton()).toBeDisabled();
    });

    it("says so, rather than only looking disabled", async () => {
      await openDialog({ busy: true });
      expect(
        screen.getByRole("button", { name: /Delete deal/ }),
      ).toHaveAttribute("aria-busy", "true");
    });
  });
});
