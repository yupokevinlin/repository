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
  NumberInput,
  numberInputDensities,
  type NumberInputProps,
  numberInputSizes,
} from "../NumberInput";
import { NumberInputGallery } from "./NumberInputGallery/NumberInputGallery";

const usage = `{/* A quantity — the value is a string, always */}
<NumberInput label="Quantity" value={qty} onValueChange={setQty} suffix="kg" />

{/* A price, always to two decimals, never below zero */}
<NumberInput label="Unit price" decimals={2} suffix="CAD" min={0} />

{/* Unformatted, for an integer reference */}
<NumberInput label="Container count" grouping={false} decimals={0} />`;

const story: Meta<NumberInputProps> = {
  title: "Design Library/Inputs/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>NumberInput</Title>
          <Heading>Gallery</Heading>
          <NumberInputGallery />
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

export const Example: StoryObj<NumberInputProps> = {
  render: (args: NumberInputProps) => (
    <div className="w-[24rem]">
      <NumberInput {...args} />
    </div>
  ),
};

Example.args = {
  label: "Quantity",
  defaultValue: "1234567.5",
  suffix: "kg",
  decimals: 2,
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  value: {
    control: "text",
    description:
      'The value, as a string. Always a string — a quantity mid-typing is "1," or "-" or "1.", none of which survive a round trip through Number.',
  },
  onValueChange: {
    description: "Fires with the raw, unformatted string on every keystroke.",
  },
  decimals: {
    control: { type: "number", min: 0 },
    description:
      "Fixed decimals on blur. Omit to keep whatever the user typed.",
  },
  grouping: {
    control: "boolean",
    description: "Turns off grouping separators.",
    table: { defaultValue: { summary: "true" } },
  },
  locale: {
    control: "text",
    description:
      "BCP 47 tag for grouping separators. Defaults to the browser's locale.",
  },
  min: {
    control: "number",
    description:
      "Clamped on blur, not while typing — clamping mid-keystroke fights the user.",
  },
  max: {
    control: "number",
    description: "Clamped on blur, not while typing.",
  },
  suffix: {
    control: "text",
    description: 'A unit or currency shown after the field — "kg", "CAD".',
  },
  hint: { control: "text", description: "Helper text." },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  size: {
    control: "inline-radio",
    options: numberInputSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(numberInputSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: numberInputDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(numberInputDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
