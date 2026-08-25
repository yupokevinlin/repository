# Building components in `libs/design-library`

**Mandatory reading before creating or modifying any component in this package.**
Follow it exactly. Where it conflicts with a general habit, this file wins.

This file is the **contract** — how to build any component.
[`IMPLEMENTATION.md`](./IMPLEMENTATION.md) is the **queue** — what to build next,
in what order, and what one unit of work looks like. Read that one to pick up a
task; read this one before writing any code.

---

## 0. The primitive rule

This package contains **primitives only**. A component belongs here if it is an
irreducible unit of interface — something you cannot build from two other things
already in the library.

The moment a component's job is to **arrange** other components into a
recognisable pattern, it is a composite and belongs in `libs/erp-ui`, not here.

Three tests, all of which must pass:

1. **Does it render one thing, or assemble several?** `Badge` renders a pill.
   `StatTile` arranges a label, number, unit, sublabel and severity edge into a
   dashboard convention. The first belongs here; the second does not.
2. **Would two different products use it unchanged?** A sidebar, a month grid and
   a command palette are the same everywhere. A metric tile is not.
3. **Does it encode a layout decision?** Primitives carry variants and sizes.
   Composites carry _arrangement_, and arrangement is product opinion.

**Do not add these to this package.** They are known composites and belong in
`libs/erp-ui`: `Table`, `Item`, `DescriptionList`, `StatTile`, `EmptyState`,
`Panel`, `Chart`.

Two components here look like composites and are deliberate exceptions, because
what they enforce is a _type contract_ rather than an arrangement:
`MoneyInput` (amount always travels with currency) and `QuantityInput` (quantity
always travels with UOM). Do not use them as precedent for adding others.

---

## 1. Reference implementation

`src/components/Buttons/Button/` is the pattern for everything. Read it before
starting. Copy its structure and its conventions; deviate only where this file
explicitly says to.

---

## 2. Files — every component ships all of these

```
Name/
  Name.tsx                                 the component
  NameStyles.ts                            cva variants + aggregated NameStyles object
  Name.spec.tsx                            Vitest + Testing Library
  index.ts                                 barrel, explicit named re-exports
  storybook/
    Name.stories.tsx                       story, argTypes, custom docs page
    NameGallery/
      NameGallery.tsx                      variant × size × state matrix
  ChildName/                               only if the component has children
    ChildName.tsx
```

Then re-export the component from `src/index.ts`. A component that is not in the
root barrel does not exist as far as consumers are concerned.

Barrels use **explicit named re-exports**, never `export *`:

```ts
export {
  Badge,
  type BadgeProps,
  type BadgeSize,
  type BadgeVariant,
  badgeSizes,
  badgeVariants,
} from "./Badge";
```

The file is `index.ts`. Never `index.tsx`.

### 2.1 Shared internals

Five pieces of machinery are shared rather than reimplemented per component. Reach
for these before writing your own; extend them if they do not fit.

