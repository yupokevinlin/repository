import { cva } from "class-variance-authority";

export type TextAreaResize = "none" | "horizontal" | "vertical" | "both";

/**
 * A textarea is not a fixed-height control, so it cannot reuse the shared
 * surface's `h-*` steps. It takes the same border, focus ring and disabled
 * treatment and swaps the height for padding.
 */
export const textAreaSurfaceStyle = cva(
  [
    "flex w-full min-w-0 rounded-md border cursor-text",
    "bg-bg-default text-fg-default transition-colors duration-150",
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed",
    "has-[:disabled]:bg-bg-disabled has-[:disabled]:border-border-disabled has-[:disabled]:text-fg-disabled has-[:disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      invalid: {
        true: "border-border-error hover:border-border-error-hover has-[:focus-visible]:outline-border-error",
        false:
          "border-border-strong hover:border-border-primary has-[:focus-visible]:outline-border-primary",
      },
      density: {
        comfortable: "px-3 py-2 text-body-sm",
        compact: "px-2.5 py-1.5 text-body-sm",
      },
    },
    defaultVariants: {
      invalid: false,
      density: "comfortable",
    },
  },
);

export const textAreaElementStyle = cva(
  [
    "min-w-0 flex-1 border-none bg-transparent outline-none",
    "text-inherit placeholder:text-fg-subtle",
    "disabled:cursor-not-allowed disabled:text-fg-disabled",
  ],
  {
    variants: {
      resize: {
        none: "resize-none",
        horizontal: "resize-x",
        vertical: "resize-y",
        both: "resize",
      },
    },
    defaultVariants: {
      resize: "vertical",
    },
  },
);

export const TextAreaStyles = {
  textAreaSurfaceStyle,
  textAreaElementStyle,
};
