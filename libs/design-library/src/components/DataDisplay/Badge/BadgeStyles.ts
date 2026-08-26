import { cva } from "class-variance-authority";

/**
 * Semantic state, from the §4.1 scale. `neutral` is the absence of state, not
 * a sixth colour.
 */
export type BadgeSeverity =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

/** Fill style. Orthogonal to severity — every combination is valid. */
export type BadgeAppearance = "solid" | "soft" | "outline";

/** Inline-element scale from §4. `"5"` = 20px, `"6"` = 24px. */
export type BadgeSize = "5" | "6";

/**
 * Severity and appearance are separate axes, so the colour lives in
 * compoundVariants rather than in either one alone. `neutral` maps onto the
 * global tokens, which have no severity family of their own.
 */
export const badgeStyle = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-full font-medium whitespace-nowrap",
    "border border-transparent",
  ],
  {
    variants: {
      severity: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        error: "",
      },
      appearance: {
        solid: "",
        soft: "",
        outline: "bg-transparent",
      },
      size: {
        "5": "h-5 min-w-5 px-2 gap-1 text-micro-lg",
        "6": "h-6 min-w-6 px-2.5 gap-1.5 text-label-sm",
      },
    },
    compoundVariants: [
      // neutral — global tokens, no severity family
      {
        severity: "neutral",
        appearance: "solid",
        class: "bg-bg-active text-fg-default",
      },
      {
        severity: "neutral",
        appearance: "soft",
        class: "bg-bg-hover text-fg-muted",
      },
      {
        severity: "neutral",
        appearance: "outline",
        class: "border-border-default text-fg-default",
      },

      // info
      {
        severity: "info",
        appearance: "solid",
        class: "bg-bg-info text-fg-info",
      },
      {
        severity: "info",
        appearance: "soft",
        class: "bg-bg-info-soft text-fg-info-default",
      },
      {
        severity: "info",
        appearance: "outline",
        class: "border-border-info text-fg-info-default",
      },

      // success
      {
        severity: "success",
        appearance: "solid",
        class: "bg-bg-success text-fg-success",
      },
      {
        severity: "success",
        appearance: "soft",
        class: "bg-bg-success-soft text-fg-success-default",
      },
      {
        severity: "success",
        appearance: "outline",
        class: "border-border-success text-fg-success-default",
      },

      // warning
      {
        severity: "warning",
        appearance: "solid",
        class: "bg-bg-warning text-fg-warning",
      },
      {
        severity: "warning",
        appearance: "soft",
        class: "bg-bg-warning-soft text-fg-warning-default",
      },
      {
        severity: "warning",
        appearance: "outline",
        class: "border-border-warning text-fg-warning-default",
      },

      // error
      {
        severity: "error",
        appearance: "solid",
        class: "bg-bg-error text-fg-error",
      },
      {
        severity: "error",
        appearance: "soft",
        class: "bg-bg-error-soft text-fg-error-default",
      },
      {
        severity: "error",
        appearance: "outline",
        class: "border-border-error text-fg-error-default",
      },
    ],
    defaultVariants: {
      severity: "neutral",
      appearance: "soft",
      size: "6",
    },
  },
);

/** The leading dot. Takes its colour from the badge's own text colour. */
export const dotStyle = cva(["rounded-full bg-current shrink-0"], {
  variants: {
    size: {
      "5": "size-1.5",
      "6": "size-2",
    },
  },
  defaultVariants: {
    size: "6",
  },
});

/** Icons sit at the badge's own optical size. */
export const iconStyle = cva(["shrink-0 inline-flex items-center"], {
  variants: {
    size: {
      "5": "size-3",
      "6": "size-3.5",
    },
  },
  defaultVariants: {
    size: "6",
  },
});

export const BadgeStyles = { badgeStyle, dotStyle, iconStyle };
