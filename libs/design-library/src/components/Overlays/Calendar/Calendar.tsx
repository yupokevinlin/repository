import type { KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { focusRingStyle } from "../../../tailwind/focus/focusRing";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { IconButton } from "../../Buttons/IconButton";
import {
  addDays,
  addMonths,
  compareDays,
  dayLabel,
  isSameDay,
  isSameMonth,
  isWithin,
  localeWeekStart,
  monthGrid,
  monthLabel,
  startOfMonth,
  today,
  weekdayNames,
} from "./calendarDates";

export interface CalendarProps {
  /** The chosen date, or `null` for none. A date at local midnight (§4.3). */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  /** Which month is shown. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Nothing before this can be chosen. */
  minDate?: Date;
  /** Nothing after this can be chosen. */
  maxDate?: Date;
  /** BCP 47 tag for month and weekday names. Defaults to the browser's. */
  locale?: string;
  /**
   * 0 = Sunday … 6 = Monday. Defaults to the locale's, falling back to Monday
   * where `Intl.Locale.getWeekInfo` is unsupported — pass it explicitly where
   * that matters.
   */
  weekStartsOn?: number;
  /** Names the grid. Defaults to `"Calendar"`. */
  "aria-label"?: string;
  /** The previous-month button's name. Defaults to `"Previous month"`. */
  previousMonthLabel?: string;
  /** The next-month button's name. Defaults to `"Next month"`. */
  nextMonthLabel?: string;
  className?: string;
}

const chevronLeft = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M10 4L6 8l4 4" />
  </svg>
);

const chevronRight = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M6 4l4 4-4 4" />
  </svg>
);

/**
 * A month grid for choosing a date.
 *
 * A `Date` here is **a calendar date at local midnight** (§4.3). Time is
 * ignored: a B/L date and an ETA are calendar dates, and a timezone reaching
 * one is a real bug. All the arithmetic lives in `calendarDates`, kept pure and
 * tested separately.
 *
 * The grid is a roving-tabindex `grid` — one Tab stop, arrows by day, PageUp
 * and PageDown by month, Home and End to the ends of the week. Only the
 * focused day is tabbable, so Tab does not walk through 42 cells.
 *
 * Always six weeks tall, whatever the month, so paging does not move the
 * next-month button out from under the pointer.
 *
 * @client
 *
 * @example Choosing a date
 * ```tsx
 * <Calendar value={date} onValueChange={setDate} />
 * ```
 *
 * @example Bounded to the future
 * ```tsx
 * <Calendar value={eta} onValueChange={setEta} minDate={today} />
 * ```
 *
 * @example With an explicit week start, since the locale fallback is Monday
 * ```tsx
 * <Calendar locale="en-CA" weekStartsOn={0} />
 * ```
 */
