import { useState } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Tab } from "../../Tab/Tab";
import { TabPanel } from "../../TabPanel/TabPanel";
import { Tabs } from "../../Tabs";
import type { TabsOrientation } from "../../tabsStyles";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

const TabsDemo = ({
  id,
  orientation,
  withPanel,
}: {
  id: string;
  orientation?: TabsOrientation;
  withPanel?: boolean;
}) => {
  const [value, setValue] = useState<string>("terms");

  const strip = (
    <Tabs
      id={id}
      value={value}
      onValueChange={setValue}
      orientation={orientation}
      aria-label="Deal sections"
    >
      <Tab value="terms" label="Terms" />
      <Tab value="items" label="Line items" count={4} />
      <Tab value="audit" label="Audit" disabled />
      <Tab value="docs" label="Documents" />
    </Tabs>
  );

  // A vertical strip fills whatever it is given, so the gallery pens it in —
  // otherwise its selected marker sits against the far edge of the cell,
  // yards from the tab it belongs to.
  const penned =
    orientation === "vertical" ? (
      <div className="w-[10rem]">{strip}</div>
    ) : (
      strip
    );

  if (withPanel !== true) {
    return penned;
  }

  return (
    <div
      className={
        orientation === "vertical" ? "flex gap-4" : "flex flex-col gap-4"
      }
    >
      {penned}
      <TabPanel id={id} value={value} className="text-body-sm text-fg-default">
        {`The layout placed this panel — it is a sibling of the strip, not a child of it. Showing: ${value}.`}
      </TabPanel>
    </div>
  );
};

export const TabsGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="orientation">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"orientation"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"strip"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"horizontal"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <TabsDemo id="gallery-horizontal" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"vertical"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <TabsDemo id="gallery-vertical" orientation="vertical" />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="with a panel the layout placed">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"layout"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"strip + panel"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"above"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <TabsDemo id="gallery-panel-above" withPanel />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"beside"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <TabsDemo
              id="gallery-panel-beside"
              orientation="vertical"
              withPanel
            />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
