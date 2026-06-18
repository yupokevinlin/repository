import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button, buttonSizes, buttonVariants } from "../../Button";

export const ButtonGallery = () => {
  const tableCellWidth = "min-w-[10rem]";
  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable>
        <thead>
          <tr>
            <StorybookGalleryTableHeader className={tableCellWidth}>
              {"variant"}
            </StorybookGalleryTableHeader>
            {buttonVariants.map((variant) => (
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
          {buttonSizes.map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className="bg-bg-hover text-fg-default text-sm font-bold text-center whitespace-nowrap min-w-[10rem]">
                size: {size}
              </StorybookGalleryTableCell>
              {buttonVariants.map((variant) => (
                <StorybookGalleryTableCell
                  key={variant}
                  className={tableCellWidth}
                >
                  <Button variant={variant} size={size}>
                    Button
                  </Button>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
