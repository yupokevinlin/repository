import { cva } from "class-variance-authority";

import type { DesignFontSize } from "../../tailwind/theme/fontSizes";

/** Elements `Typography` may render. Closed union — never `ElementType`. */
export type TypographyElement = "span" | "p" | "div";

/** Elements `Heading` may render. All six levels are supported. */
export type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * The type scale, taken straight from `fontSizes.ts` so there is one list.
 * Line heights ride along with each `--text-*` token, so the size variant
 * below sets only the font size.
 */
export type TypographySize = DesignFontSize;

export const typographyWeights = [
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
] as const;

export type TypographyWeight = (typeof typographyWeights)[number];

export const typographyFontFamilies = ["sans", "mono"] as const;

export type TypographyFontFamily = (typeof typographyFontFamilies)[number];

export const textStyle = cva("", {
  variants: {
    size: {
      "display-xl": "text-display-xl",
      "display-lg": "text-display-lg",
      "display-md": "text-display-md",
      "display-sm": "text-display-sm",
      "body-lg": "text-body-lg",
      "body-md": "text-body-md",
      "body-sm": "text-body-sm",
      "body-xs": "text-body-xs",
      "label-lg": "text-label-lg",
      "label-md": "text-label-md",
      "label-sm": "text-label-sm",
      "code-lg": "text-code-lg",
      "code-sm": "text-code-sm",
    } satisfies Record<TypographySize, string>,
    fontWeight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    } satisfies Record<TypographyWeight, string>,
    fontFamily: {
      sans: "font-sans",
      mono: "font-mono",
    } satisfies Record<TypographyFontFamily, string>,
  },
  defaultVariants: {
    size: "body-md",
    fontWeight: "normal",
    fontFamily: "sans",
  },
});

export const TypographyStyles = { textStyle };
