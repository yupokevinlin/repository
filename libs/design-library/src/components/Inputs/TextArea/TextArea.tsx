import type { ComponentPropsWithRef } from "react";
import { useCallback, useEffect, useRef } from "react";

import {
  FieldShell,
  type FieldShellOwnProps,
  useFieldShell,
} from "../../Forms/FieldShell/FieldShell";
import type { InputDensity } from "../shared/inputSurfaceStyles";
import { inputDensities } from "../shared/inputSurfaceStyles";
import { type TextAreaResize, TextAreaStyles } from "./TextAreaStyles";

export const textAreaResizes = [
  "none",
  "horizontal",
  "vertical",
  "both",
] as const satisfies Array<TextAreaResize>;

export const textAreaDensities = inputDensities;

export type { TextAreaResize };
export type TextAreaDensity = InputDensity;

export type TextAreaProps = Omit<
  ComponentPropsWithRef<"textarea">,
  "id" | "style"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /**
     * Which axes the user may drag. Defaults to `"vertical"` — horizontal
     * dragging breaks the surrounding layout more often than it helps.
     */
    resize?: TextAreaResize;
    /**
     * Grows with its content instead of scrolling.
     *
     * This forces the vertical axis off: a box that resizes itself and can
     * also be dragged fights the user, snapping back the moment they type.
     * `"both"` becomes `"horizontal"` and `"vertical"` becomes `"none"`.
     */
    autoResize?: boolean;
    /** Visible rows before it scrolls or grows. Defaults to `3`. */
    rows?: number;
  };

/**
 * Several lines of text — deal notes, a rejection reason, an address.
 *
 * Renders its own `<label>` and wiring through `FieldShell` (§5.1), exactly
 * like `TextInput`.
 *
 * @client
 *
 * @example Notes on a deal
 * ```tsx
 * <TextArea label="Notes" value={notes} onChange={onChange} />
 * ```
 *
 * @example Growing with its content, never scrolling
 * ```tsx
 * <TextArea label="Rejection reason" autoResize required />
 * ```
 *
 * @example Fixed size, in a dense table editor
 * ```tsx
 * <TextArea aria-label="Notes" resize="none" rows={2} density="compact" />
 * ```
 */
export const TextArea = ({
  id,
  label,
  hint,
  error,
  required,
  density: densityProp,
  resize: resizeProp,
  autoResize,
  rows,
  className: classNameProp,
  disabled,
  value,
  defaultValue,
  onChange,
  ref,
  ...remainingProps
}: TextAreaProps) => {
  const density: TextAreaDensity = densityProp ?? "comfortable";
  const requested: TextAreaResize = resizeProp ?? "vertical";

  // A self-sizing box that can also be dragged vertically fights the user, so
  // auto-resize wins and the vertical axis is dropped.
  const resize: TextAreaResize =
    autoResize === true
      ? requested === "both"
        ? "horizontal"
        : requested === "vertical"
          ? "none"
          : requested
      : requested;

  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density: densityProp,
  });
  const invalid: boolean = error !== undefined && error !== null;

  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  const fit = useCallback((element: HTMLTextAreaElement | null): void => {
    if (element === null) {
      return;
    }
    // Reset first: without this the box can only ever grow, because
    // scrollHeight never reports less than the height already set.
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (autoResize === true) {
      fit(internalRef.current);
    }
  }, [autoResize, fit, value, defaultValue]);

  return (
    <FieldShell {...fieldProps} className={classNameProp}>
      <div
        data-slot="text-area"
        className={TextAreaStyles.textAreaSurfaceStyle({ invalid, density })}
      >
        <textarea
          data-slot="text-area-control"
          rows={rows ?? 3}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          className={TextAreaStyles.textAreaElementStyle({ resize })}
          ref={(element: HTMLTextAreaElement | null) => {
            internalRef.current = element;
            if (typeof ref === "function") {
              ref(element);
            } else if (ref !== null && ref !== undefined) {
              ref.current = element;
            }
          }}
          onChange={(event) => {
            if (autoResize === true) {
              fit(event.currentTarget);
            }
            onChange?.(event);
          }}
          {...controlProps}
          {...remainingProps}
        />
      </div>
    </FieldShell>
  );
};
