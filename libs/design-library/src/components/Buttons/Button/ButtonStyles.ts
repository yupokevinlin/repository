import { cva } from "class-variance-authority";

export const buttonStyle = cva(
  [
    "inline-flex items-center justify-center font-medium rounded-md",
    "transition-colors duration-150",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:bg-bg-disabled disabled:text-fg-disabled disabled:border-border-disabled disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        "primary-solid":
          "bg-bg-primary text-fg-primary hover:bg-bg-primary-hover active:bg-bg-primary-active focus-visible:ring-border-primary",
        "primary-soft":
          "bg-bg-primary-soft text-fg-primary-default hover:bg-bg-primary-soft-hover active:bg-bg-primary-soft-active focus-visible:ring-border-primary",
        "primary-outline":
          "border bg-transparent border-border-primary text-fg-primary-default hover:bg-bg-primary-soft active:bg-bg-primary-soft-hover focus-visible:ring-border-primary",
        "secondary-solid":
          "bg-bg-secondary text-fg-secondary hover:bg-bg-secondary-hover active:bg-bg-secondary-active focus-visible:ring-border-secondary",
        "secondary-soft":
          "bg-bg-secondary-soft text-fg-secondary-default hover:bg-bg-secondary-soft-hover active:bg-bg-secondary-soft-active focus-visible:ring-border-secondary",
        "secondary-outline":
          "border bg-transparent border-border-secondary text-fg-secondary-default hover:bg-bg-secondary-soft active:bg-bg-secondary-soft-hover focus-visible:ring-border-secondary",
        "tertiary-solid":
          "bg-bg-tertiary text-fg-tertiary hover:bg-bg-tertiary-hover active:bg-bg-tertiary-active focus-visible:ring-border-tertiary",
        "tertiary-soft":
          "bg-bg-tertiary-soft text-fg-tertiary-default hover:bg-bg-tertiary-soft-hover active:bg-bg-tertiary-soft-active focus-visible:ring-border-tertiary",
        "tertiary-outline":
          "border bg-transparent border-border-tertiary text-fg-tertiary-default hover:bg-bg-tertiary-soft active:bg-bg-tertiary-soft-hover focus-visible:ring-border-tertiary",
        "default-solid":
          "bg-bg-hover text-fg-default hover:bg-bg-active active:bg-bg-active focus-visible:ring-border-strong",
        "default-soft":
          "bg-bg-default text-fg-default hover:bg-bg-hover active:bg-bg-active focus-visible:ring-border-default",
        "default-outline":
          "border bg-transparent border-border-default text-fg-default hover:bg-bg-hover active:bg-bg-active focus-visible:ring-border-strong",
        "destructive-solid":
          "bg-bg-error text-fg-error hover:bg-bg-error-hover active:bg-bg-error-active focus-visible:ring-border-error",
        "destructive-soft":
          "bg-bg-error-soft text-fg-error-default hover:bg-bg-error-soft-hover active:bg-bg-error-soft-active focus-visible:ring-border-error",
        "destructive-outline":
          "border bg-transparent border-border-error text-fg-error-default hover:bg-bg-error-soft active:bg-bg-error-soft-hover focus-visible:ring-border-error",
      },
      size: {
        "8": "h-8 px-3 text-sm gap-1.5",
        "10": "h-10 px-4 text-sm gap-2",
        "12": "h-12 px-5 text-base gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default-solid",
      size: "10",
    },
  },
);

export const ButtonStyles = {
  buttonStyle,
};
