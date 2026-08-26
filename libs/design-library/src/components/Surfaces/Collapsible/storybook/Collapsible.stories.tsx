import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Collapsible, type CollapsibleProps } from "../Collapsible";
import { CollapsibleGallery } from "./CollapsibleGallery/CollapsibleGallery";

const usage = `{/* Uncontrolled — the common case */}
<Collapsible label="Shipping terms">
  <Typography as="p">FOB Vancouver, 30 days.</Typography>
</Collapsible>

{/* Open on first render */}
<Collapsible label="Line items" defaultOpen>
  <LineItemTable items={deal.items} />
</Collapsible>

{/* Controlled — one section open at a time */}
const [openSection, setOpenSection] = useState<string>("terms");

<Collapsible
  label="Shipping terms"
  open={openSection === "terms"}
  onOpenChange={(open) => setOpenSection(open ? "terms" : "")}
>
  <Typography as="p">FOB Vancouver, 30 days.</Typography>
</Collapsible>

{/* Locked while the record is read-only */}
<Collapsible label="Shipping terms" disabled>
  <Typography as="p">FOB Vancouver, 30 days.</Typography>
</Collapsible>`;

const story: Meta<CollapsibleProps> = {
  title: "Design Library/Surfaces/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Collapsible</Title>
          <Heading>Gallery</Heading>
          <CollapsibleGallery />
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

export const Example: StoryObj<CollapsibleProps> = {
  render: (args: CollapsibleProps) => (
    <div className="w-[24rem]">
      <Collapsible {...args} />
    </div>
  ),
};

Example.args = {
  label: "Shipping terms",
  children: "FOB Vancouver · 30 days · CAD",
  defaultOpen: false,
  disabled: false,
};

Example.argTypes = {
  label: {
    control: "text",
    description:
      "The trigger's content, and therefore the disclosure's accessible name.",
  },
  children: {
    control: "text",
    description:
      "What is revealed. Stays mounted while closed, hidden with the hidden attribute, so state inside it survives a close and reopen.",
  },
  defaultOpen: {
    control: "boolean",
    description:
      "Initial state when uncontrolled. Ignored once open is passed.",
    table: { defaultValue: { summary: "false" } },
  },
  open: {
    control: "boolean",
    description:
      "Controlled state. Pass it with onOpenChange and the component stops managing itself.",
  },
  disabled: {
    control: "boolean",
    description:
      "Locks the disclosure at its current state and takes the trigger out of the tab order.",
  },
  onOpenChange: {
    description:
      "Fires on every open and close, in both controlled and uncontrolled mode.",
  },
};

export default story;
