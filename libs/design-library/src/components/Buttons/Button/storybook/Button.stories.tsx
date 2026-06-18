import {
  Controls,
  Heading,
  Primary,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  Button,
  type ButtonProps,
  buttonSizes,
  buttonVariants,
} from "../Button";
import { ButtonGallery } from "./ButtonGallery/ButtonGallery";

const story: Meta<ButtonProps> = {
  title: "Design Library/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Button</Title>
          <Heading>Gallery</Heading>
          <ButtonGallery />
          <Heading>Example</Heading>
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export const Example: StoryObj<ButtonProps> = {
  render: (args) => <Button {...args} />,
};
Example.args = {
  children: "Button",
  variant: "primary-solid",
  size: "10",
  disabled: false,
};

Example.argTypes = {
  variant: {
    control: "select",
    options: buttonVariants,
    description:
      "Visual style combining a color role (primary, secondary, tertiary, default, destructive) and a fill style (solid, soft, outline).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(buttonVariants),
      },
      defaultValue: {
        summary: "primary-solid",
      },
    },
  },
  size: {
    control: "select",
    options: buttonSizes,
    description:
      'Height of the button as a Tailwind size unit (1 unit = 4px). "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(buttonSizes),
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
  children: {
    control: "text",
    description: "The button label.",
  },
  startIcon: {
    description:
      "Icon rendered to the left of the label. Sized automatically to match the button's size.",
  },
  endIcon: {
    description:
      "Icon rendered to the right of the label. Sized automatically to match the button's size.",
  },
  _storybookState: { table: { disable: true } },
};
export default story;
