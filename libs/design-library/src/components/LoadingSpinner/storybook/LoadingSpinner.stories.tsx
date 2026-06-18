import {
  Controls,
  Heading,
  Primary,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  LoadingSpinner,
  type LoadingSpinnerProps,
  loadingSpinnerVariants,
} from "../LoadingSpinner";
import { LoadingSpinnerGallery } from "./LoadingSpinnerGallery/LoadingSpinnerGallery";

const story: Meta<LoadingSpinnerProps> = {
  title: "Design Library/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>LoadingSpinner</Title>
          <Heading>Gallery</Heading>
          <LoadingSpinnerGallery />
          <Heading>Example</Heading>
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export const Example: StoryObj<LoadingSpinnerProps> = {
  render: (args) => <LoadingSpinner {...args} className="size-[2rem]" />,
};
Example.args = {
  variant: "primary",
};

Example.argTypes = {
  variant: {
    control: "select",
    options: loadingSpinnerVariants,
    description: "Color role for the spinner.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(loadingSpinnerVariants),
      },
      defaultValue: {
        summary: "default",
      },
    },
  },
  label: {
    control: "text",
    description:
      'Accessible label announced to screen readers. Defaults to "Loading".',
  },
};

export default story;
