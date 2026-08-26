import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  LoadingSpinner,
  type LoadingSpinnerSize,
} from "../../LoadingSpinner/LoadingSpinner";
import {
  type ButtonSize,
  ButtonStyles,
  type ButtonVariant,
} from "../Button/ButtonStyles";
import { IconButtonStyles } from "./IconButtonStyles";

/** Each button height pairs with the matching spinner step from the §4 scale. */
const spinnerSizeForButtonSize: Record<ButtonSize, LoadingSpinnerSize> = {
  "8": "4",
  "10": "5",
  "12": "6",
};

export type IconButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "children" | "aria-label"
> & {
  /** The icon. Sized automatically to match the button's `size`. */
  icon: ReactNode;
  /**
   * What the button does, in words. Required — an icon on its own has no
   * accessible name, so without this the button is announced as "button"
   * and nothing else. This is the only prop the type system insists on.
   */
  "aria-label": string;
  /** Shares `Button`'s variant list exactly. Defaults to `"default-soft"`. */
  variant?: ButtonVariant;
  /** Height, and therefore width — it is a square. Defaults to `"10"`. */
  size?: ButtonSize;
  /** Swaps the icon for a spinner and blocks interaction. */
  loading?: boolean;
};

/**
 * A button with an icon and no label — a close X, a row's overflow menu, a
 * sort toggle. Always a `<button>`, never an `<a>`; there is no `href`.
 *
 * `aria-label` is required at the type level rather than merely documented,
 * because an icon button without one is silent to a screen reader and that
 * is not a mistake a code review reliably catches.
 *
 * It borrows `Button`'s cva outright and only squares it off, so the two
 * cannot drift apart. It defaults to `default-soft` rather than
 * `primary-solid`: icon buttons usually sit beside content they should not
 * outshout.
 *
 * @server-safe
 *
 * @example Close
 * ```tsx
 * <IconButton icon={<XIcon />} aria-label="Close" onClick={close} />
 * ```
 *
 * @example Destructive, small, in a table row
 * ```tsx
 * <IconButton
 *   icon={<TrashIcon />}
 *   aria-label="Delete line item"
 *   variant="destructive-soft"
 *   size="8"
 *   onClick={() => remove(item.id)}
 * />
 * ```
 *
 * @example While the request is in flight
 * ```tsx
 * <IconButton icon={<SaveIcon />} aria-label="Save" loading={isSaving} />
 * ```
 */
export const IconButton = ({
  icon,
  variant: variantProp,
  size: sizeProp,
  loading,
  disabled,
  className: classNameProp,
  ...remainingProps
}: IconButtonProps) => {
  const variant: ButtonVariant = variantProp ?? "default-soft";
  const size: ButtonSize = sizeProp ?? "10";

  return (
    <button
      data-slot="icon-button"
      type="button"
      disabled={disabled}
      aria-busy={loading}
      className={cn(
        ButtonStyles.buttonStyle({ variant, size }),
        IconButtonStyles.squareStyle({ size }),
        loading === true && "relative pointer-events-none",
        classNameProp,
      )}
      {...remainingProps}
    >
      <span
        data-slot="icon-button-icon"
        className={cn(
          ButtonStyles.iconStyle({ size }),
          loading === true && "opacity-0",
        )}
      >
        {icon}
      </span>
      {loading === true && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner
            size={spinnerSizeForButtonSize[size]}
            className="text-inherit"
          />
        </span>
      )}
    </button>
  );
};
