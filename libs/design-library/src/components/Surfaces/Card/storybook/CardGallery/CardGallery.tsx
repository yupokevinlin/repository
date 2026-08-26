import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Heading } from "../../../../Typography/Heading";
import { Typography } from "../../../../Typography/Typography";
import {
  Card,
  type CardElevation,
  cardElevations,
  cardPaddings,
  cardSeverities,
} from "../../Card";

const noop = (): void => undefined;

const body: ReactNode = (
  <>
    <Heading as="h3" size="title-sm">
      {"Kanto Polymer KK"}
    </Heading>
    <Typography as="p" size="body-sm">
      {"Osaka · credit CAD 250,000"}
    </Typography>
  </>
);

export const CardGallery = () => {
  const cellWidth = "min-w-[18rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="elevation × padding">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"elevation"}
            </StorybookGalleryTableHeader>
            {cardPaddings.map((padding) => (
              <StorybookGalleryTableHeader key={padding} className={cellWidth}>
                {`padding: ${padding}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {cardElevations.map((elevation: CardElevation) => (
            <tr key={elevation}>
              <StorybookGalleryTableCell className={labelCell}>
                {elevation}
              </StorybookGalleryTableCell>
              {cardPaddings.map((padding) => (
                <StorybookGalleryTableCell
                  key={padding}
                  align="left"
                  className={cellWidth}
                >
                  <Card elevation={elevation} padding={padding}>
                    {body}
                  </Card>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="severity accent edge">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"none"}
            </StorybookGalleryTableHeader>
            {cardSeverities.map((severity) => (
              <StorybookGalleryTableHeader key={severity} className={cellWidth}>
                {severity}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell align="left" className="min-w-[10rem]">
              <Card>{body}</Card>
            </StorybookGalleryTableCell>
            {cardSeverities.map((severity) => (
              <StorybookGalleryTableCell
                key={severity}
                align="left"
                className={cellWidth}
              >
                <Card severity={severity}>{body}</Card>
              </StorybookGalleryTableCell>
            ))}
          </tr>
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="selectable — a real button, never an anchor">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"selectable"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Card selectable onClick={noop}>
                {body}
              </Card>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"selectable + raised"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Card selectable onClick={noop} elevation="raised">
                {body}
              </Card>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"selectable + disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Card selectable disabled onClick={noop}>
                {body}
              </Card>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
