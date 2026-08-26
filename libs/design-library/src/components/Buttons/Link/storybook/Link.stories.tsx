import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { buttonSizes, buttonVariants } from "../../Button/Button";
import { Link, linkAppearances, type LinkProps } from "../Link";
import { LinkGallery } from "./LinkGallery/LinkGallery";

const usage = `{/* In a sentence — underlined, because colour alone is not enough */}
<Typography as="p">
  See the <Link href="/app/deals/1042">deal record</Link> for terms.
</Typography>

{/* On its own line */}
<Link href="/app/deals" appearance="standalone">All deals</Link>

{/* Leaving the app — new tab, severed opener, and it says so */}
<Link href="https://www.bankofcanada.ca/rates/" external>
  Bank of Canada rates
</Link>

{/* A call to action: looks like a button, is still a link */}
<Link href="/app/deals/new" appearance="button" variant="primary-solid">
  New deal
</Link>`;

const story: Meta<LinkProps> = {
  title: "Design Library/Buttons/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Link</Title>
          <Heading>Gallery</Heading>
          <LinkGallery />
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

export const Example: StoryObj<LinkProps> = {
  render: (args: LinkProps) => <Link {...args} />,
};

Example.args = {
  href: "/app/deals",
  children: "All deals",
  appearance: "inline",
  external: false,
  disabled: false,
};

Example.argTypes = {
  href: {
    control: "text",
    description:
      "Where it goes. Required — an anchor without an href is not focusable and does not respond to Enter.",
  },
  children: {
    control: "text",
    description: "The link text.",
  },
  appearance: {
    control: "select",
    options: linkAppearances,
    description:
      '"inline" is always underlined, for links inside a sentence. "standalone" underlines on hover only. "button" borrows Button\'s own styles — it changes how the link looks and nothing about what it is.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(linkAppearances) },
      defaultValue: { summary: "inline" },
    },
  },
  variant: {
    control: "select",
    options: buttonVariants,
    description:
      'Only with appearance="button". Shares Button\'s variant list exactly.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(buttonVariants) },
      defaultValue: { summary: "primary-solid" },
    },
  },
  size: {
    control: "select",
    options: buttonSizes,
    description: 'Only with appearance="button".',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(buttonSizes) },
      defaultValue: { summary: "10" },
    },
  },
  external: {
    control: "boolean",
    description:
      'Opens in a new tab with rel="noopener noreferrer", and adds an outbound arrow.',
  },
  externalLabel: {
    control: "text",
    description:
      "What external means in words. The arrow is decorative and says nothing to a screen reader.",
    table: { defaultValue: { summary: "(opens in a new tab)" } },
  },
  disabled: {
    control: "boolean",
    description:
      "Drops the href — which is what actually removes it from the tab order — and sets aria-disabled, since an anchor has no native disabled state.",
  },
};

export default story;
