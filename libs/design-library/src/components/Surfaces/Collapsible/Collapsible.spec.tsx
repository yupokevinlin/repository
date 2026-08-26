import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Collapsible } from "./Collapsible";

const slot = (container: HTMLElement, name: string): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Collapsible", () => {
  it("names the trigger from label", () => {
    render(<Collapsible label="Shipping terms">FOB Vancouver</Collapsible>);
    expect(
      screen.getByRole("button", { name: "Shipping terms" }),
    ).toBeInTheDocument();
  });

  it("uses a real button, so Enter and Space work for free", () => {
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    const trigger: HTMLElement = slot(container, "collapsible-trigger");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("type", "button");
  });

  it("starts closed", () => {
    render(<Collapsible label="Shipping terms">FOB Vancouver</Collapsible>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("starts open with defaultOpen", () => {
    render(
      <Collapsible label="Shipping terms" defaultOpen>
        FOB Vancouver
      </Collapsible>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("points the trigger at the content it controls", () => {
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    const trigger: HTMLElement = slot(container, "collapsible-trigger");
    const content: HTMLElement = slot(container, "collapsible-content");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
  });

  it("labels the content region by its trigger", () => {
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    const trigger: HTMLElement = slot(container, "collapsible-trigger");
    const content: HTMLElement = slot(container, "collapsible-content");
    expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
  });

  it("hides the content while closed", () => {
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    expect(slot(container, "collapsible-content")).toHaveAttribute("hidden");
  });

  it("keeps the content mounted while closed, so its state survives", () => {
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    expect(slot(container, "collapsible-content").textContent).toBe(
      "FOB Vancouver",
    );
  });

  it("opens on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    await user.click(screen.getByRole("button"));
    expect(slot(container, "collapsible-content")).not.toHaveAttribute(
      "hidden",
    );
  });

  it("closes again on a second click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible label="Shipping terms" defaultOpen>
        FOB Vancouver
      </Collapsible>,
    );
    await user.click(screen.getByRole("button"));
    expect(slot(container, "collapsible-content")).toHaveAttribute("hidden");
  });

  it("reports the new state on change", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible label="Shipping terms" onOpenChange={onOpenChange}>
        FOB Vancouver
      </Collapsible>,
    );
    await user.click(screen.getByRole("button"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("stays put when controlled and the owner does not respond", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible label="Shipping terms" open={false}>
        FOB Vancouver
      </Collapsible>,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("follows the owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [open, setOpen] = useState<boolean>(false);
      return (
        <Collapsible label="Shipping terms" open={open} onOpenChange={setOpen}>
          FOB Vancouver
        </Collapsible>
      );
    };
    render(<Controlled />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible label="Shipping terms" disabled>
        FOB Vancouver
      </Collapsible>,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("marks the trigger disabled so it leaves the tab order", () => {
    render(
      <Collapsible label="Shipping terms" disabled>
        FOB Vancouver
      </Collapsible>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("exposes its state for styling", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    expect(slot(container, "collapsible")).toHaveAttribute(
      "data-state",
      "closed",
    );
    await user.click(screen.getByRole("button"));
    expect(slot(container, "collapsible")).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it("turns the indicator only when open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    expect(
      slot(container, "collapsible-indicator").getAttribute("class"),
    ).toContain("rotate-0");
    await user.click(screen.getByRole("button"));
    expect(
      slot(container, "collapsible-indicator").getAttribute("class"),
    ).toContain("rotate-90");
  });

  it("hides the indicator from assistive technology", () => {
    const { container } = render(
      <Collapsible label="Shipping terms">FOB Vancouver</Collapsible>,
    );
    expect(slot(container, "collapsible-indicator")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("gives two instances different ids", () => {
    const { container } = render(
      <>
        <Collapsible label="One">First</Collapsible>
        <Collapsible label="Two">Second</Collapsible>
      </>,
    );
    const triggers = container.querySelectorAll(
      "[data-slot='collapsible-trigger']",
    );
    expect(triggers[0]?.id).not.toBe(triggers[1]?.id);
  });

  it("takes a caller-supplied id", () => {
    const { container } = render(
      <Collapsible label="Shipping terms" id="terms">
        FOB Vancouver
      </Collapsible>,
    );
    expect(slot(container, "collapsible-trigger")).toHaveAttribute(
      "id",
      "terms-trigger",
    );
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(
      <Collapsible label="Shipping terms" className="mt-2">
        FOB Vancouver
      </Collapsible>,
    );
    const className: string = slot(container, "collapsible").className;
    expect(className).toContain("mt-2");
    expect(className).toContain("w-full");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Collapsible label="Shipping terms" ref={ref}>
        FOB Vancouver
      </Collapsible>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <Collapsible label="Shipping terms" data-testid="terms">
        FOB Vancouver
      </Collapsible>,
    );
    expect(slot(container, "collapsible")).toHaveAttribute(
      "data-testid",
      "terms",
    );
  });
});
