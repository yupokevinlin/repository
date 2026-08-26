import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement, useId } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  SidebarGroup,
  type SidebarGroupProps,
} from "./SidebarGroup/SidebarGroup";
import { SidebarItem, type SidebarItemProps } from "./SidebarItem/SidebarItem";
import {
  sidebarDensities,
  type SidebarDensity,
  SidebarStyles,
} from "./sidebarStyles";

export { sidebarDensities };
export type { SidebarDensity };

export interface SidebarProps {
  /** `SidebarGroup` and `SidebarItem` elements, in the order they appear. */
  children: ReactNode;
  /** Names the landmark. Required — a page can hold more than one `<nav>`. */
  "aria-label": string;
  /** Narrowed to a rail of icons. Controlled — pair with `onCollapsedChange`. */
  collapsed?: boolean;
  /** Collapsed on first render when uncontrolled. Defaults to `false`. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Defaults to `"comfortable"` (§4.2). */
  density?: SidebarDensity;
  /** A logo, a workspace switcher. Pinned above the navigation. */
  header?: ReactNode;
  /** A user menu, a version string. Pinned below it. */
  footer?: ReactNode;
  className?: string;
}

type SidebarChild =
  | ReactElement<SidebarGroupProps>
  | ReactElement<SidebarItemProps>;

const isGroup = (
  child: SidebarChild,
): child is ReactElement<SidebarGroupProps> => child.type === SidebarGroup;

/**
 * The navigation rail down the side of the app.
 *
 * A `<nav>` landmark with a required name, so a screen-reader user can jump
 * to it and tell it apart from any other `<nav>` on the page. The current row
 * carries `aria-current="page"`.
 *
 * **Links come from the consumer** (§11.1) — this package never imports a
 * router. The anchor is stretched over its row (§11.2), which makes the whole
 * row clickable without wrapping the consumer's link in one of ours. Two
 * consequences: text selection inside a row does not work, and anything else
 * interactive in a row must be passed as `trailing` so it sits above the
 * anchor.
 *
 * Collapsing narrows it to a rail of icons. The labels are **clipped, not
 * removed** — they stay in the accessibility tree, so a collapsed rail is
 * still navigable by screen reader rather than being a column of unnamed
 * icons.
 *
 * There is no provider and no cookie: `collapsed` is an ordinary controlled
 * prop, so persisting it across sessions is the app's decision and its
 * storage. For a small screen, render this inside a `Drawer` (5.3) rather than
 * building a second mobile mode into it.
 *
 * @client
 *
 * @example Grouped navigation
 * ```tsx
 * <Sidebar aria-label="Main" collapsed={collapsed} onCollapsedChange={setCollapsed}>
 *   <SidebarGroup label="Trading">
 *     <SidebarItem icon={<DealIcon />} current>
 *       <NextLink href="/app/deals">Deals</NextLink>
 *     </SidebarItem>
 *     <SidebarItem icon={<PartyIcon />} trailing={<Badge severity="error">3</Badge>}>
 *       <NextLink href="/app/approvals">Approvals</NextLink>
 *     </SidebarItem>
 *   </SidebarGroup>
 * </Sidebar>
 * ```
 *
 * @example Ungrouped, with a header and footer
 * ```tsx
 * <Sidebar aria-label="Main" header={<Logo />} footer={<UserMenu />}>
 *   <SidebarItem icon={<HomeIcon />}>
 *     <NextLink href="/app">Overview</NextLink>
 *   </SidebarItem>
 * </Sidebar>
 * ```
 *
 * @example On a small screen, inside a Drawer rather than a second mode
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} title="Menu" side="left">
 *   <Sidebar aria-label="Main">…</Sidebar>
 * </Drawer>
 * ```
 */
