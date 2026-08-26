import type { ReactNode } from "react";
import { useId } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { HelperText } from "../HelperText";
import { Label } from "../Label";

export type FieldShellDensity = "comfortable" | "compact";

/**
 * The four props every form control takes (§5.1), plus density. Controls
 * spread this into their own props type rather than restating it.
 */
export interface FieldShellOwnProps {
  /** The field's name. Omit only when `aria-label` is supplied instead. */
  label?: ReactNode;
  /** Helper text, wired via `aria-describedby`. */
  hint?: ReactNode;
  /** Error text. Its presence implies `aria-invalid` on the control. */
  error?: ReactNode;
  /** Renders the marker and sets `aria-required` on the control. */
  required?: boolean;
  /** Tightens label and helper spacing. Never changes the control's height. */
  density?: FieldShellDensity;
}

/**
 * What `useFieldShell` hands back for the control to spread onto its input.
 */
export interface FieldShellControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
}

export type UseFieldShellArgs = FieldShellOwnProps & {
  /** The caller's own `id`, when it supplied one. */
  id?: string;
};

export interface UseFieldShellResult {
  /** Spread onto the control element. */
  controlProps: FieldShellControlProps;
  /** Pass straight to `FieldShell`. */
  fieldProps: FieldShellProps;
}

/**
 * Works out the ids and ARIA wiring for one field.
 *
 * Split from the rendering because the control needs `controlProps` for the
 * element it owns, while `FieldShell` needs the rest for the markup around it.
 *
 * `error` wins over `hint` in `aria-describedby` when both are present, rather
 * than concatenating: a screen reader reading "Mid-market rate at 16:00 UTC.
 * Quantity exceeds the remaining allocation." buries the part that needs
 * acting on. The hint stays visible — it is only dropped from the description.
 */
export const useFieldShell = ({
  id: idProp,
  label,
  hint,
  error,
  required,
  density,
}: UseFieldShellArgs): UseFieldShellResult => {
  const generatedId: string = useId();
  const id: string = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const hasHint: boolean = hint !== undefined && hint !== null;
  const hasError: boolean = error !== undefined && error !== null;

  return {
    controlProps: {
      id,
      "aria-describedby": hasError ? errorId : hasHint ? hintId : undefined,
      "aria-invalid": hasError ? true : undefined,
      "aria-required": required === true ? true : undefined,
    },
    fieldProps: {
      id,
      hintId,
      errorId,
      label,
      hint,
      error,
      required,
      density,
      children: null,
    },
  };
};

export type FieldShellProps = FieldShellOwnProps & {
  /** The control itself. */
  children: ReactNode;
  /** The control's id, for the label's `for`. */
  id: string;
  /** From `useFieldShell`. */
  hintId: string;
  /** From `useFieldShell`. */
  errorId: string;
  className?: string;
};

/**
 * The markup around a form control — its label above, its hint or error below.
 *
 * Internal and non-exported: not public API, not a component under §2, so no
 * barrel, gallery or story. Every control in Wave 3 renders through it so that
 * spacing and wiring are identical across all eleven of them rather than
 * reimplemented eleven times.
 *
 * Hint and error are both rendered when both are present — the hint still
 * explains the field even once something is wrong — but only the error is
 * pointed at by `aria-describedby`.
 *
 * @client
 *
 * @example Inside a control
 * ```tsx
 * const { controlProps, fieldProps } = useFieldShell(props);
 *
 * <FieldShell {...fieldProps}>
 *   <input {...controlProps} className={inputStyle()} />
 * </FieldShell>
 * ```
 */
export const FieldShell = ({
  children,
  id,
  hintId,
  errorId,
  label,
  hint,
  error,
  required,
  density: densityProp,
  className,
}: FieldShellProps) => {
  const density: FieldShellDensity = densityProp ?? "comfortable";
  const hasHint: boolean = hint !== undefined && hint !== null;
  const hasError: boolean = error !== undefined && error !== null;

  return (
    <div
      data-slot="field"
      className={cn(
        "flex min-w-0 flex-col",
        density === "compact" ? "gap-1" : "gap-1.5",
        className,
      )}
    >
      {label !== undefined && label !== null && (
        <Label htmlFor={id} required={required} density={density}>
          {label}
        </Label>
      )}
      {children}
      {hasHint && (
        <HelperText id={hintId} density={density}>
          {hint}
        </HelperText>
      )}
      {hasError && (
        <HelperText id={errorId} severity="error" density={density} live>
          {error}
        </HelperText>
      )}
    </div>
  );
};
