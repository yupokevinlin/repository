import { useState } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { TextInput } from "../../../../Inputs/TextInput";
import { Modal, type ModalSize, modalSizes } from "../../Modal";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[16rem]";

const ModalDemo = ({
  size,
  dismissOnScrimClick,
  triggerLabel,
}: {
  size?: ModalSize;
  dismissOnScrimClick?: boolean;
  triggerLabel: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size="8"
        variant="default-outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Amend deal NPM-1042"
        size={size}
        dismissOnScrimClick={dismissOnScrimClick}
        footer={
          <>
            <Button
              variant="default-outline"
              onClick={() => {
                setOpen(false);
              }}
            >
              {"Cancel"}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {"Save"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <TextInput label="Counterparty" defaultValue="Kanto Polymer KK" />
          <TextInput label="Quantity (MT)" defaultValue="120" />
        </div>
      </Modal>
    </>
  );
};

export const ModalGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="size — open one to see it">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"size"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trigger"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {modalSizes.map((size) => (
          <tr key={size}>
            <StorybookGalleryTableCell className={labelCell}>
              {size}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <ModalDemo size={size} triggerLabel={`Open ${size}`} />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="dismissOnScrimClick">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"dismissOnScrimClick"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trigger"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"true"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ModalDemo triggerLabel="Click past to close" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"false"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ModalDemo
              dismissOnScrimClick={false}
              triggerLabel="Click past does nothing"
            />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
