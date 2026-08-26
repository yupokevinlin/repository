import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { StorybookUtils } from "../../../../storybook/utils/StorybookUtils/StorybookUtils";
import { Avatar } from "../../Avatar";
import { avatarShapes, avatarSizes } from "../../Avatar/Avatar";
import { AvatarGroup, type AvatarGroupProps } from "../AvatarGroup";
import { AvatarGroupGallery } from "./AvatarGroupGallery/AvatarGroupGallery";

const usage = `{/* Everyone on the deal */}
<AvatarGroup>
  <Avatar name="K. Lin" />
  <Avatar name="M. Sato" />
  <Avatar name="R. Okafor" />
</AvatarGroup>

{/* Capped — the rest become "+N" */}
<AvatarGroup max={3} size="10">
  {members.map((member) => (
    <Avatar key={member.id} name={member.name} src={member.avatarUrl} />
  ))}
</AvatarGroup>

{/* The count, in another language */}
<AvatarGroup max={3} overflowLabel={(count) => \`\${count} de plus\`}>
  {avatars}
</AvatarGroup>`;

const story: Meta<AvatarGroupProps> = {
  title: "Design Library/Data Display/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>AvatarGroup</Title>
          <Heading>Gallery</Heading>
          <AvatarGroupGallery />
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

export const Example: StoryObj<AvatarGroupProps> = {
  render: (args: AvatarGroupProps) => (
    <AvatarGroup {...args}>
      {[
        <Avatar key="lin" name="K. Lin" />,
        <Avatar key="sato" name="M. Sato" />,
        <Avatar key="okafor" name="R. Okafor" />,
        <Avatar key="dubois" name="C. Dubois" />,
        <Avatar key="reyes" name="A. Reyes" />,
      ]}
    </AvatarGroup>
  ),
};

Example.args = {
  max: 3,
  size: "8",
  shape: "circle",
};

Example.argTypes = {
  children: {
    control: false,
    description:
      "Avatar elements. They render themselves — this only lays them out. A fragment wrapping them counts as one child, so pass them directly or as an array.",
  },
  max: {
    control: { type: "number", min: 1 },
    description:
      "How many to show before the rest collapse into a +N bubble. Omit to show all of them.",
  },
  size: {
    control: "select",
    options: avatarSizes,
    description:
      "Applied to every avatar, overriding any size they set themselves — a group of mismatched faces is not a group.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(avatarSizes) },
      defaultValue: { summary: "8" },
    },
  },
  shape: {
    control: "select",
    options: avatarShapes,
    description: "Likewise applied to every avatar.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(avatarShapes) },
      defaultValue: { summary: "circle" },
    },
  },
  overflowLabel: {
    control: false,
    description:
      "What the +N bubble means, in words. A function rather than a string so the count can sit wherever the language needs it.",
    table: {
      defaultValue: { summary: "(count) => count + ' more'" },
    },
  },
};

export default story;
