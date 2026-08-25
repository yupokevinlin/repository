import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type TypographyElement,
  typographyFontFamilies,
  type TypographyFontFamily,
  type TypographySize,
  TypographyStyles,
  type TypographyWeight,
  typographyWeights,
} from "../TypographyStyles";

export const typographySizes = [
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "body-xs",
  "label-lg",
  "label-md",
  "label-sm",
  "code-lg",
  "code-sm",
] as const satisfies Array<TypographySize>;

export const typographyElements = [
  "span",
  "p",
  "div",
] as const satisfies Array<TypographyElement>;

export { typographyFontFamilies, typographyWeights };
export type {
  TypographyElement,
  TypographyFontFamily,
  TypographySize,
  TypographyWeight,
};

/** `p`, `span` and `div` share one prop surface, so no generic is needed. */
export type TypographyProps = ComponentPropsWithRef<"span"> & {
  /**
   * Element to render. Closed union of `"span" | "p" | "div"` — never an
   * arbitrary component. Defaults to `"span"`; use `"p"` for real prose so
   * the document outline is right.
   */
  as?: TypographyElement;
  /** Step on the type scale. Line height rides along with each step. Defaults to `"body-md"`. */
  size?: TypographySize;
  /** Defaults to `"normal"`, or `"medium"` for label and code steps, which are UI text. */
  fontWeight?: TypographyWeight;
  /** Defaults to `"sans"`, or `"mono"` for code steps. */
  fontFamily?: TypographyFontFamily;
  /** The text. */
  children: ReactNode;
};

const defaultWeightForSize = (size: TypographySize): TypographyWeight =>
  size.startsWith("label") ? "medium" : "normal";

const defaultFamilyForSize = (size: TypographySize): TypographyFontFamily =>
  size.startsWith("code") ? "mono" : "sans";

/**
 * Every piece of text in the library goes through this, so the type scale is
 * applied in one place rather than re-derived per component.
 *
 * Reach for it for body copy, labels and inline text. For a heading use
 * `Heading`, which carries the correct element and a bold default — a
 * `Typography` styled to look like a heading is invisible to a screen reader's
 * document outline.
 *
 * @server-safe
 *
 * @example Minimal
 * ```tsx
 * <Typography>CIF Vancouver</Typography>
 * ```
 *
 * @example Real prose
 * ```tsx
 * <Typography as="p" size="body-lg">
 *   The safety data sheet lapses 02 Sep; arrival is 04 Sep.
 * </Typography>
 * ```
 *
 * @example A container number, in tabular figures
 * ```tsx
 * <Typography size="code-sm" className="numeric">
 *   MSKU 447188-2
 * </Typography>
 * ```
 */
export const Typography = ({
  as,
  size: sizeProp,
  fontWeight: fontWeightProp,
  fontFamily: fontFamilyProp,
  className: classNameProp,
  children,
  ...remainingProps
}: TypographyProps) => {
  // The union cannot unify its ref type in JSX, so pin it. `span`, `p` and
  // `div` share one prop surface, so nothing is lost at runtime.
  const Component = (as ?? "span") as "span";
  const size: TypographySize = sizeProp ?? "body-md";
  const fontWeight: TypographyWeight =
    fontWeightProp ?? defaultWeightForSize(size);
  const fontFamily: TypographyFontFamily =
    fontFamilyProp ?? defaultFamilyForSize(size);
  const className: string = classNameProp ?? "";

  return (
    <Component
      data-slot="typography"
      className={cn(
        TypographyStyles.textStyle({ size, fontWeight, fontFamily }),
        className,
      )}
      {...remainingProps}
    >
      {children}
    </Component>
  );
};
