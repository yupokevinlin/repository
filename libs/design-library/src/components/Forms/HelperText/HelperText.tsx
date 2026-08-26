import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type HelperTextDensity,
  type HelperTextSeverity,
  HelperTextStyles,
} from "./HelperTextStyles";

export const helperTextSeverities = [
  "neutral",
  "warning",
  "error",
] as const satisfies Array<HelperTextSeverity>;

export const helperTextDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<HelperTextDensity>;

export type { HelperTextDensity, HelperTextSeverity };

/** A warning triangle and an error circle, drawn inline — no icon dependency. */
const severityIcon: Record<HelperTextSeverity, ReactNode> = {
  neutral: null,
  warning: (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2.5L14.5 14H1.5L8 2.5z" />
      <path d="M8 6.5v3.5" />
      <path d="M8 12h.01" />
    </svg>
  ),
  error: (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.75v4" />
      <path d="M8 11h.01" />
    </svg>
  ),
};

export type HelperTextProps = Omit<ComponentPropsWithRef<"p">, "children"> & {
  /** The hint or the problem, in words. */
  children: ReactNode;
  /**
   * Defaults to `"neutral"`. Only three of the five §4.1 values: `info` and
   * `success` under a field read as decoration rather than as something the
   * user must act on.
   */
  severity?: HelperTextSeverity;
  /** Tightens the type step. Never changes the control's height (§4.2). */
  density?: HelperTextDensity;
  /**
   * Announces changes to screen readers as they happen. Turn this on for
   * validation that appears after the user has moved on, and leave it off for
   * a static hint that was there all along.
   */
  live?: boolean;
};

/**
 * The line under a field — a hint, or what went wrong.
 *
 * Most of the time you will not reach for this: every form control renders its
 * own hint and error from its `hint` and `error` props and wires
 * `aria-describedby` itself (§5.1). This is the standalone primitive for the
 * cases with no full field around them.
 *
 * Give it an `id` and point the control's `aria-describedby` at it. Text sitting
 * next to an input is not connected to it — a screen reader user tabbing into
 * the field hears nothing at all unless that wiring is there.
 *
 * Severity is never carried by colour alone (§15.2): `warning` and `error` each
 * draw an icon, so the distinction survives a greyscale print and a colour-blind
 * reader.
 *
 * @server-safe
 *
 * @example A hint, wired to its field
 * ```tsx
 * <input id="rate" aria-describedby="rate-hint" />
 * <HelperText id="rate-hint">Mid-market rate at 16:00 UTC.</HelperText>
 * ```
 *
 * @example A validation error that appears after the fact
 * ```tsx
 * <input id="qty" aria-describedby="qty-error" aria-invalid />
 * <HelperText id="qty-error" severity="error" live>
 *   Quantity exceeds the remaining allocation.
 * </HelperText>
 * ```
 *
 * @example Tightened, in a filter bar
 * ```tsx
 * <HelperText density="compact">Applies to open deals only.</HelperText>
 * ```
 */
export const HelperText = ({
  children,
  severity: severityProp,
  density: densityProp,
  live,
  className: classNameProp,
  ...remainingProps
}: HelperTextProps) => {
  const severity: HelperTextSeverity = severityProp ?? "neutral";
  const density: HelperTextDensity = densityProp ?? "comfortable";
  const icon: ReactNode = severityIcon[severity];

  return (
    <p
      data-slot="helper-text"
      data-severity={severity}
      // "polite" rather than "assertive": a field error should wait for a gap
      // in what the user is already hearing, not cut across it.
      aria-live={live === true ? "polite" : undefined}
      className={cn(
        HelperTextStyles.helperTextStyle({ severity, density }),
        classNameProp,
      )}
      {...remainingProps}
    >
      {icon !== null && (
        <span
          data-slot="helper-text-icon"
          className={HelperTextStyles.iconStyle()}
        >
          {icon}
        </span>
      )}
      <span data-slot="helper-text-content">{children}</span>
    </p>
  );
};
