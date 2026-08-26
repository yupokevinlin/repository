import { cva } from "class-variance-authority";

/**
 * An icon button is a square. This drops the horizontal padding `Button`'s
 * cva applies and pins the width to the height, so the target stays square
 * at every step of the §4 control scale.
 */
export const squareStyle = cva(["p-0"], {
  variants: {
    size: {
      "8": "w-8",
      "10": "w-10",
      "12": "w-12",
    },
  },
  defaultVariants: {
    size: "10",
  },
});

export const IconButtonStyles = {
  squareStyle,
};
