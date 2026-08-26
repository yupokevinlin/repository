import type { ComponentPropsWithRef, DragEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { focusRingStyle } from "../../../tailwind/focus/focusRing";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import type { FieldShellOwnProps } from "../../Forms/FieldShell/FieldShell";
import { FieldShell, useFieldShell } from "../../Forms/FieldShell/FieldShell";
import type { InputDensity } from "../shared/inputSurfaceStyles";
import { inputDensities } from "../shared/inputSurfaceStyles";

export const fileDropzoneDensities = inputDensities;

export type FileDropzoneDensity = InputDensity;

export type FileDropzoneProps = Omit<
  ComponentPropsWithRef<"input">,
  "id" | "size" | "type" | "onChange" | "value" | "defaultValue"
> &
  FieldShellOwnProps & {
    /** Optional explicit id. One is generated when omitted. */
    id?: string;
    /** Fires with whatever was chosen, by drop or by dialog. */
    onFilesSelected?: (files: Array<File>) => void;
    /** The call to action inside the zone. */
    children?: ReactNode;
    density?: FileDropzoneDensity;
  };

/**
 * A drop target for files, wrapped around a real `<input type="file">`.
 *
 * The input is the control; dragging is an enhancement on top of it. Anyone
 * who cannot drag — keyboard, screen reader, touch, or just someone whose
 * file is already in a dialog — reaches the same picker by focusing the zone
 * and pressing Enter. A drop-only zone is unusable for a large number of
 * people and looks fine to whoever built it.
 *
 * The input is not `display: none`, which would take it out of the tab order
 * entirely. It is transparent and stretched across the zone, so the whole
 * area is the control's own hit target and focus lands where you expect.
 *
 * Selected files leave through `onFilesSelected`; nothing is kept (§10.4).
 * The transient drag state is internal and not controllable.
 *
 * @client
 *
 * @example Attaching documents to a deal
 * ```tsx
 * <FileDropzone label="Documents" multiple onFilesSelected={upload} />
 * ```
 *
 * @example One PDF only, with the restriction stated
 * ```tsx
 * <FileDropzone
 *   label="Signed contract"
 *   accept="application/pdf"
 *   hint="PDF, up to 10 MB."
 *   onFilesSelected={([file]) => attach(file)}
 * />
 * ```
 *
 * @example Rejected, with the reason
 * ```tsx
 * <FileDropzone label="Documents" error="That file is larger than 10 MB." />
 * ```
 */
export const FileDropzone = ({
  id,
  label,
  hint,
  error,
  required,
  density,
  onFilesSelected,
  children,
  className: classNameProp,
  disabled,
  ...remainingProps
}: FileDropzoneProps) => {
  const { controlProps, fieldProps } = useFieldShell({
    id,
    label,
    hint,
    error,
    required,
    density,
  });
  const invalid: boolean = error !== undefined && error !== null;

  // Counted rather than a boolean: dragging over a child element fires
  // dragleave on the parent, so a boolean flickers off mid-drag.
  const dragDepth = useRef<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled === true) {
      return;
    }
    onFilesSelected?.(Array.from(event.dataTransfer.files));
  };

  return (
    <FieldShell {...fieldProps} className={classNameProp}>
      <div
        data-slot="file-dropzone"
        data-dragging={dragging ? "true" : undefined}
        className={cn(
          "relative flex w-full flex-col items-center justify-center gap-1",
          "rounded-md border border-dashed text-center transition-colors duration-150",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-bg-disabled has-[:disabled]:text-fg-disabled",
          density === "compact" ? "px-3 py-4" : "px-4 py-8",
          invalid
            ? "border-border-error has-[:focus-visible]:outline-border-error"
            : "border-border-strong has-[:focus-visible]:outline-border-primary",
          dragging
            ? "border-border-primary bg-bg-primary-soft"
            : "bg-bg-default",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          // Without this the browser navigates to the dropped file instead.
          event.preventDefault();
        }}
        onDragLeave={() => {
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <input
          data-slot="file-dropzone-control"
          type="file"
          disabled={disabled}
          // Stretched and transparent rather than hidden: display:none would
          // take it out of the tab order and leave the zone unreachable.
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer opacity-0",
            "disabled:cursor-not-allowed",
            focusRingStyle,
          )}
          onChange={(event) => {
            onFilesSelected?.(Array.from(event.target.files ?? []));
          }}
          {...controlProps}
          {...remainingProps}
        />
        <span
          data-slot="file-dropzone-content"
          className="pointer-events-none text-body-sm text-fg-muted"
        >
          {children}
        </span>
      </div>
    </FieldShell>
  );
};
