import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Step } from "./Step/Step";
import { Stepper } from "./Stepper";

const steps = [
  <Step key="party" label="Counterparty" status="complete" />,
  <Step key="terms" label="Terms" status="current" />,
  <Step
    key="credit"
    label="Credit check"
    status="blocked"
    description="Waiting on finance"
  />,
  <Step key="docs" label="Documents" status="upcoming" />,
];

const item = (index: number): HTMLElement =>
  screen.getAllByRole("listitem")[index];

describe("Stepper", () => {
  it("is an ordered list, because the order is the point", () => {
    const { container } = render(
      <Stepper orientation="horizontal">{steps}</Stepper>,
    );
    expect(container.querySelector("ol")).not.toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("takes a name", () => {
    render(
      <Stepper orientation="horizontal" aria-label="New deal">
        {steps}
      </Stepper>,
    );
    expect(screen.getByRole("list", { name: "New deal" })).toBeInTheDocument();
  });

  it("ignores children that are not steps", () => {
    render(
      <Stepper orientation="horizontal">
        <Step label="Counterparty" status="current" />
        <span>{"Stray"}</span>
      </Stepper>,
    );
    expect(screen.queryByText("Stray")).not.toBeInTheDocument();
  });

  it("numbers the steps", () => {
    render(<Stepper orientation="horizontal">{steps}</Stepper>);
    // The first is complete, so it shows a tick rather than its number.
    expect(item(1).textContent).toContain("2");
    expect(item(3).textContent).toContain("4");
  });

  it("ticks a completed step instead of numbering it", () => {
    const { container } = render(
      <Stepper orientation="horizontal">{steps}</Stepper>,
    );
    expect(
      container
        .querySelectorAll("[data-slot='stepper-marker']")[0]
        .querySelector("svg"),
    ).not.toBeNull();
  });

  it("shows a description when there is one", () => {
    render(<Stepper orientation="horizontal">{steps}</Stepper>);
    expect(screen.getByText("Waiting on finance")).toBeInTheDocument();
  });

  describe("the current step", () => {
    it("marks it", () => {
      render(<Stepper orientation="horizontal">{steps}</Stepper>);
      expect(item(1)).toHaveAttribute("aria-current", "step");
    });

    it("marks only it", () => {
      const { container } = render(
        <Stepper orientation="horizontal">{steps}</Stepper>,
      );
      expect(container.querySelectorAll("[aria-current]")).toHaveLength(1);
    });

    it("counts a revisited step as the current one", () => {
      render(
        <Stepper orientation="vertical">
          <Step label="Company" status="revisited" />
          <Step label="Credit check" status="upcoming" />
        </Stepper>,
      );
      expect(item(0)).toHaveAttribute("aria-current", "step");
    });
  });

  describe("status, in words and not only in colour", () => {
    it("says where each step stands", () => {
      render(<Stepper orientation="horizontal">{steps}</Stepper>);
      expect(item(0).textContent).toContain("completed");
      expect(item(1).textContent).toContain("current step");
      expect(item(2).textContent).toContain("blocked");
      expect(item(3).textContent).toContain("not started");
    });

    it("distinguishes a revisited step from a fresh one", () => {
      render(
        <Stepper orientation="vertical">
          <Step label="Company" status="revisited" />
        </Stepper>,
      );
      expect(item(0).textContent).toContain("already completed");
    });

    it("takes caller-supplied wording", () => {
      render(
        <Stepper
          orientation="horizontal"
          statusLabel={(status: string) => `état: ${status}`}
        >
          <Step label="Terms" status="current" />
        </Stepper>,
      );
      expect(item(0).textContent).toContain("état: current");
    });

    it("carries the status on the element too, for styling", () => {
      render(<Stepper orientation="horizontal">{steps}</Stepper>);
      expect(item(2)).toHaveAttribute("data-status", "blocked");
    });
  });

  describe("links", () => {
    it("renders the consumer's own", () => {
      render(
        <Stepper orientation="vertical">
          <Step label="Company" status="revisited">
            <a href="/app/onboarding/company">{"Company"}</a>
          </Step>
        </Stepper>,
      );
      expect(screen.getByRole("link", { name: "Company" })).toHaveAttribute(
        "href",
        "/app/onboarding/company",
      );
    });

    it("falls back to the label where there is no link", () => {
      render(<Stepper orientation="horizontal">{steps}</Stepper>);
      expect(screen.queryAllByRole("link")).toHaveLength(0);
      expect(screen.getByText("Terms")).toBeInTheDocument();
    });
  });

  describe("orientation", () => {
    it("runs across", () => {
      const { container } = render(
        <Stepper orientation="horizontal">{steps}</Stepper>,
      );
      expect(container.querySelector("ol")?.className).toContain("flex-row");
    });

    it("runs down", () => {
      const { container } = render(
        <Stepper orientation="vertical">{steps}</Stepper>,
      );
      expect(container.querySelector("ol")?.className).toContain("flex-col");
    });

    it("draws the connector between steps and stops at the last", () => {
      const { container } = render(
        <Stepper orientation="horizontal">{steps}</Stepper>,
      );
      expect(
        container.querySelectorAll("[data-slot='stepper-connector']"),
      ).toHaveLength(3);
    });
  });

  describe("density", () => {
    it("is comfortable by default", () => {
      const { container } = render(
        <Stepper orientation="vertical">{steps}</Stepper>,
      );
      expect(item(0).className).toContain("pb-5");
      expect(container).toBeInTheDocument();
    });

    it("tightens when compact", () => {
      render(
        <Stepper orientation="vertical" density="compact">
          {steps}
        </Stepper>,
      );
      expect(item(0).className).toContain("pb-3");
    });
  });
});

describe("Step", () => {
  it("renders nothing on its own", () => {
    const { container } = render(<Step label="Terms" status="current" />);
    expect(container).toBeEmptyDOMElement();
  });
});
