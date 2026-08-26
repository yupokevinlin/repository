import { useState } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Pagination } from "../../Pagination";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

export const galleryHref = (page: number): string => `#page=${String(page)}`;

const Fixed = ({
  page,
  pageCount,
  siblingCount,
}: {
  page: number;
  pageCount: number;
  siblingCount?: number;
}) => (
  <Pagination
    page={page}
    pageCount={pageCount}
    siblingCount={siblingCount}
    getHref={galleryHref}
    onPageChange={() => undefined}
  />
);

export const PaginationLive = () => {
  const [page, setPage] = useState<number>(1);
  return (
    <Pagination
      page={page}
      pageCount={20}
      getHref={galleryHref}
      onPageChange={setPage}
    />
  );
};

export const PaginationGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="where the user is">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"page of 20"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"pagination"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 4, 10, 19, 20].map((page: number) => (
          <tr key={page}>
            <StorybookGalleryTableCell className={labelCell}>
              {page}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <Fixed page={page} pageCount={20} />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="how many pages">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"pageCount"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"pagination"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {[1, 3, 7, 200].map((pageCount: number) => (
          <tr key={pageCount}>
            <StorybookGalleryTableCell className={labelCell}>
              {pageCount}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <Fixed page={1} pageCount={pageCount} />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="siblingCount">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"siblingCount"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"pagination"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2].map((siblingCount: number) => (
          <tr key={siblingCount}>
            <StorybookGalleryTableCell className={labelCell}>
              {siblingCount}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <Fixed page={10} pageCount={20} siblingCount={siblingCount} />
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
