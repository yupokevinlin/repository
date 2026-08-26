import type { ComponentPropsWithRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { focusRingStyle } from "../../../tailwind/focus/focusRing";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { useFieldShell } from "../../Forms/FieldShell/FieldShell";
import type { InputDensity } from "../shared/inputSurfaceStyles";
import { inputDensities } from "../shared/inputSurfaceStyles";
import { SelectionField } from "../shared/SelectionField";

export type SwitchSize = "5" | "6";

export const switchSizes = ["5", "6"] as const satisfies Array<SwitchSize>;
export const switchDensities = inputDensities;

export type SwitchDensity = InputDensity;

export type SwitchProps = Omit<
  ComponentPropsWithRef<"button">,
  "id" | "type" | "onChange" | "value"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** Controlled state. Pair with `onCheckedChange`. */
    checked?: boolean;
    /** Initial state when uncontrolled. Defaults to `false`. */
    defaultChecked?: boolean;
    /** Fires on every change, in both controlled and uncontrolled mode. */
    onCheckedChange?: (checked: boolean) => void;
    /** Track height. `"5"` = 20px, `"6"` = 24px. Defaults to `"5"`. */
    size?: SwitchSize;
  };

/**
 * An on/off setting that takes effect immediately.
 *
 * `role="switch"`, not a checkbox. The two are announced differently — "on"
 * and "off" rather than "checked" and "unchecked" — and the difference is
 * real: a switch acts the moment it is flipped, while a checkbox states an
 * intention that a Save button later applies. If the change needs submitting,
 * it is a `Checkbox`.
 *
 * Rendered as a `<button>` rather than a styled checkbox, because that is
 * what `role="switch"` expects: Space and Enter both activate it, which is the
 * button contract rather than the checkbox one.
 *
 * @client
 *
 * @example A setting that applies at once
 * ```tsx
 * <Switch label="Email me on settlement" checked={on} onCheckedChange={save} />
 * ```
 *
 * @example Uncontrolled, with a hint
 * ```tsx
 * <Switch
 *   label="Auto-hedge"
 *   defaultChecked
 *   hint="Places the offsetting trade as soon as the deal is booked."
 * />
 * ```
 *
 * @example Locked while the record is read-only
 * ```tsx
 * <Switch label="Auto-hedge" checked={deal.autoHedge} disabled />
 * ```
 */
export const Switch = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  size: sizeProp,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  className: classNameProp,
  disabled,
  onClick,
  ...remainingProps
}: SwitchProps) => {
  const size: SwitchSize = sizeProp ?? "5";
  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });

  const [checked, setChecked] = useControllableState<boolean>(
    checkedProp,
    defaultChecked ?? false,
    onCheckedChange,
  );

  const trackSize: string = size === "6" ? "h-6 w-11" : "h-5 w-9";
  const thumbSize: string = size === "6" ? "size-5" : "size-4";
  const thumbTravel: string =
    size === "6"
      ? checked
        ? "translate-x-5"
        : "translate-x-0.5"
      : checked
        ? "translate-x-4"
        : "translate-x-0.5";

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
      <button
        data-slot="switch"
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full",
          "transition-colors duration-150 cursor-pointer",
          "disabled:cursor-not-allowed disabled:bg-bg-disabled",
          checked ? "bg-bg-primary" : "bg-bg-active",
          trackSize,
          focusRingStyle,
          "focus-visible:outline-border-primary",
        )}
        onClick={(event) => {
          setChecked(!checked);
          onClick?.(event);
        }}
        {...controlProps}
        {...remainingProps}
      >
        <span
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none rounded-full bg-bg-default shadow-sm",
            "transition-transform duration-150 motion-reduce:transition-none",
            thumbSize,
            thumbTravel,
          )}
        />
      </button>
    </SelectionField>
  );
};
