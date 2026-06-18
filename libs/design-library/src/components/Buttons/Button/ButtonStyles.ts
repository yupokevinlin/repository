import { cva } from "class-variance-authority";

export type ButtonVariant =
  | "primary-solid"
  | "primary-soft"
  | "primary-outline"
  | "secondary-solid"
  | "secondary-soft"
  | "secondary-outline"
  | "tertiary-solid"
  | "tertiary-soft"
  | "tertiary-outline"
  | "default-solid"
  | "default-soft"
  | "default-outline"
  | "destructive-solid"
  | "destructive-soft"
  | "destructive-outline";

export type ButtonSize = "8" | "10" | "12";

export const buttonStyle = cva(
  [
    "inline-flex items-center justify-center font-medium rounded-md",
    "transition-colors duration-150 cursor-pointer",
    "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed",
    "disabled:bg-bg-disabled disabled:text-fg-disabled disabled:border-border-disabled disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        "primary-solid":
          "bg-bg-primary text-fg-primary hover:bg-bg-primary-hover active:bg-bg-primary-active focus-visible:outline-border-primary",
        "primary-soft":
          "bg-bg-primary-soft text-fg-primary-default hover:bg-bg-primary-soft-hover active:bg-bg-primary-soft-active focus-visible:outline-border-primary",
        "primary-outline":
          "border bg-transparent border-border-primary text-fg-primary-default hover:bg-bg-primary-soft active:bg-bg-primary-soft-hover focus-visible:outline-border-primary",
        "secondary-solid":
          "bg-bg-secondary text-fg-secondary hover:bg-bg-secondary-hover active:bg-bg-secondary-active focus-visible:outline-border-secondary",
        "secondary-soft":
          "bg-bg-secondary-soft text-fg-secondary-default hover:bg-bg-secondary-soft-hover active:bg-bg-secondary-soft-active focus-visible:outline-border-secondary",
        "secondary-outline":
          "border bg-transparent border-border-secondary text-fg-secondary-default hover:bg-bg-secondary-soft active:bg-bg-secondary-soft-hover focus-visible:outline-border-secondary",
        "tertiary-solid":
          "bg-bg-tertiary text-fg-tertiary hover:bg-bg-tertiary-hover active:bg-bg-tertiary-active focus-visible:outline-border-tertiary",
        "tertiary-soft":
          "bg-bg-tertiary-soft text-fg-tertiary-default hover:bg-bg-tertiary-soft-hover active:bg-bg-tertiary-soft-active focus-visible:outline-border-tertiary",
        "tertiary-outline":
          "border bg-transparent border-border-tertiary text-fg-tertiary-default hover:bg-bg-tertiary-soft active:bg-bg-tertiary-soft-hover focus-visible:outline-border-tertiary",
        "default-solid":
          "bg-bg-hover text-fg-default hover:bg-bg-active active:bg-bg-active focus-visible:outline-border-strong",
        "default-soft":
          "bg-bg-default text-fg-default hover:bg-bg-hover active:bg-bg-active focus-visible:outline-border-default",
        "default-outline":
          "border bg-transparent border-border-default text-fg-default hover:bg-bg-hover active:bg-bg-active focus-visible:outline-border-strong",
        "destructive-solid":
          "bg-bg-error text-fg-error hover:bg-bg-error-hover active:bg-bg-error-active focus-visible:outline-border-error",
        "destructive-soft":
          "bg-bg-error-soft text-fg-error-default hover:bg-bg-error-soft-hover active:bg-bg-error-soft-active focus-visible:outline-border-error",
        "destructive-outline":
          "border bg-transparent border-border-error text-fg-error-default hover:bg-bg-error-soft active:bg-bg-error-soft-hover focus-visible:outline-border-error",
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

export const iconStyle = cva(["shrink-0"], {
  variants: {
    size: {
      "8": "size-4",
      "10": "size-5",
      "12": "size-6",
    },
  },
  defaultVariants: {
    size: "10",
  },
});

export const labelStyle = "font-bold";

export type ButtonStorybookState = "hover" | "active" | "focus";

const storybookStateStyles: Record<
  ButtonVariant,
  Record<ButtonStorybookState, string>
> = {
  "primary-solid": {
    hover: "bg-bg-primary-hover",
    active: "bg-bg-primary-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-primary",
  },
  "primary-soft": {
    hover: "bg-bg-primary-soft-hover",
    active: "bg-bg-primary-soft-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-primary",
  },
  "primary-outline": {
    hover: "bg-bg-primary-soft",
    active: "bg-bg-primary-soft-hover",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-primary",
  },
  "secondary-solid": {
    hover: "bg-bg-secondary-hover",
    active: "bg-bg-secondary-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-secondary",
  },
  "secondary-soft": {
    hover: "bg-bg-secondary-soft-hover",
    active: "bg-bg-secondary-soft-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-secondary",
  },
  "secondary-outline": {
    hover: "bg-bg-secondary-soft",
    active: "bg-bg-secondary-soft-hover",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-secondary",
  },
  "tertiary-solid": {
    hover: "bg-bg-tertiary-hover",
    active: "bg-bg-tertiary-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-tertiary",
  },
  "tertiary-soft": {
    hover: "bg-bg-tertiary-soft-hover",
    active: "bg-bg-tertiary-soft-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-tertiary",
  },
  "tertiary-outline": {
    hover: "bg-bg-tertiary-soft",
    active: "bg-bg-tertiary-soft-hover",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-tertiary",
  },
  "default-solid": {
    hover: "bg-bg-active",
    active: "bg-bg-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-strong",
  },
  "default-soft": {
    hover: "bg-bg-hover",
    active: "bg-bg-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-default",
  },
  "default-outline": {
    hover: "bg-bg-hover",
    active: "bg-bg-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-strong",
  },
  "destructive-solid": {
    hover: "bg-bg-error-hover",
    active: "bg-bg-error-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-error",
  },
  "destructive-soft": {
    hover: "bg-bg-error-soft-hover",
    active: "bg-bg-error-soft-active",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-error",
  },
  "destructive-outline": {
    hover: "bg-bg-error-soft",
    active: "bg-bg-error-soft-hover",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-error",
  },
};

export const getStorybookStateStyle = (
  variant: ButtonVariant,
  state: ButtonStorybookState,
): string => storybookStateStyles[variant][state];

export const ButtonStyles = {
  buttonStyle,
  iconStyle,
  labelStyle,
  getStorybookStateStyle,
};
