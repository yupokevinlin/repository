import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Alert, alertSeverities } from "./Alert";

const slot = (container: HTMLElement, name = "alert"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Alert", () => {
  it("renders a title", () => {
    render(<Alert title="SDS expires before ETA" />);
    expect(screen.getByText("SDS expires before ETA")).toBeInTheDocument();
  });

  it("renders a body", () => {
    render(<Alert>The carrier will refuse the DG booking.</Alert>);
    expect(
      screen.getByText("The carrier will refuse the DG booking."),
    ).toBeInTheDocument();
  });

  it("renders both together", () => {
    render(
      <Alert title="SDS expires before ETA">
        The carrier will refuse the DG booking.
      </Alert>,
    );
    expect(screen.getByText("SDS expires before ETA")).toBeInTheDocument();
    expect(
      screen.getByText("The carrier will refuse the DG booking."),
    ).toBeInTheDocument();
  });

  it("carries no role=alert — it is static, not a live region", () => {
    render(<Alert severity="error" title="CIF is invalid for air freight" />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("has no live region attributes at all", () => {
    const { container } = render(<Alert title="SDS expires before ETA" />);
    const element: HTMLElement = slot(container);
    expect(element).not.toHaveAttribute("aria-live");
    expect(element).not.toHaveAttribute("role");
  });

  it("offers no dismiss affordance", () => {
    render(
      <Alert severity="warning" title="SDS expires before ETA">
        The carrier will refuse the DG booking.
      </Alert>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("applies the default severity", () => {
    const { container } = render(<Alert title="Note" />);
    expect(slot(container).className).toContain("bg-bg-info-soft");
  });

  it("gives every severity a distinct set of classes", () => {
    const classNames: Array<string> = alertSeverities.map((severity) => {
      const { container, unmount } = render(
        <Alert severity={severity} title="Note" />,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(alertSeverities.length);
  });

  it("exposes the severity as a data attribute for styling hooks", () => {
    const { container } = render(<Alert severity="error" title="Note" />);
    expect(slot(container)).toHaveAttribute("data-severity", "error");
  });

  it("renders an icon, hidden from assistive technology", () => {
    const { container } = render(
      <Alert icon={<svg data-testid="icon" />} title="Note" />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(slot(container, "alert-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders actions", () => {
    render(
      <Alert
        title="Credit limit exceeded"
        actions={<button type="button">Request override</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Request override" }),
    ).toBeInTheDocument();
  });

  describe("severityLabel", () => {
    it("is not rendered unless asked for", () => {
      const { container } = render(<Alert severity="error" title="Note" />);
      expect(
        container.querySelector("[data-slot='alert-severity-label']"),
      ).toBeNull();
    });

    it("prefixes the title, visually hidden", () => {
      const { container } = render(
        <Alert severity="error" severityLabel="Error:" title="Note" />,
      );
      const label: HTMLElement = slot(container, "alert-severity-label");
      expect(label.className).toContain("sr-only");
      expect(label.textContent).toContain("Error:");
    });

    it("reaches the accessible text when there is no title", () => {
      const { container } = render(
        <Alert severity="error" severityLabel="Error:">
          Credit limit exceeded.
        </Alert>,
      );
      expect(slot(container).textContent).toContain("Error:");
    });

    it("is rendered once, not on both title and body", () => {
      const { container } = render(
        <Alert severity="error" severityLabel="Error:" title="Note">
          Body copy.
        </Alert>,
      );
      expect(
        container.querySelectorAll("[data-slot='alert-severity-label']"),
      ).toHaveLength(1);
    });
  });

  it("merges className rather than replacing the severity classes", () => {
    const { container } = render(<Alert title="Note" className="mt-4" />);
    const className: string = slot(container).className;
    expect(className).toContain("mt-4");
    expect(className).toContain("bg-bg-info-soft");
  });

  it("forwards a ref to the wrapper", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert title="Note" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Alert title="Note" data-testid="advisory" />);
    expect(slot(container)).toHaveAttribute("data-testid", "advisory");
  });
});
