import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { getFocusableElements } from "./focusableElements";

export interface UseFocusTrapOptions {
  /** The trap is only active while this is true. */
  active: boolean;
  /**
   * Where focus goes when the trap opens. Defaults to the first tabbable
   * element inside the container, or the container itself if it has none.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Where focus goes when the trap closes. Defaults to whatever was focused
   * when it opened — almost always the trigger, which is where the user was.
   */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export interface UseFocusTrapResult<
  TContainer extends HTMLElement = HTMLElement,
> {
  /** Attach to the element that should hold focus. */
  containerRef: RefObject<TContainer | null>;
}

/**
 * Keeps Tab inside a container while it is open, and puts focus back where it
 * came from when it closes.
 *
 * This is the half of a modal that is invisible when it works and obvious when
 * it does not: without it Tab walks out of the dialog and into the page behind
 * it, which a sighted mouse user never notices and a keyboard user cannot get
 * past. Returning focus matters just as much — a user who opens a dialog from
 * a button and closes it should be back on that button, not at the top of the
 * document.
 *
 * The container is given `tabindex="-1"` while active so it can hold focus
 * itself when it contains nothing tabbable — a confirmation with no controls
 * yet, say. That is script-focusable only, so it never joins the tab order.
 *
 * Escape is **not** handled here. What closing means differs per component, so
 * each overlay owns its own Escape handling.
 *
 * @client
 *
 * @example A modal
 * ```tsx
 * const { containerRef } = useFocusTrap({ active: open });
 *
 * <Portal>
 *   <div ref={containerRef} role="dialog" aria-modal="true">{children}</div>
 * </Portal>
 * ```
 *
 * @example Focusing something other than the first control
 * ```tsx
 * const cancelRef = useRef<HTMLButtonElement>(null);
 * const { containerRef } = useFocusTrap({
 *   active: open,
 *   initialFocusRef: cancelRef,
 * });
 * ```
 *
 * @example Returning focus somewhere else, because the trigger is gone
 * ```tsx
 * const { containerRef } = useFocusTrap({
 *   active: open,
 *   returnFocusRef: listRef,
 * });
 * ```
 */
export const useFocusTrap = <TContainer extends HTMLElement = HTMLElement>({
  active,
  initialFocusRef,
  returnFocusRef,
}: UseFocusTrapOptions): UseFocusTrapResult<TContainer> => {
  const containerRef = useRef<TContainer | null>(null);

  // Read inside the effect so changing them mid-open does not tear the trap
  // down and re-run the focus move.
  const initialFocusRefCurrent = useRef(initialFocusRef);
  initialFocusRefCurrent.current = initialFocusRef;
  const returnFocusRefCurrent = useRef(returnFocusRef);
  returnFocusRefCurrent.current = returnFocusRef;

  useEffect(() => {
    const container: TContainer | null = containerRef.current;
    if (!active || container === null) {
      return;
    }

    // Captured before focus moves, so it is the trigger rather than whatever
    // the trap focuses next.
    const previouslyFocused: HTMLElement | null =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (!container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }

    const initial: HTMLElement | null =
      initialFocusRefCurrent.current?.current ??
      getFocusableElements(container)[0] ??
      container;
    initial.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Tab") {
        return;
      }

      // Recomputed per keypress rather than cached: a dialog's contents can
      // change while it is open, and a stale list traps focus on elements
      // that are no longer there.
      const focusable: Array<HTMLElement> = getFocusableElements(container);

      if (focusable.length === 0) {
        // Nothing to move between, so Tab does nothing at all rather than
        // escaping to the page behind.
        event.preventDefault();
        return;
      }

      const first: HTMLElement = focusable[0];
      const last: HTMLElement = focusable[focusable.length - 1];
      const activeElement: Element | null = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
        return;
      }

      // Focus sitting on the container itself — because it had nothing
      // tabbable when it opened — would otherwise Tab straight out.
      if (activeElement === container) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);

      const returnTo: HTMLElement | null =
        returnFocusRefCurrent.current?.current ?? previouslyFocused;

      // A trigger that has since been removed from the document cannot take
      // focus back; leaving it to the browser is better than throwing.
      if (returnTo?.isConnected === true) {
        returnTo.focus();
      }
    };
  }, [active]);

  return { containerRef };
};
