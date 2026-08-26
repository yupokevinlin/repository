import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Resizable } from "./Resizable";
import { ResizablePanel } from "./ResizablePanel/ResizablePanel";

const splitter = (): HTMLElement => screen.getByRole("separator");

const Basic = ({
  orientation,
  collapsible,
  onSizesChange,
}: {
  orientation?: "horizontal" | "vertical";
  collapsible?: boolean;
  onSizesChange?: (sizes: Array<number>) => void;
}) => (
  <Resizable
    orientation={orientation}
    onSizesChange={onSizesChange}
    handleLabel="the deal list"
  >
    <ResizablePanel
      defaultSize={30}
      minSize={20}
      collapsible={collapsible}
      aria-label="Deals"
    >
      <span>{"List"}</span>
    </ResizablePanel>
    <ResizablePanel aria-label="Deal">
      <span>{"Detail"}</span>
    </ResizablePanel>
  </Resizable>
);

const sizeOf = (name: string): number =>
  Number(screen.getByRole("group", { name }).style.flexGrow || "0");

describe("Resizable", () => {
  it("renders its panels", () => {
    render(<Basic />);
    expect(screen.getByText("List")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("puts a splitter between each pair, and none at the end", () => {
    render(
      <Resizable>
        <ResizablePanel>
          <span>{"A"}</span>
        </ResizablePanel>
        <ResizablePanel>
          <span>{"B"}</span>
        </ResizablePanel>
        <ResizablePanel>
          <span>{"C"}</span>
        </ResizablePanel>
      </Resizable>,
    );
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });

  it("ignores children that are not panels", () => {
    render(
      <Resizable>
        <ResizablePanel>
          <span>{"A"}</span>
        </ResizablePanel>
        <span>{"Stray"}</span>
      </Resizable>,
    );
    expect(screen.queryByText("Stray")).not.toBeInTheDocument();
  });

  it("starts at the sizes the panels asked for", () => {
    render(<Basic />);
    expect(sizeOf("Deals")).toBe(30);
    expect(sizeOf("Deal")).toBe(70);
  });

  describe("the splitter", () => {
    it("is a window splitter, not a decorative line", () => {
      render(<Basic />);
      expect(splitter()).toHaveAttribute("aria-orientation", "vertical");
      expect(splitter()).toHaveAttribute("aria-valuenow", "30");
      expect(splitter()).toHaveAttribute("aria-valuemin", "20");
      expect(splitter()).toHaveAttribute("aria-valuemax", "100");
    });

    it("points at the pane it controls", () => {
      render(<Basic />);
      const controls: string | null = splitter().getAttribute("aria-controls");
      expect(document.getElementById(controls ?? "")).toHaveAccessibleName(
        "Deals",
      );
    });

    it("is reachable by keyboard, which a drag target otherwise is not", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.tab();
      expect(splitter()).toHaveFocus();
    });

    it("is named for what it resizes", () => {
      render(<Basic />);
      expect(
        screen.getByRole("separator", { name: "Resize the deal list" }),
      ).toBeInTheDocument();
    });

    it("says which way it runs when the panes are stacked", () => {
      render(<Basic orientation="vertical" />);
      expect(splitter()).toHaveAttribute("aria-orientation", "horizontal");
    });
  });

  describe("the keyboard", () => {
    it("grows the pane with the forward arrow", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      splitter().focus();
      await user.keyboard("{ArrowRight}");
      expect(sizeOf("Deals")).toBe(35);
      expect(sizeOf("Deal")).toBe(65);
    });

    it("shrinks it with the back arrow", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      splitter().focus();
      await user.keyboard("{ArrowLeft}");
      expect(sizeOf("Deals")).toBe(25);
    });

    it("uses the vertical arrows when the panes are stacked", async () => {
      const user = userEvent.setup();
      render(<Basic orientation="vertical" />);
      splitter().focus();
      await user.keyboard("{ArrowDown}");
      expect(sizeOf("Deals")).toBe(35);
    });

    it("takes it to its limits with Home and End", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      splitter().focus();
      await user.keyboard("{End}");
      expect(sizeOf("Deals")).toBe(100);
      await user.keyboard("{Home}");
      expect(sizeOf("Deals")).toBe(20);
    });

    it("stops at the minimum rather than running past it", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      splitter().focus();
      await user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}");
      expect(sizeOf("Deals")).toBe(20);
    });

    it("keeps aria-valuenow in step with what it did", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      splitter().focus();
      await user.keyboard("{ArrowRight}");
      expect(splitter()).toHaveAttribute("aria-valuenow", "35");
    });

    describe("Enter", () => {
      it("shuts a collapsible pane", async () => {
        const user = userEvent.setup();
        render(<Basic collapsible />);
        splitter().focus();
        await user.keyboard("{Enter}");
        expect(sizeOf("Deals")).toBe(0);
      });

      it("reopens it", async () => {
        const user = userEvent.setup();
        render(<Basic collapsible />);
        splitter().focus();
        await user.keyboard("{Enter}{Enter}");
        expect(sizeOf("Deals")).toBeGreaterThan(0);
      });

      it("does nothing to a pane that cannot collapse", async () => {
        const user = userEvent.setup();
        render(<Basic />);
        splitter().focus();
        await user.keyboard("{Enter}");
        expect(sizeOf("Deals")).toBe(30);
      });

      it("marks a shut pane, so the layout can style it", async () => {
        const user = userEvent.setup();
        render(<Basic collapsible />);
        splitter().focus();
        await user.keyboard("{Enter}");
        expect(screen.getByRole("group", { name: "Deals" })).toHaveAttribute(
          "data-collapsed",
          "true",
        );
      });
    });
  });

  describe("controlled", () => {
    it("shows the sizes it is given", () => {
      render(
        <Resizable sizes={[80, 20]} onSizesChange={vi.fn()}>
          <ResizablePanel aria-label="Deals">
            <span>{"List"}</span>
          </ResizablePanel>
          <ResizablePanel aria-label="Deal">
            <span>{"Detail"}</span>
          </ResizablePanel>
        </Resizable>,
      );
      expect(sizeOf("Deals")).toBe(80);
    });

    it("does not move on its own", async () => {
      const user = userEvent.setup();
      render(
        <Resizable sizes={[50, 50]} onSizesChange={vi.fn()}>
          <ResizablePanel aria-label="Deals">
            <span>{"List"}</span>
          </ResizablePanel>
          <ResizablePanel aria-label="Deal">
            <span>{"Detail"}</span>
          </ResizablePanel>
        </Resizable>,
      );
      splitter().focus();
      await user.keyboard("{ArrowRight}");
      expect(sizeOf("Deals")).toBe(50);
    });

    it("reports the sizes it would have used", async () => {
      const user = userEvent.setup();
      const onSizesChange = vi.fn();
      render(<Basic onSizesChange={onSizesChange} />);
      splitter().focus();
      await user.keyboard("{ArrowRight}");
      expect(onSizesChange).toHaveBeenCalledWith([35, 65]);
    });
  });
});

describe("ResizablePanel", () => {
  it("renders nothing on its own", () => {
    const { container } = render(
      <ResizablePanel>
        <span>{"A"}</span>
      </ResizablePanel>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