| Path                              | What it does                                                                                                                        | Used by                                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/hooks/useControllableState/` | one value that is controlled when the prop is defined and uncontrolled otherwise                                                    | every component in §10.1 — ~22 of them                                                                      |
| `src/hooks/usePosition/`          | anchors a floating element to a trigger, flips on the main axis, matches trigger width, accepts fixed coordinates for a cursor menu | `Popover` `DropdownMenu` `ContextMenu` `HoverCard` `Tooltip` `Select` `Combobox` `DatePicker` `Breadcrumbs` |
| `src/hooks/useFocusTrap/`         | traps Tab within a container and restores focus to the trigger on close                                                             | `Modal` `ConfirmModal` `Drawer` `CommandPalette`                                                            |
| `src/hooks/useScrollLock/`        | locks body scroll while a modal overlay is open                                                                                     | same four                                                                                                   |
| `src/components/Overlays/Portal/` | renders children into `document.body`, SSR-safe                                                                                     | every overlay                                                                                               |

`usePosition` is deliberately constrained: placement on one axis, flip on the main
axis, match-trigger-width, and fixed coordinates. It does **not** do shift-to-fit,
arrow positioning, or nested scroll containers. If a component needs those, raise
it rather than quietly growing the hook.

`Portal` is an explicit exception to §2: no `PortalStyles.ts` and no gallery,
because it renders nothing visible. It still ships a spec file and a barrel.

`FieldShell` (§5.1) is a sixth shared internal — non-exported, so it has no barrel
and no story either.

---

## 3. Definition of done

A component is not finished until every line is true.

**Artifacts**

- [ ] All seven files above exist
- [ ] Re-exported from `src/index.ts`
- [ ] `NameProps` exported, plus every variant/size union type
- [ ] `nameVariants` / `nameSizes` exported as `as const satisfies` arrays — the
      stories and the gallery both consume them, so they are public API
- [ ] TSDoc on **every** prop, with units and defaults stated in prose
      (`"10"` = 40px, not just `"10"`)
- [ ] Component-level doc comment saying when to reach for it **and when not to**
- [ ] At least three `@example` blocks in that doc comment, and they compile (§19.1)
- [ ] A `Usage` section on the Storybook docs page (§19.2)

**Conformance**

- [ ] `size` values come from the canonical scale (§4) — no invented scales
- [ ] Prop names come from the lexicon (§5)
- [ ] State matrix declared (§6)
- [ ] Focus ring imported from the shared fragment, not retyped (§7)
- [ ] `data-slot` on every rendered element (§8)
- [ ] Sub-components are flat named exports, parent plural / child singular (§9.1)
- [ ] Compound children carry data and return `null`; the parent renders (§9.2), or
      the doc comment states the component uses self-rendering children (§9.4)
- [ ] Stateful controls support controlled **and** uncontrolled (§10)
- [ ] Refs via `ComponentPropsWithRef`, never `forwardRef` (§12)
- [ ] `className` composed last in `cn()` (§13)
- [ ] No hardcoded user-visible strings (§14)
- [ ] a11y contract documented and tested (§15)
- [ ] `@client` / `@server-safe` recorded in the doc comment (§16)
- [ ] Gallery renders in light **and** dark (§17)
- [ ] Tests cover everything in §18

---

## 4. Canonical size scale — never invent one

Size values are **Tailwind units as strings**. Never `sm` / `md` / `lg`.

| Group              | Values              | Rendered       | Applies to                                                                                                                                          |
| ------------------ | ------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Control heights    | `"8"` `"10"` `"12"` | 32 / 40 / 48px | Button, IconButton, TextInput, TextArea, Select, Combobox, SearchInput, NumberInput, MoneyInput, QuantityInput, DatePicker, DateRangePicker, Toggle |
| Inline elements    | `"5"` `"6"`         | 20 / 24px      | Badge, Tag, Kbd                                                                                                                                     |
| Selection controls | `"4"` `"5"`         | 16 / 20px      | Checkbox, Radio, Switch                                                                                                                             |
| Avatars            | `"6"` `"8"` `"10"`  | 24 / 32 / 40px | Avatar, AvatarGroup                                                                                                                                 |
| Spinners and icons | `"4"` `"5"` `"6"`   | 16 / 20 / 24px | LoadingSpinner; a sized control maps its own `size` onto this (see `Button.tsx`)                                                                    |

Default is the middle value of the group (`"10"`, `"6"`, `"5"`, `"8"`).

**Every sized component exposes a `size` prop.** Never accept sizing through an
injected `className`. `LoadingSpinner` currently violates this — `Button` sizes it
via a `spinnerSizeClass` record, which puts the spinner's scale in its consumer.
Give `LoadingSpinner` a real `size` prop the next time it is touched.

### 4.1 Semantic severity scale — five words, no synonyms

```ts
severity: "neutral" | "info" | "success" | "warning" | "error";
```

These words match the CSS token family exactly. `--color-bg-error` and its
relatives already exist; `warning`, `success` and `info` are added in Batch 0 with
the same shape. **Never** `critical`, `ok`, `danger`, `positive`, `negative`.

- The prop is **`severity`**, never `variant`. `variant` is the colour-role axis
  (`primary` / `secondary` / `tertiary` / `default` / `destructive`), which is a
  different thing — `Button` has a variant, `Badge` has a severity.
- `Button` keeps `destructive` as a variant name because it describes the
  _action_, not a state. It renders from the `error` token family.
- Components taking `severity`: `Badge`, `Alert`, `Toast`, `ProgressBar`,
  `HelperText`, `ConfirmModal`, `MenuItem`, `TimelineItem`, `Step`.
- Not every one needs all five values. Declare the subset the component supports
  and say why in the doc comment — `ConfirmModal` is `warning | error` only.
- Severity is **never carried by colour alone** (§15.2). Text or an icon always
  accompanies it.

### 4.2 Density — an explicit prop, never inherited

```ts
density?: "comfortable" | "compact"   // default "comfortable"
```

Density is passed **explicitly at every call site**. There is no `data-dense`
ancestor attribute and no density context — these components are composed into
layouts by hand, and a layout should read its own density from the JSX rather than
from something set three levels up.

**Density and `size` are orthogonal axes. Do not conflate them.**

| Axis      | Controls                                              | Why                            |
| --------- | ----------------------------------------------------- | ------------------------------ |
| `size`    | the control's outer height and hit area               | accessibility and touch target |
| `density` | internal padding, gap between elements, label spacing | information per screen         |

So `size="10"` stays 40px tall under either density; `density="compact"` tightens
what happens _inside_ those 40px and between stacked fields. A component must
never change its height in response to `density`, and never change its padding in
response to `size` alone.

Components taking `density`: every form control, `Fieldset`,
`Sidebar`, `Timeline`, `Stepper`, `Breadcrumbs`, and — in the composite layer —
`Table`, `Item` and `DescriptionList`.

Components that do **not**: `Button`, `IconButton`, `Badge`, `Tag`, `Avatar`,
`Kbd`, `Divider`, `Skeleton`, `ProgressBar`. Their size prop is sufficient.

### 4.3 Dates — native `Date` at local midnight

`Calendar`, `DatePicker` and `DateRangePicker` use native `Date`, so `Intl` is
available directly for month names, weekday names and `Intl.Locale`'s week-start
info. No date dependency, no polyfill.

A `Date` in these components means **a calendar date at local midnight**. Time
components are ignored. State that in every doc comment, and hold these rules:

- Construct with `new Date(y, m, d)`. **Never** `new Date("2026-08-18")` — the
  string form parses as UTC and can land on the previous day.
- Serialize with local getters. **Never** `toISOString()` — the same shift, in
  the other direction.
- Compare by year, month and day. Never by timestamp.
- Conversion to and from the Postgres `date` column happens at the app boundary,
  not in this package.

The Trade Desk spec treats a B/L date and an ETA as different types for exactly
this reason. A timezone reaching a calendar date is a real bug, not a nicety.

---

## 5. Prop-naming lexicon

Use these names. Do not introduce synonyms.

| Concept                 | Name                                                             | Not                                       |
| ----------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| Open state              | `open`, `defaultOpen`, `onOpenChange`                            | `isOpen`, `visible`, `show`               |
| Native value            | `value`, `defaultValue`, `onChange`                              | `val`, `onChanged`                        |
| Non-native value        | `value`, `onValueChange`                                         | `onSelect` for value changes              |
| Checked state           | `checked`, `defaultChecked`, `onCheckedChange`                   | `selected`, `active`                      |
| Tri-state               | `indeterminate`                                                  | `partial`, `mixed`                        |
| Pressed toggle          | `pressed`, `onPressedChange`                                     | `active`, `on`                            |
| Disabled                | `disabled`                                                       | `enabled`, `isDisabled`                   |
| Read-only               | `readOnly`                                                       | `readonly`, `locked`                      |
| Invalid                 | `invalid`                                                        | `error` (that prop is the message)        |
| Async                   | `loading`                                                        | `isLoading`, `busy`, `pending`            |
| Icons                   | `startIcon`, `endIcon`                                           | `leftIcon`, `iconBefore`                  |
| Text slots              | `label`, `description`, `hint`, `error`                          | `text`, `caption`, `subtitle`             |
| Semantic state          | `severity`                                                       | `status`, `intent`, `tone`                |
| Style axis              | `variant` (colour role), `appearance` (fill: solid/soft/outline) | `type`, `kind`, `style`                   |
| Placement               | `placement`                                                      | `position`, `side` (except `Drawer.side`) |
| Link styled as a button | `appearance="button"` on `Link`                                  | `as`, `render`, `asChild` — see §11       |

Booleans are always positively phrased and default to `false`.
Change handlers are always `on<Thing>Change`, never `handle*`.

### 5.1 Every control owns its own label

There is **no `FormField` component**. Each control renders its own `<label>` and
wires `for` / `id`, `aria-describedby` and `aria-invalid` internally. That makes
the association impossible to break — there is no child for a wrapper to hide, and
no `cloneElement` or context anywhere in the package.

Every form control therefore takes these four props:

```ts
label?: ReactNode        // omit only when aria-label is supplied instead
hint?: ReactNode         // helper text, wired via aria-describedby
error?: ReactNode        // error text; its presence implies aria-invalid
required?: boolean       // renders the marker and sets aria-required
```

Controls render them through an internal, non-exported `FieldShell` so markup and
spacing stay identical across all of them. `FieldShell` is **not** public API and
is **not** a component under §2 — no barrel, no gallery, no story.

`RadioGroup`, `CheckboxGroup` and `ToggleGroup` render `<fieldset>` + `<legend>`
instead of `<label>`, because a label cannot point at a group of inputs.

`Label`, `HelperText` and `Fieldset` remain exported primitives for the cases with
no full field around them — table-cell editors and filter bars.

---

## 6. State matrix

Declare in the props type which of these the component supports, and render each
one distinctly:

- **`disabled`** — every interactive component
- **`readOnly`** and **`invalid`** — every input
- **`loading`** — anything that can trigger async work

Do not add a state you have not styled. Do not omit one that applies.

---

## 7. Focus ring — one source of truth

The focus ring geometry is a design decision made once. Import the shared
fragment from `src/tailwind/focus/focusRing.ts`; create it on first use if it
does not yet exist, taking the geometry from `ButtonStyles.ts`:

```
focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed
```

Variant strings supply **only the ring colour** (`focus-visible:outline-border-primary`).
Never retype the geometry. `ButtonStyles.ts` currently repeats it in the base
array and again in all fifteen `storybookStateStyles` entries — do not copy that
pattern into new components.

---

## 8. `data-slot` on every element

Every rendered element gets a `data-slot`. Root element takes the kebab-case
component name; parts are prefixed with it.

```tsx
<span data-slot="badge">
  <span data-slot="badge-dot" />
  <span data-slot="badge-label">{children}</span>
