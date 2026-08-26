import {
  Controls,
  Heading,
  Markdown,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Calendar, type CalendarProps } from "../Calendar";
import { CalendarGallery } from "./CalendarGallery/CalendarGallery";

const notes = `A \`Date\` here means **a calendar date at local midnight**. Time components are ignored throughout: a B/L date and an ETA are calendar dates, and a timezone reaching one is a real bug rather than a rounding detail.

All the arithmetic lives in a pure \`calendarDates\` module with its own specs — leap years, month-end clamping, and the \`toISOString\` trap that turns local midnight into the previous day.

The grid is always six weeks tall so paging does not move the next-month button out from under the pointer, and it is a single Tab stop with arrow-key navigation.

**Week start:** \`Intl.Locale.getWeekInfo()\` is not supported everywhere, so the locale default falls back to Monday. That is wrong for en-CA and en-US, both of which start on Sunday — pass \`weekStartsOn\` explicitly where it matters.`;

const usage = `{/* Choosing a date */}
<Calendar value={date} onValueChange={setDate} />

{/* Bounded to the future */}
<Calendar value={eta} onValueChange={setEta} minDate={today()} />

{/* With an explicit week start, since the locale fallback is Monday */}
<Calendar locale="en-CA" weekStartsOn={0} />

{/* Inside a field, this is a DatePicker */}
<DatePicker label="ETA" value={eta} onValueChange={setEta} />`;

const story: Meta<CalendarProps> = {
  title: "Design Library/Overlays/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Calendar</Title>
          <Markdown>{notes}</Markdown>
          <Heading>Gallery</Heading>
          <CalendarGallery />
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

export const Example: StoryObj<CalendarProps> = {
  render: (args: CalendarProps) => <Calendar {...args} />,
};

Example.args = {
  defaultMonth: new Date(2026, 7, 1),
  defaultValue: new Date(2026, 7, 18),
  locale: "en-CA",
  weekStartsOn: 1,
};

Example.argTypes = {
  value: {
    control: false,
    description: "The chosen date at local midnight, or null.",
  },
  month: { control: false, description: "Which month is shown." },
  minDate: { control: false, description: "Nothing before this is choosable." },
  maxDate: { control: false, description: "Nothing after this is choosable." },
  locale: {
    control: "text",
    description: "BCP 47 tag for month and weekday names.",
  },
  weekStartsOn: {
    control: { type: "number", min: 0, max: 6 },
    description:
      "0 = Sunday … 6 = Saturday. Defaults to the locale's, falling back to Monday where Intl.Locale.getWeekInfo is unsupported.",
  },
  "aria-label": { control: "text", description: "Names the grid." },
  previousMonthLabel: {
    control: "text",
    table: { defaultValue: { summary: "Previous month" } },
  },
  nextMonthLabel: {
    control: "text",
    table: { defaultValue: { summary: "Next month" } },
  },
};

export default story;
