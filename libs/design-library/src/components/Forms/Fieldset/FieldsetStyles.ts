import { cva } from "class-variance-authority";

export type FieldsetDensity = "comfortable" | "compact";

/**
 * `min-w-0` because a `<fieldset>` has a UA `min-width: min-content` that
 * ignores flex and grid sizing — without it a fieldset in a grid column
 * refuses to shrink and overflows its track.
 */
export const fieldsetStyle = cva(["flex min-w-0 flex-col border-0 p-0 m-0"], {
  variants: {
    density: {
      comfortable: "gap-3",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

export const legendStyle = cva(
  [
    "inline-flex items-center gap-1 p-0",
    "text-fg-default font-medium",
    "group-disabled:text-fg-disabled",
  ],
  {
    variants: {
      density: {
        comfortable: "text-label-md",
        compact: "text-label-sm",
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
