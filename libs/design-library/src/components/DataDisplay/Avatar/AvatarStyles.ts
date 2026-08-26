import { cva } from "class-variance-authority";

/** Avatar scale from §4. `"6"` = 24px, `"8"` = 32px, `"10"` = 40px. */
export type AvatarSize = "6" | "8" | "10";

export type AvatarShape = "circle" | "square";

/**
 * Presence is a state, like severity, but its own family (§4.1) — so a green
 * "online" dot and a green "success" badge never mean the same thing.
 */
export type AvatarStatus = "online" | "away" | "offline";

export const avatarStyle = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "bg-bg-active text-fg-muted font-medium select-none",
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

export const imageStyle = cva(["size-full object-cover"]);

/**
 * The status dot sits outside the avatar's `overflow-hidden`, so it is a
 * sibling rather than a child.
 */
export const statusStyle = cva(
  ["absolute right-0 bottom-0 rounded-full ring-2 ring-bg-default"],
  {
    variants: {
      size: {
        "6": "size-1.5",
        "8": "size-2",
        "10": "size-2.5",
      },
      status: {
        online: "bg-presence-online",
        away: "bg-presence-away",
        offline: "bg-presence-offline",
      },
    },
    defaultVariants: {
      size: "8",
      status: "offline",
    },
  },
);

/** Wraps avatar + dot, since the dot must escape the avatar's clipping. */
export const wrapperStyle = cva(["relative inline-flex shrink-0"]);

export const AvatarStyles = {
  avatarStyle,
  imageStyle,
  statusStyle,
  wrapperStyle,
};
