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
  DatePicker,
  datePickerDensities,
  type DatePickerProps,
  datePickerSizes,
} from "../DatePicker";
import { DatePickerGallery } from "./DatePickerGallery/DatePickerGallery";

const notes = `The trigger shows \`YYYY-MM-DD\`, which is unambiguous. A localised format would render 2026-09-08 as "08/09/2026" and 2026-08-09 as "09/08/2026" — the same string means two different dates on two sides of the Atlantic, and a trade confirmation is the wrong place to discover that.

The value is a calendar date at local midnight (§4.3), never a timestamp and never an ISO string inside this package.`;

const usage = `{/* An ETA */}
<DatePicker label="ETA" value={eta} onValueChange={setEta} />

{/* Bounded to the future */}
<DatePicker label="ETA" minDate={today()} required />

{/* A range needs DateRangePicker, not two of these */}
<DateRangePicker label="Shipment window" />`;

const story: Meta<DatePickerProps> = {
  title: "Design Library/Inputs/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>DatePicker</Title>
          <Markdown>{notes}</Markdown>
          <Heading>Gallery</Heading>
          <DatePickerGallery />
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

export const Example: StoryObj<DatePickerProps> = {
  render: (args: DatePickerProps) => (
    <div className="h-[24rem] w-[20rem]">
      <DatePicker {...args} />
    </div>
  ),
};

Example.args = {
  label: "ETA",
  defaultValue: new Date(2026, 7, 18),
  locale: "en-CA",
  size: "10",
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  value: {
    control: false,
    description: "The chosen date at local midnight, or null.",
  },
  placeholder: {
    control: "text",
    table: { defaultValue: { summary: "Choose a date" } },
  },
  minDate: { control: false, description: "Nothing before this is choosable." },
  maxDate: { control: false, description: "Nothing after this is choosable." },
  locale: { control: "text", description: "BCP 47 tag for the calendar." },
  hint: { control: "text", description: "Helper text." },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  size: {
    control: "inline-radio",
    options: datePickerSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(datePickerSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: datePickerDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(datePickerDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
