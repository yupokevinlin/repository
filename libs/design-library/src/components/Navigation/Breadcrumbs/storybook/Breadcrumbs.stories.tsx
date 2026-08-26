import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import {
  Breadcrumbs,
  breadcrumbsDensities,
  type BreadcrumbsProps,
} from "../Breadcrumbs";
import {
  BreadcrumbsGallery,
  galleryTrail,
} from "./BreadcrumbsGallery/BreadcrumbsGallery";

const usage = `{/* Links are the consumer's — this package never imports a router */}
<Breadcrumbs>
  <Breadcrumb>
    <NextLink href="/app/deals">Deals</NextLink>
  </Breadcrumb>
  <Breadcrumb>
    <NextLink href="/app/deals/NPM-2601">NPM-2601</NextLink>
  </Breadcrumb>
  <Breadcrumb>Shipment</Breadcrumb>
</Breadcrumbs>

{/* Collapsing a long trail — the first and the last always stay */}
<Breadcrumbs maxItems={3}>{crumbs}</Breadcrumbs>

{/* A different separator */}
<Breadcrumbs separator="›">{crumbs}</Breadcrumbs>

{/* Where the trail ends somewhere other than the end */}
<Breadcrumb current>Deals</Breadcrumb>`;

const story: Meta<BreadcrumbsProps> = {
  title: "Design Library/Navigation/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Breadcrumbs</Title>
          <Heading>Gallery</Heading>
          <BreadcrumbsGallery />
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

export const Example: StoryObj<BreadcrumbsProps> = {
  render: ({ children: _children, ...args }: BreadcrumbsProps) => (
    <div className="h-[12rem]">
      <Breadcrumbs {...args}>{galleryTrail}</Breadcrumbs>
    </div>
  ),
};

Example.args = {
  maxItems: 3,
  separator: "/",
  "aria-label": "Breadcrumb",
  collapseLabel: "Show the rest of the trail",
  density: "comfortable",
};

Example.argTypes = {
  children: {
    control: false,
    description: "Breadcrumb elements, from the root of the trail to here.",
  },
  maxItems: {
    control: "number",
    description:
      "How many crumbs to show before the middle collapses behind a …. The first and the last always stay.",
  },
  separator: { control: "text", table: { defaultValue: { summary: "/" } } },
  "aria-label": {
    control: "text",
    table: { defaultValue: { summary: "Breadcrumb" } },
  },
  collapseLabel: {
    control: "text",
    description: "Names the … button.",
    table: { defaultValue: { summary: "Show the rest of the trail" } },
  },
  density: {
    control: "inline-radio",
    options: breadcrumbsDensities,
    description: "The spacing between crumbs (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(breadcrumbsDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
};

export default story;
