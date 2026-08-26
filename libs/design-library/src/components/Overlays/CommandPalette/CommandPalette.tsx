import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useId, useMemo, useRef } from "react";

import { useFocusTrap } from "../../../hooks/useFocusTrap";
import type { ListboxOption } from "../../../hooks/useListbox";
import { useListbox } from "../../../hooks/useListbox";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { Kbd } from "../../DataDisplay/Kbd";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import { Portal } from "../Portal";
import { CommandPaletteStyles } from "./commandPaletteStyles";

export interface CommandPaletteItem {
  /** Reported to `onSelect`. */
  value: string;
  /** What the command is called. */
  label: string;
  /** A second line — where it goes, or what it does. */
  description?: string;
  /**
   * Heading this command sits under. Items are grouped in the order the
   * groups first appear, so the caller controls the order by ordering the
   * array. Omit it and the item sits above the first group.
   */
  group?: string;
  /**
   * The keys that also run it, in press order — passed straight to `Kbd`, so
   * `["⌘", "K"]` or `["Ctrl", "K"]` is the app's decision, not a per-render
   * platform check.
   */
  shortcut?: Array<string>;
  /** Sized to the row. */
  icon?: ReactNode;
  /** Visible but not choosable — a command the user lacks the rights for. */
  disabled?: boolean;
}

export interface CommandPaletteProps {
  /** Controlled only. The app owns the Ctrl-K that opens it. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * The search text. Controlled by the app, because the app is what searches:
   * this component never filters `items` itself.
   */
  query: string;
  onQueryChange: (query: string) => void;
  /** The results, already filtered and ordered by the app. */
  items: Array<CommandPaletteItem>;
  /** Runs with the chosen item's `value`. The palette closes itself first. */
  onSelect: (value: string) => void;
  /** Names both the dialog and its input. Required — see `Popover`. */
  label: string;
  /** Hint text in the empty input. */
  placeholder?: string;
  /** Shown when `items` is empty. Defaults to `"No results"`. */
  emptyMessage?: ReactNode;
  /** Shows a spinner in the input row while the app is fetching. */
  loading?: boolean;
  /** A hint row along the bottom — usually key hints. */
  footer?: ReactNode;
  className?: string;
}

const searchIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-4 shrink-0 text-fg-muted"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

interface RenderedGroup {
  label: string | undefined;
  items: Array<{ item: CommandPaletteItem; index: number }>;
}

/**
 * Groups adjacent items by `group`, keeping the caller's order and the flat
 * index each item has in `items` — the index is what the keyboard contract
 * counts in, so it must survive the grouping.
 */
const groupItems = (items: Array<CommandPaletteItem>): Array<RenderedGroup> => {
  const groups: Array<RenderedGroup> = [];
  items.forEach((item: CommandPaletteItem, index: number) => {
    const last: RenderedGroup | undefined = groups[groups.length - 1];
    if (last !== undefined && last.label === item.group) {
      last.items.push({ item, index });
      return;
    }
    groups.push({ label: item.group, items: [{ item, index }] });
  });
  return groups;
};

/**
 * The Ctrl-K palette: a search field over a list of commands, in a dialog.
 *
 * **The library owns the keyboard contract; the app owns the search.** This
 * component never filters — it renders exactly the `items` handed to it, in
 * the order given. That is what lets the same palette sit over a fuzzy matcher,
 * a server query, or a recent-items list without any of that leaking in here.
 *
 * It is a combobox inside a modal dialog, which is the shape the APG gives
 * this pattern: the input keeps DOM focus and publishes the highlighted
 * command through `aria-activedescendant`, so Down and Up move a highlight
 * while the user keeps typing. Focus never enters the list.
 *
 * Typing resets the highlight to the top of the new results — the command
 * under the highlight must be the one the user is looking at, not whatever
 * happened to be at that index before the list changed.
 *
 * @client
 *
 * @example Over an app-side matcher
 * ```tsx
 * const [query, setQuery] = useState("");
 * const items = useMemo(() => search(commands, query), [query]);
 *
 * <CommandPalette
 *   open={open}
 *   onOpenChange={setOpen}
 *   query={query}
 *   onQueryChange={setQuery}
 *   items={items}
 *   onSelect={run}
 *   label="Commands"
 *   placeholder="Search commands"
 * />
 * ```
 *
 * @example Grouped, with shortcuts
 * ```tsx
 * const items = [
 *   { value: "deal.new", label: "New deal", group: "Deals", shortcut: ["Ctrl", "N"] },
 *   { value: "deal.find", label: "Find a deal", group: "Deals" },
 *   { value: "party.new", label: "New counterparty", group: "Counterparties" },
 * ];
 * ```
 */
