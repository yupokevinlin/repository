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
  Combobox,
  comboboxDensities,
  type ComboboxProps,
  comboboxSizes,
} from "../Combobox";
import { ComboboxGallery } from "./ComboboxGallery/ComboboxGallery";

const usage = `{/* Picking a counterparty from a long list */}
<Combobox
  label="Counterparty"
  options={counterparties}
  value={party}
  onValueChange={setParty}
/>

{/* Server-side search — the list already arrives filtered */}
<Combobox
  label="Counterparty"
  options={results}
  filter={(options) => options}
  onInputValueChange={search}
/>

{/* Under about a dozen options, Select is less work for the user */}
<Select label="Payment terms" options={termOptions} />`;

const story: Meta<ComboboxProps> = {
  title: "Design Library/Inputs/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Combobox</Title>
          <Heading>Gallery</Heading>
          <ComboboxGallery />
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

export const Example: StoryObj<ComboboxProps> = {
  render: (args: ComboboxProps) => (
    <div className="h-[20rem] w-[24rem]">
      <Combobox {...args} />
    </div>
  ),
};

Example.args = {
  label: "Counterparty",
  placeholder: "Search counterparties",
  options: [
    { value: "kanto", label: "Kanto Polymer KK" },
    { value: "maersk", label: "Maersk Line" },
    { value: "sinochem", label: "Sinochem International" },
    { value: "braskem", label: "Braskem SA" },
    { value: "lyondell", label: "LyondellBasell", disabled: true },
  ],
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  options: {
    control: false,
    description: "Every option. Filtering happens here unless filter is given.",
  },
  value: {
    control: "text",
    description: "Controlled chosen value, separate from the text typed.",
  },
  inputValue: {
    control: "text",
    description:
      "Controlled text in the input. Separate from value: the input holds what was typed, value holds what was committed.",
  },
  filter: {
    control: false,
    description:
      "Replaces the built-in matching. Returning the options unchanged is how a server-side search opts out.",
  },
  emptyText: {
    control: "text",
    description: "Shown when nothing matches.",
    table: { defaultValue: { summary: "No matches" } },
  },
  placeholder: {
    control: "text",
    description: "Shown while the input is empty.",
  },
  hint: { control: "text", description: "Helper text." },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  size: {
    control: "inline-radio",
    options: comboboxSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(comboboxSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: comboboxDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(comboboxDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
