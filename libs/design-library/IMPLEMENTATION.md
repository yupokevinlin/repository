# Implementation plan — `libs/design-library`

**One component per work item. One work item per branch.**

This document says _what to build next and in what order_.
[`AGENTS.md`](./AGENTS.md) says _how to build it_. Read both before starting;
`AGENTS.md` is the contract and this file is the queue.

54 primitives, plus three that already exist and two to port. Nothing here may be
started before its prerequisites are green.

---

## How to pick up work

1. Take the **lowest-numbered unfinished item** in the queue below. The order is a
   dependency graph, not a preference — skipping ahead means building against
   something that does not exist yet.
2. Confirm every prerequisite listed on the item is merged.
3. Read `AGENTS.md` in full. Read the reference implementation at
   `src/components/Buttons/Button/`.
4. Build exactly that one component. Do not touch another component's files. If
   you find a bug in a neighbour, note it and keep going.
5. Run the checks in _Verification_ below. All must pass.
6. Tick the item here in the same commit.

### The tiers are not the build order

The Tier 1/2/3 grouping in the plan document was a way to talk about scope. It is
**not** a build sequence — `Tooltip` is Tier 1 but needs `Portal` and
`usePosition` from Tier 3, and `Label` is Tier 2 but blocks half the library. The
waves below are the real order.

### When to stop and ask

Stop and raise it rather than inventing an answer if you hit any of these:

- A prop you need is not in the §5 lexicon and no existing component names it
- A size value that is not on the §4 scale
- A sixth severity word
- A need for a runtime dependency of any kind
- A need for `cloneElement`, a new React context, or a second provider
- An APG requirement in §15 that cannot be met with the shape described here
- Anything in _Still undecided_ at the bottom of this file

Guessing at these is how a design system becomes inconsistent, and it is far
cheaper to ask than to unpick later.

---

## Wave 0 — foundations

**Nothing renders differently at the end of this wave, and everything after it
depends on the whole wave being done.** Do these strictly in order.

- [x] **0.1 Test infrastructure.** Add `@testing-library/react`,
      `@testing-library/user-event`, `@testing-library/jest-dom` and
      `@vitejs/plugin-react` at the workspace root. Create
      `libs/design-library/vite.config.ts` with the Vitest block — `jsdom`
      environment, globals on, setup file, `include: ["src/**/*.spec.{ts,tsx}"]`.
      Create `src/testing/setupTests.ts` importing
      `@testing-library/jest-dom/vitest` and registering `afterEach(cleanup)`.
      Register an nx `test` target on the project and an `npm test` script at the
      root. **Consider adding `vitest-axe`** — `@storybook/addon-a11y` is already
      a dependency, and this makes the same checks run in CI.

- [x] **0.2 Barrels.** Create `src/index.ts` — it does not exist, so the package's
      declared entry point (`main`, `types` and `exports` all point at it) does
      not resolve today. Export `cn`, the theme tokens, and every component as it
      lands. Fix `Buttons/Button/index.tsx` (currently empty — populate it and
      rename to `index.ts`) and `Inputs/TextInput/index.ts` (currently
      `export *` — make the re-exports explicit).

- [x] **0.3 Tokens.** In `src/css/`: - ~~Severity family for `warning`, `success` and `info`~~ — **already done.**
      All four families exist in `colors.ts` and are fully defined in both
      `themes/light.css` and `themes/dark.css`, 12 variables each. - Presence tokens — `--color-presence-online` / `-away` / `-offline`, kept
      separate from severity so a green dot and a green badge do not collide - Overlay tokens — scrim colour and opacity, a popover surface distinct from
      card surface, two elevation shadows, and a **z-index scale** (you are not
      getting the browser top layer, see 0.6) - Density spacing steps for `comfortable` and `compact` - A `tabular-nums` utility paired with the mono family - A `scrollbar` utility — `scrollbar-width` / `scrollbar-color` plus
      `::-webkit-scrollbar`. This replaces the `ScrollArea` component, which was
      deliberately cut.

- [x] **0.4 Focus ring.** Create `src/tailwind/focus/focusRing.ts` exporting the
      shared geometry, lifted from `ButtonStyles.ts`:
      `focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed`.
      Variant strings supply only the ring colour from then on. `ButtonStyles.ts`
      currently repeats this in its base array **and** in all fifteen
      `storybookStateStyles` entries — collapse those to the shared fragment.

- [x] **0.5 Storybook dark theme.** `.storybook/preview.ts` hardcodes
      `theme-light` in its decorator, so no gallery has ever proven dark. Replace
      with a `globalTypes` toolbar toggle. From here on every gallery must render
      in both.

