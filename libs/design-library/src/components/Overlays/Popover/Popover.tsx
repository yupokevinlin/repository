import type {
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cloneElement, useEffect, useId, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { getFocusableElements } from "../../../hooks/useFocusTrap/focusableElements";
import { usePosition } from "../../../hooks/usePosition";
import type {
  PositionAlignment,
  PositionPlacement,
} from "../../../hooks/usePosition/computePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { Portal } from "../Portal";
import { PopoverStyles } from "./PopoverStyles";

export type PopoverPadding = "none" | "3" | "4";

export const popoverPaddings = [
  "none",
  "3",
  "4",
] as const satisfies Array<PopoverPadding>;

export interface PopoverProps {
  /** The trigger. Clicking it opens and closes the panel. */
  children: ReactElement;
  /** What goes in the panel. Unlike a `Tooltip`, this may be interactive. */
  content: ReactNode;
  /**
   * Names the panel, for a screen reader arriving at it. Required — a dialog
   * with no name is announced as "dialog" and nothing else.
   */
  "aria-label": string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Preferred side. Flips when there is no room. Defaults to `"bottom"`. */
  placement?: PositionPlacement;
  /** Where along the cross axis. Defaults to `"start"`. */
  alignment?: PositionAlignment;
  /** Inner padding. `"3"` = 0.75rem, `"4"` = 1rem. Defaults to `"4"`. */
  padding?: PopoverPadding;
  className?: string;
}

/**
 * A small panel anchored to a control, holding content the user can interact
 * with — a filter form, a summary with a link, a colour picker.
 *
 * Non-modal `role="dialog"`, not `role="tooltip"`. The page behind stays
 * usable and is not inert; Escape closes it and focus returns to the trigger.
 * Reach for `Modal` instead when the rest of the page must wait.
 *
 * Focus moves into the panel on open, because the content is interactive and
 * a keyboard user would otherwise have to Tab through the whole page to reach
 * it. Tab is **not** trapped — this is not a modal, so tabbing past the last
 * control leaves the panel, which closes it.
 *
 * Use `Tooltip` for a plain label with nothing to click.
 *
 * @client
 *
 * @example A filter panel
 * ```tsx
 * <Popover aria-label="Filters" content={<FilterForm />}>
 *   <Button>Filters</Button>
 * </Popover>
 * ```
 *
 * @example Controlled, closing after an action
 * ```tsx
 * <Popover
 *   aria-label="Assign"
 *   open={open}
 *   onOpenChange={setOpen}
 *   content={<AssigneeList onPick={() => setOpen(false)} />}
 * >
 *   <Button>Assign</Button>
 * </Popover>
 * ```
 *
 * @example Flush, for a panel that draws its own edges
 * ```tsx
 * <Popover aria-label="Columns" padding="none" content={<ColumnList />}>
 *   <IconButton icon={<ColumnsIcon />} aria-label="Columns" />
 * </Popover>
 * ```
 */
export const Popover = ({
  children,
  content,
  "aria-label": ariaLabel,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placement,
  alignment,
  padding,
  className,
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  const id: string = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  const { anchorRef, floatingRef } = usePosition<
    HTMLSpanElement,
    HTMLDivElement
  >({
    open: isOpen,
    placement: placement ?? "bottom",
    alignment: alignment ?? "start",
    offset: 6,
  });

  // Focus moves in on open and back to the trigger on close. Not useFocusTrap:
  // that traps Tab, which is right for a modal and wrong here — the page
  // behind a popover stays reachable.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const panel: HTMLDivElement | null = floatingRef.current;
    const previouslyFocused: HTMLElement | null =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (panel !== null) {
      (getFocusableElements(panel)[0] ?? panel).focus();
    }

    return () => {
      if (previouslyFocused?.isConnected === true) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, floatingRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setIsOpen(false);
      }
    };

    // A click outside dismisses it. Pointerdown rather than click, so a drag
    // that starts outside does not leave the panel open behind the pointer.
    const onPointerDown = (event: PointerEvent): void => {
      const target: Node | null =
        event.target instanceof Node ? event.target : null;
      if (target === null) {
        return;
      }
      if (
        floatingRef.current?.contains(target) === true ||
        triggerRef.current?.contains(target) === true
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, setIsOpen, floatingRef]);

  // The click goes on the trigger itself rather than on the wrapper span: a
  // span with a click handler is not reachable by keyboard, and the child is
  // already a button that is. The child's own handler still runs first.
  const childProps = children.props as {
    onClick?: (event: ReactMouseEvent) => void;
  };

  const trigger: ReactElement = cloneElement(children, {
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog",
    "aria-controls": isOpen ? id : undefined,
    onClick: (event: ReactMouseEvent) => {
      childProps.onClick?.(event);
      setIsOpen(!isOpen);
    },
  } as Record<string, unknown>);

  return (
    <>
      <span
        data-slot="popover-trigger"
        className="inline-flex"
        ref={(element: HTMLSpanElement | null) => {
          anchorRef.current = element;
          triggerRef.current = element;
        }}
      >
        {trigger}
      </span>
      {isOpen && (
        <Portal>
          <div
            data-slot="popover"
            id={id}
            role="dialog"
            aria-label={ariaLabel}
            tabIndex={-1}
            ref={floatingRef}
            className={cn(PopoverStyles.popoverStyle({ padding }), className)}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
