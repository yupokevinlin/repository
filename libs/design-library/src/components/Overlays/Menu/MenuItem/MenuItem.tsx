import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";
import { type MenuItemSeverity, MenuStyles } from "../menuStyles";

export const menuItemSeverities = [
  "neutral",
  "error",
] as const satisfies Array<MenuItemSeverity>;

export type { MenuItemSeverity };

export type MenuItemProps = Omit<
  ComponentPropsWithRef<"button">,
  "type" | "children"
> & {
  /** What the command is called. */
  children: ReactNode;
  /** Icon before the label. */
  startIcon?: ReactNode;
  /** A shortcut or hint shown at the trailing edge — pass a `Kbd`. */
  shortcut?: ReactNode;
  /**
   * Only `"neutral"` and `"error"` (§4.1). A command is either ordinary or
   * destructive; the other severities describe states, and a command is not a
   * state.
   */
  severity?: MenuItemSeverity;
};

/**
 * One command in a menu.
 *
 * A real `<button role="menuitem">`, rendered by itself (§9.4) — the parent
 * menu lays it out and drives the keyboard, but does not build it from data.
 *
 * `tabIndex={-1}` because the menu owns the tab order: Tab enters and leaves
 * the menu as a whole, arrows move within it, and the parent moves focus
 * directly. That is the APG menu pattern, and it is the opposite of a listbox,
 * where focus never leaves the trigger.
 *
 * @client
 *
 * @example A row action
 * ```tsx
 * <MenuItem onClick={() => duplicate(deal.id)}>Duplicate</MenuItem>
 * ```
 *
 * @example Destructive, with a shortcut
 * ```tsx
 * <MenuItem severity="error" shortcut={<Kbd>Del</Kbd>} onClick={remove}>
 *   Delete deal
 * </MenuItem>
 * ```
 *
 * @example Unavailable, with the reason in a Tooltip on the trigger
 * ```tsx
 * <MenuItem disabled>Settle</MenuItem>
 * ```
 */
export const MenuItem = ({
  children,
  startIcon,
  shortcut,
  severity: severityProp,
  disabled,
  className,
  ...remainingProps
}: MenuItemProps) => {
  const severity: MenuItemSeverity = severityProp ?? "neutral";

  return (
    <button
      data-slot="menu-item"
      type="button"
      role="menuitem"
      // The menu is one tab stop; the arrows move within it.
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled === true ? true : undefined}
      className={cn(
        MenuStyles.menuItemStyle({
          severity,
          disabled: disabled === true,
        }),
        "focus:outline-none focus-visible:bg-bg-hover",
        className,
      )}
      {...remainingProps}
    >
      {startIcon !== undefined && (
        <span data-slot="menu-item-icon" className="size-4 shrink-0">
          {startIcon}
        </span>
      )}
      <span data-slot="menu-item-label" className="min-w-0 flex-1 truncate">
        {children}
      </span>
      {shortcut !== undefined && (
        <span data-slot="menu-item-shortcut" className="shrink-0 text-fg-muted">
          {shortcut}
        </span>
      )}
    </button>
  );
};
