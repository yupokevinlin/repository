import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Button } from "../../../Buttons/Button";
import {
  ConfirmModal,
  type ConfirmModalProps,
  confirmSeverities,
} from "../ConfirmModal";
import { ConfirmModalGallery } from "./ConfirmModalGallery/ConfirmModalGallery";

const usage = `{/* Deleting */}
<ConfirmModal
  open={open}
  onOpenChange={setOpen}
  severity="error"
  title="Delete this deal?"
  description="NPM-1042 and its four line items will be removed."
  confirmLabel="Delete deal"
  onConfirm={remove}
/>

{/* Requiring a recorded reason */}
<ConfirmModal
  open={open}
  onOpenChange={setOpen}
  title="Reject this deal?"
  description="The counterparty is notified."
  confirmLabel="Reject"
  requireReason
  onConfirm={(reason) => reject(deal.id, reason)}
/>

{/* Stepping up before an override — the app verifies the password, not this */}
<ConfirmModal
  open={open}
  onOpenChange={setOpen}
  title="Override the credit limit?"
  description="This is recorded against your name."
  confirmLabel="Override"
  requirePassword
  onPasswordChange={setPassword}
  onConfirm={override}
/>

{/* Anything the user is not being asked to agree to is a Modal */}
<Modal open={open} onOpenChange={setOpen} title="Amend deal">
  <DealForm />
</Modal>`;

const story: Meta<ConfirmModalProps> = {
  title: "Design Library/Overlays/ConfirmModal",
  component: ConfirmModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>ConfirmModal</Title>
          <Heading>Gallery</Heading>
          <ConfirmModalGallery />
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

const ConfirmModalExample = ({
  open: _open,
  onOpenChange: _onOpenChange,
  ...args
}: ConfirmModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        variant="destructive-solid"
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Delete deal"}
      </Button>
      <ConfirmModal {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Example: StoryObj<ConfirmModalProps> = {
  render: (args: ConfirmModalProps) => <ConfirmModalExample {...args} />,
};

Example.args = {
  title: "Delete deal NPM-1042?",
  description:
    "The deal and its four line items will be removed. This cannot be undone.",
  confirmLabel: "Delete deal",
  cancelLabel: "Cancel",
  severity: "error",
  requireReason: false,
  requirePassword: false,
  busy: false,
  onConfirm: () => undefined,
};

Example.argTypes = {
  open: {
    control: false,
    description: "Controlled — driven by the trigger here.",
  },
  onOpenChange: { control: false },
  onConfirm: { control: false },
  onPasswordChange: { control: false },
  title: {
    control: "text",
    description: "What is about to happen, as a question.",
  },
  description: {
    control: "text",
    description: "The consequence, in plain words.",
  },
  confirmLabel: {
    control: "text",
    description:
      'The confirm button\'s label. Say the verb — "Delete", not "OK".',
  },
  cancelLabel: {
    control: "text",
    table: { defaultValue: { summary: "Cancel" } },
  },
  severity: {
    control: "inline-radio",
    options: confirmSeverities,
    description:
      "Hard to undo (warning) or destructive (error). There is no informational confirmation — that is a Modal.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(confirmSeverities),
      },
      defaultValue: { summary: "warning" },
    },
  },
  requireReason: {
    control: "boolean",
    description:
      "Blocks confirmation until the user types something. The reason is handed to onConfirm.",
  },
  reasonLabel: {
    control: "text",
    table: { defaultValue: { summary: "Reason" } },
  },
  requirePassword: {
    control: "boolean",
    description:
      "Step-up re-authentication. Collects the password and blocks the button; verifying it is the app's job.",
  },
  passwordLabel: {
    control: "text",
    table: { defaultValue: { summary: "Password" } },
  },
  busy: {
    control: "boolean",
    description: "Blocks both buttons while the action is in flight.",
  },
};

export default story;
