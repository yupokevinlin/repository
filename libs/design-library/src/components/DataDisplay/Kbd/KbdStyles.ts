import { cva } from "class-variance-authority";

/** Inline-element scale from §4. `"5"` = 20px, `"6"` = 24px. */
export type KbdSize = "5" | "6";

/** The wrapper is itself a `<kbd>`, which is how HTML represents a combination. */
export const wrapperStyle = cva([
  "inline-flex items-center shrink-0 align-middle",
]);

export const keyStyle = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "font-mono font-medium whitespace-nowrap",
    "rounded-[0.25rem] border border-border-strong",
    // A thicker bottom edge reads as a physical key without a shadow.
    "border-b-2",
    "bg-bg-default text-fg-muted",
  ],
  {
    variants: {
      size: {
        "5": "h-5 min-w-5 px-1 text-micro-lg",
        "6": "h-6 min-w-6 px-1.5 text-label-sm",
      },
    },
    defaultVariants: {
      size: "6",
    },
  },
);

export const separatorStyle = cva(["shrink-0 text-fg-subtle"], {
  variants: {
    size: {
      "5": "px-0.5 text-micro-lg",
      "6": "px-1 text-label-sm",
    },
  },
  defaultVariants: {
    size: "6",
  },
});

/** Gap between keys when no separator is supplied. */
export const gapStyle = cva([""], {
  variants: {
    size: {
      "5": "gap-0.5",
      "6": "gap-1",
    },
  },
  defaultVariants: {
    size: "6",
  },
});

export const KbdStyles = { wrapperStyle, keyStyle, separatorStyle, gapStyle };
