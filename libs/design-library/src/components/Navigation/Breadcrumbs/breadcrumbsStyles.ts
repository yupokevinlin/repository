import { cva } from "class-variance-authority";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";

export type BreadcrumbsDensity = "comfortable" | "compact";

export const breadcrumbsDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<BreadcrumbsDensity>;

export const listStyle = cva(
  ["m-0 flex list-none flex-wrap items-center p-0 text-body-sm"],
  {
    variants: {
      density: {
        comfortable: "gap-2",
        compact: "gap-1",
      },
    },
    defaultVariants: {
      density: "comfortable",
    },
  },
);

export const itemStyle = cva(["flex items-center"], {
  variants: {
    density: {
      comfortable: "gap-2",
      compact: "gap-1",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

/**
 * The consumer's anchor, styled by descendant selector (§11.1) rather than by
 * anything being injected into it.
 *
 * The focus ring is written out rather than composed from `focusRingStyle`:
 * Tailwind scans source text, so a prefix applied at runtime would never be
 * generated. The geometry still has to match focusRing.ts.
 */
export const linkStyle = cva([
  "[&_a]:rounded-sm [&_a]:text-fg-muted [&_a]:no-underline",
  "[&_a]:hover:text-fg-default [&_a]:hover:underline",
  "[&_a]:focus:outline-none [&_a]:focus-visible:outline-2",
  "[&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-dashed",
  "[&_a]:focus-visible:outline-border-strong",
]);

export const currentStyle = cva(["font-medium text-fg-default"]);

export const separatorStyle = cva(["select-none text-fg-subtle"]);

export const collapseTriggerStyle = cva([
  "flex cursor-pointer items-center rounded-sm px-1",
  "text-fg-muted hover:text-fg-default",
  focusRingStyle,
  "focus-visible:outline-border-strong",
]);

export const collapseListStyle = cva([
  "z-50 m-0 flex max-h-[16rem] min-w-[12rem] list-none flex-col overflow-y-auto p-1",
  "rounded-md border border-border-default bg-bg-default text-fg-default shadow-lg",
]);

/**
 * The folded crumbs carry their own anchor rules rather than reusing
 * `linkStyle`. Both would match the same anchor with equal specificity, and
 * which colour won would come down to the order the two rules happened to
 * land in the stylesheet.
 */
export const collapseItemStyle = cva([
  "rounded-sm text-body-sm hover:bg-bg-hover",
  "[&_a]:block [&_a]:px-2 [&_a]:py-1.5 [&_a]:no-underline",
  "[&_a]:text-fg-default [&_a]:hover:text-fg-default",
  "[&_a]:focus:outline-none [&_a]:focus-visible:outline-2",
  "[&_a]:focus-visible:outline-offset-[-2px] [&_a]:focus-visible:outline-dashed",
  "[&_a]:focus-visible:outline-border-strong",
  // Plain text — a crumb with no link of its own — still needs the padding.
  "[&:not(:has(a))]:px-2 [&:not(:has(a))]:py-1.5",
]);

export const BreadcrumbsStyles = {
  listStyle,
  itemStyle,
  linkStyle,
  currentStyle,
  separatorStyle,
  collapseTriggerStyle,
  collapseListStyle,
  collapseItemStyle,
};
