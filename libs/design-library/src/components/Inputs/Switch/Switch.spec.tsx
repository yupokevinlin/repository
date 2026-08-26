import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Switch, switchSizes } from "./Switch";

const control = (): HTMLElement => screen.getByRole("switch");

const slot = (container: HTMLElement, name: string): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Switch", () => {
  it("is a switch, not a checkbox", () => {
    render(<Switch label="Auto-hedge" />);
    expect(control()).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders a real button, so Space and Enter both work", () => {
    render(<Switch label="Auto-hedge" />);
    expect(control().tagName).toBe("BUTTON");
    expect(control()).toHaveAttribute("type", "button");
  });

  it("takes its accessible name from its label", () => {
    render(<Switch label="Auto-hedge" />);
    expect(
      screen.getByRole("switch", { name: "Auto-hedge" }),
    ).toBeInTheDocument();
  });

  it("starts off", () => {
    render(<Switch label="Auto-hedge" />);
    expect(control()).toHaveAttribute("aria-checked", "false");
  });

  it("starts on with defaultChecked", () => {
    render(<Switch label="Auto-hedge" defaultChecked />);
    expect(control()).toHaveAttribute("aria-checked", "true");
  });

  it("flips on click", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-hedge" />);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-checked", "true");
  });

  it("flips when its label text is clicked", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-hedge" />);
    await user.click(screen.getByText("Auto-hedge"));
    expect(control()).toHaveAttribute("aria-checked", "true");
  });

  it("flips on Enter, which a checkbox would not", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-hedge" />);
    control().focus();
    await user.keyboard("{Enter}");
    expect(control()).toHaveAttribute("aria-checked", "true");
  });

  it("flips on Space", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-hedge" />);
    control().focus();
    await user.keyboard(" ");
    expect(control()).toHaveAttribute("aria-checked", "true");
  });

  it("reports the new state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Auto-hedge" onCheckedChange={onCheckedChange} />);
    await user.click(control());
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("stays put when controlled and the owner ignores the change", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-hedge" checked={false} />);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-checked", "false");
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [on, setOn] = useState<boolean>(false);
      return <Switch label="Auto-hedge" checked={on} onCheckedChange={setOn} />;
    };
    render(<Controlled />);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-checked", "true");
  });

  describe("size", () => {
    it("defaults to a 20px track", () => {
      render(<Switch label="Auto-hedge" />);
      expect(control().className).toContain("h-5");
    });

    it("gives every size a distinct set of classes", () => {
      const classNames: Array<string> = switchSizes.map((size) => {
        const { unmount } = render(<Switch label="Auto-hedge" size={size} />);
        const className: string = control().className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(switchSizes.length);
    });

    it("moves the thumb further on the larger track", () => {
      const { container } = render(
        <Switch label="Auto-hedge" size="6" defaultChecked />,
      );
      expect(slot(container, "switch-thumb").className).toContain(
        "translate-x-5",
      );
    });
  });

  it("moves the thumb when on", () => {
    const { container } = render(<Switch label="Auto-hedge" defaultChecked />);
    expect(slot(container, "switch-thumb").className).toContain(
      "translate-x-4",
    );
  });

  it("respects a reduced-motion preference", () => {
    const { container } = render(<Switch label="Auto-hedge" />);
    expect(slot(container, "switch-thumb").className).toContain(
      "motion-reduce:transition-none",
    );
  });

  it("describes the control with its hint", () => {
    render(<Switch label="Auto-hedge" hint="Places the offsetting trade." />);
    expect(control()).toHaveAccessibleDescription(
      "Places the offsetting trade.",
    );
  });

  it("disables the control", () => {
    render(<Switch label="Auto-hedge" disabled />);
    expect(control()).toBeDisabled();
  });

  it("does not flip when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch label="Auto-hedge" disabled />);
    await user.click(control());
    expect(control()).toHaveAttribute("aria-checked", "false");
  });

  it("works with an aria-label and no visible one", () => {
    const { container } = render(<Switch aria-label="Auto-hedge" />);
    expect(
      screen.getByRole("switch", { name: "Auto-hedge" }),
    ).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });

  it("forwards a ref to the button itself", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch label="Auto-hedge" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
