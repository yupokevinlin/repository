import type { ReactNode } from "react";

import { ConfirmModalPanel } from "./ConfirmModalPanel/ConfirmModalPanel";

/**
 * Only two of the five §4.1 values. A confirmation is asked for either because
 * something is hard to undo (`warning`) or because it destroys something
 * (`error`). There is no informational confirmation — that is a `Modal`.
 */
export type ConfirmSeverity = "warning" | "error";

export const confirmSeverities = [
  "warning",
  "error",
] as const satisfies Array<ConfirmSeverity>;

export interface ConfirmModalProps {
  /** Controlled only. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What is about to happen, as a question. */
  title: ReactNode;
  /** The consequence, in plain words. */
  description: ReactNode;
  /** Runs when the user confirms. Receives the reason when one was required. */
  onConfirm: (reason: string) => void;
  /** The confirm button's label. Say the verb — "Delete", not "OK". */
  confirmLabel: string;
  /** Defaults to `"Cancel"`. */
  cancelLabel?: string;
  /** Defaults to `"warning"`. */
  severity?: ConfirmSeverity;
  /**
   * Blocks confirmation until the user types something. Use where the reason
   * is recorded — a rejection, a cancellation, a credit override.
   */
  requireReason?: boolean;
  /** The reason field's label. Defaults to `"Reason"`. */
  reasonLabel?: string;
  /**
   * Blocks confirmation until the user re-enters their password. The step-up
   * shell only collects it — verifying it is the app's job, in `onConfirm`.
   */
  requirePassword?: boolean;
  /** The password field's label. Defaults to `"Password"`. */
  passwordLabel?: string;
  /** Called with the password when `requirePassword` is on. */
  onPasswordChange?: (password: string) => void;
  /** Blocks the buttons while the action is in flight. */
  busy?: boolean;
}

/**
 * A dialog asking the user to agree to something they cannot easily undo.
 *
 * **Not a variant of `Modal`**, deliberately. It cannot be dismissed by
 * clicking the background, it has a fixed two-button shape, and it can hold
 * confirmation back behind a typed reason or a password. A `Modal` with an
 * `isConfirm` prop would let any of those be forgotten at a call site where
 * they matter most.
 *
 * It is an `alertdialog` rather than a `dialog`: what it says is the point,
 * so a screen reader announces the consequence on arrival instead of waiting
 * to be asked.
 *
 * Focus lands on **cancel**, not confirm. A user who hits Enter reflexively on
 * a dialog they did not expect should not thereby delete a deal.
 *
 * The severity subset is `warning | error` only (§4.1): a confirmation exists
 * because something is hard to undo or destructive. There is no informational
 * confirmation — that is a `Modal`.
 *
 * `requirePassword` is the step-up re-authentication shell. It collects the
 * password and blocks the button; **verifying it is the app's job**, and this
 * component never sees whether it was right.
 *
 * Confirming does not close it. The caller closes it when the work is done,
 * which is what makes `busy` mean anything.
 *
 * @client
 *
 * @example Deleting
 * ```tsx
 * <ConfirmModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   severity="error"
 *   title="Delete this deal?"
 *   description="NPM-1042 and its four line items will be removed."
 *   confirmLabel="Delete deal"
 *   onConfirm={remove}
 * />
 * ```
 *
 * @example Requiring a recorded reason
 * ```tsx
 * <ConfirmModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Reject this deal?"
 *   description="The counterparty is notified."
 *   confirmLabel="Reject"
 *   requireReason
 *   onConfirm={(reason) => reject(deal.id, reason)}
 * />
 * ```
 *
 * @example Stepping up before an override
 * ```tsx
 * <ConfirmModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Override the credit limit?"
 *   description="This is recorded against your name."
 *   confirmLabel="Override"
 *   requirePassword
 *   onPasswordChange={setPassword}
 *   onConfirm={override}
 * />
 * ```
 */
export const ConfirmModal = ({ open, ...panelProps }: ConfirmModalProps) => {
  // The panel is mounted only while open, so a reason typed and abandoned is
  // gone the next time rather than arriving with a different action.
  if (!open) {
    return null;
  }

  return <ConfirmModalPanel {...panelProps} />;
};
