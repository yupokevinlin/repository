import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Calendar } from "../../Calendar";

const august = new Date(2026, 7, 1);
const chosen = new Date(2026, 7, 18);

export const CalendarGallery = () => {
  const cellWidth = "min-w-[18rem]";
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
              <Calendar defaultMonth={august} locale="en-CA" />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"chosen"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Calendar
                defaultMonth={august}
                defaultValue={chosen}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"bounded"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Calendar
                defaultMonth={august}
                minDate={new Date(2026, 7, 10)}
                maxDate={new Date(2026, 7, 24)}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"Sunday first"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Calendar
                defaultMonth={august}
                defaultValue={chosen}
                weekStartsOn={0}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"February — still six weeks"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Calendar defaultMonth={new Date(2026, 1, 1)} locale="en-CA" />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
