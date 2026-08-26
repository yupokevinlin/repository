import { cva } from "class-variance-authority";

/** From the §4.1 severity scale. */
export type ProgressBarSeverity =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

/** Bar thickness, from the §4 "bars and rules" group. `"1"` = 4px, `"2"` = 8px. */
export type ProgressBarSize = "1" | "2";

export const trackStyle = cva(
  ["w-full overflow-hidden rounded-full bg-bg-active"],
  {
    variants: {
      size: {
        "1": "h-1",
        "2": "h-2",
      },
    },
    defaultVariants: {
      size: "2",
    },
  },
);

export const fillStyle = cva(["h-full rounded-full"], {
  variants: {
    severity: {
      // No `bg-neutral` family exists, so neutral borrows a foreground token.
      neutral: "bg-fg-subtle",
      info: "bg-bg-info",
      success: "bg-bg-success",
      warning: "bg-bg-warning",
      error: "bg-bg-error",
    },
    indeterminate: {
      true: "w-1/4 animate-progress-indeterminate motion-reduce:animate-none motion-reduce:w-full",
      // Width comes from an inline style, so the transition is what makes a
      // value change read as movement rather than a jump.
      false:
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
    },
  },
  defaultVariants: {
    severity: "info",
    indeterminate: false,
  },
});

export const headerStyle = cva([
  "flex w-full items-baseline justify-between gap-[0.75rem] pb-[0.375rem]",
]);

export const labelStyle = cva(["text-fg-default text-label-sm"]);

export const valueLabelStyle = cva([
  "text-fg-muted font-mono text-micro-lg tabular-nums",
]);

export const ProgressBarStyles = {
  trackStyle,
  fillStyle,
  headerStyle,
  labelStyle,
  valueLabelStyle,
};
