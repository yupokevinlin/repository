import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Pagination, type PaginationProps } from "../Pagination";
import {
  galleryHref,
  PaginationGallery,
} from "./PaginationGallery/PaginationGallery";

const usage = `{/* Client-side routing: onPageChange fires on a plain left click */}
<Pagination
  page={page}
  pageCount={pageCount}
  getHref={(next) => \`/app/deals?page=\${next}\`}
  onPageChange={setPage}
/>

{/* Real page loads — no handler at all, the href does the work */}
<Pagination page={page} pageCount={12} getHref={(next) => \`?page=\${next}\`} />

{/* A wider window either side of the current page */}
<Pagination page={page} pageCount={200} siblingCount={2} getHref={href} />

{/* The range logic is exported and pure, for a control of your own */}
paginationRange({ page: 6, pageCount: 20 });
// [1, "ellipsis", 5, 6, 7, "ellipsis", 20]`;

const story: Meta<PaginationProps> = {
  title: "Design Library/Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Pagination</Title>
          <Heading>Gallery</Heading>
          <PaginationGallery />
          <Heading>Usage</Heading>
          <Source code={usage} language="tsx" />
          <Heading>Example</Heading>
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

const PaginationExample = ({
  page: initial,
  onPageChange: _onPageChange,
  getHref: _getHref,
  ...args
}: PaginationProps) => {
  const [page, setPage] = useState<number>(initial);
  return (
    <Pagination
      {...args}
      page={page}
      onPageChange={setPage}
      getHref={galleryHref}
    />
  );
};

export const Example: StoryObj<PaginationProps> = {
  render: (args: PaginationProps) => <PaginationExample {...args} />,
};

Example.args = {
  page: 1,
  pageCount: 20,
  siblingCount: 1,
  "aria-label": "Pagination",
  previousLabel: "Previous page",
  nextLabel: "Next page",
};

Example.argTypes = {
  page: { control: "number", description: "The page the user is on, 1-based." },
  pageCount: { control: "number", description: "How many pages there are." },
  getHref: {
    control: false,
    description:
      "Where each page lives. A pure function, not a router — a real href is what makes middle-click and copy-link-address work.",
  },
  onPageChange: {
    control: false,
    description:
      "Runs on a plain left click, which is also prevented. Modified clicks are left to the browser.",
  },
  siblingCount: {
    control: "number",
    description: "Pages either side of the current one.",
    table: { defaultValue: { summary: "1" } },
  },
  "aria-label": {
    control: "text",
    table: { defaultValue: { summary: "Pagination" } },
  },
  previousLabel: {
    control: "text",
    table: { defaultValue: { summary: "Previous page" } },
  },
  nextLabel: {
    control: "text",
    table: { defaultValue: { summary: "Next page" } },
  },
  pageLabel: {
    control: false,
    description: 'Names a page link. Defaults to "Page {n}".',
  },
};

export default story;
