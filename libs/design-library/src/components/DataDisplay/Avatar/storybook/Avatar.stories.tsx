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
  Avatar,
  type AvatarProps,
  avatarShapes,
  avatarSizes,
  avatarStatuses,
} from "../Avatar";
import { AvatarGallery } from "./AvatarGallery/AvatarGallery";

const usage = `{/* Initials only — the common case for counterparty contacts */}
<Avatar name="K. Lin" />

{/* With an image, sized up */}
<Avatar name="K. Lin" src={user.avatarUrl} size="10" />

{/* A company, and a presence dot that says what it means */}
<Avatar name="Kanto Polymer KK" shape="square" />
<Avatar name="K. Lin" status="online" statusLabel="Online" />`;

const story: Meta<AvatarProps> = {
  title: "Design Library/DataDisplay/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Avatar</Title>
          <Heading>Gallery</Heading>
          <AvatarGallery />
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

export const Example: StoryObj<AvatarProps> = {
  render: (args: AvatarProps) => <Avatar {...args} />,
};

Example.args = {
  name: "K. Lin",
  size: "10",
  shape: "circle",
};

Example.argTypes = {
  name: {
    control: "text",
    description:
      "Always required — it is the accessible name and the source of the initials fallback.",
  },
  src: {
    control: "text",
    description:
      "Image URL. When absent, initials from name are shown instead. The image gets an empty alt: name carries the meaning, so a screen reader never hears 'image'.",
  },
  size: {
    control: "select",
    options: avatarSizes,
    description: '"6" = 24px, "8" = 32px, "10" = 40px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(avatarSizes) },
      defaultValue: { summary: "8" },
    },
  },
  shape: {
    control: "select",
    options: avatarShapes,
    description: 'Use "square" for a company rather than a person.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(avatarShapes) },
      defaultValue: { summary: "circle" },
    },
  },
  status: {
    control: "select",
    options: avatarStatuses,
    description:
      "Presence, from its own token family — never the severity one, so a green dot here and a green Badge cannot be confused.",
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(avatarStatuses) },
    },
  },
  statusLabel: {
    control: "text",
    description:
      "What the status means, in words. A coloured dot is meaningless to a screen reader, and §15.2 forbids colour being the only carrier.",
  },
};

export default story;
