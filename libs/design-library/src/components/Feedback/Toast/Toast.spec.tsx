import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Toast } from "./Toast";

describe("Toast", () => {
  it("shows its title", () => {
    render(<Toast title="Deal saved" />);
    expect(screen.getByText("Deal saved")).toBeInTheDocument();
  });

  it("shows a description and an action when given them", () => {
    render(
      <Toast
        title="Could not save the deal"
        description="The connection dropped."
        action={<button>{"Retry"}</button>}
        duration={null}
      />,
    );
    expect(screen.getByText("The connection dropped.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  describe("announcement", () => {
    it("is polite by default, so it waits its turn", () => {
      render(<Toast title="Deal saved" severity="success" />);
      const toast = screen.getByRole("status");
      expect(toast).toHaveAttribute("aria-live", "polite");
    });

    it("interrupts for an error, and only for an error", () => {
      render(<Toast title="Could not save" severity="error" />);
      const toast = screen.getByRole("alert");
      expect(toast).toHaveAttribute("aria-live", "assertive");
    });

    it("does not take focus — the user did not ask for it", () => {
      const { container } = render(<Toast title="Deal saved" />);
      expect(container.contains(document.activeElement)).toBe(false);
    });
  });

  describe("dismissal", () => {
    it("offers a dismiss button when it can be dismissed", async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(<Toast title="Deal saved" onDismiss={onDismiss} />);
      await user.click(screen.getByRole("button", { name: "Dismiss" }));
      expect(onDismiss).toHaveBeenCalledOnce();
    });

    it("takes a caller-supplied dismiss label", () => {
      render(
        <Toast title="Deal saved" onDismiss={vi.fn()} dismissLabel="Fermer" />,
      );
      expect(
        screen.getByRole("button", { name: "Fermer" }),
      ).toBeInTheDocument();
    });

    it("offers no dismiss button when nothing would happen", () => {
      render(<Toast title="Deal saved" />);
      expect(
        screen.queryByRole("button", { name: "Dismiss" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("the timer", () => {
    it("takes itself away when it runs out", async () => {
      const onDismiss = vi.fn();
      render(<Toast title="Deal saved" duration={20} onDismiss={onDismiss} />);
      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledOnce();
      });
    });

    it("stays put when the caller says so, for a toast carrying an action", async () => {
      const onDismiss = vi.fn();
      render(
        <Toast
          title="Could not save"
          duration={null}
          onDismiss={onDismiss}
          action={<button>{"Retry"}</button>}
        />,
      );
      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("pauses while the pointer is over it", async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(<Toast title="Deal saved" duration={30} onDismiss={onDismiss} />);
      await user.hover(screen.getByRole("status"));
      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("resumes once the pointer leaves", async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(<Toast title="Deal saved" duration={20} onDismiss={onDismiss} />);
      const toast = screen.getByRole("status");
      await user.hover(toast);
      await user.unhover(toast);
      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledOnce();
      });
    });

    it("pauses while focus is inside, so its action can be reached", async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(
        <Toast
          title="Could not save"
          duration={30}
          onDismiss={onDismiss}
          action={<button>{"Retry"}</button>}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Retry" }));
      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  it("paints by severity", () => {
    render(<Toast title="Careful" severity="warning" />);
    expect(screen.getByRole("status").className).toContain(
      "border-border-warning",
    );
  });
});
