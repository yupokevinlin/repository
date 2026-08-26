import {
  Controls,
  Heading,
  Markdown,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { DateRangePicker, type DateRangePickerProps } from "../DateRangePicker";
import { DateRangePickerGallery } from "./DateRangePickerGallery/DateRangePickerGallery";

const notes = `The value is one object, not two props. A shipment window is one fact, and a range whose ends can be set independently is a range that can be left inconsistent.

Picking runs in two steps: the first click sets the start and clears the end, the second sets the end. Clicking a date **before** the current start begins again from there rather than producing a backwards range — which is what the user meant, and cheaper than an error message.`;

const usage = `{/* A shipment window */}
<DateRangePicker
  label="Shipment window"
  value={window}
  onValueChange={setWindow}
/>

{/* Bounded to the future */}
<DateRangePicker label="Laycan" minDate={today()} required />

{/* A single date is a DatePicker */}
<DatePicker label="ETA" />`;

const story: Meta<DateRangePickerProps> = {
  title: "Design Library/Inputs/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>DateRangePicker</Title>
          <Markdown>{notes}</Markdown>
          <Heading>Gallery</Heading>
          <DateRangePickerGallery />
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

export const Example: StoryObj<DateRangePickerProps> = {
  render: (args: DateRangePickerProps) => (
    <div className="h-[26rem] w-[22rem]">
      <DateRangePicker {...args} />
    </div>
  ),
};

Example.args = {
  label: "Shipment window",
  defaultValue: { from: new Date(2026, 7, 10), to: new Date(2026, 7, 24) },
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
    description:
      "Both ends at local midnight. null on either end means that end is not chosen yet.",
  },
  placeholder: {
    control: "text",
    table: { defaultValue: { summary: "Choose a range" } },
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
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
