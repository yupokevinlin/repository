import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Skeleton } from "../../Skeleton";

const cases: Array<{
  label: string;
  render: (animated: boolean) => ReactNode;
}> = [
  {
    label: "text",
    render: (animated) => <Skeleton animated={animated} />,
  },
  {
    label: "text, 3 lines",
    render: (animated) => <Skeleton lines={3} animated={animated} />,
  },
  {
    label: "circle",
    render: (animated) => <Skeleton variant="circle" animated={animated} />,
  },
  {
    label: "rect",
    render: (animated) => <Skeleton variant="rect" animated={animated} />,
  },
  {
    label: "explicit size",
    render: (animated) => (
      <Skeleton variant="rect" width="8rem" height="3rem" animated={animated} />
    ),
  },
  {
    label: "a row it replaces",
    render: (animated) => (
      <div className="flex w-full items-center gap-[0.75rem]">
        <Skeleton
          variant="circle"
          width="2rem"
          height="2rem"
          animated={animated}
        />
        <div className="flex-1">
          <Skeleton lines={2} animated={animated} />
        </div>
      </div>
    ),
  },
  {
    label: "tracks the type scale",
    render: (animated) => (
      <div className="flex w-full flex-col gap-[0.5rem]">
        <div className="text-display-sm">
          <Skeleton animated={animated} />
        </div>
        <div className="text-body-sm">
          <Skeleton animated={animated} />
        </div>
        <div className="text-micro-md">
          <Skeleton animated={animated} />
        </div>
      </div>
    ),
  },
];

export const SkeletonGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[12rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="form × animation">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[12rem]">
              {"form"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"animated"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"flat"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {cases.map(({ label, render }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                {render(true)}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                {render(false)}
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
