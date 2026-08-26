import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

export type LinkAppearance = "inline" | "standalone" | "button";

/**
 * The two text appearances. `appearance="button"` does not come through here —
 * it borrows `Button`'s cva outright, so a link that looks like a button and a
 * button cannot drift apart.
 */
export const linkStyle = cva(
  [
    "inline-flex items-baseline gap-1 rounded-xs",
    "text-fg-primary-default",
    "transition-colors duration-150 cursor-pointer",
    "hover:text-fg-primary-hover active:text-fg-primary-active",
    "aria-disabled:text-fg-disabled aria-disabled:cursor-not-allowed aria-disabled:no-underline",
    focusRingStyle,
    "focus-visible:outline-border-primary",
  ],
  {
    variants: {
      appearance: {
        // Inline links sit inside a sentence, where the underline is the only
        // thing separating them from surrounding text for a colour-blind
        // reader. It is always on.
        inline: "underline underline-offset-2 decoration-from-font",
        // Standalone links stand on their own line, where position and
        // colour already mark them out.
        standalone: "no-underline hover:underline underline-offset-2",
      },
    },
    defaultVariants: {
      appearance: "inline",
    },
  },
);

/** The outbound arrow. Sized in `em` so it tracks whatever text it sits in. */
export const externalIconStyle = cva(["size-[0.875em] shrink-0 self-center"]);

export const LinkStyles = {
  linkStyle,
  externalIconStyle,
};
