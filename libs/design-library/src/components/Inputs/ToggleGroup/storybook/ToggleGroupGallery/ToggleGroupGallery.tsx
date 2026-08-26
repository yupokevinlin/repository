import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { ToggleGroup, type ToggleGroupOption } from "../../ToggleGroup";

const views: Array<ToggleGroupOption> = [
  { value: "table", label: "Table" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
];

const filters: Array<ToggleGroupOption> = [
  { value: "mine", label: "My deals" },
  { value: "unsettled", label: "Unsettled" },
  { value: "flagged", label: "Flagged" },
];

export const ToggleGroupGallery = () => {
  const cellWidth = "min-w-[24rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[12rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="type — the role follows it">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[12rem]">
              {"type"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"single — radiogroup"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ToggleGroup
                type="single"
                aria-label="View"
                options={views}
                defaultValue="table"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"multiple — toolbar"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ToggleGroup
                type="multiple"
                aria-label="Filters"
                options={filters}
                defaultValue={["mine", "flagged"]}
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="size × orientation">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[12rem]">
              {"size"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"horizontal"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[12rem]">
              {"vertical"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {(["8", "10", "12"] as const).map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className={labelCell}>
                {size}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className={cellWidth}>
                <ToggleGroup
                  type="single"
                  aria-label="View"
                  options={views}
                  defaultValue="table"
                  size={size}
                />
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className="min-w-[12rem]">
                <ToggleGroup
                  type="single"
                  aria-label="View"
                  options={views}
                  defaultValue="table"
                  size={size}
                  orientation="vertical"
                />
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="state">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[12rem]">
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
              {"one option locked"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ToggleGroup
                type="single"
                aria-label="View"
                options={[
                  ...views,
                  { value: "gantt", label: "Gantt", disabled: true },
                ]}
                defaultValue="table"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ToggleGroup
                type="single"
                aria-label="View"
                options={views}
                defaultValue="table"
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
