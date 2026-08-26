import { render, screen } from "@testing-library/react";
import { createRef, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Avatar } from "../Avatar";
import { AvatarGroup } from "./AvatarGroup";

const slot = (container: HTMLElement, name = "avatar-group"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

const slots = (container: HTMLElement, name: string): Array<HTMLElement> =>
  Array.from(container.querySelectorAll<HTMLElement>(`[data-slot='${name}']`));

/** An array rather than a fragment: React's Children API does not look
 * inside a fragment, so a group handed one sees a single child. */
const three: Array<ReactNode> = [
  <Avatar key="lin" name="K. Lin" />,
  <Avatar key="sato" name="M. Sato" />,
  <Avatar key="okafor" name="R. Okafor" />,
];

describe("AvatarGroup", () => {
  it("renders every avatar when there is no cap", () => {
    const { container } = render(<AvatarGroup>{three}</AvatarGroup>);
    expect(slots(container, "avatar-group-item")).toHaveLength(3);
  });

  it("keeps each avatar's own name", () => {
    render(<AvatarGroup>{three}</AvatarGroup>);
    expect(screen.getByText("K. Lin")).toBeInTheDocument();
    expect(screen.getByText("R. Okafor")).toBeInTheDocument();
  });

  it("overlaps every avatar after the first", () => {
    const { container } = render(<AvatarGroup>{three}</AvatarGroup>);
    const items: Array<HTMLElement> = slots(container, "avatar-group-item");
    expect(items[0]?.className).not.toContain("-ml-");
    expect(items[1]?.className).toContain("-ml-2");
    expect(items[2]?.className).toContain("-ml-2");
  });

  it("rings only the overlapping ones, since the first has nothing behind it", () => {
    const { container } = render(<AvatarGroup>{three}</AvatarGroup>);
    const items: Array<HTMLElement> = slots(container, "avatar-group-item");
    expect(items[0]?.className).not.toContain("ring-2");
    expect(items[1]?.className).toContain("ring-2");
  });

  it("rounds the wrapper to match the shape, so the ring is not square", () => {
    const { container } = render(<AvatarGroup>{three}</AvatarGroup>);
    expect(slots(container, "avatar-group-item")[1]?.className).toContain(
      "rounded-full",
    );
  });

  it("rounds the wrapper as a square when the avatars are squares", () => {
    const { container } = render(
      <AvatarGroup shape="square">{three}</AvatarGroup>,
    );
    expect(slots(container, "avatar-group-item")[1]?.className).toContain(
      "rounded-md",
    );
  });

  it("tightens the overlap for smaller avatars", () => {
    const { container } = render(<AvatarGroup size="6">{three}</AvatarGroup>);
    expect(slots(container, "avatar-group-item")[1]?.className).toContain(
      "-ml-1.5",
    );
  });

  it("sizes every avatar the same, whatever they asked for", () => {
    const { container } = render(
      <AvatarGroup size="10">
        <Avatar name="K. Lin" size="6" />
        <Avatar name="M. Sato" />
      </AvatarGroup>,
    );
    const avatars: Array<HTMLElement> = slots(container, "avatar");
    expect(avatars[0]?.className).toContain("size-10");
    expect(avatars[1]?.className).toContain("size-10");
  });

  it("shapes every avatar the same", () => {
    const { container } = render(
      <AvatarGroup shape="square">
        <Avatar name="K. Lin" shape="circle" />
      </AvatarGroup>,
    );
    expect(slots(container, "avatar")[0]?.className).toContain("rounded-md");
  });

  describe("max", () => {
    it("shows only the first max avatars", () => {
      const { container } = render(<AvatarGroup max={2}>{three}</AvatarGroup>);
      expect(slots(container, "avatar-group-item")).toHaveLength(2);
    });

    it("collapses the rest into a count", () => {
      const { container } = render(<AvatarGroup max={2}>{three}</AvatarGroup>);
      expect(slot(container, "avatar-group-overflow").textContent).toContain(
        "+1",
      );
    });

    it("says what the count means, not just '+1'", () => {
      render(<AvatarGroup max={2}>{three}</AvatarGroup>);
      expect(screen.getByText("1 more")).toBeInTheDocument();
    });

    it("takes a caller-supplied label, for other languages", () => {
      render(
        <AvatarGroup max={2} overflowLabel={(count) => `${count} de plus`}>
          {three}
        </AvatarGroup>,
      );
      expect(screen.getByText("1 de plus")).toBeInTheDocument();
    });

    it("hides the +N glyph from assistive technology — the label carries it", () => {
      const { container } = render(<AvatarGroup max={2}>{three}</AvatarGroup>);
      const glyph = slot(container, "avatar-group-overflow").querySelector(
        "[aria-hidden='true']",
      );
      expect(glyph?.textContent).toBe("+1");
    });

    it("renders no bubble when max is not reached", () => {
      const { container } = render(<AvatarGroup max={5}>{three}</AvatarGroup>);
      expect(
        container.querySelector("[data-slot='avatar-group-overflow']"),
      ).toBeNull();
    });

    it("renders no bubble when max matches the count exactly", () => {
      const { container } = render(<AvatarGroup max={3}>{three}</AvatarGroup>);
      expect(
        container.querySelector("[data-slot='avatar-group-overflow']"),
      ).toBeNull();
    });

    it("sizes the bubble like the avatars beside it", () => {
      const { container } = render(
        <AvatarGroup max={2} size="10">
          {three}
        </AvatarGroup>,
      );
      expect(slot(container, "avatar-group-overflow").className).toContain(
        "size-10",
      );
    });
  });

  it("merges className rather than replacing the layout classes", () => {
    const { container } = render(
      <AvatarGroup className="mt-2">{three}</AvatarGroup>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("mt-2");
    expect(className).toContain("inline-flex");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AvatarGroup ref={ref}>{three}</AvatarGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <AvatarGroup data-testid="members">{three}</AvatarGroup>,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "members");
  });
});