export const CommandPalette = ({
  open,
  onOpenChange,
  query,
  onQueryChange,
  items,
  onSelect,
  label,
  placeholder,
  emptyMessage,
  loading,
  footer,
  className,
}: CommandPaletteProps) => {
  const listboxId: string = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const { containerRef } = useFocusTrap<HTMLDivElement>({
    active: open,
    initialFocusRef: inputRef,
  });

  useScrollLock(open);

  const options: Array<ListboxOption> = useMemo(
    () =>
      items.map((item: CommandPaletteItem) => ({
        value: item.value,
        label: item.label,
        disabled: item.disabled,
      })),
    [items],
  );

  const listbox = useListbox({
    options,
    // Nothing stays chosen in a palette: it runs a command and closes.
    value: "",
    onValueChange: onSelect,
    open,
    onOpenChange,
    idPrefix: listboxId,
    // Off: letters belong in the input, not to a jump-to-option search.
    typeAhead: false,
  });

  const { activeIndex, setActiveIndex } = listbox;

  // Keep the highlighted command in view when the arrows walk past the edge of
  // the scroll box. Reading the DOM rather than measuring here is deliberate —
  // the row heights vary with the description line.
  useEffect(() => {
    if (!open || activeIndex < 0) {
      return;
    }
    document
      .getElementById(listbox.optionId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, listbox]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const groups: Array<RenderedGroup> = useMemo(
    () => groupItems(items),
    [items],
  );

  if (!open) {
    return null;
  }

  const highlighted: number = activeIndex < items.length ? activeIndex : -1;

  return (
    <Portal>
      {/* Presentational, as on Modal: a pointer shortcut for Escape. */}
      <div
        data-slot="command-palette-scrim"
        role="presentation"
        className={CommandPaletteStyles.scrimStyle()}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onOpenChange(false);
          }
        }}
      >
        <div
          data-slot="command-palette"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          ref={containerRef}
          className={cn(CommandPaletteStyles.panelStyle(), className)}
        >
          <div
            data-slot="command-palette-input-row"
            className={CommandPaletteStyles.inputRowStyle()}
          >
            {searchIcon}
            <input
              data-slot="command-palette-input"
              type="text"
              role="combobox"
              aria-expanded
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                highlighted === -1 ? undefined : listbox.optionId(highlighted)
              }
              aria-label={label}
              autoComplete="off"
              placeholder={placeholder}
              value={query}
              ref={inputRef}
              className={CommandPaletteStyles.inputStyle()}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onQueryChange(event.target.value);
                // Clearing the highlight rather than setting it to 0 hands the
                // choice back to useListbox, which lands on the first option
                // that is not disabled once the new results have rendered.
                setActiveIndex(-1);
              }}
              onKeyDown={listbox.onKeyDown}
            />
            {loading === true && <LoadingSpinner size="4" />}
          </div>

          <div
            data-slot="command-palette-list"
            id={listboxId}
            role="listbox"
            aria-label={label}
            className={CommandPaletteStyles.listStyle()}
          >
            {items.length === 0 ? (
              <div
                data-slot="command-palette-empty"
                role="presentation"
                className={CommandPaletteStyles.emptyStyle()}
              >
                {emptyMessage ?? "No results"}
              </div>
            ) : (
              groups.map((group: RenderedGroup) => (
                <div
                  key={group.label ?? " ungrouped"}
                  data-slot="command-palette-group"
                  role="group"
                  aria-label={group.label}
                >
                  {group.label !== undefined && (
                    <div
                      data-slot="command-palette-group-label"
                      role="presentation"
                      className={CommandPaletteStyles.groupLabelStyle()}
                    >
                      {group.label}
                    </div>
                  )}
                  {group.items.map(
                    ({
                      item,
                      index,
                    }: {
                      item: CommandPaletteItem;
                      index: number;
                    }) => (
                      <div
                        key={item.value}
                        id={listbox.optionId(index)}
                        data-slot="command-palette-option"
                        role="option"
                        aria-selected={index === highlighted}
                        aria-disabled={
                          item.disabled === true ? true : undefined
                        }
                        className={CommandPaletteStyles.optionStyle({
                          active: index === highlighted,
                          disabled: item.disabled === true,
                        })}
                        onPointerEnter={() => {
                          setActiveIndex(index);
                        }}
                        onPointerDown={(event) => {
                          // Pointerdown rather than click, so the input never
                          // loses focus on the way to running the command.
                          event.preventDefault();
                          listbox.select(index);
                        }}
                      >
                        {item.icon !== undefined && (
                          <span
                            data-slot="command-palette-option-icon"
                            aria-hidden="true"
                            className="flex size-4 shrink-0 items-center justify-center"
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{item.label}</span>
                          {item.description !== undefined && (
                            <span className="block truncate text-micro-lg text-fg-muted">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {item.shortcut !== undefined && (
                          <Kbd keys={item.shortcut} size="5" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              ))
            )}
          </div>

          {footer !== undefined && (
            <div
              data-slot="command-palette-footer"
              className={CommandPaletteStyles.footerStyle()}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};
