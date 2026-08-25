import {
  Controls,
  Heading,
  Primary,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  TextInput,
  type TextInputProps,
  textInputSizes,
  textInputVariants,
} from "../TextInput";
import { TextInputGallery } from "./TextInputGallery/TextInputGallery";

const story: Meta<TextInputProps> = {
  title: "Design Library/Inputs/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>TextInput</Title>
          <Heading>Gallery</Heading>
          <TextInputGallery />
          <Heading>Example</Heading>
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export const Example: StoryObj<TextInputProps> = {
  render: (args) => <TextInput {...args} />,
};
Example.args = {
  placeholder: "Placeholder",
  variant: "default",
  size: "10",
  disabled: false,
};

Example.argTypes = {
  variant: {
    control: "select",
    options: textInputVariants,
    description: "Semantic variant controlling border and focus-ring color.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(textInputVariants),
      },
      defaultValue: {
        summary: "default",
      },
    },
  },
  size: {
    control: "select",
    options: textInputSizes,
    description:
      'Height of the input as a Tailwind size unit (1 unit = 4px). "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(textInputSizes),
      },
      defaultValue: {
        summary: "10",
      },
    },
  },
  disabled: {
    control: "boolean",
    description: "Prevents interaction and applies disabled styles.",
  },
  placeholder: {
    control: "text",
    description: "Placeholder text shown when the input is empty.",
  },
  startIcon: {
    description:
      "Icon rendered to the left of the input. Sized automatically to match the input's size.",
  },
  endIcon: {
    description:
      "Icon rendered to the right of the input. Sized automatically to match the input's size.",
  },
  _storybookState: { table: { disable: true } },
};

export default story;
