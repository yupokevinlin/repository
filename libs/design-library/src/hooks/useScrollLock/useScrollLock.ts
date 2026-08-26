import { useEffect } from "react";

/**
 * How many locks are currently held.
 *
 * Module-level rather than per-hook because two overlays can legitimately be
 * open at once — a confirmation raised from inside a drawer. If each restored
 * the body on its own teardown, closing the confirmation would unlock the page
 * while the drawer is still open.
 */
let lockCount = 0;
let restoreStyles: (() => void) | null = null;

/**
 * The width the scrollbar was taking up, so it can be replaced with padding.
 *
 * Without this the page jumps sideways the moment a modal opens: hiding the
 * scrollbar hands its width back to the layout.
 */
const getScrollbarWidth = (): number =>
  window.innerWidth - document.documentElement.clientWidth;

const lock = (): void => {
  lockCount += 1;
  if (lockCount > 1) {
    return;
  }

  const body: HTMLElement = document.body;
  const previousOverflow: string = body.style.overflow;
  const previousPaddingRight: string = body.style.paddingRight;
  const scrollbarWidth: number = getScrollbarWidth();

  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const currentPadding: number =
      Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }

  restoreStyles = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
};

const unlock = (): void => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) {
    return;
  }

  restoreStyles?.();
  restoreStyles = null;
};

/**
 * Stops the page behind a modal scrolling.
 *
 * Without it, scrolling inside a dialog that has reached its end carries on
 * into the page behind — the content moves under the dialog, and closing it
 * leaves the user somewhere they never meant to be.
 *
 * Locks are counted, so a confirmation opened from inside a drawer does not
 * unlock the page when only it closes. The body's original `overflow` and
 * `padding-right` are captured by the first lock and restored by the last.
 *
 * The scrollbar's width is added back as padding while locked. Hiding a
 * scrollbar hands its width to the layout, and without this every modal opens
 * with the page visibly jumping sideways behind it.
 *
 * @client
 *
 * @example Locking while a modal is open
 * ```tsx
 * useScrollLock(open);
 * ```
 *
 * @example Only when it is a real modal, not a popover
 * ```tsx
 * useScrollLock(open && modal);
 * ```
 */
export const useScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) {
      return;
    }

    lock();
    return unlock;
  }, [active]);
};

/**
 * Resets the module-level lock count.
 *
 * Only for tests — a suite that unmounts mid-lock would otherwise leak a count
 * into the next test and stop the body ever being restored.
 */
export const resetScrollLockForTests = (): void => {
  lockCount = 0;
  restoreStyles = null;
};
