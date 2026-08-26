import { useEffect, useId, useRef, useState } from "react";

import { useFocusTrap } from "../../../../hooks/useFocusTrap";
import { useScrollLock } from "../../../../hooks/useScrollLock";
import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";
import { Button } from "../../../Buttons/Button";
import { TextArea } from "../../../Inputs/TextArea";
import { TextInput } from "../../../Inputs/TextInput";
import { Heading } from "../../../Typography/Heading";
import { Typography } from "../../../Typography/Typography";
import { ModalStyles } from "../../Modal/modalStyles";
import { Portal } from "../../Portal";
import type { ConfirmModalProps } from "../ConfirmModal";

export type ConfirmModalPanelProps = Omit<ConfirmModalProps, "open">;

/**
 * The open half of `ConfirmModal`.
 *
 * Split out so it mounts and unmounts with the dialog: the reason and password
 * live here, which makes "cleared on every open" a consequence of the tree
 * rather than an effect that has to remember to fire.
 *
 * @client
 */
export const ConfirmModalPanel = ({
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel,
  cancelLabel,
  severity,
  requireReason,
  reasonLabel,
  requirePassword,
  passwordLabel,
  onPasswordChange,
  busy,
}: ConfirmModalPanelProps) => {
  const titleId: string = useId();
  const descriptionId: string = useId();

  const cancelRef = useRef<HTMLButtonElement>(null);
  const { containerRef } = useFocusTrap<HTMLDivElement>({
    active: true,
    // Focus lands on cancel: a reflexive Enter must not confirm.
    initialFocusRef: cancelRef,
  });

  useScrollLock(true);

  const [reason, setReason] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
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
  }, [onOpenChange]);

  const blocked: boolean =
    busy === true ||
    (requireReason === true && reason.trim() === "") ||
    (requirePassword === true && password === "");

  return (
    <Portal>
      <div
        data-slot="confirm-modal-scrim"
        // No dismissal handler at all: a confirmation cannot be dismissed by
        // clicking past it, because a stray click is what it exists to catch.
        className={ModalStyles.scrimStyle()}
      >
        <div
          data-slot="confirm-modal"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          ref={containerRef}
          className={ModalStyles.panelStyle({ size: "sm" })}
        >
          <div
            data-slot="confirm-modal-header"
            className={ModalStyles.headerStyle()}
          >
            <Heading as="h2" size="title-sm" id={titleId}>
              {title}
            </Heading>
          </div>

          <div
            data-slot="confirm-modal-body"
            className={cn(ModalStyles.bodyStyle(), "flex flex-col gap-3")}
          >
            <Typography as="p" size="body-sm" id={descriptionId}>
              {description}
            </Typography>

            {requireReason === true && (
              <TextArea
                label={reasonLabel ?? "Reason"}
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                }}
                required
                rows={3}
              />
            )}

            {requirePassword === true && (
              <TextInput
                label={passwordLabel ?? "Password"}
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  onPasswordChange?.(event.target.value);
                }}
                required
                autoComplete="current-password"
              />
            )}
          </div>

          <div
            data-slot="confirm-modal-footer"
            className={ModalStyles.footerStyle()}
          >
            <Button
              variant="default-outline"
              ref={cancelRef}
              disabled={busy === true}
              onClick={() => {
                onOpenChange(false);
              }}
            >
              {cancelLabel ?? "Cancel"}
            </Button>
            <Button
              data-slot="confirm-modal-confirm"
              variant={
                (severity ?? "warning") === "error"
                  ? "destructive-solid"
                  : "primary-solid"
              }
              disabled={blocked}
              loading={busy}
              onClick={() => {
                onConfirm(reason);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
