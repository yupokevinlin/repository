import {
  Controls,
  Heading,
  Markdown,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Portal, type PortalProps } from "../Portal";

const usage = `{/* An overlay escaping a clipping panel */}
{open && (
  <Portal>
    <div style={{ position: "fixed", top, left }}>{content}</div>
  </Portal>
)}

{/* Into a specific container — a modal that owns its own stacking */}
<Portal container={dialogElement}>{content}</Portal>

{/* Leaving it in place, when the consumer already controls stacking */}
<Portal disabled={renderInline}>{content}</Portal>`;

const notes = `Portal renders nothing of its own, so it has no styles file and no gallery — an explicit exception to the seven-file rule. What it does is move its children to document.body, which is the only way an overlay escapes an ancestor's overflow, transform or z-index.

The demo below renders two boxes from inside a panel with overflow: hidden. The inline one is clipped by the panel; the portalled one leaves the tree entirely and pins itself to the corner of the viewport.`;

const story: Meta<PortalProps> = {
  title: "Design Library/Overlays/Portal",
  component: Portal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Portal</Title>
          <Markdown>{notes}</Markdown>
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

/**
 * Both boxes are rendered from inside the clipping panel. Only the portalled
 * one gets out.
 */
export const Example: StoryObj<PortalProps> = {
  render: (args: PortalProps) => (
    <div className="relative h-[8rem] w-[20rem] overflow-hidden border border-border-default bg-bg-default p-4">
      <span className="text-body-sm text-fg-muted">
        {"This panel is overflow: hidden."}
      </span>
      <Portal {...args}>
        <div className="fixed right-4 bottom-4 z-50 rounded-md bg-bg-primary px-3 py-2 text-label-sm text-fg-primary">
          {"Portalled — pinned to the viewport corner"}
        </div>
      </Portal>
      <div className="absolute top-[6rem] left-[1rem] rounded-md bg-bg-active px-3 py-2 text-label-sm text-fg-default">
        {"Inline — clipped by the panel"}
      </div>
    </div>
  ),
};

Example.args = {
  disabled: false,
};

Example.argTypes = {
  children: {
    control: false,
    description: "What to render outside the normal tree.",
  },
  container: {
    control: false,
    description:
      "Where to render it. Defaults to document.body, which is what every overlay in the library wants.",
    table: { defaultValue: { summary: "document.body" } },
  },
  disabled: {
    control: "boolean",
    description:
      "Renders in place instead of portalling. Turn this on and the box above joins the clipped one.",
  },
};

export default story;
