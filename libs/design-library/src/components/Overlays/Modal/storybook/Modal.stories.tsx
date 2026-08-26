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
import { TextInput } from "../../../Inputs/TextInput";
import { Modal, type ModalProps, modalSizes } from "../Modal";
import { ModalGallery } from "./ModalGallery/ModalGallery";

const usage = `{/* Editing a record */}
<Modal open={open} onOpenChange={setOpen} title="Amend deal"
  footer={<Button onClick={save}>Save</Button>}>
  <DealForm />
</Modal>

{/* Wide, for a table */}
<Modal open={open} onOpenChange={setOpen} title="Line items" size="lg">
  <LineItemTable />
</Modal>

{/* Work worth protecting from a stray click */}
<Modal open={open} onOpenChange={setOpen} title="New deal" dismissOnScrimClick={false}>
  <DealForm />
</Modal>

{/* Asking the user to agree to something irreversible is a ConfirmModal */}
<ConfirmModal open={open} onOpenChange={setOpen} severity="error"
  title="Delete this deal?" description="NPM-1042 will be removed."
  confirmLabel="Delete deal" onConfirm={remove} />

{/* When the page behind should stay usable, it is a Popover */}
<Popover aria-label="Filters" content={<FilterForm />}><Button>Filters</Button></Popover>`;

const story: Meta<ModalProps> = {
  title: "Design Library/Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Modal</Title>
          <Heading>Gallery</Heading>
          <ModalGallery />
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

const ModalExample = ({
  open: _open,
  onOpenChange: _onOpenChange,
  ...args
}: ModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Amend deal"}
      </Button>
      <Modal {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Example: StoryObj<ModalProps> = {
  render: (args: ModalProps) => <ModalExample {...args} />,
};

Example.args = {
  title: "Amend deal NPM-1042",
  size: "md",
  dismissOnScrimClick: true,
  closeLabel: "Close",
  children: (
    <div className="flex flex-col gap-3">
      <TextInput label="Counterparty" defaultValue="Kanto Polymer KK" />
      <TextInput label="Quantity (MT)" defaultValue="120" />
    </div>
  ),
  footer: (
    <>
      <Button variant="default-outline">{"Cancel"}</Button>
      <Button>{"Save"}</Button>
    </>
  ),
};

Example.argTypes = {
  open: {
    control: false,
    description: "Controlled — driven by the trigger here.",
  },
  onOpenChange: { control: false },
  title: {
    control: "text",
    description: "The heading, and the dialog's accessible name.",
  },
  children: {
    control: false,
    description: "The body. The only part that scrolls.",
  },
  footer: { control: false, description: "Actions, pinned to the bottom." },
  size: {
    control: "inline-radio",
    options: modalSizes,
    description: 'Panel width. "sm" = 24rem, "md" = 32rem, "lg" = 48rem.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(modalSizes) },
      defaultValue: { summary: "md" },
    },
  },
  dismissOnScrimClick: {
    control: "boolean",
    description:
      "Whether clicking the dimmed background closes it. Turn off where losing the work would be expensive.",
    table: { defaultValue: { summary: "true" } },
  },
  closeLabel: {
    control: "text",
    description: "The close button's accessible name.",
    table: { defaultValue: { summary: "Close" } },
  },
};

export default story;
