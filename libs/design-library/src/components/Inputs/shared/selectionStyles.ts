import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

/** Selection scale from §4. `"4"` = 16px, `"5"` = 20px. */
export type SelectionSize = "4" | "5";

export const selectionSizes = [
  "4",
  "5",
] as const satisfies Array<SelectionSize>;

/**
 * The box or dot itself, shared by `Checkbox` and `Radio`.
 *
 * `appearance-none` rather than a hidden input with a drawn stand-in: the
 * element the user clicks stays the real control, so it keeps native focus,
 * native form participation and the label association for free. Only its
 * painting is replaced.
 */
export const selectionControlStyle = cva(
  [
    "peer relative shrink-0 appearance-none border bg-bg-default",
    "transition-colors duration-150 cursor-pointer",
    "checked:bg-bg-primary checked:border-border-primary",
    "disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:border-border-disabled",
    "disabled:checked:bg-bg-disabled disabled:checked:border-border-disabled",
    focusRingStyle,
    "focus-visible:outline-border-primary",
  ],
  {
    variants: {
      size: {
        "4": "size-4",
        "5": "size-5",
      },
      shape: {
        box: "rounded-xs",
        dot: "rounded-full",
      },
      invalid: {
        true: "border-border-error hover:border-border-error-hover focus-visible:outline-border-error",
        false: "border-border-strong hover:border-border-primary",
      },
    },
    compoundVariants: [
      {
        // Checkbox only. On a radio, CSS :indeterminate means something else
        // entirely — "no option in this group is chosen" — so applying it to
        // both paints every empty radio group as though it were selected.
        shape: "box",
        class:
          "indeterminate:bg-bg-primary indeterminate:border-border-primary",
      },
    ],
    defaultVariants: {
      size: "4",
      shape: "box",
      invalid: false,
    },
  },
);

/**
 * The tick, the dash and the dot, drawn over the control.
 *
 * `pointer-events-none` so clicks land on the input underneath rather than on
 * the mark sitting on top of it.
 */
export const selectionMarkStyle = cva([
  "pointer-events-none absolute inset-0 flex items-center justify-center",
  "text-fg-primary peer-disabled:text-fg-disabled",
]);

export const SelectionStyles = {
  selectionControlStyle,
  selectionMarkStyle,
};
