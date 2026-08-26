import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Badge, badgeAppearances, badgeSeverities, badgeSizes } from "./Badge";

const slot = (container: HTMLElement, name = "badge"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>At port</Badge>);
    expect(screen.getByText("At port")).toBeInTheDocument();
  });

  it("applies the default severity, appearance and size", () => {
    const { container } = render(<Badge>At port</Badge>);
    const className: string = slot(container).className;
    expect(className).toContain("bg-bg-hover");
    expect(className).toContain("h-6");
  });

  it("gives every severity a distinct set of classes", () => {
    const classNames: Array<string> = badgeSeverities.map((severity) => {
      const { container, unmount } = render(
        <Badge severity={severity}>At port</Badge>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(badgeSeverities.length);
  });

  it("gives every appearance a distinct set of classes", () => {
    const classNames: Array<string> = badgeAppearances.map((appearance) => {
      const { container, unmount } = render(
        <Badge appearance={appearance}>At port</Badge>,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(badgeAppearances.length);
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = badgeSizes.map((size) => {
      const { container, unmount } = render(<Badge size={size}>3</Badge>);
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(badgeSizes.length);
  });

  it("keeps every severity × appearance pair distinct", () => {
    const classNames: Array<string> = badgeSeverities.flatMap((severity) =>
      badgeAppearances.map((appearance) => {
        const { container, unmount } = render(
          <Badge severity={severity} appearance={appearance}>
            At port
          </Badge>,
        );
        const className: string = slot(container).className;
        unmount();
        return className;
      }),
    );
    expect(new Set(classNames).size).toBe(
      badgeSeverities.length * badgeAppearances.length,
    );
  });

  it("renders no dot by default", () => {
    const { container } = render(<Badge>At port</Badge>);
    expect(container.querySelector("[data-slot='badge-dot']")).toBeNull();
  });

  it("renders a dot when asked, hidden from assistive technology", () => {
    const { container } = render(
      <Badge severity="warning" dot>
        At port
      </Badge>,
    );
    expect(slot(container, "badge-dot")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an icon, hidden from assistive technology", () => {
    const { container } = render(
      <Badge icon={<svg data-testid="icon" />}>At port</Badge>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(slot(container, "badge-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("leaves a numeric child alone when it is within max", () => {
    render(<Badge max={99}>{42}</Badge>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("clamps a numeric child above max", () => {
    render(<Badge max={99}>{147}</Badge>);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("clamps a numeric string child above max", () => {
    render(<Badge max={99}>147</Badge>);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("ignores max when the child is not numeric", () => {
    render(<Badge max={99}>At port</Badge>);
    expect(screen.getByText("At port")).toBeInTheDocument();
  });

  it("takes its accessible name from aria-label when there is no text", () => {
    render(<Badge severity="error" dot aria-label="3 approvals overdue" />);
    expect(screen.getByLabelText("3 approvals overdue")).toBeInTheDocument();
  });

  it("lets aria-label override the visible text, so colour is never the only meaning", () => {
    render(
      <Badge severity="error" aria-label="3 approvals overdue">
        3
      </Badge>,
    );
    expect(screen.getByLabelText("3 approvals overdue")).toBeInTheDocument();
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<Badge className="ml-2">At port</Badge>);
    const className: string = slot(container).className;
    expect(className).toContain("ml-2");
    expect(className).toContain("bg-bg-hover");
  });

  it("lets className win a conflict, per the cn() contract", () => {
    const { container } = render(<Badge className="h-8">At port</Badge>);
    const className: string = slot(container).className;
    expect(className).toContain("h-8");
    expect(className).not.toContain("h-6");
  });

  it("forwards a ref to the underlying span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>At port</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("forwards arbitrary native props", () => {
    render(<Badge title="Free time ends in 2 days">At port</Badge>);
    expect(slot(document.body).getAttribute("title")).toBe(
      "Free time ends in 2 days",
    );
  });
});
