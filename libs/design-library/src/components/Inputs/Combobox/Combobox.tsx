import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useId, useMemo, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import type { ListboxOption } from "../../../hooks/useListbox";
import { useListbox } from "../../../hooks/useListbox";
import { usePosition } from "../../../hooks/usePosition";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import { Portal } from "../../Overlays/Portal";
import { SelectStyles } from "../Select/SelectStyles";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";

export const comboboxSizes = inputSizes;
export const comboboxDensities = inputDensities;

export type ComboboxSize = InputSize;
export type ComboboxDensity = InputDensity;
export type ComboboxOption = ListboxOption;

export type ComboboxProps = FieldShellOwnProps & {
  /** Every option. Filtering happens here unless `filter` is given. */
  options: Array<ComboboxOption>;
  /** Controlled chosen value. `""` means nothing chosen. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Controlled text in the input. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Replaces the built-in matching. Return the options to show for the text
   * typed so far — the escape hatch for server-side search, where the list
   * already arrives filtered and this should just pass it through.
   */
  filter?: (
    options: Array<ComboboxOption>,
    inputValue: string,
  ) => Array<ComboboxOption>;
  /** Shown when nothing matches. Defaults to `"No matches"`. */
  emptyText?: ReactNode;
  placeholder?: string;
  /** Height. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
  size?: ComboboxSize;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

const defaultFilter = (
  options: Array<ComboboxOption>,
  inputValue: string,
): Array<ComboboxOption> => {
  const needle: string = inputValue.trim().toLowerCase();
  if (needle === "") {
    return options;
  }
  // `includes` rather than `startsWith`: someone looking for "Kanto Polymer
  // KK" often types "polymer".
  return options.filter((option: ComboboxOption) =>
    option.label.toLowerCase().includes(needle),
  );
};

/**
 * A text input with a filtered list of options under it.
 *
 * `Select` with typing: use it when the list is long enough that scanning is
 * worse than filtering. Below about a dozen options, `Select` is less work for
 * the user.
 *
 * DOM focus stays in the input the whole time and the highlighted option is
 * published through `aria-activedescendant` — the same rule as `Select`, and
 * the reason the arrow keys can move a highlight through the list while the
 * user is still typing into the field.
 *
 * Filtering is built in and case-insensitive, matching anywhere in the label
 * rather than only at the start. Pass `filter` to replace it — returning the
 * options unchanged is how a server-side search opts out.
 *
 * The text and the chosen value are separate: the input holds what the user
 * typed, `value` holds what they committed. On blur the text snaps back to the
 * chosen option's label, so a half-typed search never looks like an answer.
 *
 * @client
 *
 * @example Picking a counterparty
 * ```tsx
 * <Combobox
 *   label="Counterparty"
 *   options={counterparties}
 *   value={party}
 *   onValueChange={setParty}
 * />
 * ```
 *
 * @example Server-side search, filtering already done
 * ```tsx
 * <Combobox
 *   label="Counterparty"
 *   options={results}
 *   filter={(options) => options}
 *   onInputValueChange={search}
 * />
 * ```
 *
 * @example With its own empty state
 * ```tsx
 * <Combobox
 *   label="Vessel"
 *   options={vessels}
 *   emptyText="No vessel by that name"
 * />
 * ```
 */
export const Combobox = ({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  filter,
  emptyText,
  placeholder,
  size: sizeProp,
  id,
  label,
  hint,
  error,
  required,
  density,
  disabled,
  className,
  "aria-label": ariaLabel,
}: ComboboxProps) => {
  const size: ComboboxSize = sizeProp ?? "10";

  const [value, setValue] = useControllableState<string>(
    valueProp,
    defaultValue ?? "",
    onValueChange,
  );
  const [inputValue, setInputValue] = useControllableState<string>(
    inputValueProp,
    defaultInputValue ?? "",
    onInputValueChange,
  );
  const [open, setOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const listboxId: string = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const visible: Array<ComboboxOption> = useMemo(
    () => (filter ?? defaultFilter)(options, inputValue),
    [filter, options, inputValue],
  );

  const listbox = useListbox({
    options: visible,
    value,
    onValueChange: (next: string) => {
      setValue(next);
      const chosen: ComboboxOption | undefined = visible.find(
        (option: ComboboxOption) => option.value === next,
      );
      // The text becomes the label of what was chosen, so the field reads as
      // an answer rather than as a search that happened to match.
      setInputValue(chosen?.label ?? "");
    },
    open,
    onOpenChange: setOpen,
    idPrefix: listboxId,
    // Off: letters belong in the input, not to a jump-to-option search.
    typeAhead: false,
  });

  const { anchorRef, floatingRef } = usePosition<
    HTMLInputElement,
    HTMLUListElement
  >({
    open,
    placement: "bottom",
    alignment: "start",
    offset: 4,
    matchTriggerWidth: true,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      const target: Node | null =
        event.target instanceof Node ? event.target : null;
      if (target === null) {
        return;
      }
      if (
        floatingRef.current?.contains(target) === true ||
        inputRef.current?.contains(target) === true
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, setOpen, floatingRef]);

  const chosenLabel: string =
    options.find((option: ComboboxOption) => option.value === value)?.label ??
    "";

  return (
    <FieldShell {...fieldProps} className={className}>
      <div
        data-slot="combobox"
        className={InputSurfaceStyles.inputSurfaceStyle({ invalid, size })}
      >
        <input
          data-slot="combobox-input"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={listbox.activeId}
          aria-label={ariaLabel}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          ref={(element: HTMLInputElement | null) => {
            anchorRef.current = element;
            inputRef.current = element;
          }}
          className={InputSurfaceStyles.inputElementStyle()}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
            if (!open) {
              setOpen(true);
            }
          }}
          onBlur={() => {
            // Snap back to what was actually chosen, so a half-typed search is
            // never left sitting in the field looking like an answer.
            setInputValue(chosenLabel);
          }}
          onKeyDown={listbox.onKeyDown}
          {...controlProps}
        />
      </div>
      {open && (
        <Portal>
          <ul
            data-slot="combobox-listbox"
            id={listboxId}
            role="listbox"
            aria-label={label === undefined ? ariaLabel : undefined}
            ref={floatingRef}
            className={SelectStyles.listboxStyle()}
          >
            {visible.length === 0 ? (
              <li
                data-slot="combobox-empty"
                role="presentation"
                className="px-3 py-1.5 text-body-sm text-fg-muted"
              >
                {emptyText ?? "No matches"}
              </li>
            ) : (
              visible.map((option: ComboboxOption, index: number) => (
                <li
                  key={option.value}
                  id={listbox.optionId(index)}
                  data-slot="combobox-option"
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled === true ? true : undefined}
                  className={SelectStyles.optionStyle({
                    active: index === listbox.activeIndex,
                    selected: option.value === value,
                    disabled: option.disabled === true,
                  })}
                  onPointerEnter={() => {
                    listbox.setActiveIndex(index);
                  }}
                  // Pointerdown rather than click: clicking would blur the
                  // input first, and the blur handler would snap the text back
                  // before the choice landed.
                  onPointerDown={(event) => {
                    event.preventDefault();
                    listbox.select(index);
                  }}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </Portal>
      )}
    </FieldShell>
  );
};
