import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Accordion, type AccordionSection } from "../../Accordion";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

export const gallerySections: Array<AccordionSection> = [
  {
    value: "terms",
    label: "Shipping terms",
    content: "FOB Vancouver, 30 days net, partial shipment allowed.",
  },
  {
    value: "items",
    label: "Line items",
    content: "4 items — HDPE, LDPE, PP homopolymer, PP copolymer.",
  },
  {
    value: "audit",
    label: "Audit trail",
    content: "Visible to the compliance role only.",
    disabled: true,
  },
];

export const AccordionGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="allowMultiple">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"allowMultiple"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"accordion"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"false"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Accordion
                headingLevel={3}
                defaultExpanded={["terms"]}
                sections={gallerySections}
              />
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"true"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Accordion
                headingLevel={3}
                allowMultiple
                defaultExpanded={["terms", "items"]}
                sections={gallerySections}
              />
            </div>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="state">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"state"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"section"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"closed"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Accordion headingLevel={3} sections={[gallerySections[0]]} />
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"open"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Accordion
                headingLevel={3}
                defaultExpanded={["terms"]}
                sections={[gallerySections[0]]}
              />
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"disabled"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Accordion headingLevel={3} sections={[gallerySections[2]]} />
            </div>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
