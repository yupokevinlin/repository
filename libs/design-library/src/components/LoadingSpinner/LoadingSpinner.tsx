import type { ComponentPropsWithRef } from "react";

import { cn } from "../../tailwind/tailwindMerge/tailwindMerge";
import {
  LoadingSpinnerStyles,
  type LoadingSpinnerVariant,
} from "./LoadingSpinnerStyles";

export const loadingSpinnerVariants = [
  "primary",
  "secondary",
  "tertiary",
  "default",
  "destructive",
] as const satisfies LoadingSpinnerVariant[];

export type { LoadingSpinnerVariant };

export type LoadingSpinnerProps = Omit<
  ComponentPropsWithRef<"span">,
  "children"
> & {
  /** Color role for the spinner. Defaults to `"default"`. */
  variant?: LoadingSpinnerVariant;
  /** Accessible label announced to screen readers. Defaults to `"Loading"`. */
  label?: string;
};

export const LoadingSpinner = ({
  variant: variantProp,
  label = "Loading",
  className: classNameProp,
  ...remainingProps
}: LoadingSpinnerProps) => {
  const variant: LoadingSpinnerVariant = variantProp ?? "default";
  const className: string = classNameProp ?? "";

  return (
    <span role="status" aria-label={label} {...remainingProps}>
      <svg
        className={cn(
          LoadingSpinnerStyles.spinnerStyle({ variant }),
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
