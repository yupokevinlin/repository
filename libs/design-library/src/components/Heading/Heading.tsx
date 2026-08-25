import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../tailwind/tailwindMerge/tailwindMerge";
import {
  type HeadingElement,
  type TypographyFontFamily,
  type TypographySize,
  TypographyStyles,
  type TypographyWeight,
} from "../Typography/TypographyStyles";

export const headingElements = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
] as const satisfies Array<HeadingElement>;

export type {
  HeadingElement,
  TypographyFontFamily as HeadingFontFamily,
  TypographySize as HeadingSize,
  TypographyWeight as HeadingWeight,
};

/** All six levels share one prop surface, so no generic is needed. */
export type HeadingProps = ComponentPropsWithRef<"h2"> & {
  /**
   * Heading level. All six are supported. Defaults to `"h2"` — `h1` is the
   * page title and belongs to the page, so a shared component should not
   * default to emitting one.
   *
   * Level is a document-structure decision, not a styling one: pick it from
   * where the heading sits in the outline, then set `size` separately if the
   * visual weight needs to differ.
   */
  as?: HeadingElement;
  /** Step on the type scale, independent of the level. Defaults to `"display-sm"`. */
  size?: TypographySize;
  /** Defaults to `"bold"`. */
  fontWeight?: TypographyWeight;
  /** Defaults to `"sans"`. */
  fontFamily?: TypographyFontFamily;
  /** The heading text. */
  children: ReactNode;
};

/**
 * A real `h1`–`h6`, styled from the same scale as `Typography`.
 *
 * Reach for it whenever text is a heading in the document outline. Do not use
 * it to make something merely look large — that is `Typography` with a display
 * size, and it keeps the outline honest.
 *
 * Level and size are deliberately separate props. A section heading that must
 * be `h3` for the outline but should look small is `as="h3" size="label-lg"`,
 * not an `h5`.
 *
 * @server-safe
 *
 * @example Minimal
 * ```tsx
 * <Heading>Kanto Polymer KK</Heading>
 * ```
 *
 * @example Level and size chosen independently
 * ```tsx
 * <Heading as="h1" size="display-lg">Pacific Trade Desk</Heading>
 * <Heading as="h3" size="label-lg">Cost sheet</Heading>
 * ```
 *
 * @example Inside a card
 * ```tsx
 * <Card>
 *   <Heading as="h3" size="display-sm">NPM-2601</Heading>
 *   <Typography as="p" size="body-sm">CIF Vancouver · USD 41,800</Typography>
 * </Card>
 * ```
 */
export const Heading = ({
  as,
  size: sizeProp,
  fontWeight: fontWeightProp,
  fontFamily: fontFamilyProp,
  className: classNameProp,
  children,
  ...remainingProps
}: HeadingProps) => {
  // The union cannot unify its ref type in JSX, so pin it. All six levels
  // share one prop surface, so nothing is lost at runtime.
  const Component = (as ?? "h2") as "h2";
  const size: TypographySize = sizeProp ?? "display-sm";
  const fontWeight: TypographyWeight = fontWeightProp ?? "bold";
  const fontFamily: TypographyFontFamily = fontFamilyProp ?? "sans";
  const className: string = classNameProp ?? "";

  return (
    <Component
      data-slot="heading"
      className={cn(
        "text-balance",
        TypographyStyles.textStyle({ size, fontWeight, fontFamily }),
        className,
      )}
      {...remainingProps}
    >
      {children}
    </Component>
  );
};
