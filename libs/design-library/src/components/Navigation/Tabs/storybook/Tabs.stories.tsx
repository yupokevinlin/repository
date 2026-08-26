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
import { Tab } from "../Tab/Tab";
import { TabPanel } from "../TabPanel/TabPanel";
import { Tabs, tabsOrientations, type TabsProps } from "../Tabs";
import { TabsGallery } from "./TabsGallery/TabsGallery";

const usage = `{/* The strip and its panel are siblings, wired by a shared id */}
<Tabs id="deal" value={tab} onValueChange={setTab} aria-label="Deal sections">
  <Tab value="terms" label="Terms" />
  <Tab value="items" label="Line items" count={4} />
  <Tab value="audit" label="Audit" disabled />
</Tabs>

<TabPanel id="deal" value={tab}>
  {content[tab]}
</TabPanel>

{/* Which is what lets the layout put them in different places */}
<aside>
  <Tabs id="deal" orientation="vertical" value={tab} onValueChange={setTab}>…</Tabs>
</aside>
<main>
  <TabPanel id="deal" value={tab}>{content[tab]}</TabPanel>
</main>

{/* Tab renders nothing — Tabs reads its props (§9.2) */}
<Tab value="items" label="Line items" count={4} />`;

const story: Meta<TabsProps> = {
  title: "Design Library/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Tabs</Title>
          <Heading>Gallery</Heading>
          <TabsGallery />
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

const TabsExample = ({
  value: _value,
  onValueChange: _onValueChange,
  children: _children,
  ...args
}: TabsProps) => {
  const [value, setValue] = useState<string>("terms");
  return (
    <div
      className={
        args.orientation === "vertical" ? "flex gap-4" : "flex flex-col gap-4"
      }
    >
      <Tabs {...args} value={value} onValueChange={setValue}>
        <Tab value="terms" label="Terms" />
        <Tab value="items" label="Line items" count={4} />
        <Tab value="audit" label="Audit" disabled />
        <Tab value="docs" label="Documents" />
      </Tabs>
      <TabPanel
        id={args.id}
        value={value}
        className="text-body-sm text-fg-default"
      >
        {`Panel placed by the layout, showing: ${value}.`}
      </TabPanel>
    </div>
  );
};

export const Example: StoryObj<TabsProps> = {
  render: (args: TabsProps) => <TabsExample {...args} />,
};

Example.args = {
  id: "deal",
  orientation: "horizontal",
  "aria-label": "Deal sections",
};

Example.argTypes = {
  id: {
    control: "text",
    description:
      "Ties the strip to its panels. Both sides derive their ids from it.",
  },
  value: { control: false, description: "Controlled only." },
  onValueChange: { control: false },
  children: {
    control: false,
    description: "Tab elements. They render nothing themselves.",
  },
  orientation: {
    control: "inline-radio",
    options: tabsOrientations,
    description: "Which way the strip runs, and which arrows move along it.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(tabsOrientations),
      },
      defaultValue: { summary: "horizontal" },
    },
  },
  "aria-label": {
    control: "text",
    description: "Names the strip. Required when the page has more than one.",
  },
};

export default story;
