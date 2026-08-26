import { cva } from "class-variance-authority";

export const popoverStyle = cva(
  [
    "z-50 rounded-md border border-border-default bg-bg-default",
    "text-fg-default shadow-lg",
    // Script-focusable so focus can be placed on the panel itself when it
    // holds nothing focusable; never in the tab order.
    "focus:outline-none",
  ],
  {
    variants: {
      padding: {
        none: "p-0",
        "3": "p-3",
        "4": "p-4",
      },
    },
    defaultVariants: {
      padding: "4",
    },
  },
);

export const PopoverStyles = {
  popoverStyle,
};
