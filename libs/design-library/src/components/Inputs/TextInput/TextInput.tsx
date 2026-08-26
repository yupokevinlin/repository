import type { ComponentPropsWithRef, ReactNode } from "react";

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

export const textInputSizes = inputSizes;
export const textInputDensities = inputDensities;

export type TextInputSize = InputSize;
export type TextInputDensity = InputDensity;

export type TextInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "size" | "id"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** Height. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
    size?: TextInputSize;
    /** Sized automatically to match `size`. */
    startIcon?: ReactNode;
    /** Sized automatically to match `size`. */
    endIcon?: ReactNode;
  };

/**
 * A single line of text.
 *
 * It renders its own `<label>` and wires `for`/`id`, `aria-describedby` and
 * `aria-invalid` internally (§5.1), so the association between label, hint,
 * error and field cannot be broken by how it is composed.
 *
 * There is no `variant` prop. A field is invalid because it has an `error`,
 * not because someone remembered to set a second prop to match — one source
 * of truth, so the red border and the red message cannot disagree.
 *
 * Never use `placeholder` as a label: it vanishes the moment the user types,
 * and leaves nobody able to check what a filled field was asking for.
 *
 * @client
 *
 * @example A labelled field
 * ```tsx
 * <TextInput label="Deal number" value={value} onChange={onChange} />
 * ```
 *
 * @example With a hint, required
 * ```tsx
 * <TextInput
 *   label="Counterparty"
 *   hint="Legal entity name, as it appears on the contract."
 *   required
 * />
 * ```
 *
 * @example Invalid — the border and the message come from the same prop
 * ```tsx
 * <TextInput label="Deal number" error="That deal number is already in use." />
 * ```
 *
 * @example In a table-cell editor, with no label of its own
 * ```tsx
 * <TextInput aria-label="Quantity" size="8" density="compact" />
 * ```
 */
export const TextInput = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  size: sizeProp,
  startIcon,
  endIcon,
  className: classNameProp,
  disabled,
  ...remainingProps
}: TextInputProps) => {
  const size: TextInputSize = sizeProp ?? "10";
  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  return (
    <FieldShell {...fieldProps} className={classNameProp}>
      <div
        data-slot="text-input"
        className={InputSurfaceStyles.inputSurfaceStyle({ invalid, size })}
      >
        {startIcon !== undefined && (
          <span
            data-slot="text-input-start-icon"
            className={InputSurfaceStyles.inputIconStyle({ size })}
          >
            {startIcon}
          </span>
        )}
        <input
          data-slot="text-input-control"
          type="text"
          disabled={disabled}
          className={InputSurfaceStyles.inputElementStyle()}
          {...controlProps}
          {...remainingProps}
        />
        {endIcon !== undefined && (
          <span
            data-slot="text-input-end-icon"
            className={InputSurfaceStyles.inputIconStyle({ size })}
          >
            {endIcon}
          </span>
        )}
      </div>
    </FieldShell>
  );
};