export const Calendar = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  minDate,
  maxDate,
  locale,
  weekStartsOn,
  "aria-label": ariaLabel,
  previousMonthLabel,
  nextMonthLabel,
  className,
}: CalendarProps) => {
  const [value, setValue] = useControllableState<Date | null>(
    valueProp,
    defaultValue ?? null,
    (next: Date | null) => {
      if (next !== null) {
        onValueChange?.(next);
      }
    },
  );

  const [month, setMonth] = useControllableState<Date>(
    monthProp,
    defaultMonth ?? startOfMonth(value ?? today()),
    onMonthChange,
  );

  const weekStart: number = weekStartsOn ?? localeWeekStart(locale);
  const grid: Array<Date> = monthGrid(month, weekStart);
  const headings: Array<string> = weekdayNames(weekStart, locale);

  // The one day Tab can reach. Tracked separately from `value` so an empty
  // calendar still has an entry point.
  const [focusedDate, setFocusedDate] = useState<Date>(
    value ?? startOfMonth(month),
  );

  const gridRef = useRef<HTMLDivElement | null>(null);
  const labelId: string = useId();

  const isDisabled = (date: Date): boolean =>
    (minDate !== undefined && compareDays(date, minDate) < 0) ||
    (maxDate !== undefined && compareDays(date, maxDate) > 0);

  const moveFocus = (next: Date): void => {
    setFocusedDate(next);
    if (!isSameMonth(next, month)) {
      setMonth(startOfMonth(next));
    }
    // The cell may not exist yet when the month changes, so the focus call
    // waits for the render that creates it.
    requestAnimationFrame(() => {
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${toKey(next)}"]`)
        ?.focus();
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveFocus(addDays(focusedDate, 1));
        return;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(addDays(focusedDate, -1));
        return;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(addDays(focusedDate, 7));
        return;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(addDays(focusedDate, -7));
        return;
      case "Home":
        event.preventDefault();
        moveFocus(
          addDays(focusedDate, -((focusedDate.getDay() - weekStart + 7) % 7)),
        );
        return;
      case "End":
        event.preventDefault();
        moveFocus(
          addDays(
            focusedDate,
            6 - ((focusedDate.getDay() - weekStart + 7) % 7),
          ),
        );
        return;
      case "PageUp":
        event.preventDefault();
        moveFocus(addMonths(focusedDate, event.shiftKey ? -12 : -1));
        return;
      case "PageDown":
        event.preventDefault();
        moveFocus(addMonths(focusedDate, event.shiftKey ? 12 : 1));
        return;
      default:
        break;
    }
  };

  const choose = (date: Date): void => {
    if (isDisabled(date)) {
      return;
    }
    setValue(date);
    setFocusedDate(date);
    if (!isSameMonth(date, month)) {
      setMonth(startOfMonth(date));
    }
  };

  return (
    <div
      data-slot="calendar"
      className={cn(
        "inline-flex flex-col gap-2 rounded-md border border-border-default",
        "bg-bg-default p-3",
        className,
      )}
    >
      <div data-slot="calendar-header" className="flex items-center gap-2">
        <IconButton
          icon={chevronLeft}
          aria-label={previousMonthLabel ?? "Previous month"}
          size="8"
          variant="default-soft"
          onClick={() => {
            setMonth(addMonths(month, -1));
          }}
        />
        <span
          data-slot="calendar-month"
          id={labelId}
          aria-live="polite"
          className="flex-1 text-center text-label-md font-medium text-fg-default"
        >
          {monthLabel(month, locale)}
        </span>
        <IconButton
          icon={chevronRight}
          aria-label={nextMonthLabel ?? "Next month"}
          size="8"
          variant="default-soft"
          onClick={() => {
            setMonth(addMonths(month, 1));
          }}
        />
      </div>

      <div
        data-slot="calendar-grid"
        role="grid"
        // Script-focusable only: the roving tabindex on the days is what Tab
        // actually reaches, but a grid that cannot take focus at all leaves
        // nowhere to put it before a day has been focused.
        tabIndex={-1}
        aria-label={ariaLabel ?? "Calendar"}
        aria-labelledby={ariaLabel === undefined ? labelId : undefined}
        ref={gridRef}
        onKeyDown={onKeyDown}
        className="grid grid-cols-7 gap-0.5"
      >
        {headings.map((heading: string) => (
          <span
            key={heading}
            data-slot="calendar-weekday"
            role="columnheader"
            aria-label={heading}
            className="py-1 text-center text-micro-lg font-medium text-fg-muted"
          >
            {heading}
          </span>
        ))}
        {grid.map((date: Date) => {
          const outside = !isSameMonth(date, month);
          const selected: boolean = value !== null && isSameDay(date, value);
          const disabled: boolean = isDisabled(date);
          const isToday: boolean = isSameDay(date, today());

          return (
            <button
              key={toKey(date)}
              data-slot="calendar-day"
              data-date={toKey(date)}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={isToday ? "date" : undefined}
              aria-label={dayLabel(date, locale)}
              aria-disabled={disabled ? true : undefined}
              disabled={disabled}
              // Roving: only the focused day is reachable by Tab, so the grid
              // is one stop rather than 42.
              tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
              className={cn(
                "size-8 rounded-md text-body-sm transition-colors duration-150",
                focusRingStyle,
                "focus-visible:outline-border-primary",
                outside ? "text-fg-subtle" : "text-fg-default",
                selected
                  ? "bg-bg-primary text-fg-primary hover:bg-bg-primary-hover"
                  : "hover:bg-bg-hover",
                isToday && !selected ? "font-bold underline" : "",
                disabled
                  ? "cursor-not-allowed text-fg-disabled hover:bg-transparent"
                  : "cursor-pointer",
              )}
              onClick={() => {
                choose(date);
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/** A stable per-day key that never depends on a timezone. */
const toKey = (date: Date): string =>
  `${String(date.getFullYear())}-${String(date.getMonth())}-${String(date.getDate())}`;

export { isWithin };
