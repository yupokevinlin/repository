import type { ComponentPropsWithRef, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { ButtonSize, ButtonVariant } from "../Button/ButtonStyles";
import {
  type ButtonGroupOrientation,
  ButtonGroupStyles,
} from "./ButtonGroupStyles";

export const buttonGroupOrientations = [
  "horizontal",
  "vertical",
] as const satisfies Array<ButtonGroupOrientation>;

export type { ButtonGroupOrientation };

/** The props this reaches in to set. Both `Button` and `IconButton` have them. */
interface GroupedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ItemPosition = "first" | "middle" | "last" | "only";

const positionOf = (index: number, count: number): ItemPosition => {
  if (count === 1) {
    return "only";
  }
  if (index === 0) {
    return "first";
  }
  if (index === count - 1) {
    return "last";
  }
  return "middle";
};

export type ButtonGroupProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  /**
   * `Button` or `IconButton` elements. They render themselves; this joins
   * them up.
   */
  children: ReactNode;
  /** Defaults to `"horizontal"`. */
  orientation?: ButtonGroupOrientation;
  /**
   * Applied to every button, overriding any `variant` they set themselves.
   * Omit to leave each button's own variant alone — but a joined group of
   * mixed fills rarely reads as one control.
   */
  variant?: ButtonVariant;
  /** Likewise applied to every button. Heights must match or the join breaks. */
  size?: ButtonSize;
};

/**
 * Related buttons joined into one control — a segmented view switch, a
 * save-and-menu pair, a set of table actions.
 *
 * It owns the fiddly part: squaring the inner corners so the set reads as one
 * thing, and pulling each button back by a hairline so two adjacent outlined
 * buttons share a border rather than stacking two.
 *
 * Children render themselves (§9.4). This is `role="group"` and nothing more —
 * it carries no selection state and no roving tabindex. A group where one
 * option is chosen and the others are not is `ToggleGroup`, which has toolbar
 * semantics; this is just layout, so give it an `aria-label` when the set
 * needs a name.
 *
 * Pass the buttons directly or as an array — a fragment wrapping them counts
 * as one child.
 *
 * @server-safe
 *
 * @example A pair
 * ```tsx
 * <ButtonGroup aria-label="Deal actions">
 *   <Button>Approve</Button>
 *   <Button>Reject</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Outlined, so the shared border shows
 * ```tsx
 * <ButtonGroup variant="default-outline" size="8" aria-label="View">
 *   <Button>Table</Button>
 *   <Button>Board</Button>
 *   <Button>Calendar</Button>
 * </ButtonGroup>
 * ```
 *
 * @example A button and its overflow menu
 * ```tsx
 * <ButtonGroup>
 *   <Button>Save</Button>
 *   <IconButton icon={<ChevronDownIcon />} aria-label="More save options" />
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = ({
  children,
  orientation: orientationProp,
  variant,
  size,
  className: classNameProp,
  ...remainingProps
}: ButtonGroupProps) => {
  const orientation: ButtonGroupOrientation = orientationProp ?? "horizontal";
  const items: Array<ReactNode> = Children.toArray(children);

  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(
        ButtonGroupStyles.groupStyle({ orientation }),
        classNameProp,
      )}
      {...remainingProps}
    >
      {items.map((child: ReactNode, index: number) => {
        if (!isValidElement<GroupedButtonProps>(child)) {
          return child;
        }

        const itemClassName: string = ButtonGroupStyles.itemStyle({
          orientation,
          position: positionOf(index, items.length),
        });

        return cloneElement(child, {
          // Only override what the group was actually told to set, so a
          // caller can still vary one button inside an otherwise plain group.
          ...(variant === undefined ? {} : { variant }),
          ...(size === undefined ? {} : { size }),
          className: cn(child.props.className, itemClassName),
        });
      })}
    </div>
  );
};