- [x] **0.6 Port `Typography` and `Heading`.** Ported, not copied — the sibling
      repo's scale (`title-*`, `micro-*`, serif compound variants) does not
      exist here, so both are bound to this repo's `fontSizes.ts` instead.

      §11 gained a carve-out (§11.0): both take `as` as a **closed union** —
      `Typography` is `"span" | "p" | "div"` defaulting to `"span"`, `Heading`
      is `"h1"…"h6"` defaulting to `"h2"`. Not `ElementType`, so none of the
      typing or semantic escapes §11 prevents are reachable. Level and size stay
      independent props. The generics in the sibling implementation were
      dropped; each union's members share one prop surface.

- [x] **0.7 Backfill the three existing components.** Add `Button.spec.tsx`,
      `TextInput.spec.tsx` and `LoadingSpinner.spec.tsx` to the §18 standard, and
      give `LoadingSpinner` a real `size` prop — today `Button` sizes it by
      injecting `size-4` / `size-5` / `size-6` through a `spinnerSizeClass`
      record, which puts the spinner's scale in its consumer and violates §4.

**Gate:** `nx run design-library:test` passes, `src/index.ts` resolves, the
Storybook theme toggle works, and `Button`'s gallery renders in dark.

---

## Wave 1 — independent primitives

Nothing in this wave depends on anything but tokens. Good for parallel work, and
the first few prove the whole pipeline end to end.

**Start with `Badge`.** It exercises the severity scale, the size scale,
`data-slot`, a gallery matrix, `@example` blocks and a spec file, and depends on
nothing. It becomes the second reference implementation alongside `Button`.

- [x] 1.1 `Badge` — severity × appearance × size, plus `dot` and `max`. Absorbs
      what earlier drafts called `StatusChip`.
- [x] 1.2 `Tag` — removable; the remove affordance is a real `<button>` with an
      `aria-label` naming what it removes
- [x] 1.3 `Divider` — `role="separator"` when separating, `aria-hidden` when decorative
- [x] 1.4 `Kbd` — no platform detection; the consumer passes the keys
- [x] 1.5 `Skeleton` — `aria-hidden`, with `aria-busy` on the region it replaces
- [x] 1.6 `ProgressBar` — `role="progressbar"`, severity thresholds, indeterminate
- [x] 1.7 `Alert` — static, in-flow, **not** dismissible, **no** `role="alert"`
- [x] 1.8 `Card` — `<div>`, or `<button>` when `selectable` + `onClick`, which are
      required together at the type level. No `href`.
- [x] 1.9 `Avatar` — initials fallback; `status` uses presence tokens and its
      meaning is in the accessible name, never the dot alone
- [x] 1.10 `Collapsible` — the disclosure primitive; `Accordion` and `Sidebar`
      both build on it. Brought `useControllableState` in with it (§2.1).
- [x] 1.11 `Link` — `<a>` only, plus `appearance="button"` sharing `Button`'s cva

Then, each depending on one of the above:

- [x] 1.12 `AvatarGroup` — _needs 1.9_
- [x] 1.13 `IconButton` — _needs `Button`_; `aria-label` required at the type level
- [x] 1.14 `ButtonGroup` — _needs `Button`_; owns the border-collapse and radius maths

---

## Wave 2 — shared internals

These are not all components, but everything after this wave depends on them.
See §2.1 of `AGENTS.md` for the contract on each.

- [x] 2.1 `src/hooks/useControllableState/` — controlled when the prop is defined,
      uncontrolled otherwise. Used by ~22 components; without it that logic gets
      written 22 times. _Pulled forward — `Collapsible` (1.10) was the first
      stateful component and needed it._
- [x] 2.2 `Overlays/Portal/` — renders into `document.body`, SSR-safe. Explicit
      §2 exception: no styles file, no gallery. Still ships a spec and a barrel.
- [x] 2.3 `src/hooks/usePosition/` — anchor, flip on the main axis, match trigger
      width, accept fixed coordinates for a cursor menu. Deliberately does **not**
      do shift-to-fit, arrow positioning or nested scroll containers.
- [x] 2.4 `src/hooks/useFocusTrap/` — trap Tab, restore focus to the trigger
- [x] 2.5 `src/hooks/useScrollLock/` — body scroll lock while a modal is open
- [x] 2.6 `Forms/Label/`
- [x] 2.7 `Forms/HelperText/` — severity-styled hint and error text
- [x] 2.8 `Forms/Fieldset/` — `<fieldset>` + `<legend>`, group-level disabled
- [x] 2.9 `FieldShell` (internal, non-exported) — _needs 2.6, 2.7_. Renders the
      `label` / `hint` / `error` / `required` props for every control and wires
      `for`/`id`, `aria-describedby` and `aria-invalid`. Not public API, so no
      barrel, gallery or story. See §5.1.

**Gate:** `usePosition` has a spec proving flip behaviour, and `useFocusTrap` has
one proving focus returns to the trigger. These two are where hand-rolled overlay
code usually goes wrong, and everything downstream inherits their bugs.

