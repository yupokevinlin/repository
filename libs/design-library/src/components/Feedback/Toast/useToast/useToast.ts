import { useContext } from "react";

import type { ToastApi } from "../toastContext";
import { ToastContext } from "../toastContext";

/**
 * Raises toasts from wherever the work finished.
 *
 * Imperative, and the only component in the package with that shape (§10.3):
 * there is no `open` prop and no `value`, because a toast is not state the
 * caller holds — it is an announcement made once and forgotten.
 *
 * Throws without a `ToastProvider` above it. A `toast()` that quietly did
 * nothing would be found in production, when the failure it was reporting went
 * unreported too.
 *
 * @client
 *
 * @example Confirming a save
 * ```tsx
 * const { toast } = useToast();
 *
 * const save = async () => {
 *   await saveDeal(deal);
 *   toast({ title: "Deal saved", severity: "success" });
 * };
 * ```
 *
 * @example Reporting a failure, with a retry and no countdown
 * ```tsx
 * toast({
 *   title: "Could not save the deal",
 *   description: "The connection dropped.",
 *   severity: "error",
 *   duration: null,
 *   action: <Button size="8" onClick={save}>Retry</Button>,
 * });
 * ```
 *
 * @example Taking one away once it is moot
 * ```tsx
 * const id = toast({ title: "Uploading", duration: null });
 * await upload(file);
 * dismiss(id);
 * ```
 */
export const useToast = (): ToastApi => {
  const api: ToastApi | null = useContext(ToastContext);

  if (api === null) {
    throw new Error(
      "useToast was called outside a ToastProvider. Mount one near the root of the app.",
    );
  }

  return api;
};
