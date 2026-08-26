/** A gap where pages were left out. */
export const ellipsis = "ellipsis" as const;

export type PaginationEntry = number | typeof ellipsis;

export interface PaginationRangeArgs {
  /** The page the user is on, 1-based. */
  page: number;
  /** How many pages there are. */
  pageCount: number;
  /** How many pages to show either side of the current one. Defaults to 1. */
  siblingCount?: number;
}

/**
 * Which page numbers to show, and where the gaps fall.
 *
 * The first and last pages are always present — they are the two the user can
 * aim for without counting — and the window around the current page is
 * `siblingCount` either side. Where the window does not reach an end, an
 * ellipsis stands in for what was left out.
 *
 * The width of the result is **stable** while the ends are far away:
 * first + ellipsis + (2 × siblings + 1) + ellipsis + last. A control that
 * changed width as the user paged through it would move the very buttons they
 * are clicking.
 *
 * Pure, and separate from the component, because this is the part with all the
 * edge cases in it: one page, two pages, a window that overlaps an end, a
 * gap of exactly one page where an ellipsis would be wider than the number it
 * replaced.
 *
 * @server-safe
 *
 * @example
 * ```ts
 * paginationRange({ page: 6, pageCount: 20 });
 * // [1, "ellipsis", 5, 6, 7, "ellipsis", 20]
 *
 * paginationRange({ page: 2, pageCount: 20 });
 * // [1, 2, 3, 4, "ellipsis", 20]
 * ```
 */
export const paginationRange = ({
  page,
  pageCount,
  siblingCount,
}: PaginationRangeArgs): Array<PaginationEntry> => {
  if (pageCount <= 0) {
    return [];
  }

  const siblings: number = Math.max(0, siblingCount ?? 1);
  const current: number = Math.min(Math.max(page, 1), pageCount);

  // first + last + current + its siblings + the two ellipses. Below this there
  // is nothing to leave out, so every page is shown.
  const slots: number = siblings * 2 + 5;
  if (pageCount <= slots) {
    return Array.from({ length: pageCount }, (_, index: number) => index + 1);
  }

  // How far the window can sit from an end before a gap is worth drawing. A
  // gap that hid a single page would take more room than the page it replaced,
  // so in that case the window is widened to swallow it instead.
  const nearStart: boolean = current - siblings <= 3;
  const nearEnd: boolean = current + siblings >= pageCount - 2;

  const window: number = siblings * 2 + 1;

  const start: number = nearStart
    ? 2
    : nearEnd
      ? pageCount - (window + 1)
      : current - siblings;
  const end: number = nearEnd
    ? pageCount - 1
    : nearStart
      ? window + 2
      : current + siblings;

  const entries: Array<PaginationEntry> = [1];

  if (start > 2) {
    entries.push(ellipsis);
  }
  for (let index = start; index <= end; index += 1) {
    entries.push(index);
  }
  if (end < pageCount - 1) {
    entries.push(ellipsis);
  }
  entries.push(pageCount);

  return entries;
};
