import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  Typography,
  typographyFontFamilies,
  typographySizes,
  typographyWeights,
} from "../../Typography";

export const TypographyGallery = () => {
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[9rem]";

  return (
    <StorybookGalleryWrapper>
      {typographyFontFamilies.map((fontFamily) => (
        <StorybookGalleryTable
          key={fontFamily}
          title={`fontFamily: ${fontFamily} — size × fontWeight`}
        >
          <thead>
            <tr>
              <StorybookGalleryTableHeader className="min-w-[9rem]">
                {"size"}
              </StorybookGalleryTableHeader>
              {typographyWeights.map((fontWeight) => (
                <StorybookGalleryTableHeader
                  key={fontWeight}
                  className="min-w-[12rem]"
                >
                  {fontWeight}
                </StorybookGalleryTableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {typographySizes.map((size) => (
              <tr key={size}>
                <StorybookGalleryTableCell className={labelCell}>
                  {size}
                </StorybookGalleryTableCell>
                {typographyWeights.map((fontWeight) => (
                  <StorybookGalleryTableCell
                    key={fontWeight}
                    className="min-w-[12rem]"
                  >
                    <Typography
                      size={size}
                      fontWeight={fontWeight}
                      fontFamily={fontFamily}
                    >
                      {"Kanto Polymer"}
                    </Typography>
                  </StorybookGalleryTableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </StorybookGalleryTable>
      ))}
    </StorybookGalleryWrapper>
  );
};
