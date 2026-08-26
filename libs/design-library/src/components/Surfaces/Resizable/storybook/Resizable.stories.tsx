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
  Resizable,
  resizableOrientations,
  type ResizableProps,
} from "../Resizable";
import {
  ResizableDemo,
  ResizableGallery,
} from "./ResizableGallery/ResizableGallery";

const usage = `{/* A list beside a detail pane */}
<Resizable handleLabel="the deal list">
  <ResizablePanel defaultSize={30} minSize={20} aria-label="Deals">
    <DealList />
  </ResizablePanel>
  <ResizablePanel aria-label="Deal">
    <DealDetail />
  </ResizablePanel>
</Resizable>

{/* A pane the user can shut away — Enter on the splitter toggles it */}
<Resizable>
  <ResizablePanel defaultSize={25} minSize={15} collapsible>
    <Filters />
  </ResizablePanel>
  <ResizablePanel><Results /></ResizablePanel>
</Resizable>

{/* Stacked, and driven from outside so the layout can be saved */}
<Resizable orientation="vertical" sizes={sizes} onSizesChange={persist}>
  <ResizablePanel><Chart /></ResizablePanel>
  <ResizablePanel><Table /></ResizablePanel>
</Resizable>

{/* The sizing logic is exported and pure */}
resize({ sizes: [50, 50], handle: 0, delta: 10, constraints: [] });
// [60, 40]`;

const story: Meta<ResizableProps> = {
  title: "Design Library/Surfaces/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Resizable</Title>
          <Heading>Gallery</Heading>
          <ResizableGallery />
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

export const Example: StoryObj<ResizableProps> = {
  render: (args: ResizableProps) => (
    <ResizableDemo orientation={args.orientation} />
  ),
};

Example.args = {
  orientation: "horizontal",
  step: 5,
  handleLabel: "the deal list",
};

Example.argTypes = {
  children: { control: false, description: "ResizablePanel elements." },
  orientation: {
    control: "inline-radio",
    options: resizableOrientations,
    description:
      "Which way the panes sit, and which arrows move the splitters between them.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(resizableOrientations),
      },
      defaultValue: { summary: "horizontal" },
    },
  },
  sizes: { control: false, description: "Panel sizes as percentages." },
  onSizesChange: { control: false },
  step: {
    control: "number",
    description: "How far an arrow key moves a splitter, in percentage points.",
    table: { defaultValue: { summary: "5" } },
  },
  handleLabel: {
    control: "text",
    description: 'Names each splitter — "Resize {label}".',
    table: { defaultValue: { summary: "panel" } },
  },
};

export default story;
