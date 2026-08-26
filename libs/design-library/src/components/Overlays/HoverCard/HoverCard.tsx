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

export interface HoverCardProps {
  /**
   * The trigger. **Must be focusable** — a `Link`, `Button` or anything else
   * that takes focus. A hover card on plain text cannot be opened by keyboard,
   * and then it is a `Popover` you have mislabelled.
   */
  children: ReactElement;
  /** The preview. May contain formatting, but nothing the user must click. */
  content: ReactNode;
  /** Names the card for a screen reader arriving at it. */
  "aria-label": string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preferred side. Flips when there is no room. Defaults to `"bottom"`. */
  placement?: PositionPlacement;
  /** Where along the cross axis. Defaults to `"start"`. */
  alignment?: PositionAlignment;
  /** How long the pointer must rest before it opens, in ms. Defaults to `400`. */
  openDelay?: number;
  /**
   * How long after the pointer leaves before it closes, in ms. Defaults to
   * `200` — long enough for the user to cross the gap between trigger and card
   * without it vanishing under them.
   */
  closeDelay?: number;
  className?: string;
}

/**
 * A preview that appears on hover — who a counterparty is, what a deal
 * contains, without leaving the page.
 *
 * Richer than a `Tooltip` and lighter than a `Popover`: it holds formatted
 * content but nothing the user must act on.
 *
 * **It must open on focus and close on Escape**, or it is unreachable by
 * keyboard and should have been a `Popover`. That is not a nicety — a preview
 * only a mouse can summon is invisible to a large number of people.
 *
 * The card itself accepts the pointer, so the user can move onto it and read
 * without it disappearing; the close delay covers the gap in between. Unlike a
 * `Tooltip` it is not `pointer-events-none`.
 *
 * @client
 *
 * @example Previewing a counterparty
 * ```tsx
 * <HoverCard aria-label="Counterparty" content={<PartySummary id={party.id} />}>
 *   <Link href={`/app/parties/${party.id}`}>{party.name}</Link>
 * </HoverCard>
 * ```
 *
 * @example Opening at once, in a dense table
 * ```tsx
 * <HoverCard aria-label="Deal" openDelay={0} content={<DealSummary />}>
 *   <Link href={`/app/deals/${deal.id}`}>{deal.number}</Link>
 * </HoverCard>
 * ```
 *
 * @example Anything clickable belongs in a Popover instead
 * ```tsx
 * <Popover aria-label="Assign" content={<AssigneeList />}>
 *   <Button>Assign</Button>
 * </Popover>
 * ```
 */
export const HoverCard = ({
  children,
  content,
  "aria-label": ariaLabel,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placement,
  alignment,
  openDelay,
  closeDelay,
  className,
}: HoverCardProps) => {
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
    placement: placement ?? "bottom",
    alignment: alignment ?? "start",
    offset: 8,
  });

  const clearTimer = (): void => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const scheduleOpen = (): void => {
    clearTimer();
    const wait: number = openDelay ?? 400;
    if (wait === 0) {
      setIsOpen(true);
      return;
    }
    timer.current = setTimeout(() => {
      setIsOpen(true);
    }, wait);
  };

  const scheduleClose = (): void => {
    clearTimer();
    const wait: number = closeDelay ?? 200;
    if (wait === 0) {
      setIsOpen(false);
      return;
    }
    // The delay is what lets the pointer cross the gap onto the card.
    timer.current = setTimeout(() => {
      setIsOpen(false);
    }, wait);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        clearTimer();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const trigger: ReactElement = cloneElement(children, {
    "aria-describedby": isOpen ? id : undefined,
  } as Record<string, unknown>);

  return (
    <>
      {}
      <span
        data-slot="hover-card-trigger"
        className="inline-flex"
        ref={anchorRef}
        onMouseOver={scheduleOpen}
        onMouseOut={scheduleClose}
        // No delay on focus: a keyboard user has already committed, and this
        // is the path that makes the card reachable at all.
        onFocus={() => {
          clearTimer();
          setIsOpen(true);
        }}
        onBlur={scheduleClose}
      >
        {trigger}
      </span>
      {isOpen && (
        <Portal>
          {}
          <div
            data-slot="hover-card"
            id={id}
            role="note"
            aria-label={ariaLabel}
            ref={floatingRef}
            onMouseOver={clearTimer}
            onMouseOut={scheduleClose}
            // Focus can land inside the card when it holds a link, and the card
            // must stay open while it does.
            onFocus={clearTimer}
            onBlur={scheduleClose}
            className={cn(
              "z-50 max-w-[22rem] rounded-md border border-border-default",
              "bg-bg-default p-3 text-body-sm text-fg-default shadow-lg",
              className,
            )}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
