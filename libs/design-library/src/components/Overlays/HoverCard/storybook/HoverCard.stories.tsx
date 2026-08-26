import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "../../../Buttons/Link";
import { Typography } from "../../../Typography/Typography";
import { HoverCard, type HoverCardProps } from "../HoverCard";
import { HoverCardGallery } from "./HoverCardGallery/HoverCardGallery";

const usage = `{/* Previewing a counterparty */}
<HoverCard aria-label="Counterparty" content={<PartySummary id={party.id} />}>
  <Link href={\`/app/parties/\${party.id}\`}>{party.name}</Link>
</HoverCard>

{/* The trigger must be focusable, or the card is unreachable by keyboard */}
<HoverCard aria-label="Deal" content={<DealSummary />}>
  <Link href={\`/app/deals/\${deal.id}\`}>{deal.number}</Link>
</HoverCard>

{/* Anything clickable belongs in a Popover */}
<Popover aria-label="Assign" content={<AssigneeList />}>
  <Button>Assign</Button>
</Popover>`;

const story: Meta<HoverCardProps> = {
  title: "Design Library/Overlays/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>HoverCard</Title>
          <Heading>Gallery</Heading>
          <HoverCardGallery />
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

export const Example: StoryObj<HoverCardProps> = {
  render: (args: HoverCardProps) => (
    <div className="flex h-[14rem] items-start">
      <HoverCard {...args} />
    </div>
  ),
};

Example.args = {
  "aria-label": "Counterparty",
  placement: "bottom",
  openDelay: 400,
  closeDelay: 200,
  children: <Link href="/app/parties/1">{"Kanto Polymer KK"}</Link>,
  content: (
    <Typography as="p" size="body-sm">
      {"Osaka · credit CAD 250,000 · 14 open deals"}
    </Typography>
  ),
};

Example.argTypes = {
  children: {
    control: false,
    description:
      "The trigger. Must be focusable — a card on plain text cannot be opened by keyboard, and then it is a Popover you have mislabelled.",
  },
  content: {
    control: false,
    description:
      "The preview. May contain formatting, but nothing the user must click.",
  },
  "aria-label": { control: "text", description: "Names the card." },
  openDelay: {
    control: { type: "number", min: 0 },
    description:
      "How long the pointer must rest before it opens, in ms. Focus ignores it.",
    table: { defaultValue: { summary: "400" } },
  },
  closeDelay: {
    control: { type: "number", min: 0 },
    description:
      "How long after the pointer leaves before it closes. Long enough to cross the gap onto the card.",
    table: { defaultValue: { summary: "200" } },
  },
  placement: {
    control: "inline-radio",
    options: ["top", "bottom", "left", "right"],
    description: "Preferred side. Flips when there is no room.",
    table: { defaultValue: { summary: "bottom" } },
  },
  open: { control: "boolean", description: "Controlled open state." },
};

export default story;
