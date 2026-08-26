import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type ProgressBarSeverity,
  type ProgressBarSize,
  ProgressBarStyles,
} from "./ProgressBarStyles";

export const progressBarSeverities = [
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const satisfies Array<ProgressBarSeverity>;

export const progressBarSizes = [
  "1",
  "2",
] as const satisfies Array<ProgressBarSize>;

export type { ProgressBarSeverity, ProgressBarSize };

/**
 * Fractions of `value / max`, not absolute values, so the same thresholds work
 * for 7 days of free time and 21 days of an L/C presentation window.
 */
export interface ProgressBarThresholds {
  /** At or above this fraction, the bar turns `warning`. */
  warning: number;
  /** At or above this fraction, the bar turns `error`. Should exceed `warning`. */
  error: number;
}

type ProgressBarBaseProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "role"
> & {
  /** Current value. Clamped to `0…max`. Ignored when `indeterminate`. */
  value?: number;
  /** Defaults to `100`. */
  max?: number;
  /**
   * Accessible name, and the visible label unless `labelHidden`. Required —
   * a progress bar with no name tells a screen reader user nothing about what
   * is progressing.
   */
  label: string;
  /** Hides the label visually. It stays the accessible name. */
  labelHidden?: boolean;
  /**
   * Right-aligned text in the header row, and the value announced instead of a
   * bare percentage. Supply the units — `"2 / 7 days"`, `"19 of 21 days"`.
   *
   * A string, not a node: it doubles as `aria-valuetext`, and stringifying
   * JSX would announce "[object Object]".
   */
  valueLabel?: string;
  /** Bar thickness. `"1"` = 4px, `"2"` = 8px. Defaults to `"2"`. */
  size?: ProgressBarSize;
  /**
   * No known value. Drops `aria-valuenow` and slides a short fill across the
   * track, which is what tells a screen reader the work is under way but
   * unmeasured.
   */
  indeterminate?: boolean;
};

/**
 * `severity` and `thresholds` are mutually exclusive: either you name the
 * colour or you describe when it should change, never both.
 */
export type ProgressBarProps = ProgressBarBaseProps &
  (
    | { severity?: ProgressBarSeverity; thresholds?: never }
    | { severity?: never; thresholds: ProgressBarThresholds }
  );

const clamp = (value: number, max: number): number =>
  Math.min(Math.max(value, 0), max);

const severityForRatio = (
  ratio: number,
  thresholds: ProgressBarThresholds,
): ProgressBarSeverity => {
  if (ratio >= thresholds.error) {
    return "error";
  }
  if (ratio >= thresholds.warning) {
    return "warning";
  }
  return "success";
};

/**
 * A bar showing elapsed against an allowance.
 *
 * Reach for it for the free-time and detention clocks, an L/C presentation
 * window, or an upload. `thresholds` is what makes it a clock rather than a
 * gauge: the colour shifts as the value crosses them, so a demurrage charge
 * becomes visible **before** it is real — which is the only point at which
 * anyone can still act on it.
 *
 * @server-safe
 *
 * @example A determinate bar
 * ```tsx
 * <ProgressBar label="Upload" value={68} valueLabel="68%" />
 * ```
 *
 * @example A free-time clock that colours itself
 * ```tsx
 * <ProgressBar
 *   label="Demurrage free time"
 *   value={5}
 *   max={7}
 *   valueLabel="5 / 7 days"
 *   thresholds={{ warning: 0.6, error: 0.85 }}
 * />
 * ```
 *
 * @example Work under way, with no known duration
 * ```tsx
 * <ProgressBar label="Applying FX rates" indeterminate />
 * ```
 */
export const ProgressBar = ({
  value: valueProp,
  max: maxProp,
  label,
  labelHidden,
  valueLabel,
  severity: severityProp,
  thresholds,
  size: sizeProp,
  indeterminate,
  className: classNameProp,
  ...remainingProps
}: ProgressBarProps) => {
  const max: number = maxProp ?? 100;
  const size: ProgressBarSize = sizeProp ?? "2";
  const className: string = classNameProp ?? "";
  const isIndeterminate: boolean = indeterminate ?? false;

  const value: number = clamp(valueProp ?? 0, max);
  const ratio: number = max === 0 ? 0 : value / max;

  const severity: ProgressBarSeverity =
    thresholds === undefined
      ? (severityProp ?? "info")
      : severityForRatio(ratio, thresholds);

  const showHeader: boolean = labelHidden !== true || valueLabel !== undefined;

  return (
    <div
      data-slot="progress-bar"
      className={cn("w-full", className)}
      {...remainingProps}
    >
      {showHeader && (
        <div
          data-slot="progress-bar-header"
          className={ProgressBarStyles.headerStyle()}
        >
          {labelHidden === true ? (
            <span />
          ) : (
            <span
              data-slot="progress-bar-label"
              className={ProgressBarStyles.labelStyle()}
            >
              {label}
            </span>
          )}
          {valueLabel !== undefined && (
            <span
              data-slot="progress-bar-value"
              className={ProgressBarStyles.valueLabelStyle()}
            >
              {valueLabel}
            </span>
          )}
        </div>
      )}

      <div
        data-slot="progress-bar-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : max}
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuetext={
          isIndeterminate || valueLabel === undefined ? undefined : valueLabel
        }
        className={ProgressBarStyles.trackStyle({ size })}
      >
        <div
          data-slot="progress-bar-fill"
          className={ProgressBarStyles.fillStyle({
            severity,
            indeterminate: isIndeterminate,
          })}
          style={
            isIndeterminate ? undefined : { width: `${String(ratio * 100)}%` }
          }
        />
      </div>
    </div>
  );
};
