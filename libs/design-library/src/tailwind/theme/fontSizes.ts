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
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
] as const;

/**
 * Section and card headings — the tier between display and body.
 *
 * `title-sm` shares a font size with `body-lg` on purpose: they differ by line
 * height and letter spacing, not size. A heading sits tighter than prose.
 */
export const titleFontSizes = ["title-lg", "title-md", "title-sm"] as const;

/** Body text sizes */
export const bodyFontSizes = [
  "body-lg",
  "body-md",
  "body-sm",
  "body-xs",
] as const;

/** Label / UI element sizes */
export const labelFontSizes = ["label-lg", "label-md", "label-sm"] as const;

/**
 * Micro sizes — eyebrows, badge text, table meta, chart axis labels.
 *
 * Three genuinely distinct steps, never one step reused. Decorative and
 * supporting text only: nothing a user has to read for long belongs here.
 */
export const microFontSizes = ["micro-lg", "micro-md", "micro-sm"] as const;

/** Code / monospace sizes */
export const codeFontSizes = ["code-lg", "code-sm"] as const;

/** All custom font sizes combined — passed to tailwind-merge */
export const allCustomFontSizes = [
  ...displayFontSizes,
  ...titleFontSizes,
  ...bodyFontSizes,
  ...labelFontSizes,
  ...microFontSizes,
  ...codeFontSizes,
] as const;

export type DisplayFontSize = (typeof displayFontSizes)[number];
export type TitleFontSize = (typeof titleFontSizes)[number];
export type BodyFontSize = (typeof bodyFontSizes)[number];
export type LabelFontSize = (typeof labelFontSizes)[number];
export type MicroFontSize = (typeof microFontSizes)[number];
export type CodeFontSize = (typeof codeFontSizes)[number];
export type DesignFontSize = (typeof allCustomFontSizes)[number];
