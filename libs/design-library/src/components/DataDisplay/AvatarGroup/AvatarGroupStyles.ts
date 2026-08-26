import { cva } from "class-variance-authority";

import type { AvatarShape, AvatarSize } from "../Avatar/AvatarStyles";

export const groupStyle = cva(["inline-flex items-center"]);

/**
 * Every avatar after the first slides back over the one before it. The ring
 * is what keeps two overlapping faces readable as two.
 *
 * It lives on a wrapper the group owns rather than on the avatar itself,
 * because an avatar carrying a `status` puts its own `className` on an outer
 * wrapper that has no rounding — the ring would come out square.
 */
export const itemStyle = cva(["inline-flex shrink-0"], {
  variants: {
    size: {
      "6": "",
      "8": "",
      "10": "",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-md",
    },
    overlapped: {
      true: "ring-2 ring-bg-default",
      false: "",
    },
  },
  compoundVariants: [
    { size: "6", overlapped: true, class: "-ml-1.5" },
    { size: "8", overlapped: true, class: "-ml-2" },
    { size: "10", overlapped: true, class: "-ml-2.5" },
  ],
  defaultVariants: {
    size: "8",
    shape: "circle",
    overlapped: false,
  },
});

/** The `+N` bubble. Sized and shaped exactly like the avatars it follows. */
export const overflowStyle = cva(
  [
    "inline-flex shrink-0 items-center justify-center select-none",
    "bg-bg-active text-fg-muted font-medium",
  ],
  {
    variants: {
      size: {
        "6": "size-6 text-micro-md",
        "8": "size-8 text-micro-lg",
        "10": "size-10 text-label-sm",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "8",
      shape: "circle",
    },
  },
);

export type { AvatarShape, AvatarSize };

export const AvatarGroupStyles = {
  groupStyle,
  itemStyle,
  overflowStyle,
};
