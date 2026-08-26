import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../../Buttons/Button";
import { Tooltip, type TooltipProps } from "../Tooltip";
import { TooltipGallery } from "./TooltipGallery/TooltipGallery";

const usage = `{/* On an icon button */}
<Tooltip content="Delete line item">
  <IconButton icon={<TrashIcon />} aria-label="Delete line item" />
</Tooltip>

{/* Explaining an abbreviation */}
<Tooltip content="Free on board" placement="bottom">
  <Button variant="default-soft">FOB</Button>
</Tooltip>

{/* Opening at once, in a dense toolbar */}
<Tooltip content="Export" delay={0}>
  <IconButton icon={<DownloadIcon />} aria-label="Export" />
</Tooltip>

{/* Anything the user must be able to reach or click belongs in a Popover */}
<Popover content={<Button onClick={reset}>Reset filters</Button>}>
  <Button>Filters</Button>
</Popover>`;

const story: Meta<TooltipProps> = {
  title: "Design Library/Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Tooltip</Title>
          <Heading>Gallery</Heading>
          <TooltipGallery />
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

export const Example: StoryObj<TooltipProps> = {
  render: (args: TooltipProps) => (
    <div className="flex h-[8rem] items-center justify-center">
      <Tooltip {...args}>
        <Button variant="default-outline">{"FOB"}</Button>
      </Tooltip>
    </div>
  ),
};

Example.args = {
  content: "Free on board — the seller loads at the named port.",
  placement: "top",
  alignment: "center",
  delay: 300,
};

Example.argTypes = {
  children: {
    control: false,
    description:
      "The trigger. A single element that can hold a ref and take focus — a tooltip on something unfocusable is unreachable by keyboard.",
  },
  content: {
    control: "text",
    description:
      "The tip. Plain text: a tooltip is never interactive, so a link or button in here could not be reached.",
  },
  placement: {
    control: "inline-radio",
    options: ["top", "bottom", "left", "right"],
    description: "Preferred side. Flips when there is no room.",
    table: { defaultValue: { summary: "top" } },
  },
  alignment: {
    control: "inline-radio",
    options: ["start", "center", "end"],
    description: "Where along the cross axis.",
    table: { defaultValue: { summary: "center" } },
  },
  delay: {
    control: { type: "number", min: 0 },
    description:
      "How long the pointer must rest before it opens, in ms. Focus ignores this — a keyboard user has already committed.",
    table: { defaultValue: { summary: "300" } },
  },
  open: {
    control: "boolean",
    description: "Controlled open state, for tests and stories.",
  },
};

export default story;
