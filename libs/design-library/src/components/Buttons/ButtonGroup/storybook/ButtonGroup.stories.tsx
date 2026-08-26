import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Button } from "../../Button";
import { buttonSizes, buttonVariants } from "../../Button/Button";
import {
  ButtonGroup,
  buttonGroupOrientations,
  type ButtonGroupProps,
} from "../ButtonGroup";
import { ButtonGroupGallery } from "./ButtonGroupGallery/ButtonGroupGallery";

const usage = `{/* A pair */}
<ButtonGroup aria-label="Deal actions">
  <Button>Approve</Button>
  <Button>Reject</Button>
</ButtonGroup>

{/* Outlined, so the shared border shows */}
<ButtonGroup variant="default-outline" size="8" aria-label="View">
  <Button>Table</Button>
  <Button>Board</Button>
  <Button>Calendar</Button>
</ButtonGroup>

{/* A button and its overflow menu */}
<ButtonGroup>
  <Button>Save</Button>
  <IconButton icon={<ChevronDownIcon />} aria-label="More save options" />
</ButtonGroup>`;

const story: Meta<ButtonGroupProps> = {
  title: "Design Library/Buttons/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>ButtonGroup</Title>
          <Heading>Gallery</Heading>
          <ButtonGroupGallery />
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

export const Example: StoryObj<ButtonGroupProps> = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args}>
      {[
        <Button key="table">Table</Button>,
        <Button key="board">Board</Button>,
        <Button key="calendar">Calendar</Button>,
      ]}
    </ButtonGroup>
  ),
};

Example.args = {
  variant: "default-outline",
  size: "10",
  orientation: "horizontal",
  "aria-label": "View",
};

Example.argTypes = {
  children: {
    control: false,
    description:
      "Button or IconButton elements. They render themselves — this joins them up. A fragment wrapping them counts as one child, so pass them directly or as an array.",
  },
  orientation: {
    control: "inline-radio",
    options: buttonGroupOrientations,
    description:
      "Which way the buttons stack, and therefore which corners stay rounded.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(buttonGroupOrientations),
      },
      defaultValue: { summary: "horizontal" },
    },
  },
  variant: {
    control: "select",
    options: buttonVariants,
    description:
      "Applied to every button, overriding any variant they set themselves. Omit to leave each button alone — but a joined group of mixed fills rarely reads as one control.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(buttonVariants) },
    },
  },
  size: {
    control: "select",
    options: buttonSizes,
    description:
      "Applied to every button. Heights must match or the join breaks.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(buttonSizes) },
    },
  },
  "aria-label": {
    control: "text",
    description:
      "Names the set. This is role='group' and carries no selection state — a group where one option is chosen is ToggleGroup, not this.",
  },
};

export default story;
