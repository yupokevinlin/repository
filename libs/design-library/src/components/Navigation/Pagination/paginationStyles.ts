import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

export const listStyle = cva([
  "m-0 flex list-none items-center gap-1 p-0 text-body-sm",
]);

/**
 * Sized to the §4 scale's 8-step, so a row of pages lines up with a `Button`
 * at `size="8"` beside it.
 */
export const pageStyle = cva(
  [
    "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2",
    "no-underline",
    focusRingStyle,
    "focus-visible:outline-border-strong",
  ],
  {
    variants: {
      current: {
        true: "bg-bg-primary text-fg-primary",
        false: "text-fg-default hover:bg-bg-hover",
      },
    },
    defaultVariants: {
      current: false,
    },
  },
);

/**
 * The step arrows at an end. Not a link and not focusable: there is nowhere to
 * go, and a link to nowhere is worse than one that is simply not there.
 */
export const stepEndStyle = cva([
  "flex h-8 min-w-8 items-center justify-center rounded-md px-2",
  "text-fg-disabled",
]);

export const ellipsisStyle = cva([
  "flex h-8 min-w-8 select-none items-center justify-center",
  "text-fg-subtle",
]);

export const PaginationStyles = {
  listStyle,
  pageStyle,
  stepEndStyle,
  ellipsisStyle,
};
