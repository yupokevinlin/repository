import {
  Controls,
  Heading,
  Primary,
  Source,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";

import { Button } from "../../../Buttons/Button";
import { Kbd } from "../../../DataDisplay/Kbd";
import {
  CommandPalette,
  type CommandPaletteItem,
  type CommandPaletteProps,
} from "../CommandPalette";
import {
  CommandPaletteGallery,
  galleryCommands,
} from "./CommandPaletteGallery/CommandPaletteGallery";

const usage = `{/* The app searches; the palette renders and handles the keyboard */}
const [query, setQuery] = useState("");
const items = useMemo(() => search(commands, query), [query]);

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  query={query}
  onQueryChange={setQuery}
  items={items}
  onSelect={run}
  label="Commands"
  placeholder="Search commands"
/>

{/* Items are data carriers — grouped in the order the groups first appear */}
const commands = [
  { value: "deal.new", label: "New deal", group: "Deals", shortcut: ["Ctrl", "N"] },
  { value: "deal.find", label: "Find a deal", group: "Deals" },
  { value: "party.new", label: "New counterparty", group: "Counterparties" },
];

{/* Ctrl-K belongs to the app, not to the palette */}
useEffect(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setOpen(true);
    }
  };
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}, []);`;

const story: Meta<CommandPaletteProps> = {
  title: "Design Library/Overlays/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>CommandPalette</Title>
          <Heading>Gallery</Heading>
          <CommandPaletteGallery />
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

const CommandPaletteExample = ({
  open: _open,
  onOpenChange: _onOpenChange,
  query: _query,
  onQueryChange: _onQueryChange,
  items: _items,
  ...args
}: CommandPaletteProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const items: Array<CommandPaletteItem> = useMemo(() => {
    const needle: string = query.toLowerCase();
    return galleryCommands.filter((command: CommandPaletteItem) =>
      command.label.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {"Open palette"}
      </Button>
      <CommandPalette
        {...args}
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        items={items}
      />
    </>
  );
};

export const Example: StoryObj<CommandPaletteProps> = {
  render: (args: CommandPaletteProps) => <CommandPaletteExample {...args} />,
};

Example.args = {
  label: "Commands",
  placeholder: "Search commands",
  loading: false,
  onSelect: () => undefined,
  footer: (
    <>
      <Kbd keys={["↑", "↓"]} size="5" />
      <span>{"to move"}</span>
      <Kbd keys={["Enter"]} size="5" />
      <span>{"to run"}</span>
    </>
  ),
};

Example.argTypes = {
  open: {
    control: false,
    description: "Controlled — the app owns the Ctrl-K that opens it.",
  },
  onOpenChange: { control: false },
  query: {
    control: false,
    description: "Controlled by the app, because the app is what searches.",
  },
  onQueryChange: { control: false },
  items: {
    control: false,
    description:
      "The results, already filtered and ordered by the app. The palette never filters.",
  },
  onSelect: { control: false },
  label: {
    control: "text",
    description: "Names both the dialog and its input. Required.",
  },
  placeholder: {
    control: "text",
    description: "Hint text in the empty input.",
  },
  emptyMessage: {
    control: "text",
    description: "Shown when items is empty.",
    table: { defaultValue: { summary: "No results" } },
  },
  loading: {
    control: "boolean",
    description: "Shows a spinner in the input row while the app is fetching.",
  },
  footer: { control: false, description: "A hint row along the bottom." },
};

export default story;
