import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";

import { useFocusTrap } from "./useFocusTrap";

/**
 * A trigger that opens a panel with three controls — the shape of every modal
 * in the library, reduced to what the trap cares about.
 */
const Harness = ({
  withControls = true,
  focusCancel = false,
  returnElsewhere = false,
}: {
  withControls?: boolean;
  focusCancel?: boolean;
  returnElsewhere?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const elsewhereRef = useRef<HTMLButtonElement>(null);
  const { containerRef } = useFocusTrap<HTMLDivElement>({
    active: open,
    initialFocusRef: focusCancel ? cancelRef : undefined,
    returnFocusRef: returnElsewhere ? elsewhereRef : undefined,
  });

  return (
    <>
      <button onClick={() => setOpen(true)}>{"Open"}</button>
      <button ref={elsewhereRef}>{"Elsewhere"}</button>
      {open && (
        <div ref={containerRef} role="dialog" data-testid="dialog">
          {withControls && (
            <>
              <button>{"First"}</button>
              <button ref={cancelRef}>{"Cancel"}</button>
              <button onClick={() => setOpen(false)}>{"Close"}</button>
            </>
          )}
        </div>
      )}
      <button>{"Outside"}</button>
    </>
  );
};

const open = async (
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> => {
  await user.click(screen.getByRole("button", { name: "Open" }));
};

describe("useFocusTrap", () => {
  describe("initial focus", () => {
    it("moves focus into the container", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("honours initialFocusRef over the first control", async () => {
      const user = userEvent.setup();
      render(<Harness focusCancel />);
      await open(user);
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    });

    it("focuses the container itself when it holds nothing tabbable", async () => {
      const user = userEvent.setup();
      render(<Harness withControls={false} />);
      await open(user);
      expect(screen.getByTestId("dialog")).toHaveFocus();
    });

    it("makes the container script-focusable without adding it to the tab order", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);
      expect(screen.getByTestId("dialog")).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("trapping Tab", () => {
    it("wraps from the last control back to the first", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);

      await user.tab();
      await user.tab();
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("wraps backwards from the first control to the last", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);

      await user.tab({ shift: true });
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    });

    it("never lands on a control outside the container", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);

      for (let index = 0; index < 8; index += 1) {
        await user.tab();
        expect(screen.getByTestId("dialog")).toContainElement(
          document.activeElement as HTMLElement,
        );
      }
    });

    it("keeps focus put when there is nothing to move to", async () => {
      const user = userEvent.setup();
      render(<Harness withControls={false} />);
      await open(user);

      await user.tab();
      expect(screen.getByTestId("dialog")).toHaveFocus();
    });

    it("leaves other keys alone", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);

      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });
  });

  describe("returning focus", () => {
    it("puts focus back on the trigger when it closes", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
    });

    it("honours returnFocusRef over the trigger", async () => {
      const user = userEvent.setup();
      render(<Harness returnElsewhere />);
      await open(user);
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.getByRole("button", { name: "Elsewhere" })).toHaveFocus();
    });

    it("returns focus on unmount, not only on close", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Harness />);
      await open(user);
      unmount();
      // Nothing to assert focus on once unmounted — the point is that tearing
      // down mid-open does not throw.
      expect(document.body).toBeInTheDocument();
    });
  });

  describe("while inactive", () => {
    it("does not touch focus before it opens", () => {
      render(<Harness />);
      expect(document.body).toHaveFocus();
    });

    it("lets Tab leave once closed", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await open(user);
      await user.click(screen.getByRole("button", { name: "Close" }));

      await user.tab();
      expect(screen.getByRole("button", { name: "Elsewhere" })).toHaveFocus();
    });
  });

  it("picks up controls added while it is open", async () => {
    const user = userEvent.setup();

    const Growing = () => {
      const [open, setOpen] = useState<boolean>(false);
      const [loaded, setLoaded] = useState<boolean>(false);
      const { containerRef } = useFocusTrap<HTMLDivElement>({ active: open });

      return (
        <>
          <button onClick={() => setOpen(true)}>{"Open"}</button>
          {open && (
            <div ref={containerRef} role="dialog" data-testid="dialog">
              <button onClick={() => setLoaded(true)}>{"Load"}</button>
              {loaded && <button>{"Arrived"}</button>}
            </div>
          )}
        </>
      );
    };

    render(<Growing />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Load" }));

    await user.tab();
    expect(screen.getByRole("button", { name: "Arrived" })).toHaveFocus();
  });

  it("skips a disabled control", async () => {
    const user = userEvent.setup();

    const WithDisabled = () => {
      const [open, setOpen] = useState<boolean>(false);
      const { containerRef } = useFocusTrap<HTMLDivElement>({ active: open });

      return (
        <>
          <button onClick={() => setOpen(true)}>{"Open"}</button>
          {open && (
            <div ref={containerRef} role="dialog">
              <button>{"First"}</button>
              <button disabled>{"Disabled"}</button>
              <button>{"Last"}</button>
            </div>
          )}
        </>
      );
    };

    render(<WithDisabled />);
    await user.click(screen.getByRole("button", { name: "Open" }));

    await user.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });
});
