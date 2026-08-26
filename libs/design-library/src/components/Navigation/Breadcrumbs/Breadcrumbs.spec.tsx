import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb/Breadcrumb";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * An array rather than a fragment: `Children.toArray` flattens arrays but
 * treats a fragment as a single child, which is the same shape a real caller
 * gets from mapping over a route.
 */
const trail = [
  <Breadcrumb key="home">
    <a href="/app">{"Home"}</a>
  </Breadcrumb>,
  <Breadcrumb key="deals">
    <a href="/app/deals">{"Deals"}</a>
  </Breadcrumb>,
  <Breadcrumb key="deal">
    <a href="/app/deals/NPM-2601">{"NPM-2601"}</a>
  </Breadcrumb>,
  <Breadcrumb key="shipments">
    <a href="/app/deals/NPM-2601/shipments">{"Shipments"}</a>
  </Breadcrumb>,
  <Breadcrumb key="bol">{"Bill of lading"}</Breadcrumb>,
];

const collapseTrigger = (): HTMLElement =>
  screen.getByRole("button", { name: "Show the rest of the trail" });

describe("Breadcrumbs", () => {
  it("is a named landmark around an ordered list", () => {
    render(<Breadcrumbs>{trail}</Breadcrumbs>);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelector("ol")).not.toBeNull();
  });

  it("takes a caller-supplied landmark name", () => {
    render(<Breadcrumbs aria-label="You are here">{trail}</Breadcrumbs>);
    expect(
      screen.getByRole("navigation", { name: "You are here" }),
    ).toBeInTheDocument();
  });

  it("renders the consumer's own links", () => {
    render(<Breadcrumbs>{trail}</Breadcrumbs>);
    expect(screen.getByRole("link", { name: "Deals" })).toHaveAttribute(
      "href",
      "/app/deals",
    );
  });

  it("ignores children that are not Breadcrumbs", () => {
    render(
      <Breadcrumbs>
        <Breadcrumb>
          <a href="/app">{"Home"}</a>
        </Breadcrumb>
        <span>{"Stray"}</span>
      </Breadcrumbs>,
    );
    expect(screen.queryByText("Stray")).not.toBeInTheDocument();
  });

  describe("the current page", () => {
    it("marks the last crumb", () => {
      render(<Breadcrumbs>{trail}</Breadcrumbs>);
      expect(screen.getByText("Bill of lading")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("marks only the last one", () => {
      const { container } = render(<Breadcrumbs>{trail}</Breadcrumbs>);
      expect(container.querySelectorAll("[aria-current]")).toHaveLength(1);
    });

    it("can be forced earlier, where the trail ends elsewhere", () => {
      render(
        <Breadcrumbs>
          <Breadcrumb current>{"Deals"}</Breadcrumb>
          <Breadcrumb>
            <a href="/app/deals/NPM-2601">{"NPM-2601"}</a>
          </Breadcrumb>
        </Breadcrumbs>,
      );
      expect(screen.getByText("Deals")).toHaveAttribute("aria-current", "page");
    });
  });

  describe("separators", () => {
    it("puts one between crumbs and none after the last", () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumb>
            <a href="/app">{"Home"}</a>
          </Breadcrumb>
          <Breadcrumb>{"Deals"}</Breadcrumb>
        </Breadcrumbs>,
      );
      expect(
        container.querySelectorAll("[data-slot='breadcrumbs-separator']"),
      ).toHaveLength(1);
    });

    it("hides them from screen readers, since they carry no meaning", () => {
      const { container } = render(<Breadcrumbs>{trail}</Breadcrumbs>);
      const separator = container.querySelector(
        "[data-slot='breadcrumbs-separator']",
      );
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });

    it("takes a caller-supplied one", () => {
      render(<Breadcrumbs separator="›">{trail}</Breadcrumbs>);
      expect(screen.getAllByText("›").length).toBeGreaterThan(0);
    });
  });

  describe("collapsing", () => {
    it("shows everything when there is room", () => {
      render(<Breadcrumbs>{trail}</Breadcrumbs>);
      expect(screen.getAllByRole("listitem")).toHaveLength(5);
      expect(
        screen.queryByRole("button", { name: "Show the rest of the trail" }),
      ).not.toBeInTheDocument();
    });

    it("keeps the first and the last, and folds the middle", () => {
      render(<Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>);
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByText("Bill of lading")).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Deals" }),
      ).not.toBeInTheDocument();
    });

    it("is a disclosure, not a menu — what it opens is links", async () => {
      const user = userEvent.setup();
      render(<Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>);
      expect(collapseTrigger()).toHaveAttribute("aria-expanded", "false");
      await user.click(collapseTrigger());
      expect(collapseTrigger()).toHaveAttribute("aria-expanded", "true");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Deals" })).toBeInTheDocument();
    });

    it("points the trigger at the list it opens", async () => {
      const user = userEvent.setup();
      render(<Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>);
      await user.click(collapseTrigger());
      const listId: string | null =
        collapseTrigger().getAttribute("aria-controls");
      expect(document.getElementById(listId ?? "")).not.toBeNull();
    });

    it("renders the folded crumbs into a portal", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div style={{ overflow: "hidden" }}>
          <Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>
        </div>,
      );
      await user.click(collapseTrigger());
      expect(
        container.contains(screen.getByRole("link", { name: "Deals" })),
      ).toBe(false);
    });

    it("closes on Escape and gives focus back", async () => {
      const user = userEvent.setup();
      render(<Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>);
      await user.click(collapseTrigger());
      await user.keyboard("{Escape}");
      expect(collapseTrigger()).toHaveAttribute("aria-expanded", "false");
      expect(collapseTrigger()).toHaveFocus();
    });

    it("closes on a click outside", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>
          <button>{"Elsewhere"}</button>
        </>,
      );
      await user.click(collapseTrigger());
      await user.click(screen.getByRole("button", { name: "Elsewhere" }));
      expect(collapseTrigger()).toHaveAttribute("aria-expanded", "false");
    });

    it("closes when a folded link is followed", async () => {
      const user = userEvent.setup();
      render(<Breadcrumbs maxItems={3}>{trail}</Breadcrumbs>);
      await user.click(collapseTrigger());
      await user.click(screen.getByRole("link", { name: "Deals" }));
      expect(collapseTrigger()).toHaveAttribute("aria-expanded", "false");
    });

    it("takes a caller-supplied name for the trigger", () => {
      render(
        <Breadcrumbs maxItems={3} collapseLabel="More">
          {trail}
        </Breadcrumbs>,
      );
      expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
    });

    it("does not collapse below two shown crumbs", () => {
      render(<Breadcrumbs maxItems={1}>{trail}</Breadcrumbs>);
      expect(
        screen.queryByRole("button", { name: "Show the rest of the trail" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("density", () => {
    it("is comfortable by default", () => {
      const { container } = render(<Breadcrumbs>{trail}</Breadcrumbs>);
      const list = container.querySelector("[data-slot='breadcrumbs-list']");
      expect(list?.className).toContain("gap-2");
    });

    it("tightens when compact", () => {
      const { container } = render(
        <Breadcrumbs density="compact">{trail}</Breadcrumbs>,
      );
      const list = container.querySelector("[data-slot='breadcrumbs-list']");
      expect(list?.className).toContain("gap-1");
    });
  });
});

describe("Breadcrumb", () => {
  it("renders nothing on its own", () => {
    const { container } = render(<Breadcrumb>{"Deals"}</Breadcrumb>);
    expect(container).toBeEmptyDOMElement();
  });
});
