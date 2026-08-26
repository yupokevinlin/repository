import { cva } from "class-variance-authority";

export type SkeletonVariant = "text" | "circle" | "rect";

export const skeletonStyle = cva(["bg-bg-active shrink-0"], {
  variants: {
    variant: {
      // `1em` so a text skeleton tracks the type scale of whatever it sits in,
      // rather than pinning a height the surrounding text does not have.
      text: "h-[1em] w-full rounded-[0.25rem]",
      circle: "size-10 rounded-full",
      rect: "h-16 w-full rounded-md",
    },
    animated: {
      // Anyone who has asked for less motion gets a flat block instead.
      true: "animate-pulse motion-reduce:animate-none",
      false: "",
    },
  },
  defaultVariants: {
    variant: "text",
    animated: true,
  },
});

/** Stack for the multi-line text form. */
export const linesStyle = cva(["flex w-full flex-col gap-[0.5em]"]);

export const SkeletonStyles = { skeletonStyle, linesStyle };
