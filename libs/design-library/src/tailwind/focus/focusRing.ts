/**
 * The focus ring is one design decision, made once.
 *
 * Every focusable component composes {@link focusRingStyle} and supplies **only
 * the ring colour** from its own variant map — `focus-visible:outline-border-primary`,
 * `focus-visible:outline-border-error`, and so on. Never retype the geometry.
 *
 * @example
 * ```ts
 * export const badgeStyle = cva([
 *   "inline-flex items-center rounded-full",
 *   focusRingStyle,
 * ], {
 *   variants: {
 *     severity: {
 *       error: "bg-bg-error-soft text-fg-error-default focus-visible:outline-border-error",
 *     },
 *   },
 * });
 * ```
 */
export const focusRingStyle: string = [
  "focus:outline-none",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-dashed",
].join(" ");

/**
 * The same geometry with the `focus-visible:` prefix removed, so a Storybook
 * gallery can force the focus state on a component that is not actually focused.
 *
 * Only for `_storybookState`. Never use this in a component's real variant map —
 * it would paint a permanent ring.
 *
 * @example
 * ```ts
 * const forcedFocus: string = `${focusRingForcedStyle} outline-border-primary`;
 * ```
 */
export const focusRingForcedStyle: string = [
  "outline-2",
  "outline-offset-2",
  "outline-dashed",
].join(" ");