</span>
```

**Tests select on `data-slot`, never on Tailwind class strings.** Class strings
change when a token is renamed; slots do not. This is what keeps the test suite
from becoming a second copy of the stylesheet.

---

## 9. Sub-components — the compound pattern

### 9.1 Naming and exports

Parent is **plural** (or carries a `Group` suffix); child is the **singular**:

| Parent          | Child                                                      |
| --------------- | ---------------------------------------------------------- |
| `Breadcrumbs`   | `Breadcrumb`                                               |
| `Tabs`          | `Tab` (inside), `TabPanel` (sibling, placed by the layout) |
| `Stepper`       | `Step`                                                     |
| `Timeline`      | `TimelineItem`                                             |
| `RadioGroup`    | `Radio`                                                    |
| `CheckboxGroup` | `Checkbox`                                                 |
| `ToggleGroup`   | `Toggle`                                                   |
| `DropdownMenu`  | `MenuItem`, `MenuGroup`, `MenuSeparator`                   |
| `Sidebar`       | `SidebarGroup`, `SidebarItem`                              |

Exports are **flat named exports**, and the name is a single full word or compound
word — never a dotted namespace:

```ts
export const TabList = ...         // ✅ full compound word
export const Breadcrumb = ...      // ✅
Tabs.List = TabList;               // ❌ never
Breadcrumbs.Item = Breadcrumb;     // ❌ never
```

One component per file, each child in its own folder under the parent. All
children are re-exported from the parent's `index.ts` and from `src/index.ts`.
Flat exports keep the one-component-per-file rule intact and stay tree-shakeable.

**Expose the fewest children that make the API expressible.** Because the parent
renders the markup (§9.2), most structural children are unnecessary — the parent
already owns the list, the separators and the panels. `Tabs` takes `Tab` and
nothing else: there is no `TabList` or `TabPanel`, because `Tabs` renders both
from the `Tab` children's props.

```tsx
<Tabs defaultValue="overview">
  <Tab value="overview" label="Overview">
    …panel content…
  </Tab>
  <Tab value="documents" label="Documents" count={2}>
    …panel content…
  </Tab>
