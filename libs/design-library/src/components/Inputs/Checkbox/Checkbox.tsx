import type { ComponentPropsWithRef } from "react";
import { useEffect, useRef } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
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

export const checkboxSizes = selectionSizes;
export const checkboxDensities = inputDensities;

export type CheckboxSize = SelectionSize;
export type CheckboxDensity = InputDensity;

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "id" | "size" | "type"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** `"4"` = 16px, `"5"` = 20px. Defaults to `"4"`. */
    size?: CheckboxSize;
    /**
     * Neither checked nor unchecked — a parent whose children are partly
     * selected. Sets the native `indeterminate` property and
     * `aria-checked="mixed"`.
     */
    indeterminate?: boolean;
  };

/**
 * A single tick box — the atom.
 *
 * This is one checkbox, not a set of them. A named group with an array value
 * is `CheckboxGroup`, which renders `<fieldset>` + `<legend>` because a
 * `<label>` cannot point at more than one input.
 *
 * Indeterminate is a real state, not a third value: the native
 * `indeterminate` property plus `aria-checked="mixed"`. It is what a
 * select-all box shows when some rows are ticked, and it cannot be set by the
 * user — only by the code that knows about the children.
 *
 * The input keeps its own painting via `appearance-none` rather than being
 * hidden behind a drawn stand-in, so native focus, form participation and the
 * label association all still work.
 *
 * @client
 *
 * @example A single option
 * ```tsx
 * <Checkbox label="Include settled deals" checked={value} onChange={onChange} />
 * ```
 *
 * @example A select-all, partly ticked
 * ```tsx
 * <Checkbox
 *   label="Select all"
 *   checked={all}
 *   indeterminate={some && !all}
 *   onChange={onToggleAll}
 * />
 * ```
 *
 * @example Required, with the reason underneath
 * ```tsx
 * <Checkbox
 *   label="I confirm the terms"
 *   required
 *   error="You must confirm before submitting."
 * />
 * ```
 */
export const Checkbox = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  size: sizeProp,
  indeterminate,
  className: classNameProp,
  disabled,
  checked,
  ref,
  ...remainingProps
}: CheckboxProps) => {
  const size: CheckboxSize = sizeProp ?? "4";
  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const internalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // `indeterminate` is a property, not an attribute — there is no way to
    // set it from JSX, so it has to be written to the node.
    if (internalRef.current !== null) {
      internalRef.current.indeterminate = indeterminate === true;
    }
  }, [indeterminate]);

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
      <span data-slot="checkbox" className="relative inline-flex">
        <input
          data-slot="checkbox-control"
          type="checkbox"
          disabled={disabled}
          checked={checked}
          aria-checked={indeterminate === true ? "mixed" : undefined}
          className={SelectionStyles.selectionControlStyle({
            size,
            shape: "box",
            invalid,
          })}
          ref={(element: HTMLInputElement | null) => {
            internalRef.current = element;
            if (typeof ref === "function") {
              ref(element);
            } else if (ref !== null && ref !== undefined) {
              ref.current = element;
            }
          }}
          {...controlProps}
          {...remainingProps}
        />
        <span
          data-slot="checkbox-mark"
          // The visibility toggle has to live here rather than on the svg
          // inside: `peer-checked:` compiles to a sibling combinator, which
          // only reaches an element that is itself a sibling of the input.
          className={cn(
            SelectionStyles.selectionMarkStyle(),
            indeterminate === true ? "" : "opacity-0 peer-checked:opacity-100",
          )}
        >
          {indeterminate === true ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-full"
            >
              <path d="M4 8h8" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-full"
            >
              <path d="M3.5 8.5l3 3 6-6" />
            </svg>
          )}
        </span>
      </span>
    </SelectionField>
  );
};
