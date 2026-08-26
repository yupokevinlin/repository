import type { ReactElement } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Step } from "../../Step/Step";
import { Stepper } from "../../Stepper";
import { stepStatuses } from "../../stepperStyles";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[26rem]";

export const gallerySteps: Array<ReactElement> = [
  <Step key="party" label="Counterparty" status="complete" />,
  <Step key="terms" label="Terms" status="current" />,
  <Step
    key="credit"
    label="Credit check"
    status="blocked"
    description="Waiting on finance"
  />,
  <Step key="docs" label="Documents" status="upcoming" />,
];

export const StepperGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="orientation — both are first-class">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"orientation"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"stepper"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"horizontal"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[24rem]">
              <Stepper orientation="horizontal" aria-label="New deal">
                {gallerySteps}
              </Stepper>
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"vertical"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[24rem]">
              <Stepper orientation="vertical" aria-label="New deal, down">
                {gallerySteps}
              </Stepper>
            </div>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="status">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"status"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"step"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {stepStatuses.map((status) => (
          <tr key={status}>
            <StorybookGalleryTableCell className={labelCell}>
              {status}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <div className="w-[16rem]">
                <Stepper orientation="vertical" aria-label={`A ${status} step`}>
                  <Step label="Credit check" status={status} />
                </Stepper>
              </div>
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="density">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"density"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"stepper"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"comfortable"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[16rem]">
              <Stepper orientation="vertical" aria-label="Comfortable">
                {gallerySteps}
              </Stepper>
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"compact"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[16rem]">
              <Stepper
                orientation="vertical"
                density="compact"
                aria-label="Compact"
              >
                {gallerySteps}
              </Stepper>
            </div>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