---

## Wave 3 — form controls

All need `FieldShell` (2.9) and most need `useControllableState` (2.1). Each one
takes `label` / `hint` / `error` / `required` and renders its own `<label>`.

- [x] 3.1 `TextArea` — `resize` (`none`/`horizontal`/`vertical`/`both`, default
      `vertical`) and `autoResize`; when `autoResize` is on it forces the vertical
      axis off
- [x] 3.2 `NumberInput` — `type="text"` + `inputMode="decimal"`, value always a
      string, separators on blur and raw on focus. Never `type="number"`.
- [x] 3.3 `Checkbox` — the atom. Indeterminate is a real `aria-checked="mixed"`.
- [x] 3.4 `Radio` — the atom; standalone, not only inside a group
- [x] 3.5 `Switch` — `role="switch"`, not a checkbox
- [x] 3.6 `Toggle` — `aria-pressed`, not `aria-checked`
- [x] 3.7 `SearchInput` — no internal debounce; `onChange` fires immediately
- [x] 3.8 `FileDropzone` — a real `<input type="file">` must be reachable; drag is
      an enhancement, never the only route

Then the group wrappers, each rendering `<fieldset>` + `<legend>`:

- [x] 3.9 `CheckboxGroup` — _needs 3.3_; `role="group"`, array value
- [x] 3.10 `RadioGroup` — _needs 3.4_; roving tabindex, arrows move **and** select
- [x] 3.11 `ToggleGroup` — _needs 3.6_; `role="radiogroup"` when `type="single"`,
      `role="toolbar"` when `type="multiple"`

---

## Wave 4 — anchored overlays and the listbox family

All need `Portal` (2.2) and `usePosition` (2.3).

- [x] 4.1 `Tooltip` — opens on **focus** as well as hover; never interactive content
- [x] 4.2 `Popover` — non-modal dialog semantics; Esc closes, focus returns
- [x] 4.3 `src/hooks/useListbox/` (internal) — the shared keyboard contract for
      `Select` and `Combobox`: Down/Up, Alt+Down, Home/End, type-ahead,
      `aria-activedescendant`, and **DOM focus never entering the listbox**
- [x] 4.4 `Select` — _needs 4.3_. Custom trigger + portalled listbox, APG
      select-only combobox. `role="combobox"` on the trigger, `role="listbox"` /
      `option` in the popup. **Never `role="menu"`** — a menu is for commands, a
      listbox chooses a value.
- [x] 4.5 `Combobox` — _needs 4.3_. `Select` plus a text input and filtering.
- [x] 4.6 `MenuItem` / `MenuGroup` / `MenuSeparator` — the shared menu children
- [x] 4.7 `DropdownMenu` — _needs 4.6_. `role="menu"`, arrows, type-ahead, Esc.
- [x] 4.8 `ContextMenu` — _needs 4.6_. Same items, opened at cursor coordinates.
- [x] 4.9 `HoverCard` — must open on focus and dismiss on Esc. If it cannot be
      reached by keyboard it is a `Popover`, not a `HoverCard`.
- [x] 4.10 `Calendar` — native `Date` at local midnight; `Intl` for month and
      weekday names and week start. Grid keys: arrows by day, PageUp/Down by
      month, Home/End by week. Read §4.3 before writing any date maths.
- [x] 4.11 `DatePicker` — _needs 4.10, 4.2_
- [x] 4.12 `DateRangePicker` — _needs 4.10, 4.2_
- [x] 4.13 `MoneyInput` — _needs 4.4_. Amount + currency as one control, value a
      string. The invariant this exists to enforce is that a currency never
      travels apart from its amount.
- [x] 4.14 `QuantityInput` — _needs 4.4_. Same shape for quantity + UOM, with the
      frozen conversion factor shown in the hint.

---

## Wave 5 — modal overlays

All need `Portal` (2.2), `useFocusTrap` (2.4) and `useScrollLock` (2.5). All are
**controlled-only** — no `defaultOpen`.

- [x] 5.1 `Modal` — `aria-modal`, labelled by its heading, Esc closes, focus returns
- [x] 5.2 `ConfirmModal` — _needs 5.1's internals_. Not a variant of `Modal`.
      Cannot be dismissed by overlay click; `requireReason` blocks confirm until
      text is entered. Also the step-up re-auth shell.
- [x] 5.3 `Drawer` — side sheet; the non-modal variant does not trap focus
- [x] 5.4 `CommandPalette` — _needs 4.3_. Combobox semantics inside a modal dialog.
      The library owns the keyboard contract; the app owns the search.
- [x] 5.5 `Toast` + `ToastProvider` + `useToast` — imperative, not controlled. The
      **only** provider permitted in this package. `role="status"` / `aria-live`
      polite, `alert` / assertive for errors only.

