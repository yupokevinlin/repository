import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Button } from "../../../Buttons/Button";
import { Checkbox } from "../../../Inputs/Checkbox";
import { Popover, popoverPaddings, type PopoverProps } from "../Popover";
import { PopoverGallery } from "./PopoverGallery/PopoverGallery";

const usage = `{/* A filter panel */}
<Popover aria-label="Filters" content={<FilterForm />}>
  <Button>Filters</Button>
</Popover>

{/* Controlled, closing after an action */}
<Popover
  aria-label="Assign"
  open={open}
  onOpenChange={setOpen}
  content={<AssigneeList onPick={() => setOpen(false)} />}
>
  <Button>Assign</Button>
</Popover>

{/* A plain label with nothing to click is a Tooltip, not this */}
<Tooltip content="Free on board"><Button>FOB</Button></Tooltip>

{/* When the rest of the page must wait, it is a Modal */}
<Modal aria-label="Confirm" open={open} onOpenChange={setOpen}>...</Modal>`;

const story: Meta<PopoverProps> = {
  title: "Design Library/Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Popover</Title>
          <Heading>Gallery</Heading>
          <PopoverGallery />
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

export const Example: StoryObj<PopoverProps> = {
  render: (args: PopoverProps) => (
    <div className="flex h-[16rem] items-start">
      <Popover {...args} />
    </div>
  ),
};

Example.args = {
  "aria-label": "Filters",
  placement: "bottom",
  alignment: "start",
  padding: "4",
  children: <Button variant="default-outline">{"Filters"}</Button>,
  content: (
    <div className="flex w-[14rem] flex-col gap-2">
      <Checkbox label="My deals only" />
      <Checkbox label="Unsettled" defaultChecked />
      <Button size="8" variant="default-outline">
        {"Reset"}
      </Button>
    </div>
  ),
};

Example.argTypes = {
  children: { control: false, description: "The trigger." },
  content: {
    control: false,
    description:
      "What goes in the panel. Unlike a Tooltip, this may be interactive.",
  },
  "aria-label": {
    control: "text",
    description:
      "Names the panel. Required — a dialog with no name is announced as 'dialog' and nothing else.",
  },
  placement: {
    control: "inline-radio",
    options: ["top", "bottom", "left", "right"],
    description: "Preferred side. Flips when there is no room.",
    table: { defaultValue: { summary: "bottom" } },
  },
  alignment: {
    control: "inline-radio",
    options: ["start", "center", "end"],
    description: "Where along the cross axis.",
    table: { defaultValue: { summary: "start" } },
  },
  padding: {
    control: "inline-radio",
    options: popoverPaddings,
    description: 'Inner padding. "3" = 0.75rem, "4" = 1rem.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(popoverPaddings) },
      defaultValue: { summary: "4" },
    },
  },
  open: { control: "boolean", description: "Controlled open state." },
};

export default story;