</Tabs>
```

Add a second child type only when it carries genuinely different data —
`SidebarGroup` versus `SidebarItem`, `MenuSeparator` versus `MenuItem`.

### 9.2 Children are declarative data, not rendered output

Consumers write ordinary JSX:

```tsx
<Breadcrumbs>
  <Breadcrumb href="/deals">Deals</Breadcrumb>
  <Breadcrumb href="/deals/NPM-2601">NPM-2601</Breadcrumb>
  <Breadcrumb>Shipment</Breadcrumb>
</Breadcrumbs>
```

The child **does not render itself**. It is a typed data carrier: the parent reads
its props and renders the real markup. This is what lets the parent own the things
only it can know — separators between items, `aria-current` on the last one,
collapsing the middle when `maxItems` is exceeded, `<ol>`/`<li>` semantics, and
keys.

**The child returns `null`:**

```tsx
// Breadcrumbs/Breadcrumb/Breadcrumb.tsx
import type { ReactNode } from "react";

export type BreadcrumbProps = {
  /** The visible label for this crumb. */
  children: ReactNode;
  /** Target route. Omit on the crumb representing the current page. */
  href?: string;
  /** Force current-page treatment. The last crumb is current by default. */
  current?: boolean;
};

/**
 * A single crumb inside `Breadcrumbs`.
 *
 * Declarative data only — this component never renders. `Breadcrumbs` reads
 * these props and renders the list markup, separators and `aria-current`.
 *
 * @server-safe
 */
export const Breadcrumb = (_props: BreadcrumbProps): null => null;
```

**The parent reads and re-renders:**

```tsx
// Breadcrumbs/Breadcrumbs.tsx
import { Children, isValidElement, type ReactElement } from "react";

import { Breadcrumb, type BreadcrumbProps } from "./Breadcrumb/Breadcrumb";

const crumbs: Array<ReactElement<BreadcrumbProps>> = Children.toArray(
  children,
).filter(
  (child): child is ReactElement<BreadcrumbProps> =>
    isValidElement(child) && child.type === Breadcrumb,
);

