import { StorybookGalleryTable } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { LoadingSpinner, loadingSpinnerVariants } from "../../LoadingSpinner";

export const LoadingSpinnerGallery = () => {
  const tableCellWidth = "min-w-[8rem]";
  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="LoadingSpinner">
        <thead>
          <tr>
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
          <tr>
            {loadingSpinnerVariants.map((variant) => (
              <StorybookGalleryTableCell
                key={variant}
                className={tableCellWidth}
              >
                <LoadingSpinner
                  variant={variant}
                  className="size-[2rem] mx-auto"
                />
              </StorybookGalleryTableCell>
            ))}
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
