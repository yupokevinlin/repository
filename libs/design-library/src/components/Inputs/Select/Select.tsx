import { useEffect, useId, useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import type { ListboxOption } from "../../../hooks/useListbox";
import { useListbox } from "../../../hooks/useListbox";
import { usePosition } from "../../../hooks/usePosition";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import { Portal } from "../../Overlays/Portal";
import {
  inputDensities,
  type InputDensity,
  type InputSize,
  inputSizes,
  InputSurfaceStyles,
} from "../shared/inputSurfaceStyles";
import { SelectStyles } from "./SelectStyles";

export const selectSizes = inputSizes;
export const selectDensities = inputDensities;

export type SelectSize = InputSize;
export type SelectDensity = InputDensity;
export type SelectOption = ListboxOption;

export type SelectProps = FieldShellOwnProps & {
  /** The options. */
  options: Array<SelectOption>;
  /** Controlled value. `""` means nothing chosen. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shown when nothing is chosen. Never a substitute for `label`. */
  placeholder?: string;
  /** Height. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
  size?: SelectSize;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

const chevron = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

/**
 * Choosing one value from a known list.
 *
 * A custom trigger with a portalled listbox, not a native `<select>`: the
 * native control cannot be styled to match the rest of the library, and its
 * popup is drawn by the operating system where none of the theme applies.
 *
 * The APG select-only combobox pattern. `role="combobox"` on the trigger,
 * `role="listbox"` and `role="option"` in the popup, and **never
 * `role="menu"`** — a menu is a list of commands, a listbox chooses a value,
 * and a screen reader tells the user which one they are in.
 *
 * DOM focus stays on the trigger the whole time; the highlighted option is
 * published through `aria-activedescendant`. That is what keeps a screen
 * reader in forms mode rather than browse mode.
 *
 * For a list long enough to need filtering, use `Combobox`.
 *
 * @client
 *
 * @example Choosing terms
 * ```tsx
 * <Select
 *   label="Payment terms"
 *   options={termOptions}
 *   value={terms}
 *   onValueChange={setTerms}
 * />
 * ```
 *
 * @example With a placeholder and a hint
 * ```tsx
 * <Select
 *   label="Incoterm"
 *   placeholder="Choose an incoterm"
 *   hint="Applies to this shipment only."
 *   options={incoterms}
 *   required
 * />
 * ```
 *
 * @example In a filter bar, with no visible label
 * ```tsx
 * <Select aria-label="Status" options={statuses} size="8" density="compact" />
 * ```
 */
export const Select = ({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
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
}: SelectProps) => {
  const size: SelectSize = sizeProp ?? "10";

  const [value, setValue] = useControllableState<string>(
    valueProp,
    defaultValue ?? "",
    onValueChange,
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const listbox = useListbox({
    options,
    value,
    onValueChange: setValue,
    open,
    onOpenChange: setOpen,
    idPrefix: listboxId,
    typeAhead: true,
  });

  const { anchorRef, floatingRef } = usePosition<
    HTMLButtonElement,
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
        triggerRef.current?.contains(target) === true
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

  const chosen: SelectOption | undefined = options.find(
    (option: SelectOption) => option.value === value,
  );

  return (
    <FieldShell {...fieldProps} className={className}>
      {}
      <button
        data-slot="select"
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={listbox.activeId}
        aria-label={ariaLabel}
        disabled={disabled}
        ref={(element: HTMLButtonElement | null) => {
          anchorRef.current = element;
          triggerRef.current = element;
        }}
        className={cn(
          InputSurfaceStyles.inputSurfaceStyle({ invalid, size }),
          "cursor-pointer",
        )}
        onClick={() => {
          setOpen(!open);
        }}
        onKeyDown={listbox.onKeyDown}
        {...controlProps}
      >
        <span
          data-slot="select-value"
          className={SelectStyles.triggerValueStyle({
            placeholder: chosen === undefined,
          })}
        >
          {chosen?.label ?? placeholder ?? ""}
        </span>
        <span
          data-slot="select-chevron"
          className={InputSurfaceStyles.inputIconStyle({ size })}
        >
          {chevron}
        </span>
      </button>
      {open && (
        <Portal>
          <ul
            data-slot="select-listbox"
            id={listboxId}
            role="listbox"
            aria-label={label === undefined ? ariaLabel : undefined}
            ref={floatingRef}
            className={SelectStyles.listboxStyle()}
          >
            {options.map((option: SelectOption, index: number) => (
              // pointer-only by design: DOM focus never enters the listbox, so
              // the entire keyboard path lives on the trigger above.
              <li
                key={option.value}
                id={listbox.optionId(index)}
                data-slot="select-option"
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled === true ? true : undefined}
                className={SelectStyles.optionStyle({
                  active: index === listbox.activeIndex,
                  selected: option.value === value,
                  disabled: option.disabled === true,
                })}
                // Pointer only: the keyboard path goes through the trigger, so
                // these never take focus and never need key handlers.
                onPointerEnter={() => {
                  listbox.setActiveIndex(index);
                }}
                // Pointerdown rather than click, matching Combobox: it
                // fires before focus moves, so the choice lands before any
                // blur handling runs.
                onPointerDown={(event) => {
                  event.preventDefault();
                  listbox.select(index);
                  triggerRef.current?.focus();
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </Portal>
      )}
    </FieldShell>
  );
};
