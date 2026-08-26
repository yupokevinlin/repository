import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { buttonSizes, buttonVariants } from "../../Button/Button";
import { IconButton, type IconButtonProps } from "../IconButton";
import { IconButtonGallery } from "./IconButtonGallery/IconButtonGallery";

const usage = `{/* Close — aria-label is required at the type level */}
<IconButton icon={<XIcon />} aria-label="Close" onClick={close} />

{/* Destructive, small, in a table row */}
<IconButton
  icon={<TrashIcon />}
  aria-label="Delete line item"
  variant="destructive-soft"
  size="8"
  onClick={() => remove(item.id)}
/>

{/* While the request is in flight */}
<IconButton icon={<SaveIcon />} aria-label="Save" loading={isSaving} />`;

const closeIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

const story: Meta<IconButtonProps> = {
  title: "Design Library/Buttons/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>IconButton</Title>
          <Heading>Gallery</Heading>
          <IconButtonGallery />
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

export const Example: StoryObj<IconButtonProps> = {
  render: (args: IconButtonProps) => <IconButton {...args} />,
};

Example.args = {
  icon: closeIcon,
  "aria-label": "Close",
  variant: "default-soft",
  size: "10",
  loading: false,
  disabled: false,
};

Example.argTypes = {
  icon: {
    control: false,
    description: "The icon. Sized automatically to match the button's size.",
  },
  "aria-label": {
    control: "text",
    description:
      "What the button does, in words. Required at the type level — an icon on its own has no accessible name, and a silent button is not a mistake code review reliably catches.",
  },
  variant: {
    control: "select",
    options: buttonVariants,
    description: "Shares Button's variant list exactly.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(buttonVariants) },
      defaultValue: { summary: "default-soft" },
    },
  },
  size: {
    control: "select",
    options: buttonSizes,
    description: "Height, and therefore width — it is a square.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(buttonSizes) },
      defaultValue: { summary: "10" },
    },
  },
  loading: {
    control: "boolean",
    description:
      "Swaps the icon for a spinner, sets aria-busy, and blocks interaction. The square keeps its size.",
  },
  disabled: {
    control: "boolean",
    description: "Standard native disabled.",
  },
};

export default story;
