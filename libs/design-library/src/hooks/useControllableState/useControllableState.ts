import { useCallback, useRef, useState } from "react";

/**
 * One value that is **controlled when the prop is defined and uncontrolled
 * otherwise** — the §10 default for every stateful component in the library.
 *
 * Without this, that logic gets written twenty-two times and drifts.
 *
 * @param controlled the controlled prop; `undefined` means uncontrolled
 * @param defaultValue the initial value in uncontrolled mode
 * @param onChange called on every change, in both modes
 *
 * @example
 * ```ts
 * const [open, setOpen] = useControllableState(
 *   openProp,
 *   defaultOpen ?? false,
 *   onOpenChange,
 * );
 * ```
 */
export const useControllableState = <T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] => {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);

  const isControlled: boolean = controlled !== undefined;
  // Deliberately a ternary and not `??`: null must count as controlled. A
  // Select whose value is `string | null` is still being driven by its owner
  // when that value is null, and `??` would silently hand it back to the
  // component. Only `undefined` means uncontrolled.
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const value: T = controlled !== undefined ? controlled : uncontrolled;

  // Held in a ref so the returned setter is stable across renders, which keeps
  // it safe to use in a dependency array.
  const onChangeRef = useRef<((value: T) => void) | undefined>(onChange);
  onChangeRef.current = onChange;
  const isControlledRef = useRef<boolean>(isControlled);
  isControlledRef.current = isControlled;

  const setValue = useCallback((next: T): void => {
    if (!isControlledRef.current) {
      setUncontrolled(next);
    }
    onChangeRef.current?.(next);
  }, []);

  return [value, setValue];
};
