import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Radio, radioDensities, type RadioProps, radioSizes } from "../Radio";
import { RadioGallery } from "./RadioGallery/RadioGallery";

const usage = `{/* One of a set, wired by name */}
<Radio name="incoterm" value="FOB" label="FOB" />
<Radio name="incoterm" value="CIF" label="CIF" />

{/* In a table row, with no visible label */}
<Radio name="primary-contact" value={contact.id} aria-label={contact.name} />

{/* A named set with arrow-key selection is RadioGroup, not a row of these */}
<RadioGroup legend="Incoterm" options={incoterms} />`;

const story: Meta<RadioProps> = {
  title: "Design Library/Inputs/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Radio</Title>
          <Heading>Gallery</Heading>
          <RadioGallery />
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

export const Example: StoryObj<RadioProps> = {
  render: (args: RadioProps) => <Radio {...args} />,
};

Example.args = {
  label: "FOB",
  name: "example-incoterm",
  value: "FOB",
  size: "4",
  density: "comfortable",
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The option's name." },
  name: {
    control: "text",
    description:
      "Radios sharing a name are mutually exclusive. Unlike a checkbox, one cannot be unticked by clicking it again.",
  },
  hint: { control: "text", description: "Helper text below the row." },
  error: {
    control: "text",
    description: "Its presence is what makes the control invalid.",
  },
  size: {
    control: "inline-radio",
    options: radioSizes,
    description: 'The selection scale from §4. "4" = 16px, "5" = 20px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(radioSizes) },
      defaultValue: { summary: "4" },
    },
  },
  density: {
    control: "inline-radio",
    options: radioDensities,
    description: "Tightens the gap and the type step (§4.2).",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(radioDensities) },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
