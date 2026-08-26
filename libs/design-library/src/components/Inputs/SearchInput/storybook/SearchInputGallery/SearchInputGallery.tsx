import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  SearchInput,
  searchInputDensities,
  searchInputSizes,
} from "../../SearchInput";

export const SearchInputGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const stateWidth = "min-w-[20rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="size × density">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"density"}
            </StorybookGalleryTableHeader>
            {searchInputSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {searchInputDensities.map((density) => (
            <tr key={density}>
              <StorybookGalleryTableCell className={labelCell}>
                {density}
              </StorybookGalleryTableCell>
              {searchInputSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <SearchInput
                    label="Search deals"
                    defaultValue="rubber"
                    size={size}
                    density={density}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="state">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={stateWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"empty — no clear button"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <SearchInput label="Search deals" placeholder="Deal or party" />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"with a query"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <SearchInput label="Search deals" defaultValue="Kanto Polymer" />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"with a hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <SearchInput
                label="Search deals"
                hint="Matches deal numbers and counterparties."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <SearchInput
                label="Search deals"
                defaultValue="rubber"
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"toolbar, no visible label"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <SearchInput
                aria-label="Search deals"
                size="8"
                density="compact"
                defaultValue="NPM-10"
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
