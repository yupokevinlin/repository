import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { buttonVariants } from "../../../Buttons/Button/Button";
import { Toggle, type ToggleProps, toggleSizes } from "../Toggle";
import { ToggleGallery } from "./ToggleGallery/ToggleGallery";

const usage = `{/* A filter */}
<Toggle pressed={onlyMine} onPressedChange={setOnlyMine}>My deals</Toggle>

{/* Uncontrolled, with an icon */}
<Toggle defaultPressed startIcon={<BoldIcon />}>Bold</Toggle>

{/* A set where exactly one is pressed is ToggleGroup, not a row of these */}
<ToggleGroup type="single" aria-label="View" options={viewOptions} />`;

const story: Meta<ToggleProps> = {
  title: "Design Library/Inputs/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Toggle</Title>
          <Heading>Gallery</Heading>
          <ToggleGallery />
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

export const Example: StoryObj<ToggleProps> = {
  render: (args: ToggleProps) => <Toggle {...args} />,
};

Example.args = {
  children: "My deals",
  defaultPressed: false,
  size: "10",
  variant: "default-outline",
  disabled: false,
};

Example.argTypes = {
  children: { control: "text", description: "The label." },
  pressed: {
    control: "boolean",
    description: "Controlled state. Pair with onPressedChange.",
  },
  defaultPressed: {
    control: "boolean",
    description: "Initial state when uncontrolled.",
    table: { defaultValue: { summary: "false" } },
  },
  onPressedChange: { description: "Fires on every change, in both modes." },
  size: {
    control: "inline-radio",
    options: toggleSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(toggleSizes) },
      defaultValue: { summary: "10" },
    },
  },
  variant: {
    control: "select",
    options: buttonVariants,
    description:
      "The unpressed appearance. Shares Button's variant list exactly.",
    table: { defaultValue: { summary: "default-outline" } },
  },
  startIcon: { control: false, description: "Icon before the label." },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