export const Sidebar = ({
  children,
  "aria-label": ariaLabel,
  collapsed: collapsedProp,
  defaultCollapsed,
  onCollapsedChange,
  density,
  header,
  footer,
  className,
}: SidebarProps) => {
  const [collapsed] = useControllableState<boolean>(
    collapsedProp,
    defaultCollapsed ?? false,
    onCollapsedChange,
  );

  const id: string = useId();

  const entries: Array<SidebarChild> = Children.toArray(children).filter(
    (child): child is SidebarChild =>
      isValidElement(child) &&
      (child.type === SidebarGroup || child.type === SidebarItem),
  );

  const renderItem = (
    item: ReactElement<SidebarItemProps>,
    key: string,
  ): ReactNode => {
    const current: boolean = item.props.current === true;

    return (
      <li
        key={key}
        data-slot="sidebar-item"
        data-current={current ? "true" : undefined}
        // On the row, not the anchor: the anchor is the consumer's, and this
        // component does not reach inside it.
        aria-current={current ? "page" : undefined}
        className={SidebarStyles.itemStyle({
          current,
          density,
          collapsed,
        })}
      >
        {item.props.icon !== undefined && (
          <span
            data-slot="sidebar-item-icon"
            aria-hidden="true"
            className={SidebarStyles.itemIconStyle()}
          >
            {item.props.icon}
          </span>
        )}
        <span
          data-slot="sidebar-item-label"
          className={SidebarStyles.itemLabelStyle({ collapsed })}
        >
          {item.props.children}
        </span>
        {item.props.trailing !== undefined && (
          <span
            data-slot="sidebar-item-trailing"
            className={SidebarStyles.itemTrailingStyle({ collapsed })}
          >
            {item.props.trailing}
          </span>
        )}
      </li>
    );
  };

  /**
   * Loose items are gathered into one list rather than each getting an `<ul>`
   * of its own — a run of single-item lists is what a screen reader would
   * announce otherwise.
   */
  const rendered: Array<ReactNode> = [];
  let loose: Array<ReactNode> = [];

  const flushLoose = (index: number): void => {
    if (loose.length === 0) {
      return;
    }
    rendered.push(
      <ul
        key={`list-${String(index)}`}
        data-slot="sidebar-list"
        className={SidebarStyles.listStyle({ density })}
      >
        {loose}
      </ul>,
    );
    loose = [];
  };

  entries.forEach((entry: SidebarChild, index: number) => {
    if (!isGroup(entry)) {
      loose.push(renderItem(entry, `item-${String(index)}`));
      return;
    }

    flushLoose(index);

    const labelId = `${id}-group-${String(index)}`;
    const items: Array<ReactElement<SidebarItemProps>> = Children.toArray(
      entry.props.children,
    ).filter(
      (child): child is ReactElement<SidebarItemProps> =>
        isValidElement(child) && child.type === SidebarItem,
    );

    rendered.push(
      <div
        key={`group-${String(index)}`}
        data-slot="sidebar-group"
        role="group"
        aria-labelledby={labelId}
        className={SidebarStyles.groupStyle({ density })}
      >
        <div
          data-slot="sidebar-group-label"
          id={labelId}
          className={SidebarStyles.groupLabelStyle({ collapsed })}
        >
          {entry.props.label}
        </div>
        <ul
          data-slot="sidebar-list"
          className={SidebarStyles.listStyle({ density })}
        >
          {items.map(
            (item: ReactElement<SidebarItemProps>, itemIndex: number) =>
              renderItem(
                item,
                `group-${String(index)}-item-${String(itemIndex)}`,
              ),
          )}
        </ul>
      </div>,
    );
  });

  flushLoose(entries.length);

  return (
    <nav
      data-slot="sidebar"
      data-state={collapsed ? "collapsed" : "expanded"}
      aria-label={ariaLabel}
      className={cn(SidebarStyles.rootStyle({ collapsed, density }), className)}
    >
      {header !== undefined && (
        <div data-slot="sidebar-header" className="shrink-0">
          {header}
        </div>
      )}
      <div data-slot="sidebar-body" className="min-h-0 flex-1">
        {rendered}
      </div>
      {footer !== undefined && (
        <div data-slot="sidebar-footer" className="mt-auto shrink-0">
          {footer}
        </div>
      )}
    </nav>
  );
};
