import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { type FieldsetDensity, FieldsetStyles } from "./FieldsetStyles";

export type FieldsetOrientation = "vertical" | "horizontal";

export const fieldsetDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<FieldsetDensity>;

export const fieldsetOrientations = [
  "vertical",
  "horizontal",
] as const satisfies Array<FieldsetOrientation>;

export type { FieldsetDensity };

export type FieldsetProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "children"
> & {
  /**
   * What the group is called. Required — a `<fieldset>` with no `<legend>`
   * names nothing, and a screen reader announces the controls inside it with
   * no idea what they have in common.
   */
  legend: ReactNode;
  /** The controls. */
  children: ReactNode;
  /**
   * Disables every control inside, natively. This is the one place a group
   * really can turn off its children — no cloning, no context, just the
   * `<fieldset>` element doing what it has always done.
   */
  disabled?: boolean;
  /** Adds the required marker to the legend. */
  required?: boolean;
  /** What the marker means, in words. Defaults to `"(required)"`. */
  requiredLabel?: string;
  /** Which way the controls run. Defaults to `"vertical"`. */
  orientation?: FieldsetOrientation;
  /** Tightens the gaps. Never changes a control's height (§4.2). */
  density?: FieldsetDensity;
};

/**
 * A named group of related controls — the delivery terms on a deal, a set of
 * radios, a row of filters.
 *
 * A `<label>` cannot point at more than one input, so a group of them needs
 * `<fieldset>` + `<legend>` instead (§5.1). That is what `RadioGroup`,
 * `CheckboxGroup` and `ToggleGroup` render internally; this is the standalone
 * primitive for grouping controls by hand.
 *
 * `disabled` is the native attribute, so every control inside really is
 * disabled — no cloning children and no context, which is the whole reason to
 * use a real `<fieldset>` rather than a `<div>` with a heading.
 *
 * @server-safe
 *
 * @example A group of controls
 * ```tsx
 * <Fieldset legend="Delivery terms">
 *   <TextInput label="Incoterm" />
 *   <TextInput label="Port" />
 * </Fieldset>
 * ```
 *
 * @example Locked while the record is read-only
 * ```tsx
 * <Fieldset legend="Delivery terms" disabled={deal.settled}>
 *   <TextInput label="Incoterm" />
 * </Fieldset>
 * ```
 *
 * @example A filter bar, laid out in a row and tightened
 * ```tsx
 * <Fieldset legend="Filters" orientation="horizontal" density="compact">
 *   <Select label="Status" options={statuses} />
 *   <Select label="Desk" options={desks} />
 * </Fieldset>
 * ```
 */
export const Fieldset = ({
  legend,
  children,
  disabled,
  required,
  requiredLabel: requiredLabelProp,
  orientation: orientationProp,
  density: densityProp,
  className: classNameProp,
  ...remainingProps
}: FieldsetProps) => {
  const orientation: FieldsetOrientation = orientationProp ?? "vertical";
  const density: FieldsetDensity = densityProp ?? "comfortable";
  const requiredLabel: string = requiredLabelProp ?? "(required)";

  return (
    <fieldset
      data-slot="fieldset"
      disabled={disabled}
      // `group` so the legend can grey with the fieldset — a <legend> is not a
      // form control, so :disabled never matches it.
      className={cn("group", FieldsetStyles.fieldsetStyle(), classNameProp)}
      {...remainingProps}
    >
      <legend
        data-slot="fieldset-legend"
        className={FieldsetStyles.legendStyle({ density })}
      >
        <span data-slot="fieldset-legend-text">{legend}</span>
        {required === true && (
          <>
            <span
              data-slot="fieldset-required-marker"
              className={FieldsetStyles.requiredMarkerStyle()}
              aria-hidden="true"
            >
              {"*"}
            </span>
            <span data-slot="fieldset-required-text" className="sr-only">
              {requiredLabel}
            </span>
          </>
        )}
      </legend>
      <div
        data-slot="fieldset-content"
        className={FieldsetStyles.contentStyle({ orientation, density })}
      >
        {children}
      </div>
    </fieldset>
  );
};
