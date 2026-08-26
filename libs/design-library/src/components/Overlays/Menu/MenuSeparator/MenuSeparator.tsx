import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";
import { MenuStyles } from "../menuStyles";

export type MenuSeparatorProps = ComponentPropsWithRef<"div">;

/**
 * A rule between runs of commands.
 *
 * `role="separator"` so it is announced as a divider rather than skipped
 * silently — a menu that jumps from "Duplicate" to "Delete" with no audible
 * break reads as one undifferentiated list.
 *
 * For a run of commands that has a name, use `MenuGroup` instead: a separator
 * carries no label.
 *
 * @client
 *
 * @example Between two runs
 * ```tsx
 * <MenuItem>Duplicate</MenuItem>
 * <MenuSeparator />
 * <MenuItem severity="error">Delete deal</MenuItem>
 * ```
 *
 * @example Between groups
 * ```tsx
 * <MenuGroup label="Deal">...</MenuGroup>
 * <MenuSeparator />
 * <MenuGroup label="Export">...</MenuGroup>
 * ```
 *
 * @example Never as the first or last child — a rule against nothing
 * ```tsx
 * <MenuItem>Amend</MenuItem>
 * <MenuSeparator />
 * <MenuItem>Export</MenuItem>
 * ```
 */
export const MenuSeparator = ({
  className,
  ...remainingProps
}: MenuSeparatorProps) => (
  <div
    data-slot="menu-separator"
    role="separator"
    className={cn(MenuStyles.menuSeparatorStyle(), className)}
    {...remainingProps}
  />
);
