import type { ReactNode } from "react";
import { useEffect, useId } from "react";

import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { IconButton } from "../../Buttons/IconButton";
import { Heading } from "../../Typography/Heading";
import { Portal } from "../Portal";
import { type ModalSize, modalSizes, ModalStyles } from "./modalStyles";

export { modalSizes };
export type { ModalSize };

export interface ModalProps {
  /**
   * Controlled only — there is no `defaultOpen`. A dialog that can open itself
   * is a dialog nobody owns, and closing it after an action needs the caller
   * to hold the state anyway.
   */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The heading. Also the dialog's accessible name. */
  title: ReactNode;
  /** The body. The only part that scrolls. */
  children: ReactNode;
  /** Actions, pinned to the bottom. Usually a `ButtonGroup` or two `Button`s. */
  footer?: ReactNode;
  /** Defaults to `"md"` — 32rem. */
  size?: ModalSize;
  /**
   * Whether clicking the dimmed background closes it. Defaults to `true`.
   * Turn it off where losing the work would be expensive; `ConfirmModal`
   * turns it off permanently.
   */
  dismissOnScrimClick?: boolean;
  /** The close button's name. Defaults to `"Close"`. */
  closeLabel?: string;
  className?: string;
}

const closeIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

/**
 * A dialog that takes over the page until it is dealt with.
 *
 * `aria-modal="true"` and labelled by its own heading, so a screen reader
 * announces what it is on arrival rather than "dialog".
 *
 * Three things happen together on open, and all three matter: focus moves in
 * and is **trapped** (Tab cannot reach the page behind), body scroll is
 * **locked** (scrolling past the end of the dialog must not move the page
 * underneath), and focus **returns to the trigger** on close.
 *
 * Controlled only. Reach for `Popover` when the page behind should stay
 * usable, and `ConfirmModal` when the user is being asked to agree to
 * something irreversible.
 *
 * @client
 *
 * @example Editing a record
 * ```tsx
 * <Modal open={open} onOpenChange={setOpen} title="Amend deal"
 *   footer={<Button onClick={save}>Save</Button>}>
 *   <DealForm />
 * </Modal>
 * ```
 *
 * @example Wide, for a table
 * ```tsx
 * <Modal open={open} onOpenChange={setOpen} title="Line items" size="lg">
 *   <LineItemTable />
 * </Modal>
 * ```
 *
 * @example Holding work worth protecting from a stray click
 * ```tsx
 * <Modal
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="New deal"
 *   dismissOnScrimClick={false}
 * >
 *   <DealForm />
 * </Modal>
 * ```
 */
export const Modal = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
  size,
  dismissOnScrimClick,
  closeLabel,
  className,
}: ModalProps) => {
  const titleId: string = useId();
  const { containerRef } = useFocusTrap<HTMLDivElement>({ active: open });

  useScrollLock(open);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      {/* The scrim carries no semantics of its own: it is a pointer shortcut
          for the close button, and Escape is the keyboard route. Marking it
          presentational says that outright, rather than suppressing the two
          a11y rules that would otherwise ask for a key handler duplicating a
          key that is already handled. */}
      <div
        data-slot="modal-scrim"
        role="presentation"
        className={ModalStyles.scrimStyle()}
        onClick={(event) => {
          // Only a click that started and ended on the scrim itself. Without
          // the target check, releasing a text selection that began inside the
          // dialog would close it.
          if (
            dismissOnScrimClick !== false &&
            event.target === event.currentTarget
          ) {
            onOpenChange(false);
          }
        }}
      >
        <div
          data-slot="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          ref={containerRef}
          className={cn(ModalStyles.panelStyle({ size }), className)}
        >
          <div data-slot="modal-header" className={ModalStyles.headerStyle()}>
            <Heading
              as="h2"
              size="title-sm"
              id={titleId}
              className="min-w-0 flex-1"
            >
              {title}
            </Heading>
            <IconButton
              icon={closeIcon}
              aria-label={closeLabel ?? "Close"}
              size="8"
              variant="default-soft"
              onClick={() => {
                onOpenChange(false);
              }}
            />
          </div>
          <div data-slot="modal-body" className={ModalStyles.bodyStyle()}>
            {children}
          </div>
          {footer !== undefined && (
            <div data-slot="modal-footer" className={ModalStyles.footerStyle()}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};
