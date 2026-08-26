import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  differsInTime,
  timestampLabel,
  toDateTimeAttribute,
} from "./timelineDates";
import {
  TimelineItem,
  type TimelineItemProps,
} from "./TimelineItem/TimelineItem";
import {
  timelineDensities,
  type TimelineDensity,
  timelineSeverities,
  type TimelineSeverity,
  TimelineStyles,
} from "./timelineStyles";

export { timelineDensities, timelineSeverities };
export type { TimelineDensity, TimelineSeverity };

export interface TimelineProps {
  /** `TimelineItem` elements, in the order they should be read. */
  children: ReactNode;
  /** Defaults to `"comfortable"` (§4.2). */
  density?: TimelineDensity;
  /**
   * How the timestamps are formatted. Defaults to the browser's locale, as in
   * `Calendar`.
   */
  locale?: string;
  /**
   * Prefixes the recorded timestamp. Defaults to `"recorded"`, giving
   * "recorded 5 Feb 2026, 09:14".
   */
  recordedLabel?: string;
  className?: string;
}

/**
 * What happened to something, in order — a deal's history, a shipment's legs.
 *
 * An `<ol>`, because the order is the meaning and a screen reader should
 * announce how many entries there are and which one this is.
 *
 * **Both timestamps are text.** Where `recordedAt` differs from `eventAt` by
 * more than a minute, both are rendered as `<time>` elements, so the
 * difference between when something happened and when the system was told is
 * available to a screen-reader user and not only to someone reading the
 * column. In a trading system those two come apart constantly, and an entry
 * that shows one of them is an entry somebody will read wrong.
 *
 * @server-safe
 *
 * @example A deal's history
 * ```tsx
 * <Timeline>
 *   <TimelineItem title="Deal booked" eventAt={new Date(2026, 1, 2, 9, 14)} />
 *   <TimelineItem
 *     title="Vessel sailed"
 *     eventAt={new Date(2026, 1, 3, 6, 0)}
 *     recordedAt={new Date(2026, 1, 5, 11, 40)}
 *     severity="info"
 *   >
 *     MV Kanto Maru, Vancouver → Osaka
 *   </TimelineItem>
 *   <TimelineItem
 *     title="Documents rejected"
 *     eventAt={new Date(2026, 1, 6, 15, 22)}
 *     severity="error"
 *   >
 *     Bill of lading missing the consignee.
 *   </TimelineItem>
 * </Timeline>
 * ```
 *
 * @example Tighter, for a side panel
 * ```tsx
 * <Timeline density="compact">{entries}</Timeline>
 * ```
 */
export const Timeline = ({
  children,
  density,
  locale,
  recordedLabel,
  className,
}: TimelineProps) => {
  const items: Array<ReactElement<TimelineItemProps>> = Children.toArray(
    children,
  ).filter(
    (child): child is ReactElement<TimelineItemProps> =>
      isValidElement(child) && child.type === TimelineItem,
  );

  return (
    <ol
      data-slot="timeline"
      className={cn(TimelineStyles.listStyle(), className)}
    >
      {items.map(
        (item: ReactElement<TimelineItemProps>, index: number): ReactNode => {
          const isLast: boolean = index === items.length - 1;
          const severity: TimelineSeverity = item.props.severity ?? "neutral";
          const { eventAt, recordedAt } = item.props;
          const showsRecorded: boolean =
            recordedAt !== undefined && differsInTime(eventAt, recordedAt);

          return (
            <li
              key={index}
              data-slot="timeline-item"
              data-severity={severity}
              className={TimelineStyles.itemStyle()}
            >
              <div
                data-slot="timeline-rail"
                className={TimelineStyles.railStyle()}
              >
                <span
                  data-slot="timeline-marker"
                  aria-hidden="true"
                  className={TimelineStyles.markerStyle({ severity })}
                />
                {!isLast && (
                  <span
                    data-slot="timeline-connector"
                    aria-hidden="true"
                    className={TimelineStyles.connectorStyle()}
                  />
                )}
              </div>

              <div
                data-slot="timeline-content"
                className={TimelineStyles.contentStyle({
                  spacing: isLast ? "none" : (density ?? "comfortable"),
                })}
              >
                <span
                  data-slot="timeline-title"
                  className={TimelineStyles.titleStyle()}
                >
                  {item.props.title}
                </span>

                <span
                  data-slot="timeline-time"
                  className={TimelineStyles.timeStyle()}
                >
                  <time dateTime={toDateTimeAttribute(eventAt)}>
                    {timestampLabel(eventAt, locale)}
                  </time>
                  {showsRecorded && recordedAt !== undefined && (
                    <>
                      {" · "}
                      <span data-slot="timeline-recorded">
                        {`${recordedLabel ?? "recorded"} `}
                        <time dateTime={toDateTimeAttribute(recordedAt)}>
                          {timestampLabel(recordedAt, locale)}
                        </time>
                      </span>
                    </>
                  )}
                </span>

                {item.props.children !== undefined && (
                  <div
                    data-slot="timeline-body"
                    className={TimelineStyles.bodyStyle()}
                  >
                    {item.props.children}
                  </div>
                )}
              </div>
            </li>
          );
        },
      )}
    </ol>
  );
};
