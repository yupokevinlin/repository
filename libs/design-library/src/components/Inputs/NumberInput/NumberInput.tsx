import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from "react";
import { useState } from "react";

import {
  FieldShell,
  type FieldShellOwnProps,
  useFieldShell,
} from "../../Forms/FieldShell/FieldShell";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";
import {
  clampValue,
  formatNumber,
  isEditableNumber,
  toRawValue,
} from "./formatNumber";

export const numberInputSizes = inputSizes;
export const numberInputDensities = inputDensities;

export type NumberInputSize = InputSize;
export type NumberInputDensity = InputDensity;

export type NumberInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "id" | "size" | "type" | "value" | "defaultValue" | "onChange"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** The value, as a string. Always a string — never a number. */
    value?: string;
    /** Initial value when uncontrolled. */
    defaultValue?: string;
    /** Fires with the raw, unformatted string on every keystroke. */
    onValueChange?: (value: string) => void;
    /** Height. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
    size?: NumberInputSize;
    /** Fixed decimals on blur. Omit to keep whatever the user typed. */
    decimals?: number;
    /** BCP 47 tag for grouping separators. Defaults to the browser's locale. */
    locale?: string;
    /** Turns off grouping separators. */
    grouping?: boolean;
    /** Clamped on blur, not while typing. */
    min?: number;
    /** Clamped on blur, not while typing. */
    max?: number;
    /** A unit or currency shown after the field — "kg", "CAD". */
    suffix?: ReactNode;
  };

/**
 * A number, held as a string.
 *
 * Deliberately **not** `type="number"`. That control brings spinners nobody
 * asked for, scrolls the value when the wheel passes over it, silently drops
 * what it cannot parse, and reports an empty string for input it considers
 * invalid — so you cannot tell "" from "abc". For quantities and prices on a
 * trade desk, none of that is acceptable. This is `type="text"` with
 * `inputMode="decimal"`, which still brings up a numeric keypad on a phone.
 *
 * The value is a string everywhere, including in `onValueChange`. A quantity
 * mid-typing is "1," or "-" or "1.", none of which survive a round trip
 * through `Number`, and `0.1 + 0.2` is not a figure to put on a confirmation.
 *
 * Separators appear on blur and disappear on focus, so the field is readable
 * at rest and editable when you are in it.
 *
 * @client
 *
 * @example A quantity
 * ```tsx
 * <NumberInput label="Quantity" value={qty} onValueChange={setQty} suffix="kg" />
 * ```
 *
 * @example A price, always to two decimals
 * ```tsx
 * <NumberInput label="Unit price" decimals={2} suffix="CAD" min={0} />
 * ```
 *
 * @example Unformatted, for an integer reference
 * ```tsx
 * <NumberInput label="Container count" grouping={false} decimals={0} />
 * ```
 */
export const NumberInput = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  size: sizeProp,
  value,
  defaultValue,
  onValueChange,
  decimals,
  locale,
  grouping,
  min,
  max,
  suffix,
  className: classNameProp,
  disabled,
  onFocus,
  onBlur,
  ...remainingProps
}: NumberInputProps) => {
  const size: NumberInputSize = sizeProp ?? "10";
  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const isControlled: boolean = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<string>(defaultValue ?? "");
  // `??` is safe here: the prop is string | undefined, with no null case to
  // confuse with an intentionally empty value.
  const current: string = value ?? uncontrolled;

  // Formatting is suspended while the field has focus, so the user's own
  // keystrokes are never rewritten under the cursor.
  const [focused, setFocused] = useState<boolean>(false);

  const displayed: string = focused
    ? toRawValue(current)
    : formatNumber(current, { locale, decimals, grouping });

  const commit = (next: string): void => {
    if (!isControlled) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
  };

  return (
    <FieldShell {...fieldProps} className={classNameProp}>
      <div
        data-slot="number-input"
        className={InputSurfaceStyles.inputSurfaceStyle({ invalid, size })}
      >
        <input
          data-slot="number-input-control"
          type="text"
          // Brings up a numeric keypad without any of type="number"'s
          // behaviour.
          inputMode="decimal"
          disabled={disabled}
          value={displayed}
          className={InputSurfaceStyles.inputElementStyle()}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            commit(clampValue(current, min, max));
            onBlur?.(event);
          }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const next: string = event.target.value;
            // Rejected outright rather than stripped: silently deleting a
            // character the user typed is more confusing than nothing
            // happening.
            if (next === "" || isEditableNumber(next)) {
              commit(next);
            }
          }}
          {...controlProps}
          {...remainingProps}
        />
        {suffix !== undefined && (
          <span
            data-slot="number-input-suffix"
            className="shrink-0 text-fg-muted select-none"
          >
            {suffix}
          </span>
        )}
      </div>
    </FieldShell>
  );
};
