import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Badge } from "../../../../DataDisplay/Badge";
import { Sidebar } from "../../Sidebar";
import { SidebarGroup } from "../../SidebarGroup/SidebarGroup";
import { SidebarItem } from "../../SidebarItem/SidebarItem";
import type { SidebarDensity } from "../../sidebarStyles";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[20rem]";

const glyph = (path: string): ReactNode => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d={path} />
  </svg>
);

const dealIcon = glyph("M2 4h12M2 8h12M2 12h8");
const partyIcon = glyph(
  "M8 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 13a5 5 0 0110 0",
);
const shipIcon = glyph("M2 11l6-8 6 8M4 11v3h8v-3");
const settingsIcon = glyph(
  "M8 10a2 2 0 100-4 2 2 0 000 4zM8 2v2M8 12v2M2 8h2M12 8h2",
);

export const SidebarDemo = ({
  collapsed,
  density,
}: {
  collapsed?: boolean;
  density?: SidebarDensity;
}) => (
  <div className="h-[20rem]">
    <Sidebar
      aria-label={`Main ${collapsed === true ? "collapsed" : "expanded"}`}
      collapsed={collapsed}
      density={density}
    >
      <SidebarGroup label="Trading">
        <SidebarItem icon={dealIcon} current>
          <a href="/app/deals">{"Deals"}</a>
        </SidebarItem>
        <SidebarItem
          icon={partyIcon}
          trailing={<Badge severity="error">{"3"}</Badge>}
        >
          <a href="/app/approvals">{"Approvals"}</a>
        </SidebarItem>
      </SidebarGroup>
      <SidebarGroup label="Logistics">
        <SidebarItem icon={shipIcon}>
          <a href="/app/shipments">{"Shipments"}</a>
        </SidebarItem>
      </SidebarGroup>
      <SidebarItem icon={settingsIcon}>
        <a href="/app/settings">{"Settings"}</a>
      </SidebarItem>
    </Sidebar>
  </div>
);

export const SidebarGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="collapsed">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"collapsed"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"sidebar"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"false"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <SidebarDemo />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"true"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <SidebarDemo collapsed />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="density">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"density"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"sidebar"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"comfortable"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <SidebarDemo density="comfortable" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"compact"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <SidebarDemo density="compact" />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
