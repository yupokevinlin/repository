import {
  Controls,
  Heading,
  Markdown,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  MoneyInput,
  moneyInputDensities,
  type MoneyInputProps,
  moneyInputSizes,
} from "../MoneyInput";
import { MoneyInputGallery } from "./MoneyInputGallery/MoneyInputGallery";

const notes = `This exists to enforce one invariant: **a currency never travels apart from its amount.** Two separate fields can be submitted with one filled and the other empty, or wired to two pieces of state that drift — and "40,000" with no currency on a confirmation is an incident, not a validation nicety.

So the value is a single object and both halves change together. It renders one field, not two: composing a NumberInput and a Select directly would emit two labels, two hints and two error lines for what the user sees as one control.`;

const usage = `{/* A unit price */}
<MoneyInput
  label="Unit price"
  currencies={currencyOptions}
  value={price}
  onValueChange={setPrice}
/>

{/* Never below zero, with a hint */}
<MoneyInput label="Freight" currencies={currencyOptions} min={0} />

{/* A quantity and its unit is QuantityInput, the same idea */}
<QuantityInput label="Quantity" units={unitOptions} />`;

const story: Meta<MoneyInputProps> = {
  title: "Design Library/Inputs/MoneyInput",
  component: MoneyInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>MoneyInput</Title>
          <Markdown>{notes}</Markdown>
          <Heading>Gallery</Heading>
          <MoneyInputGallery />
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

export const Example: StoryObj<MoneyInputProps> = {
  render: (args: MoneyInputProps) => (
    <div className="h-[18rem] w-[24rem]">
      <MoneyInput {...args} />
    </div>
  ),
};

Example.args = {
  label: "Unit price",
  currencies: [
    { value: "CAD", label: "CAD" },
    { value: "USD", label: "USD" },
    { value: "JPY", label: "JPY" },
  ],
  defaultValue: { amount: "1234.5", currency: "CAD" },
  locale: "en-CA",
  decimals: 2,
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  currencies: { control: false, description: "The currencies on offer." },
  value: {
    control: false,
    description:
      "One object: { amount, currency }. The amount is a string, as in NumberInput.",
  },
  decimals: {
    control: { type: "number", min: 0 },
    description: "Decimals shown at rest.",
    table: { defaultValue: { summary: "2" } },
  },
  min: { control: "number", description: "Clamped on blur." },
  max: { control: "number", description: "Clamped on blur." },
  currencyLabel: {
    control: "text",
    description: "Names the currency select, which has no visible label.",
    table: { defaultValue: { summary: "Currency" } },
  },
  hint: { control: "text", description: "Helper text." },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  size: {
    control: "inline-radio",
    options: moneyInputSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(moneyInputSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: moneyInputDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(moneyInputDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Disables both halves." },
};

export default story;
