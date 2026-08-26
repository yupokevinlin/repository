import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Tab } from "./Tab/Tab";
import { TabPanel } from "./TabPanel/TabPanel";
import { Tabs } from "./Tabs";

const tab = (name: string): HTMLElement => screen.getByRole("tab", { name });

const Harness = ({
  orientation,
}: {
  orientation?: "horizontal" | "vertical";
}) => {
  const [value, setValue] = useState<string>("terms");
  return (
    <>
      <Tabs
        id="deal"
        value={value}
        onValueChange={setValue}
        orientation={orientation}
        aria-label="Deal sections"
      >
        <Tab value="terms" label="Terms" />
        <Tab value="items" label="Line items" count={4} />
        <Tab value="audit" label="Audit" disabled />
        <Tab value="docs" label="Documents" />
      </Tabs>
      <TabPanel id="deal" value={value}>
        <span>{`Panel for ${value}`}</span>
      </TabPanel>
    </>
  );
};

describe("Tabs", () => {
  it("is a tablist of its Tab children", () => {
    render(<Harness />);
    expect(
      screen.getByRole("tablist", { name: "Deal sections" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
  });

  it("renders no panel of its own — the layout places those", () => {
    render(
      <Tabs id="deal" value="terms" onValueChange={vi.fn()}>
        <Tab value="terms" label="Terms" />
      </Tabs>,
    );
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("ignores children that are not Tabs", () => {
    render(
      <Tabs id="deal" value="terms" onValueChange={vi.fn()}>
        <Tab value="terms" label="Terms" />
        <span>{"Stray"}</span>
      </Tabs>,
    );
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(screen.queryByText("Stray")).not.toBeInTheDocument();
  });

  it("shows the count in the tab's accessible name", () => {
    render(<Harness />);
    expect(
      screen.getByRole("tab", { name: "Line items 4" }),
    ).toBeInTheDocument();
  });

  describe("selection", () => {
    it("marks the selected tab", () => {
      render(<Harness />);
      expect(tab("Terms")).toHaveAttribute("aria-selected", "true");
      expect(tab("Documents")).toHaveAttribute("aria-selected", "false");
    });

    it("selects on click", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Documents"));
      expect(tab("Documents")).toHaveAttribute("aria-selected", "true");
    });

    it("reports the change", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs id="deal" value="terms" onValueChange={onValueChange}>
          <Tab value="terms" label="Terms" />
          <Tab value="docs" label="Documents" />
        </Tabs>,
      );
      await user.click(tab("Documents"));
      expect(onValueChange).toHaveBeenCalledWith("docs");
    });

    it("refuses a disabled tab", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs id="deal" value="terms" onValueChange={onValueChange}>
          <Tab value="terms" label="Terms" />
          <Tab value="audit" label="Audit" disabled />
        </Tabs>,
      );
      await user.click(tab("Audit"));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("keyboard", () => {
    it("keeps one stop in the tab order, not one per tab", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.tab();
      expect(tab("Terms")).toHaveFocus();
      expect(tab("Line items 4")).toHaveAttribute("tabindex", "-1");
    });

    it("moves right", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Terms"));
      await user.keyboard("{ArrowRight}");
      expect(tab("Line items 4")).toHaveAttribute("aria-selected", "true");
    });

    it("skips a disabled tab", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Line items 4"));
      await user.keyboard("{ArrowRight}");
      expect(tab("Documents")).toHaveAttribute("aria-selected", "true");
    });

    it("wraps at the end", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Documents"));
      await user.keyboard("{ArrowRight}");
      expect(tab("Terms")).toHaveAttribute("aria-selected", "true");
    });

    it("moves left", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Line items 4"));
      await user.keyboard("{ArrowLeft}");
      expect(tab("Terms")).toHaveAttribute("aria-selected", "true");
    });

    it("carries focus with the selection, rather than stranding it", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Terms"));
      await user.keyboard("{ArrowRight}");
      expect(tab("Line items 4")).toHaveFocus();
      expect(tab("Terms")).toHaveAttribute("tabindex", "-1");
    });

    it("jumps with Home and End", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Terms"));
      await user.keyboard("{End}");
      expect(tab("Documents")).toHaveAttribute("aria-selected", "true");
      await user.keyboard("{Home}");
      expect(tab("Terms")).toHaveAttribute("aria-selected", "true");
    });

    it("ignores the horizontal arrows when vertical", async () => {
      const user = userEvent.setup();
      render(<Harness orientation="vertical" />);
      await user.click(tab("Terms"));
      await user.keyboard("{ArrowRight}");
      expect(tab("Terms")).toHaveAttribute("aria-selected", "true");
      await user.keyboard("{ArrowDown}");
      expect(tab("Line items 4")).toHaveAttribute("aria-selected", "true");
    });

    it("says which way it runs", () => {
      render(<Harness orientation="vertical" />);
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      );
    });
  });

  describe("wiring to its panels", () => {
    it("points the selected tab at its panel", () => {
      render(<Harness />);
      expect(tab("Terms")).toHaveAttribute("aria-controls", "deal-panel-terms");
      expect(screen.getByRole("tabpanel").id).toBe("deal-panel-terms");
    });

    it("says nothing about panels that may not exist", () => {
      render(<Harness />);
      expect(tab("Documents")).not.toHaveAttribute("aria-controls");
    });

    it("names the panel from its tab", () => {
      render(<Harness />);
      expect(
        screen.getByRole("tabpanel", { name: "Terms" }),
      ).toBeInTheDocument();
    });

    it("follows the selection", async () => {
      const user = userEvent.setup();
      render(<Harness />);
      await user.click(tab("Documents"));
      expect(screen.getByText("Panel for docs")).toBeInTheDocument();
    });
  });
});

describe("TabPanel", () => {
  it("is focusable, so arriving from the strip lands in the content", () => {
    render(
      <TabPanel id="deal" value="terms">
        <span>{"Terms"}</span>
      </TabPanel>,
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
  });

  it("can be placed anywhere, and still names itself from its tab", () => {
    render(
      <>
        <div>
          <Tabs id="deal" value="terms" onValueChange={vi.fn()}>
            <Tab value="terms" label="Terms" />
          </Tabs>
        </div>
        <main>
          <TabPanel id="deal" value="terms">
            <span>{"Terms"}</span>
          </TabPanel>
        </main>
      </>,
    );
    expect(screen.getByRole("tabpanel", { name: "Terms" })).toBeInTheDocument();
  });
});

describe("Tab", () => {
  it("renders nothing on its own", () => {
    const { container } = render(<Tab value="terms" label="Terms" />);
    expect(container).toBeEmptyDOMElement();
  });
});
