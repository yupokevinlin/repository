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
  Stepper,
  stepperDensities,
  stepperOrientations,
  type StepperProps,
} from "../Stepper";
import { gallerySteps, StepperGallery } from "./StepperGallery/StepperGallery";

const usage = `{/* Across the top of a form */}
<Stepper orientation="horizontal" aria-label="New deal">
  <Step label="Counterparty" status="complete" />
  <Step label="Terms" status="current" />
  <Step label="Documents" status="upcoming" />
</Stepper>

{/* Down the side, with steps the user can go back to */}
<Stepper orientation="vertical" aria-label="Onboarding">
  <Step label="Company" status="revisited">
    <NextLink href="/app/onboarding/company">Company</NextLink>
  </Step>
  <Step label="Credit check" status="blocked" description="Waiting on finance" />
</Stepper>

{/* status is required on every step: blocked and revisited are facts about
    the work, not positions in a sequence, so there is nothing to derive them
    from. orientation is required too — both are first-class. */}`;

const story: Meta<StepperProps> = {
  title: "Design Library/Data Display/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Stepper</Title>
          <Heading>Gallery</Heading>
          <StepperGallery />
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

export const Example: StoryObj<StepperProps> = {
  render: ({ children: _children, ...args }: StepperProps) => (
    <div className="w-[30rem]">
      <Stepper {...args}>{gallerySteps}</Stepper>
    </div>
  ),
};

Example.args = {
  orientation: "horizontal",
  density: "comfortable",
  "aria-label": "New deal",
};

Example.argTypes = {
  children: { control: false, description: "Step elements, in order." },
  orientation: {
    control: "inline-radio",
    options: stepperOrientations,
    description:
      "Which way the steps run. Required, with no default — both are first-class, and a default would make one of them the norm the other deviates from.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(stepperOrientations),
      },
    },
  },
  density: {
    control: "inline-radio",
    options: stepperDensities,
    description: "The spacing between steps (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(stepperDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  "aria-label": {
    control: "text",
    description: "Names the list. Worth giving where a page has more than one.",
  },
  statusLabel: {
    control: false,
    description:
      'How each status is announced, appended to the step\'s name — "Terms, current step".',
  },
};

export default story;
