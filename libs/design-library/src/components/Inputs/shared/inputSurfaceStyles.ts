import { cva } from "class-variance-authority";

/** Control heights from §4. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. */
export type InputSize = "8" | "10" | "12";

export type InputDensity = "comfortable" | "compact";

/**
 * The bordered box every text-like control sits in — `TextInput`, `TextArea`,
 * `NumberInput`, `SearchInput`.
 *
 * Shared rather than copied four times: the focus ring, the disabled treatment
 * and the invalid border are exactly the things that drift when each control
 * owns its own copy, and a form where one field's error border is a different
 * red from the next one's looks broken.
 *
 * There is no `variant` prop (§4.1 — `variant` is the colour-role axis, which
 * an input does not have). Invalidity is derived from the `error` prop by
 * `FieldShell`, so there is one source of truth for "this field is wrong".
 */
export const inputSurfaceStyle = cva(
  [
    "flex w-full min-w-0 items-center rounded-md border cursor-text",
    "bg-bg-default text-fg-default transition-colors duration-150",
    // The ring goes on the box rather than the input, so it surrounds the
    // icons too instead of cutting between them.
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
      size: {
        "8": "h-8 px-2.5 gap-1.5 text-body-sm",
        "10": "h-10 px-3 gap-2 text-body-sm",
        "12": "h-12 px-4 gap-2.5 text-body-md",
      },
    },
    defaultVariants: {
      invalid: false,
      size: "10",
    },
  },
);

/**
 * The input element itself. Transparent and borderless — the box around it
 * draws everything, so the two cannot disagree about the focus ring.
 */
export const inputElementStyle = cva([
  "min-w-0 flex-1 border-none bg-transparent outline-none",
  "text-inherit placeholder:text-fg-subtle",
  "disabled:cursor-not-allowed disabled:text-fg-disabled",
]);

export const inputIconStyle = cva(["shrink-0 text-fg-muted"], {
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

export const inputSizes = ["8", "10", "12"] as const satisfies Array<InputSize>;

export const inputDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<InputDensity>;

export const InputSurfaceStyles = {
  inputSurfaceStyle,
  inputElementStyle,
  inputIconStyle,
};
