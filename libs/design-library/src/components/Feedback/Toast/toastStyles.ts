import { cva } from "class-variance-authority";

/**
 * The full §4.1 scale, unlike `Alert`. A toast with no severity is a plain
 * confirmation — "Saved" — which is the most common one there is.
 */
export type ToastSeverity =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export const toastSeverities = [
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const satisfies Array<ToastSeverity>;

export const toastPlacements = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const satisfies Array<ToastPlacement>;

export const viewportStyle = cva(
  [
    "pointer-events-none fixed z-[60] flex w-[22rem] max-w-[calc(100vw-2rem)]",
    "flex-col gap-2 p-4",
  ],
  {
    variants: {
      placement: {
        "top-left": "left-0 top-0",
        "top-center": "left-1/2 top-0 -translate-x-1/2",
        "top-right": "right-0 top-0",
        // Reversed, so the oldest stays anchored to the bottom edge and each
        // new one appears above it. Stacking the other way would shove the
        // toast the user is already reading out from under their eyes.
        "bottom-left": "bottom-0 left-0 flex-col-reverse",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse",
        "bottom-right": "bottom-0 right-0 flex-col-reverse",
      },
    },
    defaultVariants: {
      placement: "bottom-right",
    },
  },
);

export const toastStyle = cva(
  [
    // The viewport ignores the pointer so the page underneath stays clickable;
    // each toast takes it back for itself.
    "pointer-events-auto flex w-full items-start gap-3",
    "rounded-md border border-l-4 p-3 shadow-lg",
    "bg-bg-default text-fg-default",
  ],
  {
    variants: {
      severity: {
        neutral: "border-border-default border-l-border-strong",
        info: "border-border-info bg-bg-info-soft",
        success: "border-border-success bg-bg-success-soft",
        warning: "border-border-warning bg-bg-warning-soft",
        error: "border-border-error bg-bg-error-soft",
      },
    },
    defaultVariants: {
      severity: "neutral",
    },
  },
);

export const iconStyle = cva(["mt-[0.125rem] size-4 shrink-0"], {
  variants: {
    severity: {
      neutral: "text-fg-muted",
      info: "text-fg-info-default",
      success: "text-fg-success-default",
      warning: "text-fg-warning-default",
      error: "text-fg-error-default",
    },
  },
  defaultVariants: {
    severity: "neutral",
  },
});

export const titleStyle = cva(["text-label-lg font-semibold"], {
  variants: {
    severity: {
      neutral: "text-fg-default",
      info: "text-fg-info-default",
      success: "text-fg-success-default",
      warning: "text-fg-warning-default",
      error: "text-fg-error-default",
    },
  },
  defaultVariants: {
    severity: "neutral",
  },
});

export const contentStyle = cva(["flex min-w-0 flex-1 flex-col gap-1"]);

export const descriptionStyle = cva(["text-body-sm text-fg-default"]);

export const actionStyle = cva(["mt-1 flex items-center gap-2"]);

export const ToastStyles = {
  viewportStyle,
  toastStyle,
  iconStyle,
  titleStyle,
  contentStyle,
  descriptionStyle,
  actionStyle,
};
