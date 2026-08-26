import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Label } from "../../../Label";
import { Fieldset, fieldsetDensities } from "../../Fieldset";

const field = (id: string, label: string, value: string): ReactNode => (
  <div className="flex min-w-0 flex-col gap-1">
    <Label htmlFor={id}>{label}</Label>
    <input
      id={id}
      defaultValue={value}
      className="h-10 w-full rounded-md border border-border-default bg-bg-default px-3 text-body-sm text-fg-default disabled:border-border-disabled disabled:bg-bg-disabled disabled:text-fg-disabled"
    />
  </div>
);

export const FieldsetGallery = () => {
  const cellWidth = "min-w-[22rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="orientation × density">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"orientation"}
            </StorybookGalleryTableHeader>
            {fieldsetDensities.map((density) => (
              <StorybookGalleryTableHeader key={density} className={cellWidth}>
                {density}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"vertical"}
            </StorybookGalleryTableCell>
            {fieldsetDensities.map((density) => (
              <StorybookGalleryTableCell
                key={density}
                align="left"
                className={cellWidth}
              >
                <Fieldset legend="Delivery terms" density={density}>
                  {field(`v-${density}-incoterm`, "Incoterm", "FOB")}
                  {field(`v-${density}-port`, "Port", "Vancouver")}
                </Fieldset>
              </StorybookGalleryTableCell>
            ))}
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"horizontal"}
            </StorybookGalleryTableCell>
            {fieldsetDensities.map((density) => (
              <StorybookGalleryTableCell
                key={density}
                align="left"
                className={cellWidth}
              >
                <Fieldset
                  legend="Filters"
                  orientation="horizontal"
                  density={density}
                >
                  {field(`h-${density}-status`, "Status", "Open")}
                  {field(`h-${density}-desk`, "Desk", "Rubber")}
                </Fieldset>
              </StorybookGalleryTableCell>
            ))}
          </tr>
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="state">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Fieldset legend="Delivery terms" required>
                {field("req-incoterm", "Incoterm", "FOB")}
              </Fieldset>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Fieldset legend="Delivery terms" disabled>
                {field("dis-incoterm", "Incoterm", "FOB")}
                {field("dis-port", "Port", "Vancouver")}
              </Fieldset>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
