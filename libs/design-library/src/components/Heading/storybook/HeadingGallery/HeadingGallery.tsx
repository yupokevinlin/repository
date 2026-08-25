import { StorybookGalleryTable } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import type { HeadingSize } from "../../Heading";
import { Heading, headingElements } from "../../Heading";

/**
 * Level and size are independent, which is the point of the matrix: every row
 * is a real `h1`–`h6` in the document outline, and every column is a step on
 * the type scale.
 */
const gallerySizes = [
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
  "label-lg",
] as const satisfies Array<HeadingSize>;

export const HeadingGallery = () => {
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[6rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="level × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[6rem]">
              {"as"}
            </StorybookGalleryTableHeader>
            {gallerySizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className="min-w-[14rem]">
                {size}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {headingElements.map((element) => (
            <tr key={element}>
              <StorybookGalleryTableCell className={labelCell}>
                {element}
              </StorybookGalleryTableCell>
              {gallerySizes.map((size) => (
                <StorybookGalleryTableCell key={size} className="min-w-[14rem]">
                  <Heading as={element} size={size}>
                    {"Kanto Polymer"}
                  </Heading>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
