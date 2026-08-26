import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  ProgressBar,
  progressBarSeverities,
  progressBarSizes,
} from "./ProgressBar";

const slot = (container: HTMLElement, name: string): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

const thresholds = { warning: 0.6, error: 0.85 };

describe("ProgressBar", () => {
  it("exposes the progressbar role", () => {
    render(<ProgressBar label="Upload" value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("takes its accessible name from label", () => {
    render(<ProgressBar label="Demurrage free time" value={2} max={7} />);
    expect(
      screen.getByRole("progressbar", { name: "Demurrage free time" }),
    ).toBeInTheDocument();
  });

  it("reports value, min and max", () => {
    render(<ProgressBar label="Free time" value={5} max={7} />);
    const bar: HTMLElement = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "5");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "7");
  });

  it("announces the value label rather than a bare number", () => {
    render(
      <ProgressBar
        label="Free time"
        value={5}
        max={7}
        valueLabel="5 / 7 days"
      />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "5 / 7 days",
    );
  });

  it("renders the label and value label visibly", () => {
    render(
      <ProgressBar
        label="Free time"
        value={5}
        max={7}
        valueLabel="5 / 7 days"
      />,
    );
    expect(screen.getByText("Free time")).toBeInTheDocument();
    expect(screen.getByText("5 / 7 days")).toBeInTheDocument();
  });

  it("keeps the label as the accessible name when hidden visually", () => {
    render(<ProgressBar label="Free time" value={5} max={7} labelHidden />);
    expect(screen.queryByText("Free time")).toBeNull();
    expect(
      screen.getByRole("progressbar", { name: "Free time" }),
    ).toBeInTheDocument();
  });

  it("sets the fill width from value over max", () => {
    const { container } = render(
      <ProgressBar label="Free time" value={5} max={7} />,
    );
    expect(slot(container, "progress-bar-fill").style.width).toBe(
      `${String((5 / 7) * 100)}%`,
    );
  });

  it("clamps a value above max", () => {
    const { container } = render(
      <ProgressBar label="Free time" value={99} max={7} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "7",
    );
    expect(slot(container, "progress-bar-fill").style.width).toBe("100%");
  });

  it("clamps a negative value to zero", () => {
    const { container } = render(<ProgressBar label="Free time" value={-5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(slot(container, "progress-bar-fill").style.width).toBe("0%");
  });

  it("survives a max of zero without dividing by it", () => {
    const { container } = render(
      <ProgressBar label="Free time" value={0} max={0} />,
    );
    expect(slot(container, "progress-bar-fill").style.width).toBe("0%");
  });

  it("gives every severity a distinct set of classes", () => {
    const classNames: Array<string> = progressBarSeverities.map((severity) => {
      const { container, unmount } = render(
        <ProgressBar label="Free time" value={50} severity={severity} />,
      );
      const className: string = slot(container, "progress-bar-fill").className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(progressBarSeverities.length);
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = progressBarSizes.map((size) => {
      const { container, unmount } = render(
        <ProgressBar label="Free time" value={50} size={size} />,
      );
      const className: string = slot(container, "progress-bar-track").className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(progressBarSizes.length);
  });

  describe("thresholds", () => {
    it("is success below the warning threshold", () => {
      const { container } = render(
        <ProgressBar
          label="Free time"
          value={2}
          max={7}
          thresholds={thresholds}
        />,
      );
      expect(slot(container, "progress-bar-fill").className).toContain(
        "bg-bg-success",
      );
    });

    it("turns warning at the threshold", () => {
      const { container } = render(
        <ProgressBar
          label="Free time"
          value={6}
          max={10}
          thresholds={thresholds}
        />,
      );
      expect(slot(container, "progress-bar-fill").className).toContain(
        "bg-bg-warning",
      );
    });

    it("turns error at the threshold", () => {
      const { container } = render(
        <ProgressBar
          label="Free time"
          value={19}
          max={21}
          thresholds={thresholds}
        />,
      );
      expect(slot(container, "progress-bar-fill").className).toContain(
        "bg-bg-error",
      );
    });

    it("works the same at a different max, being fractions not absolutes", () => {
      const { container: sevenDays } = render(
        <ProgressBar label="A" value={6} max={7} thresholds={thresholds} />,
      );
      const { container: twentyOneDays } = render(
        <ProgressBar label="B" value={18} max={21} thresholds={thresholds} />,
      );
      expect(slot(sevenDays, "progress-bar-fill").className).toBe(
        slot(twentyOneDays, "progress-bar-fill").className,
      );
    });
  });

  describe("indeterminate", () => {
    it("drops aria-valuenow, min and max", () => {
      render(<ProgressBar label="Applying FX rates" indeterminate />);
      const bar: HTMLElement = screen.getByRole("progressbar");
      expect(bar).not.toHaveAttribute("aria-valuenow");
      expect(bar).not.toHaveAttribute("aria-valuemin");
      expect(bar).not.toHaveAttribute("aria-valuemax");
    });

    it("keeps its accessible name", () => {
      render(<ProgressBar label="Applying FX rates" indeterminate />);
      expect(
        screen.getByRole("progressbar", { name: "Applying FX rates" }),
      ).toBeInTheDocument();
    });

    it("animates rather than setting a width", () => {
      const { container } = render(
        <ProgressBar label="Working" indeterminate />,
      );
      const fill: HTMLElement = slot(container, "progress-bar-fill");
      expect(fill.className).toContain("animate-progress-indeterminate");
      expect(fill.style.width).toBe("");
    });

    it("falls back to a full flat bar under prefers-reduced-motion", () => {
      const { container } = render(
        <ProgressBar label="Working" indeterminate />,
      );
      const className: string = slot(container, "progress-bar-fill").className;
      expect(className).toContain("motion-reduce:animate-none");
      expect(className).toContain("motion-reduce:w-full");
    });
  });

  it("merges className onto the wrapper", () => {
    const { container } = render(
      <ProgressBar label="Free time" value={50} className="mt-4" />,
    );
    expect(slot(container, "progress-bar").className).toContain("mt-4");
  });

  it("forwards a ref to the wrapper", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProgressBar label="Free time" value={50} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <ProgressBar label="Free time" value={50} data-testid="clock" />,
    );
    expect(slot(container, "progress-bar")).toHaveAttribute(
      "data-testid",
      "clock",
    );
  });
});
