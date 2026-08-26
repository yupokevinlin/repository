# @org/erp-components

The composite layer: components assembled from `@org/design-library` primitives
that carry enough shape of their own to be worth naming.

## The rules are the design library's

`libs/design-library/AGENTS.md` applies here **in full** — the size scale (§4),
severity (§4.1), density (§4.2), dates (§4.3), every control owning its label
(§5.1), data-carrier children (§9.2), controlled and uncontrolled (§10), fixed
elements (§11), no hardcoded user-visible strings (§14), the APG patterns
(§15), and the `@client` / `@server-safe` tags (§16).

Read it before writing anything here. This file only records what is different.

## What belongs here

A component belongs in this package when it is **assembled from primitives and
has an opinion about the data it shows**. `Table` knows about columns, sorting
and selection. `DescriptionList` knows a term goes beside its detail.
`EmptyState` knows an empty result needs an explanation and usually a way out.

A component belongs in the design library when it is a **primitive** — when it
would be recognisable in any product, not just an ERP.

The test that settles most cases: if explaining the component requires the word
"row", "record", "column" or "dataset", it is a composite.

## What does not belong here

**Domain knowledge.** A `Table` belongs here; a `DealTable` that knows the
shape of a deal belongs in the app. This package must be usable by a product
that has never heard of a shipment.

**A second Context provider.** §16's rule is not relaxed by being one package
further out: `ToastProvider` in the design library is still the only one.

## Depending on the library

Import through the package name, never a relative path into it:

```ts
import { Button, Card, Typography } from "@org/design-library";
```

The theme comes through the subpath export, which is what
`.storybook/preview.ts` uses:

```ts
import "@org/design-library/tailwind.css";
```

## Definition of done

The design library's §3, unchanged: styles file, component, spec, barrel,
gallery, story, export from `src/index.ts`, then

```bash
npx nx run erp-components:test
npx nx run erp-components:lint
npx nx run erp-components:typecheck
npx nx run erp-components:storybook   # port 5001
```

and a look at it in the browser, in both themes. That last step is not
optional — it is what caught nine defects in the design library that the suite,
lint and the type checker all passed.
