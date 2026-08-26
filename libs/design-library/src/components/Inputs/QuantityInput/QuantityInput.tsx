import type { ReactNode } from "react";
import { useId, useState } from "react";

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

export const quantityInputSizes = inputSizes;
export const quantityInputDensities = inputDensities;

export type QuantityInputSize = InputSize;
export type QuantityInputDensity = InputDensity;

/** An amount and the unit it is measured in, as one value. */
export interface Quantity {
  amount: string;
  unit: string;
}

/**
 * The conversion frozen onto a deal at booking.
 *
 * Frozen, not looked up: a deal booked at 1 MT = 1,000 kg must still read
 * 1,000 kg years later, whatever the reference data says by then. This
 * component only displays it — freezing it is the app's job.
 */
export interface ConversionFactor {
  /** How many `toUnit` per one of the chosen unit. */
  factor: string;
  /** The unit converted to — "kg", "lb". */
  toUnit: string;
}

export type QuantityInputProps = FieldShellOwnProps & {
  /** The units that can be chosen. */
  units: Array<SelectOption>;
  value?: Quantity;
  defaultValue?: Quantity;
  onValueChange?: (value: Quantity) => void;
  /**
   * The frozen conversion for the chosen unit, shown in the hint. Omit where
   * the unit needs no conversion.
   */
  conversionFactor?: ConversionFactor;
  /** Decimals shown at rest. Defaults to `3`, which suits metric tonnes. */
  decimals?: number;
  locale?: string;
  min?: number;
  max?: number;
  size?: QuantityInputSize;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  /** Names the unit select. Defaults to `"Unit"`. */
  unitLabel?: string;
};

const emptyQuantity: Quantity = { amount: "", unit: "" };

/**
 * A quantity and its unit of measure, entered as one control.
 *
 * The same invariant as `MoneyInput`: **a unit never travels apart from its
 * amount.** "40,000" is not a quantity, and a field that can be submitted with
 * one half filled will eventually be.
 *
 * When a `conversionFactor` is given it is shown in the hint, because the
 * factor is frozen onto the deal at booking and the user needs to see the one
 * that applies — not the one that happens to be current. A deal booked at
 * 1 MT = 1,000 kg still reads 1,000 kg years later; showing a live lookup
 * instead would quietly rewrite history.
 *
 * @client
 *
 * @example A quantity in metric tonnes
 * ```tsx
 * <QuantityInput
 *   label="Quantity"
 *   units={unitOptions}
 *   value={quantity}
 *   onValueChange={setQuantity}
 * />
 * ```
 *
 * @example With the frozen factor shown
 * ```tsx
 * <QuantityInput
 *   label="Quantity"
 *   units={unitOptions}
 *   conversionFactor={{ factor: "1,000", toUnit: "kg" }}
 * />
 * ```
 *
 * @example An amount and a currency is MoneyInput, the same idea
 * ```tsx
 * <MoneyInput label="Unit price" currencies={currencyOptions} />
 * ```
 */
export const QuantityInput = ({
  units,
  value: valueProp,
  defaultValue,
  onValueChange,
  conversionFactor,
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
  unitLabel,
}: QuantityInputProps) => {
  const size: QuantityInputSize = sizeProp ?? "10";

  const [value, setValue] = useControllableState<Quantity>(
    valueProp,
    defaultValue ?? emptyQuantity,
    onValueChange,
  );

  // The factor joins whatever hint the caller gave rather than replacing it —
  // both are things the user needs.
  const factorText: string | undefined =
    conversionFactor === undefined
      ? undefined
      : `1 ${value.unit === "" ? "unit" : value.unit} = ${conversionFactor.factor} ${conversionFactor.toUnit} (frozen at booking)`;

  // Rendered as nodes rather than interpolated into a string: hint is a
  // ReactNode, and String() on an element gives "[object Object]".
  const combinedHint: ReactNode =
    factorText === undefined ? (
      hint
    ) : hint === undefined || hint === null ? (
      factorText
    ) : (
      <>
        {hint} {factorText}
      </>
    );

  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint: combinedHint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const unitId: string = useId();
  const [focused, setFocused] = useState<boolean>(false);

  const displayed: string = focused
    ? toRawValue(value.amount)
    : formatNumber(value.amount, { locale, decimals: decimals ?? 3 });

  return (
    <FieldShell {...fieldProps} className={className}>
      <div
        data-slot="quantity-input"
        className={cn(
          InputSurfaceStyles.inputSurfaceStyle({ invalid, size }),
          "pr-0",
        )}
      >
        <input
          data-slot="quantity-input-amount"
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
        <div className="w-[7rem] shrink-0">
          <Select
            aria-label={unitLabel ?? "Unit"}
            options={units}
            value={value.unit}
            onValueChange={(unit: string) => {
              setValue({ ...value, unit });
            }}
            size={size}
            disabled={disabled}
            id={unitId}
          />
        </div>
      </div>
    </FieldShell>
  );
};
