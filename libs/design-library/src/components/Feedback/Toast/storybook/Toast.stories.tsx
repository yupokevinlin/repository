import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Button } from "../../../Buttons/Button";
import { Toast, type ToastProps, toastSeverities } from "../Toast";
import { ToastProvider } from "../ToastProvider/ToastProvider";
import { useToast } from "../useToast/useToast";
import { ToastGallery } from "./ToastGallery/ToastGallery";

const usage = `{/* Once, near the root */}
<ToastProvider>
  <App />
</ToastProvider>

{/* Then from wherever the work finished */}
const { toast } = useToast();

await saveDeal(deal);
toast({ title: "Deal saved", severity: "success" });

{/* A failure interrupts, carries a retry, and does not count down */}
toast({
  title: "Could not save the deal",
  description: "The connection dropped.",
  severity: "error",
  duration: null,
  action: <Button size="8" onClick={save}>Retry</Button>,
});

{/* Take one away once it is moot */}
const id = toast({ title: "Uploading", duration: null });
await upload(file);
dismiss(id);`;

const story: Meta<ToastProps> = {
  title: "Design Library/Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Toast</Title>
          <Heading>Gallery</Heading>
          <ToastGallery />
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

const Raiser = (args: ToastProps) => {
  const { toast, dismissAll } = useToast();
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          toast({
            title: args.title,
            description: args.description,
            severity: args.severity,
            duration: args.duration,
            action: args.action,
            dismissLabel: args.dismissLabel,
          });
        }}
      >
        {"Raise a toast"}
      </Button>
      <Button variant="default-outline" onClick={dismissAll}>
        {"Clear"}
      </Button>
    </div>
  );
};

/**
 * A toast is raised through the provider rather than placed, so the example
 * mounts one and calls `useToast` — which is how a real caller reaches it.
 */
export const Example: StoryObj<ToastProps> = {
  render: (args: ToastProps) => (
    <ToastProvider>
      <Raiser {...args} />
    </ToastProvider>
  ),
};

Example.args = {
  title: "Deal NPM-1042 saved",
  description: "The counterparty has been notified.",
  severity: "success",
  duration: 5000,
  dismissLabel: "Dismiss",
};

Example.argTypes = {
  title: {
    control: "text",
    description: 'One line, in the past tense — "Deal saved".',
  },
  description: { control: "text", description: "What else the user needs." },
  severity: {
    control: "inline-radio",
    options: toastSeverities,
    description:
      "The full §4.1 scale. neutral is a plain confirmation; error is the only one that interrupts.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(toastSeverities) },
      defaultValue: { summary: "neutral" },
    },
  },
  duration: {
    control: "number",
    description:
      "Milliseconds before it takes itself away. null keeps it until dismissed — use that whenever it carries an action.",
    table: { defaultValue: { summary: "5000" } },
  },
  action: { control: false, description: "An Undo, a Retry, a link." },
  icon: { control: false, description: "Coloured by the severity." },
  onDismiss: { control: false, description: "Supplied by the provider." },
  dismissLabel: {
    control: "text",
    table: { defaultValue: { summary: "Dismiss" } },
  },
};

export default story;
