import { cva } from "class-variance-authority";

export type TabsOrientation = "horizontal" | "vertical";

export const tabsOrientations = [
  "horizontal",
  "vertical",
] as const satisfies Array<TabsOrientation>;

export const tablistStyle = cva(["flex"], {
  variants: {
    orientation: {
      horizontal: "flex-row items-end gap-1 border-b border-border-muted",
      vertical: "flex-col items-stretch gap-1 border-r border-border-muted",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const tabStyle = cva(
  [
    "flex cursor-pointer items-center gap-2 whitespace-nowrap",
    "px-3 py-2 text-label-lg font-medium",
    "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
    "focus-visible:outline-dashed focus-visible:outline-border-strong",
  ],
  {
    variants: {
      orientation: {
        // The selected marker sits on the edge the tablist's own border runs
        // along, so it reads as the tab breaking through into its panel.
        horizontal: "-mb-px border-b-2",
        vertical: "-mr-px border-r-2 text-left",
      },
      selected: {
        true: "border-border-primary text-fg-primary-default",
        false:
          "border-transparent text-fg-muted hover:border-border-default hover:text-fg-default",
      },
      disabled: {
        true: "cursor-not-allowed text-fg-disabled hover:border-transparent hover:text-fg-disabled",
        false: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      selected: false,
      disabled: false,
    },
  },
);

/** The count beside a label — "Unsettled 12". */
export const countStyle = cva(
  ["rounded-full px-1.5 py-0.5 text-micro-lg font-medium"],
  {
    variants: {
      selected: {
        true: "bg-bg-primary-soft text-fg-primary-default",
        false: "bg-bg-hover text-fg-muted",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export const panelStyle = cva([
  "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-dashed focus-visible:outline-border-strong",
]);

export const TabsStyles = {
  tablistStyle,
  tabStyle,
  countStyle,
  panelStyle,
};
