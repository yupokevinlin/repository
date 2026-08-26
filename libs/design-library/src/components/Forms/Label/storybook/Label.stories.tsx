import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Label, labelDensities, type LabelProps } from "../Label";
import { LabelGallery } from "./LabelGallery/LabelGallery";

const usage = `{/* A filter-bar control */}
<Label htmlFor="status-filter">Status</Label>
<Select id="status-filter" options={statuses} />

{/* Required, with the marker explained */}
<Label htmlFor="deal-number" required requiredLabel="(required)">
  Deal number
</Label>

{/* Marking the optional one instead, in a form of mostly required fields */}
<Label htmlFor="notes" optionalText="Optional">Notes</Label>

{/* Inside a full field you do not need this at all — the control owns it */}
<TextInput label="Deal number" required />`;

const story: Meta<LabelProps> = {
  title: "Design Library/Forms/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Label</Title>
          <Heading>Gallery</Heading>
          <LabelGallery />
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

export const Example: StoryObj<LabelProps> = {
  render: (args: LabelProps) => (
    <div className="flex w-[20rem] flex-col gap-1">
      <Label {...args} />
      <input
        id={args.htmlFor}
        className="h-10 w-full rounded-md border border-border-default bg-bg-default px-3 text-body-sm text-fg-default"
        defaultValue="NPM-1042"
      />
    </div>
  ),
};

Example.args = {
  children: "Deal number",
  htmlFor: "example-deal",
  required: false,
  density: "comfortable",
};

Example.argTypes = {
  children: {
    control: "text",
    description: "The field's name.",
  },
  htmlFor: {
    control: "text",
    description:
      "The id of the control this labels. Required — a label with no for is a label for nothing, and clicking it does not focus the field.",
  },
  required: {
    control: "boolean",
    description:
      "Adds the required marker. The control sets aria-required itself.",
  },
  requiredLabel: {
    control: "text",
    description:
      "What the marker means, for a screen reader. The asterisk is decorative and announces as 'star'.",
    table: { defaultValue: { summary: "(required)" } },
  },
  optionalText: {
    control: "text",
    description:
      "Marks the field optional in words instead. Use one convention per form: mark what is required, or mark what is optional, never both.",
  },
  density: {
    control: "inline-radio",
    options: labelDensities,
    description:
      "Tightens the type step. Never changes the control's height — density and size are orthogonal (§4.2).",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(labelDensities) },
      defaultValue: { summary: "comfortable" },
    },
  },
};

export default story;
