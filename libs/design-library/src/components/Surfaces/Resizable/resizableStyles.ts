import { cva } from "class-variance-authority";

export type ResizableOrientation = "horizontal" | "vertical";

export const resizableOrientations = [
  "horizontal",
  "vertical",
] as const satisfies Array<ResizableOrientation>;

export const groupStyle = cva(["flex h-full w-full"], {
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

export const panelStyle = cva(["min-h-0 min-w-0 overflow-auto"]);

/**
 * The splitter. Thin to look at, but with a larger grab area either side of
 * it — a 1px target is a target nobody hits.
 */
export const handleStyle = cva(
  [
    "group relative flex shrink-0 items-center justify-center",
    "bg-border-muted transition-colors duration-150 motion-reduce:transition-none",
    "hover:bg-border-primary focus:outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-0",
    "focus-visible:outline-dashed focus-visible:outline-border-strong",
  ],
  {
    variants: {
      orientation: {
        horizontal: "w-px cursor-col-resize",
        vertical: "h-px cursor-row-resize",
      },
      dragging: {
        true: "bg-border-primary",
        false: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      dragging: false,
    },
  },
);

/**
 * The part the pointer actually has to hit, stretched past the visible line
 * and invisible itself.
 */
export const handleGrabStyle = cva(["absolute"], {
  variants: {
    orientation: {
      horizontal: "inset-y-0 -left-1 -right-1",
      vertical: "inset-x-0 -top-1 -bottom-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const ResizableStyles = {
  groupStyle,
  panelStyle,
  handleStyle,
  handleGrabStyle,
};
