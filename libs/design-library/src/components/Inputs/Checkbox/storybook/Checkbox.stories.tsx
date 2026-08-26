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
  Checkbox,
  checkboxDensities,
  type CheckboxProps,
  checkboxSizes,
} from "../Checkbox";
import { CheckboxGallery } from "./CheckboxGallery/CheckboxGallery";

const usage = `{/* A single option */}
<Checkbox label="Include settled deals" checked={value} onChange={onChange} />

{/* A select-all, partly ticked */}
<Checkbox
  label="Select all"
  checked={all}
  indeterminate={some && !all}
  onChange={onToggleAll}
/>

{/* Required, with the reason underneath */}
<Checkbox label="I confirm the terms" required error="You must confirm." />

{/* A named set with an array value is CheckboxGroup, not a row of these */}
<CheckboxGroup legend="Attach" options={documentOptions} />`;

const story: Meta<CheckboxProps> = {
  title: "Design Library/Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Checkbox</Title>
          <Heading>Gallery</Heading>
          <CheckboxGallery />
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

export const Example: StoryObj<CheckboxProps> = {
  render: (args: CheckboxProps) => <Checkbox {...args} />,
};

Example.args = {
  label: "Include settled deals",
  size: "4",
  density: "comfortable",
  indeterminate: false,
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The option's name." },
  hint: { control: "text", description: "Helper text below the row." },
  error: {
    control: "text",
    description: "Its presence is what makes the control invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  indeterminate: {
    control: "boolean",
    description:
      "Neither checked nor unchecked — a parent whose children are partly selected. Sets the native indeterminate property and aria-checked='mixed'. Cannot be reached by the user, only set by code that knows about the children.",
  },
  size: {
    control: "inline-radio",
    options: checkboxSizes,
    description: 'The selection scale from §4. "4" = 16px, "5" = 20px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(checkboxSizes) },
      defaultValue: { summary: "4" },
    },
  },
  density: {
    control: "inline-radio",
    options: checkboxDensities,
    description: "Tightens the gap and the type step (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(checkboxDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
