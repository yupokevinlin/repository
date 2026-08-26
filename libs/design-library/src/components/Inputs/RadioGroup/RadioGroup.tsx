import type { KeyboardEvent, ReactNode } from "react";
import { useId, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { Fieldset } from "../../Forms/Fieldset";
import { HelperText } from "../../Forms/HelperText";
import { Radio } from "../Radio";
import type { InputDensity } from "../shared/inputSurfaceStyles";
import { inputDensities } from "../shared/inputSurfaceStyles";

export const radioGroupDensities = inputDensities;

export type RadioGroupDensity = InputDensity;

export type RadioGroupOrientation = "vertical" | "horizontal";

export const radioGroupOrientations = [
  "vertical",
  "horizontal",
] as const satisfies Array<RadioGroupOrientation>;

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** What the set is called. Rendered as a `<legend>`. */
  legend: ReactNode;
  /** The options. */
  options: Array<RadioGroupOption>;
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Fires with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Shared `name`. One is generated when omitted. */
  name?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  orientation?: RadioGroupOrientation;
  density?: RadioGroupDensity;
  className?: string;
}

/**
 * A named set of radios — exactly one selected.
 *
 * Renders `<fieldset>` + `<legend>` (§5.1) and follows the APG radio-group
 * pattern: the arrow keys move **and** select in one step, Tab enters and
 * leaves the whole group rather than stepping through every option.
 *
 * That is not the same as a list of bare radios. Native radios already do most
 * of this, but only once they share a `name` and are in the same document
 * order — this makes the grouping explicit, generates the shared name, and
 * keeps the roving tabindex correct when options are disabled.
 *
 * Selection follows focus here, which is right for radios and wrong for tabs:
 * moving to an option *is* choosing it. If a user needs to look before
 * committing, this is the wrong control.
 *
 * @client
 *
 * @example Choosing terms
 * ```tsx
 * <RadioGroup
 *   legend="Payment terms"
 *   options={termOptions}
 *   value={terms}
 *   onValueChange={setTerms}
 * />
 * ```
 *
 * @example In a row, tightened
 * ```tsx
 * <RadioGroup
 *   legend="Incoterm"
 *   options={incoterms}
 *   orientation="horizontal"
 *   density="compact"
 * />
 * ```
 *
 * @example Required, with an error
 * ```tsx
 * <RadioGroup
 *   legend="Incoterm"
 *   options={incoterms}
 *   required
 *   error="Choose an incoterm before booking."
 * />
 * ```
 */
export const RadioGroup = ({
  legend,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  hint,
  error,
  required,
  disabled,
  orientation,
  density,
  className,
}: RadioGroupProps) => {
  const generatedName: string = useId();
  const name: string = nameProp ?? generatedName;

  const [value, setValue] = useControllableState<string>(
    valueProp,
    defaultValue ?? "",
    onValueChange,
  );

  const hasHint: boolean = hint !== undefined && hint !== null;
  const hasError: boolean = error !== undefined && error !== null;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const enabled: Array<RadioGroupOption> = options.filter(
    (option: RadioGroupOption) => option.disabled !== true,
  );

  /**
   * The one option Tab can reach. Native radios do this themselves once one is
   * selected, but an empty group would otherwise have every option tabbable.
   */
  const tabbableValue: string =
    enabled.find((option: RadioGroupOption) => option.value === value)?.value ??
    enabled[0]?.value ??
    "";

  const moveTo = (index: number): void => {
    const option: RadioGroupOption | undefined = enabled[index];
    if (option === undefined) {
      return;
    }
    setValue(option.value);
    containerRef.current
      ?.querySelector<HTMLInputElement>(`input[value="${option.value}"]`)
      ?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFieldSetElement>): void => {
    const currentIndex: number = enabled.findIndex(
      (option: RadioGroupOption) => option.value === value,
    );
    const from: number = currentIndex === -1 ? 0 : currentIndex;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        moveTo((from + 1) % enabled.length);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        moveTo((from - 1 + enabled.length) % enabled.length);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(enabled.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div data-slot="radio-group" className={className} ref={containerRef}>
      <Fieldset
        // role="radiogroup" rather than the fieldset's implicit "group": the
        // APG pattern names this widget, and it is what puts the arrow-key
        // handling on an element that actually claims to be interactive.
        role="radiogroup"
        onKeyDown={onKeyDown}
        legend={legend}
        required={required}
        disabled={disabled}
        orientation={orientation}
        density={density}
      >
        {options.map((option: RadioGroupOption) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            hint={option.hint}
            disabled={option.disabled}
            density={density}
            checked={value === option.value}
            tabIndex={option.value === tabbableValue ? 0 : -1}
            aria-invalid={hasError ? true : undefined}
            onChange={() => {
              setValue(option.value);
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
