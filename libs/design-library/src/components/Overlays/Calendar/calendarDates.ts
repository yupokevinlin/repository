/**
 * Date maths for `Calendar`, `DatePicker` and `DateRangePicker`, kept pure so
 * every off-by-one and every timezone trap is testable without a DOM.
 *
 * A `Date` here means **a calendar date at local midnight** (§4.3). Time
 * components are ignored throughout. The rules, which every function below
 * holds to:
 *
 * - Construct with `new Date(y, m, d)`. Never `new Date("2026-08-18")` — the
 *   string form parses as UTC and can land on the previous day.
 * - Serialize with local getters. Never `toISOString()`, which shifts the
 *   other way.
 * - Compare by year, month and day. Never by timestamp.
 */

/** A calendar date at local midnight, with any time component discarded. */
export const atLocalMidnight = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Today, at local midnight. */
export const today = (): Date => atLocalMidnight(new Date());

/**
 * Whether two dates are the same calendar day.
 *
 * By year, month and day rather than by timestamp: two `Date`s an hour apart
 * on the same day are the same calendar date, and a timestamp comparison would
 * disagree.
 */
export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Negative when `a` is earlier, positive when later, zero on the same day. */
export const compareDays = (a: Date, b: Date): number => {
  if (a.getFullYear() !== b.getFullYear()) {
    return a.getFullYear() - b.getFullYear();
  }
  if (a.getMonth() !== b.getMonth()) {
    return a.getMonth() - b.getMonth();
  }
  return a.getDate() - b.getDate();
};

export const isBefore = (a: Date, b: Date): boolean => compareDays(a, b) < 0;
export const isAfter = (a: Date, b: Date): boolean => compareDays(a, b) > 0;

/** Whether `date` falls in `[from, to]`, inclusive, comparing by day. */
export const isWithin = (date: Date, from: Date, to: Date): boolean =>
  compareDays(date, from) >= 0 && compareDays(date, to) <= 0;

/**
 * Adds days. `new Date(y, m, d + n)` rather than adding milliseconds: a
 * daylight-saving boundary makes a "day" 23 or 25 hours long, and arithmetic
 * on timestamps lands an hour off.
 */
export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * Adds months, clamping the day to the end of the target month.
 *
 * 31 January plus one month is 28 February, not 3 March — which is what the
 * naive version gives, because `new Date(2026, 1, 31)` rolls over.
 */
export const addMonths = (date: Date, months: number): Date => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay: number = daysInMonth(target.getFullYear(), target.getMonth());
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
};

/** Day 0 of the next month is the last day of this one. */
export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * Serializes to `YYYY-MM-DD` using local getters.
 *
 * Never `toISOString()`: that converts to UTC first, so a date at local
 * midnight west of Greenwich comes out as the previous day.
 */
export const toDateString = (date: Date): string => {
  const year: string = String(date.getFullYear()).padStart(4, "0");
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parses `YYYY-MM-DD` into a local-midnight `Date`.
 *
 * Built with `new Date(y, m, d)` rather than handed to the `Date` constructor
 * as a string, which would parse it as UTC.
 */
export const fromDateString = (value: string): Date | null => {
  const match: RegExpExecArray | null = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  // Rejects 2026-02-31, which would otherwise roll into March.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

/**
 * Which weekday a week starts on for a locale, as 0=Sunday…6=Saturday.
 *
 * `Intl.Locale.prototype.getWeekInfo()` is not supported everywhere, so this
 * falls back to Monday. That fallback is wrong for `en-US` and `en-CA`, both
 * of which start on Sunday — a real limitation, not a solved problem. Pass
 * `weekStartsOn` explicitly where it matters.
 */
export const localeWeekStart = (locale?: string): number => {
  try {
    const resolved = new Intl.Locale(
      locale ?? navigator.language,
    ) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info =
      typeof resolved.getWeekInfo === "function"
        ? resolved.getWeekInfo()
        : resolved.weekInfo;
    if (info !== undefined) {
      // Intl counts 1=Monday…7=Sunday; JavaScript counts 0=Sunday…6=Saturday.
      return info.firstDay % 7;
    }
  } catch {
    // Falls through to the default below.
  }
  return 1;
};

/**
 * The six-week grid for a month, always 42 days.
 *
 * Fixed at six weeks so the calendar does not change height as the user pages
 * through months, which makes the next-month button move under the pointer.
 * Leading and trailing days belong to the neighbouring months.
 */
export const monthGrid = (month: Date, weekStartsOn: number): Array<Date> => {
  const first: Date = startOfMonth(month);
  const offset: number = (first.getDay() - weekStartsOn + 7) % 7;
  const start: Date = addDays(first, -offset);
  return Array.from({ length: 42 }, (_unused, index: number) =>
    addDays(start, index),
  );
};

/** Weekday names in display order, starting from `weekStartsOn`. */
export const weekdayNames = (
  weekStartsOn: number,
  locale?: string,
  format: "short" | "narrow" = "short",
): Array<string> => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  // Any Sunday works as an anchor; 2024-01-07 was one.
  const anchor = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_unused, index: number) =>
    formatter.format(addDays(anchor, (weekStartsOn + index) % 7)),
  );
};

/** "August 2026", localised. */
export const monthLabel = (month: Date, locale?: string): string =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    month,
  );

/** The full localised date, for a day cell's accessible name. */
export const dayLabel = (date: Date, locale?: string): string =>
  new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date);
