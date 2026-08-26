import { cva } from "class-variance-authority";

export type TimelineDensity = "comfortable" | "compact";

/** The §4.1 scale. `neutral` is the ordinary entry and the default. */
export type TimelineSeverity =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export const timelineDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<TimelineDensity>;

export const timelineSeverities = [
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const satisfies Array<TimelineSeverity>;

export const listStyle = cva(["m-0 flex list-none flex-col p-0"]);

export const itemStyle = cva(["relative flex gap-3"]);

/** The column holding the marker and the line that runs on from it. */
export const railStyle = cva(["relative flex w-4 shrink-0 justify-center"]);

export const markerStyle = cva(
  ["mt-1 size-3 shrink-0 rounded-full border-2 bg-bg-default"],
  {
    variants: {
      severity: {
        neutral: "border-border-strong",
        info: "border-border-info",
        success: "border-border-success",
        warning: "border-border-warning",
        error: "border-border-error",
      },
    },
    defaultVariants: {
      severity: "neutral",
    },
  },
);

/**
 * The line between one marker and the next. Absolutely positioned rather than
 * a border on the rail, so it starts below the dot instead of running through
 * it, and `bottom-0` on a full-height rail carries it all the way to the next
 * one — the spacing between entries lives on the content column for exactly
 * that reason, so nothing here has to guess at it.
 */
export const connectorStyle = cva([
  "absolute bottom-0 left-1/2 top-5 w-px -translate-x-1/2",
  "bg-border-muted",
]);

/**
 * The gap to the next entry lives here rather than on the row, so the rail
 * beside it runs the full height and its connector can reach the next marker.
 * `none` is the last entry, which has nothing to reach.
 */
export const contentStyle = cva(["flex min-w-0 flex-1 flex-col gap-1"], {
  variants: {
    spacing: {
      comfortable: "pb-5",
      compact: "pb-3",
      none: "",
    },
  },
  defaultVariants: {
    spacing: "comfortable",
  },
});

export const titleStyle = cva(["text-label-lg font-medium text-fg-default"]);

export const timeStyle = cva(["text-micro-lg text-fg-muted"]);

export const bodyStyle = cva(["text-body-sm text-fg-default"]);

export const TimelineStyles = {
  listStyle,
  itemStyle,
  railStyle,
  markerStyle,
  connectorStyle,
  contentStyle,
  titleStyle,
  timeStyle,
  bodyStyle,
};
