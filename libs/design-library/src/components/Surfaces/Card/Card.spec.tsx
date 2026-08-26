import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Card, cardElevations, cardPaddings, cardSeverities } from "./Card";

const slot = (container: HTMLElement): HTMLElement => {
  const element = container.querySelector<HTMLElement>("[data-slot='card']");
  if (!element) {
    throw new Error("card slot not found");
  }
  return element;
};

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Kanto Polymer KK</Card>);
    expect(screen.getByText("Kanto Polymer KK")).toBeInTheDocument();
  });

  it("renders a div when not selectable", () => {
    const { container } = render(<Card>Content</Card>);
    expect(slot(container).tagName).toBe("DIV");
  });

  it("exposes no role when not selectable", () => {
    render(<Card>Content</Card>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("applies the default elevation and padding", () => {
    const { container } = render(<Card>Content</Card>);
    const className: string = slot(container).className;
    expect(className).toContain("p-4");
    expect(className).not.toContain("shadow-raised");
  });

  it("gives every elevation a distinct set of classes", () => {
    const classNames: Array<string> = cardElevations.map((elevation) => {
      const { container, unmount } = render(
        <Card elevation={elevation}>Content</Card>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(cardElevations.length);
  });

  it("gives every padding a distinct set of classes", () => {
    const classNames: Array<string> = cardPaddings.map((padding) => {
      const { container, unmount } = render(
        <Card padding={padding}>Content</Card>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(cardPaddings.length);
  });

  it("gives every severity a distinct accent edge", () => {
    const classNames: Array<string> = cardSeverities.map((severity) => {
      const { container, unmount } = render(
        <Card severity={severity}>Content</Card>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(cardSeverities.length);
  });

  it("renders no accent edge when severity is omitted", () => {
    const { container } = render(<Card>Content</Card>);
    expect(slot(container).className).not.toContain("border-l-4");
  });

  describe("selectable", () => {
    it("renders a real button", () => {
      render(
        <Card selectable onClick={() => undefined}>
          Content
        </Card>,
      );
      const button: HTMLElement = screen.getByRole("button");
      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button).toHaveAttribute("type", "button");
    });

    it("never renders an anchor — a card that navigates is not a button", () => {
      const { container } = render(
        <Card selectable onClick={() => undefined}>
          Content
        </Card>,
      );
      expect(container.querySelector("a")).toBeNull();
    });

    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      render(
        <Card selectable onClick={onClick}>
          Content
        </Card>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates on both Enter and Space, being a real button", async () => {
      const onClick = vi.fn();
      render(
        <Card selectable onClick={onClick}>
          Content
        </Card>,
      );
      screen.getByRole("button").focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("undoes the button's centred text", () => {
      const { container } = render(
        <Card selectable onClick={() => undefined}>
          Content
        </Card>,
      );
      expect(slot(container).className).toContain("text-left");
    });

    it("does not fire when disabled", async () => {
      const onClick = vi.fn();
      render(
        <Card selectable disabled onClick={onClick}>
          Content
        </Card>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("marks itself selectable for styling hooks", () => {
      const { container } = render(
        <Card selectable onClick={() => undefined}>
          Content
        </Card>,
      );
      expect(slot(container)).toHaveAttribute("data-selectable", "true");
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<Card className="mt-4">Content</Card>);
    const className: string = slot(container).className;
    expect(className).toContain("mt-4");
    expect(className).toContain("bg-bg-surface");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    const { container } = render(<Card className="p-8">Content</Card>);
    const className: string = slot(container).className;
    expect(className).toContain("p-8");
    expect(className).not.toContain("p-4");
  });

  it("forwards a ref to the div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Card data-testid="deal">Content</Card>);
    expect(slot(container)).toHaveAttribute("data-testid", "deal");
  });
});
