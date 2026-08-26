import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../Button";
import { buttonSizes } from "../../../Button/Button";
import { IconButton } from "../../../IconButton";
import { ButtonGroup } from "../../ButtonGroup";

const views: Array<ReactNode> = [
  <Button key="table">{"Table"}</Button>,
  <Button key="board">{"Board"}</Button>,
  <Button key="calendar">{"Calendar"}</Button>,
];

const chevronIcon: ReactNode = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

/** The variants worth showing joined — one per fill style. */
const shownVariants = [
  "default-outline",
  "default-solid",
  "primary-solid",
  "primary-outline",
  "secondary-soft",
] as const;

export const ButtonGroupGallery = () => {
  const cellWidth = "min-w-[18rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="variant — the join, per fill style">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"variant"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"horizontal"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"vertical"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {shownVariants.map((variant) => (
            <tr key={variant}>
              <StorybookGalleryTableCell className={labelCell}>
                {variant}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className={cellWidth}>
                <ButtonGroup variant={variant} aria-label="View">
                  {views}
                </ButtonGroup>
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className="min-w-[10rem]">
                <ButtonGroup
                  variant={variant}
                  orientation="vertical"
                  aria-label="View"
                >
                  {views}
                </ButtonGroup>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"size"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {buttonSizes.map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className={labelCell}>
                {size}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className={cellWidth}>
                <ButtonGroup
                  variant="default-outline"
                  size={size}
                  aria-label="View"
                >
                  {views}
                </ButtonGroup>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="mixed contents">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"button + IconButton"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ButtonGroup variant="primary-solid">
                <Button>{"Save"}</Button>
                <IconButton icon={chevronIcon} aria-label="More save options" />
              </ButtonGroup>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"two buttons"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ButtonGroup variant="default-outline" aria-label="Deal actions">
                <Button>{"Approve"}</Button>
                <Button>{"Reject"}</Button>
              </ButtonGroup>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"one button"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <ButtonGroup variant="default-outline">
                <Button>{"Only"}</Button>
              </ButtonGroup>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
