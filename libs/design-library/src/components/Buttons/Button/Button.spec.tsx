import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button, buttonSizes, buttonVariants } from "./Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Confirm</Button>);
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("renders a native button element", () => {
    render(<Button>Confirm</Button>);
    expect(screen.getByRole("button")).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies the default variant and size when none are given", () => {
    render(<Button>Confirm</Button>);
    const button: HTMLElement = screen.getByRole("button");
    expect(button.className).toContain("bg-bg-primary");
    expect(button.className).toContain("h-10");
  });

  it("gives every variant a distinct set of classes", () => {
    const classNames: Array<string> = buttonVariants.map((variant) => {
      const { container, unmount } = render(
        <Button variant={variant}>Confirm</Button>,
      );
      const className: string =
        container.querySelector("button")?.className ?? "";
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(buttonVariants.length);
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = buttonSizes.map((size) => {
      const { container, unmount } = render(
        <Button size={size}>Confirm</Button>,
      );
      const className: string =
        container.querySelector("button")?.className ?? "";
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(buttonSizes.length);
  });

  it("renders start and end icons", () => {
    render(
      <Button
        startIcon={<span data-testid="start" />}
        endIcon={<span data-testid="end" />}
      >
        Confirm
      </Button>,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Confirm</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("activates on both Enter and Space", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Confirm</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Confirm
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks itself busy and shows a spinner while loading", () => {
    render(<Button loading>Confirm</Button>);
    const button: HTMLElement = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("keeps its label in the accessible name while loading", () => {
    render(<Button loading>Confirm</Button>);
    expect(screen.getByRole("button", { name: /Confirm/ })).toBeInTheDocument();
  });

  it("merges className rather than replacing the variant classes", () => {
    render(<Button className="w-full">Confirm</Button>);
    const button: HTMLElement = screen.getByRole("button");
    expect(button.className).toContain("w-full");
    expect(button.className).toContain("bg-bg-primary");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    render(<Button className="h-20">Confirm</Button>);
    const button: HTMLElement = screen.getByRole("button");
    expect(button.className).toContain("h-20");
    expect(button.className).not.toContain("h-10");
  });

  it("forwards a ref to the underlying button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Confirm</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards arbitrary native props", () => {
    render(<Button type="submit">Confirm</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
