import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { DateRangePicker } from "../../DateRangePicker";

export const DateRangePickerGallery = () => {
  const cellWidth = "min-w-[22rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
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
              {"empty"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <DateRangePicker label="Shipment window" locale="en-CA" />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"half-open, while picking"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <DateRangePicker
                label="Shipment window"
                defaultValue={{ from: new Date(2026, 7, 10), to: null }}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"complete"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <DateRangePicker
                label="Shipment window"
                defaultValue={{
                  from: new Date(2026, 7, 10),
                  to: new Date(2026, 7, 24),
                }}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <DateRangePicker
                label="Laycan"
                required
                error="A laycan is required before nomination."
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <DateRangePicker
                label="Shipment window"
                defaultValue={{
                  from: new Date(2026, 7, 10),
                  to: new Date(2026, 7, 24),
                }}
                disabled
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
