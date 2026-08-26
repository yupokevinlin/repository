import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Tag, tagAppearances, type TagProps, tagSizes } from "../Tag";
import { TagGallery } from "./TagGallery/TagGallery";

const usage = `{/* A plain label */}
<Tag>JP/CN lane</Tag>

{/* Removable, with a name that says what goes away */}
<Tag
  onRemove={() => dropFilter("chemicals")}
  removeLabel="Remove Chemicals filter"
>
  Chemicals
</Tag>

{/* A row of saved-view filters */}
{filters.map((filter) => (
  <Tag
    key={filter.id}
    size="5"
    appearance="outline"
    onRemove={() => dropFilter(filter.id)}
    removeLabel={\`Remove \${filter.label} filter\`}
  >
    {filter.label}
  </Tag>
))}`;

const story: Meta<TagProps> = {
  title: "Design Library/DataDisplay/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Tag</Title>
          <Heading>Gallery</Heading>
          <TagGallery />
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

export const Example: StoryObj<TagProps> = {
  render: (args: TagProps) => <Tag {...args} />,
};

Example.args = {
  children: "Chemicals",
  appearance: "soft",
  size: "6",
  disabled: false,
};

Example.argTypes = {
  appearance: {
    control: "select",
    options: tagAppearances,
    description:
      "Fill style. Tag has no severity on purpose — it labels user data, so colouring it would be decoration, and §15.2 reserves semantic colour for state.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(tagAppearances) },
      defaultValue: { summary: "soft" },
    },
  },
  size: {
    control: "select",
    options: tagSizes,
    description:
      'Height as a Tailwind size unit (1 unit = 4px). "5" = 20px, "6" = 24px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(tagSizes) },
      defaultValue: { summary: "6" },
    },
  },
  disabled: {
    control: "boolean",
    description: "Greys the tag out and disables removal.",
  },
  onRemove: {
    description:
      "Renders the remove button. Required together with removeLabel at the type level, so a remove button can never ship without an accessible name.",
  },
  removeLabel: {
    control: "text",
    description:
      'Accessible name for the remove button. Name what goes away — "Remove Chemicals filter", not "Remove".',
  },
  icon: {
    description: "Icon rendered before the label.",
  },
  children: {
    control: "text",
    description: "The label.",
  },
};

export default story;
