import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { DatePicker, datePickerSizes } from "../../DatePicker";

const eta = new Date(2026, 7, 18);

export const DatePickerGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const stateWidth = "min-w-[20rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"size"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {datePickerSizes.map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className={labelCell}>
                {size}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className={cellWidth}>
                <DatePicker
                  label="ETA"
                  defaultValue={eta}
                  size={size}
                  locale="en-CA"
                />
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="state">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={stateWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"empty"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <DatePicker label="ETA" locale="en-CA" />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <DatePicker
                label="ETA"
                hint="Local time at the discharge port."
                defaultValue={eta}
                required
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <DatePicker
                label="ETA"
                error="ETA cannot be before the B/L date."
                defaultValue={eta}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <DatePicker
                label="Settled at"
                defaultValue={eta}
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
