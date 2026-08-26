import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Resizable } from "../../Resizable";
import { ResizablePanel } from "../../ResizablePanel/ResizablePanel";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

const pane = (title: string, body: string) => (
  <div className="h-full p-3">
    <div className="text-label-lg font-medium text-fg-default">{title}</div>
    <p className="mt-1 text-body-sm text-fg-muted">{body}</p>
  </div>
);

export const ResizableDemo = ({
  orientation,
  collapsible,
}: {
  orientation?: "horizontal" | "vertical";
  collapsible?: boolean;
}) => (
  <div className="h-[12rem] w-full rounded-md border border-border-default">
    <Resizable orientation={orientation} handleLabel="the deal list">
      <ResizablePanel
        defaultSize={35}
        minSize={20}
        collapsible={collapsible}
        aria-label="Deals"
      >
        {pane("Deals", "NPM-2601, NPM-2604, NPM-2610")}
      </ResizablePanel>
      <ResizablePanel aria-label="Deal">
        {pane("NPM-2601", "Kanto Polymer KK · 120 MT HDPE · CIF Osaka")}
      </ResizablePanel>
    </Resizable>
  </div>
);

export const ResizableGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="orientation — drag the line, or focus it and use the arrows">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"orientation"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"panes"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"horizontal"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ResizableDemo />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"vertical"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ResizableDemo orientation="vertical" />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="collapsible — Enter on the splitter shuts it">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"collapsible"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"panes"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"false"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ResizableDemo />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"true"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <ResizableDemo collapsible />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
