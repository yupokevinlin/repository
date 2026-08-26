import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Skeleton, type SkeletonProps, skeletonVariants } from "../Skeleton";
import { SkeletonGallery } from "./SkeletonGallery/SkeletonGallery";

const usage = `{/* A line of text */}
<Skeleton />

{/* A paragraph, with the region marked busy — this is the announcement */}
<div aria-busy={isLoading}>
  {isLoading ? <Skeleton lines={3} /> : <Typography as="p">{copy}</Typography>}
</div>

{/* An avatar beside two lines, mirroring the row it replaces */}
<div className="flex items-center gap-3" aria-busy>
  <Skeleton variant="circle" width="2rem" height="2rem" />
  <Skeleton lines={2} />
</div>`;

const story: Meta<SkeletonProps> = {
  title: "Design Library/Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Skeleton</Title>
          <Heading>Gallery</Heading>
          <SkeletonGallery />
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

export const Example: StoryObj<SkeletonProps> = {
  render: (args: SkeletonProps) => (
    <div className="w-[24rem]">
      <Skeleton {...args} />
    </div>
  ),
};

Example.args = {
  variant: "text",
  lines: 3,
  animated: true,
};

Example.argTypes = {
  variant: {
    control: "select",
    options: skeletonVariants,
    description:
      'Shape of the thing being waited for. "text" is a bar one line tall that tracks the surrounding type scale.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(skeletonVariants) },
      defaultValue: { summary: "text" },
    },
  },
  lines: {
    control: { type: "number", min: 1, max: 8 },
    description:
      'Stacked bars, for variant="text" only. The last is rendered short, the way a real paragraph ends.',
    table: { defaultValue: { summary: "1" } },
  },
  width: {
    control: "text",
    description:
      "Any CSS length, applied inline. A skeleton mirrors whatever it stands in for, so its dimensions cannot come from a fixed scale — this is the one component where §4 does not apply.",
  },
  height: {
    control: "text",
    description: "Any CSS length, applied inline. See width.",
  },
  animated: {
    control: "boolean",
    description:
      "Always disabled under prefers-reduced-motion, regardless of this value.",
    table: { defaultValue: { summary: "true" } },
  },
};

export default story;
