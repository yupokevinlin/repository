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
  HelperText,
  helperTextDensities,
  type HelperTextProps,
  helperTextSeverities,
} from "../HelperText";
import { HelperTextGallery } from "./HelperTextGallery/HelperTextGallery";

const usage = `{/* A hint, wired to its field */}
<input id="rate" aria-describedby="rate-hint" />
<HelperText id="rate-hint">Mid-market rate at 16:00 UTC.</HelperText>

{/* A validation error that appears after the fact */}
<input id="qty" aria-describedby="qty-error" aria-invalid />
<HelperText id="qty-error" severity="error" live>
  Quantity exceeds the remaining allocation.
</HelperText>

{/* Tightened, in a filter bar */}
<HelperText density="compact">Applies to open deals only.</HelperText>

{/* Inside a full field you do not need this at all — the control owns it */}
<TextInput label="Rate" hint="Mid-market rate at 16:00 UTC." />`;

const story: Meta<HelperTextProps> = {
  title: "Design Library/Forms/HelperText",
  component: HelperText,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>HelperText</Title>
          <Heading>Gallery</Heading>
          <HelperTextGallery />
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

export const Example: StoryObj<HelperTextProps> = {
  render: (args: HelperTextProps) => (
    <div className="w-[24rem]">
      <HelperText {...args} />
    </div>
  ),
};

Example.args = {
  children: "Mid-market rate at 16:00 UTC.",
  severity: "neutral",
  density: "comfortable",
  live: false,
};

Example.argTypes = {
  children: {
    control: "text",
    description: "The hint or the problem, in words.",
  },
  severity: {
    control: "inline-radio",
    options: helperTextSeverities,
    description:
      "Only three of the five §4.1 values: info and success under a field read as decoration rather than as something to act on. warning and error each draw an icon, so the distinction is never carried by colour alone.",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(helperTextSeverities),
      },
      defaultValue: { summary: "neutral" },
    },
  },
  density: {
    control: "inline-radio",
    options: helperTextDensities,
    description:
      "Tightens the type step. Never changes the control's height (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(helperTextDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  live: {
    control: "boolean",
    description:
      "Announces changes as they happen, politely. Turn on for validation that appears after the user has moved on; leave off for a hint that was there all along.",
  },
};

export default story;
