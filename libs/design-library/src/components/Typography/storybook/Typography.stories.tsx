import {
  Controls,
  Heading as DocsHeading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  Typography,
  typographyElements,
  typographyFontFamilies,
  type TypographyProps,
  typographySizes,
  typographyWeights,
} from "../Typography";
import { TypographyGallery } from "./TypographyGallery/TypographyGallery";

const usage = `<Typography>CIF Vancouver</Typography>

<Typography as="p" size="body-lg">
  The safety data sheet lapses 02 Sep; arrival is 04 Sep.
</Typography>

<Typography size="code-sm" className="numeric">
  MSKU 447188-2
</Typography>`;

const story: Meta<TypographyProps> = {
  title: "Design Library/Typography/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Typography</Title>
          <DocsHeading>Gallery</DocsHeading>
          <TypographyGallery />
          <DocsHeading>Usage</DocsHeading>
          <Source code={usage} language="tsx" />
          <DocsHeading>Example</DocsHeading>
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export const Example: StoryObj<TypographyProps> = {
  render: (args) => <Typography {...args} />,
};

Example.args = {
  children: "CIF Vancouver",
  as: "span",
  size: "body-md",
};

Example.argTypes = {
  as: {
    control: "select",
    options: typographyElements,
    description:
      'Element to render. Closed union — never an arbitrary component. Use "p" for real prose so the document outline is right.',
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(typographyElements),
      },
      defaultValue: { summary: "span" },
    },
  },
  size: {
    control: "select",
    options: typographySizes,
    description:
      "Step on the type scale. Line height rides along with each step.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(typographySizes) },
      defaultValue: { summary: "body-md" },
    },
  },
  fontWeight: {
    control: "select",
    options: typographyWeights,
    description:
      'Defaults to "normal", or "medium" for label steps, which are UI text.',
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(typographyWeights),
      },
      defaultValue: { summary: "normal | medium" },
    },
  },
  fontFamily: {
    control: "select",
    options: typographyFontFamilies,
    description: 'Defaults to "sans", or "mono" for code steps.',
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(typographyFontFamilies),
      },
      defaultValue: { summary: "sans | mono" },
    },
  },
  children: {
    control: "text",
    description: "The text.",
  },
};

export default story;
