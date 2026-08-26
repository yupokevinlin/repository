import { cva } from "class-variance-authority";

/**
 * A subset of the §4.1 scale. `neutral` is deliberately absent: an advisory
 * with no severity is not an alert, it is text.
 */
export type AlertSeverity = "info" | "success" | "warning" | "error";

export const alertStyle = cva(
  [
    "flex w-full items-start gap-[0.75rem]",
    "rounded-md border border-l-4 p-[0.875rem]",
  ],
  {
    variants: {
      severity: {
        info: "border-border-info bg-bg-info-soft",
        success: "border-border-success bg-bg-success-soft",
        warning: "border-border-warning bg-bg-warning-soft",
        error: "border-border-error bg-bg-error-soft",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  },
);

export const iconStyle = cva(["mt-[0.125rem] size-4 shrink-0"], {
  variants: {
    severity: {
      info: "text-fg-info-default",
      success: "text-fg-success-default",
      warning: "text-fg-warning-default",
      error: "text-fg-error-default",
    },
  },
  defaultVariants: {
    severity: "info",
  },
});

export const titleStyle = cva(["text-label-lg font-semibold"], {
  variants: {
    severity: {
      info: "text-fg-info-default",
      success: "text-fg-success-default",
      warning: "text-fg-warning-default",
      error: "text-fg-error-default",
    },
  },
  defaultVariants: {
    severity: "info",
  },
});

export const contentStyle = cva(["flex min-w-0 flex-1 flex-col gap-[0.25rem]"]);

export const bodyStyle = cva(["text-fg-default text-body-sm"]);

export const actionsStyle = cva([
  "flex shrink-0 items-center gap-[0.5rem] pt-[0.125rem]",
]);

export const AlertStyles = {
  alertStyle,
  iconStyle,
  titleStyle,
  contentStyle,
  bodyStyle,
  actionsStyle,
};
