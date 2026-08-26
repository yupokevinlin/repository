import { cva } from "class-variance-authority";

/**
 * A menu's severity subset. A command is either ordinary or destructive;
 * `info` and `success` describe states, and a menu item is not a state.
 */
export type MenuItemSeverity = "neutral" | "error";

export const menuStyle = cva([
  "z-50 min-w-[10rem] max-h-[20rem] overflow-y-auto rounded-md py-1",
  "border border-border-default bg-bg-default shadow-lg",
  "focus:outline-none",
]);

export const menuItemStyle = cva(
  [
    "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left",
    "text-body-sm",
  ],
  {
    variants: {
      severity: {
        neutral: "text-fg-default",
        error: "text-fg-error-default",
      },
      active: {
        // The highlight is a background: DOM focus stays on the menu, so a
        // focus ring here would point at the wrong element.
        true: "bg-bg-hover",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed text-fg-disabled",
        false: "",
      },
    },
    compoundVariants: [
      { severity: "error", active: true, class: "bg-bg-error-soft" },
    ],
    defaultVariants: {
      severity: "neutral",
      active: false,
      disabled: false,
    },
  },
);

export const menuGroupLabelStyle = cva([
  "px-3 pt-2 pb-1 text-micro-lg font-medium tracking-wide text-fg-muted",
]);

export const menuSeparatorStyle = cva(["my-1 h-px bg-border-muted"]);

export const MenuStyles = {
  menuStyle,
  menuItemStyle,
  menuGroupLabelStyle,
  menuSeparatorStyle,
};
