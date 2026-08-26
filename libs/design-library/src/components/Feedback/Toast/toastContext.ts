import { createContext } from "react";

import type { ToastProps } from "./Toast";

/**
 * What a caller passes to `toast()`. Everything `Toast` renders, minus the
 * parts the provider owns: the dismissal, and the identity.
 */
export type ToastOptions = Omit<ToastProps, "onDismiss" | "className">;

export interface ToastRecord extends ToastOptions {
  id: string;
}

export interface ToastApi {
  /** Shows a toast and returns its id, so it can be dismissed early. */
  toast: (options: ToastOptions) => string;
  /** Takes one away — after the retry it offered succeeded, say. */
  dismiss: (id: string) => void;
  /** Clears the lot. Useful on a route change. */
  dismissAll: () => void;
}

/**
 * `null` when there is no provider above, which `useToast` turns into an
 * error rather than a silently ignored call.
 */
export const ToastContext = createContext<ToastApi | null>(null);
