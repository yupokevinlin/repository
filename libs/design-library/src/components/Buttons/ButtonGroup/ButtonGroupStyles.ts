import { cva } from "class-variance-authority";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export const groupStyle = cva(["inline-flex"], {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

/**
 * Applied to each button in turn.
 *
 * Two things are happening. The inner corners are squared off so the buttons
 * read as one control rather than several sitting close together. And every
 * button after the first is pulled back by a hairline, so two adjacent
 * outlined buttons share one border instead of stacking two.
 *
 * `relative` plus `focus-visible:z-10` keeps the focus ring on top: without
 * it the neighbour's background clips the ring on the overlapping edge.
 */
export const itemStyle = cva(["relative focus-visible:z-10"], {
  variants: {
    orientation: {
      horizontal: "",
      vertical: "",
    },
    position: {
      first: "",
      middle: "rounded-none",
      last: "",
      only: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      position: "first",
      class: "rounded-none rounded-l-md",
    },
    {
      orientation: "horizontal",
      position: "last",
      class: "rounded-none rounded-r-md -ml-px",
    },
    { orientation: "horizontal", position: "middle", class: "-ml-px" },
    {
      orientation: "vertical",
      position: "first",
      class: "rounded-none rounded-t-md",
    },
    {
      orientation: "vertical",
      position: "last",
      class: "rounded-none rounded-b-md -mt-px",
    },
    { orientation: "vertical", position: "middle", class: "-mt-px" },
  ],
  defaultVariants: {
    orientation: "horizontal",
    position: "only",
  },
});

export const ButtonGroupStyles = {
  groupStyle,
  itemStyle,
};
