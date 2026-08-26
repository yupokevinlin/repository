import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "./Tooltip";

const trigger = (): HTMLElement => screen.getByRole("button");

// A timer left faked by one test would hang every test after it.
afterEach(() => {
  vi.useRealTimers();
});

describe("Tooltip", () => {
  it("stays closed until something asks for it", () => {
    render(
      <Tooltip content="Delete line item">
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens on focus, which is what makes it reachable at all", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item">
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("opens without delay on focus — the user has already committed", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item" delay={5000}>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on blur", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Delete line item">
          <button>{"Delete"}</button>
        </Tooltip>
        <button>{"Elsewhere"}</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens on hover once the pointer rests", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item" delay={0}>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.hover(trigger());
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("waits out the delay before opening on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item" delay={500}>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.hover(trigger());
    // Still shut immediately after the pointer arrives — the point of the
    // delay is that brushing past a control does not flash a tip.
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("tooltip", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("closes when the pointer leaves", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item" delay={0}>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.hover(trigger());
    await screen.findByRole("tooltip");
    await user.unhover(trigger());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("describes its trigger rather than floating loose", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item">
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    expect(trigger()).toHaveAccessibleDescription("Delete line item");
  });

  it("adds no description while closed", () => {
    render(
      <Tooltip content="Delete line item">
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    expect(trigger()).not.toHaveAttribute("aria-describedby");
  });

  it("dismisses on Escape without moving focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item">
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it("never eats a click meant for what is underneath", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item">
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip").className).toContain(
      "pointer-events-none",
    );
  });

  it("renders into a portal, so no panel can clip it", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Tooltip content="Delete line item">
          <button>{"Delete"}</button>
        </Tooltip>
      </div>,
    );
    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(container.contains(tooltip)).toBe(false);
  });

  it("can be driven from outside", () => {
    render(
      <Tooltip content="Delete line item" open>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("stays put when controlled and the owner ignores the change", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete line item" open={false}>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("reports opening", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Delete line item" onOpenChange={onOpenChange}>
        <button>{"Delete"}</button>
      </Tooltip>,
    );
    await user.tab();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("keeps the trigger's own handlers working", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tooltip content="Delete line item">
        <button onClick={onClick}>{"Delete"}</button>
      </Tooltip>,
    );
    await user.click(trigger());
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
