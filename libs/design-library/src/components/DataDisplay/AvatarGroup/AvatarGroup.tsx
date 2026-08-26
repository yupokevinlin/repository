import type { ComponentPropsWithRef, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { AvatarProps } from "../Avatar/Avatar";
import type { AvatarShape, AvatarSize } from "../Avatar/AvatarStyles";
import { AvatarGroupStyles } from "./AvatarGroupStyles";

export type AvatarGroupProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  /** `Avatar` elements. They render themselves; this only lays them out. */
  children: ReactNode;
  /**
   * How many to show before the rest collapse into a `+N` bubble. Omit to
   * show all of them.
   */
  max?: number;
  /**
   * Applied to every avatar in the group, overriding any `size` they set
   * themselves — a group of mismatched faces is not a group. Defaults to `"8"`.
   */
  size?: AvatarSize;
  /** Likewise applied to every avatar. Defaults to `"circle"`. */
  shape?: AvatarShape;
  /**
   * What the `+N` bubble means, in words. Defaults to `` (count) => `${count} more` ``.
   * A function rather than a string so the count can sit wherever the
   * language needs it.
   */
  overflowLabel?: (count: number) => string;
};

/**
 * Several people on one record — who is on a deal, who touched a document.
 *
 * The avatars overlap, so a row of them costs about half the width it
 * otherwise would, and `max` collapses the tail into a `+N` bubble.
 *
 * Children render themselves (§9.4): this is a layout, not a data carrier.
 * It does reach in to set `size` and `shape` on each one, because a group
 * whose faces are different sizes reads as an accident.
 *
 * Pass the avatars directly or as an array. A single fragment wrapping them
 * counts as one child — React's Children API does not look inside one — and
 * the group would see one avatar rather than five.
 *
 * @server-safe
 *
 * @example Everyone
 * ```tsx
 * <AvatarGroup>
 *   <Avatar name="K. Lin" />
 *   <Avatar name="M. Sato" />
 *   <Avatar name="R. Okafor" />
 * </AvatarGroup>
 * ```
 *
 * @example Capped, larger
 * ```tsx
 * <AvatarGroup max={3} size="10">
 *   {members.map((member) => (
 *     <Avatar key={member.id} name={member.name} src={member.avatarUrl} />
 *   ))}
 * </AvatarGroup>
 * ```
 *
 * @example In another language
 * ```tsx
 * <AvatarGroup max={3} overflowLabel={(count) => `${count} de plus`}>
 *   {avatars}
 * </AvatarGroup>
 * ```
 */
export const AvatarGroup = ({
  children,
  max,
  size: sizeProp,
  shape: shapeProp,
  overflowLabel: overflowLabelProp,
  className: classNameProp,
  ...remainingProps
}: AvatarGroupProps) => {
  const size: AvatarSize = sizeProp ?? "8";
  const shape: AvatarShape = shapeProp ?? "circle";
  const overflowLabel: (count: number) => string =
    overflowLabelProp ?? ((count: number): string => `${count} more`);

  const items: Array<ReactNode> = Children.toArray(children);
  const visible: Array<ReactNode> =
    max === undefined ? items : items.slice(0, max);
  const overflowCount: number = items.length - visible.length;

  return (
    <div
      data-slot="avatar-group"
      className={cn(AvatarGroupStyles.groupStyle(), classNameProp)}
      {...remainingProps}
    >
      {visible.map((child: ReactNode, index: number) => {
        const itemClassName: string = AvatarGroupStyles.itemStyle({
          size,
          shape,
          overlapped: index > 0,
        });

        // Children.toArray has already given each child a stable key. Reusing
        // it means removing someone from the middle of the group does not
        // shuffle everyone after them.
        const key: string =
          isValidElement(child) && child.key !== null ? child.key : `${index}`;

        return (
          <span
            key={key}
            data-slot="avatar-group-item"
            className={itemClassName}
          >
            {isValidElement<AvatarProps>(child)
              ? cloneElement(child, {
                  size,
                  shape,
                })
              : child}
          </span>
        );
      })}
      {overflowCount > 0 && (
        <span
          data-slot="avatar-group-overflow"
          className={cn(
            AvatarGroupStyles.overflowStyle({ size, shape }),
            AvatarGroupStyles.itemStyle({ size, shape, overlapped: true }),
          )}
        >
          <span aria-hidden="true">{`+${overflowCount}`}</span>
          <span className="sr-only">{overflowLabel(overflowCount)}</span>
        </span>
      )}
    </div>
  );
};
