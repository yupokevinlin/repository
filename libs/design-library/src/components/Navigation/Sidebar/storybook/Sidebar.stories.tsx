import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Sidebar, sidebarDensities, type SidebarProps } from "../Sidebar";
import { SidebarDemo, SidebarGallery } from "./SidebarGallery/SidebarGallery";

const usage = `{/* Links are the consumer's — this package never imports a router */}
<Sidebar aria-label="Main" collapsed={collapsed} onCollapsedChange={setCollapsed}>
  <SidebarGroup label="Trading">
    <SidebarItem icon={<DealIcon />} current>
      <NextLink href="/app/deals">Deals</NextLink>
    </SidebarItem>
    <SidebarItem icon={<PartyIcon />} trailing={<Badge severity="error">3</Badge>}>
      <NextLink href="/app/approvals">Approvals</NextLink>
    </SidebarItem>
  </SidebarGroup>
</Sidebar>

{/* Ungrouped, with a header and footer */}
<Sidebar aria-label="Main" header={<Logo />} footer={<UserMenu />}>
  <SidebarItem icon={<HomeIcon />}>
    <NextLink href="/app">Overview</NextLink>
  </SidebarItem>
</Sidebar>

{/* On a small screen, inside a Drawer rather than a second mode built in */}
<Drawer open={open} onOpenChange={setOpen} title="Menu" side="left">
  <Sidebar aria-label="Main">…</Sidebar>
</Drawer>

{/* Persistence is the app's: collapsed is an ordinary controlled prop */}
const [collapsed, setCollapsed] = useState(readCookie("sidebar") === "collapsed");`;

const story: Meta<SidebarProps> = {
  title: "Design Library/Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Sidebar</Title>
          <Heading>Gallery</Heading>
          <SidebarGallery />
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

export const Example: StoryObj<SidebarProps> = {
  render: (args: SidebarProps) => (
    <SidebarDemo collapsed={args.collapsed} density={args.density} />
  ),
};

Example.args = {
  "aria-label": "Main",
  collapsed: false,
  density: "comfortable",
};

Example.argTypes = {
  "aria-label": {
    control: "text",
    description:
      "Names the landmark. Required — a page can hold more than one <nav>.",
  },
  children: {
    control: false,
    description: "SidebarGroup and SidebarItem elements, in order.",
  },
  collapsed: {
    control: "boolean",
    description:
      "Narrowed to a rail of icons. Labels are clipped, not removed, so the rail stays navigable by screen reader.",
    table: { defaultValue: { summary: "false" } },
  },
  defaultCollapsed: {
    control: false,
    description: "Collapsed on first render when uncontrolled.",
  },
  onCollapsedChange: { control: false },
  density: {
    control: "inline-radio",
    options: sidebarDensities,
    description: "Row height and the spacing between rows (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(sidebarDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  header: { control: false, description: "A logo, a workspace switcher." },
  footer: { control: false, description: "A user menu, a version string." },
};

export default story;
