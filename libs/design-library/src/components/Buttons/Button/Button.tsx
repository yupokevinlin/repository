import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type ButtonSize,
  type ButtonStorybookState,
  ButtonStyles,
  type ButtonVariant,
} from "./ButtonStyles";

export const buttonVariants = [
  "primary-solid",
  "primary-soft",
  "primary-outline",
  "secondary-solid",
  "secondary-soft",
  "secondary-outline",
  "tertiary-solid",
  "tertiary-soft",
  "tertiary-outline",
  "default-solid",
  "default-soft",
  "default-outline",
  "destructive-solid",
  "destructive-soft",
  "destructive-outline",
] as const satisfies ButtonVariant[];

export const buttonSizes = ["8", "10", "12"] as const satisfies ButtonSize[];

export type { ButtonSize, ButtonVariant };

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  /** Visual style combining a color role (`primary`, `secondary`, `tertiary`, `default`, `destructive`) and a fill style (`solid`, `soft`, `outline`). Defaults to `"primary-solid"`. */
  variant?: ButtonVariant;
  /** Height of the button as a Tailwind size unit (1 unit = 4px). `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
  size?: ButtonSize;
  /** Icon rendered to the left of the label. Sized automatically to match the button's `size`. */
  startIcon?: ReactNode;
  /** Icon rendered to the right of the label. Sized automatically to match the button's `size`. */
  endIcon?: ReactNode;
  /** The button label. */
  children: ReactNode;
  /** @internal For Storybook gallery use only — forces a visual pseudo-state. */
  _storybookState?: ButtonStorybookState;
};

export const Button = ({
  variant: variantProp,
  size: sizeProp,
  startIcon,
  endIcon,
  className: classNameProp,
  children,
  _storybookState,
  ...remainingProps
}: ButtonProps) => {
  const variant: ButtonVariant = variantProp ?? "primary-solid";
  const size: ButtonSize = sizeProp ?? "10";
  const className: string = classNameProp ?? "";
  const buttonStyle: string = ButtonStyles.buttonStyle({ variant, size });
  const iconStyle: string = ButtonStyles.iconStyle({ size });
  const storybookStateStyle: string = _storybookState
    ? ButtonStyles.getStorybookStateStyle(variant, _storybookState)
    : "";
  return (
    <button
      {...remainingProps}
      className={cn(buttonStyle, storybookStateStyle, className)}
    >
      {startIcon && <span className={iconStyle}>{startIcon}</span>}
      <span className={ButtonStyles.labelStyle}>{children}</span>
      {endIcon && <span className={iconStyle}>{endIcon}</span>}
    </button>
  );
};
