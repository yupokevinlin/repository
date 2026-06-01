/**
 * Design library color palette.
 *
 * These names map to CSS custom properties defined via Tailwind v4 `@theme`.
 * They are also passed to `extendTailwindMerge` so tailwind-merge correctly
 * deduplicates custom color classes (e.g. `bg-brand` vs `bg-brand-muted`).
 *
 * Usage in CSS:
 *   @theme {
 *     --color-brand:          oklch(55% 0.22 260);
 *     --color-brand-muted:    oklch(75% 0.12 260);
 *     ...
 *   }
 */

/** Brand colors */
export const brandColors = [
  'brand',
  'brand-muted',
  'brand-subtle',
  'brand-emphasis',
] as const;

/** Neutral / gray scale */
export const neutralColors = [
  'neutral-50',
  'neutral-100',
  'neutral-200',
  'neutral-300',
  'neutral-400',
  'neutral-500',
  'neutral-600',
  'neutral-700',
  'neutral-800',
  'neutral-900',
  'neutral-950',
] as const;

/** Semantic / status colors */
export const semanticColors = [
  'success',
  'success-muted',
  'warning',
  'warning-muted',
  'error',
  'error-muted',
  'info',
  'info-muted',
] as const;

/** Surface / background colors */
export const surfaceColors = [
  'surface',
  'surface-raised',
  'surface-overlay',
  'surface-sunken',
] as const;

/** All custom colors combined — passed to tailwind-merge */
export const allCustomColors = [
  ...brandColors,
  ...neutralColors,
  ...semanticColors,
  ...surfaceColors,
] as const;

export type BrandColor = (typeof brandColors)[number];
export type NeutralColor = (typeof neutralColors)[number];
export type SemanticColor = (typeof semanticColors)[number];
export type SurfaceColor = (typeof surfaceColors)[number];
export type DesignColor = (typeof allCustomColors)[number];

