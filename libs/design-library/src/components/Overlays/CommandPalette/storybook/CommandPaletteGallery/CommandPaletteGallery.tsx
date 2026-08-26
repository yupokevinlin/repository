import { useMemo, useState } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Kbd } from "../../../../DataDisplay/Kbd";
import { CommandPalette, type CommandPaletteItem } from "../../CommandPalette";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[16rem]";

export const galleryCommands: Array<CommandPaletteItem> = [
  {
    value: "deal.new",
    label: "New deal",
    group: "Deals",
    shortcut: ["Ctrl", "N"],
  },
  {
    value: "deal.find",
    label: "Find a deal",
    group: "Deals",
    description: "Search by number, counterparty or product",
  },
  { value: "deal.import", label: "Import deals from CSV", group: "Deals" },
  {
    value: "party.new",
    label: "New counterparty",
    group: "Counterparties",
  },
  {
    value: "party.credit",
    label: "Review credit limits",
    group: "Counterparties",
    description: "Requires the credit role",
    disabled: true,
  },
  { value: "report.pnl", label: "Profit and loss", group: "Reports" },
  { value: "report.aging", label: "Aged receivables", group: "Reports" },
];

const PaletteDemo = ({
  triggerLabel,
  loading,
  withFooter,
  emptyOnly,
}: {
  triggerLabel: string;
  loading?: boolean;
  withFooter?: boolean;
  emptyOnly?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const items: Array<CommandPaletteItem> = useMemo(() => {
    if (emptyOnly === true) {
      return [];
    }
    const needle: string = query.toLowerCase();
    return galleryCommands.filter((command: CommandPaletteItem) =>
      command.label.toLowerCase().includes(needle),
    );
  }, [query, emptyOnly]);

  return (
    <>
      <Button
        size="8"
        variant="default-outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        items={items}
        onSelect={() => {
          setOpen(false);
        }}
        label="Commands"
        placeholder="Search commands"
        loading={loading}
        footer={
          withFooter === true ? (
            <>
              <Kbd keys={["↑", "↓"]} size="5" />
              <span>{"to move"}</span>
              <Kbd keys={["Enter"]} size="5" />
              <span>{"to run"}</span>
            </>
          ) : undefined
        }
      />
    </>
  );
};

export const CommandPaletteGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="states — open one to see it">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"state"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"trigger"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"grouped"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <PaletteDemo triggerLabel="Open palette" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"with a footer"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <PaletteDemo withFooter triggerLabel="With key hints" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"loading"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <PaletteDemo loading triggerLabel="Fetching" />
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"empty"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <PaletteDemo emptyOnly triggerLabel="No results" />
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
