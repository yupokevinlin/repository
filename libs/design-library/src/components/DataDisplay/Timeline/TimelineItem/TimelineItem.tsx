import type { ReactNode } from "react";

import type { TimelineSeverity } from "../timelineStyles";

export interface TimelineItemProps {
  /** What happened, in one line. */
  title: ReactNode;
  /** When it happened. */
  eventAt: Date;
  /**
   * When the system was told. Shown alongside `eventAt` whenever the two are
   * more than a minute apart.
   *
   * In a trading system these come apart all the time — a vessel sails on
   * Tuesday and the agent files it on Thursday — and an entry that shows only
   * one of them is a entry somebody will read wrong. Both are rendered as
   * text, so both reach a screen reader too.
   */
  recordedAt?: Date;
  /** Anything more: a note, a document link, a `Badge`. */
  children?: ReactNode;
  /** Colours the marker. Defaults to `"neutral"` (§4.1). */
  severity?: TimelineSeverity;
}

/**
 * One entry in a `Timeline`.
 *
 * Declarative data only — **this component never renders** (§9.2). `Timeline`
 * reads these props and renders the list, the markers and the line between
 * them, because only it knows which entry is last and therefore where the line
 * stops.
 *
 * @server-safe
 */
export const TimelineItem = (_props: TimelineItemProps): null => null;
