/**
 * Formatting for `NumberInput`, kept pure so the awkward cases are testable
 * without a DOM.
 *
 * The value is a **string throughout**, never a number. A quantity the user is
 * halfway through typing is "1," or "-" or "1.", none of which survive a round
 * trip through `Number`, and `0.1 + 0.2` is not a price anyone wants on a
 * trade confirmation.
 */

/** Everything that is not a digit, a separator, or a leading minus. */
const stripFormatting = (value: string): string =>
  value.replace(/[^\d.-]/g, "");

/**
 * The raw value, as the user would type it — no grouping separators.
 *
 * Used on focus, so that clicking into "1,234,567.89" gives you something you
 * can actually edit rather than a string where every keystroke fights the
 * formatter.
 */
export const toRawValue = (value: string): string => stripFormatting(value);

/**
 * Whether a string is a number the user could still be in the middle of
 * typing. "-", "1." and "" all pass: rejecting them mid-keystroke would make
 * the field impossible to type in.
 */
export const isEditableNumber = (value: string): boolean =>
  /^-?\d*\.?\d*$/.test(value);

/** Whether a string is a complete, parseable number. */
export const isCompleteNumber = (value: string): boolean =>
  value !== "" && value !== "-" && /^-?\d*\.?\d+$/.test(value);

export interface FormatNumberOptions {
  /** BCP 47 tag. Defaults to the browser's locale. */
  locale?: string;
  /** Fixed number of decimals. Omit to keep whatever the user typed. */
  decimals?: number;
  /** Turns off grouping separators. */
  grouping?: boolean;
}

/**
 * The display value — grouped, and padded to a fixed number of decimals when
 * one is given.
 *
 * Anything that is not a complete number is returned untouched. A half-typed
 * "1." must survive being formatted, or the field rewrites itself under the
 * user's cursor.
 *
 * @example
 * ```ts
 * formatNumber("1234567.5", { decimals: 2 }); // "1,234,567.50"
 * formatNumber("1.", {});                     // "1."
 * ```
 */
export const formatNumber = (
  value: string,
  { locale, decimals, grouping }: FormatNumberOptions,
): string => {
  const raw: string = stripFormatting(value);

  if (!isCompleteNumber(raw)) {
    return value;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return value;
  }

  return new Intl.NumberFormat(locale, {
    useGrouping: grouping !== false,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals ?? 20,
  }).format(parsed);
};

/**
 * Adds `step` to a value, keeping the result a string and respecting
 * `decimals` so stepping never introduces floating-point dust.
 */
export const stepValue = (
  value: string,
  step: number,
  decimals?: number,
): string => {
  const raw: string = stripFormatting(value);
  const current: number = isCompleteNumber(raw) ? Number(raw) : 0;
  const next: number = current + step;

  // Rounded to the field's precision, or to the step's own, rather than left
  // as 0.30000000000000004.
  const places: number =
    decimals ?? Math.max(decimalPlaces(current), decimalPlaces(step));
  return next.toFixed(places);
};

const decimalPlaces = (value: number): number => {
  const text = String(value);
  const dot: number = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
};

/** Clamps a complete number between optional bounds. Incomplete input passes through. */
export const clampValue = (
  value: string,
  min?: number,
  max?: number,
): string => {
  const raw: string = stripFormatting(value);
  if (!isCompleteNumber(raw)) {
    return value;
  }

  const parsed = Number(raw);
  if (min !== undefined && parsed < min) {
    return String(min);
  }
  if (max !== undefined && parsed > max) {
    return String(max);
  }
  return raw;
};
