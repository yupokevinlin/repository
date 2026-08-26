import type { KeyboardEvent, ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { Tab, type TabProps } from "./Tab/Tab";
import { tabId, tabPanelId } from "./tabsIds";
import {
  type TabsOrientation,
  tabsOrientations,
  TabsStyles,
} from "./tabsStyles";

export { tabsOrientations };
export type { TabsOrientation };

export interface TabsProps {
  /**
   * Ties the strip to its panels. Both sides derive their ids from it, which
   * is what lets a `TabPanel` sit anywhere in the layout. Must be unique on
   * the page.
   */
  id: string;
  /** The selected tab's `value`. Controlled only. */
  value: string;
  onValueChange: (value: string) => void;
  /** `Tab` elements. Anything else is ignored. */
  children: ReactNode;
  /** Defaults to `"horizontal"`. */
  orientation?: TabsOrientation;
  /** Names the strip. Required when the page has more than one. */
  "aria-label"?: string;
  className?: string;
}

const isEnabled = (tab: ReactElement<TabProps>): boolean =>
  tab.props.disabled !== true;

/**
 * The tab strip. **The strip only** — it renders no panels.
 *
 * A `TabPanel` is a sibling placed by the layout and wired by a shared `id`,
 * so the layout decides what mounts and where. That matters in an ERP screen
 * where one tab's panel is a table that must sit in a different grid cell from
 * the strip, and it keeps `Tabs` from owning content it cannot lay out.
 *
 * `Tab` children are data carriers that render nothing (§9.2): the strip owns
 * the ids, the roving tabindex and the selected marker, because only it knows
 * them.
 *
 * Follows the APG's automatic activation — arrowing to a tab selects it. That
 * is the right choice when panels are already mounted, and wrong when they are
 * expensive; a panel the layout has not mounted costs nothing to arrow past.
 *
 * `aria-controls` is set only on the selected tab, since it is the only one
 * whose panel is guaranteed to exist.
 *
 * @client
 *
 * @example A strip over its panels
 * ```tsx
 * <Tabs id="deal" value={tab} onValueChange={setTab} aria-label="Deal sections">
 *   <Tab value="terms" label="Terms" />
 *   <Tab value="items" label="Line items" count={4} />
 *   <Tab value="docs" label="Documents" />
 * </Tabs>
 *
 * <TabPanel id="deal" value="terms">
 *   <TermsForm />
 * </TabPanel>
 * ```
 *
 * @example Panels placed elsewhere in the layout
 * ```tsx
 * <aside><Tabs id="deal" orientation="vertical" value={tab} onValueChange={setTab}>…</Tabs></aside>
 * <main><TabPanel id="deal" value={tab}>{content[tab]}</TabPanel></main>
 * ```
 */
export const Tabs = ({
  id,
  value,
  onValueChange,
  children,
  orientation,
  "aria-label": ariaLabel,
  className,
}: TabsProps) => {
  const tabs: Array<ReactElement<TabProps>> = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> =>
      isValidElement(child) && child.type === Tab,
  );

  const isVertical: boolean = orientation === "vertical";
  const enabled: Array<ReactElement<TabProps>> = tabs.filter(isEnabled);

  // Focus follows the selection, which is what automatic activation means:
  // the roving tabindex has just moved to another tab, so leaving DOM focus
  // behind would strand it on an element with tabindex="-1" and leave a
  // screen reader announcing the tab the user just left.
  const selectAndFocus = (next: string): void => {
    onValueChange(next);
    document.getElementById(tabId(id, next))?.focus();
  };

  const move = (step: number): void => {
    if (enabled.length === 0) {
      return;
    }
    const current: number = enabled.findIndex(
      (tab: ReactElement<TabProps>) => tab.props.value === value,
    );
    // From nowhere, Right lands on the first and Left on the last — the same
    // wrap the arrows give from either end.
    const from: number = current === -1 ? (step > 0 ? -1 : 0) : current;
    const next: number = (from + step + enabled.length) % enabled.length;
    selectAndFocus(enabled[next].props.value);
  };

  // On each tab rather than on the strip: per the APG the tablist itself is
  // never focusable, so a handler there would only ever see keys that bubbled
  // up from a tab anyway.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const forward: string = isVertical ? "ArrowDown" : "ArrowRight";
    const backward: string = isVertical ? "ArrowUp" : "ArrowLeft";

    switch (event.key) {
      case forward:
        event.preventDefault();
        move(1);
        return;
      case backward:
        event.preventDefault();
        move(-1);
        return;
      case "Home":
        if (enabled.length > 0) {
          event.preventDefault();
          selectAndFocus(enabled[0].props.value);
        }
        return;
      case "End":
        if (enabled.length > 0) {
          event.preventDefault();
          selectAndFocus(enabled[enabled.length - 1].props.value);
        }
        return;
      default:
    }
  };

  return (
    <div
      data-slot="tabs"
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={isVertical ? "vertical" : "horizontal"}
      className={cn(TabsStyles.tablistStyle({ orientation }), className)}
    >
      {tabs.map((tab: ReactElement<TabProps>) => {
        const selected: boolean = tab.props.value === value;
        const disabled: boolean = tab.props.disabled === true;

        return (
          <button
            key={tab.props.value}
            id={tabId(id, tab.props.value)}
            data-slot="tab"
            type="button"
            role="tab"
            aria-selected={selected}
            // Only on the selected tab: it is the only one whose panel is
            // certain to be in the document, and aria-controls pointing at a
            // missing id is worse than not saying anything.
            aria-controls={
              selected ? tabPanelId(id, tab.props.value) : undefined
            }
            aria-disabled={disabled ? true : undefined}
            // A roving tabindex, so Tab moves past the whole strip rather than
            // through every tab in it.
            tabIndex={selected ? 0 : -1}
            onKeyDown={onKeyDown}
            className={TabsStyles.tabStyle({
              orientation,
              selected,
              disabled,
            })}
            onClick={() => {
              if (!disabled) {
                onValueChange(tab.props.value);
              }
            }}
          >
            {tab.props.icon !== undefined && (
              <span
                data-slot="tab-icon"
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center"
              >
                {tab.props.icon}
              </span>
            )}
            <span data-slot="tab-label">{tab.props.label}</span>
            {/* A real space, not just the flex gap: the gap separates the two
                visually but leaves the accessible name as "Line items4" in
                any name computation that concatenates text nodes directly. */}
            {tab.props.count !== undefined && (
              <>
                {" "}
                <span
                  data-slot="tab-count"
                  className={TabsStyles.countStyle({ selected })}
                >
                  {tab.props.count}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};
