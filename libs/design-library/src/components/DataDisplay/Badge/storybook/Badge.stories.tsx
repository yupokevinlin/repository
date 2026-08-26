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
  Badge,
  badgeAppearances,
  type BadgeProps,
  badgeSeverities,
  badgeSizes,
} from "../Badge";
import { BadgeGallery } from "./BadgeGallery/BadgeGallery";

const usage = `{/* A count */}
<Badge severity="error">3</Badge>
<Badge severity="info" max={99}>{147}</Badge>

{/* Record state — the dot reinforces what the text already says */}
<Badge severity="warning" dot>At port</Badge>
<Badge severity="success" dot>Booked</Badge>

{/* Where colour alone would carry the meaning, name it */}
<Badge severity="error" aria-label="3 approvals overdue">3</Badge>`;

const story: Meta<BadgeProps> = {
  title: "Design Library/DataDisplay/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Badge</Title>
          <Heading>Gallery</Heading>
          <BadgeGallery />
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

export const Example: StoryObj<BadgeProps> = {
  render: (args: BadgeProps) => <Badge {...args} />,
};

Example.args = {
  children: "At port",
  severity: "warning",
  appearance: "soft",
  size: "6",
  dot: true,
};

Example.argTypes = {
  severity: {
    control: "select",
    options: badgeSeverities,
    description:
      "Semantic state. Colour is never the only carrier of meaning — if the severity says something the visible text does not, supply an aria-label that does.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(badgeSeverities) },
      defaultValue: { summary: "neutral" },
    },
  },
  appearance: {
    control: "select",
    options: badgeAppearances,
    description:
      "Fill style. Orthogonal to severity — every combination is valid.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(badgeAppearances) },
      defaultValue: { summary: "soft" },
    },
  },
  size: {
    control: "select",
    options: badgeSizes,
    description:
      'Height as a Tailwind size unit (1 unit = 4px). "5" = 20px, "6" = 24px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(badgeSizes) },
      defaultValue: { summary: "6" },
    },
  },
  dot: {
    control: "boolean",
    description:
      "Renders a leading dot in the badge's own text colour, for record state where the dot reinforces the severity the text already names.",
  },
  max: {
    control: "number",
    description:
      "Clamps a numeric child. max={99} renders 99+ for anything above it. Ignored when the child is not a number.",
  },
  icon: {
    description: "Icon rendered before the label, after the dot.",
  },
  children: {
    control: "text",
    description: "The label. Omit it and aria-label becomes required.",
  },
};

export default story;
