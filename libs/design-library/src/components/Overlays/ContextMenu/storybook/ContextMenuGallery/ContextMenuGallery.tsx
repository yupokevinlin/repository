import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { MenuGroup } from "../../../Menu/MenuGroup";
import { MenuItem } from "../../../Menu/MenuItem";
import { MenuSeparator } from "../../../Menu/MenuSeparator";
import { ContextMenu } from "../../ContextMenu";

const surface =
  "rounded-md border border-dashed border-border-strong bg-bg-default px-4 py-6 text-body-sm text-fg-muted";

export const ContextMenuGallery = () => {
  const cellWidth = "min-w-[22rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="right-click a region to open it">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"region"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"plain commands"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ContextMenu
                aria-label="Deal actions"
                content={
                  <>
                    <MenuItem>{"Duplicate"}</MenuItem>
                    <MenuItem>{"Amend"}</MenuItem>
                    <MenuSeparator />
                    <MenuItem severity="error">{"Delete deal"}</MenuItem>
                  </>
                }
              >
                <div className={surface}>
                  {"Right-click this row — NPM-1042"}
                </div>
              </ContextMenu>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"grouped"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ContextMenu
                aria-label="Export"
                content={
                  <MenuGroup label="Download">
                    <MenuItem>{"CSV"}</MenuItem>
                    <MenuItem>{"PDF"}</MenuItem>
                  </MenuGroup>
                }
              >
                <div className={surface}>
                  {"Right-click this row — NPM-1043"}
                </div>
              </ContextMenu>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
