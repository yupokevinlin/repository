export type PositionPlacement = "top" | "bottom" | "left" | "right";

export type PositionAlignment = "start" | "center" | "end";

export const positionPlacements = [
  "top",
  "bottom",
  "left",
  "right",
] as const satisfies Array<PositionPlacement>;

export const positionAlignments = [
  "start",
  "center",
  "end",
] as const satisfies Array<PositionAlignment>;

/** A box in viewport coordinates. `DOMRect` satisfies this. */
export interface PositionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ComputePositionArgs {
  /** The trigger, in viewport coordinates. */
  anchor: PositionRect;
  /** The floating element's own measured size. */
  floating: { width: number; height: number };
  /** Usually `window.innerWidth` / `innerHeight`. */
  viewport: { width: number; height: number };
  /** Preferred side. May be flipped to its opposite. */
  placement: PositionPlacement;
  /** Where along the cross axis the floating element sits. */
  alignment: PositionAlignment;
  /** Gap between anchor and floating element, in px. */
  offset: number;
}

export interface ComputedPosition {
  top: number;
  left: number;
  /** The side actually used — the preferred one unless it was flipped. */
  placement: PositionPlacement;
}

const isVertical = (placement: PositionPlacement): boolean =>
  placement === "top" || placement === "bottom";

const opposite: Record<PositionPlacement, PositionPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * How much room there is on a given side, between the anchor and the edge of
 * the viewport, once the gap is taken out.
 */
const spaceOn = (
  placement: PositionPlacement,
  anchor: PositionRect,
  viewport: { width: number; height: number },
  offset: number,
): number => {
  switch (placement) {
    case "top":
      return anchor.top - offset;
    case "bottom":
      return viewport.height - (anchor.top + anchor.height) - offset;
    case "left":
      return anchor.left - offset;
    case "right":
      return viewport.width - (anchor.left + anchor.width) - offset;
  }
};

/**
 * Flips to the opposite side when the preferred one cannot fit and the
 * opposite one can.
 *
 * If neither fits, the preferred side is kept — moving to a side that is also
 * too small only makes the overlay jump for no benefit. This is main-axis flip
 * only: there is deliberately no shift-to-fit along the cross axis (§2.1).
 */
const resolvePlacement = (
  preferred: PositionPlacement,
  anchor: PositionRect,
  floating: { width: number; height: number },
  viewport: { width: number; height: number },
  offset: number,
): PositionPlacement => {
  const needed: number = isVertical(preferred)
    ? floating.height
    : floating.width;

  if (spaceOn(preferred, anchor, viewport, offset) >= needed) {
    return preferred;
  }

  const other: PositionPlacement = opposite[preferred];
  if (spaceOn(other, anchor, viewport, offset) >= needed) {
    return other;
  }

  return preferred;
};

const alignedOffset = (
  alignment: PositionAlignment,
  anchorStart: number,
  anchorSize: number,
  floatingSize: number,
): number => {
  switch (alignment) {
    case "start":
      return anchorStart;
    case "center":
      return anchorStart + (anchorSize - floatingSize) / 2;
    case "end":
      return anchorStart + anchorSize - floatingSize;
  }
};

/**
 * Where a floating element should sit relative to its anchor — the whole of
 * the positioning maths, with no DOM in sight.
 *
 * Kept pure so the cases that matter (flip up when there is no room below,
 * stay put when neither side fits, each alignment) are testable without a
 * browser. `usePosition` is the thin shell that measures and applies this.
 *
 * Coordinates are viewport-relative, for use with `position: fixed`.
 *
 * @example Below a trigger, left edges aligned
 * ```ts
 * const { top, left, placement } = computePosition({
 *   anchor: trigger.getBoundingClientRect(),
 *   floating: { width: 200, height: 120 },
 *   viewport: { width: window.innerWidth, height: window.innerHeight },
 *   placement: "bottom",
 *   alignment: "start",
 *   offset: 4,
 * });
 * ```
 */
export const computePosition = ({
  anchor,
  floating,
  viewport,
  placement: preferred,
  alignment,
  offset,
}: ComputePositionArgs): ComputedPosition => {
  const placement: PositionPlacement = resolvePlacement(
    preferred,
    anchor,
    floating,
    viewport,
    offset,
  );

  if (isVertical(placement)) {
    return {
      placement,
      top:
        placement === "bottom"
          ? anchor.top + anchor.height + offset
          : anchor.top - floating.height - offset,
      left: alignedOffset(alignment, anchor.left, anchor.width, floating.width),
    };
  }

  return {
    placement,
    top: alignedOffset(alignment, anchor.top, anchor.height, floating.height),
    left:
      placement === "right"
        ? anchor.left + anchor.width + offset
        : anchor.left - floating.width - offset,
  };
};
