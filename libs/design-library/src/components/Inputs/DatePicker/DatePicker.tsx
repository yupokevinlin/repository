import { useEffect, useId, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { getFocusableElements } from "../../../hooks/useFocusTrap/focusableElements";
import { usePosition } from "../../../hooks/usePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import { Calendar } from "../../Overlays/Calendar";
import { toDateString } from "../../Overlays/Calendar/calendarDates";
import { Portal } from "../../Overlays/Portal";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";

export const datePickerSizes = inputSizes;
export const datePickerDensities = inputDensities;

export type DatePickerSize = InputSize;
export type DatePickerDensity = InputDensity;

export type DatePickerProps = FieldShellOwnProps & {
  /** The chosen date at local midnight, or `null`. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  weekStartsOn?: number;
  /** Shown when no date is chosen. Defaults to `"Choose a date"`. */
  placeholder?: string;
  size?: DatePickerSize;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

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
 * A field that opens a `Calendar`.
 *
 * The value is a calendar date at local midnight (§4.3) — never a timestamp,
 * and never parsed from or serialized to an ISO string inside this package.
 * Conversion to a Postgres `date` column happens at the app boundary.
 *
 * The trigger displays `YYYY-MM-DD`, which is unambiguous. A localised display
 * format would read "08/09/2026" as two different dates on two sides of the
 * Atlantic, and a trade confirmation is the wrong place to find that out.
 *
 * @client
 *
 * @example An ETA
 * ```tsx
 * <DatePicker label="ETA" value={eta} onValueChange={setEta} />
 * ```
 *
 * @example Bounded to the future
 * ```tsx
 * <DatePicker label="ETA" minDate={today()} required />
 * ```
 *
 * @example A range needs DateRangePicker, not two of these
 * ```tsx
 * <DateRangePicker label="Shipment window" />
 * ```
 */
export const DatePicker = ({
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
}: DatePickerProps) => {
  const size: DatePickerSize = sizeProp ?? "10";

  const [value, setValue] = useControllableState<Date | null>(
    valueProp,
    defaultValue ?? null,
    (next: Date | null) => {
      if (next !== null) {
        onValueChange?.(next);
      }
    },
  );
  const [open, setOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

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

  return (
    <FieldShell {...fieldProps} className={className}>
      <button
        data-slot="date-picker"
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
          setOpen(!open);
        }}
        {...controlProps}
      >
        <span
          data-slot="date-picker-value"
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            value === null ? "text-fg-subtle" : "text-fg-default",
          )}
        >
          {value === null
            ? (placeholder ?? "Choose a date")
            : toDateString(value)}
        </span>
        <span
          data-slot="date-picker-icon"
          className={InputSurfaceStyles.inputIconStyle({ size })}
        >
          {calendarIcon}
        </span>
      </button>
      {open && (
        <Portal>
          <div
            data-slot="date-picker-dialog"
            id={dialogId}
            role="dialog"
            aria-label={
              label === undefined ? (ariaLabel ?? "Choose a date") : undefined
            }
            aria-labelledby={label === undefined ? undefined : controlProps.id}
            tabIndex={-1}
            ref={floatingRef}
            className="z-50"
          >
            <Calendar
              value={value}
              onValueChange={(next: Date) => {
                setValue(next);
                setOpen(false);
                // Focus goes back to the field, not left in a calendar that is
                // no longer on screen.
                triggerRef.current?.focus();
              }}
              minDate={minDate}
              maxDate={maxDate}
              locale={locale}
              weekStartsOn={weekStartsOn}
            />
          </div>
        </Portal>
      )}
    </FieldShell>
  );
};
