import { cva } from "class-variance-authority";

export type DividerOrientation = "horizontal" | "vertical";

/**
 * Prominence, mapped 1:1 onto the three global border tokens. Not a colour
 * role and not a fill, so it is its own axis (§5).
 */
export type DividerEmphasis = "subtle" | "default" | "strong";

/**
 * The rule itself. `border-0` resets the `<hr>` UA border.
 *
 * `shrink-0` lives on the vertical orientation only. A horizontal rule inside
 * the labelled form is a flex child that has to give way to the label, and a
 * base-level `shrink-0` would stop it — it would size to `w-full` and overflow
 * the row.
 */
export const ruleStyle = cva(["border-0"], {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px shrink-0 self-stretch min-h-4",
    },
    emphasis: {
      subtle: "bg-border-muted",
      default: "bg-border-default",
      strong: "bg-border-strong",
    },
    /** Set on the rules either side of a label, which share the row with it. */
    flexible: {
      true: "w-auto flex-1",
      false: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    emphasis: "default",
    flexible: false,
  },
});

/** Wrapper for the labelled form, which is a row rather than a single rule. */
export const labelledStyle = cva(["flex w-full items-center gap-[0.75rem]"]);

export const labelStyle = cva([
  "shrink-0 text-fg-muted font-mono text-micro-lg tracking-widest uppercase",
]);

export const DividerStyles = { ruleStyle, labelledStyle, labelStyle };
