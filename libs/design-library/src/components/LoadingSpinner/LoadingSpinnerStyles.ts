import { cva } from "class-variance-authority";

export type LoadingSpinnerVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "default"
  | "destructive";

export const spinnerStyle = cva(["animate-spin shrink-0"], {
  variants: {
    variant: {
      primary: "text-fg-primary-default",
      secondary: "text-fg-secondary-default",
      tertiary: "text-fg-tertiary-default",
      default: "text-fg-default",
      destructive: "text-fg-error-default",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const LoadingSpinnerStyles = { spinnerStyle };
