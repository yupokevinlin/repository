import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../../Buttons/Button";
import { MenuItem } from "../../Menu/MenuItem";
import { MenuSeparator } from "../../Menu/MenuSeparator";
import { DropdownMenu, type DropdownMenuProps } from "../DropdownMenu";
import { DropdownMenuGallery } from "./DropdownMenuGallery/DropdownMenuGallery";

const usage = `{/* Row actions */}
<DropdownMenu
  aria-label="Deal actions"
  content={
    <>
      <MenuItem onClick={duplicate}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem severity="error" onClick={remove}>Delete deal</MenuItem>
    </>
  }
>
  <IconButton icon={<MoreIcon />} aria-label="Deal actions" />
</DropdownMenu>

{/* Grouped */}
<DropdownMenu aria-label="Export" content={
  <MenuGroup label="Download">
    <MenuItem>CSV</MenuItem>
    <MenuItem>PDF</MenuItem>
  </MenuGroup>
}>
  <Button>Export</Button>
</DropdownMenu>

{/* Choosing a value is a Select — a menu is for commands */}
<Select label="Payment terms" options={termOptions} />`;

const story: Meta<DropdownMenuProps> = {
  title: "Design Library/Overlays/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>DropdownMenu</Title>
          <Heading>Gallery</Heading>
          <DropdownMenuGallery />
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

export const Example: StoryObj<DropdownMenuProps> = {
  render: (args: DropdownMenuProps) => (
    <div className="flex h-[16rem] items-start">
      <DropdownMenu {...args} />
    </div>
  ),
};

Example.args = {
  "aria-label": "Deal actions",
  placement: "bottom",
  alignment: "start",
  children: <Button variant="default-outline">{"Deal actions"}</Button>,
  content: (
    <>
      <MenuItem>{"Duplicate"}</MenuItem>
      <MenuItem>{"Amend"}</MenuItem>
      <MenuSeparator />
      <MenuItem severity="error">{"Delete deal"}</MenuItem>
    </>
  ),
};

Example.argTypes = {
  children: { control: false, description: "The trigger." },
  content: {
    control: false,
    description: "MenuItem, MenuGroup and MenuSeparator children.",
  },
  "aria-label": {
    control: "text",
    description:
      "Names the menu. Required — a menu with no name is announced as 'menu' and nothing else.",
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
  open: { control: "boolean", description: "Controlled open state." },
};

export default story;
