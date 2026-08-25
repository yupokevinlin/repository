import type { ComponentPropsWithRef } from "react";

import { cn } from "../../tailwind/tailwindMerge/tailwindMerge";
import {
  type LoadingSpinnerSize,
  LoadingSpinnerStyles,
  type LoadingSpinnerVariant,
} from "./LoadingSpinnerStyles";

export const loadingSpinnerVariants = [
  "primary",
  "secondary",
  "tertiary",
  "default",
  "destructive",
] as const satisfies Array<LoadingSpinnerVariant>;

export const loadingSpinnerSizes = [
  "4",
  "5",
  "6",
] as const satisfies Array<LoadingSpinnerSize>;

export type { LoadingSpinnerSize, LoadingSpinnerVariant };

export type LoadingSpinnerProps = Omit<
  ComponentPropsWithRef<"span">,
  "children"
> & {
  /** Color role for the spinner. Defaults to `"default"`. */
  variant?: LoadingSpinnerVariant;
  /**
   * Diameter as a Tailwind size unit (1 unit = 4px). `"4"` = 16px,
   * `"5"` = 20px, `"6"` = 24px. Defaults to `"5"`.
   *
   * Inside a sized control the parent picks the matching step — see
   * `Button`, which maps its own `size` onto this one.
   */
  size?: LoadingSpinnerSize;
  /** Accessible label announced to screen readers. Defaults to `"Loading"`. */
  label?: string;
};

export const LoadingSpinner = ({
  variant: variantProp,
  size: sizeProp,
  label = "Loading",
  className: classNameProp,
  ...remainingProps
}: LoadingSpinnerProps) => {
  const variant: LoadingSpinnerVariant = variantProp ?? "default";
  const size: LoadingSpinnerSize = sizeProp ?? "5";
  const className: string = classNameProp ?? "";

  return (
    <span role="status" aria-label={label} {...remainingProps}>
      <svg
        className={cn(
          LoadingSpinnerStyles.spinnerStyle({ size, variant }),
          className,
        )}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};
