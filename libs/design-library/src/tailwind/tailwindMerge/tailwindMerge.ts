import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { allCustomColors } from '../theme/colors';
import { allCustomFontSizes } from '../theme/fontSizes';

/**
 * A tailwind-merge instance extended with the design library's custom theme.
 *
 * tailwind-merge v3 `DefaultThemeGroupIds` key reference:
 *   - `color`  → used by all color class groups (bg-*, text-*, border-*, ring-*, etc.)
 *   - `text`   → used by the `font-size` class group (text-xs, text-display-lg, etc.)
 *
 * ⚠️  Common mistakes (will cause TS2561):
 *   - `colors`    → WRONG. Must be `color`    (singular)
 *   - `fontSize`  → WRONG. Must be `text`      (the internal theme-group key)
 *   - `font-size` → WRONG. That is a class-group id, not a theme-group id
 *
 * Passing `color` ensures classes like `bg-brand`, `text-error`, `border-success`
 * are treated as members of the same color class group and deduplicated correctly
 * (e.g. `bg-brand bg-error` → `bg-error`).
 *
 * Passing `text` ensures custom font-size classes like `text-display-lg` are treated
 * as members of the font-size class group and deduplicated correctly
 * (e.g. `text-display-xl text-body-sm` → `text-body-sm`).
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [...allCustomColors],
      text: [...allCustomFontSizes],
    },
  },
});

/**
 * Merges class names with full Tailwind conflict resolution.
 *
 * Combines `clsx` (for conditional/array class composition) with the
 * design-library-aware `tailwind-merge` instance (for deduplication).
 *
 * @example
 * cn('bg-brand', 'bg-error')           // → 'bg-error'
 * cn('text-display-lg', 'text-body-sm') // → 'text-body-sm'
 * cn('px-4', condition && 'px-6')       // → 'px-4' or 'px-6'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

