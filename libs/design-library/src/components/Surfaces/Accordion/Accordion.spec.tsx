import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Accordion, type AccordionSection } from "./Accordion";

const sections: Array<AccordionSection> = [
  {
    value: "terms",
    label: "Shipping terms",
    content: <span>{"FOB Vancouver, 30 days."}</span>,
  },
  {
    value: "items",
    label: "Line items",
    content: <input aria-label="Quantity" />,
  },
  {
    value: "audit",
    label: "Audit trail",
    content: <span>{"Nothing to see."}</span>,
    disabled: true,
  },
];

const header = (name: string): HTMLElement =>
  screen.getByRole("button", { name });

/**
 * Only ever finds an open section. A closed one carries the `hidden`
 * attribute, so it is not in the accessibility tree at all — which is a
 * stronger statement than being invisible, and the one worth asserting.
 */
const region = (name: string): HTMLElement | null =>
  screen.queryByRole("region", { name });

describe("Accordion", () => {
  it("renders a header per section", () => {
    render(<Accordion headingLevel={3} sections={sections} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("starts with everything closed", () => {
    render(<Accordion headingLevel={3} sections={sections} />);
    expect(header("Shipping terms")).toHaveAttribute("aria-expanded", "false");
    expect(region("Shipping terms")).not.toBeInTheDocument();
  });

  describe("the heading", () => {
    it("puts each header in the document outline", () => {
      render(<Accordion headingLevel={3} sections={sections} />);
      expect(
        screen.getByRole("heading", { level: 3, name: "Shipping terms" }),
      ).toBeInTheDocument();
    });

    it("takes the level from the caller, because only the page knows it", () => {
      render(<Accordion headingLevel={5} sections={sections} />);
      expect(
        screen.getByRole("heading", { level: 5, name: "Line items" }),
      ).toBeInTheDocument();
    });

    it("puts a real button inside the heading", () => {
      render(<Accordion headingLevel={3} sections={sections} />);
      const heading = screen.getByRole("heading", { name: "Shipping terms" });
      expect(heading.querySelector("button")).not.toBeNull();
    });
  });

  describe("opening", () => {
    it("opens on click", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      await user.click(header("Shipping terms"));
      expect(header("Shipping terms")).toHaveAttribute("aria-expanded", "true");
      expect(region("Shipping terms")).toBeInTheDocument();
    });

    it("closes again on a second click", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      await user.click(header("Shipping terms"));
      await user.click(header("Shipping terms"));
      expect(region("Shipping terms")).not.toBeInTheDocument();
    });

    it("closes the previous one by default", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      await user.click(header("Shipping terms"));
      await user.click(header("Line items"));
      expect(region("Shipping terms")).not.toBeInTheDocument();
      expect(region("Line items")).toBeInTheDocument();
    });

    it("keeps both open when told to", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} allowMultiple sections={sections} />);
      await user.click(header("Shipping terms"));
      await user.click(header("Line items"));
      expect(region("Shipping terms")).toBeInTheDocument();
      expect(region("Line items")).toBeInTheDocument();
    });

    it("refuses a disabled section", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      await user.click(header("Audit trail"));
      expect(region("Audit trail")).not.toBeInTheDocument();
    });

    it("opens what it was told to on arrival", () => {
      render(
        <Accordion
          headingLevel={3}
          defaultExpanded={["items"]}
          sections={sections}
        />,
      );
      expect(region("Line items")).toBeInTheDocument();
    });
  });

  describe("controlled", () => {
    it("shows what it is given, and nothing else", () => {
      render(
        <Accordion
          headingLevel={3}
          expanded={["terms"]}
          onExpandedChange={vi.fn()}
          sections={sections}
        />,
      );
      expect(region("Shipping terms")).toBeInTheDocument();
      expect(region("Line items")).not.toBeInTheDocument();
    });

    it("does not move on its own", async () => {
      const user = userEvent.setup();
      render(
        <Accordion
          headingLevel={3}
          expanded={[]}
          onExpandedChange={vi.fn()}
          sections={sections}
        />,
      );
      await user.click(header("Shipping terms"));
      expect(region("Shipping terms")).not.toBeInTheDocument();
    });

    it("reports what should open", async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      render(
        <Accordion
          headingLevel={3}
          expanded={[]}
          onExpandedChange={onExpandedChange}
          sections={sections}
        />,
      );
      await user.click(header("Line items"));
      expect(onExpandedChange).toHaveBeenCalledWith(["items"]);
    });
  });

  describe("keyboard", () => {
    it("keeps every header in the tab order", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      await user.tab();
      expect(header("Shipping terms")).toHaveFocus();
      await user.tab();
      expect(header("Line items")).toHaveFocus();
    });

    it("moves down between headers", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      header("Shipping terms").focus();
      await user.keyboard("{ArrowDown}");
      expect(header("Line items")).toHaveFocus();
    });

    it("skips a disabled header", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      header("Line items").focus();
      await user.keyboard("{ArrowDown}");
      expect(header("Shipping terms")).toHaveFocus();
    });

    it("moves up", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      header("Line items").focus();
      await user.keyboard("{ArrowUp}");
      expect(header("Shipping terms")).toHaveFocus();
    });

    it("jumps with Home and End", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      header("Shipping terms").focus();
      await user.keyboard("{End}");
      expect(header("Line items")).toHaveFocus();
      await user.keyboard("{Home}");
      expect(header("Shipping terms")).toHaveFocus();
    });

    it("moves focus without opening anything", async () => {
      const user = userEvent.setup();
      render(<Accordion headingLevel={3} sections={sections} />);
      header("Shipping terms").focus();
      await user.keyboard("{ArrowDown}");
      expect(region("Line items")).not.toBeInTheDocument();
    });
  });

  it("names each region from its header", () => {
    render(
      <Accordion
        headingLevel={3}
        defaultExpanded={["terms"]}
        sections={sections}
      />,
    );
    expect(region("Shipping terms")).toBeInTheDocument();
  });

  it("keeps closed content mounted, so what is typed in it survives", async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        headingLevel={3}
        defaultExpanded={["items"]}
        sections={sections}
      />,
    );
    await user.type(screen.getByLabelText("Quantity"), "120");
    await user.click(header("Shipping terms"));
    expect(screen.getByLabelText("Quantity")).toHaveValue("120");
  });
});
