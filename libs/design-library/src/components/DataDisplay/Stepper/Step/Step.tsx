import type { ReactNode } from "react";

import type { StepStatus } from "../stepperStyles";

export interface StepProps {
  /** What the step is called. */
  label: ReactNode;
  /** A second line — what it needs, or who it is waiting on. */
  description?: ReactNode;
  /**
   * Where this step stands. **Required, with no default.**
   *
   * There is no deriving it from an index: `blocked` and `revisited` are not
   * positions in a sequence, they are facts about the work, and a component
   * counting steps cannot know either. The app owns the state machine; this
   * renders it.
   */
  status: StepStatus;
  /**
   * A link back to the step, where it is one the user may return to. Supplied
   * by the consumer (§11.1) — this package never imports a router.
   */
  children?: ReactNode;
}

/**
 * One step inside a `Stepper`.
 *
 * Declarative data only — **this component never renders** (§9.2). `Stepper`
 * reads these props and renders the list, the markers, their numbers and the
 * connectors, because only it knows the position of each step and which one is
 * last.
 *
 * @server-safe
 */
export const Step = (_props: StepProps): null => null;
