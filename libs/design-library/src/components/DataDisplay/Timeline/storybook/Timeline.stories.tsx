import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Timeline, timelineDensities, type TimelineProps } from "../Timeline";
import {
  galleryEntries,
  TimelineGallery,
} from "./TimelineGallery/TimelineGallery";

const usage = `{/* A deal's history */}
<Timeline>
  <TimelineItem title="Deal booked" eventAt={new Date(2026, 1, 2, 9, 14)} />
  <TimelineItem
    title="Vessel sailed"
    eventAt={new Date(2026, 1, 3, 6, 0)}
    recordedAt={new Date(2026, 1, 5, 11, 40)}
    severity="info"
  >
    MV Kanto Maru, Vancouver → Osaka
  </TimelineItem>
  <TimelineItem
    title="Documents rejected"
    eventAt={new Date(2026, 1, 6, 15, 22)}
    severity="error"
  >
    Bill of lading missing the consignee.
  </TimelineItem>
</Timeline>

{/* Tighter, for a side panel */}
<Timeline density="compact">{entries}</Timeline>

{/* recordedAt is shown whenever it differs from eventAt by over a minute,
    as text — so the difference reaches a screen reader too */}`;

const story: Meta<TimelineProps> = {
  title: "Design Library/Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Timeline</Title>
          <Heading>Gallery</Heading>
          <TimelineGallery />
          <Heading>Usage</Heading>
          <Source code={usage} language="tsx" />
          <Heading>Example</Heading>
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export const Example: StoryObj<TimelineProps> = {
  render: ({ children: _children, ...args }: TimelineProps) => (
    <div className="w-[26rem]">
      <Timeline {...args}>{galleryEntries}</Timeline>
    </div>
  ),
};

Example.args = {
  density: "comfortable",
  locale: "en-GB",
  recordedLabel: "recorded",
};

Example.argTypes = {
  children: {
    control: false,
    description: "TimelineItem elements, in the order they should be read.",
  },
  density: {
    control: "inline-radio",
    options: timelineDensities,
    description: "The spacing between entries (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(timelineDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  locale: {
    control: "text",
    description: "How the timestamps are formatted. Defaults to the browser's.",
  },
  recordedLabel: {
    control: "text",
    description: "Prefixes the recorded timestamp.",
    table: { defaultValue: { summary: "recorded" } },
  },
};

export default story;
