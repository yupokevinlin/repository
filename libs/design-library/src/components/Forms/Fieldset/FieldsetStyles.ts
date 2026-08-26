import { cva } from "class-variance-authority";

export type FieldsetDensity = "comfortable" | "compact";

/**
 * A plain block, not a flex container.
 *
 * A rendered `<legend>` does not participate in its fieldset's flex layout —
 * browsers lay it out specially — so a `gap` here silently applies to nothing
 * and the legend ends up jammed against the controls. The spacing below the
 * legend is therefore the legend's own margin.
 *
 * `min-w-0` because a `<fieldset>` has a UA `min-width: min-content` that
 * ignores flex and grid sizing — without it a fieldset in a grid column
 * refuses to shrink and overflows its track.
 */
export const fieldsetStyle = cva(["min-w-0 border-0 p-0 m-0"]);

export const legendStyle = cva(
  [
    "inline-flex items-center gap-1 p-0",
    "text-fg-default font-medium",
    "group-disabled:text-fg-disabled",
  ],
  {
    variants: {
      density: {
        comfortable: "text-label-md mb-2",
        compact: "text-label-sm mb-1.5",
      },
    },
    defaultVariants: {
      density: "comfortable",
    },
  },
);

/** The controls themselves, stacked or in a row. */
export const contentStyle = cva(["flex min-w-0"], {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap items-center",
    },
    density: {
      comfortable: "gap-2",
      compact: "gap-1",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", density: "comfortable", class: "gap-4" },
    { orientation: "horizontal", density: "compact", class: "gap-3" },
  ],
  defaultVariants: {
    orientation: "vertical",
    density: "comfortable",
  },
});

export const requiredMarkerStyle = cva(["text-fg-error-default"]);

export const FieldsetStyles = {
  fieldsetStyle,
  legendStyle,
  contentStyle,
  requiredMarkerStyle,
};
