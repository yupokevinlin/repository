import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  ProgressBar,
  type ProgressBarProps,
  progressBarSeverities,
  progressBarSizes,
} from "../ProgressBar";
import { ProgressBarGallery } from "./ProgressBarGallery/ProgressBarGallery";

const usage = `{/* A determinate bar */}
<ProgressBar label="Upload" value={68} valueLabel="68%" />

{/* A free-time clock that colours itself as it runs */}
<ProgressBar
  label="Demurrage free time"
  value={5}
  max={7}
  valueLabel="5 / 7 days"
  thresholds={{ warning: 0.6, error: 0.85 }}
/>

{/* Work under way, with no known duration */}
<ProgressBar label="Applying FX rates" indeterminate />`;

const story: Meta<ProgressBarProps> = {
  title: "Design Library/Feedback/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>ProgressBar</Title>
          <Heading>Gallery</Heading>
          <ProgressBarGallery />
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

export const Example: StoryObj<ProgressBarProps> = {
  render: (args: ProgressBarProps) => (
    <div className="w-[24rem]">
      <ProgressBar {...args} />
    </div>
  ),
};

Example.args = {
  label: "Demurrage free time",
  value: 5,
  max: 7,
  valueLabel: "5 / 7 days",
  size: "2",
  indeterminate: false,
};

Example.argTypes = {
  label: {
    control: "text",
    description:
      "Accessible name, and the visible label unless labelHidden. Required — a progress bar with no name tells a screen reader user nothing about what is progressing.",
  },
  value: {
    control: "number",
    description: "Clamped to 0…max. Ignored when indeterminate.",
  },
  max: {
    control: "number",
    description: "Defaults to 100.",
    table: { defaultValue: { summary: "100" } },
  },
  valueLabel: {
    control: "text",
    description:
      'Right-aligned text, and the value announced instead of a bare percentage. Supply the units — "2 / 7 days".',
  },
  severity: {
    control: "select",
    options: progressBarSeverities,
    description:
      "Mutually exclusive with thresholds: either name the colour or describe when it should change, never both.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(progressBarSeverities),
      },
      defaultValue: { summary: "info" },
    },
  },
  thresholds: {
    control: "object",
    description:
      "Fractions of value / max, not absolute values, so the same thresholds work for 7 days of free time and 21 days of an L/C window. Below warning is success.",
  },
  size: {
    control: "select",
    options: progressBarSizes,
    description: 'Bar thickness. "1" = 4px, "2" = 8px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(progressBarSizes) },
      defaultValue: { summary: "2" },
    },
  },
  labelHidden: {
    control: "boolean",
    description: "Hides the label visually. It stays the accessible name.",
  },
  indeterminate: {
    control: "boolean",
    description:
      "Drops aria-valuenow and slides a short fill across the track, which is what tells a screen reader the work is under way but unmeasured.",
  },
};

export default story;
