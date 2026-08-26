import type { ReactElement } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Timeline } from "../../Timeline";
import { TimelineItem } from "../../TimelineItem/TimelineItem";
import { timelineSeverities } from "../../timelineStyles";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

export const galleryEntries: Array<ReactElement> = [
  <TimelineItem
    key="booked"
    title="Deal booked"
    eventAt={new Date(2026, 1, 2, 9, 14)}
  >
    {"120 MT HDPE, CIF Osaka"}
  </TimelineItem>,
  <TimelineItem
    key="sailed"
    title="Vessel sailed"
    eventAt={new Date(2026, 1, 3, 6, 0)}
    recordedAt={new Date(2026, 1, 5, 11, 40)}
    severity="info"
  >
    {"MV Kanto Maru, Vancouver → Osaka"}
  </TimelineItem>,
  <TimelineItem
    key="cleared"
    title="Customs cleared"
    eventAt={new Date(2026, 1, 18, 8, 30)}
    severity="success"
  />,
  <TimelineItem
    key="rejected"
    title="Documents rejected"
    eventAt={new Date(2026, 1, 19, 15, 22)}
    severity="error"
  >
    {"Bill of lading missing the consignee."}
  </TimelineItem>,
];

export const TimelineGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="a deal's history">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"density"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"timeline"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"comfortable"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem] text-left">
              <Timeline locale="en-GB">{galleryEntries}</Timeline>
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"compact"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem] text-left">
              <Timeline density="compact" locale="en-GB">
                {galleryEntries}
              </Timeline>
            </div>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="severity">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"severity"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"entry"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {timelineSeverities.map((severity) => (
          <tr key={severity}>
            <StorybookGalleryTableCell className={labelCell}>
              {severity}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <div className="w-[22rem] text-left">
                <Timeline locale="en-GB">
                  <TimelineItem
                    title={`A ${severity} entry`}
                    eventAt={new Date(2026, 1, 2, 9, 14)}
                    severity={severity}
                  />
                </Timeline>
              </div>
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
