import type { ComponentPropsWithRef } from "react";

import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { useFieldShell } from "../../Forms/FieldShell/FieldShell";
import type { InputDensity } from "../shared/inputSurfaceStyles";
import { inputDensities } from "../shared/inputSurfaceStyles";
import { SelectionField } from "../shared/SelectionField";
import {
  type SelectionSize,
  selectionSizes,
  SelectionStyles,
} from "../shared/selectionStyles";

export const radioSizes = selectionSizes;
export const radioDensities = inputDensities;

export type RadioSize = SelectionSize;
export type RadioDensity = InputDensity;

export type RadioProps = Omit<
  ComponentPropsWithRef<"input">,
  "id" | "size" | "type"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** `"4"` = 16px, `"5"` = 20px. Defaults to `"4"`. */
    size?: RadioSize;
  };

/**
 * A single radio — the atom.
 *
 * Usable on its own, not only inside a group. A standalone radio is rare but
 * real: a table row that opts into one of several exclusive states, driven by
 * a shared `name` rather than by a wrapper component.
 *
 * For a named set of options use `RadioGroup`, which renders `<fieldset>` +
 * `<legend>` and moves selection with the arrow keys — the APG pattern. A row
 * of bare radios is a set to a sighted user and a pile of unrelated controls
 * to a screen reader.
 *
 * Radios sharing a `name` are mutually exclusive, and — unlike a checkbox —
 * one cannot be unticked by clicking it again. Do not use a lone radio for
 * something the user may want to undo.
 *
 * @client
 *
 * @example One of a set, wired by name
 * ```tsx
 * <Radio name="incoterm" value="FOB" label="FOB" />
 * <Radio name="incoterm" value="CIF" label="CIF" />
 * ```
 *
 * @example In a table row, with no visible label
 * ```tsx
 * <Radio name="primary-contact" value={contact.id} aria-label={contact.name} />
 * ```
 *
 * @example With a hint
 * ```tsx
 * <Radio name="terms" value="net30" label="Net 30" hint="Standard terms." />
 * ```
 */
export const Radio = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  size: sizeProp,
  className: classNameProp,
  disabled,
  ...remainingProps
}: RadioProps) => {
  const size: RadioSize = sizeProp ?? "4";
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
    <SelectionField
      id={controlProps.id}
      hintId={fieldProps.hintId}
      errorId={fieldProps.errorId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      density={density}
      className={classNameProp}
    >
      <span data-slot="radio" className="relative inline-flex">
        <input
          data-slot="radio-control"
          type="radio"
          disabled={disabled}
          className={SelectionStyles.selectionControlStyle({
            size,
            shape: "dot",
            invalid,
          })}
          {...controlProps}
          {...remainingProps}
        />
        <span
          data-slot="radio-mark"
          // The visibility toggle has to live here rather than on the dot
          // inside: `peer-checked:` compiles to a sibling combinator, which
          // only reaches an element that is itself a sibling of the input.
          className={`${SelectionStyles.selectionMarkStyle()} opacity-0 peer-checked:opacity-100`}
        >
          <span
            data-slot="radio-dot"
            className={
              size === "5"
                ? "size-2 rounded-full bg-current"
                : "size-1.5 rounded-full bg-current"
            }
          />
        </span>
      </span>
    </SelectionField>
  );
};
