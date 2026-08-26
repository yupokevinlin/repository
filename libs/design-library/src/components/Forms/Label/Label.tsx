import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { type LabelDensity, LabelStyles } from "./LabelStyles";

export const labelDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<LabelDensity>;

export type { LabelDensity };

export type LabelProps = Omit<ComponentPropsWithRef<"label">, "children"> & {
  /** The field's name. */
  children: ReactNode;
  /**
   * The id of the control this labels. Required — a `<label>` with no `for`
   * is a label for nothing, and clicking it does not focus the field.
   */
  htmlFor: string;
  /** Adds the required marker. The control sets `aria-required` itself. */
  required?: boolean;
  /**
   * What the marker means, for a screen reader. The asterisk is decorative
   * and is announced as "star" or skipped entirely.
   */
  requiredLabel?: string;
  /**
   * Marks the field optional in words instead. Use one convention per form:
   * mark what is required, or mark what is optional, never both.
   */
  optionalText?: ReactNode;
  /** Tightens the type step. Never changes the control's height (§4.2). */
  density?: LabelDensity;
};

/**
 * A field's name, tied to its control.
 *
 * Most of the time you will not reach for this: every form control renders its
 * own `<label>` from its `label` prop (§5.1), which makes the association
 * impossible to break. This is the standalone primitive for the cases with no
 * full field around them — a table-cell editor, a filter bar.
 *
 * Never use a placeholder as a label. It disappears the moment the user types,
 * takes the field out of reach of a screen reader's forms list, and leaves
 * nobody able to check what they entered.
 *
 * @server-safe
 *
 * @example A filter-bar control
 * ```tsx
 * <Label htmlFor="status-filter">Status</Label>
 * <Select id="status-filter" options={statuses} />
 * ```
 *
 * @example Required, with the marker explained
 * ```tsx
 * <Label htmlFor="deal-number" required requiredLabel="(required)">
 *   Deal number
 * </Label>
 * ```
 *
 * @example Marking the optional one instead, in a form of mostly required fields
 * ```tsx
 * <Label htmlFor="notes" optionalText="Optional">Notes</Label>
 * ```
 */
export const Label = ({
  children,
  htmlFor,
  required,
  requiredLabel: requiredLabelProp,
  optionalText,
  density: densityProp,
  className: classNameProp,
  ...remainingProps
}: LabelProps) => {
  const density: LabelDensity = densityProp ?? "comfortable";
  const requiredLabel: string = requiredLabelProp ?? "(required)";

  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(LabelStyles.labelStyle({ density }), classNameProp)}
      {...remainingProps}
    >
      <span data-slot="label-text">{children}</span>
      {required === true && (
        <>
          <span
            data-slot="label-required-marker"
            className={LabelStyles.requiredMarkerStyle()}
            aria-hidden="true"
          >
            {"*"}
          </span>{" "}
          <span data-slot="label-required-text" className="sr-only">
            {requiredLabel}
          </span>
        </>
      )}
      {optionalText !== undefined && (
        <span
          data-slot="label-optional-text"
          className={LabelStyles.optionalTextStyle()}
        >
          {optionalText}
        </span>
      )}
    </label>
  );
};
