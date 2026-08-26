import type { MouseEvent, ReactNode } from "react";

import {
  ellipsis,
  type PaginationEntry,
  paginationRange,
} from "./paginationRange";
import { PaginationStyles } from "./paginationStyles";

export interface PaginationProps {
  /** The page the user is on, 1-based. Controlled only. */
  page: number;
  /** How many pages there are. */
  pageCount: number;
  /**
   * Where each page lives. A pure function, not a router — this package never
   * imports one (§11.1), and a real `href` is what makes middle-click,
   * ctrl-click and "copy link address" work.
   */
  getHref: (page: number) => string;
  /**
   * Runs on a plain left click, which is also prevented so the app can route
   * without a reload. Modified clicks are left alone and follow the `href`.
   *
   * Leave it off where pagination really is a page load.
   */
  onPageChange?: (page: number) => void;
  /** Pages either side of the current one. Defaults to 1. */
  siblingCount?: number;
  /** Names the landmark. Defaults to `"Pagination"`. */
  "aria-label"?: string;
  /** Defaults to `"Previous page"`. */
  previousLabel?: string;
  /** Defaults to `"Next page"`. */
  nextLabel?: string;
  /**
   * Names a page link. Defaults to `"Page {n}"` — a link whose whole name is
   * "7" tells a screen-reader user nothing about what it is.
   */
  pageLabel?: (page: number) => string;
  className?: string;
}

const arrow = (direction: "left" | "right"): ReactNode => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-4"
  >
    <path d={direction === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} />
  </svg>
);

/**
 * Page controls for a list that does not fit on one screen.
 *
 * **Links, not buttons.** A page is a place, so middle-click opens it in a new
 * tab, ctrl-click works, the browser can prefetch it and the address can be
 * copied — none of which a `<button>` gives you. `onPageChange` still fires on
 * a plain left click for apps that route client-side, and modified clicks are
 * left alone so the browser can do its job.
 *
 * Controlled only: the page lives in the URL or the query layer, never in this
 * component.
 *
 * The step arrows disappear rather than dimming at the ends. A disabled link
 * is not something HTML models, and a link to nowhere is worse than one that
 * is not there.
 *
 * @client
 *
 * @example Client-side routing
 * ```tsx
 * <Pagination
 *   page={page}
 *   pageCount={pageCount}
 *   getHref={(next) => `/app/deals?page=${next}`}
 *   onPageChange={setPage}
 * />
 * ```
 *
 * @example Real page loads — no handler at all
 * ```tsx
 * <Pagination page={page} pageCount={12} getHref={(next) => `?page=${next}`} />
 * ```
 *
 * @example A wider window
 * ```tsx
 * <Pagination page={page} pageCount={200} siblingCount={2} getHref={href} />
 * ```
 */
export const Pagination = ({
  page,
  pageCount,
  getHref,
  onPageChange,
  siblingCount,
  "aria-label": ariaLabel,
  previousLabel,
  nextLabel,
  pageLabel,
  className,
}: PaginationProps) => {
  const entries: Array<PaginationEntry> = paginationRange({
    page,
    pageCount,
    siblingCount,
  });

  if (entries.length === 0) {
    return null;
  }

  const nameFor = (target: number): string =>
    pageLabel?.(target) ?? `Page ${String(target)}`;

  const onClick = (
    event: MouseEvent<HTMLAnchorElement>,
    target: number,
  ): void => {
    if (onPageChange === undefined) {
      return;
    }
    // Anything with a modifier is the browser's to handle: a new tab, a new
    // window, a download. Taking those over is how a link stops being a link.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onPageChange(target);
  };

  const step = (
    target: number,
    label: string,
    icon: ReactNode,
    slot: string,
  ): ReactNode => {
    const available: boolean = target >= 1 && target <= pageCount;

    return (
      <li data-slot={`pagination-${slot}`}>
        {available ? (
          <a
            href={getHref(target)}
            aria-label={label}
            className={PaginationStyles.pageStyle()}
            onClick={(event) => {
              onClick(event, target);
            }}
          >
            {icon}
          </a>
        ) : (
          <span
            data-slot={`pagination-${slot}-end`}
            aria-hidden="true"
            className={PaginationStyles.stepEndStyle()}
          >
            {icon}
          </span>
        )}
      </li>
    );
  };

  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel ?? "Pagination"}
      className={className}
    >
      <ul data-slot="pagination-list" className={PaginationStyles.listStyle()}>
        {step(
          page - 1,
          previousLabel ?? "Previous page",
          arrow("left"),
          "previous",
        )}

        {entries.map((entry: PaginationEntry, index: number) => {
          if (entry === ellipsis) {
            return (
              <li
                key={`ellipsis-${String(index)}`}
                data-slot="pagination-ellipsis"
                aria-hidden="true"
                className={PaginationStyles.ellipsisStyle()}
              >
                {"…"}
              </li>
            );
          }

          const current: boolean = entry === page;

          return (
            <li key={entry} data-slot="pagination-item">
              <a
                href={getHref(entry)}
                aria-label={nameFor(entry)}
                aria-current={current ? "page" : undefined}
                className={PaginationStyles.pageStyle({ current })}
                onClick={(event) => {
                  onClick(event, entry);
                }}
              >
                {entry}
              </a>
            </li>
          );
        })}

        {step(page + 1, nextLabel ?? "Next page", arrow("right"), "next")}
      </ul>
    </nav>
  );
};
