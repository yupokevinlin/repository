import type { ChangeEvent, ComponentPropsWithRef } from "react";
import { useRef, useState } from "react";

import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";

export const searchInputSizes = inputSizes;
export const searchInputDensities = inputDensities;

export type SearchInputSize = InputSize;
export type SearchInputDensity = InputDensity;

export type SearchInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "id" | "size" | "type" | "value" | "defaultValue" | "onChange"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** Controlled value. */
    value?: string;
    /** Initial value when uncontrolled. */
    defaultValue?: string;
    /** Fires immediately on every keystroke. There is no internal debounce. */
    onValueChange?: (value: string) => void;
    /** Height. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
    size?: SearchInputSize;
    /** The clear button's accessible name. Defaults to `"Clear search"`. */
    clearLabel?: string;
  };

const searchIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-full"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/**
 * A search box, with a clear button once there is something to clear.
 *
 * **There is no internal debounce.** `onValueChange` fires on every keystroke.
 * Debouncing belongs to whatever the search drives — a local filter over 20
 * rows wants none, a server round trip wants 300ms, and a component that
 * decided for both would be wrong for one of them. A hidden delay inside an
 * input is also close to impossible to debug from the outside: the field looks
 * broken rather than slow.
 *
 * `type="search"` for the semantics, but the browser's own clear affordance is
 * suppressed in favour of a real button — the native one is unlabelled, not
 * keyboard reachable in every browser, and differently placed in each.
 *
 * @client
 *
 * @example Filtering a table, debounced by the caller
 * ```tsx
 * const [query, setQuery] = useState("");
 * const debounced = useDebounced(query, 300);
 *
 * <SearchInput label="Search deals" value={query} onValueChange={setQuery} />
 * ```
 *
 * @example In a toolbar, with no visible label
 * ```tsx
 * <SearchInput aria-label="Search deals" size="8" density="compact" />
 * ```
 *
 * @example In another language
 * ```tsx
 * <SearchInput label="Rechercher" clearLabel="Effacer la recherche" />
 * ```
 */
export const SearchInput = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  size: sizeProp,
  value,
  defaultValue,
  onValueChange,
  clearLabel: clearLabelProp,
  className: classNameProp,
  disabled,
  ...remainingProps
}: SearchInputProps) => {
  const size: SearchInputSize = sizeProp ?? "10";
  const clearLabel: string = clearLabelProp ?? "Clear search";
  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const [uncontrolled, setUncontrolled] = useState<string>(defaultValue ?? "");
  const current: string = value ?? uncontrolled;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commit = (next: string): void => {
    if (value === undefined) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
  };

  return (
    <FieldShell {...fieldProps} className={classNameProp}>
      <div
        data-slot="search-input"
        className={InputSurfaceStyles.inputSurfaceStyle({ invalid, size })}
      >
        <span
          data-slot="search-input-icon"
          className={InputSurfaceStyles.inputIconStyle({ size })}
        >
          {searchIcon}
        </span>
        <input
          data-slot="search-input-control"
          type="search"
          disabled={disabled}
          value={current}
          ref={inputRef}
          // The browser's own clear affordance is unlabelled and inconsistent
          // between engines, so it is suppressed in favour of a real button.
          className={`${InputSurfaceStyles.inputElementStyle()} [&::-webkit-search-cancel-button]:appearance-none`}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            commit(event.target.value);
          }}
          {...controlProps}
          {...remainingProps}
        />
        {current !== "" && disabled !== true && (
          <button
            data-slot="search-input-clear"
            type="button"
            aria-label={clearLabel}
            className="shrink-0 cursor-pointer rounded-xs text-fg-muted hover:text-fg-default focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-border-primary"
            onClick={() => {
              commit("");
              // Focus stays in the field: clearing a search is the start of
              // typing a new one, not the end of the interaction.
              inputRef.current?.focus();
            }}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
              className={InputSurfaceStyles.inputIconStyle({ size })}
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
    </FieldShell>
  );
};
