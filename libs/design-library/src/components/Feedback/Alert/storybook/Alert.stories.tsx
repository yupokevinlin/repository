import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Alert, type AlertProps, alertSeverities } from "../Alert";
import { AlertGallery } from "./AlertGallery/AlertGallery";

const usage = `{/* A warning bound to a shipment */}
<Alert severity="warning" title="SDS expires before ETA">
  The safety data sheet lapses 02 Sep; arrival is 04 Sep. The carrier will
  refuse the DG booking.
</Alert>

{/* Title only */}
<Alert severity="error" title="CIF is invalid for air freight" />

{/* With an action, and a hidden label because the copy alone is neutral */}
<Alert
  severity="error"
  severityLabel="Error:"
  title="Credit limit exceeded"
  actions={<Button size="8" variant="destructive-soft">Request override</Button>}
>
  CAD 300,000 against an insured cover of 250,000.
</Alert>`;

const story: Meta<AlertProps> = {
  title: "Design Library/Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Alert</Title>
          <Heading>Gallery</Heading>
          <AlertGallery />
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

export const Example: StoryObj<AlertProps> = {
  render: (args: AlertProps) => (
    <div className="w-[32rem]">
      <Alert {...args} />
    </div>
  ),
};

Example.args = {
  severity: "warning",
  title: "SDS expires before ETA",
  children:
    "The safety data sheet lapses 02 Sep; arrival is 04 Sep. The carrier will refuse the DG booking.",
};

Example.argTypes = {
  severity: {
    control: "select",
    options: alertSeverities,
    description:
      "neutral is not offered — an advisory with no severity is not an alert, it is text.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(alertSeverities) },
      defaultValue: { summary: "info" },
    },
  },
  title: {
    control: "text",
    description:
      "At least one of title and children is required — an empty alert is a bug.",
  },
  children: {
    control: "text",
    description: "The body copy.",
  },
  severityLabel: {
    control: "text",
    description:
      "Visually hidden prefix, for when the copy does not itself say what kind of message this is. §15.2 requires colour never be the only carrier of meaning — usually the copy handles it, so this is the escape hatch, not the default.",
  },
  icon: {
    description:
      "Rendered before the content at the severity's colour. Decorative.",
  },
  actions: {
    description: "Buttons or links, rendered to the right of the content.",
  },
};

export default story;
