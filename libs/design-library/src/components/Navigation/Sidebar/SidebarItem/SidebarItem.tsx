import type { ReactNode } from "react";

export interface SidebarItemProps {
  /**
   * The link, supplied by the consumer — `next/link`, a plain `<a>`, whatever
   * the app routes with. This package never imports a router (§11.1), and the
   * anchor is stretched over the whole row so the row is the click target
   * (§11.2).
   */
  children: ReactNode;
  /** Sized to the row. The only thing visible while the sidebar is collapsed. */
  icon?: ReactNode;
  /**
   * Whether this is the page the user is on. Sets `aria-current="page"`.
   *
   * It goes on the row rather than on the anchor, because the anchor belongs
   * to the consumer and this component will not reach inside it.
   */
  current?: boolean;
  /**
   * A `Badge`, a count, a status dot. Rendered after the label and lifted
   * above the stretched anchor so it stays clickable if it is interactive.
   * Hidden while collapsed, where there is no room for it.
   */
  trailing?: ReactNode;
}

/**
 * One row in a `Sidebar`.
 *
 * Declarative data only — **this component never renders** (§9.2). `Sidebar`
 * reads these props and renders the list markup, because only it knows the
 * collapsed state, the density and where the `<ul>` boundaries fall.
 *
 * **Two consequences of the stretched-link pattern** (§11.2), both worth
 * knowing before using it: text selection inside a row does not work, and
 * anything interactive in the row must sit above the anchor — pass it as
 * `trailing`, which does that for you.
 *
 * There is no `disabled`. A disabled link is not a thing HTML or ARIA
 * models — `aria-disabled` is not even valid on a `listitem` — and a row that
 * looks unavailable while still navigating is worse than one that is not there.
 * Where a role cannot reach a section, do not render the row, or render it
 * without a link.
 *
 * @server-safe
 */
export const SidebarItem = (_props: SidebarItemProps): null => null;
