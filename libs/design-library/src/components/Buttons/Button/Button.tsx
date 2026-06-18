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
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
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
