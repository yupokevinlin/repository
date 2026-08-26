import type { ReactNode } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";
import { tabId, tabPanelId } from "../tabsIds";
import { TabsStyles } from "../tabsStyles";

export interface TabPanelProps {
  /** The same `id` the `Tabs` strip was given. */
  id: string;
  /** The `value` of the tab this panel belongs to. */
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * The content behind one tab, placed by the layout rather than by `Tabs`.
 *
 * It is a **sibling** of the strip, not a child, wired only by the shared `id`
 * and the tab's `value`. That is what lets the layout decide what mounts:
 * render one panel and swap its contents, or render them all and hide the rest,
 * or mount an expensive one lazily. `Tabs` never has an opinion, because it
 * cannot lay the panel out.
 *
 * Focusable, per the APG: the panel takes `tabindex="0"` so a keyboard user
 * arriving from the strip lands in the content, which matters most when the
 * panel is a block of text with nothing else focusable in it.
 *
 * @server-safe
 *
 * @example One panel, contents swapped
 * ```tsx
 * <TabPanel id="deal" value={tab}>{content[tab]}</TabPanel>
 * ```
 *
 * @example All mounted, the layout hiding the rest
 * ```tsx
 * {sections.map((section) => (
 *   <TabPanel
 *     key={section.value}
 *     id="deal"
 *     value={section.value}
 *     className={section.value === tab ? undefined : "hidden"}
 *   >
 *     {section.content}
 *   </TabPanel>
 * ))}
 * ```
 */
export const TabPanel = ({ id, value, children, className }: TabPanelProps) => (
  <div
    data-slot="tab-panel"
    id={tabPanelId(id, value)}
    role="tabpanel"
    aria-labelledby={tabId(id, value)}
    tabIndex={0}
    className={cn(TabsStyles.panelStyle(), className)}
  >
    {children}
  </div>
);
