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
  Card,
  cardElevations,
  cardPaddings,
  type CardProps,
  cardSeverities,
} from "../Card";
import { CardGallery } from "./CardGallery/CardGallery";

const usage = `{/* A plain surface */}
<Card>
  <Heading as="h3" size="title-md">Kanto Polymer KK</Heading>
  <Typography as="p" size="body-sm">Osaka · credit CAD 250,000</Typography>
</Card>

{/* Selectable — a real button, never an anchor */}
<Card selectable onClick={() => select(deal.id)} elevation="raised">
  <Heading as="h3" size="title-sm">{deal.number}</Heading>
</Card>

{/* Accented, because the record is in trouble */}
<Card severity="error" padding="6">
  <Heading as="h3" size="title-md">AR overdue</Heading>
  <Typography as="p" size="body-sm">4 invoices past 30 days.</Typography>
</Card>`;

const story: Meta<CardProps> = {
  title: "Design Library/Surfaces/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Card</Title>
          <Heading>Gallery</Heading>
          <CardGallery />
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

export const Example: StoryObj<CardProps> = {
  render: (args: CardProps) => (
    <div className="w-[24rem]">
      <Card {...args} />
    </div>
  ),
};

Example.args = {
  children: "Kanto Polymer KK · Osaka · credit CAD 250,000",
  elevation: "flat",
  padding: "4",
};

Example.argTypes = {
  elevation: {
    control: "select",
    options: cardElevations,
    description: '"raised" lifts the card off the page ground.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(cardElevations) },
      defaultValue: { summary: "flat" },
    },
  },
  padding: {
    control: "select",
    options: cardPaddings,
    description: 'Inner padding. "4" = 1rem, "6" = 1.5rem.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(cardPaddings) },
      defaultValue: { summary: "4" },
    },
  },
  severity: {
    control: "select",
    options: cardSeverities,
    description:
      "Adds an accent edge naming a state. Omit for no accent — there is no neutral value.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(cardSeverities) },
    },
  },
  selectable: {
    control: "boolean",
    description:
      "Renders a real <button>. Required together with onClick at the type level: a card that looks pressable but does nothing, and one that responds to clicks without looking like it should, are both bugs. There is no href — to navigate, call router.push() in the handler.",
  },
  children: {
    control: "text",
    description: "The card's contents.",
  },
};

export default story;
