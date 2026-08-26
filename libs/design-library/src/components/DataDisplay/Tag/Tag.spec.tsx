import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Tag, tagAppearances, tagSizes } from "./Tag";

const slot = (container: HTMLElement, name = "tag"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Tag", () => {
  it("renders its label", () => {
    render(<Tag>JP/CN lane</Tag>);
    expect(screen.getByText("JP/CN lane")).toBeInTheDocument();
  });

  it("applies the default appearance and size", () => {
    const { container } = render(<Tag>JP/CN lane</Tag>);
    const className: string = slot(container).className;
    expect(className).toContain("bg-bg-hover");
    expect(className).toContain("h-6");
  });

  it("gives every appearance a distinct set of classes", () => {
    const classNames: Array<string> = tagAppearances.map((appearance) => {
      const { container, unmount } = render(
        <Tag appearance={appearance}>JP/CN lane</Tag>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(tagAppearances.length);
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = tagSizes.map((size) => {
      const { container, unmount } = render(<Tag size={size}>JP/CN lane</Tag>);
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(tagSizes.length);
  });

  it("renders an icon, hidden from assistive technology", () => {
    const { container } = render(
      <Tag icon={<svg data-testid="icon" />}>JP/CN lane</Tag>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(slot(container, "tag-icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("is not interactive without onRemove", () => {
    render(<Tag>JP/CN lane</Tag>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the remove affordance as a real button", () => {
    render(
      <Tag onRemove={() => undefined} removeLabel="Remove Chemicals filter">
        Chemicals
      </Tag>,
    );
    const button: HTMLElement = screen.getByRole("button", {
      name: "Remove Chemicals filter",
    });
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button).toHaveAttribute("type", "button");
  });

  it("calls onRemove when the remove button is clicked", async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove Chemicals filter">
        Chemicals
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("removes on both Enter and Space, being a real button", async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove Chemicals filter">
        Chemicals
      </Tag>,
    );
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it("does not remove when disabled", async () => {
    const onRemove = vi.fn();
    render(
      <Tag disabled onRemove={onRemove} removeLabel="Remove Chemicals filter">
        Chemicals
      </Tag>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    await userEvent.click(screen.getByRole("button"));
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("applies disabled styling to the tag itself", () => {
    const { container } = render(<Tag disabled>JP/CN lane</Tag>);
    expect(slot(container).className).toContain("text-fg-disabled");
  });

  it("gives back right padding when removable, so the button fits", () => {
    const { container: plain } = render(<Tag>Chemicals</Tag>);
    const { container: removable } = render(
      <Tag onRemove={() => undefined} removeLabel="Remove Chemicals filter">
        Chemicals
      </Tag>,
    );
    expect(slot(plain).className).not.toContain("pr-1");
    expect(slot(removable).className).toContain("pr-1");
  });

  it("hides the remove glyph from assistive technology", () => {
    const { container } = render(
      <Tag onRemove={() => undefined} removeLabel="Remove Chemicals filter">
        Chemicals
      </Tag>,
    );
    expect(slot(container, "tag-remove").querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<Tag className="ml-2">JP/CN lane</Tag>);
    const className: string = slot(container).className;
    expect(className).toContain("ml-2");
    expect(className).toContain("bg-bg-hover");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    const { container } = render(<Tag className="h-8">JP/CN lane</Tag>);
    const className: string = slot(container).className;
    expect(className).toContain("h-8");
    expect(className).not.toContain("h-6");
  });

  it("forwards a ref to the underlying span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>JP/CN lane</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Tag title="Trade lane">JP/CN lane</Tag>);
    expect(slot(container)).toHaveAttribute("title", "Trade lane");
  });
});