return (
  <nav data-slot="breadcrumbs" aria-label="Breadcrumb">
    <ol data-slot="breadcrumbs-list" className={cn(listStyle, className)}>
      {crumbs.map((crumb, index) => {
        const isLast: boolean = index === crumbs.length - 1;
        const isCurrent: boolean = crumb.props.current ?? isLast;
        return (
          <li key={index} data-slot="breadcrumbs-item">
            {isCurrent ? (
              <span data-slot="breadcrumbs-label" aria-current="page">
                {crumb.props.children}
              </span>
            ) : (
              <a data-slot="breadcrumbs-link" href={crumb.props.href}>
                {crumb.props.children}
              </a>
            )}
            {!isLast && (
              <span data-slot="breadcrumbs-separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
```

### 9.3 Rules for the pattern

- **Filter by identity** — `child.type === Breadcrumb`. Never by `displayName`, and
  never by index or position.
- **Ignore unrecognised children**, and warn in development:
  ```ts
  if (
    process.env.NODE_ENV !== "production" &&
    crumbs.length !== Children.count(children)
  ) {
    console.warn("Breadcrumbs: only <Breadcrumb> children are rendered.");
  }
  ```
- **`Children.toArray` already drops** `null`, `undefined` and booleans, so
  `{condition && <Breadcrumb …/>}` works. Output of `.map()` works.
- **Wrapped children are not supported** — `<div><Breadcrumb/></div>` will be
  ignored, not unwrapped. Say so in the parent's doc comment. Do not write
  recursive fragment-flattening to work around it.
- **The parent supplies keys.** The consumer never needs to.
- **The child's props type is the API surface.** It carries the full TSDoc, because
  that is what the consumer sees on hover.
- **Test the child in isolation renders nothing**, and test that the parent
  produces the right markup, separators and `aria-current` from it.

### 9.4 When the child _should_ render itself

Use the data-carrier pattern when the parent must control structure between or
around items — `Breadcrumbs`, `Tabs`, `Stepper`, `Timeline`, `Pagination`.

Use ordinary self-rendering children when items are independent and the parent
only lays them out — `CheckboxGroup`, `RadioGroup`, `AvatarGroup`,
`ButtonGroup`, `DropdownMenu`. There the child renders its own markup and the
parent supplies context (shared `name`, roving tabindex, spacing).

State which of the two a component uses in its doc comment.

---

## 10. Controlled and uncontrolled

The default is **both**: accept the controlled prop _and_ its `default*` twin plus
a change handler, and treat the component as uncontrolled when the controlled prop
is `undefined`. Five components are deliberately controlled-only, and one is
imperative. Nothing else may be controlled-only.

### 10.1 Both — controlled and uncontrolled

| Component                                                    | Controlled prop                 | Uncontrolled twin                                    | Handler                                             |
| ------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `TextInput` `TextArea` `NumberInput` `SearchInput`           | `value`                         | `defaultValue`                                       | `onChange`                                          |
| `MoneyInput` `QuantityInput`                                 | `value`                         | `defaultValue`                                       | `onChange`                                          |
| `Select`                                                     | `value`                         | `defaultValue`                                       | `onChange`                                          |
| `Combobox`                                                   | `value` + `inputValue` + `open` | `defaultValue` + `defaultInputValue` + `defaultOpen` | `onValueChange` `onInputValueChange` `onOpenChange` |
| `Checkbox` `Switch`                                          | `checked`                       | `defaultChecked`                                     | `onCheckedChange`                                   |
| `Radio`                                                      | `checked`                       | — (owned by `RadioGroup` when nested)                | `onCheckedChange`                                   |
| `CheckboxGroup` `RadioGroup` `ToggleGroup`                   | `value`                         | `defaultValue`                                       | `onValueChange`                                     |
| `Toggle`                                                     | `pressed`                       | `defaultPressed`                                     | `onPressedChange`                                   |
| `Calendar`                                                   | `value` + `month`               | `defaultValue` + `defaultMonth`                      | `onValueChange` `onMonthChange`                     |
| `DatePicker` `DateRangePicker`                               | `value` + `open`                | `defaultValue` + `defaultOpen`                       | `onValueChange` `onOpenChange`                      |
| `Tabs`                                                       | `value`                         | `defaultValue`                                       | `onValueChange`                                     |
| `Accordion`                                                  | `value`                         | `defaultValue`                                       | `onValueChange`                                     |
| `Collapsible`                                                | `open`                          | `defaultOpen`                                        | `onOpenChange`                                      |
| `Sidebar`                                                    | `collapsed`                     | `defaultCollapsed`                                   | `onCollapsedChange`                                 |
| `Popover` `DropdownMenu` `ContextMenu` `HoverCard` `Tooltip` | `open`                          | `defaultOpen`                                        | `onOpenChange`                                      |
| `Resizable`                                                  | `sizes`                         | `defaultSizes`                                       | `onSizesChange`                                     |

For the overlays, uncontrolled is the common path — the trigger opens them. The
controlled prop exists so a consumer can drive one from a keyboard shortcut or a
route.

### 10.2 Controlled-only — five components

These have no `default*` twin, because the state does not belong to the component:

| Component        | Props                           | Why                                                                                                         |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `Modal`          | `open`, `onClose`               | The app decides when a dialog exists. A modal that can open itself and not be closed from outside is a bug. |
| `ConfirmModal`   | `open`, `onConfirm`, `onCancel` | Same, and the confirm result must flow outward.                                                             |
| `Drawer`         | `open`, `onClose`               | Same as `Modal`.                                                                                            |
| `CommandPalette` | `open`, `onClose`               | Opened by a global shortcut the app owns, not by a trigger inside the component.                            |
| `Pagination`     | `page`, `onPageChange`          | Page state lives in the URL or the query layer. Never in the component.                                     |

### 10.3 Imperative — one component

`Toast` is neither. It is called through `useToast()` from `ToastProvider`; there
is no `open` prop and no `value`. It is the only component in the package with
this shape.

### 10.4 Stateless — no controlled question at all

`Button` `IconButton` `ButtonGroup` `Badge` `Tag` `Avatar` `AvatarGroup` `Card`
`Divider` `Alert` `Kbd` `Link` `Label` `HelperText` `Fieldset` `Portal`
`TabPanel` `Breadcrumbs` `Stepper` `Timeline` `ProgressBar` `Skeleton`
`LoadingSpinner` `Typography` `Heading` `FileDropzone`

`FileDropzone` holds transient drag state internally, but it is not controllable —
selected files leave via `onFilesSelected` and the component keeps nothing.

---

## 11. Elements are fixed — no polymorphism

**No component takes `as`, `render`, or `asChild`.** Every component renders one
element, decided by its semantics and never by the consumer. This follows the
first rule of the W3C ARIA Authoring Practices: the element must match what the
thing _is_.

| Component               | Always renders       | Never                                   |
| ----------------------- | -------------------- | --------------------------------------- |
| `Button` `IconButton`   | `<button>`           | an `<a>`, under any prop                |
| `Link`                  | `<a>`                | a `<button>`                            |
| `Tab`                   | `role="tab"` element | a link                                  |
| `Card` (not selectable) | `<div>`              | —                                       |
| `Card` (`selectable`)   | `<button>`           | an `<a>` — there is no `href` on `Card` |

There is no `href` on `Button` or `IconButton`. If it navigates it is a link; if
it performs an action it is a button. That distinction is not stylistic and is
not negotiable — it decides the keyboard contract (Space _and_ Enter activate a
button; only Enter follows a link), what the context menu offers, and what a
screen reader announces.

### 11.1 The library never imports a router

Navigation is supplied by the consumer **as children**, so this package stays
framework-agnostic and never depends on `next/link`:

```tsx
<Breadcrumbs>
  <Breadcrumb>
    <NextLink href="/deals">Deals</NextLink>
  </Breadcrumb>
  <Breadcrumb>Shipment</Breadcrumb>
</Breadcrumbs>
```

The parent styles the consumer's anchor by descendant selector off its own slot,
so nothing has to be injected or passed down:

```css
[data-slot="breadcrumbs-item"] a { … }
```

Applies to `Breadcrumbs`, `Pagination`, `SidebarItem`, `MenuItem` and `Card`.

### 11.2 Full-row click targets — the stretched-link pattern

Where the whole row should be clickable but the consumer's anchor sits inside it,
stretch the anchor over the row:

```css
[data-slot="sidebar-item"] {
  position: relative;
}
[data-slot="sidebar-item"] a::after {
  content: "";
  position: absolute;
  inset: 0;
}
```

Two consequences to document on any component using it: text selection inside the
row stops working, and any other interactive element in the row needs
`position: relative; z-index: 1` to stay reachable.

### 11.3 A link that looks like a button

Use `Link` with `appearance="button"`. It shares `Button`'s `cva` variants from
`ButtonStyles.ts` so the two stay identical, while remaining an `<a>` with link
semantics and the link keyboard contract.

```tsx
<Link
  href="/api/documents/packing-list.pdf"
  appearance="button"
  variant="primary-solid"
>
  Download packing list
</Link>
```

Never the reverse. Do not style a `<button>` to look like a link to work around
this — use `Link` with `appearance="link"`, which is the default.

---

## 12. Refs

React 19. Use `ComponentPropsWithRef<"button">` and spread. **Never `forwardRef`.**
Where a native prop collides with ours, `Omit` it — see `TextInputProps`, which
omits the native `size`.

---

## 13. `className`

Always composed **last** in `cn()` so a consumer's class wins conflicts:

```tsx
className={cn(baseStyle, variantStyle, conditional && "…", className)}
```

Never raw string concatenation or template literals for classes. `cn()` is at
`src/tailwind/tailwindMerge/tailwindMerge.ts`.

---

## 14. No hardcoded user-visible strings

Any text a user or screen reader can perceive must be a prop with a default.
`LoadingSpinner`'s `label = "Loading"` is the correct pattern. This includes
`aria-label`, empty-state copy, and clear-button labels.

---

## 15. Accessibility — implement the W3C APG pattern

**Every component implements the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/)
pattern named below.** Read the pattern before writing the component. Where APG
and convenience disagree, APG wins. Where APG has no pattern, the fallback rule
in the table applies.

Document three things in the component-level doc comment, then test each one:

- **Role** — the semantic element or explicit `role`
- **ARIA** — which attributes are set, and from which props
- **Keyboard** — every key handled and what it does

### 15.1 Pattern per component

| Component                                                                       | APG pattern              | Non-obvious requirements                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button` `IconButton`                                                           | Button                   | Space **and** Enter activate. `IconButton` requires `aria-label` at the type level.                                                                                                                                                                                                                                                      |
| `Link`                                                                          | Link                     | Enter only — never Space.                                                                                                                                                                                                                                                                                                                |
| `Checkbox`                                                                      | Checkbox (tri-state)     | Indeterminate is `aria-checked="mixed"`, not a visual trick.                                                                                                                                                                                                                                                                             |
| `CheckboxGroup`                                                                 | — (grouping)             | `role="group"` + `aria-labelledby`. Each box keeps its own tab stop.                                                                                                                                                                                                                                                                     |
| `Radio` `RadioGroup`                                                            | Radio Group              | Roving tabindex: one tab stop for the group, arrows move **and** select.                                                                                                                                                                                                                                                                 |
| `Switch`                                                                        | Switch                   | `role="switch"` + `aria-checked`. Not a checkbox.                                                                                                                                                                                                                                                                                        |
| `Toggle`                                                                        | Button (toggle)          | `aria-pressed`. Never `aria-checked`.                                                                                                                                                                                                                                                                                                    |
| `ToggleGroup`                                                                   | Toolbar                  | `role="toolbar"`, roving tabindex. `type="single"` may use radio semantics instead — pick one and document it.                                                                                                                                                                                                                           |
| `Select`                                                                        | Combobox (select-only)   | Custom trigger + portalled listbox. `role="combobox"` + `aria-expanded` on the trigger, `role="listbox"`/`option` in the popup. DOM focus stays on the trigger; `aria-activedescendant` tracks the highlighted option. **Never `role="menu"`** — a menu is for commands, a listbox chooses a value. Shares `useListbox` with `Combobox`. |
| `Combobox`                                                                      | Combobox (listbox popup) | `aria-expanded`, `aria-controls`, `aria-activedescendant`. Focus stays in the input.                                                                                                                                                                                                                                                     |
| `TextInput` `TextArea` `NumberInput` `SearchInput` `MoneyInput` `QuantityInput` | —                        | Each control renders its own `<label>` and wires `for`/`id`, `aria-describedby` and `aria-invalid` internally from its `label`/`hint`/`error` props (§5.1).                                                                                                                                                                              |
| `Label` `Fieldset`                                                              | —                        | Standalone primitives for table-cell editors and filter bars. Never placeholder-as-label.                                                                                                                                                                                                                                                |
| `Calendar` `DatePicker` `DateRangePicker`                                       | Date Picker Dialog       | Grid navigation: arrows by day, PageUp/Down by month, Home/End by week.                                                                                                                                                                                                                                                                  |
| `FileDropzone`                                                                  | —                        | A real `<input type="file">` must be reachable. Drag is an enhancement, never the only route.                                                                                                                                                                                                                                            |
| `Tabs` `Tab`                                                                    | Tabs                     | `role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, `aria-controls`, roving tabindex.                                                                                                                                                                                                                                  |
| `Accordion`                                                                     | Accordion                | Header is a `<button>` inside a heading element, `aria-expanded`, `aria-controls`.                                                                                                                                                                                                                                                       |
| `Collapsible`                                                                   | Disclosure               | `aria-expanded` on the trigger, `aria-controls` → content id.                                                                                                                                                                                                                                                                            |
| `Sidebar`                                                                       | Disclosure + `<nav>`     | `<nav aria-label>` landmark. Collapse is a disclosure. Current item gets `aria-current="page"`.                                                                                                                                                                                                                                          |
| `Breadcrumbs`                                                                   | Breadcrumb               | `<nav aria-label="Breadcrumb">` → `<ol>`. Last crumb gets `aria-current="page"`.                                                                                                                                                                                                                                                         |
| `Pagination`                                                                    | — (nav)                  | `<nav aria-label="Pagination">`, links not buttons, current page `aria-current="page"`.                                                                                                                                                                                                                                                  |
| `Modal` `ConfirmModal` `Drawer`                                                 | Dialog (Modal)           | Focus trap, `aria-modal="true"`, labelled by its heading, Esc closes, focus returns to the trigger.                                                                                                                                                                                                                                      |
| `Popover`                                                                       | Dialog (non-modal)       | Esc closes, focus returns. Not `role="tooltip"`.                                                                                                                                                                                                                                                                                         |
| `DropdownMenu` `ContextMenu`                                                    | Menu Button / Menu       | `role="menu"` / `menuitem`, arrows navigate, Home/End, type-ahead, Esc closes and returns focus.                                                                                                                                                                                                                                         |
| `CommandPalette`                                                                | Combobox + Dialog        | Combobox semantics inside a modal dialog. `aria-activedescendant`, never moving DOM focus into the list.                                                                                                                                                                                                                                 |
| `Tooltip`                                                                       | Tooltip                  | Must appear on **focus** as well as hover. Never the only route to information. Never interactive content.                                                                                                                                                                                                                               |
| `HoverCard`                                                                     | — (no APG pattern)       | Must be keyboard-reachable — open on focus, dismiss on Esc. If it cannot be, it is a `Popover`.                                                                                                                                                                                                                                          |
| `Resizable`                                                                     | Window Splitter          | `role="separator"`, `aria-valuenow` / `valuemin` / `valuemax`, `aria-controls`, arrow keys resize, Enter toggles collapse.                                                                                                                                                                                                               |
| `Alert`                                                                         | — (static)               | Static inline message: **no** `role="alert"`. Only add a live region if it appears in response to an action.                                                                                                                                                                                                                             |
| `Toast`                                                                         | Alert / Status           | `role="status"` + `aria-live="polite"`; `role="alert"` + `assertive` only for errors. Container is a landmark so it can be reached.                                                                                                                                                                                                      |
| `ProgressBar`                                                                   | Meter / progressbar      | `role="progressbar"` + `aria-valuenow` / `valuemin` / `valuemax`, or `aria-busy` when indeterminate.                                                                                                                                                                                                                                     |
| `Stepper` `Step`                                                                | — (ordered list)         | `<ol>`, current step `aria-current="step"`, blocked steps conveyed in text not colour alone.                                                                                                                                                                                                                                             |
| `Timeline` `TimelineItem`                                                       | — (ordered list)         | `<ol>`. Both timestamps in the accessible name, not just visually.                                                                                                                                                                                                                                                                       |
| `Skeleton`                                                                      | —                        | `aria-hidden="true"`, with `aria-busy` on the region it replaces.                                                                                                                                                                                                                                                                        |
| `Badge`                                                                         | —                        | If it carries meaning beyond the visible text, that meaning goes in text — never colour or a dot alone.                                                                                                                                                                                                                                  |
| `Tag`                                                                           | —                        | The remove affordance is a real `<button>` with an `aria-label` naming what it removes.                                                                                                                                                                                                                                                  |
| `Avatar` `AvatarGroup`                                                          | —                        | Image is `aria-hidden` with the name available as text. Overflow count is announced. `status` is presence, not severity — it uses `--color-presence-*` tokens and its meaning is in the accessible name, never the dot alone.                                                                                                            |
| `TabPanel`                                                                      | Tabs                     | `role="tabpanel"`, `tabindex="0"`, `aria-labelledby` → its tab. Rendered by the layout, not by `Tabs`.                                                                                                                                                                                                                                   |
| `Portal`                                                                        | —                        | Renders nothing itself. The portalled content carries its own role.                                                                                                                                                                                                                                                                      |
| `Divider`                                                                       | Separator                | `role="separator"` when it separates, `aria-hidden` when purely decorative.                                                                                                                                                                                                                                                              |
| `Kbd`                                                                           | —                        | `<kbd>`. The shortcut must also exist in the accessible name of the thing it triggers.                                                                                                                                                                                                                                                   |
| `Card`                                                                          | —                        | Non-selectable: `<div>`, no role. Selectable: a real `<button>` with `onClick` — required together at the type level. Navigation from a card is `router.push()` in the handler.                                                                                                                                                          |

### 15.2 Rules that cut across all of them

- **Colour is never the only carrier of meaning.** Severity always has text or an
  icon alongside it. This is the §01 severity rule stated as an a11y requirement.
- **Focus is always visible** — the shared ring from §7, never `outline: none`
  without a replacement.
- **Focus returns** to the trigger when any overlay closes.
- **Roving tabindex** wherever APG specifies it: one tab stop for the widget,
  arrows to move within. Never a tab stop per item.
- **Nothing is hover-only.** Every hover affordance has a focus equivalent.
- **Test the keyboard contract**, not just the ARIA attributes. An `aria-expanded`
  that never changes passes an attribute assertion and fails a user.

---

## 16. `"use client"` — record, do not apply

**Do not add `"use client"` directives yet.** No consumer renders this library
inside a React Server Component tree today, so directives would be inert.

Instead, record the intent in the component-level doc comment:

- `@client` — uses hooks, its own handlers, browser APIs, or Context
- `@server-safe` — purely presentational, renderable in an RSC tree

**Never put `"use client"` in `src/index.ts` or any barrel file.** That would make
every component in the package a client component permanently, with no way for a
consumer to opt out. Directives, when they come, go on individual component files.

`ToastProvider` is the **only** permitted Context provider in this package. Do not
add a second one without an explicit decision.

---

## 17. Themes

Every gallery renders in **both** light and dark. `.storybook/preview.ts`
currently hardcodes `theme-light` in its decorator — replace that with a
`globalTypes` toolbar toggle before building Tier 1, or render both themes
side by side in each gallery. A component proven in one theme is not proven.

Colours come from semantic tokens only. **Never** a raw hex, `oklch()`, or a
Tailwind palette colour (`bg-blue-600`) inside a component.

---

## 18. Tests — what every spec must cover

```
Name.spec.tsx
```

- Renders children; default variant and size applied
- Every variant and every size produces its distinct classes — assert they
  differ from each other, not just that they exist
- Interaction: click, keyboard, and that `disabled` suppresses both
- Accessibility: role, `aria-*` wiring, label association, focus order
- `className` **merges** rather than replaces — the `cn()` contract
- Ref forwarding where the element accepts one
- Controlled and uncontrolled both work (§10)

Select on `data-slot` and accessible roles. jsdom does not run the Tailwind
pipeline, so assertions are on class strings and DOM structure — visual proof
belongs to the gallery.

---

## 19. Code examples — required, in two places

Every component ships working, copy-pasteable examples. Both locations are
mandatory; neither substitutes for the other.

### 19.1 `@example` in the component doc comment

This is what a consumer sees on IDE hover, and what Storybook autodocs picks up.
Minimum three blocks, more if the component has a compound API:

````tsx
/**
 * A pill for counts and record state.
 *
 * Reach for it for a count on a nav item or tab, or for a record's state with
 * `dot` set. Do not use it for a removable filter chip — that is `Tag`.
 *
 * @server-safe
 *
 * @example Minimal
 * ```tsx
 * <Badge>7</Badge>
 * ```
 *
 * @example Severity and appearance
 * ```tsx
 * <Badge variant="critical" appearance="soft">99+</Badge>
 * <Badge variant="warning" dot>At port</Badge>
 * ```
 *
 * @example In a nav item
 * ```tsx
 * <SidebarItem href="/app/approvals">
 *   Approvals
 *   <Badge variant="critical">3</Badge>
 * </SidebarItem>
 * ```
 */
````

Rules:

- Examples must **compile** against the current props. A stale example is worse
  than none — update them in the same commit as any prop change.
- Use real domain values, not `foo` / `bar`. `NPM-2601`, `CIF`, `USD 41,800` read
  as the system they belong to and double as a usage hint.
- Every **compound** component's first example shows the parent with its children,
  exactly as §9.2 does.
- Show the **common** case first, the configured case second, the composed case
  third. Never lead with the most complex form.

### 19.2 A `Usage` section on the Storybook docs page

Add it to the custom docs page in `Name.stories.tsx`, between the gallery and the
interactive example:

```tsx
import { Controls, Description, Heading, Primary, Source, Title } from "@storybook/addon-docs/blocks";

parameters: {
  docs: {
    page: () => (
      <>
        <Title />
        <Description />
        <Heading>Gallery</Heading>
        <BadgeGallery />
        <Heading>Usage</Heading>
        <Source code={usageExample} language="tsx" />
        <Heading>Example</Heading>
        <Primary />
        <Controls />
      </>
    ),
  },
}
```

Where the component has a compound API, the `Usage` block shows the full parent +
children form. Where it has a non-obvious constraint — wrapped children ignored,
`aria-label` required, controlled vs uncontrolled — state it here in prose, not
only in the type.

---

## 20. Never

- `export default` — named exports only
- `index.tsx` — barrels are `index.ts`
- `function` declarations — arrow functions only
- `T[]` — use `Array<T>`
- More than one component per file
- Raw colour values inside a component — tokens only
- `export *` in a barrel
- Sizing via injected `className` instead of a `size` prop
- `"use client"` in a barrel
- Adding a composite from §0 to this package
- `as`, `render` or `asChild` on any component
- `href` on `Button` or `IconButton` — it is a link or a button, never both
- A `<button>` styled as a link, or an `<a>` styled as a button without `appearance`
- Importing `next/link`, or anything framework-specific, into this package
- Colour as the only carrier of meaning
- Attaching children as properties — `Tabs.Tab`, `Breadcrumbs.Item`
- Letting a data-carrier child render its own markup
- Filtering compound children by `displayName`, index, or position
- Recursive fragment-flattening to support wrapped children
- Shipping an `@example` that does not compile against the current props
