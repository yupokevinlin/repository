import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type TextInputSize,
  type TextInputStorybookState,
  TextInputStyles,
  type TextInputVariant,
} from "./TextInputStyles";

export const textInputVariants = [
  "default",
  "error",
  "success",
] as const satisfies Array<TextInputVariant>;

export const textInputSizes = [
  "8",
  "10",
  "12",
] as const satisfies Array<TextInputSize>;

export type { TextInputSize, TextInputVariant };

export type TextInputProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
  /** Semantic variant controlling border and focus-ring color. Defaults to `"default"`. */
  variant?: TextInputVariant;
  /** Height of the input as a Tailwind size unit (1 unit = 4px). `"8"` = 32px, `"10"` = 40px, `"12"` = 48px. Defaults to `"10"`. */
  size?: TextInputSize;
  /** Icon rendered to the left of the input. Sized automatically to match the input's `size`. */
  startIcon?: ReactNode;
  /** Icon rendered to the right of the input. Sized automatically to match the input's `size`. */
  endIcon?: ReactNode;
  /** @internal For Storybook gallery use only — forces a visual pseudo-state. */
  _storybookState?: TextInputStorybookState;
};

export const TextInput = ({
  variant: variantProp,
  size: sizeProp,
  startIcon,
  endIcon,
  className: classNameProp,
  disabled,
  _storybookState,
  ...remainingProps
}: TextInputProps) => {
  const variant: TextInputVariant = variantProp ?? "default";
  const size: TextInputSize = sizeProp ?? "10";
  const className: string = classNameProp ?? "";
  const wrapper: string = TextInputStyles.wrapperStyle({ variant, size });
  const icon: string = TextInputStyles.iconStyle({ size });
  const storybookStateStyle: string = _storybookState
    ? TextInputStyles.getStorybookStateStyle(variant, _storybookState)
    : "";
  return (
    <div className={cn(wrapper, storybookStateStyle, className)}>
      {startIcon && <span className={icon}>{startIcon}</span>}
      <input
        {...remainingProps}
        disabled={disabled}
        className={TextInputStyles.inputStyle}
      />
      {endIcon && <span className={icon}>{endIcon}</span>}
    </div>
  );
};
