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
  FileDropzone,
  fileDropzoneDensities,
  type FileDropzoneProps,
} from "../FileDropzone";
import { FileDropzoneGallery } from "./FileDropzoneGallery/FileDropzoneGallery";

const usage = `{/* Attaching documents to a deal */}
<FileDropzone label="Documents" multiple onFilesSelected={upload}>
  Drop files here, or press Enter to browse
</FileDropzone>

{/* One PDF only, with the restriction stated */}
<FileDropzone
  label="Signed contract"
  accept="application/pdf"
  hint="PDF, up to 10 MB."
  onFilesSelected={([file]) => attach(file)}
/>

{/* Rejected, with the reason */}
<FileDropzone label="Documents" error="That file is larger than 10 MB." />`;

const story: Meta<FileDropzoneProps> = {
  title: "Design Library/Inputs/FileDropzone",
  component: FileDropzone,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>FileDropzone</Title>
          <Heading>Gallery</Heading>
          <FileDropzoneGallery />
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

export const Example: StoryObj<FileDropzoneProps> = {
  render: (args: FileDropzoneProps) => (
    <div className="w-[28rem]">
      <FileDropzone {...args} />
    </div>
  ),
};

Example.args = {
  label: "Documents",
  children: "Drop files here, or press Enter to browse",
  multiple: true,
  density: "comfortable",
  required: false,
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  children: {
    control: "text",
    description: "The call to action inside the zone.",
  },
  onFilesSelected: {
    description:
      "Fires with whatever was chosen, by drop or by dialog, as an array rather than a FileList. Nothing is kept — the component holds no selection.",
  },
  hint: { control: "text", description: "Helper text below the zone." },
  error: {
    control: "text",
    description: "Its presence is what makes the zone invalid.",
  },
  required: { control: "boolean", description: "Renders the marker." },
  density: {
    control: "inline-radio",
    options: fileDropzoneDensities,
    description: "Tightens the zone's padding (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(fileDropzoneDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
