import {
  Controls,
  Heading as DocsHeading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  typographyFontFamilies,
  typographySizes,
  typographyWeights,
} from "../../Typography/Typography";
import { Heading, headingElements, type HeadingProps } from "../Heading";
import { HeadingGallery } from "./HeadingGallery/HeadingGallery";

const usage = `<Heading>Kanto Polymer KK</Heading>

{/* Level and size are chosen independently */}
<Heading as="h1" size="display-lg">Pacific Trade Desk</Heading>
<Heading as="h3" size="label-lg">Cost sheet</Heading>

{/* Inside a card */}
<Card>
  <Heading as="h3" size="display-sm">NPM-2601</Heading>
  <Typography as="p" size="body-sm">CIF Vancouver · USD 41,800</Typography>
</Card>`;

const story: Meta<HeadingProps> = {
  title: "Design Library/Typography/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Heading</Title>
          <DocsHeading>Gallery</DocsHeading>
          <HeadingGallery />
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

export const Example: StoryObj<HeadingProps> = {
  render: (args) => <Heading {...args} />,
};

Example.args = {
  children: "Kanto Polymer KK",
  as: "h2",
  size: "display-sm",
};

Example.argTypes = {
  as: {
    control: "select",
    options: headingElements,
    description:
      'Heading level. All six are supported. Defaults to "h2" — h1 is the page title and belongs to the page, so a shared component should not default to emitting one.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(headingElements) },
      defaultValue: { summary: "h2" },
    },
  },
  size: {
    control: "select",
    options: typographySizes,
    description:
      'Step on the type scale, independent of the level. A heading that must be h3 for the outline but should look small is as="h3" size="label-lg".',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(typographySizes) },
      defaultValue: { summary: "display-sm" },
    },
  },
  fontWeight: {
    control: "select",
    options: typographyWeights,
    description: "Font weight.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(typographyWeights),
      },
      defaultValue: { summary: "bold" },
    },
  },
  fontFamily: {
    control: "select",
    options: typographyFontFamilies,
    description: "Font family.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(typographyFontFamilies),
      },
      defaultValue: { summary: "sans" },
    },
  },
  children: {
    control: "text",
    description: "The heading text.",
  },
};

export default story;
