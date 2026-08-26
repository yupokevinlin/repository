import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { type AlertSeverity, AlertStyles } from "./AlertStyles";

export const alertSeverities = [
  "info",
  "success",
  "warning",
  "error",
] as const satisfies Array<AlertSeverity>;

export type { AlertSeverity };

type AlertBaseProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "title"
> & {
  /**
   * Defaults to `"info"`. `neutral` is not offered — an advisory with no
   * severity is not an alert, it is text.
   */
  severity?: AlertSeverity;
  /** Icon rendered before the content, at the severity's colour. Decorative. */
  icon?: ReactNode;
  /**
   * Rendered visually hidden before the title, for the case where the text
   * does not itself say what kind of message this is.
   *
   * §15.2 requires that colour never be the only carrier of meaning. Usually
   * the copy handles it — “SDS expires before ETA” is self-evidently a
   * problem — so this is the escape hatch, not the default.
   */
  severityLabel?: string;
  /** Buttons or links, rendered to the right of the content. */
  actions?: ReactNode;
};

/** At least one of `title` and `children` is required — an empty alert is a bug. */
export type AlertProps = AlertBaseProps &
  (
    | { title: ReactNode; children?: ReactNode }
    | { title?: ReactNode; children: ReactNode }
  );

/**
 * An inline advisory bound to a record — an SDS expiring before ETA, credit
 * over its limit, an Incoterm that cannot apply to the chosen mode.
 *
 * **Static, in-flow, and never dismissible.** The condition outlives the
 * message: dismissing “SDS expires before ETA” does not stop the SDS expiring.
 * Anything transient belongs in `Toast`, which floats and goes away by itself.
 *
 * **It carries no `role="alert"`, deliberately.** A live region is only correct
 * when a message *arrives* in response to something the user did. This one is
 * part of the page when the page renders, so announcing it would interrupt for
 * no reason — it is read in document order like any other text. `Toast` is the
 * component with the live region.
 *
 * @server-safe
 *
 * @example A warning bound to a shipment
 * ```tsx
 * <Alert severity="warning" title="SDS expires before ETA">
 *   The safety data sheet lapses 02 Sep; arrival is 04 Sep. The carrier will
 *   refuse the DG booking.
 * </Alert>
 * ```
 *
 * @example Title only
 * ```tsx
 * <Alert severity="error" title="CIF is invalid for air freight" />
 * ```
 *
 * @example With an action, and a hidden label because the copy alone is neutral
 * ```tsx
 * <Alert
 *   severity="error"
 *   severityLabel="Error:"
 *   title="Credit limit exceeded"
 *   actions={<Button size="8" variant="destructive-soft">Request override</Button>}
 * >
 *   CAD 300,000 against an insured cover of 250,000.
 * </Alert>
 * ```
 */
export const Alert = ({
  severity: severityProp,
  icon,
  severityLabel,
  actions,
  title,
  className: classNameProp,
  children,
  ...remainingProps
}: AlertProps) => {
  const severity: AlertSeverity = severityProp ?? "info";
  const className: string = classNameProp ?? "";

  return (
    <div
      data-slot="alert"
      data-severity={severity}
      className={cn(AlertStyles.alertStyle({ severity }), className)}
      {...remainingProps}
    >
      {icon !== undefined && (
        <span
          data-slot="alert-icon"
          aria-hidden="true"
          className={AlertStyles.iconStyle({ severity })}
        >
          {icon}
        </span>
      )}

      <div data-slot="alert-content" className={AlertStyles.contentStyle()}>
        {title !== undefined && (
          <p
            data-slot="alert-title"
            className={AlertStyles.titleStyle({ severity })}
          >
            {severityLabel !== undefined && (
              <span data-slot="alert-severity-label" className="sr-only">
                {`${severityLabel} `}
              </span>
            )}
            {title}
          </p>
        )}
        {children !== undefined && (
          <div data-slot="alert-body" className={AlertStyles.bodyStyle()}>
            {title === undefined && severityLabel !== undefined && (
              <span data-slot="alert-severity-label" className="sr-only">
                {`${severityLabel} `}
              </span>
            )}
            {children}
          </div>
        )}
      </div>

      {actions !== undefined && (
        <div data-slot="alert-actions" className={AlertStyles.actionsStyle()}>
          {actions}
        </div>
      )}
    </div>
  );
};
