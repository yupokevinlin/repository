import type { ComponentPropsWithRef, ReactNode } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type ButtonSize,
  ButtonStyles,
  type ButtonVariant,
} from "../../Buttons/Button/ButtonStyles";

export const toggleSizes = [
  "8",
  "10",
  "12",
] as const satisfies Array<ButtonSize>;

export type ToggleSize = ButtonSize;

export type ToggleProps = Omit<
  ComponentPropsWithRef<"button">,
  "type" | "value"
> & {
  /** The label. */
  children: ReactNode;
  /** Controlled state. Pair with `onPressedChange`. */
  pressed?: boolean;
  /** Initial state when uncontrolled. Defaults to `false`. */
  defaultPressed?: boolean;
  /** Fires on every change, in both controlled and uncontrolled mode. */
  onPressedChange?: (pressed: boolean) => void;
  /** Height. `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
  size?: ToggleSize;
  /** The unpressed appearance. Defaults to `"default-outline"`. */
  variant?: ButtonVariant;
  /** Icon rendered before the label. */
  startIcon?: ReactNode;
};

/**
 * A button that stays down — bold in a formatting bar, a filter that is either
 * applied or not.
 *
 * `aria-pressed`, not `aria-checked`. The distinction is not cosmetic: pressed
 * is a button that remembers its last activation, checked is a choice within a
 * set. A screen reader says "pressed" for one and "checked" for the other, and
 * swapping them tells the user the control is something it is not.
 *
 * Use `Switch` instead for a setting that reads as on or off, and `Checkbox`
 * for something a Save button later applies. Reach for this when the control
 * looks and behaves like a button that happens to have a sticky state.
 *
 * A set of these where exactly one is pressed is `ToggleGroup`, which adds the
 * roving tabindex and the group semantics.
 *
 * @client
 *
 * @example A filter
 * ```tsx
 * <Toggle pressed={onlyMine} onPressedChange={setOnlyMine}>My deals</Toggle>
 * ```
 *
 * @example Uncontrolled, with an icon
 * ```tsx
 * <Toggle defaultPressed startIcon={<BoldIcon />}>Bold</Toggle>
 * ```
 *
 * @example Sized down for a table toolbar
 * ```tsx
 * <Toggle size="8" variant="default-soft">Unsettled only</Toggle>
 * ```
 */
export const Toggle = ({
  children,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  size: sizeProp,
  variant: variantProp,
  startIcon,
  className: classNameProp,
  disabled,
  onClick,
  ...remainingProps
}: ToggleProps) => {
  const size: ToggleSize = sizeProp ?? "10";
  const variant: ButtonVariant = variantProp ?? "default-outline";

  const [pressed, setPressed] = useControllableState<boolean>(
    pressedProp,
    defaultPressed ?? false,
    onPressedChange,
  );

  return (
    <button
      data-slot="toggle"
      type="button"
      // Not aria-checked: this is a button that remembers, not a choice
      // within a set.
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      disabled={disabled}
      className={cn(
        ButtonStyles.buttonStyle({ variant, size }),
        // The pressed look is a filled surface rather than a border change,
        // so it survives being read at a glance across a toolbar.
        pressed === true &&
          "bg-bg-primary-soft border-border-primary text-fg-primary-default",
        classNameProp,
      )}
      onClick={(event) => {
        setPressed(!pressed);
        onClick?.(event);
      }}
      {...remainingProps}
    >
      {startIcon !== undefined && (
        <span
          data-slot="toggle-icon"
          className={ButtonStyles.iconStyle({ size })}
        >
          {startIcon}
        </span>
      )}
      <span data-slot="toggle-label" className={ButtonStyles.labelStyle}>
        {children}
      </span>
    </button>
  );
};
