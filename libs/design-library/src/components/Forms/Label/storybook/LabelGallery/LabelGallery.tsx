import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Label } from "../../Label";
import { labelDensities } from "../../Label";

export const LabelGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="marking × density">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"marking"}
            </StorybookGalleryTableHeader>
            {labelDensities.map((density) => (
              <StorybookGalleryTableHeader key={density} className={cellWidth}>
                {density}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"plain"}
            </StorybookGalleryTableCell>
            {labelDensities.map((density) => (
              <StorybookGalleryTableCell
                key={density}
                align="left"
                className={cellWidth}
              >
                <Label htmlFor={`plain-${density}`} density={density}>
                  {"Deal number"}
                </Label>
              </StorybookGalleryTableCell>
            ))}
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required"}
            </StorybookGalleryTableCell>
            {labelDensities.map((density) => (
              <StorybookGalleryTableCell
                key={density}
                align="left"
                className={cellWidth}
              >
                <Label
                  htmlFor={`required-${density}`}
                  density={density}
                  required
                >
                  {"Deal number"}
                </Label>
              </StorybookGalleryTableCell>
            ))}
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"optional"}
            </StorybookGalleryTableCell>
            {labelDensities.map((density) => (
              <StorybookGalleryTableCell
                key={density}
                align="left"
                className={cellWidth}
              >
                <Label
                  htmlFor={`optional-${density}`}
                  density={density}
                  optionalText="Optional"
                >
                  {"Notes"}
                </Label>
              </StorybookGalleryTableCell>
            ))}
          </tr>
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="with a control — clicking the label focuses it">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[20rem]">
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"filter bar"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[20rem]">
              <div className="flex flex-col gap-1">
                <Label htmlFor="gallery-status" required>
                  {"Status"}
                </Label>
                <input
                  id="gallery-status"
                  className="h-10 w-full rounded-md border border-border-default bg-bg-default px-3 text-body-sm text-fg-default"
                  defaultValue="Open"
                />
              </div>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled control"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[20rem]">
              <div className="flex flex-col gap-1">
                <Label htmlFor="gallery-locked">{"Settled at"}</Label>
                <input
                  id="gallery-locked"
                  disabled
                  className="h-10 w-full rounded-md border border-border-disabled bg-bg-disabled px-3 text-body-sm text-fg-disabled"
                  defaultValue="2026-08-19"
                />
              </div>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
