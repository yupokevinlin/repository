import type {
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cloneElement, useEffect, useId, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { usePosition } from "../../../hooks/usePosition";
import type {
  PositionAlignment,
  PositionPlacement,
} from "../../../hooks/usePosition/computePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { MenuStyles } from "../Menu/menuStyles";
import { Portal } from "../Portal";
import { useMenuKeyboard } from "./useMenuKeyboard";

export interface DropdownMenuProps {
  /** The trigger. Clicking it opens the menu. */
  children: ReactElement;
  /** `MenuItem`, `MenuGroup` and `MenuSeparator` children. */
  content: ReactNode;
  /**
   * Names the menu. Required — a menu with no name is announced as "menu"
   * and nothing else.
   */
  "aria-label": string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preferred side. Flips when there is no room. Defaults to `"bottom"`. */
  placement?: PositionPlacement;
  /** Where along the cross axis. Defaults to `"start"`. */
  alignment?: PositionAlignment;
  className?: string;
}

/**
 * A list of commands hanging off a button — row actions, an overflow menu.
 *
 * `role="menu"` with `menuitem` children. That is for **commands**: things
 * that happen when chosen. Choosing a value from a list is `Select`, which is
 * a listbox, and a screen reader announces the two differently.
 *
 * Real focus moves into the menu, unlike `Select` where it never leaves the
 * trigger — the APG menu pattern. Arrows move, Home and End jump, letters
 * jump by first letter, Escape closes and returns focus to the trigger.
 *
 * Children render themselves (§9.4); this lays them out and drives the
 * keyboard by querying the DOM, so a caller's own wrapper around a `MenuItem`
 * still takes part.
 *
 * @client
 *
 * @example Row actions
 * ```tsx
 * <DropdownMenu
 *   aria-label="Deal actions"
 *   content={
 *     <>
 *       <MenuItem onClick={duplicate}>Duplicate</MenuItem>
 *       <MenuSeparator />
 *       <MenuItem severity="error" onClick={remove}>Delete deal</MenuItem>
 *     </>
 *   }
 * >
 *   <IconButton icon={<MoreIcon />} aria-label="Deal actions" />
 * </DropdownMenu>
 * ```
 *
 * @example Grouped
 * ```tsx
 * <DropdownMenu
 *   aria-label="Export"
 *   content={
 *     <MenuGroup label="Download">
 *       <MenuItem>CSV</MenuItem>
 *       <MenuItem>PDF</MenuItem>
 *     </MenuGroup>
 *   }
 * >
 *   <Button>Export</Button>
 * </DropdownMenu>
 * ```
 *
 * @example Choosing a value is a Select, not this
 * ```tsx
 * <Select label="Payment terms" options={termOptions} />
 * ```
 */
export const DropdownMenu = ({
  children,
  content,
  "aria-label": ariaLabel,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placement,
  alignment,
  className,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  const id: string = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { anchorRef, floatingRef } = usePosition<
    HTMLSpanElement,
    HTMLDivElement
  >({
    open: isOpen,
    placement: placement ?? "bottom",
    alignment: alignment ?? "start",
    offset: 4,
  });

  const close = (): void => {
    setIsOpen(false);
  };

  const { onKeyDown, focusFirst } = useMenuKeyboard(menuRef, close);

  // Focus lands on the first command as the menu opens, and returns to the
  // trigger when it closes — a menu the user cannot immediately drive with the
  // keyboard is a menu they have to reach for the mouse to use.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const previouslyFocused: HTMLElement | null =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    focusFirst();

    return () => {
      if (previouslyFocused?.isConnected === true) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, focusFirst]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      const target: Node | null =
        event.target instanceof Node ? event.target : null;
      if (target === null) {
        return;
      }
      if (
        menuRef.current?.contains(target) === true ||
        triggerRef.current?.contains(target) === true
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, setIsOpen]);

  const childProps = children.props as {
    onClick?: (event: ReactMouseEvent) => void;
  };

  const trigger: ReactElement = cloneElement(children, {
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? id : undefined,
    onClick: (event: ReactMouseEvent) => {
      childProps.onClick?.(event);
      setIsOpen(!isOpen);
    },
  } as Record<string, unknown>);

  return (
    <>
      <span
        data-slot="dropdown-menu-trigger"
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
            data-slot="dropdown-menu"
            id={id}
            role="menu"
            aria-label={ariaLabel}
            // Script-focusable only. The menu itself is never a tab stop —
            // items are focused directly — but a menu container that cannot
            // take focus at all leaves nowhere to put it if it ever empties.
            tabIndex={-1}
            ref={(element: HTMLDivElement | null) => {
              floatingRef.current = element;
              menuRef.current = element;
            }}
            onKeyDown={onKeyDown}
            // A command runs and the menu shuts. Listening here rather than on
            // every item means a caller's own wrapper still closes it.
            onClick={(event) => {
              const target: HTMLElement | null =
                event.target instanceof HTMLElement ? event.target : null;
              if (target?.closest('[role="menuitem"]') !== null) {
                setIsOpen(false);
              }
            }}
            className={cn(MenuStyles.menuStyle(), className)}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
