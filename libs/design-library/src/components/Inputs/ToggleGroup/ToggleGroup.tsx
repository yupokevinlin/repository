import type { KeyboardEvent, ReactNode } from "react";
import { useRef } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type {
  ButtonSize,
  ButtonVariant,
} from "../../Buttons/Button/ButtonStyles";
import { Toggle } from "../Toggle";

export type ToggleGroupOrientation = "horizontal" | "vertical";

export const toggleGroupOrientations = [
  "horizontal",
  "vertical",
] as const satisfies Array<ToggleGroupOrientation>;

export interface ToggleGroupOption {
  value: string;
  label: ReactNode;
  startIcon?: ReactNode;
  disabled?: boolean;
}

interface ToggleGroupBaseProps {
  /** Names the set. Required — a toolbar with no name is a row of mystery buttons. */
  "aria-label": string;
  /** The options. */
  options: Array<ToggleGroupOption>;
  size?: ButtonSize;
  variant?: ButtonVariant;
  orientation?: ToggleGroupOrientation;
  disabled?: boolean;
  className?: string;
}

export type ToggleGroupProps = ToggleGroupBaseProps &
  (
    | {
        /** Exactly one option selected. Renders `role="radiogroup"`. */
        type: "single";
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        /** Any number selected. Renders `role="toolbar"`. */
        type: "multiple";
        value?: Array<string>;
        defaultValue?: Array<string>;
        onValueChange?: (value: Array<string>) => void;
      }
  );

/**
 * A row of toggles acting as one control — a view switch, a set of filters.
 *
 * The role follows the type, and the two are genuinely different controls:
 *
 * - `type="single"` is `role="radiogroup"`. Exactly one option is on, so it is
 *   a choice within a set, and each option reports `aria-checked`.
 * - `type="multiple"` is `role="toolbar"`. Each option is independently on or
 *   off, so each stays a pressed button reporting `aria-pressed`.
 *
 * Both use a roving tabindex: Tab enters and leaves the group, arrows move
 * within it. That is what makes a nine-button toolbar one stop rather than
 * nine.
 *
 * In `single`, arrows move **and** select, as radios do. In `multiple`, arrows
 * only move focus — selecting on focus would turn every pass through the
 * toolbar into a series of accidental toggles.
 *
 * @client
 *
 * @example A view switch — one at a time
 * ```tsx
 * <ToggleGroup
 *   type="single"
 *   aria-label="View"
 *   options={viewOptions}
 *   value={view}
 *   onValueChange={setView}
 * />
 * ```
 *
 * @example Filters — any number at once
 * ```tsx
 * <ToggleGroup
 *   type="multiple"
 *   aria-label="Filters"
 *   options={filterOptions}
 *   value={active}
 *   onValueChange={setActive}
 * />
 * ```
 *
 * @example Stacked in a sidebar
 * ```tsx
 * <ToggleGroup
 *   type="single"
 *   aria-label="Density"
 *   options={densityOptions}
 *   orientation="vertical"
 *   size="8"
 * />
 * ```
 */
export const ToggleGroup = (props: ToggleGroupProps) => {
  const {
    options,
    size,
    variant,
    orientation: orientationProp,
    disabled,
    className,
    "aria-label": ariaLabel,
  } = props;

  const orientation: ToggleGroupOrientation = orientationProp ?? "horizontal";
  const isSingle: boolean = props.type === "single";

  const [singleValue, setSingleValue] = useControllableState<string>(
    props.type === "single" ? props.value : undefined,
    (props.type === "single" ? props.defaultValue : undefined) ?? "",
    props.type === "single" ? props.onValueChange : undefined,
  );

  const [multipleValue, setMultipleValue] = useControllableState<Array<string>>(
    props.type === "multiple" ? props.value : undefined,
    (props.type === "multiple" ? props.defaultValue : undefined) ?? [],
    props.type === "multiple" ? props.onValueChange : undefined,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  const enabled: Array<ToggleGroupOption> = options.filter(
    (option: ToggleGroupOption) => option.disabled !== true,
  );

  const isPressed = (value: string): boolean =>
    isSingle ? singleValue === value : multipleValue.includes(value);

  const tabbableValue: string =
    enabled.find((option: ToggleGroupOption) => isPressed(option.value))
      ?.value ??
    enabled[0]?.value ??
    "";

  const focusAt = (index: number): ToggleGroupOption | undefined => {
    const option: ToggleGroupOption | undefined = enabled[index];
    if (option === undefined) {
      return undefined;
    }
    containerRef.current
      ?.querySelector<HTMLButtonElement>(`[data-value="${option.value}"]`)
      ?.focus();
    return option;
  };

  const toggle = (value: string): void => {
    if (isSingle) {
      setSingleValue(value);
      return;
    }
    setMultipleValue(
      multipleValue.includes(value)
        ? multipleValue.filter((current: string) => current !== value)
        : [...multipleValue, value],
    );
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const active: Element | null = document.activeElement;
    const activeValue: string | null =
      active instanceof HTMLElement ? active.getAttribute("data-value") : null;
    const currentIndex: number = enabled.findIndex(
      (option: ToggleGroupOption) => option.value === activeValue,
    );
    const from: number = currentIndex === -1 ? 0 : currentIndex;

    const next = (delta: number): void => {
      const option: ToggleGroupOption | undefined = focusAt(
        (from + delta + enabled.length) % enabled.length,
      );
      // Selection follows focus for single, as radios do; for multiple it
      // would turn every pass through the toolbar into accidental toggles.
      if (option !== undefined && isSingle) {
        setSingleValue(option.value);
      }
    };

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        next(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        next(-1);
        break;
      case "Home": {
        event.preventDefault();
        const first: ToggleGroupOption | undefined = focusAt(0);
        if (first !== undefined && isSingle) {
          setSingleValue(first.value);
        }
        break;
      }
      case "End": {
        event.preventDefault();
        const last: ToggleGroupOption | undefined = focusAt(enabled.length - 1);
        if (last !== undefined && isSingle) {
          setSingleValue(last.value);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      data-slot="toggle-group"
      role={isSingle ? "radiogroup" : "toolbar"}
      aria-label={ariaLabel}
      aria-orientation={orientation}
      ref={containerRef}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
    >
      {options.map((option: ToggleGroupOption) => {
        const pressed: boolean = isPressed(option.value);
        return (
          <Toggle
            key={option.value}
            data-value={option.value}
            data-slot="toggle-group-item"
            size={size}
            variant={variant}
            startIcon={option.startIcon}
            disabled={disabled === true || option.disabled === true}
            pressed={pressed}
            tabIndex={option.value === tabbableValue ? 0 : -1}
            // In a radiogroup each option is a choice within the set, so it
            // reports checked; aria-pressed would describe a different widget.
            role={isSingle ? "radio" : undefined}
            aria-checked={isSingle ? pressed : undefined}
            aria-pressed={isSingle ? undefined : pressed}
            onPressedChange={() => {
              toggle(option.value);
            }}
          >
            {option.label}
          </Toggle>
        );
      })}
    </div>
  );
};
