import { useState } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import {
  ConfirmModal,
  confirmSeverities,
  type ConfirmSeverity,
} from "../../ConfirmModal";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[16rem]";

const ConfirmDemo = ({
  triggerLabel,
  severity,
  requireReason,
  requirePassword,
}: {
  triggerLabel: string;
  severity?: ConfirmSeverity;
  requireReason?: boolean;
  requirePassword?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size="8"
        variant={
          severity === "error" ? "destructive-outline" : "default-outline"
        }
        onClick={() => {
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        severity={severity}
        requireReason={requireReason}
        requirePassword={requirePassword}
        title="Delete deal NPM-1042?"
        description="The deal and its four line items will be removed. This cannot be undone."
        confirmLabel="Delete deal"
        onConfirm={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export const ConfirmModalGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="severity — open one to see it">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"severity"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trigger"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {confirmSeverities.map((severity) => (
          <tr key={severity}>
            <StorybookGalleryTableCell className={labelCell}>
              {severity}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <ConfirmDemo
                severity={severity}
                triggerLabel={`Open ${severity}`}
              />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="holding confirmation back">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"prop"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trigger"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"requireReason"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ConfirmDemo requireReason triggerLabel="Needs a reason" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"requirePassword"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ConfirmDemo requirePassword triggerLabel="Needs a password" />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
