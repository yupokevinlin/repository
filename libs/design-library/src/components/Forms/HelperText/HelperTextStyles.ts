import { cva } from "class-variance-authority";

/**
 * A subset of the §4.1 scale. Helper text under a field is either a neutral
 * hint or a problem — `info` and `success` states below an input read as
 * decoration, and there is no field state they describe that `neutral` does
 * not already cover.
 */
export type HelperTextSeverity = "neutral" | "warning" | "error";

export type HelperTextDensity = "comfortable" | "compact";

export const helperTextStyle = cva(["flex items-start gap-1"], {
  variants: {
    severity: {
      neutral: "text-fg-muted",
      warning: "text-fg-warning-default",
      error: "text-fg-error-default",
    },
    density: {
      comfortable: "text-body-sm",
      compact: "text-body-xs",
    },
  },
  defaultVariants: {
    severity: "neutral",
    density: "comfortable",
  },
});

/** Sized in `em` so it tracks the density step without a second variant. */
export const iconStyle = cva(["size-[1em] shrink-0 translate-y-[0.15em]"]);

export const HelperTextStyles = {
  helperTextStyle,
  iconStyle,
};
