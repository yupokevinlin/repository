import { cva } from "class-variance-authority";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperDensity = "comfortable" | "compact";

/**
 * The five states a step can be in.
 *
 * `revisited` is a step the user has completed and come back to — it is the
 * current step, but the work in it is already done, and telling the user that
 * is the difference between "fill this in" and "check this over".
 *
 * `blocked` is a step that cannot be started yet for a reason outside the
 * sequence — credit approval that has not come back, a document nobody has
 * uploaded. It is not the same as `upcoming`, which is simply not reached yet.
 */
export type StepStatus =
  | "complete"
  | "current"
  | "upcoming"
  | "blocked"
  | "revisited";

export const stepperOrientations = [
  "horizontal",
  "vertical",
] as const satisfies Array<StepperOrientation>;

export const stepperDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<StepperDensity>;

export const stepStatuses = [
  "complete",
  "current",
  "upcoming",
  "blocked",
  "revisited",
] as const satisfies Array<StepStatus>;

export const listStyle = cva(["m-0 flex list-none p-0"], {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
    density: {
      comfortable: "",
      compact: "",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", density: "comfortable", className: "gap-2" },
    { orientation: "horizontal", density: "compact", className: "gap-1" },
    { orientation: "vertical", density: "comfortable", className: "gap-0" },
    { orientation: "vertical", density: "compact", className: "gap-0" },
  ],
  defaultVariants: {
    density: "comfortable",
  },
});

export const itemStyle = cva(["relative flex min-w-0"], {
  variants: {
    orientation: {
      // Horizontal steps share the width evenly, so the connector between
      // them has somewhere to go and the row does not jump about as labels
      // change length.
      horizontal: "flex-1 flex-col items-center text-center",
      vertical: "flex-row gap-3",
    },
    density: {
      comfortable: "",
      compact: "",
    },
  },
  compoundVariants: [
    { orientation: "vertical", density: "comfortable", className: "pb-5" },
    { orientation: "vertical", density: "compact", className: "pb-3" },
  ],
  defaultVariants: {
    density: "comfortable",
  },
});

/** The numbered or ticked circle. */
export const markerStyle = cva(
  [
    "flex size-7 shrink-0 items-center justify-center rounded-full",
    "border text-label-lg font-medium",
  ],
  {
    variants: {
      status: {
        complete: "border-border-success bg-bg-success text-fg-success",
        current: "border-border-primary bg-bg-primary text-fg-primary",
        upcoming: "border-border-default bg-bg-default text-fg-muted",
        blocked:
          "border-border-warning bg-bg-warning-soft text-fg-warning-default",
        revisited:
          "border-border-primary bg-bg-primary-soft text-fg-primary-default",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  },
);

export const contentStyle = cva(["flex min-w-0 flex-col gap-0.5"], {
  variants: {
    orientation: {
      horizontal: "mt-2 items-center",
      vertical: "pt-0.5 items-start text-left",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const labelStyle = cva(["text-label-lg"], {
  variants: {
    status: {
      complete: "text-fg-default",
      current: "font-semibold text-fg-primary-default",
      upcoming: "text-fg-muted",
      blocked: "text-fg-warning-default",
      revisited: "font-semibold text-fg-primary-default",
    },
  },
  defaultVariants: {
    status: "upcoming",
  },
});

export const descriptionStyle = cva(["text-micro-lg text-fg-muted"]);

/**
 * The line from one marker to the next.
 *
 * `border-default` rather than `border-muted`: this line carries the sequence,
 * which is the whole point of a stepper, and muted is Divider's "subtle" —
 * near-white in the light theme and all but invisible at 1px.
 */
export const connectorStyle = cva(["absolute bg-border-default"], {
  variants: {
    orientation: {
      // From the right edge of this marker to the left edge of the next, at
      // the marker's own height so it runs through their centres.
      horizontal:
        "left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-3.5 h-px",
      vertical: "bottom-0 left-3.5 top-8 w-px -translate-x-1/2",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

/**
 * The consumer's link, where a step is one that can be gone back to. Styled
 * by descendant selector (§11.1) rather than by anything being injected.
 */
export const linkStyle = cva([
  "[&_a]:rounded-sm [&_a]:text-inherit [&_a]:no-underline [&_a]:hover:underline",
  "[&_a]:focus:outline-none [&_a]:focus-visible:outline-2",
  "[&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-dashed",
  "[&_a]:focus-visible:outline-border-strong",
]);

export const StepperStyles = {
  listStyle,
  itemStyle,
  markerStyle,
  contentStyle,
  labelStyle,
  descriptionStyle,
  connectorStyle,
  linkStyle,
};
