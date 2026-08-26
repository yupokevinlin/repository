import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { Portal } from "../../../Overlays/Portal";
import { Toast } from "../Toast";
import type { ToastApi, ToastOptions, ToastRecord } from "../toastContext";
import { ToastContext } from "../toastContext";
import { type ToastPlacement, ToastStyles } from "../toastStyles";

export interface ToastProviderProps {
  children: ReactNode;
  /** Which corner they stack in. Defaults to `"bottom-right"`. */
  placement?: ToastPlacement;
  /**
   * How many are on screen at once. Defaults to 3. Older ones drop off as new
   * ones arrive — a stack tall enough to cover the page is worse than a
   * missed notification.
   */
  max?: number;
  /** Default `duration` for toasts that do not give one. Defaults to 5000. */
  duration?: number | null;
  /** Names the live-region landmark. Defaults to `"Notifications"`. */
  label?: string;
}

/**
 * Holds the toast queue and renders the region they appear in.
 *
 * **The only Context provider in this package** (§16). It exists because a
 * toast is raised from wherever the work finished — a save handler three
 * layers down, a mutation callback — and threading a callback from there up to
 * a viewport at the root is the kind of prop-drilling Context is actually for.
 * Everything else in this library takes props.
 *
 * Mount it once, near the root, above anything that might report on itself.
 *
 * @client
 *
 * @example At the root
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 *
 * @example Top-centre, two at a time
 * ```tsx
 * <ToastProvider placement="top-center" max={2}>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider = ({
  children,
  placement,
  max,
  duration,
  label,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Array<ToastRecord>>([]);

  // A counter rather than a random id: two toasts raised in the same tick must
  // not collide, and the value never leaves this component.
  const nextId = useRef<number>(0);

  const limit: number = max ?? 3;

  const dismiss = useCallback((id: string): void => {
    setToasts((current: Array<ToastRecord>) =>
      current.filter((entry: ToastRecord) => entry.id !== id),
    );
  }, []);

  const dismissAll = useCallback((): void => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (options: ToastOptions): string => {
      nextId.current += 1;
      const id = `toast-${String(nextId.current)}`;
      setToasts((current: Array<ToastRecord>) =>
        // Trimmed from the front: the oldest is the one the user has had the
        // longest to read.
        [...current, { ...options, id }].slice(-limit),
      );
      return id;
    },
    [limit],
  );

  // Stable, so a component that only raises toasts never re-renders because
  // one appeared somewhere else.
  const api: ToastApi = useMemo(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <div
          data-slot="toast-viewport"
          // A landmark, so a screen-reader user can navigate back to a toast
          // they heard announced instead of losing it.
          role="region"
          aria-label={label ?? "Notifications"}
          className={ToastStyles.viewportStyle({ placement })}
        >
          {toasts.map((entry: ToastRecord) => {
            const { id, ...toastProps } = entry;
            return (
              <Toast
                key={id}
                {...toastProps}
                // Deliberately a ternary and not `??`: null is a caller saying
                // "this one stays until dismissed", which must beat the
                // provider's default rather than fall through to it.
                duration={
                  toastProps.duration === undefined
                    ? duration
                    : toastProps.duration
                }
                onDismiss={() => {
                  dismiss(id);
                }}
              />
            );
          })}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};
