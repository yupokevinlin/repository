import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Link } from "../../../../Buttons/Link";
import { Avatar } from "../../../../DataDisplay/Avatar";
import { Badge } from "../../../../DataDisplay/Badge";
import { Typography } from "../../../../Typography/Typography";
import { HoverCard } from "../../HoverCard";

const partySummary = (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Avatar name="Kanto Polymer KK" shape="square" />
      <Typography as="p" size="label-md">
        {"Kanto Polymer KK"}
      </Typography>
    </div>
    <Typography as="p" size="body-sm">
      {"Osaka · credit CAD 250,000 · 14 open deals"}
    </Typography>
    <Badge severity="success">{"Approved"}</Badge>
  </div>
);

export const HoverCardGallery = () => {
  const cellWidth = "min-w-[20rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="hover or focus the link">
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
              {"default delay"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <HoverCard aria-label="Counterparty" content={partySummary}>
                <Link href="/app/parties/1">{"Kanto Polymer KK"}</Link>
              </HoverCard>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"no delay"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <HoverCard
                aria-label="Counterparty"
                openDelay={0}
                content={partySummary}
              >
                <Link href="/app/parties/1">{"Kanto Polymer KK"}</Link>
              </HoverCard>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"open, above"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <HoverCard
                aria-label="Counterparty"
                placement="top"
                open
                content={partySummary}
              >
                <Link href="/app/parties/1">{"Kanto Polymer KK"}</Link>
              </HoverCard>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
