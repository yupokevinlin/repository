import type { ReactElement, ReactNode } from "react";
import { cloneElement, useEffect, useId, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { usePosition } from "../../../hooks/usePosition";
import type {
  PositionAlignment,
  PositionPlacement,
} from "../../../hooks/usePosition/computePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { Portal } from "../Portal";
import { TooltipStyles } from "./TooltipStyles";

export interface TooltipProps {
  /**
   * The trigger. A single element that can hold focus — a `Button` or an
   * `IconButton`. A tooltip on something unfocusable is unreachable by
   * keyboard.
   */
  children: ReactElement;
  /**
   * The tip. Plain text: a tooltip is never interactive, so a link or button
   * in here could not be reached (§15).
   */
  content: ReactNode;
  /** Controlled open state, for tests and stories. */
  open?: boolean;
  /** Initial open state. Defaults to `false`. */
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Preferred side. Flips when there is no room. Defaults to `"top"`. */
  placement?: PositionPlacement;
  /** Where along the cross axis. Defaults to `"center"`. */
  alignment?: PositionAlignment;
  /**
   * How long the pointer must rest before it opens, in ms. Defaults to `300`.
   * Focus ignores this — a keyboard user has already committed.
   */
  delay?: number;
}

/**
 * A short label attached to a control — what an icon button does, what an
 * abbreviation stands for.
 *
 * Opens on **focus** as well as hover, which is the whole difference between a
 * tooltip and a decoration. A tip only a mouse can reach is invisible to
 * keyboard and screen-reader users.
 *
 * Never the only route to the information, and never interactive: it is
 * `pointer-events-none` and disappears the moment focus or the pointer leaves,
 * so nothing inside it could be clicked even if it were put there. Anything
 * the user must be able to click belongs in a `Popover`.
 *
 * The tip becomes the trigger's `aria-describedby`, so it is announced with
 * the control rather than as a stray region.
 *
 * @client
 *
 * @example On an icon button
 * ```tsx
 * <Tooltip content="Delete line item">
 *   <IconButton icon={<TrashIcon />} aria-label="Delete line item" />
 * </Tooltip>
 * ```
 *
 * @example Explaining an abbreviation
 * ```tsx
 * <Tooltip content="Free on board" placement="bottom">
 *   <Button variant="default-soft">FOB</Button>
 * </Tooltip>
 * ```
 *
 * @example Opening at once, in a dense toolbar
 * ```tsx
 * <Tooltip content="Export" delay={0}>
 *   <IconButton icon={<DownloadIcon />} aria-label="Export" />
 * </Tooltip>
 * ```
 */
export const Tooltip = ({
  children,
  content,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placement,
  alignment,
  delay,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  const id: string = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { anchorRef, floatingRef } = usePosition<
    HTMLSpanElement,
    HTMLDivElement
  >({
    open: isOpen,
    placement: placement ?? "top",
    alignment: alignment ?? "center",
    offset: 6,
  });

  const clearTimer = (): void => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const openAfterDelay = (): void => {
    clearTimer();
    const wait: number = delay ?? 300;
    if (wait === 0) {
      setIsOpen(true);
      return;
    }
    timer.current = setTimeout(() => {
      setIsOpen(true);
    }, wait);
  };

  const close = (): void => {
    clearTimer();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // Escape dismisses a tooltip without moving focus, which the APG requires
    // so a tip cannot sit over what the user is trying to read.
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const describedChild: ReactElement = cloneElement(children, {
    "aria-describedby": isOpen ? id : undefined,
  } as Record<string, unknown>);

  return (
    <>
      {/*
       * The ref and the pointer handlers sit on a wrapper rather than being
       * cloned onto the child: a ref passed through cloneElement reaches into
       * an element this component does not own. Only aria-describedby has to
       * be on the trigger itself, so only that is cloned.
       *
       * inline-flex rather than display:contents — a contents box has no rect
       * for usePosition to measure.
       */}
      <span
        data-slot="tooltip-trigger"
        className="inline-flex"
        ref={anchorRef}
        // onMouseOver rather than onMouseEnter: enter does not bubble, so it
        // would never fire from the child that actually holds the pointer.
        onMouseOver={openAfterDelay}
        onMouseOut={close}
        onFocus={() => {
          clearTimer();
          setIsOpen(true);
        }}
        onBlur={close}
      >
        {describedChild}
      </span>
      {isOpen && (
        <Portal>
          <div
            data-slot="tooltip"
            id={id}
            role="tooltip"
            ref={floatingRef}
            className={cn(TooltipStyles.tooltipStyle())}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
