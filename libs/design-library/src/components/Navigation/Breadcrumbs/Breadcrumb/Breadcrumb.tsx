import type { ReactNode } from "react";

export interface BreadcrumbProps {
  /**
   * The crumb. A link for anywhere the user can go back to — supplied by the
   * consumer (§11.1), since this package never imports a router — or plain
   * text for the page they are on.
   */
  children: ReactNode;
  /**
   * Forces current-page treatment. The last crumb is current by default, so
   * this is only needed where the trail ends somewhere other than the end.
   */
  current?: boolean;
}

/**
 * One crumb inside `Breadcrumbs`.
 *
 * Declarative data only — **this component never renders** (§9.2).
 * `Breadcrumbs` reads these props and renders the list markup, the separators,
 * `aria-current` on the last one, and the collapse when the trail is too long
 * — none of which a crumb can know about itself.
 *
 * @server-safe
 */
export const Breadcrumb = (_props: BreadcrumbProps): null => null;
