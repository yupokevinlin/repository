import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Sidebar } from "./Sidebar";
import { SidebarGroup } from "./SidebarGroup/SidebarGroup";
import { SidebarItem } from "./SidebarItem/SidebarItem";

const icon = <svg data-testid="icon" />;

const Basic = ({
  collapsed,
  density,
}: {
  collapsed?: boolean;
  density?: "comfortable" | "compact";
}) => (
  <Sidebar aria-label="Main" collapsed={collapsed} density={density}>
    <SidebarGroup label="Trading">
      <SidebarItem icon={icon} current>
        <a href="/app/deals">{"Deals"}</a>
      </SidebarItem>
      <SidebarItem icon={icon} trailing={<button>{"Pin"}</button>}>
        <a href="/app/approvals">{"Approvals"}</a>
      </SidebarItem>
    </SidebarGroup>
    <SidebarItem icon={icon}>
      <a href="/app/settings">{"Settings"}</a>
    </SidebarItem>
  </Sidebar>
);

const row = (name: string): HTMLElement =>
  screen.getByRole("link", { name }).closest("li") as HTMLElement;

describe("Sidebar", () => {
  it("is a named landmark, so it can be jumped to and told apart", () => {
    render(<Basic />);
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });

  it("renders the consumer's own links, not ones of its own", () => {
    render(<Basic />);
    expect(screen.getByRole("link", { name: "Deals" })).toHaveAttribute(
      "href",
      "/app/deals",
    );
  });

  it("marks the current page", () => {
    render(<Basic />);
    expect(row("Deals")).toHaveAttribute("aria-current", "page");
    expect(row("Settings")).not.toHaveAttribute("aria-current");
  });

  it("stretches the anchor over the row, so the whole row is the target", () => {
    render(<Basic />);
    expect(row("Deals").className).toContain("relative");
    expect(row("Deals").className).toContain("after:inset-0");
  });

  it("lifts a trailing control above the stretched anchor", () => {
    render(<Basic />);
    const trailing = screen
      .getByRole("button", { name: "Pin" })
      .closest("[data-slot='sidebar-item-trailing']");
    expect(trailing?.className).toContain("z-[1]");
  });

  it("reaches a trailing control by keyboard", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Pin" })).toHaveFocus();
  });

  describe("grouping", () => {
    it("names each group", () => {
      render(<Basic />);
      expect(
        screen.getByRole("group", { name: "Trading" }),
      ).toBeInTheDocument();
    });

    it("gathers loose items into one list, not a list each", () => {
      render(
        <Sidebar aria-label="Main">
          <SidebarItem>
            <a href="/a">{"A"}</a>
          </SidebarItem>
          <SidebarItem>
            <a href="/b">{"B"}</a>
          </SidebarItem>
        </Sidebar>,
      );
      expect(screen.getAllByRole("list")).toHaveLength(1);
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("keeps the caller's order across groups and loose items", () => {
      render(<Basic />);
      const links = screen
        .getAllByRole("link")
        .map((link: HTMLElement) => link.textContent);
      expect(links).toEqual(["Deals", "Approvals", "Settings"]);
    });

    it("ignores children that are neither", () => {
      render(
        <Sidebar aria-label="Main">
          <SidebarItem>
            <a href="/a">{"A"}</a>
          </SidebarItem>
          <span>{"Stray"}</span>
        </Sidebar>,
      );
      expect(screen.queryByText("Stray")).not.toBeInTheDocument();
    });
  });

  describe("collapsed", () => {
    it("narrows to a rail", () => {
      render(<Basic collapsed />);
      expect(screen.getByRole("navigation").className).toContain("w-[3.5rem]");
    });

    it("keeps the links reachable and named, rather than a column of icons", () => {
      render(<Basic collapsed />);
      expect(screen.getByRole("link", { name: "Deals" })).toBeInTheDocument();
    });

    it("clips the label instead of hiding it from the accessibility tree", () => {
      render(<Basic collapsed />);
      const label = screen
        .getByRole("link", { name: "Deals" })
        .closest("[data-slot='sidebar-item-label']");
      expect(label?.className).toContain("overflow-hidden");
      // Not sr-only, which positions the element: the consumer's stretched
      // anchor would then size itself against a 1px box rather than the row.
      expect(label?.className).not.toContain("absolute");
    });

    it("still names its groups for a screen reader", () => {
      render(<Basic collapsed />);
      expect(
        screen.getByRole("group", { name: "Trading" }),
      ).toBeInTheDocument();
    });

    it("says which state it is in", () => {
      render(<Basic collapsed />);
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "data-state",
        "collapsed",
      );
    });

    it("is expanded by default", () => {
      render(<Basic />);
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "data-state",
        "expanded",
      );
    });
  });

  describe("density", () => {
    it("is comfortable by default", () => {
      render(<Basic />);
      expect(row("Deals").className).toContain("h-10");
    });

    it("tightens the rows when compact", () => {
      render(<Basic density="compact" />);
      expect(row("Deals").className).toContain("h-8");
    });
  });

  it("renders a header and footer when given them", () => {
    render(
      <Sidebar
        aria-label="Main"
        header={<span>{"North Pacific"}</span>}
        footer={<span>{"v2.1"}</span>}
      >
        <SidebarItem>
          <a href="/a">{"A"}</a>
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByText("North Pacific")).toBeInTheDocument();
    expect(screen.getByText("v2.1")).toBeInTheDocument();
  });

  it("puts no aria-disabled on a row, which a listitem does not support", () => {
    render(<Basic />);
    expect(row("Deals")).not.toHaveAttribute("aria-disabled");
  });
});

describe("SidebarItem", () => {
  it("renders nothing on its own", () => {
    const { container } = render(
      <SidebarItem>
        <a href="/a">{"A"}</a>
      </SidebarItem>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("SidebarGroup", () => {
  it("renders nothing on its own", () => {
    const { container } = render(
      <SidebarGroup label="Trading">
        <SidebarItem>
          <a href="/a">{"A"}</a>
        </SidebarItem>
      </SidebarGroup>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
