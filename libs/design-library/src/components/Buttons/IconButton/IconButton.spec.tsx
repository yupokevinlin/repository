import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { buttonSizes, buttonVariants } from "../Button/Button";
import { IconButton } from "./IconButton";

const icon = <svg data-testid="icon" />;

const slot = (container: HTMLElement, name = "icon-button"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("IconButton", () => {
  it("renders a button, never an anchor", () => {
    const { container } = render(<IconButton icon={icon} aria-label="Close" />);
    expect(slot(container).tagName).toBe("BUTTON");
    expect(container.querySelector("a")).toBeNull();
  });

  it("takes its accessible name from aria-label, since the icon has none", () => {
    render(<IconButton icon={icon} aria-label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(<IconButton icon={icon} aria-label="Close" />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("defaults to type='button', so it cannot submit a form by accident", () => {
    const { container } = render(<IconButton icon={icon} aria-label="Close" />);
    expect(slot(container)).toHaveAttribute("type", "button");
  });

  it("still lets a caller opt into submitting", () => {
    const { container } = render(
      <IconButton icon={icon} aria-label="Save" type="submit" />,
    );
    expect(slot(container)).toHaveAttribute("type", "submit");
  });

  it("is square — width follows height at every step", () => {
    const { container } = render(
      <IconButton icon={icon} aria-label="Close" size="12" />,
    );
    const className: string = slot(container).className;
    expect(className).toContain("h-12");
    expect(className).toContain("w-12");
  });

  it("drops the horizontal padding a labelled button needs", () => {
    const { container } = render(<IconButton icon={icon} aria-label="Close" />);
    const className: string = slot(container).className;
    expect(className).toContain("p-0");
    expect(className).not.toContain("px-4");
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = buttonSizes.map((size) => {
      const { container, unmount } = render(
        <IconButton icon={icon} aria-label="Close" size={size} />,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(buttonSizes.length);
  });

  it("gives every variant a distinct set of classes", () => {
    const classNames: Array<string> = buttonVariants.map((variant) => {
      const { container, unmount } = render(
        <IconButton icon={icon} aria-label="Close" variant={variant} />,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(buttonVariants.length);
  });

  it("borrows Button's classes rather than restating them", () => {
    const { container } = render(
      <IconButton icon={icon} aria-label="Void" variant="destructive-solid" />,
    );
    expect(slot(container).className).toContain("bg-bg-error");
  });

  it("defaults to a quiet variant — icon buttons sit beside content", () => {
    const { container } = render(<IconButton icon={icon} aria-label="Close" />);
    expect(slot(container).className).toContain("bg-bg-default");
  });

  it("calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={icon} aria-label="Close" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton icon={icon} aria-label="Close" onClick={onClick} disabled />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  describe("loading", () => {
    it("says so, rather than only looking busy", () => {
      const { container } = render(
        <IconButton icon={icon} aria-label="Save" loading />,
      );
      expect(slot(container)).toHaveAttribute("aria-busy", "true");
    });

    it("shows a spinner", () => {
      render(<IconButton icon={icon} aria-label="Save" loading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("hides the icon without collapsing the square", () => {
      const { container } = render(
        <IconButton icon={icon} aria-label="Save" loading />,
      );
      expect(slot(container, "icon-button-icon").className).toContain(
        "opacity-0",
      );
    });

    it("blocks interaction", () => {
      const { container } = render(
        <IconButton icon={icon} aria-label="Save" loading />,
      );
      expect(slot(container).className).toContain("pointer-events-none");
    });

    it("sets no aria-busy when idle", () => {
      const { container } = render(
        <IconButton icon={icon} aria-label="Save" />,
      );
      expect(slot(container)).not.toHaveAttribute("aria-busy", "true");
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(
      <IconButton icon={icon} aria-label="Close" className="ml-2" />,
    );
    const className: string = slot(container).className;
    expect(className).toContain("ml-2");
    expect(className).toContain("h-10");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton icon={icon} aria-label="Close" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <IconButton icon={icon} aria-label="Close" data-testid="close" />,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "close");
  });
});
