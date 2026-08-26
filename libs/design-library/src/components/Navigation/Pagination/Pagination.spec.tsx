import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

/**
 * A hash href, not a path: the tests that deliberately let a click through
 * really do navigate, and jsdom implements hash changes but not page loads —
 * a path would fill the output with "Not implemented: navigation" for
 * behaviour that is working exactly as intended.
 */
const href = (page: number): string => `#page=${String(page)}`;

const pageLink = (n: number): HTMLElement =>
  screen.getByRole("link", { name: `Page ${String(n)}` });

describe("Pagination", () => {
  it("is a named landmark around a list", () => {
    render(<Pagination page={1} pageCount={5} getHref={href} />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav.querySelector("ul")).not.toBeNull();
  });

  it("renders nothing when there are no pages", () => {
    const { container } = render(
      <Pagination page={1} pageCount={0} getHref={href} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  describe("links, not buttons", () => {
    it("renders real anchors with real hrefs", () => {
      render(<Pagination page={1} pageCount={5} getHref={href} />);
      expect(pageLink(3)).toHaveAttribute("href", "#page=3");
    });

    it("uses no buttons at all, so middle-click works", () => {
      render(<Pagination page={2} pageCount={5} getHref={href} />);
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });

    it("names each page, since a link called '7' says nothing", () => {
      render(<Pagination page={1} pageCount={5} getHref={href} />);
      expect(pageLink(3)).toBeInTheDocument();
    });

    it("takes a caller-supplied name", () => {
      render(
        <Pagination
          page={1}
          pageCount={5}
          getHref={href}
          pageLabel={(n: number) => `Go to page ${String(n)} of 5`}
        />,
      );
      expect(
        screen.getByRole("link", { name: "Go to page 3 of 5" }),
      ).toBeInTheDocument();
    });
  });

  describe("the current page", () => {
    it("marks it", () => {
      render(<Pagination page={3} pageCount={5} getHref={href} />);
      expect(pageLink(3)).toHaveAttribute("aria-current", "page");
    });

    it("marks only it", () => {
      const { container } = render(
        <Pagination page={3} pageCount={5} getHref={href} />,
      );
      expect(container.querySelectorAll("[aria-current]")).toHaveLength(1);
    });
  });

  describe("clicking", () => {
    it("reports the page on a plain left click", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination
          page={1}
          pageCount={5}
          getHref={href}
          onPageChange={onPageChange}
        />,
      );
      await user.click(pageLink(3));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("leaves a ctrl-click to the browser, so a new tab still opens", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination
          page={1}
          pageCount={5}
          getHref={href}
          onPageChange={onPageChange}
        />,
      );
      await user.keyboard("{Control>}");
      await user.click(pageLink(3));
      await user.keyboard("{/Control}");
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("leaves a meta-click alone too", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination
          page={1}
          pageCount={5}
          getHref={href}
          onPageChange={onPageChange}
        />,
      );
      await user.keyboard("{Meta>}");
      await user.click(pageLink(3));
      await user.keyboard("{/Meta}");
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("does nothing of its own when no handler is given", async () => {
      const user = userEvent.setup();
      render(<Pagination page={1} pageCount={5} getHref={href} />);
      // Nothing to assert but that it does not throw: the browser follows the
      // href, which is the whole point of the no-handler case.
      await user.click(pageLink(3));
      expect(pageLink(3)).toBeInTheDocument();
    });
  });

  describe("the step arrows", () => {
    it("points them at the neighbouring pages", () => {
      render(<Pagination page={3} pageCount={5} getHref={href} />);
      expect(
        screen.getByRole("link", { name: "Previous page" }),
      ).toHaveAttribute("href", "#page=2");
      expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute(
        "href",
        "#page=4",
      );
    });

    it("drops previous on the first page rather than linking nowhere", () => {
      render(<Pagination page={1} pageCount={5} getHref={href} />);
      expect(
        screen.queryByRole("link", { name: "Previous page" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Next page" }),
      ).toBeInTheDocument();
    });

    it("drops next on the last page", () => {
      render(<Pagination page={5} pageCount={5} getHref={href} />);
      expect(
        screen.queryByRole("link", { name: "Next page" }),
      ).not.toBeInTheDocument();
    });

    it("keeps its place when there is nowhere to go", () => {
      const { container } = render(
        <Pagination page={1} pageCount={5} getHref={href} />,
      );
      expect(
        container.querySelector("[data-slot='pagination-previous-end']"),
      ).toBeInTheDocument();
    });

    it("takes caller-supplied names", () => {
      render(
        <Pagination
          page={3}
          pageCount={5}
          getHref={href}
          previousLabel="Older"
          nextLabel="Newer"
        />,
      );
      expect(screen.getByRole("link", { name: "Older" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Newer" })).toBeInTheDocument();
    });
  });

  describe("the window", () => {
    it("shows every page while they fit", () => {
      render(<Pagination page={1} pageCount={5} getHref={href} />);
      expect(screen.getAllByRole("link", { name: /^Page/ })).toHaveLength(5);
    });

    it("folds the middle of a long list", () => {
      const { container } = render(
        <Pagination page={10} pageCount={20} getHref={href} />,
      );
      expect(
        container.querySelectorAll("[data-slot='pagination-ellipsis']"),
      ).toHaveLength(2);
      expect(pageLink(1)).toBeInTheDocument();
      expect(pageLink(20)).toBeInTheDocument();
    });

    it("hides the gaps from screen readers, since they are not pages", () => {
      const { container } = render(
        <Pagination page={10} pageCount={20} getHref={href} />,
      );
      const gap = container.querySelector("[data-slot='pagination-ellipsis']");
      expect(gap).toHaveAttribute("aria-hidden", "true");
    });

    it("widens with siblingCount", () => {
      render(
        <Pagination page={10} pageCount={20} siblingCount={2} getHref={href} />,
      );
      expect(pageLink(8)).toBeInTheDocument();
      expect(pageLink(12)).toBeInTheDocument();
    });
  });
});
