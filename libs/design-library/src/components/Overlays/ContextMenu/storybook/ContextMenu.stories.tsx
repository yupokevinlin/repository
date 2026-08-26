import {
  Controls,
  Heading,
  Markdown,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { MenuItem } from "../../Menu/MenuItem";
import { MenuSeparator } from "../../Menu/MenuSeparator";
import { ContextMenu, type ContextMenuProps } from "../ContextMenu";
import { ContextMenuGallery } from "./ContextMenuGallery/ContextMenuGallery";

const notes = `Right-click only. There is deliberately no long-press fallback for touch, so **a context menu must never be the only route to a command** — put the same commands in a DropdownMenu on the row or in a toolbar as well.

Taking over the browser's own context menu costs the user "open in new tab", "copy image" and their extensions. Only do it where the commands are genuinely more useful than the browser's.`;

const usage = `{/* Row commands */}
<ContextMenu
  aria-label="Deal actions"
  content={<MenuItem onClick={duplicate}>Duplicate</MenuItem>}
>
  <DealRow deal={deal} />
</ContextMenu>

{/* Always paired with a reachable equivalent */}
<DropdownMenu aria-label="Deal actions" content={commands}>
  <IconButton icon={<MoreIcon />} aria-label="Deal actions" />
</DropdownMenu>`;

const story: Meta<ContextMenuProps> = {
  title: "Design Library/Overlays/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>ContextMenu</Title>
          <Markdown>{notes}</Markdown>
          <Heading>Gallery</Heading>
          <ContextMenuGallery />
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

export const Example: StoryObj<ContextMenuProps> = {
  render: (args: ContextMenuProps) => (
    <div className="h-[16rem]">
      <ContextMenu {...args} />
    </div>
  ),
};

Example.args = {
  "aria-label": "Deal actions",
  children: (
    <div className="rounded-md border border-dashed border-border-strong bg-bg-default px-4 py-6 text-body-sm text-fg-muted">
      {"Right-click this row — NPM-1042"}
    </div>
  ),
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
  children: {
    control: false,
    description: "The region that responds to a right-click.",
  },
  content: {
    control: false,
    description: "The same MenuItem/MenuGroup/MenuSeparator children.",
  },
  "aria-label": { control: "text", description: "Names the menu." },
  open: { control: "boolean", description: "Controlled open state." },
};

export default story;
