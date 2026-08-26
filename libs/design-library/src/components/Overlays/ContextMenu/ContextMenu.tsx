import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { usePosition } from "../../../hooks/usePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { useMenuKeyboard } from "../DropdownMenu/useMenuKeyboard";
import { MenuStyles } from "../Menu/menuStyles";
import { Portal } from "../Portal";

export interface ContextMenuProps {
  /** The region that responds to a right-click. */
  children: ReactNode;
  /** `MenuItem`, `MenuGroup` and `MenuSeparator` children. */
  content: ReactNode;
  /** Names the menu. Required, as for `DropdownMenu`. */
  "aria-label": string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * The same menu as `DropdownMenu`, opened where the pointer is.
 *
 * Right-click only. There is deliberately no long-press fallback for touch:
 * a correct one needs timers, scroll cancellation and text-selection
 * suppression, and this library is built for a desk application. **A context
 * menu must therefore never be the only route to a command** — put the same
 * commands in a `DropdownMenu` on the row or in a toolbar.
 *
 * The browser's own context menu is suppressed inside the region, which is a
 * real cost: the user loses "open in new tab", "copy image" and their
 * extensions. Only take it over where the commands are genuinely more useful
 * than the browser's.
 *
 * Positioned at fixed coordinates rather than against an anchor, so the menu
 * appears under the pointer and still flips when it would fall off the bottom
 * of the screen.
 *
 * @client
 *
 * @example Row commands
 * ```tsx
 * <ContextMenu
 *   aria-label="Deal actions"
 *   content={<MenuItem onClick={duplicate}>Duplicate</MenuItem>}
 * >
 *   <tr>{cells}</tr>
 * </ContextMenu>
 * ```
 *
 * @example Always paired with a reachable equivalent
 * ```tsx
 * <ContextMenu aria-label="Deal actions" content={commands}>
 *   <DealRow deal={deal} actions={<DropdownMenu aria-label="Deal actions" content={commands} />} />
 * </ContextMenu>
 * ```
 *
 * @example Grouped, exactly as in a DropdownMenu
 * ```tsx
 * <ContextMenu aria-label="Export" content={
 *   <MenuGroup label="Download"><MenuItem>CSV</MenuItem></MenuGroup>
 * }>
 *   {children}
 * </ContextMenu>
 * ```
 */
export const ContextMenu = ({
  children,
  content,
  "aria-label": ariaLabel,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
}: ContextMenuProps) => {
  const [isOpen, setIsOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  const id: string = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const { floatingRef } = usePosition<HTMLElement, HTMLDivElement>({
    open: isOpen,
    placement: "bottom",
    alignment: "start",
    offset: 0,
    coordinates,
  });

  const close = (): void => {
    setIsOpen(false);
  };

  const { onKeyDown, focusFirst } = useMenuKeyboard(menuRef, close);

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
      if (target !== null && menuRef.current?.contains(target) === true) {
        return;
      }
      setIsOpen(false);
    };
    // A second right-click elsewhere should move the menu, not stack another.
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div
        data-slot="context-menu-region"
        className={cn("contents", className)}
        onContextMenu={(event: ReactMouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          setCoordinates({ x: event.clientX, y: event.clientY });
          setIsOpen(true);
        }}
      >
        {children}
      </div>
      {isOpen && (
        <Portal>
          <div
            data-slot="context-menu"
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
            onClick={(event) => {
              const target: HTMLElement | null =
                event.target instanceof HTMLElement ? event.target : null;
              if (target?.closest('[role="menuitem"]') !== null) {
                setIsOpen(false);
              }
            }}
            className={MenuStyles.menuStyle()}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
