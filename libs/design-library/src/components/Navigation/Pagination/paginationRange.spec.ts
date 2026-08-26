import { describe, expect, it } from "vitest";

import { paginationRange } from "./paginationRange";

describe("paginationRange", () => {
  it("returns nothing when there are no pages", () => {
    expect(paginationRange({ page: 1, pageCount: 0 })).toEqual([]);
  });

  it("shows a single page", () => {
    expect(paginationRange({ page: 1, pageCount: 1 })).toEqual([1]);
  });

  it("shows every page while they all fit", () => {
    expect(paginationRange({ page: 3, pageCount: 7 })).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("leaves out the far end when the user is at the start", () => {
    expect(paginationRange({ page: 2, pageCount: 20 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      20,
    ]);
  });

  it("leaves out the near end when the user is at the finish", () => {
    expect(paginationRange({ page: 19, pageCount: 20 })).toEqual([
      1,
      "ellipsis",
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it("leaves out both ends in the middle", () => {
    expect(paginationRange({ page: 10, pageCount: 20 })).toEqual([
      1,
      "ellipsis",
      9,
      10,
      11,
      "ellipsis",
      20,
    ]);
  });

  it("keeps its width while the ends are far away", () => {
    const widths: Array<number> = [8, 9, 10, 11, 12].map(
      (page: number) => paginationRange({ page, pageCount: 20 }).length,
    );
    expect(new Set(widths).size).toBe(1);
  });

  it("keeps its width at the ends too, so the buttons do not move", () => {
    const widths: Array<number> = [1, 2, 10, 19, 20].map(
      (page: number) => paginationRange({ page, pageCount: 20 }).length,
    );
    expect(new Set(widths).size).toBe(1);
  });

  it("never puts an ellipsis where a single page would have been", () => {
    // Page 4 of 20: the window is 3-5, so page 2 is the only one missing
    // before it and an ellipsis would take more room than the number.
    const entries = paginationRange({ page: 4, pageCount: 20 });
    expect(entries[0]).toBe(1);
    expect(entries[1]).not.toBe("ellipsis");
  });

  it("widens the window with siblingCount", () => {
    expect(
      paginationRange({ page: 10, pageCount: 20, siblingCount: 2 }),
    ).toEqual([1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]);
  });

  it("takes no siblings at all", () => {
    expect(
      paginationRange({ page: 10, pageCount: 20, siblingCount: 0 }),
    ).toEqual([1, "ellipsis", 10, "ellipsis", 20]);
  });

  it("treats a negative siblingCount as none", () => {
    expect(
      paginationRange({ page: 10, pageCount: 20, siblingCount: -3 }),
    ).toEqual([1, "ellipsis", 10, "ellipsis", 20]);
  });

  it("clamps a page past the end", () => {
    expect(paginationRange({ page: 99, pageCount: 20 })).toEqual(
      paginationRange({ page: 20, pageCount: 20 }),
    );
  });

  it("clamps a page before the start", () => {
    expect(paginationRange({ page: 0, pageCount: 20 })).toEqual(
      paginationRange({ page: 1, pageCount: 20 }),
    );
  });

  it("always keeps the first and the last", () => {
    for (const page of [1, 5, 10, 15, 20]) {
      const entries = paginationRange({ page, pageCount: 20 });
      expect(entries[0]).toBe(1);
      expect(entries[entries.length - 1]).toBe(20);
    }
  });

  it("never repeats a page", () => {
    for (const page of [1, 2, 3, 10, 18, 19, 20]) {
      const numbers = paginationRange({ page, pageCount: 20 }).filter(
        (entry): entry is number => typeof entry === "number",
      );
      expect(new Set(numbers).size).toBe(numbers.length);
    }
  });

  it("keeps the pages in ascending order", () => {
    for (const page of [1, 4, 10, 17, 20]) {
      const numbers = paginationRange({ page, pageCount: 20 }).filter(
        (entry): entry is number => typeof entry === "number",
      );
      expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
    }
  });

  it("always includes the page the user is on", () => {
    for (let page = 1; page <= 20; page += 1) {
      expect(paginationRange({ page, pageCount: 20 })).toContain(page);
    }
  });
});
