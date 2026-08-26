import type { ComponentPropsWithRef, CSSProperties } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { SkeletonStyles, type SkeletonVariant } from "./SkeletonStyles";

export const skeletonVariants = [
  "text",
  "circle",
  "rect",
] as const satisfies Array<SkeletonVariant>;

export type { SkeletonVariant };

export type SkeletonProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "width" | "height"
> & {
  /**
   * Shape of the thing being waited for. Defaults to `"text"`, which is a bar
   * one line tall that tracks the surrounding type scale.
   */
  variant?: SkeletonVariant;
  /**
   * Number of stacked bars, for `variant="text"` only. The last is rendered
   * short, the way a real paragraph ends. Defaults to `1`.
   */
  lines?: number;
  /**
   * Any CSS length. Applied as an inline style, because a skeleton mirrors
   * whatever it is standing in for and those dimensions cannot come from a
   * fixed scale — this is the one component where §4 does not apply.
   */
  width?: CSSProperties["width"];
  /** Any CSS length. See `width`. */
  height?: CSSProperties["height"];
  /** Defaults to `true`. Always disabled under `prefers-reduced-motion`. */
  animated?: boolean;
};

/**
 * A placeholder for content that has not arrived.
 *
 * Streaming server components make partial pages the normal case, so the
 * loading shape belongs in the library rather than being improvised per
 * screen.
 *
 * **The skeleton is `aria-hidden` and always will be.** It says nothing to a
 * screen reader — a wall of "loading, loading, loading" is worse than silence.
 * Put `aria-busy="true"` on the region it stands in, and remove it when the
 * real content lands. That is the announcement (§15).
 *
 * @server-safe
 *
 * @example A line of text
 * ```tsx
 * <Skeleton />
 * ```
 *
 * @example A paragraph, with the region marked busy
 * ```tsx
 * <div aria-busy={isLoading}>
 *   {isLoading ? <Skeleton lines={3} /> : <Typography as="p">{copy}</Typography>}
 * </div>
 * ```
 *
 * @example An avatar beside two lines, mirroring the row it replaces
 * ```tsx
 * <div className="flex items-center gap-3" aria-busy>
 *   <Skeleton variant="circle" width="2rem" height="2rem" />
 *   <Skeleton lines={2} />
 * </div>
 * ```
 */
export const Skeleton = ({
  variant: variantProp,
  lines: linesProp,
  width,
  height,
  animated: animatedProp,
  className: classNameProp,
  style,
  ...remainingProps
}: SkeletonProps) => {
  const variant: SkeletonVariant = variantProp ?? "text";
  const lines: number = linesProp ?? 1;
  const animated: boolean = animatedProp ?? true;
  const className: string = classNameProp ?? "";

  const sizing: CSSProperties = {
    ...(width === undefined ? {} : { width }),
    ...(height === undefined ? {} : { height }),
    ...style,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div
        data-slot="skeleton"
        aria-hidden="true"
        className={cn(SkeletonStyles.linesStyle(), className)}
        style={style}
        {...remainingProps}
      >
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            data-slot="skeleton-line"
            className={cn(
              SkeletonStyles.skeletonStyle({ variant, animated }),
              // A paragraph does not end flush with the margin.
              index === lines - 1 ? "w-[60%]" : "",
            )}
            style={index === lines - 1 ? undefined : sizing}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        SkeletonStyles.skeletonStyle({ variant, animated }),
        className,
      )}
      style={sizing}
      {...remainingProps}
    />
  );
};
