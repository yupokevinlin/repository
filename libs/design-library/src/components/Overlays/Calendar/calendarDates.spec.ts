import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  atLocalMidnight,
  compareDays,
  dayLabel,
  daysInMonth,
  fromDateString,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithin,
  monthGrid,
  monthLabel,
  startOfMonth,
  toDateString,
  weekdayNames,
} from "./calendarDates";

/**
 * Narrows away null without an assertion: no-non-null-assertion forbids `!`
 * and non-nullable-type-assertion-style forbids the cast, so a guard that
 * fails the test loudly is the only thing both rules accept.
 */
const asDate = (value: Date | null | undefined): Date => {
  if (value === null || value === undefined) {
    throw new Error("expected a date");
  }
  return value;
};

describe("atLocalMidnight", () => {
  it("discards the time", () => {
    const stamped = new Date(2026, 7, 18, 14, 32, 5, 123);
    const date = atLocalMidnight(stamped);
    expect(date.getHours()).toBe(0);
    expect(date.getDate()).toBe(18);
  });
});

describe("isSameDay", () => {
  it("is true for two times on the same day", () => {
    expect(isSameDay(new Date(2026, 7, 18, 1), new Date(2026, 7, 18, 23))).toBe(
      true,
    );
  });

  it("is false across midnight", () => {
    expect(isSameDay(new Date(2026, 7, 18), new Date(2026, 7, 19))).toBe(false);
  });

  it("is false for the same day in a different month", () => {
    expect(isSameDay(new Date(2026, 7, 18), new Date(2026, 8, 18))).toBe(false);
  });

  it("is false for the same day in a different year", () => {
    expect(isSameDay(new Date(2026, 7, 18), new Date(2025, 7, 18))).toBe(false);
  });
});

describe("isSameMonth", () => {
  it("ignores the day", () => {
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2026, 7, 31))).toBe(true);
  });

  it("separates the same month in different years", () => {
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2025, 7, 1))).toBe(false);
  });
});

describe("compareDays", () => {
  it("orders by year first", () => {
    expect(
      compareDays(new Date(2025, 11, 31), new Date(2026, 0, 1)),
    ).toBeLessThan(0);
  });

  it("orders by month next", () => {
    expect(
      compareDays(new Date(2026, 8, 1), new Date(2026, 7, 31)),
    ).toBeGreaterThan(0);
  });

  it("returns zero for the same day at different times", () => {
    expect(
      compareDays(new Date(2026, 7, 18, 9), new Date(2026, 7, 18, 17)),
    ).toBe(0);
  });

  it("drives isBefore and isAfter", () => {
    expect(isBefore(new Date(2026, 7, 17), new Date(2026, 7, 18))).toBe(true);
    expect(isAfter(new Date(2026, 7, 19), new Date(2026, 7, 18))).toBe(true);
  });
});

describe("isWithin", () => {
  const from = new Date(2026, 7, 10);
  const to = new Date(2026, 7, 20);

  it("includes the start", () => {
    expect(isWithin(new Date(2026, 7, 10), from, to)).toBe(true);
  });

  it("includes the end", () => {
    expect(isWithin(new Date(2026, 7, 20), from, to)).toBe(true);
  });

  it("excludes the day before", () => {
    expect(isWithin(new Date(2026, 7, 9), from, to)).toBe(false);
  });
});

describe("addDays", () => {
  it("moves forward", () => {
    expect(toDateString(addDays(new Date(2026, 7, 18), 3))).toBe("2026-08-21");
  });

  it("moves backward", () => {
    expect(toDateString(addDays(new Date(2026, 7, 1), -1))).toBe("2026-07-31");
  });

  it("crosses a year boundary", () => {
    expect(toDateString(addDays(new Date(2026, 11, 31), 1))).toBe("2027-01-01");
  });

  it("stays at local midnight across a daylight-saving boundary", () => {
    // Adding 24h of milliseconds would land at 23:00 or 01:00 in a shifting
    // zone; constructing the next calendar day cannot.
    const result = addDays(new Date(2026, 2, 7), 1);
    expect(result.getHours()).toBe(0);
    expect(result.getDate()).toBe(8);
  });
});

describe("addMonths", () => {
  it("moves forward", () => {
    expect(toDateString(addMonths(new Date(2026, 7, 18), 1))).toBe(
      "2026-09-18",
    );
  });

  it("moves backward across a year", () => {
    expect(toDateString(addMonths(new Date(2026, 0, 15), -1))).toBe(
      "2025-12-15",
    );
  });

  it("clamps 31 January to the end of February rather than rolling over", () => {
    expect(toDateString(addMonths(new Date(2026, 0, 31), 1))).toBe(
      "2026-02-28",
    );
  });

  it("clamps to a leap February", () => {
    expect(toDateString(addMonths(new Date(2028, 0, 31), 1))).toBe(
      "2028-02-29",
    );
  });

  it("clamps 31 March back to 30 April", () => {
    expect(toDateString(addMonths(new Date(2026, 2, 31), 1))).toBe(
      "2026-04-30",
    );
  });
});

