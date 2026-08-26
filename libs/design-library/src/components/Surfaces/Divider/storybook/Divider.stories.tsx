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
  Divider,
  dividerEmphases,
  dividerOrientations,
  type DividerProps,
} from "../Divider";
import { DividerGallery } from "./DividerGallery/DividerGallery";

const usage = `{/* Between nav sections */}
<Divider />

{/* Labelled, to head a group */}
<Divider label="Logistics" />

{/* Between two inline figures */}
<div className="flex items-center gap-3">
  <Typography>Sell side</Typography>
  <Divider orientation="vertical" />
  <Typography>Buy side</Typography>
</div>

{/* Pure decoration — hidden from assistive technology */}
<Divider decorative />`;

const story: Meta<DividerProps> = {
  title: "Design Library/Surfaces/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Divider</Title>
          <Heading>Gallery</Heading>
          <DividerGallery />
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

export const Example: StoryObj<DividerProps> = {
  render: (args: DividerProps) => (
    <div className="w-[24rem]">
      <Divider {...args} />
    </div>
  ),
};

Example.args = {
  orientation: "horizontal",
  emphasis: "default",
  decorative: false,
};

Example.argTypes = {
  orientation: {
    control: "select",
    options: dividerOrientations,
    description:
      "A vertical divider needs a parent that gives it height, and ignores label.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(dividerOrientations),
      },
      defaultValue: { summary: "horizontal" },
    },
  },
  emphasis: {
    control: "select",
    options: dividerEmphases,
    description:
      "Prominence, mapped 1:1 onto the three global border tokens — border-muted, border-default, border-strong.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(dividerEmphases) },
      defaultValue: { summary: "default" },
    },
  },
  label: {
    control: "text",
    description:
      "Centred text with a rule either side. The labelled form has no separator role on purpose — separator does not support name-from-content, so it would announce the role and swallow the label.",
  },
  decorative: {
    control: "boolean",
    description:
      "Set when the layout already communicates the break. The rule is then hidden from assistive technology rather than announcing a separator that means nothing.",
    table: { defaultValue: { summary: "false" } },
  },
};

export default story;
