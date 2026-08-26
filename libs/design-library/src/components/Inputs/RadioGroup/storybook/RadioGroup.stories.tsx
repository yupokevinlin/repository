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
  RadioGroup,
  radioGroupDensities,
  radioGroupOrientations,
  type RadioGroupProps,
} from "../RadioGroup";
import { RadioGroupGallery } from "./RadioGroupGallery/RadioGroupGallery";

const usage = `{/* Choosing terms */}
<RadioGroup
  legend="Payment terms"
  options={termOptions}
  value={terms}
  onValueChange={setTerms}
/>

{/* In a row, tightened */}
<RadioGroup
  legend="Incoterm"
  options={incoterms}
  orientation="horizontal"
  density="compact"
/>

{/* Several answers at once is CheckboxGroup, not this */}
<CheckboxGroup legend="Attach" options={documentOptions} />`;

const story: Meta<RadioGroupProps> = {
  title: "Design Library/Inputs/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>RadioGroup</Title>
          <Heading>Gallery</Heading>
          <RadioGroupGallery />
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

export const Example: StoryObj<RadioGroupProps> = {
  render: (args: RadioGroupProps) => (
    <div className="w-[24rem]">
      <RadioGroup {...args} />
    </div>
  ),
};

Example.args = {
  legend: "Payment terms",
  options: [
    { value: "net30", label: "Net 30" },
    { value: "net60", label: "Net 60" },
    { value: "prepaid", label: "Prepaid" },
  ],
  defaultValue: "net30",
  orientation: "vertical",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  legend: {
    control: "text",
    description: "What the set is called, rendered as a <legend> (§5.1).",
  },
  options: { control: false, description: "The options." },
  value: { control: "text", description: "Controlled value." },
  onValueChange: {
    description: "Fires with the newly selected value.",
  },
  name: {
    control: "text",
    description:
      "Shared name, which is what makes the radios exclusive. One is generated when omitted.",
  },
  hint: { control: "text", description: "Helper text for the group." },
  error: { control: "text", description: "Error text for the group." },
  required: {
    control: "boolean",
    description: "Adds the marker to the legend.",
  },
  orientation: {
    control: "inline-radio",
    options: radioGroupOrientations,
    description: "Which way the options run.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(radioGroupOrientations),
      },
      defaultValue: { summary: "vertical" },
    },
  },
  density: {
    control: "inline-radio",
    options: radioGroupDensities,
    description: "Tightens the gaps (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(radioGroupDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Disables every option." },
};

export default story;