describe("daysInMonth", () => {
  it("knows a 31-day month", () => {
    expect(daysInMonth(2026, 7)).toBe(31);
  });

  it("knows a 30-day month", () => {
    expect(daysInMonth(2026, 8)).toBe(30);
  });

  it("knows a common February", () => {
    expect(daysInMonth(2026, 1)).toBe(28);
  });

  it("knows a leap February", () => {
    expect(daysInMonth(2028, 1)).toBe(29);
  });

  it("knows 1900 was not a leap year", () => {
    expect(daysInMonth(1900, 1)).toBe(28);
  });

  it("knows 2000 was", () => {
    expect(daysInMonth(2000, 1)).toBe(29);
  });
});

describe("startOfMonth", () => {
  it("returns the first", () => {
    expect(toDateString(startOfMonth(new Date(2026, 7, 18)))).toBe(
      "2026-08-01",
    );
  });
});

describe("toDateString", () => {
  it("uses local getters, not UTC", () => {
    expect(toDateString(new Date(2026, 7, 18))).toBe("2026-08-18");
  });

  it("pads single digits", () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("survives a date that toISOString would shift", () => {
    // Local midnight west of Greenwich is the previous day in UTC. The whole
    // reason §4.3 forbids toISOString.
    const date = new Date(2026, 7, 18, 0, 0, 0);
    expect(toDateString(date)).toBe("2026-08-18");
  });
});

describe("fromDateString", () => {
  it("parses to local midnight", () => {
    const date = fromDateString("2026-08-18");
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(7);
    expect(date?.getDate()).toBe(18);
    expect(date?.getHours()).toBe(0);
  });

  it("round-trips with toDateString", () => {
    expect(toDateString(asDate(fromDateString("2026-08-18")))).toBe(
      "2026-08-18",
    );
  });

  it("rejects a malformed string", () => {
    expect(fromDateString("18/08/2026")).toBeNull();
  });

  it("rejects a day that does not exist", () => {
    expect(fromDateString("2026-02-31")).toBeNull();
  });

  it("rejects an impossible month", () => {
    expect(fromDateString("2026-13-01")).toBeNull();
  });

  it("accepts a leap day in a leap year", () => {
    expect(fromDateString("2028-02-29")).not.toBeNull();
  });

  it("rejects a leap day in a common year", () => {
    expect(fromDateString("2026-02-29")).toBeNull();
  });
});

describe("monthGrid", () => {
  it("is always six weeks, so the calendar never changes height", () => {
    expect(monthGrid(new Date(2026, 7, 1), 1)).toHaveLength(42);
    expect(monthGrid(new Date(2026, 1, 1), 1)).toHaveLength(42);
  });

  it("starts on the configured weekday", () => {
    const mondayFirst = monthGrid(new Date(2026, 7, 1), 1);
    expect(mondayFirst[0]?.getDay()).toBe(1);

    const sundayFirst = monthGrid(new Date(2026, 7, 1), 0);
    expect(sundayFirst[0]?.getDay()).toBe(0);
  });

  it("includes trailing days of the previous month", () => {
    // 1 August 2026 is a Saturday, so a Monday-first grid opens in July.
    const grid = monthGrid(new Date(2026, 7, 1), 1);
    expect(grid[0]?.getMonth()).toBe(6);
  });

  it("covers every day of the month", () => {
    const grid = monthGrid(new Date(2026, 7, 1), 1);
    const inMonth = grid.filter((date: Date) => date.getMonth() === 7);
    expect(inMonth).toHaveLength(31);
  });

  it("runs consecutively with no gaps", () => {
    const grid = monthGrid(new Date(2026, 7, 1), 1);
    for (let index = 1; index < grid.length; index += 1) {
      expect(toDateString(grid[index])).toBe(
        toDateString(addDays(grid[index - 1], 1)),
      );
    }
  });

  it("handles a February that starts on the week-start day", () => {
    // 1 February 2027 is a Monday: a Monday-first grid opens exactly on it.
    const grid = monthGrid(new Date(2027, 1, 1), 1);
    expect(toDateString(grid[0])).toBe("2027-02-01");
  });
});

describe("weekdayNames", () => {
  it("returns seven names", () => {
    expect(weekdayNames(1, "en-CA")).toHaveLength(7);
  });

  it("starts on Monday when asked", () => {
    expect(weekdayNames(1, "en-CA")[0]).toMatch(/^Mon/);
  });

  it("starts on Sunday when asked", () => {
    expect(weekdayNames(0, "en-CA")[0]).toMatch(/^Sun/);
  });
});

describe("labels", () => {
  it("names a month with its year", () => {
    expect(monthLabel(new Date(2026, 7, 1), "en-CA")).toContain("2026");
    expect(monthLabel(new Date(2026, 7, 1), "en-CA")).toContain("August");
  });

  it("gives a day a full accessible name", () => {
    const label: string = dayLabel(new Date(2026, 7, 18), "en-CA");
    expect(label).toContain("18");
    expect(label).toContain("2026");
  });
});
