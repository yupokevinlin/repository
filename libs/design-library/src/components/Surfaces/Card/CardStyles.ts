import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

export type CardElevation = "flat" | "raised";

/** Inner padding. `"4"` = 1rem, `"6"` = 1.5rem. */
export type CardPadding = "none" | "4" | "6";

/**
 * An optional accent edge. A subset of the §4.1 scale — `neutral` is absent
 * because "no accent" is expressed by omitting the prop, not by a value.
 */
export type CardSeverity = "info" | "success" | "warning" | "error";

export const cardStyle = cva(
  [
    "relative w-full rounded-md border border-border-default bg-bg-surface",
    "text-fg-default",
  ],
  {
    variants: {
      elevation: {
        flat: "",
        raised: "shadow-raised",
      },
      padding: {
        none: "p-0",
        "4": "p-4",
        "6": "p-6",
      },
      severity: {
        none: "",
        info: "border-l-4 border-l-border-info",
        success: "border-l-4 border-l-border-success",
        warning: "border-l-4 border-l-border-warning",
        error: "border-l-4 border-l-border-error",
      },
      selectable: {
        // A <button> centres its text and shrinks to content; undo both, then
        // add the affordances that make it read as pressable.
        true: [
          "block text-left cursor-pointer",
          "transition-colors duration-150",
          "hover:bg-bg-hover active:bg-bg-active",
          "disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-fg-disabled",
          focusRingStyle,
          "focus-visible:outline-border-strong",
        ],
        false: "",
      },
    },
    defaultVariants: {
      elevation: "flat",
      padding: "4",
      severity: "none",
      selectable: false,
    },
  },
);

export const CardStyles = { cardStyle };
