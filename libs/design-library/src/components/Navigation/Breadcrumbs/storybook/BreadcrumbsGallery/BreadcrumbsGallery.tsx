import type { ReactElement } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Breadcrumb } from "../../Breadcrumb/Breadcrumb";
import { Breadcrumbs } from "../../Breadcrumbs";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

export const galleryTrail: Array<ReactElement> = [
  <Breadcrumb key="home">
    <a href="/app">{"Home"}</a>
  </Breadcrumb>,
  <Breadcrumb key="deals">
    <a href="/app/deals">{"Deals"}</a>
  </Breadcrumb>,
  <Breadcrumb key="deal">
    <a href="/app/deals/NPM-2601">{"NPM-2601"}</a>
  </Breadcrumb>,
  <Breadcrumb key="shipments">
    <a href="/app/deals/NPM-2601/shipments">{"Shipments"}</a>
  </Breadcrumb>,
  <Breadcrumb key="bol">{"Bill of lading"}</Breadcrumb>,
];

export const BreadcrumbsGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="maxItems — open the … to see the rest">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"maxItems"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trail"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"none"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs>{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"3"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs maxItems={3}>{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"2"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs maxItems={2}>{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="separator and density">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"variation"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trail"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {'separator "/"'}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs>{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {'separator "›"'}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs separator="›">{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"comfortable"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs density="comfortable">{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"compact"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <Breadcrumbs density="compact">{galleryTrail}</Breadcrumbs>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
