import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Checkbox } from "../../../../Inputs/Checkbox";
import { Popover, popoverPaddings } from "../../Popover";

const filterForm = (
  <div className="flex w-[14rem] flex-col gap-2">
    <Checkbox label="My deals only" />
    <Checkbox label="Unsettled" defaultChecked />
    <Button size="8" variant="default-outline">
      {"Reset"}
    </Button>
  </div>
);

export const PopoverGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="padding — open one to see it">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"padding"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"trigger"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {popoverPaddings.map((padding) => (
            <tr key={padding}>
              <StorybookGalleryTableCell className={labelCell}>
                {padding}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                <Popover
                  aria-label="Filters"
                  padding={padding}
                  content={filterForm}
                >
                  <Button variant="default-outline" size="8">
                    {"Filters"}
                  </Button>
                </Popover>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="placement">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"placement"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"trigger"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {(["bottom", "top", "right", "left"] as const).map((placement) => (
            <tr key={placement}>
              <StorybookGalleryTableCell className={labelCell}>
                {placement}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                <Popover
                  aria-label="Filters"
                  placement={placement}
                  content={filterForm}
                >
                  <Button variant="default-outline" size="8">
                    {placement}
                  </Button>
                </Popover>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
