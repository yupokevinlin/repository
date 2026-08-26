import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { Step, type StepProps } from "./Step/Step";
import {
  stepperDensities,
  type StepperDensity,
  type StepperOrientation,
  stepperOrientations,
  StepperStyles,
  type StepStatus,
  stepStatuses,
} from "./stepperStyles";

export { stepperDensities, stepperOrientations, stepStatuses };
export type { StepperDensity, StepperOrientation, StepStatus };

export interface StepperProps {
  /** `Step` elements, in order. */
  children: ReactNode;
  /**
   * Which way the steps run. **Required, with no default.**
   *
   * Both orientations are first-class here — a horizontal strip across the top
   * of a form and a vertical list down the side of one are equally common, and
   * neither is the fallback the other deviates from. Picking a default would
   * make one of them the norm by accident.
   */
  orientation: StepperOrientation;
  /** Defaults to `"comfortable"` (§4.2). */
  density?: StepperDensity;
  /** Names the list. Worth giving where a page has more than one. */
  "aria-label"?: string;
  /**
   * How each status is announced, appended to the step's name — "Terms,
   * completed". Defaults to plain English words.
   */
  statusLabel?: (status: StepStatus) => string;
  className?: string;
}

const defaultStatusLabel: Record<StepStatus, string> = {
  complete: "completed",
  current: "current step",
  upcoming: "not started",
  blocked: "blocked",
  revisited: "current step, already completed",
};

const tick = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-4"
  >
    <path d="M3.5 8.5l3 3 6-6" />
  </svg>
);

/**
 * Where the user is in a sequence — onboarding a counterparty, booking a deal.
 *
 * An `<ol>`, because the order is the point, with `aria-current="step"` on the
 * one they are on. Each step's status is also **written into its accessible
 * name** rather than carried only by the colour of a circle: "Credit check,
 * blocked" is the whole of what a screen-reader user needs, and the colour is
 * not available to them at all.
 *
 * Five states, and `status` is required on every step. `blocked` and
 * `revisited` are not positions in a sequence — a step can be blocked by a
 * credit check that has not come back, or be one the user has finished and
 * returned to — so there is nothing for a component counting steps to derive
 * them from. The app owns the state machine.
 *
 * `orientation` is required too, with no default: both are first-class, and a
 * default would make one of them the norm the other deviates from.
 *
 * @server-safe
 *
 * @example Across the top of a form
 * ```tsx
 * <Stepper orientation="horizontal" aria-label="New deal">
 *   <Step label="Counterparty" status="complete" />
 *   <Step label="Terms" status="current" />
 *   <Step label="Documents" status="upcoming" />
 * </Stepper>
 * ```
 *
 * @example Down the side, with steps the user can go back to
 * ```tsx
 * <Stepper orientation="vertical" aria-label="Onboarding">
 *   <Step label="Company" status="revisited">
 *     <NextLink href="/app/onboarding/company">Company</NextLink>
 *   </Step>
 *   <Step label="Credit check" status="blocked" description="Waiting on finance" />
 * </Stepper>
 * ```
 */
export const Stepper = ({
  children,
  orientation,
  density,
  "aria-label": ariaLabel,
  statusLabel,
  className,
}: StepperProps) => {
  const steps: Array<ReactElement<StepProps>> = Children.toArray(
    children,
  ).filter(
    (child): child is ReactElement<StepProps> =>
      isValidElement(child) && child.type === Step,
  );

  const nameFor = (status: StepStatus): string =>
    statusLabel?.(status) ?? defaultStatusLabel[status];

  return (
    <ol
      data-slot="stepper"
      aria-label={ariaLabel}
      className={cn(
        StepperStyles.listStyle({ orientation, density }),
        className,
      )}
    >
      {steps.map((step: ReactElement<StepProps>, index: number): ReactNode => {
        const { status } = step.props;
        const isLast: boolean = index === steps.length - 1;
        const isCurrent: boolean =
          status === "current" || status === "revisited";

        return (
          <li
            key={index}
            data-slot="stepper-item"
            data-status={status}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              StepperStyles.itemStyle({ orientation, density }),
              StepperStyles.linkStyle(),
            )}
          >
            <span
              data-slot="stepper-marker"
              aria-hidden="true"
              className={StepperStyles.markerStyle({ status })}
            >
              {status === "complete" ? tick : index + 1}
            </span>

            {!isLast && (
              <span
                data-slot="stepper-connector"
                aria-hidden="true"
                className={StepperStyles.connectorStyle({ orientation })}
              />
            )}

            <span
              data-slot="stepper-content"
              className={StepperStyles.contentStyle({ orientation })}
            >
              <span
                data-slot="stepper-label"
                className={StepperStyles.labelStyle({ status })}
              >
                {step.props.children ?? step.props.label}
              </span>
              {step.props.description !== undefined && (
                <span
                  data-slot="stepper-description"
                  className={StepperStyles.descriptionStyle()}
                >
                  {step.props.description}
                </span>
              )}
              {/* The status in words, next to the label rather than only in the
                  colour of the circle — which a screen reader cannot see and a
                  colour-blind user may not be able to tell apart. */}
              <span data-slot="stepper-status" className="sr-only">
                {nameFor(status)}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
};
