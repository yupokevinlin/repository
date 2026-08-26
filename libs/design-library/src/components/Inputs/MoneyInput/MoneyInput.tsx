import { useId } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import {
  clampValue,
  formatNumber,
  isEditableNumber,
  toRawValue,
} from "../NumberInput/formatNumber";
import { Select, type SelectOption } from "../Select";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";

export const moneyInputSizes = inputSizes;
export const moneyInputDensities = inputDensities;

export type MoneyInputSize = InputSize;
export type MoneyInputDensity = InputDensity;

/**
 * An amount and the currency it is in, as one value.
 *
 * The amount is a string for the same reasons as `NumberInput`: a figure the
 * user is halfway through typing is not a number, and floating point is not
 * something to put on a trade confirmation.
 */
export interface Money {
  amount: string;
  currency: string;
}

export type MoneyInputProps = FieldShellOwnProps & {
  /** The currencies that can be chosen. */
  currencies: Array<SelectOption>;
  value?: Money;
  defaultValue?: Money;
  onValueChange?: (value: Money) => void;
  /** Decimals shown at rest. Defaults to `2`. */
  decimals?: number;
  locale?: string;
  min?: number;
  max?: number;
  size?: MoneyInputSize;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  /** Names the currency select. Defaults to `"Currency"`. */
  currencyLabel?: string;
};

const emptyMoney: Money = { amount: "", currency: "" };

/**
 * An amount and its currency, entered as one control.
 *
 * This exists to enforce one invariant: **a currency never travels apart from
 * its amount.** Two separate fields can be submitted with one filled and the
 * other empty, or wired to two pieces of state that drift; "40,000" with no
 * currency on a confirmation is a real incident, not a validation nicety. So
 * the value is a single object and the two halves change together.
 *
 * It renders one `FieldShell`, not two. Composing a `NumberInput` and a
 * `Select` directly would emit two labels, two hints and two error lines for
 * what the user sees as one field.
 *
 * The amount behaves exactly as `NumberInput`: `type="text"` with
 * `inputMode="decimal"`, separators at rest and raw while focused, clamped on
 * blur.
 *
 * @client
 *
 * @example A unit price
 * ```tsx
 * <MoneyInput
 *   label="Unit price"
 *   currencies={currencyOptions}
 *   value={price}
 *   onValueChange={setPrice}
 * />
 * ```
 *
 * @example Never below zero, with a hint
 * ```tsx
 * <MoneyInput
 *   label="Freight"
 *   currencies={currencyOptions}
 *   min={0}
 *   hint="Excludes demurrage."
 * />
 * ```
 *
 * @example A quantity and its unit is QuantityInput, the same idea
 * ```tsx
 * <QuantityInput label="Quantity" units={unitOptions} />
 * ```
 */
export const MoneyInput = ({
  currencies,
  value: valueProp,
  defaultValue,
  onValueChange,
  decimals,
  locale,
  min,
  max,
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
  currencyLabel,
}: MoneyInputProps) => {
  const size: MoneyInputSize = sizeProp ?? "10";

  const [value, setValue] = useControllableState<Money>(
    valueProp,
    defaultValue ?? emptyMoney,
    onValueChange,
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

  const currencyId: string = useId();
  const [focused, setFocused] = useControllableState<boolean>(undefined, false);

  const displayed: string = focused
    ? toRawValue(value.amount)
    : formatNumber(value.amount, { locale, decimals: decimals ?? 2 });

  return (
    <FieldShell {...fieldProps} className={className}>
      <div
        data-slot="money-input"
        className={cn(
          InputSurfaceStyles.inputSurfaceStyle({ invalid, size }),
          "pr-0",
        )}
      >
        <input
          data-slot="money-input-amount"
          type="text"
          inputMode="decimal"
          aria-label={ariaLabel}
          disabled={disabled}
          value={displayed}
          className={InputSurfaceStyles.inputElementStyle()}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
            setValue({
              ...value,
              amount: clampValue(value.amount, min, max),
            });
          }}
          onChange={(event) => {
            const next: string = event.target.value;
            if (next === "" || isEditableNumber(next)) {
              setValue({ ...value, amount: next });
            }
          }}
          {...controlProps}
        />
        {/*
         * The currency sits inside the same surface, so the pair reads as one
         * control. Its own FieldShell renders no label — this component owns
         * the one label for both halves.
         */}
        <div className="w-[7rem] shrink-0">
          <Select
            aria-label={currencyLabel ?? "Currency"}
            options={currencies}
            value={value.currency}
            onValueChange={(currency: string) => {
              setValue({ ...value, currency });
            }}
            size={size}
            disabled={disabled}
            id={currencyId}
          />
        </div>
      </div>
    </FieldShell>
  );
};
