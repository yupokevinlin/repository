import type { ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { HelperText } from "../../Forms/HelperText";
import type { InputDensity } from "./inputSurfaceStyles";

export interface SelectionFieldProps {
  /** The control itself — a checkbox, radio, switch or toggle. */
  children: ReactNode;
  /** The label text, sitting beside the control. */
  label?: ReactNode;
  /** Helper text below the row. */
  hint?: ReactNode;
  /** Error text below the row. Its presence implies `aria-invalid`. */
  error?: ReactNode;
  /** Ids from `useFieldShell`, so `aria-describedby` lands somewhere. */
  hintId: string;
  errorId: string;
  /** The control's id, for the label's `for`. */
  id: string;
  /** Adds the required marker beside the label. */
  required?: boolean;
  /** What the marker means, in words. Defaults to `"(required)"`. */
  requiredLabel?: string;
  density?: InputDensity;
  className?: string;
}

/**
 * The markup around a control whose label sits **beside** it rather than
 * above — checkbox, radio, switch, toggle.
 *
 * `FieldShell` stacks its label on top, which is right for a text field and
 * wrong for a checkbox: a tick with its name above it reads as a heading over
 * an unlabelled box. This is the same idea with the label on the same line,
 * and hint and error still below the row.
 *
 * Internal, like `FieldShell` — no barrel entry, no gallery, no story. Shared
 * by four controls so their spacing and hit areas cannot drift apart.
 *
 * The whole row is one `<label>`, so the text is part of the control's hit
 * area. A tick box alone is a 16px target; with its label it is the width of
 * the row, which matters far more on a touch screen than it looks on a desk.
 *
 * @client
 */
export const SelectionField = ({
  children,
  label,
  hint,
  error,
  hintId,
  errorId,
  id,
  required,
  requiredLabel: requiredLabelProp,
  density: densityProp,
  className,
}: SelectionFieldProps) => {
  const density: InputDensity = densityProp ?? "comfortable";
  const requiredLabel: string = requiredLabelProp ?? "(required)";
  const hasHint: boolean = hint !== undefined && hint !== null;
  const hasError: boolean = error !== undefined && error !== null;
  const hasLabel: boolean = label !== undefined && label !== null;

  return (
    <div
      data-slot="selection-field"
      className={cn(
        "flex min-w-0 flex-col",
        density === "compact" ? "gap-0.5" : "gap-1",
        className,
      )}
    >
      {hasLabel ? (
        <label
          data-slot="selection-field-label"
          htmlFor={id}
          className={cn(
            "inline-flex cursor-pointer items-center select-none",
            "text-fg-default has-[:disabled]:cursor-not-allowed has-[:disabled]:text-fg-disabled",
            density === "compact"
              ? "gap-1.5 text-label-sm"
              : "gap-2 text-label-md",
          )}
        >
          {children}
          <span data-slot="selection-field-label-text">{label}</span>
          {required === true && (
            <>
              <span
                data-slot="selection-field-required-marker"
                className="text-fg-error-default"
                aria-hidden="true"
              >
                {"*"}
              </span>{" "}
              <span
                data-slot="selection-field-required-text"
                className="sr-only"
              >
                {requiredLabel}
              </span>
            </>
          )}
        </label>
      ) : (
        children
      )}
      {hasHint && (
        <HelperText id={hintId} density={density}>
          {hint}
        </HelperText>
      )}
      {hasError && (
        <HelperText id={errorId} severity="error" density={density} live>
          {error}
        </HelperText>
      )}
    </div>
  );
};
