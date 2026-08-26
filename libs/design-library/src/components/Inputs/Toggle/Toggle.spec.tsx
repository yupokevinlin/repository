import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Toggle, toggleSizes } from "./Toggle";

const control = (): HTMLElement => screen.getByRole("button");

describe("Toggle", () => {
  it("renders a real button", () => {
    render(<Toggle>{"My deals"}</Toggle>);
    expect(control().tagName).toBe("BUTTON");
    expect(control()).toHaveAttribute("type", "button");
  });

  it("reports pressed, not checked", () => {
    render(<Toggle>{"My deals"}</Toggle>);
    expect(control()).toHaveAttribute("aria-pressed", "false");
    expect(control()).not.toHaveAttribute("aria-checked");
  });

  it("is not a switch or a checkbox", () => {
    render(<Toggle>{"My deals"}</Toggle>);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("takes its accessible name from its children", () => {
    render(<Toggle>{"My deals"}</Toggle>);
    expect(
      screen.getByRole("button", { name: "My deals" }),
    ).toBeInTheDocument();
  });

  it("starts up", () => {
    render(<Toggle>{"My deals"}</Toggle>);
    expect(control()).toHaveAttribute("aria-pressed", "false");
  });

  it("starts down with defaultPressed", () => {
    render(<Toggle defaultPressed>{"My deals"}</Toggle>);
    expect(control()).toHaveAttribute("aria-pressed", "true");
  });

  it("presses on click", async () => {
    const user = userEvent.setup();
    render(<Toggle>{"My deals"}</Toggle>);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-pressed", "true");
  });

  it("releases on a second click", async () => {
    const user = userEvent.setup();
    render(<Toggle defaultPressed>{"My deals"}</Toggle>);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-pressed", "false");
  });

  it("presses on Space", async () => {
    const user = userEvent.setup();
    render(<Toggle>{"My deals"}</Toggle>);
    control().focus();
    await user.keyboard(" ");
    expect(control()).toHaveAttribute("aria-pressed", "true");
  });

  it("presses on Enter", async () => {
    const user = userEvent.setup();
    render(<Toggle>{"My deals"}</Toggle>);
    control().focus();
    await user.keyboard("{Enter}");
    expect(control()).toHaveAttribute("aria-pressed", "true");
  });

  it("reports the new state", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>{"My deals"}</Toggle>);
    await user.click(control());
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("stays put when controlled and the owner ignores the change", async () => {
    const user = userEvent.setup();
    render(<Toggle pressed={false}>{"My deals"}</Toggle>);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-pressed", "false");
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [pressed, setPressed] = useState<boolean>(false);
      return (
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          {"My deals"}
        </Toggle>
      );
    };
    render(<Controlled />);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-pressed", "true");
  });

  it("exposes its state for styling", async () => {
    const user = userEvent.setup();
    render(<Toggle>{"My deals"}</Toggle>);
    expect(control()).toHaveAttribute("data-state", "off");
    await user.click(control());
    expect(control()).toHaveAttribute("data-state", "on");
  });

  it("fills its surface when pressed, so it reads across a toolbar", () => {
    render(<Toggle defaultPressed>{"My deals"}</Toggle>);
    expect(control().className).toContain("bg-bg-primary-soft");
  });

  it("borrows Button's classes rather than restating them", () => {
    render(<Toggle>{"My deals"}</Toggle>);
    expect(control().className).toContain("h-10");
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = toggleSizes.map((size) => {
      const { unmount } = render(<Toggle size={size}>{"My deals"}</Toggle>);
      const className: string = control().className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(toggleSizes.length);
  });

  it("renders a start icon", () => {
    const { container } = render(
      <Toggle startIcon={<svg data-testid="icon" />}>{"Bold"}</Toggle>,
    );
    expect(
      container.querySelector("[data-slot='toggle-icon']"),
    ).toBeInTheDocument();
  });

  it("disables the control", () => {
    render(<Toggle disabled>{"My deals"}</Toggle>);
    expect(control()).toBeDisabled();
  });

  it("does not press when disabled", async () => {
    const user = userEvent.setup();
    render(<Toggle disabled>{"My deals"}</Toggle>);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-pressed", "false");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Toggle ref={ref}>{"My deals"}</Toggle>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
