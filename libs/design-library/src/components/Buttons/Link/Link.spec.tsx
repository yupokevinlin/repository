import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Link, linkAppearances } from "./Link";

const slot = (container: HTMLElement, name = "link"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("Link", () => {
  it("renders an anchor, never a button", () => {
    const { container } = render(<Link href="/app/deals">All deals</Link>);
    expect(slot(container).tagName).toBe("A");
    expect(container.querySelector("button")).toBeNull();
  });

  it("keeps the anchor an anchor even when it looks like a button", () => {
    const { container } = render(
      <Link href="/app/deals/new" appearance="button">
        New deal
      </Link>,
    );
    expect(slot(container).tagName).toBe("A");
  });

  it("takes its accessible name from its children", () => {
    render(<Link href="/app/deals">All deals</Link>);
    expect(screen.getByRole("link", { name: "All deals" })).toBeInTheDocument();
  });

  it("navigates to href", () => {
    const { container } = render(<Link href="/app/deals">All deals</Link>);
    expect(slot(container)).toHaveAttribute("href", "/app/deals");
  });

  it("underlines inline links, so colour is not the only signal", () => {
    const { container } = render(<Link href="/app/deals">All deals</Link>);
    expect(slot(container).className).toContain("underline");
  });

  it("leaves standalone links unadorned until hover", () => {
    const { container } = render(
      <Link href="/app/deals" appearance="standalone">
        All deals
      </Link>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("no-underline");
    expect(className).toContain("hover:underline");
  });

  it("gives every appearance a distinct set of classes", () => {
    const classNames: Array<string> = linkAppearances.map((appearance) => {
      const { container, unmount } =
        appearance === "button"
          ? render(
              <Link href="/app/deals" appearance="button">
                All deals
              </Link>,
            )
          : render(
              <Link href="/app/deals" appearance={appearance}>
                All deals
              </Link>,
            );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(linkAppearances.length);
  });

  describe("appearance='button'", () => {
    it("borrows Button's classes rather than restating them", () => {
      const { container } = render(
        <Link href="/app/deals/new" appearance="button">
          New deal
        </Link>,
      );
      const className: string = slot(container).className;
      expect(className).toContain("bg-bg-primary");
      expect(className).toContain("h-10");
    });

    it("takes a variant", () => {
      const { container } = render(
        <Link
          href="/app/deals/new"
          appearance="button"
          variant="destructive-solid"
        >
          Void deal
        </Link>,
      );
      expect(slot(container).className).toContain("bg-bg-error");
    });

    it("takes a size", () => {
      const { container } = render(
        <Link href="/app/deals/new" appearance="button" size="12">
          New deal
        </Link>,
      );
      expect(slot(container).className).toContain("h-12");
    });
  });

  describe("external", () => {
    it("adds no target by default — most links stay in the app", () => {
      const { container } = render(<Link href="/app/deals">All deals</Link>);
      expect(slot(container)).not.toHaveAttribute("target");
    });

    it("opens in a new tab", () => {
      const { container } = render(
        <Link href="https://example.test" external>
          Rates
        </Link>,
      );
      expect(slot(container)).toHaveAttribute("target", "_blank");
    });

    it("severs the opener, so the new tab cannot reach back", () => {
      const { container } = render(
        <Link href="https://example.test" external>
          Rates
        </Link>,
      );
      expect(slot(container)).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("says in words that it leaves the page", () => {
      render(
        <Link href="https://example.test" external>
          Rates
        </Link>,
      );
      expect(screen.getByText("(opens in a new tab)")).toBeInTheDocument();
    });

    it("takes a caller-supplied label, for other languages", () => {
      render(
        <Link
          href="https://example.test"
          external
          externalLabel="(s'ouvre dans un nouvel onglet)"
        >
          Taux
        </Link>,
      );
      expect(
        screen.getByText("(s'ouvre dans un nouvel onglet)"),
      ).toBeInTheDocument();
    });

    it("hides the arrow from assistive technology — the label carries it", () => {
      const { container } = render(
        <Link href="https://example.test" external>
          Rates
        </Link>,
      );
      expect(slot(container, "link-external-icon")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("renders no arrow for an internal link", () => {
      const { container } = render(<Link href="/app/deals">All deals</Link>);
      expect(
        container.querySelector("[data-slot='link-external-icon']"),
      ).toBeNull();
    });
  });

  describe("disabled", () => {
    it("drops the href, which is what actually stops it navigating", () => {
      const { container } = render(
        <Link href="/app/deals" disabled>
          All deals
        </Link>,
      );
      expect(slot(container)).not.toHaveAttribute("href");
    });

    it("says so, since an anchor has no native disabled state", () => {
      const { container } = render(
        <Link href="/app/deals" disabled>
          All deals
        </Link>,
      );
      expect(slot(container)).toHaveAttribute("aria-disabled", "true");
    });

    it("sets neither attribute when enabled", () => {
      const { container } = render(<Link href="/app/deals">All deals</Link>);
      expect(slot(container)).not.toHaveAttribute("aria-disabled");
      expect(slot(container)).toHaveAttribute("href", "/app/deals");
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(
      <Link href="/app/deals" className="ml-2">
        All deals
      </Link>,
    );
    const className: string = slot(container).className;
    expect(className).toContain("ml-2");
    expect(className).toContain("underline");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="/app/deals" ref={ref}>
        All deals
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(
      <Link href="/app/deals" data-testid="deals">
        All deals
      </Link>,
    );
    expect(slot(container)).toHaveAttribute("data-testid", "deals");
  });
});
