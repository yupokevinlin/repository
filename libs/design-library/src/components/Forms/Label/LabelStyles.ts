import { cva } from "class-variance-authority";

export type LabelDensity = "comfortable" | "compact";

export const labelStyle = cva(
  [
    "inline-flex items-center gap-1",
    "text-fg-default font-medium select-none",
    // The label is not the disabled thing — the control is — so this fires
    // from the wrapper rather than from a prop of its own.
    "has-[+_:disabled]:text-fg-disabled",
  ],
  {
    variants: {
      density: {
        comfortable: "text-label-md",
        compact: "text-label-sm",
      },
    },
    defaultVariants: {
      density: "comfortable",
    },
  },
);

/**
 * The required marker.
 *
 * Rendered in the error colour because that is the palette's "you must act
 * here" colour, not because anything is wrong yet.
 */
export const requiredMarkerStyle = cva(["text-fg-error-default"]);

/** Sits after the label text, for the rarer optional-field marking. */
export const optionalTextStyle = cva(["text-fg-muted font-normal"]);

export const LabelStyles = {
  labelStyle,
  requiredMarkerStyle,
  optionalTextStyle,
};
