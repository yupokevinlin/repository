import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type BadgeAppearance,
  type BadgeSeverity,
  type BadgeSize,
  BadgeStyles,
} from "./BadgeStyles";

export const badgeSeverities = [
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const satisfies Array<BadgeSeverity>;

export const badgeAppearances = [
  "solid",
  "soft",
  "outline",
] as const satisfies Array<BadgeAppearance>;

export const badgeSizes = ["5", "6"] as const satisfies Array<BadgeSize>;

export type { BadgeAppearance, BadgeSeverity, BadgeSize };

type BadgeBaseProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /**
   * Semantic state. Defaults to `"neutral"`.
   *
   * Colour is never the only carrier of meaning: if the severity says
   * something the visible text does not, supply an `aria-label` that does.
   */
  severity?: BadgeSeverity;
  /** Fill style. Defaults to `"soft"`, which is the least shouty at table density. */
  appearance?: BadgeAppearance;
  /**
   * Height as a Tailwind size unit (1 unit = 4px). `"5"` = 20px, `"6"` = 24px.
   * Defaults to `"6"`.
   */
  size?: BadgeSize;
  /**
   * Renders a leading dot in the badge's own text colour. Use it for record
   * state — “At port”, “On water” — where the dot reinforces the severity the
   * text already names.
   */
  dot?: boolean;
  /** Icon rendered before the label, after the dot. Sized to match `size`. */
  icon?: ReactNode;
  /**
   * Clamps a numeric child. `max={99}` renders `99+` for anything above it.
   * Ignored when the child is not a number.
   */
  max?: number;
};

/**
 * Without children the badge has no accessible name, so `aria-label` becomes
 * required at the type level rather than being a thing you remember.
 */
export type BadgeProps = BadgeBaseProps &
  ({ children: ReactNode } | { children?: never; "aria-label": string });

const clamp = (children: ReactNode, max: number | undefined): ReactNode => {
  if (max === undefined) {
    return children;
  }
  const value: number =
    typeof children === "number" ? children : Number(children);
  if (!Number.isFinite(value)) {
    return children;
  }
  return value > max ? `${max}+` : children;
};

/**
 * A pill for counts and record state.
 *
 * Reach for it for a count on a nav item or tab, or for a record's state with
 * `dot` set. Do not use it for a removable filter chip — that is `Tag`, which
 * is interactive and owns its own focus behaviour.
 *
 * @server-safe
 *
 * @example A count
 * ```tsx
 * <Badge severity="error">3</Badge>
 * <Badge severity="info" max={99}>{147}</Badge>
 * ```
 *
 * @example Record state, where the dot reinforces the text
 * ```tsx
 * <Badge severity="warning" dot>At port</Badge>
 * <Badge severity="success" dot>Booked</Badge>
 * ```
 *
 * @example On a nav item, where colour alone would carry the meaning
 * ```tsx
 * <SidebarItem href="/app/approvals">
 *   Approvals
 *   <Badge severity="error" aria-label="3 approvals overdue">3</Badge>
 * </SidebarItem>
 * ```
 */
export const Badge = ({
  severity: severityProp,
  appearance: appearanceProp,
  size: sizeProp,
  dot,
  icon,
  max,
  className: classNameProp,
  children,
  ...remainingProps
}: BadgeProps) => {
  const severity: BadgeSeverity = severityProp ?? "neutral";
  const appearance: BadgeAppearance = appearanceProp ?? "soft";
  const size: BadgeSize = sizeProp ?? "6";
  const className: string = classNameProp ?? "";

  return (
    <span
      data-slot="badge"
      className={cn(
        BadgeStyles.badgeStyle({ severity, appearance, size }),
        className,
      )}
      {...remainingProps}
    >
      {dot && (
        <span
          data-slot="badge-dot"
          aria-hidden="true"
          className={BadgeStyles.dotStyle({ size })}
        />
      )}
      {icon && (
        <span
          data-slot="badge-icon"
          aria-hidden="true"
          className={BadgeStyles.iconStyle({ size })}
        >
          {icon}
        </span>
      )}
      {children !== undefined && (
        <span data-slot="badge-label">{clamp(children, max)}</span>
      )}
    </span>
  );
};
