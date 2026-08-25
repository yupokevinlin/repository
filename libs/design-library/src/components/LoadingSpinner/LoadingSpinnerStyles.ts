import { cva } from "class-variance-authority";

export type LoadingSpinnerVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "default"
  | "destructive";

export type LoadingSpinnerSize = "4" | "5" | "6";

export const spinnerStyle = cva(["animate-spin shrink-0"], {
  variants: {
    size: {
      "4": "size-4",
      "5": "size-5",
      "6": "size-6",
    },
    variant: {
      primary: "text-fg-primary-default",
      secondary: "text-fg-secondary-default",
      tertiary: "text-fg-tertiary-default",
      default: "text-fg-default",
      destructive: "text-fg-error-default",
    },
  },
  defaultVariants: {
    size: "5",
    variant: "default",
  },
});

export const LoadingSpinnerStyles = { spinnerStyle };
