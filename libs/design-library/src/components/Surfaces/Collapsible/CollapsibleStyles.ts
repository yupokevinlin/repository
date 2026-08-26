import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

export const rootStyle = cva(["w-full"]);

export const triggerStyle = cva([
  "flex w-full items-center gap-[0.5rem]",
  "text-left text-fg-default cursor-pointer",
  "transition-colors duration-150",
  "hover:text-fg-muted",
  "disabled:cursor-not-allowed disabled:text-fg-disabled",
  focusRingStyle,
  "focus-visible:outline-border-strong",
]);

/**
 * The chevron turns rather than swapping glyph, so there is one icon to
 * theme and the rotation carries the state change.
 */
export const indicatorStyle = cva(
  [
    "size-4 shrink-0 transition-transform duration-150",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      open: {
        true: "rotate-90",
        false: "rotate-0",
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

export const contentStyle = cva(["w-full"]);

export const CollapsibleStyles = {
  rootStyle,
  triggerStyle,
  indicatorStyle,
  contentStyle,
};
