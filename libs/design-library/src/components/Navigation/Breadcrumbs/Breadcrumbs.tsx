import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement, useEffect, useId, useState } from "react";

import { usePosition } from "../../../hooks/usePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { Portal } from "../../Overlays/Portal";
import { Breadcrumb, type BreadcrumbProps } from "./Breadcrumb/Breadcrumb";
import {
  breadcrumbsDensities,
  type BreadcrumbsDensity,
  BreadcrumbsStyles,
} from "./breadcrumbsStyles";

export { breadcrumbsDensities };
export type { BreadcrumbsDensity };

export interface BreadcrumbsProps {
  /** `Breadcrumb` elements, from the root of the trail to where the user is. */
  children: ReactNode;
  /**
   * How many crumbs to show before the middle collapses behind a "…".
   * Defaults to no limit. The first and the last are always shown.
   */
  maxItems?: number;
  /** Between crumbs. Defaults to `"/"`, and is hidden from screen readers. */
  separator?: ReactNode;
  /** Names the landmark. Defaults to `"Breadcrumb"`. */
  "aria-label"?: string;
  /** Names the "…" button. Defaults to `"Show the rest of the trail"`. */
  collapseLabel?: string;
  /** Defaults to `"comfortable"` (§4.2). */
  density?: BreadcrumbsDensity;
  className?: string;
}

/**
 * The trail of where the user is — Deals → NPM-2601 → Shipment.
 *
 * A `<nav>` landmark around an `<ol>`, because the order is the meaning. The
 * last crumb carries `aria-current="page"` and is not a link: it is the page
 * the user is already on.
 *
 * Links come from the consumer (§11.1) and are styled by descendant selector,
 * so this package never imports a router.
 *
 * Past `maxItems`, the middle collapses behind a "…". That button is a
 * **disclosure**, not a menu: what it opens is a list of links, and a
 * `role="menu"` would tell a screen reader to expect commands and put it into
 * a keyboard mode built for them. Tab moves through the list exactly as it
 * does through the trail itself.
 *
 * @client
 *
 * @example A trail
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumb>
 *     <NextLink href="/app/deals">Deals</NextLink>
 *   </Breadcrumb>
 *   <Breadcrumb>
 *     <NextLink href="/app/deals/NPM-2601">NPM-2601</NextLink>
 *   </Breadcrumb>
 *   <Breadcrumb>Shipment</Breadcrumb>
 * </Breadcrumbs>
 * ```
 *
 * @example Collapsing a long one
 * ```tsx
 * <Breadcrumbs maxItems={3}>{crumbs}</Breadcrumbs>
 * ```
 *
 * @example A different separator
 * ```tsx
 * <Breadcrumbs separator="›">{crumbs}</Breadcrumbs>
 * ```
 */
export const Breadcrumbs = ({
  children,
  maxItems,
  separator,
  "aria-label": ariaLabel,
  collapseLabel,
  density,
  className,
}: BreadcrumbsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const listId: string = useId();

  const { anchorRef, floatingRef } = usePosition<
    HTMLButtonElement,
    HTMLUListElement
  >({
    open,
    placement: "bottom",
    alignment: "start",
    offset: 4,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      const target: Node | null =
        event.target instanceof Node ? event.target : null;
      if (target === null) {
        return;
      }
      if (floatingRef.current?.contains(target) === true) {
        // A click on a link inside the list closes it on the way out, so a
        // client-side route change does not leave it hanging over the page
        // that loads next. Handled here rather than with a JSX handler on the
        // <li>, which would put a click listener on a non-interactive element.
        if (target instanceof Element && target.closest("a") !== null) {
          setOpen(false);
        }
        return;
      }
      if (anchorRef.current?.contains(target) === true) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
        anchorRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, anchorRef, floatingRef]);

  const crumbs: Array<ReactElement<BreadcrumbProps>> = Children.toArray(
    children,
  ).filter(
    (child): child is ReactElement<BreadcrumbProps> =>
      isValidElement(child) && child.type === Breadcrumb,
  );

  const limit: number = maxItems ?? crumbs.length;
  const collapses: boolean = crumbs.length > limit && limit >= 2;

  // The first and the last are the two that orient the user: where the trail
  // starts and where they are. Everything between them is what folds away.
  const shown: Array<ReactElement<BreadcrumbProps>> = collapses
    ? [crumbs[0], ...crumbs.slice(crumbs.length - (limit - 1))]
    : crumbs;
  const hidden: Array<ReactElement<BreadcrumbProps>> = collapses
    ? crumbs.slice(1, crumbs.length - (limit - 1))
    : [];

  const separatorNode = (key: string): ReactNode => (
    <span
      key={key}
      data-slot="breadcrumbs-separator"
      aria-hidden="true"
      className={BreadcrumbsStyles.separatorStyle()}
    >
      {separator ?? "/"}
    </span>
  );

  const items: Array<ReactNode> = [];

  shown.forEach((crumb: ReactElement<BreadcrumbProps>, index: number): void => {
    const isLastShown: boolean = index === shown.length - 1;
    const isCurrent: boolean = crumb.props.current ?? isLastShown;

    items.push(
      <li
        key={`crumb-${String(index)}`}
        data-slot="breadcrumbs-item"
        className={cn(
          BreadcrumbsStyles.itemStyle({ density }),
          BreadcrumbsStyles.linkStyle(),
        )}
      >
        {isCurrent ? (
          <span
            data-slot="breadcrumbs-current"
            aria-current="page"
            className={BreadcrumbsStyles.currentStyle()}
          >
            {crumb.props.children}
          </span>
        ) : (
          crumb.props.children
        )}
        {!isLastShown && separatorNode(`sep-${String(index)}`)}
      </li>,
    );

    // The collapse sits where the folded crumbs were — after the first.
    if (index === 0 && collapses) {
      items.push(
        <li
          key="collapse"
          data-slot="breadcrumbs-collapse"
          className={BreadcrumbsStyles.itemStyle({ density })}
        >
          <button
            data-slot="breadcrumbs-collapse-trigger"
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={collapseLabel ?? "Show the rest of the trail"}
            ref={anchorRef}
            className={BreadcrumbsStyles.collapseTriggerStyle()}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {"…"}
          </button>
          {separatorNode("sep-collapse")}
        </li>,
      );
    }
  });

  return (
    <nav
      data-slot="breadcrumbs"
      aria-label={ariaLabel ?? "Breadcrumb"}
      className={className}
    >
      <ol
        data-slot="breadcrumbs-list"
        className={BreadcrumbsStyles.listStyle({ density })}
      >
        {items}
      </ol>
      {open && (
        <Portal>
          <ul
            data-slot="breadcrumbs-collapse-list"
            id={listId}
            ref={floatingRef}
            className={BreadcrumbsStyles.collapseListStyle()}
          >
            {hidden.map(
              (crumb: ReactElement<BreadcrumbProps>, index: number) => (
                <li
                  key={`hidden-${String(index)}`}
                  data-slot="breadcrumbs-collapse-item"
                  className={BreadcrumbsStyles.collapseItemStyle()}
                >
                  {crumb.props.children}
                </li>
              ),
            )}
          </ul>
        </Portal>
      )}
    </nav>
  );
};
