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
  TextInput,
  textInputDensities,
  type TextInputProps,
  textInputSizes,
} from "../TextInput";
import { TextInputGallery } from "./TextInputGallery/TextInputGallery";

const usage = `{/* A labelled field — it renders its own <label> and wires it up */}
<TextInput label="Deal number" value={value} onChange={onChange} />

{/* With a hint, required */}
<TextInput
  label="Counterparty"
  hint="Legal entity name, as it appears on the contract."
  required
/>

{/* Invalid — the border and the message come from the same prop */}
<TextInput label="Deal number" error="That deal number is already in use." />

{/* In a table-cell editor, with no label of its own */}
<TextInput aria-label="Quantity" size="8" density="compact" />`;

const story: Meta<TextInputProps> = {
  title: "Design Library/Inputs/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>TextInput</Title>
          <Heading>Gallery</Heading>
          <TextInputGallery />
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

export const Example: StoryObj<TextInputProps> = {
  render: (args: TextInputProps) => (
    <div className="w-[24rem]">
      <TextInput {...args} />
    </div>
  ),
};

Example.args = {
  label: "Deal number",
  defaultValue: "NPM-1042",
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: {
    control: "text",
    description:
      "The field's name. It renders its own <label> and ties it to the input. Omit only when aria-label is supplied instead.",
  },
  hint: {
    control: "text",
    description: "Helper text, wired via aria-describedby.",
  },
  error: {
    control: "text",
    description:
      "The problem, in words. Its presence is what makes the field invalid — there is no separate variant prop to keep in sync.",
  },
  required: {
    control: "boolean",
    description: "Renders the marker and sets aria-required.",
  },
  size: {
    control: "inline-radio",
    options: textInputSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(textInputSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: textInputDensities,
    description:
      "Tightens label and helper spacing. Never changes the control's height — density and size are orthogonal (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(textInputDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  startIcon: {
    control: false,
    description: "Sized automatically to match size.",
  },
  endIcon: {
    control: false,
    description: "Sized automatically to match size.",
  },
  disabled: {
    control: "boolean",
    description: "Standard native disabled.",
  },
};

export default story;
