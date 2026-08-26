import { render, screen } from "@testing-library/react";
import { createRef, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { ButtonGroup } from "./ButtonGroup";

const slot = (container: HTMLElement, name = "button-group"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

const buttons = (container: HTMLElement): Array<HTMLElement> =>
  Array.from(container.querySelectorAll<HTMLElement>("button"));

const three: Array<ReactNode> = [
  <Button key="table">Table</Button>,
  <Button key="board">Board</Button>,
  <Button key="calendar">Calendar</Button>,
];

describe("ButtonGroup", () => {
  it("renders every button", () => {
    const { container } = render(<ButtonGroup>{three}</ButtonGroup>);
    expect(buttons(container)).toHaveLength(3);
  });

  it("keeps each button's own label", () => {
    render(<ButtonGroup>{three}</ButtonGroup>);
    expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Calendar" }),
    ).toBeInTheDocument();
  });

  it("is a group, so a name can be attached to the set", () => {
    render(<ButtonGroup aria-label="View">{three}</ButtonGroup>);
    expect(screen.getByRole("group", { name: "View" })).toBeInTheDocument();
  });

  describe("radius", () => {
    it("keeps the outer corners and squares the inner ones", () => {
      const { container } = render(<ButtonGroup>{three}</ButtonGroup>);
      const [first, middle, last] = buttons(container);
      expect(first?.className).toContain("rounded-l-md");
      expect(middle?.className).toContain("rounded-none");
      expect(middle?.className).not.toContain("rounded-l-md");
      expect(last?.className).toContain("rounded-r-md");
    });

    it("rounds top and bottom when vertical", () => {
      const { container } = render(
        <ButtonGroup orientation="vertical">{three}</ButtonGroup>,
      );
      const [first, , last] = buttons(container);
      expect(first?.className).toContain("rounded-t-md");
      expect(last?.className).toContain("rounded-b-md");
    });

    it("leaves a lone button fully rounded", () => {
      const { container } = render(
        <ButtonGroup>
          <Button>Only</Button>
        </ButtonGroup>,
      );
      expect(buttons(container)[0]?.className).not.toContain("rounded-none");
    });
  });

  describe("shared border", () => {
    it("pulls every button after the first back by a hairline", () => {
      const { container } = render(<ButtonGroup>{three}</ButtonGroup>);
      const [first, middle, last] = buttons(container);
      expect(first?.className).not.toContain("-ml-px");
      expect(middle?.className).toContain("-ml-px");
      expect(last?.className).toContain("-ml-px");
    });

    it("pulls upward instead when vertical", () => {
      const { container } = render(
        <ButtonGroup orientation="vertical">{three}</ButtonGroup>,
      );
      const [, middle] = buttons(container);
      expect(middle?.className).toContain("-mt-px");
      expect(middle?.className).not.toContain("-ml-px");
    });

    it("raises the focused button so its ring is not clipped", () => {
      const { container } = render(<ButtonGroup>{three}</ButtonGroup>);
      const className: string = buttons(container)[1]?.className ?? "";
      expect(className).toContain("relative");
      expect(className).toContain("focus-visible:z-10");
    });
  });

  describe("shared props", () => {
    it("applies variant to every button", () => {
      const { container } = render(
        <ButtonGroup variant="default-outline">{three}</ButtonGroup>,
      );
      for (const button of buttons(container)) {
        expect(button.className).toContain("border-border-default");
      }
    });

    it("applies size to every button", () => {
      const { container } = render(<ButtonGroup size="8">{three}</ButtonGroup>);
      for (const button of buttons(container)) {
        expect(button.className).toContain("h-8");
      }
    });

    it("overrides a button's own variant, since a mixed join reads wrong", () => {
      const { container } = render(
        <ButtonGroup variant="default-outline">
          <Button variant="primary-solid">Table</Button>
        </ButtonGroup>,
      );
      expect(buttons(container)[0]?.className).not.toContain("bg-bg-primary");
    });

    it("leaves each button's own variant alone when the group sets none", () => {
      const { container } = render(
        <ButtonGroup>
          <Button variant="destructive-solid">Void</Button>
        </ButtonGroup>,
      );
      expect(buttons(container)[0]?.className).toContain("bg-bg-error");
    });
  });

  it("joins an IconButton onto the end", () => {
    const { container } = render(
      <ButtonGroup>
        <Button>Save</Button>
        <IconButton icon={<svg />} aria-label="More save options" />
      </ButtonGroup>,
    );
    const [, iconButton] = buttons(container);
    expect(iconButton?.className).toContain("rounded-r-md");
    expect(iconButton).toHaveAttribute("aria-label", "More save options");
  });

  it("lays out in a row by default and a column when told", () => {
    const { container: row } = render(<ButtonGroup>{three}</ButtonGroup>);
    expect(slot(row).className).toContain("flex-row");

    const { container: column } = render(
      <ButtonGroup orientation="vertical">{three}</ButtonGroup>,
    );
    expect(slot(column).className).toContain("flex-col");
  });

  it("merges className rather than replacing the layout classes", () => {
    const { container } = render(
      <ButtonGroup className="mt-2">{three}</ButtonGroup>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("mt-2");
    expect(className).toContain("inline-flex");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ButtonGroup ref={ref}>{three}</ButtonGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <ButtonGroup data-testid="views">{three}</ButtonGroup>,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "views");
  });
});
