import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type AvatarShape,
  type AvatarSize,
  type AvatarStatus,
  AvatarStyles,
} from "./AvatarStyles";

export const avatarSizes = [
  "6",
  "8",
  "10",
] as const satisfies Array<AvatarSize>;

export const avatarShapes = [
  "circle",
  "square",
] as const satisfies Array<AvatarShape>;

export const avatarStatuses = [
  "online",
  "away",
  "offline",
] as const satisfies Array<AvatarStatus>;

export type { AvatarShape, AvatarSize, AvatarStatus };

export type AvatarProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /**
   * The person or party's name. Always required — it is the accessible name,
   * and the source of the initials fallback.
   */
  name: string;
  /** Image URL. When absent or broken, initials from `name` are shown instead. */
  src?: string;
  /** Defaults to `"8"` (32px). `"6"` = 24px, `"10"` = 40px. */
  size?: AvatarSize;
  /** Defaults to `"circle"`. Use `"square"` for a company rather than a person. */
  shape?: AvatarShape;
  /**
   * Presence, from its own token family — never the severity one, so a green
   * dot here and a green `Badge` cannot be confused.
   */
  status?: AvatarStatus;
  /**
   * What the status means, in words. Required alongside `status` because a
   * coloured dot is meaningless to a screen reader, and §15.2 forbids colour
   * being the only carrier.
   */
  statusLabel?: string;
};

/**
 * Renders up to two initials from a name — first letter of the first and last
 * word, so “Kanto Polymer KK” gives KK and “K. Lin” gives KL.
 */
export const initialsFromName = (name: string): string => {
  const words: Array<string> = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  const first: string = words[0]?.[0] ?? "";
  const last: string =
    words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
};

/**
 * A person or party's face, in the top bar and on activity entries.
 *
 * Falls back to initials whenever there is no image, which for an internal
 * trade desk is the common case — counterparty contacts rarely have avatars.
 *
 * The image is decorative: `name` is the accessible name, so a screen reader
 * hears the person either way and never “image”.
 *
 * @server-safe
 *
 * @example Initials only
 * ```tsx
 * <Avatar name="K. Lin" />
 * ```
 *
 * @example With an image, sized up
 * ```tsx
 * <Avatar name="K. Lin" src={user.avatarUrl} size="10" />
 * ```
 *
 * @example A company, and a presence dot that says what it means
 * ```tsx
 * <Avatar name="Kanto Polymer KK" shape="square" />
 * <Avatar name="K. Lin" status="online" statusLabel="Online" />
 * ```
 */
export const Avatar = ({
  name,
  src,
  size: sizeProp,
  shape: shapeProp,
  status,
  statusLabel,
  className: classNameProp,
  ...remainingProps
}: AvatarProps) => {
  const size: AvatarSize = sizeProp ?? "8";
  const shape: AvatarShape = shapeProp ?? "circle";
  const className: string = classNameProp ?? "";
  const initials: string = initialsFromName(name);

  const avatar = (
    <span
      data-slot="avatar"
      className={cn(
        AvatarStyles.avatarStyle({ size, shape }),
        status === undefined ? className : "",
      )}
      {...(status === undefined ? remainingProps : {})}
    >
      {src === undefined ? (
        <span data-slot="avatar-initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <img
          data-slot="avatar-image"
          src={src}
          alt=""
          className={AvatarStyles.imageStyle()}
        />
      )}
      <span data-slot="avatar-name" className="sr-only">
        {name}
      </span>
    </span>
  );

  if (status === undefined) {
    return avatar;
  }

  return (
    <span
      data-slot="avatar-wrapper"
      className={cn(AvatarStyles.wrapperStyle(), className)}
      {...remainingProps}
    >
      {avatar}
      <span
        data-slot="avatar-status"
        className={AvatarStyles.statusStyle({ size, status })}
      />
      {statusLabel !== undefined && (
        <span data-slot="avatar-status-label" className="sr-only">
          {statusLabel}
        </span>
      )}
    </span>
  );
};
