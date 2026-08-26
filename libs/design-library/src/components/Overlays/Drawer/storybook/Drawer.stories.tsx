import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Button } from "../../../Buttons/Button";
import { Checkbox } from "../../../Inputs/Checkbox";
import { TextInput } from "../../../Inputs/TextInput";
import { Drawer, type DrawerProps, drawerSides, drawerSizes } from "../Drawer";
import { DrawerGallery } from "./DrawerGallery/DrawerGallery";

const usage = `{/* A filter panel over a table */}
<Drawer open={open} onOpenChange={setOpen} title="Filters">
  <FilterForm />
</Drawer>

{/* A detail pane the user reads while working the table behind — no scrim,
    no focus trap, no scroll lock */}
<Drawer open={open} onOpenChange={setOpen} title="NPM-1042" modal={false}>
  <DealSummary deal={deal} />
</Drawer>

{/* From the bottom, for a short sheet on a narrow screen */}
<Drawer open={open} onOpenChange={setOpen} title="Sort" side="bottom" size="sm">
  <SortOptions />
</Drawer>

{/* A centred box rather than a full-height sheet is a Modal */}
<Modal open={open} onOpenChange={setOpen} title="Amend deal">
  <DealForm />
</Modal>`;

const story: Meta<DrawerProps> = {
  title: "Design Library/Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Drawer</Title>
          <Heading>Gallery</Heading>
          <DrawerGallery />
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

const DrawerExample = ({
  open: _open,
  onOpenChange: _onOpenChange,
  ...args
}: DrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Filters"}
      </Button>
      <Drawer {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Example: StoryObj<DrawerProps> = {
  render: (args: DrawerProps) => <DrawerExample {...args} />,
};

Example.args = {
  title: "Filters",
  side: "right",
  size: "md",
  modal: true,
  dismissOnScrimClick: true,
  closeLabel: "Close",
  children: (
    <div className="flex flex-col gap-3">
      <TextInput label="Counterparty" placeholder="Any" />
      <Checkbox label="My deals only" />
      <Checkbox label="Unsettled" defaultChecked />
    </div>
  ),
  footer: (
    <>
      <Button variant="default-outline">{"Reset"}</Button>
      <Button>{"Apply"}</Button>
    </>
  ),
};

Example.argTypes = {
  open: {
    control: false,
    description: "Controlled — driven by the trigger here.",
  },
  onOpenChange: { control: false },
  title: {
    control: "text",
    description: "The heading, and the sheet's accessible name.",
  },
  children: {
    control: false,
    description: "The body. The only part that scrolls.",
  },
  footer: { control: false, description: "Actions, pinned to the bottom." },
  side: {
    control: "inline-radio",
    options: drawerSides,
    description: "Which edge it comes in from.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(drawerSides) },
      defaultValue: { summary: "right" },
    },
  },
  size: {
    control: "inline-radio",
    options: drawerSizes,
    description:
      "Width on the left and right edges, height on the top and bottom ones.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(drawerSizes) },
      defaultValue: { summary: "md" },
    },
  },
  modal: {
    control: "boolean",
    description:
      "Whether the page behind is blocked. A non-modal sheet has no scrim, does not trap focus and does not lock scrolling.",
    table: { defaultValue: { summary: "true" } },
  },
  dismissOnScrimClick: {
    control: "boolean",
    description: "Whether clicking the scrim closes it. Modal only.",
    table: { defaultValue: { summary: "true" } },
  },
  closeLabel: {
    control: "text",
    description: "The close button's accessible name.",
    table: { defaultValue: { summary: "Close" } },
  },
};

export default story;
