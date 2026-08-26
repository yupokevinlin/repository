import type { RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import {
  type ComputedPosition,
  computePosition,
  type PositionAlignment,
  type PositionPlacement,
  type PositionRect,
} from "./computePosition";

/** `useLayoutEffect` warns during SSR, where there is nothing to measure. */
const useIsomorphicLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;

export interface UsePositionOptions {
  /** Positioning only runs while this is true. */
  open: boolean;
  /** Preferred side. Flipped to its opposite when there is no room. Defaults to `"bottom"`. */
  placement?: PositionPlacement;
  /** Where along the cross axis the floating element sits. Defaults to `"start"`. */
  alignment?: PositionAlignment;
  /** Gap between anchor and floating element, in px. Defaults to `4`. */
  offset?: number;
  /**
   * Sets the floating element's width to the trigger's — what a `Select`
   * menu wants. Content wraps or scrolls rather than widening it.
   */
  matchTriggerWidth?: boolean;
  /**
   * Position against a point rather than the anchor, for a menu opened at the
   * cursor. The anchor ref is ignored while this is set.
   */
  coordinates?: { x: number; y: number };
}

export interface UsePositionResult<
  TAnchor extends HTMLElement = HTMLElement,
  TFloating extends HTMLElement = HTMLElement,
> {
  /** Attach to the trigger. */
  anchorRef: RefObject<TAnchor | null>;
  /** Attach to the floating element. The hook writes its position directly. */
  floatingRef: RefObject<TFloating | null>;
  /** Recompute by hand — after the floating element's content changes size. */
  update: () => void;
}

/**
 * Anchors a floating element to a trigger: places it on a side, flips to the
 * opposite side when there is no room, and keeps up with scrolling and
 * resizing.
 *
 * The position is written straight onto the floating element rather than
 * returned as state. Scrolling would otherwise re-render the whole overlay on
 * every frame, and `position: fixed` values are of no use to anything but the
 * element itself. The side actually used is exposed as `data-placement`, so
 * an entry animation can point the right way from CSS alone.
 *
 * Deliberately limited (§2.1): main-axis flip, alignment, match-trigger-width
 * and fixed coordinates. It does **not** do shift-to-fit, arrow positioning or
 * nested scroll containers. If a component needs those, raise it rather than
 * quietly growing the hook.
 *
 * The floating element must be rendered into a `Portal` and left alone — do
 * not set `top`, `left`, `position` or `width` on it yourself.
 *
 * @client
 *
 * @example A menu under its trigger
 * ```tsx
 * const { anchorRef, floatingRef } = usePosition({ open });
 *
 * <button ref={anchorRef}>Open</button>
 * {open && (
 *   <Portal>
 *     <div ref={floatingRef} role="menu">{items}</div>
 *   </Portal>
 * )}
 * ```
 *
 * @example A select menu, matching its trigger
 * ```tsx
 * const { anchorRef, floatingRef } = usePosition({
 *   open,
 *   matchTriggerWidth: true,
 * });
 * ```
 *
 * @example A context menu at the cursor
 * ```tsx
 * const { floatingRef } = usePosition({
 *   open,
 *   coordinates: { x: event.clientX, y: event.clientY },
 * });
 * ```
 */
export const usePosition = <
  TAnchor extends HTMLElement = HTMLElement,
  TFloating extends HTMLElement = HTMLElement,
>({
  open,
  placement = "bottom",
  alignment = "start",
  offset = 4,
  matchTriggerWidth,
  coordinates,
}: UsePositionOptions): UsePositionResult<TAnchor, TFloating> => {
  const anchorRef = useRef<TAnchor | null>(null);
  const floatingRef = useRef<TFloating | null>(null);

  // Read inside update() so the callback can stay stable while still seeing
  // the current options — it is wired to scroll and resize listeners.
  const optionsRef = useRef({
    placement,
    alignment,
    offset,
    matchTriggerWidth,
    coordinates,
  });
  optionsRef.current = {
    placement,
    alignment,
    offset,
    matchTriggerWidth,
    coordinates,
  };

  const update = useCallback((): void => {
    const floating: TFloating | null = floatingRef.current;
    if (floating === null) {
      return;
    }

    const options = optionsRef.current;
    const anchor: TAnchor | null = anchorRef.current;

    // A cursor menu has a point rather than a trigger, which is the same
    // problem with a zero-sized anchor.
    const anchorRect: PositionRect | null =
      options.coordinates === undefined
        ? anchor === null
          ? null
          : anchor.getBoundingClientRect()
        : {
            top: options.coordinates.y,
            left: options.coordinates.x,
            width: 0,
            height: 0,
          };

    if (anchorRect === null) {
      return;
    }

    if (options.matchTriggerWidth === true && anchor !== null) {
      floating.style.width = `${anchor.getBoundingClientRect().width}px`;
    }

    const rect: DOMRect = floating.getBoundingClientRect();
    const position: ComputedPosition = computePosition({
      anchor: anchorRect,
      floating: { width: rect.width, height: rect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      placement: options.placement,
      alignment: options.alignment,
      offset: options.offset,
    });

    floating.style.position = "fixed";
    floating.style.top = `${position.top}px`;
    floating.style.left = `${position.left}px`;
    floating.dataset.placement = position.placement;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      return;
    }

    update();

    // Capture phase, so a scroll inside any ancestor container counts and not
    // only one on the window.
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    // Catches the floating element growing — an async list arriving, say —
    // without the consumer having to call update() by hand.
    const observer: ResizeObserver | null =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (observer !== null) {
      if (floatingRef.current !== null) {
        observer.observe(floatingRef.current);
      }
      if (anchorRef.current !== null) {
        observer.observe(anchorRef.current);
      }
    }

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
    // coordinates is spread into x and y rather than passed whole: it is an
    // object literal at every call site, so depending on it directly would
    // tear the listeners down and rebuild them on every render.
  }, [
    open,
    update,
    placement,
    alignment,
    offset,
    matchTriggerWidth,
    coordinates?.x,
    coordinates?.y,
  ]);

  return { anchorRef, floatingRef, update };
};
