import { useState } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Checkbox } from "../../../../Inputs/Checkbox";
import { TextInput } from "../../../../Inputs/TextInput";
import {
  Drawer,
  type DrawerSide,
  drawerSides,
  type DrawerSize,
  drawerSizes,
} from "../../Drawer";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[16rem]";

const DrawerDemo = ({
  triggerLabel,
  side,
  size,
  modal,
}: {
  triggerLabel: string;
  side?: DrawerSide;
  size?: DrawerSize;
  modal?: boolean;
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
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Filters"
        side={side}
        size={size}
        modal={modal}
        footer={
          <>
            <Button
              variant="default-outline"
              onClick={() => {
                setOpen(false);
              }}
            >
              {"Reset"}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {"Apply"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <TextInput label="Counterparty" placeholder="Any" />
          <Checkbox label="My deals only" />
          <Checkbox label="Unsettled" defaultChecked />
        </div>
      </Drawer>
    </>
  );
};

export const DrawerGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="side — open one to see it">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"side"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trigger"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {drawerSides.map((side) => (
          <tr key={side}>
            <StorybookGalleryTableCell className={labelCell}>
              {side}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <DrawerDemo side={side} triggerLabel={`Open ${side}`} />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="size">
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
        {drawerSizes.map((size) => (
          <tr key={size}>
            <StorybookGalleryTableCell className={labelCell}>
              {size}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <DrawerDemo size={size} triggerLabel={`Open ${size}`} />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="modal — the non-modal sheet leaves the page usable">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"modal"}
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
            <DrawerDemo triggerLabel="Blocks the page" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"false"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <DrawerDemo modal={false} triggerLabel="Leaves it usable" />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
