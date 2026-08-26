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
  TextArea,
  textAreaDensities,
  type TextAreaProps,
  textAreaResizes,
} from "../TextArea";
import { TextAreaGallery } from "./TextAreaGallery/TextAreaGallery";

const usage = `{/* Notes on a deal */}
<TextArea label="Notes" value={notes} onChange={onChange} />

{/* Growing with its content, never scrolling */}
<TextArea label="Rejection reason" autoResize required />

{/* Fixed size, in a dense table editor */}
<TextArea aria-label="Notes" resize="none" rows={2} density="compact" />`;

const story: Meta<TextAreaProps> = {
  title: "Design Library/Inputs/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>TextArea</Title>
          <Heading>Gallery</Heading>
          <TextAreaGallery />
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

export const Example: StoryObj<TextAreaProps> = {
  render: (args: TextAreaProps) => (
    <div className="w-[24rem]">
      <TextArea {...args} />
    </div>
  ),
};

Example.args = {
  label: "Notes",
  defaultValue: "Vessel delayed at Kaohsiung; revised ETA 2026-09-04.",
  resize: "vertical",
  autoResize: false,
  rows: 3,
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  hint: {
    control: "text",
    description: "Helper text, wired via aria-describedby.",
  },
  error: {
    control: "text",
    description:
      "The problem, in words. Its presence is what makes the field invalid.",
  },
  required: {
    control: "boolean",
    description: "Renders the marker and sets aria-required.",
  },
  resize: {
    control: "inline-radio",
    options: textAreaResizes,
    description:
      'Which axes the user may drag. Defaults to "vertical" — horizontal dragging breaks the surrounding layout more often than it helps.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(textAreaResizes) },
      defaultValue: { summary: "vertical" },
    },
  },
  autoResize: {
    control: "boolean",
    description:
      'Grows with its content instead of scrolling. Forces the vertical axis off, since a box that resizes itself and can also be dragged fights the user: "both" becomes "horizontal" and "vertical" becomes "none".',
  },
  rows: {
    control: { type: "number", min: 1 },
    description: "Visible rows before it scrolls or grows.",
    table: { defaultValue: { summary: "3" } },
  },
  density: {
    control: "inline-radio",
    options: textAreaDensities,
    description: "Tightens padding and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(textAreaDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
