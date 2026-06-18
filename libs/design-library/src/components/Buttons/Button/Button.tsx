import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { ButtonStyles } from "./ButtonStyles";

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
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["8", "10", "12"] as const;

export type ButtonSize = (typeof buttonSizes)[number];

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export const Button = ({
  variant: variantProp,
  size: sizeProp,
  startIcon,
  endIcon,
  className: classNameProp,
  children,
  ...remainingProps
}: ButtonProps) => {
  const variant: ButtonVariant = variantProp ?? "primary-solid";
  const size: ButtonSize = sizeProp ?? "10";
  const className: string = classNameProp ?? "";
  const buttonStyle: string = ButtonStyles.buttonStyle({ variant, size });
  return (
    <button {...remainingProps} className={cn(buttonStyle, className)}>
      {startIcon && <span className="shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="shrink-0">{endIcon}</span>}
    </button>
  );
};
