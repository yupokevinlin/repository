import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

/** Fill style. Tag has no severity — see the note in `Tag.tsx`. */
export type TagAppearance = "solid" | "soft" | "outline";

/** Inline-element scale from §4. `"5"` = 20px, `"6"` = 24px. */
export type TagSize = "5" | "6";

export const tagStyle = cva(
  [
    "inline-flex items-center shrink-0",
    "rounded-full font-medium whitespace-nowrap",
    "border border-transparent",
  ],
  {
    variants: {
      appearance: {
        solid: "bg-bg-active text-fg-default",
        soft: "bg-bg-hover text-fg-muted",
        outline: "bg-transparent border-border-default text-fg-default",
      },
      size: {
        "5": "h-5 px-2 gap-1 text-micro-lg",
        "6": "h-6 px-2.5 gap-1.5 text-label-sm",
      },
      /** The remove button brings its own padding, so the tag gives some back. */
      removable: {
        true: "",
        false: "",
      },
      disabled: {
        true: "bg-bg-disabled text-fg-disabled border-border-disabled",
        false: "",
      },
    },
    compoundVariants: [
      { removable: true, size: "5", class: "pr-0.5" },
      { removable: true, size: "6", class: "pr-1" },
    ],
    defaultVariants: {
      appearance: "soft",
      size: "6",
      removable: false,
      disabled: false,
    },
  },
);

export const removeStyle = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-full text-current cursor-pointer",
    "transition-colors duration-150",
    "hover:bg-bg-active",
    "disabled:cursor-not-allowed disabled:hover:bg-transparent",
    focusRingStyle,
    "focus-visible:outline-border-strong",
  ],
  {
    variants: {
      size: {
        "5": "size-4",
        "6": "size-5",
      },
    },
    defaultVariants: {
      size: "6",
    },
  },
);

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

export const TagStyles = { tagStyle, removeStyle, iconStyle };
