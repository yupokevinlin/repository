import {
  Controls,
  Heading,
  Primary,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Button, type ButtonProps } from "../Button";
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
  variant: "default-solid",
  size: "10",
  disabled: false,
};

Example.argTypes = {
  variant: {
    control: "select",
    options: [
      "primary-solid",
      "primary-soft",
      "primary-outline",
      "secondary-solid",
      "secondary-soft",
      "secondary-outline",
      "tertiary-solid",
      "tertiary-soft",
      "tertiary-outline",
      "default-solid",
      "default-soft",
      "default-outline",
      "destructive-solid",
      "destructive-soft",
      "destructive-outline",
    ],
  },
  size: {
    control: "select",
    options: ["8", "10", "12"],
  },
  disabled: { control: "boolean" },
  children: { control: "text" },
};
export default story;
