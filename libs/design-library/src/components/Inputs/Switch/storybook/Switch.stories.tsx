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
  Switch,
  switchDensities,
  type SwitchProps,
  switchSizes,
} from "../Switch";
import { SwitchGallery } from "./SwitchGallery/SwitchGallery";

const usage = `{/* A setting that applies at once */}
<Switch label="Email me on settlement" checked={on} onCheckedChange={save} />

{/* Uncontrolled, with a hint */}
<Switch
  label="Auto-hedge"
  defaultChecked
  hint="Places the offsetting trade as soon as the deal is booked."
/>

{/* If the change needs a Save button, it is a Checkbox, not a Switch */}
<Checkbox label="Include settled deals" />`;

const story: Meta<SwitchProps> = {
  title: "Design Library/Inputs/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Switch</Title>
          <Heading>Gallery</Heading>
          <SwitchGallery />
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

export const Example: StoryObj<SwitchProps> = {
  render: (args: SwitchProps) => <Switch {...args} />,
};

Example.args = {
  label: "Auto-hedge",
  defaultChecked: false,
  size: "5",
  density: "comfortable",
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "What the setting is called." },
  checked: {
    control: "boolean",
    description: "Controlled state. Pair with onCheckedChange.",
  },
  defaultChecked: {
    control: "boolean",
    description: "Initial state when uncontrolled.",
    table: { defaultValue: { summary: "false" } },
  },
  onCheckedChange: {
    description: "Fires on every change, in both modes.",
  },
  hint: { control: "text", description: "Helper text below the row." },
  size: {
    control: "inline-radio",
    options: switchSizes,
    description: 'Track height. "5" = 20px, "6" = 24px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(switchSizes) },
      defaultValue: { summary: "5" },
    },
  },
  density: {
    control: "inline-radio",
    options: switchDensities,
    description: "Tightens the gap and the type step (§4.2).",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(switchDensities) },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
