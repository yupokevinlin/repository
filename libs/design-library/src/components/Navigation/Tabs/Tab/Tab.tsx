import type { ReactNode } from "react";

export interface TabProps {
  /** Identifies this tab. Pair it with a `TabPanel` carrying the same value. */
  value: string;
  /** What the tab is called. */
  label: ReactNode;
  /**
   * A number beside the label — "Unsettled 12". Rendered inside the tab, so it
   * is part of the tab's accessible name and a screen-reader user hears the
   * count without having to open the panel.
   */
  count?: number;
  /** Sized to the row. */
  icon?: ReactNode;
  /** Visible but not selectable. Arrow keys skip it. */
  disabled?: boolean;
}

/**
 * One tab inside `Tabs`.
 *
 * Declarative data only — **this component never renders** (§9.2). `Tabs` reads
 * these props and renders the strip, because only the strip can know which tab
 * is selected, which id each one needs, and where the roving tabindex sits.
 *
 * @server-safe
 */
export const Tab = (_props: TabProps): null => null;
