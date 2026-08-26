import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ListboxOption {
  /** The value reported when this option is chosen. */
  value: string;
  /** What the option is called. Also what type-ahead matches against. */
  label: string;
  disabled?: boolean;
}

export interface UseListboxArgs {
  options: Array<ListboxOption>;
  /** The chosen value, or `""` for none. */
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Base for the generated option ids, so `aria-activedescendant` has
   * something to point at.
   */
  idPrefix: string;
  /**
   * Whether typing a letter jumps to a matching option. Off for `Combobox`,
   * where letters go into the text field instead.
   */
  typeAhead?: boolean;
}

export interface UseListboxResult {
  /** Index into `options` of the highlighted option, or `-1`. */
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  /** The id of the highlighted option, for `aria-activedescendant`. */
  activeId: string | undefined;
  /** The id for the option at `index`. */
  optionId: (index: number) => string;
  /** Attach to the trigger or the input — never to the listbox. */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  /** Choose an option by index, closing the popup. */
  select: (index: number) => void;
}

/** Skips disabled options, which are visible but cannot be chosen. */
const nextEnabled = (
  options: Array<ListboxOption>,
  from: number,
  step: number,
): number => {
  const count: number = options.length;
  if (count === 0) {
    return -1;
  }
  for (let offset = 1; offset <= count; offset += 1) {
    const index: number = (from + step * offset + count * count) % count;
    if (options[index]?.disabled !== true) {
      return index;
    }
  }
  return -1;
};

const firstEnabled = (options: Array<ListboxOption>): number =>
  options.findIndex((option: ListboxOption) => option.disabled !== true);

const lastEnabled = (options: Array<ListboxOption>): number => {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (options[index]?.disabled !== true) {
      return index;
    }
  }
  return -1;
};

/**
 * The keyboard contract shared by `Select` and `Combobox`.
 *
 * The rule that matters most: **DOM focus never enters the listbox.** It stays
 * on the trigger or the text input, and the highlighted option is published
 * through `aria-activedescendant`. Moving real focus into the popup would take
 * it off the input a `Combobox` user is still typing into, and would make the
 * whole thing unusable with a screen reader in forms mode.
 *
 * Implements the APG combobox keys: Down and Up move, Alt+Down opens without
 * moving, Alt+Up closes, Home and End jump, Enter chooses, Escape closes.
 * Type-ahead is opt-in because a `Combobox` sends letters to its input.
 *
 * @client
 *
 * @example Inside a Select
 * ```ts
 * const listbox = useListbox({
 *   options,
 *   value,
 *   onValueChange,
 *   open,
 *   onOpenChange: setOpen,
 *   idPrefix: id,
 *   typeAhead: true,
 * });
 *
 * <button onKeyDown={listbox.onKeyDown} aria-activedescendant={listbox.activeId} />
 * ```
 */
export const useListbox = ({
  options,
  value,
  onValueChange,
  open,
  onOpenChange,
  idPrefix,
  typeAhead,
}: UseListboxArgs): UseListboxResult => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const typed = useRef<string>("");
  const typedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const optionId = useCallback(
    (index: number): string => `${idPrefix}-option-${String(index)}`,
    [idPrefix],
  );

  // Opening lands on the chosen option, so Down from a closed select does not
  // start again from the top of a list the user has already answered.
  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    const chosen: number = options.findIndex(
      (option: ListboxOption) => option.value === value,
    );
    // Only when nothing is highlighted yet. Typing a letter opens the list
    // and jumps in the same tick, and this effect runs afterwards — without
    // the guard it would drag the highlight straight back to the top.
    setActiveIndex((current: number) =>
      current === -1
        ? chosen === -1
          ? firstEnabled(options)
          : chosen
        : current,
    );
  }, [open, options, value]);

  useEffect(
    () => () => {
      if (typedTimer.current !== null) {
        clearTimeout(typedTimer.current);
      }
    },
    [],
  );

  const select = useCallback(
    (index: number): void => {
      const option: ListboxOption | undefined = options[index];
      if (option === undefined || option.disabled === true) {
        return;
      }
      onValueChange(option.value);
      onOpenChange(false);
    },
    [options, onValueChange, onOpenChange],
  );

  const jumpToTyped = useCallback(
    (character: string): void => {
      if (typedTimer.current !== null) {
        clearTimeout(typedTimer.current);
      }
      // A second keystroke within a second extends the search rather than
      // starting a new one, so "ne" reaches "Net 60" rather than stopping at
      // the first "n".
      typed.current += character.toLowerCase();
      typedTimer.current = setTimeout(() => {
        typed.current = "";
      }, 1000);

      const match: number = options.findIndex(
        (option: ListboxOption) =>
          option.disabled !== true &&
          option.label.toLowerCase().startsWith(typed.current),
      );
      if (match !== -1) {
        setActiveIndex(match);
      }
    },
    [options],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>): void => {
      const { key, altKey } = event;

      if (key === "ArrowDown" && altKey) {
        // Alt+Down opens without moving the highlight — the APG's "show me
        // the options but do not choose for me".
        event.preventDefault();
        onOpenChange(true);
        return;
      }

      if (key === "ArrowUp" && altKey) {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          if (!open) {
            onOpenChange(true);
            return;
          }
          setActiveIndex(nextEnabled(options, activeIndex, 1));
          return;
        case "ArrowUp":
          event.preventDefault();
          if (!open) {
            onOpenChange(true);
            return;
          }
          setActiveIndex(nextEnabled(options, activeIndex, -1));
          return;
        case "Home":
          if (open) {
            event.preventDefault();
            setActiveIndex(firstEnabled(options));
          }
          return;
        case "End":
          if (open) {
            event.preventDefault();
            setActiveIndex(lastEnabled(options));
          }
          return;
        case "Enter":
          if (open && activeIndex !== -1) {
            event.preventDefault();
            select(activeIndex);
          }
          return;
        case "Escape":
          if (open) {
            event.preventDefault();
            onOpenChange(false);
          }
          return;
        case "Tab":
          // Tab moves on and takes the highlight with it, rather than leaving
          // a popup open over the next field.
          if (open) {
            onOpenChange(false);
          }
          return;
        default:
          break;
      }

      if (
        typeAhead === true &&
        key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !altKey
      ) {
        if (!open) {
          onOpenChange(true);
        }
        jumpToTyped(key);
      }
    },
    [activeIndex, jumpToTyped, onOpenChange, open, options, select, typeAhead],
  );

  return {
    activeIndex,
    setActiveIndex,
    activeId: activeIndex === -1 ? undefined : optionId(activeIndex),
    optionId,
    onKeyDown,
    select,
  };
};
