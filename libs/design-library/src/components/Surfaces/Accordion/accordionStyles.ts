import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

export const rootStyle = cva([
  "w-full divide-y divide-border-muted border-y border-border-muted",
]);

export const headingStyle = cva(["m-0"]);

export const triggerStyle = cva(
  [
    "flex w-full cursor-pointer items-center gap-2 px-1 py-3",
    "text-left text-label-lg font-medium text-fg-default",
    "transition-colors duration-150",
    "hover:text-fg-muted",
    "disabled:cursor-not-allowed disabled:text-fg-disabled",
    focusRingStyle,
    "focus-visible:outline-border-strong",
  ],
  {
    variants: {
      open: {
        // Open sections stay in the default colour; the chevron carries the
        // state, so the label does not shift weight and reflow the row.
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

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

export const contentStyle = cva(["px-1 pb-4 text-body-sm text-fg-default"]);

export const AccordionStyles = {
  rootStyle,
  headingStyle,
  triggerStyle,
  indicatorStyle,
  contentStyle,
};
