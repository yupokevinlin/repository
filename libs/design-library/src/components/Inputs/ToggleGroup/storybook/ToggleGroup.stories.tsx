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
  ToggleGroup,
  toggleGroupOrientations,
  type ToggleGroupProps,
} from "../ToggleGroup";
import { ToggleGroupGallery } from "./ToggleGroupGallery/ToggleGroupGallery";

const usage = `{/* A view switch — one at a time, so role="radiogroup" */}
<ToggleGroup
  type="single"
  aria-label="View"
  options={viewOptions}
  value={view}
  onValueChange={setView}
/>

{/* Filters — any number at once, so role="toolbar" */}
<ToggleGroup
  type="multiple"
  aria-label="Filters"
  options={filterOptions}
  value={active}
  onValueChange={setActive}
/>

{/* A lone sticky button is a Toggle, not a group of one */}
<Toggle pressed={onlyMine} onPressedChange={setOnlyMine}>My deals</Toggle>`;

const story: Meta<ToggleGroupProps> = {
  title: "Design Library/Inputs/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>ToggleGroup</Title>
          <Heading>Gallery</Heading>
          <ToggleGroupGallery />
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

export const Example: StoryObj<ToggleGroupProps> = {
  render: (args: ToggleGroupProps) => <ToggleGroup {...args} />,
};

Example.args = {
  type: "single",
  "aria-label": "View",
  options: [
    { value: "table", label: "Table" },
    { value: "board", label: "Board" },
    { value: "calendar", label: "Calendar" },
  ],
  defaultValue: "table",
  size: "10",
  orientation: "horizontal",
  disabled: false,
};

Example.argTypes = {
  type: {
    control: "inline-radio",
    options: ["single", "multiple"],
    description:
      'The role follows the type, and the two are genuinely different controls. "single" is role="radiogroup" — one choice within a set, each option reporting aria-checked. "multiple" is role="toolbar" — independent buttons reporting aria-pressed.',
  },
  "aria-label": {
    control: "text",
    description:
      "Names the set. Required — a toolbar with no name is a row of mystery buttons.",
  },
  options: { control: false, description: "The options." },
  value: { control: false, description: "Controlled value." },
  onValueChange: {
    description:
      "A string for single, an array for multiple — matching the type.",
  },
  orientation: {
    control: "inline-radio",
    options: toggleGroupOrientations,
    description: "Which way the options run. Also sets aria-orientation.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(toggleGroupOrientations),
      },
      defaultValue: { summary: "horizontal" },
    },
  },
  size: {
    control: "inline-radio",
    options: ["8", "10", "12"],
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: { defaultValue: { summary: "10" } },
  },
  disabled: { control: "boolean", description: "Disables every option." },
};

export default story;
