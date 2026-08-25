import { StorybookGalleryTable } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  LoadingSpinner,
  loadingSpinnerSizes,
  loadingSpinnerVariants,
} from "../../LoadingSpinner";

export const LoadingSpinnerGallery = () => {
  const tableCellWidth = "min-w-[8rem]";
  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="variant × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className={tableCellWidth}>
              {"size"}
            </StorybookGalleryTableHeader>
            {loadingSpinnerVariants.map((variant) => (
              <StorybookGalleryTableHeader
                key={variant}
                className={tableCellWidth}
              >
                {variant}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {loadingSpinnerSizes.map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className="bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[8rem]">
                {size}
              </StorybookGalleryTableCell>
              {loadingSpinnerVariants.map((variant) => (
                <StorybookGalleryTableCell
                  key={variant}
                  className={tableCellWidth}
                >
                  <LoadingSpinner
                    variant={variant}
                    size={size}
                    className="mx-auto"
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
