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
  SearchInput,
  searchInputDensities,
  type SearchInputProps,
  searchInputSizes,
} from "../SearchInput";
import { SearchInputGallery } from "./SearchInputGallery/SearchInputGallery";

const usage = `{/* Filtering a table. Debouncing is the caller's, not the input's */}
const [query, setQuery] = useState("");
const debounced = useDebounced(query, 300);

<SearchInput label="Search deals" value={query} onValueChange={setQuery} />

{/* In a toolbar, with no visible label */}
<SearchInput aria-label="Search deals" size="8" density="compact" />

{/* In another language */}
<SearchInput label="Rechercher" clearLabel="Effacer la recherche" />`;

const story: Meta<SearchInputProps> = {
  title: "Design Library/Inputs/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>SearchInput</Title>
          <Heading>Gallery</Heading>
          <SearchInputGallery />
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

export const Example: StoryObj<SearchInputProps> = {
  render: (args: SearchInputProps) => (
    <div className="w-[24rem]">
      <SearchInput {...args} />
    </div>
  ),
};

Example.args = {
  label: "Search deals",
  defaultValue: "Kanto Polymer",
  size: "10",
  density: "comfortable",
  disabled: false,
};

Example.argTypes = {
  label: { control: "text", description: "The field's name." },
  value: { control: "text", description: "Controlled value." },
  onValueChange: {
    description:
      "Fires immediately on every keystroke. There is no internal debounce — a local filter over 20 rows wants none and a server round trip wants 300ms, and a component that decided for both would be wrong for one of them.",
  },
  clearLabel: {
    control: "text",
    description: "The clear button's accessible name.",
    table: { defaultValue: { summary: "Clear search" } },
  },
  hint: { control: "text", description: "Helper text." },
  error: {
    control: "text",
    description: "Its presence is what makes the field invalid.",
  },
  size: {
    control: "inline-radio",
    options: searchInputSizes,
    description: 'Height. "8" = 32px, "10" = 40px, "12" = 48px.',
    table: {
      type: { summary: StorybookUtils.getTypesSummaryString(searchInputSizes) },
      defaultValue: { summary: "10" },
    },
  },
  density: {
    control: "inline-radio",
    options: searchInputDensities,
    description: "Tightens label and helper spacing (§4.2).",
    table: {
      type: {
        summary: StorybookUtils.getTypesSummaryString(searchInputDensities),
      },
      defaultValue: { summary: "comfortable" },
    },
  },
  disabled: { control: "boolean", description: "Standard native disabled." },
};

export default story;
