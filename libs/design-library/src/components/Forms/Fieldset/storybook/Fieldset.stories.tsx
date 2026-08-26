import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Label } from "../../Label";
import {
  Fieldset,
  fieldsetDensities,
  fieldsetOrientations,
  type FieldsetProps,
} from "../Fieldset";
import { FieldsetGallery } from "./FieldsetGallery/FieldsetGallery";

const usage = `{/* A group of controls */}
<Fieldset legend="Delivery terms">
  <TextInput label="Incoterm" />
  <TextInput label="Port" />
</Fieldset>

{/* Locked while the record is read-only — natively, no cloning or context */}
<Fieldset legend="Delivery terms" disabled={deal.settled}>
  <TextInput label="Incoterm" />
</Fieldset>

{/* A filter bar, laid out in a row and tightened */}
<Fieldset legend="Filters" orientation="horizontal" density="compact">
  <Select label="Status" options={statuses} />
  <Select label="Desk" options={desks} />
</Fieldset>

{/* RadioGroup and CheckboxGroup render this internally — do not wrap them */}
<RadioGroup label="Incoterm" options={incoterms} />`;

const story: Meta<FieldsetProps> = {
  title: "Design Library/Forms/Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Fieldset</Title>
          <Heading>Gallery</Heading>
          <FieldsetGallery />
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

export const Example: StoryObj<FieldsetProps> = {
  render: (args: FieldsetProps) => (
    <div className="w-[24rem]">
      <Fieldset {...args}>
        <div className="flex min-w-0 flex-col gap-1">
          <Label htmlFor="example-incoterm">{"Incoterm"}</Label>
          <input
            id="example-incoterm"
            defaultValue="FOB"
            className="h-10 w-full rounded-md border border-border-default bg-bg-default px-3 text-body-sm text-fg-default disabled:border-border-disabled disabled:bg-bg-disabled disabled:text-fg-disabled"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <Label htmlFor="example-port">{"Port"}</Label>
          <input
            id="example-port"
            defaultValue="Vancouver"
            className="h-10 w-full rounded-md border border-border-default bg-bg-default px-3 text-body-sm text-fg-default disabled:border-border-disabled disabled:bg-bg-disabled disabled:text-fg-disabled"
          />
        </div>
      </Fieldset>
    </div>
  ),
};

Example.args = {
  legend: "Delivery terms",
  disabled: false,
  required: false,
  orientation: "vertical",
  density: "comfortable",
};

Example.argTypes = {
  legend: {
    control: "text",
    description:
      "What the group is called. Required — a fieldset with no legend names nothing, and a screen reader announces the controls inside with no idea what they have in common.",
  },
  children: {
    control: false,
    description: "The controls.",
  },
  disabled: {
    control: "boolean",
    description:
      "Disables every control inside, natively. This is the one place a group really can turn off its children — no cloning, no context.",
  },
  required: {
    control: "boolean",
    description: "Adds the required marker to the legend.",
  },
  requiredLabel: {
    control: "text",
    description: "What the marker means, in words.",
    table: { defaultValue: { summary: "(required)" } },
  },
  orientation: {
    control: "inline-radio",
    options: fieldsetOrientations,
    description: "Which way the controls run.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(fieldsetOrientations),
      },
      defaultValue: { summary: "vertical" },
    },
  },
  density: {
    control: "inline-radio",
    options: fieldsetDensities,
    description: "Tightens the gaps. Never changes a control's height (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(fieldsetDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
};

export default story;
