import { useEffect, useId, useRef, useState } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { getFocusableElements } from "../../../hooks/useFocusTrap/focusableElements";
import { usePosition } from "../../../hooks/usePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import { Calendar } from "../../Overlays/Calendar";
import { isBefore, toDateString } from "../../Overlays/Calendar/calendarDates";
import { Portal } from "../../Overlays/Portal";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";

export const dateRangePickerSizes = inputSizes;
export const dateRangePickerDensities = inputDensities;

export type DateRangePickerSize = InputSize;
export type DateRangePickerDensity = InputDensity;

/**
 * Both ends of a range, at local midnight. `null` on either end means that end
 * is not chosen yet — a half-open range is a real state while the user picks.
 */
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export type DateRangePickerProps = FieldShellOwnProps & {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  weekStartsOn?: number;
  /** Shown when nothing is chosen. Defaults to `"Choose a range"`. */
  placeholder?: string;
  size?: DateRangePickerSize;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

const emptyRange: DateRange = { from: null, to: null };

const calendarIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-full"
  >
    <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
    <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
  </svg>
);

/**
 * A field that opens a `Calendar` and collects two dates.
 *
 * Both ends are calendar dates at local midnight (§4.3). The value is one
 * object rather than two props, because a shipment window is one fact: a range
 * whose ends can be set independently is a range that can be left inconsistent.
 *
 * Picking runs in two steps. The first click sets `from` and clears `to`; the
 * second sets `to`. Clicking a date **before** the current `from` starts again
 * from that date rather than producing a backwards range — which is what the
 * user meant, and cheaper than an error message.
 *
 * @client
 *
 * @example A shipment window
 * ```tsx
 * <DateRangePicker label="Shipment window" value={window} onValueChange={setWindow} />
 * ```
 *
 * @example Bounded to the future
 * ```tsx
 * <DateRangePicker label="Laycan" minDate={today()} required />
 * ```
 *
 * @example A single date is a DatePicker
 * ```tsx
 * <DatePicker label="ETA" />
 * ```
 */
export const DateRangePicker = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  minDate,
  maxDate,
  locale,
  weekStartsOn,
  placeholder,
  size: sizeProp,
  id,
  label,
  hint,
  error,
  required,
  density,
  disabled,
  className,
  "aria-label": ariaLabel,
}: DateRangePickerProps) => {
  const size: DateRangePickerSize = sizeProp ?? "10";

  const [value, setValue] = useControllableState<DateRange>(
    valueProp,
    defaultValue ?? emptyRange,
    onValueChange,
  );
  const [open, setOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  // Which end the next click sets. Reset whenever the popup opens, so a
  // half-finished pick from last time does not carry over.
  const [picking, setPicking] = useState<"from" | "to">("from");

  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const dialogId: string = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { anchorRef, floatingRef } = usePosition<
    HTMLButtonElement,
    HTMLDivElement
  >({
    open,
    placement: "bottom",
    alignment: "start",
    offset: 4,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    const panel: HTMLDivElement | null = floatingRef.current;
    if (panel !== null) {
      (getFocusableElements(panel)[0] ?? panel).focus();
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent): void => {
      const target: Node | null =
        event.target instanceof Node ? event.target : null;
      if (target === null) {
        return;
      }
      if (
        floatingRef.current?.contains(target) === true ||
        triggerRef.current?.contains(target) === true
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, setOpen, floatingRef]);

  const choose = (date: Date): void => {
    if (picking === "from" || value.from === null) {
      setValue({ from: date, to: null });
      setPicking("to");
      return;
    }

    // Clicking before the start means the user is restarting from there, not
    // asking for a range that runs backwards.
    if (isBefore(date, value.from)) {
      setValue({ from: date, to: null });
      setPicking("to");
      return;
    }

    setValue({ from: value.from, to: date });
    setPicking("from");
    setOpen(false);
    triggerRef.current?.focus();
  };

  const display: string =
    value.from === null
      ? (placeholder ?? "Choose a range")
      : value.to === null
        ? `${toDateString(value.from)} – …`
        : `${toDateString(value.from)} – ${toDateString(value.to)}`;

  return (
    <FieldShell {...fieldProps} className={className}>
      <button
        data-slot="date-range-picker"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        ref={(element: HTMLButtonElement | null) => {
          anchorRef.current = element;
          triggerRef.current = element;
        }}
        className={cn(
          InputSurfaceStyles.inputSurfaceStyle({ invalid, size }),
          "cursor-pointer",
        )}
        onClick={() => {
          // Reset here rather than in an effect: setting state from an effect
          // on every open is a cascading render, and this is the one moment
          // that actually starts a fresh pick.
          if (!open) {
            setPicking("from");
          }
          setOpen(!open);
        }}
        {...controlProps}
      >
        <span
          data-slot="date-range-picker-value"
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            value.from === null ? "text-fg-subtle" : "text-fg-default",
          )}
        >
          {display}
        </span>
        <span
          data-slot="date-range-picker-icon"
          className={InputSurfaceStyles.inputIconStyle({ size })}
        >
          {calendarIcon}
        </span>
      </button>
      {open && (
        <Portal>
          <div
            data-slot="date-range-picker-dialog"
            id={dialogId}
            role="dialog"
            aria-label={
              label === undefined ? (ariaLabel ?? "Choose a range") : undefined
            }
            aria-labelledby={label === undefined ? undefined : controlProps.id}
            tabIndex={-1}
            ref={floatingRef}
            className="z-50 flex flex-col gap-1"
          >
            <Calendar
              value={picking === "from" ? value.from : value.to}
              defaultMonth={value.from ?? undefined}
              onValueChange={choose}
              minDate={minDate}
              maxDate={maxDate}
              locale={locale}
              weekStartsOn={weekStartsOn}
            />
            <span
              data-slot="date-range-picker-step"
              aria-live="polite"
              className="px-1 text-body-xs text-fg-muted"
            >
              {picking === "from" ? "Choose the start" : "Choose the end"}
            </span>
          </div>
        </Portal>
      )}
    </FieldShell>
  );
};
