import type { ReactNode } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { Fieldset } from "../../Forms/Fieldset";
import { HelperText } from "../../Forms/HelperText";
import { Checkbox } from "../Checkbox";
import type { InputDensity } from "../shared/inputSurfaceStyles";
import { inputDensities } from "../shared/inputSurfaceStyles";

export const checkboxGroupDensities = inputDensities;

export type CheckboxGroupDensity = InputDensity;

export type CheckboxGroupOrientation = "vertical" | "horizontal";

export const checkboxGroupOrientations = [
  "vertical",
  "horizontal",
] as const satisfies Array<CheckboxGroupOrientation>;

export interface CheckboxGroupOption {
  /** The value contributed to the array when ticked. */
  value: string;
  /** What the option is called. */
  label: ReactNode;
  /** Helper text under this one option. */
  hint?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** What the set is called. Rendered as a `<legend>`. */
  legend: ReactNode;
  /** The options. */
  options: Array<CheckboxGroupOption>;
  /** Controlled value — the ticked values. Pair with `onValueChange`. */
  value?: Array<string>;
  /** Initial value when uncontrolled. Defaults to none ticked. */
  defaultValue?: Array<string>;
  /** Fires with the whole array, never with a single value. */
  onValueChange?: (value: Array<string>) => void;
  /** Shared `name`, for a form submission. */
  name?: string;
  /** Helper text for the group as a whole. */
  hint?: ReactNode;
  /** Error text for the group as a whole. */
  error?: ReactNode;
  /** Adds the required marker to the legend. */
  required?: boolean;
  /** Disables every option. */
  disabled?: boolean;
  orientation?: CheckboxGroupOrientation;
  density?: CheckboxGroupDensity;
  className?: string;
}

/**
 * A named set of checkboxes with an array value.
 *
 * Renders `<fieldset>` + `<legend>` rather than a `<label>`, because a label
 * cannot point at more than one input (§5.1). Without that, a row of tick
 * boxes is a set to a sighted user and a pile of unrelated controls to a
 * screen reader.
 *
 * Unlike `RadioGroup` there is no roving tabindex and no arrow-key handling:
 * every checkbox in a group is independently reachable by Tab, which is the
 * APG's checkbox pattern and what browsers already do.
 *
 * The value is always the whole array — ticking one option reports every
 * ticked value, not the one that changed. Callers reconciling a diff want the
 * resulting state, not an event to apply by hand.
 *
 * @client
 *
 * @example Which documents to attach
 * ```tsx
 * <CheckboxGroup
 *   legend="Attach"
 *   options={documentOptions}
 *   value={selected}
 *   onValueChange={setSelected}
 * />
 * ```
 *
 * @example Laid out in a row, in a filter bar
 * ```tsx
 * <CheckboxGroup
 *   legend="Status"
 *   options={statusOptions}
 *   orientation="horizontal"
 *   density="compact"
 * />
 * ```
 *
 * @example Required, with the reason underneath
 * ```tsx
 * <CheckboxGroup
 *   legend="Confirmations"
 *   options={confirmations}
 *   required
 *   error="Confirm at least one before booking."
 * />
 * ```
 */
export const CheckboxGroup = ({
  legend,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  hint,
  error,
  required,
  disabled,
  orientation,
  density,
  className,
}: CheckboxGroupProps) => {
  const [value, setValue] = useControllableState<Array<string>>(
    valueProp,
    defaultValue ?? [],
    onValueChange,
  );

  const hasHint: boolean = hint !== undefined && hint !== null;
  const hasError: boolean = error !== undefined && error !== null;

  const toggle = (optionValue: string, checked: boolean): void => {
    setValue(
      checked
        ? [...value, optionValue]
        : value.filter((current: string) => current !== optionValue),
    );
  };

  return (
    <div data-slot="checkbox-group" className={className}>
      <Fieldset
        legend={legend}
        required={required}
        disabled={disabled}
        orientation={orientation}
        density={density}
      >
        {options.map((option: CheckboxGroupOption) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            hint={option.hint}
            disabled={option.disabled}
            density={density}
            checked={value.includes(option.value)}
            // The group is invalid, not any one option, so the red border
            // would be pointing at the wrong thing.
            aria-invalid={hasError ? true : undefined}
            onChange={(event) => {
              toggle(option.value, event.target.checked);
            }}
          />
        ))}
      </Fieldset>
      {hasHint && (
        <HelperText density={density} className="mt-1">
          {hint}
        </HelperText>
      )}
      {hasError && (
        <HelperText severity="error" density={density} live className="mt-1">
          {error}
        </HelperText>
      )}
    </div>
  );
};
