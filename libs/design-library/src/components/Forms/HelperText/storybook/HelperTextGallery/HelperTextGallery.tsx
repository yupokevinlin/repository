import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Label } from "../../../Label";
import {
  HelperText,
  helperTextDensities,
  helperTextSeverities,
} from "../../HelperText";

const copy: Record<string, string> = {
  neutral: "Mid-market rate at 16:00 UTC.",
  warning: "This rate is more than a day old.",
  error: "Quantity exceeds the remaining allocation.",
};

export const HelperTextGallery = () => {
  const cellWidth = "min-w-[20rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="severity × density">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"severity"}
            </StorybookGalleryTableHeader>
            {helperTextDensities.map((density) => (
              <StorybookGalleryTableHeader key={density} className={cellWidth}>
                {density}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {helperTextSeverities.map((severity) => (
            <tr key={severity}>
              <StorybookGalleryTableCell className={labelCell}>
                {severity}
              </StorybookGalleryTableCell>
              {helperTextDensities.map((density) => (
                <StorybookGalleryTableCell
                  key={density}
                  align="left"
                  className={cellWidth}
                >
                  <HelperText severity={severity} density={density}>
                    {copy[severity]}
                  </HelperText>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="under a field, wired with aria-describedby">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <div className="flex flex-col gap-1">
                <Label htmlFor="gallery-rate">{"Rate"}</Label>
                <input
                  id="gallery-rate"
                  aria-describedby="gallery-rate-hint"
                  defaultValue="1.3742"
                  className="h-10 w-full rounded-md border border-border-default bg-bg-default px-3 text-body-sm text-fg-default"
                />
                <HelperText id="gallery-rate-hint">{copy.neutral}</HelperText>
              </div>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <div className="flex flex-col gap-1">
                <Label htmlFor="gallery-qty" required>
                  {"Quantity"}
                </Label>
                <input
                  id="gallery-qty"
                  aria-describedby="gallery-qty-error"
                  aria-invalid
                  defaultValue="40,000"
                  className="h-10 w-full rounded-md border border-border-error bg-bg-default px-3 text-body-sm text-fg-default"
                />
                <HelperText id="gallery-qty-error" severity="error">
                  {copy.error}
                </HelperText>
              </div>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
