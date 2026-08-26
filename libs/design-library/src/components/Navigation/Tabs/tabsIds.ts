/**
 * The wiring between a `Tabs` strip and a `TabPanel` sibling.
 *
 * Both sides derive the same two ids from the `id` the caller gives them and
 * the tab's `value`, which is what lets the panel be placed anywhere in the
 * layout — a column away, or in a different component entirely — without a
 * Context provider carrying the connection. `ToastProvider` is the only
 * provider this package allows (§16), so the wiring has to be computable.
 */
export const tabId = (id: string, value: string): string =>
  `${id}-tab-${value}`;

export const tabPanelId = (id: string, value: string): string =>
  `${id}-panel-${value}`;
