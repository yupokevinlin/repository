import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Tooltip } from "../../Tooltip";

const placements = ["top", "bottom", "left", "right"] as const;

export const TooltipGallery = () => {
  const cellWidth = "min-w-[14rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="placement — hover or focus a trigger to see it">
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
          {placements.map((placement) => (
            <tr key={placement}>
              <StorybookGalleryTableCell className={labelCell}>
                {placement}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                <Tooltip
                  content="Free on board — the seller loads at the named port."
                  placement={placement}
                  delay={0}
                >
                  <Button variant="default-outline" size="8">
                    {"FOB"}
                  </Button>
                </Tooltip>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="open, so the tip itself can be reviewed">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[18rem]">
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"short"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className="min-w-[18rem]">
              <Tooltip content="Export" placement="bottom" open>
                <Button variant="default-soft" size="8">
                  {"Export"}
                </Button>
              </Tooltip>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"wrapping"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className="min-w-[18rem]">
              <Tooltip
                content="Cost, insurance and freight — the seller pays carriage and insurance to the named destination port."
                placement="bottom"
                open
              >
                <Button variant="default-soft" size="8">
                  {"CIF"}
                </Button>
              </Tooltip>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
