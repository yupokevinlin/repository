import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";
import { MenuStyles } from "../menuStyles";

export type MenuGroupProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** What the group is called. */
  label: ReactNode;
  /** The `MenuItem`s in this group. */
  children: ReactNode;
};

/**
 * A labelled run of commands inside a menu — "Deal", "Export", "Danger zone".
 *
 * `role="group"` with `aria-labelledby` pointing at the heading, so a screen
 * reader announces which group an item belongs to. A visible heading with no
 * grouping semantics would say nothing at all.
 *
 * Separate from `MenuSeparator`: a separator is a rule with no name, this is a
 * name. Using a separator where a group belongs loses the label.
 *
 * @client
 *
 * @example Grouping row actions
 * ```tsx
 * <MenuGroup label="Deal">
 *   <MenuItem>Duplicate</MenuItem>
 *   <MenuItem>Amend</MenuItem>
 * </MenuGroup>
 * ```
 *
 * @example A destructive group at the end
 * ```tsx
 * <MenuGroup label="Danger zone">
 *   <MenuItem severity="error">Delete deal</MenuItem>
 * </MenuGroup>
 * ```
 *
 * @example With a separator between groups
 * ```tsx
 * <MenuGroup label="Deal">...</MenuGroup>
 * <MenuSeparator />
 * <MenuGroup label="Export">...</MenuGroup>
 * ```
 */
export const MenuGroup = ({
  label,
  children,
  className,
  ...remainingProps
}: MenuGroupProps) => {
  const labelId: string = useId();

  return (
    <div
      data-slot="menu-group"
      role="group"
      aria-labelledby={labelId}
      className={cn("flex flex-col", className)}
      {...remainingProps}
    >
      <span
        data-slot="menu-group-label"
        id={labelId}
        className={MenuStyles.menuGroupLabelStyle()}
      >
        {label}
      </span>
      {children}
    </div>
  );
};
