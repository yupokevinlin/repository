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
  QuantityInput,
  quantityInputDensities,
  type QuantityInputProps,
  quantityInputSizes,
} from "../QuantityInput";
import { QuantityInputGallery } from "./QuantityInputGallery/QuantityInputGallery";

const notes = `The same invariant as MoneyInput: **a unit never travels apart from its amount.** "40,000" is not a quantity, and a field that can be submitted with one half filled eventually will be.

When a \`conversionFactor\` is given it appears in the hint, because the factor is **frozen onto the deal at booking**. A deal booked at 1 MT = 1,000 kg still reads 1,000 kg years later; showing a live lookup instead would quietly rewrite history. Freezing it is the app's job — this component only displays what it is given.`;

const usage = `{/* A quantity in metric tonnes */}
<QuantityInput
  label="Quantity"
  units={unitOptions}
  value={quantity}
  onValueChange={setQuantity}
/>

{/* With the frozen factor shown */}
<QuantityInput
  label="Quantity"
  units={unitOptions}
  conversionFactor={{ factor: "1,000", toUnit: "kg" }}
/>

{/* An amount and a currency is MoneyInput, the same idea */}
<MoneyInput label="Unit price" currencies={currencyOptions} />`;

const story: Meta<QuantityInputProps> = {
  title: "Design Library/Inputs/QuantityInput",
  component: QuantityInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>QuantityInput</Title>
          <Markdown>{notes}</Markdown>
          <Heading>Gallery</Heading>
          <QuantityInputGallery />
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

export const Example: StoryObj<QuantityInputProps> = {
  render: (args: QuantityInputProps) => (
    <div className="h-[18rem] w-[24rem]">
      <QuantityInput {...args} />
    </div>
  ),
};

Example.args = {
  label: "Quantity",
  units: [
    { value: "MT", label: "MT" },
    { value: "kg", label: "kg" },
    { value: "lb", label: "lb" },
  ],
  defaultValue: { amount: "40", unit: "MT" },
  conversionFactor: { factor: "1,000", toUnit: "kg" },
  locale: "en-CA",
  decimals: 3,
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  units: { control: false, description: "The units on offer." },
  value: {
    control: false,
    description: "One object: { amount, unit }. The amount is a string.",
  },
  conversionFactor: {
    control: false,
    description:
      "The frozen conversion for the chosen unit, shown in the hint. Omit where the unit needs no conversion.",
  },
  decimals: {
    control: { type: "number", min: 0 },
    description: "Decimals shown at rest.",
    table: { defaultValue: { summary: "3" } },
  },
  min: { control: "number", description: "Clamped on blur." },
  max: { control: "number", description: "Clamped on blur." },
  unitLabel: {
    control: "text",
    description: "Names the unit select, which has no visible label.",
    table: { defaultValue: { summary: "Unit" } },
  },
  hint: {
    control: "text",
    description:
      "Helper text. The conversion factor joins it rather than replacing it.",
  },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  size: {
    control: "inline-radio",
    options: quantityInputSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(quantityInputSizes),
      },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: quantityInputDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(quantityInputDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Disables both halves." },
};

export default story;
