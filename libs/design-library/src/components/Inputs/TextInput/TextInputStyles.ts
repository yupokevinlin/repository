import { cva } from "class-variance-authority";

export type TextInputVariant = "default" | "error" | "success";

export type TextInputSize = "8" | "10" | "12";

export type TextInputStorybookState = "hover" | "focus";

export const wrapperStyle = cva(
  [
    "inline-flex items-center rounded-md border cursor-text transition-colors duration-150",
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed",
    "has-[:disabled]:bg-bg-disabled has-[:disabled]:border-border-disabled has-[:disabled]:text-fg-disabled has-[:disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-bg-default border-border-strong text-fg-default hover:border-border-primary has-[:focus-visible]:outline-border-primary",
        error:
          "bg-bg-default border-border-error text-fg-default hover:border-border-error-hover has-[:focus-visible]:outline-border-error",
        success:
          "bg-bg-default border-border-success text-fg-default hover:border-border-success-hover has-[:focus-visible]:outline-border-success",
      },
      size: {
        "8": "h-8 px-2.5 text-sm gap-1.5",
        "10": "h-10 px-3 text-sm gap-2",
        "12": "h-12 px-4 text-base gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "10",
    },
  },
);

export const inputStyle =
  "flex-1 bg-transparent outline-none border-none min-w-0 placeholder:text-fg-subtle disabled:cursor-not-allowed";

export const iconStyle = cva(["shrink-0 text-fg-muted"], {
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

const storybookStateStyles: Record<
  TextInputVariant,
  Record<TextInputStorybookState, string>
> = {
  default: {
    hover: "border-border-primary",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-primary",
  },
  error: {
    hover: "border-border-error-hover",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-error",
  },
  success: {
    hover: "border-border-success-hover",
    focus: "outline-2 outline-offset-2 outline-dashed outline-border-success",
  },
};

export const getStorybookStateStyle = (
  variant: TextInputVariant,
  state: TextInputStorybookState,
): string => storybookStateStyles[variant][state];

export const TextInputStyles = {
  wrapperStyle,
  inputStyle,
  iconStyle,
  getStorybookStateStyle,
};
