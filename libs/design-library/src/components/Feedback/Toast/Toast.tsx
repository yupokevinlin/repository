import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { IconButton } from "../../Buttons/IconButton";
import {
  toastSeverities,
  type ToastSeverity,
  ToastStyles,
} from "./toastStyles";

export { toastSeverities };
export type { ToastSeverity };

export interface ToastProps {
  /** One line, in the past tense — "Deal saved", not "Saving deal". */
  title: ReactNode;
  /** What else the user needs, if anything. */
  description?: ReactNode;
  /** Defaults to `"neutral"` — a plain confirmation. */
  severity?: ToastSeverity;
  /** Sized to the row, coloured by the severity. */
  icon?: ReactNode;
  /** An Undo, a Retry, a link to what was just created. */
  action?: ReactNode;
  /**
   * How long before it takes itself away, in milliseconds. Defaults to 5000.
   * `null` keeps it until the user dismisses it — use that whenever the toast
   * carries an action, because a countdown on an Undo is a countdown the user
   * has to win.
   */
  duration?: number | null;
  /** Runs when the timer runs out or the user dismisses it. */
  onDismiss?: () => void;
  /** The dismiss button's name. Defaults to `"Dismiss"`. */
  dismissLabel?: string;
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
 * One notification. Rendered by `ToastProvider`, not placed by hand.
 *
 * Announced through a live region rather than by moving focus: a toast appears
 * because something finished, not because the user asked for it, and stealing
 * focus for it would throw a typist out of whatever they were doing. `error`
 * is `role="alert"` and assertive — it interrupts; everything else is
 * `role="status"` and polite, and waits its turn.
 *
 * The timer pauses while the pointer is over it or focus is inside it, so a
 * toast cannot vanish out from under someone reading it or tabbing to its
 * action. Unpausing restarts the full duration rather than resuming the
 * remainder — the user has just looked away, so they get the whole window
 * back.
 *
 * @client
 *
 * @example Through the provider, which is how it is meant to be used
 * ```tsx
 * const { toast } = useToast();
 * toast({ title: "Deal saved", severity: "success" });
 * ```
 */
export const Toast = ({
  title,
  description,
  severity,
  icon,
  action,
  duration,
  onDismiss,
  dismissLabel,
  className,
}: ToastProps) => {
  const [paused, setPaused] = useState<boolean>(false);

  const resolvedDuration: number | null =
    duration === undefined ? 5000 : duration;

  useEffect(() => {
    if (paused || resolvedDuration === null || onDismiss === undefined) {
      return;
    }
    const timer = setTimeout(onDismiss, resolvedDuration);
    return () => {
      clearTimeout(timer);
    };
  }, [paused, resolvedDuration, onDismiss]);

  const isError: boolean = severity === "error";

  return (
    <div
      data-slot="toast"
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cn(ToastStyles.toastStyle({ severity }), className)}
      onPointerEnter={() => {
        setPaused(true);
      }}
      onPointerLeave={() => {
        setPaused(false);
      }}
      onFocusCapture={() => {
        setPaused(true);
      }}
      onBlurCapture={() => {
        setPaused(false);
      }}
    >
      {icon !== undefined && (
        <span
          data-slot="toast-icon"
          aria-hidden="true"
          className={ToastStyles.iconStyle({ severity })}
        >
          {icon}
        </span>
      )}
      <div className={ToastStyles.contentStyle()}>
        <span
          data-slot="toast-title"
          className={ToastStyles.titleStyle({ severity })}
        >
          {title}
        </span>
        {description !== undefined && (
          <span
            data-slot="toast-description"
            className={ToastStyles.descriptionStyle()}
          >
            {description}
          </span>
        )}
        {action !== undefined && (
          <div data-slot="toast-action" className={ToastStyles.actionStyle()}>
            {action}
          </div>
        )}
      </div>
      {onDismiss !== undefined && (
        <IconButton
          icon={closeIcon}
          aria-label={dismissLabel ?? "Dismiss"}
          size="8"
          variant="default-soft"
          onClick={onDismiss}
        />
      )}
    </div>
  );
};