---

## Wave 6 — navigation and structure

- [ ] 6.1 `Tabs` + `Tab` + `TabPanel` — `Tabs` is the strip only. `Tab` carries
      `value` / `label` / `count` and renders nothing. `TabPanel` is a **sibling**
      placed by the layout, wired by a shared `id`, so the layout decides what
      mounts. `aria-controls` is set only on the selected tab.
- [ ] 6.2 `Accordion` — _needs 1.10_. Header is a `<button>` inside a heading
      element. Takes a `headingLevel` prop — there is no `as`.
- [ ] 6.3 `Sidebar` + `SidebarGroup` + `SidebarItem` — _needs 1.10_.
      `<nav aria-label>` landmark, current item `aria-current="page"`. Links come
      in as children; full-row click uses the stretched-link pattern (§11.2).
      **Read shadcn's `Sidebar` first** — collapse, mobile behaviour, persistence
      and groups are all solved there and it maps almost exactly onto our shape.
- [ ] 6.4 `Breadcrumbs` + `Breadcrumb` — _needs 2.2, 2.3_. `<nav>` → `<ol>`, last
      crumb `aria-current="page"`. Collapses to "…" which opens a portalled
      **disclosure list of links** — not a `role="menu"`, because these are
      navigation, not commands.
- [ ] 6.5 `Pagination` — controlled-only; links not buttons, so middle-click works
- [ ] 6.6 `Resizable` + `ResizablePanel` + `ResizableHandle` — APG **Window
      Splitter**: `role="separator"`, `aria-valuenow` / `valuemin` / `valuemax`,
      `aria-controls`, arrows resize, Enter toggles collapse
- [ ] 6.7 `Timeline` + `TimelineItem` — `<ol>`; both timestamps (`event_at` and
      `recorded_at`) in the accessible name, not only visually
- [ ] 6.8 `Stepper` + `Step` — `<ol>`, `aria-current="step"`. **Both orientations
      are first-class**; `orientation` is required with no default. States:
      complete / current / upcoming / blocked / revisited.

---

## The work item

One component. One branch. A description that fits in a paragraph.

```
Title:  feat(design-library): Badge

Prereqs: Wave 0 complete

Deliverables
  src/components/DataDisplay/Badge/Badge.tsx
  src/components/DataDisplay/Badge/BadgeStyles.ts
  src/components/DataDisplay/Badge/Badge.spec.tsx
  src/components/DataDisplay/Badge/index.ts
  src/components/DataDisplay/Badge/storybook/Badge.stories.tsx
  src/components/DataDisplay/Badge/storybook/BadgeGallery/BadgeGallery.tsx
  export added to src/index.ts

Done when every box in AGENTS.md §3 is ticked.
```

Anything larger than one component is too large. If a component seems to need a
second one built alongside it, that is a dependency the queue got wrong — say so
rather than building both.

---

## Verification

Every item must pass all four before it is done:

```bash
npx nx run design-library:test        # after 0.1 exists
npx nx run design-library:lint
npx nx run design-library:storybook   # gallery renders, both themes
npx tsc -b libs/design-library
```

Plus, by eye in Storybook: the gallery in **light and dark**, every variant × size
× state cell populated, and keyboard-only operation of the whole component. §15
lists the keyboard contract to check against — an `aria-expanded` that never
changes passes an attribute assertion and still fails a user.

---

## Still undecided — do not guess

These are open at the project level. If an item runs into one, stop and ask.

| Question                                                                                                                                           | Blocks                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Which repo is authoritative** — this one or the North Pacific Materials copy, which has already diverged (it has `Typography` and a root barrel) | Everything. Settle before 0.1.                                                                                            |
| Whether `libs/erp-ui` gets created now for the seven composites (`Table`, `Item`, `DescriptionList`, `StatTile`, `EmptyState`, `Panel`, `Chart`)   | Nothing in this queue, but the composites have nowhere to live                                                            |
| Visual-regression tooling — Storybook test-runner snapshots, the Claude Design render check, or none                                               | Nothing blocks, but the longer it waits the more there is to baseline                                                     |
| Whether to vendor shadcn source for Tier 3 overlays                                                                                                | Largely answered by hand-rolling `usePosition` and `useFocusTrap` — but reading `Sidebar` before 6.3 is still recommended |

---

## Progress

| Wave                         | Items | Done |
| ---------------------------- | ----- | ---- |
| 0 — foundations              | 7     | 7    |
| 1 — independent primitives   | 14    | 14   |
| 2 — shared internals         | 9     | 9    |
| 3 — form controls            | 11    | 11   |
| 4 — anchored overlays        | 14    | 14   |
| 5 — modal overlays           | 5     | 0    |
| 6 — navigation and structure | 8     | 0    |

54 components, plus 3 backfilled and 2 ported.
