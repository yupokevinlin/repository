import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Kbd } from "../../../../DataDisplay/Kbd";
import { MenuGroup } from "../../../Menu/MenuGroup";
import { MenuItem } from "../../../Menu/MenuItem";
import { MenuSeparator } from "../../../Menu/MenuSeparator";
import { DropdownMenu } from "../../DropdownMenu";

export const DropdownMenuGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="contents — open one to see it">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"trigger"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"plain commands"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <DropdownMenu
                aria-label="Deal actions"
                content={
                  <>
                    <MenuItem>{"Duplicate"}</MenuItem>
                    <MenuItem>{"Amend"}</MenuItem>
                    <MenuItem>{"Export"}</MenuItem>
                  </>
                }
              >
                <Button variant="default-outline" size="8">
                  {"Deal actions"}
                </Button>
              </DropdownMenu>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"with a separator"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <DropdownMenu
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
                <Button variant="default-outline" size="8">
                  {"Deal actions"}
                </Button>
              </DropdownMenu>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"grouped"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <DropdownMenu
                aria-label="Export"
                content={
                  <>
                    <MenuGroup label="Download">
                      <MenuItem>{"CSV"}</MenuItem>
                      <MenuItem>{"PDF"}</MenuItem>
                    </MenuGroup>
                    <MenuSeparator />
                    <MenuGroup label="Send">
                      <MenuItem>{"Email to counterparty"}</MenuItem>
                    </MenuGroup>
                  </>
                }
              >
                <Button variant="default-outline" size="8">
                  {"Export"}
                </Button>
              </DropdownMenu>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"shortcuts and disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <DropdownMenu
                aria-label="Deal actions"
                content={
                  <>
                    <MenuItem shortcut={<Kbd keys={["D"]} />}>
                      {"Duplicate"}
                    </MenuItem>
                    <MenuItem disabled>{"Settle"}</MenuItem>
                    <MenuSeparator />
                    <MenuItem
                      severity="error"
                      shortcut={<Kbd keys={["Del"]} />}
                    >
                      {"Delete deal"}
                    </MenuItem>
                  </>
                }
              >
                <Button variant="default-outline" size="8">
                  {"Deal actions"}
                </Button>
              </DropdownMenu>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
