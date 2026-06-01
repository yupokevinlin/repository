/**
 * Design library font-size scale.
 *
 * These names map to CSS custom properties defined via Tailwind v4 `@theme`.
 * They are passed to `extendTailwindMerge` so tailwind-merge correctly
 * deduplicates custom font-size classes (e.g. `text-display-lg` vs `text-display-sm`).
 *
 * Usage in CSS:
 *   @theme {
 *     --font-size-display-xl: 4rem;
 *     --font-size-display-lg: 3rem;
 *     ...
 *   }
 */

/** Display / heading sizes */
export const displayFontSizes = [
  'display-xl',
  'display-lg',
  'display-md',
  'display-sm',
] as const;

/** Body text sizes */
export const bodyFontSizes = [
  'body-lg',
  'body-md',
  'body-sm',
  'body-xs',
] as const;

/** Label / UI element sizes */
export const labelFontSizes = [
  'label-lg',
  'label-md',
  'label-sm',
] as const;

/** Code / monospace sizes */
export const codeFontSizes = [
  'code-lg',
  'code-sm',
] as const;

/** All custom font sizes combined — passed to tailwind-merge */
export const allCustomFontSizes = [
  ...displayFontSizes,
  ...bodyFontSizes,
  ...labelFontSizes,
  ...codeFontSizes,
] as const;

export type DisplayFontSize = (typeof displayFontSizes)[number];
export type BodyFontSize = (typeof bodyFontSizes)[number];
export type LabelFontSize = (typeof labelFontSizes)[number];
export type CodeFontSize = (typeof codeFontSizes)[number];
export type DesignFontSize = (typeof allCustomFontSizes)[number];

