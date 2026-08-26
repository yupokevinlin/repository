import type { ReactNode } from "react";

export interface SidebarGroupProps {
  /** The heading over the group. Also names the group for a screen reader. */
  label: string;
  /** `SidebarItem` elements. */
  children: ReactNode;
}

/**
 * A labelled run of rows inside a `Sidebar` — "Trading", "Logistics",
 * "Admin".
 *
 * Declarative data only — **this component never renders** (§9.2). `Sidebar`
 * reads the label and the items and renders both.
 *
 * It exists alongside `SidebarItem` rather than being folded into it because
 * it carries genuinely different data (§9.1): a heading and a run of rows, not
 * a row.
 *
 * @server-safe
 */
export const SidebarGroup = (_props: SidebarGroupProps): null => null;
