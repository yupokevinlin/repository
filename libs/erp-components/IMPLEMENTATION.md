# @org/erp-components — the queue

Seven composites. The design library's queue is complete, so every primitive
these need already exists.

Read `AGENTS.md` here first, then `libs/design-library/AGENTS.md` in full — the
rules are that document's, not a relaxed version of them.

---

## The order

Nothing here blocks anything else, so the order is by how much the rest lean on
it. `Panel` and `EmptyState` turn up inside the others.

- [ ] 7.1 `Panel` — a titled surface with optional actions and a footer. Built
      from `Card`; adds the header/body/footer shape the others sit inside.
      Takes `headingLevel` with no default, for the same reason `Accordion`
      does — only the page knows where it sits in the outline.
- [ ] 7.2 `EmptyState` — what a list shows when it has nothing. An icon, a line
      saying what is missing, and usually one action. Not a `<p>`: it needs the
      action slot, or every caller reinvents the spacing.
- [ ] 7.3 `StatTile` — one number and what it means, with an optional delta and
      trend. The delta's direction is **not** the same as its severity — a
      falling cost is good — so `direction` and `severity` are separate props.
- [ ] 7.4 `DescriptionList` — `<dl>` / `<dt>` / `<dd>`, term beside detail.
      Takes `density` (§4.2) and an `orientation`; both orientations are
      first-class, as in `Stepper`.
- [ ] 7.5 `Item` — one record in a list: leading media, a title, supporting
      lines, trailing actions. Where the whole row navigates, the stretched
      link pattern (§11.2) and its two consequences apply, as in `SidebarItem`.
- [ ] 7.6 `Table` — the large one. `<table>` semantics, `<caption>`, `<th
    scope>`, sortable headers carrying `aria-sort`, selection with a header
      checkbox that reflects the indeterminate state, and `density`. Columns
      are data carriers (§9.2), not children that render themselves. **Sorting,
      paging and selection state are all controlled** — they live in the URL or
      the query layer, never here. Read the APG's Grid and Table patterns and
      decide which one this is before writing any of it; they are not the same
      and the difference is whether cells take focus.
- [ ] 7.7 `Chart` — _needs a decision first_. Which charting library, or none.
      This is the only item here with an unanswered dependency, and it should
      not be started until that is settled. Everything else in this queue is
      hand-rolled from primitives; a chart is the one place that is probably
      the wrong call.

---

## Verification

Same four as the design library, plus the browser:

```bash
npx nx run erp-components:test
npx nx run erp-components:lint
npx nx run erp-components:typecheck
npx nx run erp-components:storybook   # port 5001
```

Visual regression runs across both packages:

```bash
npm run test:visual
```

---

## Progress

| Wave           | Items | Done |
| -------------- | ----- | ---- |
| 7 — composites | 7     | 0    |

The package is scaffolded and wired — nx targets, Storybook on 5001, Vitest,
lint, typecheck, and the design library's theme through its subpath export.
Nothing is built yet.
