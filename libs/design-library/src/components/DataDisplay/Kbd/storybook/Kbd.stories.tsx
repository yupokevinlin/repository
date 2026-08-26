import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Kbd, type KbdProps, kbdSizes } from "../Kbd";
import { KbdGallery } from "./KbdGallery/KbdGallery";

const usage = `{/* A chord */}
<Kbd keys={["Ctrl", "K"]} separator="+" />

{/* A single key */}
<Kbd keys={["Esc"]} />

{/* The app decides the platform once, not the component on every render */}
const modifier = isMac ? "⌘" : "Ctrl";
<Kbd keys={[modifier, "K"]} />

{/* Presentation only — tell assistive technology on the control itself */}
<Button aria-keyshortcuts="Control+K">
  Search
  <Kbd size="5" keys={["Ctrl", "K"]} />
</Button>`;

const story: Meta<KbdProps> = {
  title: "Design Library/DataDisplay/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Kbd</Title>
          <Heading>Gallery</Heading>
          <KbdGallery />
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

export const Example: StoryObj<KbdProps> = {
  render: (args: KbdProps) => <Kbd {...args} />,
};

Example.args = {
  keys: ["Ctrl", "K"],
  separator: "+",
  size: "6",
};

Example.argTypes = {
  keys: {
    control: "object",
    description:
      "The keys, in press order. Each renders as its own <kbd>. This component does not detect the platform — pass exactly what the user should press.",
  },
  size: {
    control: "select",
    options: kbdSizes,
    description:
      'Height as a Tailwind size unit (1 unit = 4px). "5" = 20px, "6" = 24px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(kbdSizes) },
      defaultValue: { summary: "6" },
    },
  },
  separator: {
    control: "text",
    description:
      'Rendered between keys and hidden from assistive technology, so the accessible name stays "Ctrl K" rather than "Ctrl plus K". Omit it and the keys are simply spaced apart.',
  },
};

export default story;
