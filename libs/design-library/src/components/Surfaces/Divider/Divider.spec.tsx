import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Divider, dividerEmphases, dividerOrientations } from "./Divider";

const slot = (container: HTMLElement, name = "divider"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Divider", () => {
  it("renders a real hr, which carries role=separator implicitly", () => {
    render(<Divider />);
    const separator: HTMLElement = screen.getByRole("separator");
    expect(separator).toBeInstanceOf(HTMLHRElement);
  });

  it("applies the default orientation and emphasis", () => {
    const { container } = render(<Divider />);
    const className: string = slot(container).className;
    expect(className).toContain("h-px");
    expect(className).toContain("bg-border-default");
  });

  it("gives every orientation a distinct set of classes", () => {
    const classNames: Array<string> = dividerOrientations.map((orientation) => {
      const { container, unmount } = render(
        <Divider orientation={orientation} />,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(dividerOrientations.length);
  });

  it("gives every emphasis a distinct set of classes", () => {
    const classNames: Array<string> = dividerEmphases.map((emphasis) => {
      const { container, unmount } = render(<Divider emphasis={emphasis} />);
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(dividerEmphases.length);
  });

  it("marks a vertical divider's orientation for assistive technology", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("leaves a horizontal divider's orientation implicit", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).not.toHaveAttribute(
      "aria-orientation",
    );
  });

  it("hides a decorative divider from assistive technology entirely", () => {
    render(<Divider decorative />);
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("marks a decorative divider aria-hidden", () => {
    const { container } = render(<Divider decorative />);
    expect(slot(container)).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes the orientation as a data attribute for styling hooks", () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(slot(container)).toHaveAttribute("data-orientation", "vertical");
  });

  describe("labelled", () => {
    it("renders the label", () => {
      render(<Divider label="Logistics" />);
      expect(screen.getByText("Logistics")).toBeInTheDocument();
    });

    it("has no separator role, so the label is not swallowed", () => {
      render(<Divider label="Logistics" />);
      expect(screen.queryByRole("separator")).toBeNull();
    });

    it("hides both rules from assistive technology", () => {
      const { container } = render(<Divider label="Logistics" />);
      const rules = container.querySelectorAll("[data-slot='divider']");
      expect(rules).toHaveLength(2);
      for (const rule of rules) {
        expect(rule).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("ignores the label when vertical, which has nowhere to put it", () => {
      render(<Divider orientation="vertical" label="Logistics" />);
      expect(screen.queryByText("Logistics")).toBeNull();
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("merges className onto the wrapper", () => {
      const { container } = render(
        <Divider label="Logistics" className="my-4" />,
      );
      expect(slot(container, "divider-labelled").className).toContain("my-4");
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<Divider className="my-4" />);
    const className: string = slot(container).className;
    expect(className).toContain("my-4");
    expect(className).toContain("bg-border-default");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    const { container } = render(<Divider className="h-1" />);
    const className: string = slot(container).className;
    expect(className).toContain("h-1");
    expect(className).not.toContain("h-px");
  });

  it("forwards a ref to the underlying hr", () => {
    const ref = createRef<HTMLHRElement>();
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Divider data-testid="rule" />);
    expect(slot(container)).toHaveAttribute("data-testid", "rule");
  });
});
