import { cva } from "class-variance-authority";

export type SidebarDensity = "comfortable" | "compact";

export const sidebarDensities = [
  "comfortable",
  "compact",
] as const satisfies Array<SidebarDensity>;

export const rootStyle = cva(
  [
    "flex h-full flex-col overflow-y-auto",
    "border-r border-border-muted bg-bg-default text-fg-default",
    "transition-[width] duration-150 motion-reduce:transition-none",
  ],
  {
    variants: {
      collapsed: {
        // Wide enough for a 40px row plus its padding, and no wider: the rail
        // is the icons and nothing else.
        true: "w-[3.5rem]",
        false: "w-[16rem]",
      },
      density: {
        comfortable: "gap-4 p-3",
        compact: "gap-2 p-2",
      },
    },
    defaultVariants: {
      collapsed: false,
      density: "comfortable",
    },
  },
);

export const groupStyle = cva([], {
  variants: {
    density: {
      comfortable: "mb-4 last:mb-0",
      compact: "mb-2 last:mb-0",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

export const groupLabelStyle = cva(
  ["px-2 text-micro-lg font-medium uppercase tracking-wide text-fg-muted"],
  {
    variants: {
      collapsed: {
        // Clipped rather than removed while collapsed: the group is still a
        // labelled group in the accessibility tree, it just has no room to
        // show its heading.
        true: "sr-only",
        false: "mb-1",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const listStyle = cva(["m-0 flex list-none flex-col p-0"], {
  variants: {
    density: {
      comfortable: "gap-1",
      compact: "gap-0.5",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

/**
 * The row. `relative` is load-bearing: it is what the consumer's anchor
 * stretches against (§11.2), so the whole row is the click target while the
 * anchor stays the consumer's own — `next/link` or otherwise.
 *
 * Two consequences, documented on `SidebarItem`: text selection inside a row
 * stops working, and anything else interactive in the row needs its own
 * stacking context to stay reachable.
 */
export const itemStyle = cva(
  [
    "relative flex items-center gap-2 rounded-md px-2",
    "text-label-lg",
    "[&_a]:min-w-0 [&_a]:truncate [&_a]:no-underline [&_a]:text-inherit",
    "[&_a]:after:absolute [&_a]:after:inset-0 [&_a]:after:content-['']",
    "[&_a]:focus-visible:outline-none",
    "focus-within:outline-2 focus-within:outline-offset-[-2px]",
    "focus-within:outline-dashed focus-within:outline-border-strong",
  ],
  {
    variants: {
      current: {
        true: "bg-bg-primary-soft font-medium text-fg-primary-default",
        false: "text-fg-default hover:bg-bg-hover",
      },
      density: {
        comfortable: "h-10",
        compact: "h-8",
      },
      collapsed: {
        true: "justify-center",
        false: "",
      },
    },
    defaultVariants: {
      current: false,
      density: "comfortable",
      collapsed: false,
    },
  },
);

/**
 * Zero-width and clipped while collapsed, rather than `hidden` or `sr-only`.
 *
 * `hidden` would take the link's text out of the accessibility tree and leave
 * the row a nameless icon. `sr-only` positions the element, which would make
 * the consumer's stretched anchor size itself against a 1px box instead of the
 * row. Clipping keeps the name and keeps the stretch.
 */
export const itemLabelStyle = cva(["flex min-w-0 flex-1 items-center gap-2"], {
  variants: {
    collapsed: {
      true: "w-0 flex-none overflow-hidden opacity-0",
      false: "",
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const itemIconStyle = cva([
  "flex size-4 shrink-0 items-center justify-center",
]);

/**
 * Anything interactive beside the link needs to sit above the stretched
 * anchor, or the anchor swallows its clicks.
 */
export const itemTrailingStyle = cva(["relative z-[1] shrink-0"], {
  variants: {
    collapsed: {
      true: "hidden",
      false: "",
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const SidebarStyles = {
  rootStyle,
  groupStyle,
  groupLabelStyle,
  listStyle,
  itemStyle,
  itemLabelStyle,
  itemIconStyle,
  itemTrailingStyle,
};
