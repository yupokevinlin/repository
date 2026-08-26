import type { KeyboardEvent, RefObject } from "react";
import { useCallback, useRef } from "react";

/**
 * The keyboard behaviour shared by `DropdownMenu` and `ContextMenu`.
 *
 * Items are found by querying the DOM rather than passed in, because menu
 * children render themselves (§9.4) and this package has exactly one Context
 * provider (§16), which is `ToastProvider`. Querying keeps the coordination
 * without adding a second one, and it means a caller's own component wrapping
 * a `MenuItem` still participates.
 *
 * Unlike a listbox, **real focus moves into the menu** — that is the APG menu
 * pattern, and why `MenuItem` is a real `<button>` with `tabIndex={-1}`.
 */
export const useMenuKeyboard = (
  menuRef: RefObject<HTMLElement | null>,
  close: () => void,
): {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  focusFirst: () => void;
  focusLast: () => void;
} => {
  const typed = useRef<string>("");
  const typedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = useCallback(
    (): Array<HTMLElement> =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])',
        ) ?? [],
      ),
    [menuRef],
  );

  const focusAt = useCallback(
    (index: number): void => {
      const all: Array<HTMLElement> = items();
      if (all.length === 0) {
        return;
      }
      const wrapped: number = (index + all.length) % all.length;
      all[wrapped]?.focus();
    },
    [items],
  );

  const focusFirst = useCallback((): void => {
    focusAt(0);
  }, [focusAt]);

  const focusLast = useCallback((): void => {
    focusAt(items().length - 1);
  }, [focusAt, items]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>): void => {
      const all: Array<HTMLElement> = items();
      const current: number = all.indexOf(
        document.activeElement as HTMLElement,
      );

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          focusAt(current + 1);
          return;
        case "ArrowUp":
          event.preventDefault();
          focusAt(current - 1);
          return;
        case "Home":
          event.preventDefault();
          focusFirst();
          return;
        case "End":
          event.preventDefault();
          focusLast();
          return;
        case "Escape":
          event.preventDefault();
          close();
          return;
        case "Tab":
          // A menu is modal enough that tabbing away should shut it rather
          // than leave it hanging over whatever comes next.
          close();
          return;
        default:
          break;
      }

      if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        if (typedTimer.current !== null) {
          clearTimeout(typedTimer.current);
        }
        typed.current += event.key.toLowerCase();
        typedTimer.current = setTimeout(() => {
          typed.current = "";
        }, 1000);

        const match: HTMLElement | undefined = all.find((item: HTMLElement) =>
          (item.textContent ?? "")
            .trim()
            .toLowerCase()
            .startsWith(typed.current),
        );
        match?.focus();
      }
    },
    [close, focusAt, focusFirst, focusLast, items],
  );

  return { onKeyDown, focusFirst, focusLast };
};
