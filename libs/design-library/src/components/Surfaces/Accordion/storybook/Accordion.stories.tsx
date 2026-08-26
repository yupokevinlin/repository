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
  Accordion,
  accordionHeadingLevels,
  type AccordionProps,
} from "../Accordion";
import {
  AccordionGallery,
  gallerySections,
} from "./AccordionGallery/AccordionGallery";

const usage = `{/* One section at a time — the default */}
<Accordion
  headingLevel={3}
  sections={[
    { value: "terms", label: "Shipping terms", content: <Terms /> },
    { value: "items", label: "Line items", content: <LineItems /> },
  ]}
/>

{/* Several open, one of them on arrival */}
<Accordion headingLevel={2} allowMultiple defaultExpanded={["terms"]} sections={sections} />

{/* Controlled, so a deep link can open a section */}
<Accordion headingLevel={3} expanded={open} onExpandedChange={setOpen} sections={sections} />

{/* One section on its own is a Collapsible, not an accordion of one */}
<Collapsible label="Shipping terms">
  <Terms />
</Collapsible>`;

const story: Meta<AccordionProps> = {
  title: "Design Library/Surfaces/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Accordion</Title>
          <Heading>Gallery</Heading>
          <AccordionGallery />
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

export const Example: StoryObj<AccordionProps> = {
  render: (args: AccordionProps) => (
    <div className="w-[28rem]">
      <Accordion {...args} />
    </div>
  ),
};

Example.args = {
  headingLevel: 3,
  allowMultiple: false,
  defaultExpanded: ["terms"],
  sections: gallerySections,
};

Example.argTypes = {
  sections: {
    control: false,
    description: "The sections, in the order they appear.",
  },
  headingLevel: {
    control: "inline-radio",
    options: accordionHeadingLevels,
    description:
      "Required, with no default — the right level depends on what surrounds the accordion, which only the page knows. There is no `as` prop.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(accordionHeadingLevels),
      },
    },
  },
  allowMultiple: {
    control: "boolean",
    description:
      "Whether more than one may be open. Off by default — opening one closes the rest.",
    table: { defaultValue: { summary: "false" } },
  },
  defaultExpanded: {
    control: false,
    description: "Open on first render when uncontrolled.",
  },
  expanded: { control: false, description: "Controlled open sections." },
  onExpandedChange: { control: false },
};

export default story;
