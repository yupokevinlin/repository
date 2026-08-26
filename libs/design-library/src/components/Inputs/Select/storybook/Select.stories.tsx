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
  Select,
  selectDensities,
  type SelectProps,
  selectSizes,
} from "../Select";
import { SelectGallery } from "./SelectGallery/SelectGallery";

const usage = `{/* Choosing terms */}
<Select
  label="Payment terms"
  options={termOptions}
  value={terms}
  onValueChange={setTerms}
/>

{/* With a placeholder and a hint */}
<Select
  label="Incoterm"
  placeholder="Choose an incoterm"
  hint="Applies to this shipment only."
  options={incoterms}
  required
/>

{/* Long enough to need filtering? That is a Combobox */}
<Combobox label="Counterparty" options={counterparties} />

{/* A list of commands is a DropdownMenu — never role="menu" here */}
<DropdownMenu items={rowActions} />`;

const story: Meta<SelectProps> = {
  title: "Design Library/Inputs/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Select</Title>
          <Heading>Gallery</Heading>
          <SelectGallery />
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

export const Example: StoryObj<SelectProps> = {
  render: (args: SelectProps) => (
    <div className="h-[18rem] w-[24rem]">
      <Select {...args} />
    </div>
  ),
};

Example.args = {
  label: "Payment terms",
  placeholder: "Choose terms",
  options: [
    { value: "net30", label: "Net 30" },
    { value: "net60", label: "Net 60" },
    { value: "prepaid", label: "Prepaid" },
    { value: "cod", label: "Cash on delivery", disabled: true },
  ],
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  options: { control: false, description: "The options." },
  value: {
    control: "text",
    description: 'Controlled value. "" means nothing chosen.',
  },
  onValueChange: { description: "Fires with the chosen value." },
  placeholder: {
    control: "text",
    description:
      "Shown when nothing is chosen. Never a substitute for label — a placeholder disappears the moment a value is picked.",
  },
  hint: { control: "text", description: "Helper text." },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  size: {
    control: "inline-radio",
    options: selectSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(selectSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: selectDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(selectDensities) },
      defaultValue: { summary: "comfortable" },
    },
  },
  open: { control: "boolean", description: "Controlled open state." },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
