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
  CheckboxGroup,
  checkboxGroupDensities,
  checkboxGroupOrientations,
  type CheckboxGroupProps,
} from "../CheckboxGroup";
import { CheckboxGroupGallery } from "./CheckboxGroupGallery/CheckboxGroupGallery";

const usage = `{/* Which documents to attach */}
<CheckboxGroup
  legend="Attach"
  options={documentOptions}
  value={selected}
  onValueChange={setSelected}
/>

{/* Laid out in a row, in a filter bar */}
<CheckboxGroup
  legend="Status"
  options={statusOptions}
  orientation="horizontal"
  density="compact"
/>

{/* One tick box on its own is a Checkbox, not a group of one */}
<Checkbox label="Include settled deals" />`;

const story: Meta<CheckboxGroupProps> = {
  title: "Design Library/Inputs/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>CheckboxGroup</Title>
          <Heading>Gallery</Heading>
          <CheckboxGroupGallery />
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

export const Example: StoryObj<CheckboxGroupProps> = {
  render: (args: CheckboxGroupProps) => (
    <div className="w-[24rem]">
      <CheckboxGroup {...args} />
    </div>
  ),
};

Example.args = {
  legend: "Attach",
  options: [
    { value: "contract", label: "Contract" },
    { value: "invoice", label: "Invoice" },
    { value: "bol", label: "Bill of lading" },
  ],
  defaultValue: ["contract"],
  orientation: "vertical",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  legend: {
    control: "text",
    description:
      "What the set is called, rendered as a <legend>. A label cannot point at more than one input, so a group of them needs a fieldset (§5.1).",
  },
  options: { control: false, description: "The options." },
  value: {
    control: false,
    description: "Controlled value — the ticked values.",
  },
  onValueChange: {
    description:
      "Fires with the whole array, never with a single value. Callers reconciling a diff want the resulting state, not an event to apply by hand.",
  },
  hint: { control: "text", description: "Helper text for the group." },
  error: {
    control: "text",
    description:
      "Error text for the group. The group is invalid, not any one option.",
  },
  required: {
    control: "boolean",
    description: "Adds the marker to the legend.",
  },
  orientation: {
    control: "inline-radio",
    options: checkboxGroupOrientations,
    description: "Which way the options run.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(
          checkboxGroupOrientations,
        ),
      },
      defaultValue: { summary: "vertical" },
    },
  },
  density: {
    control: "inline-radio",
    options: checkboxGroupDensities,
    description: "Tightens the gaps (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(checkboxGroupDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Disables every option." },
};

export default story;
