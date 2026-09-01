# Lead routing: origin→destination assignment — website scope

> **Status:** planned, not implemented. Written 2026-08-29.
> **The full plan lives in the `bongiorno-app` repo at `docs/lead-routing-plan.md`.**
> This file covers only the part that lands in this (website) repo.

## Why

Today a lead's assignee is decided by the **language of the page** the form was submitted from. That proxy no longer matches the business: Bongiorno ships from Europe (IT, FR, ES, DE, PL, CZ) to North Africa (TN, DZ, MA, LY, MR), and who handles a lead depends on the **lane** — origin and destination of the goods — not on the visitor's reading language.

The internal app is moving to a `lead_routing_rules` table keyed on `(origin_country, destination_country)` ISO alpha-2 pairs, with `*` wildcards and an admin-owned default:

| origin | destination | assignees | meaning |
|---|---|---|---|
| `IT` | `TN` | mario@, lucia@ | exact lane |
| `*` | `TN` | lucia@ | any origin → Tunisia |
| `ES` | `*` | pedro@ | Spain → anywhere |
| `*` | `*` | commerciale@ | default |

Resolution order: exact pair → destination-only → origin-only → default.

For that to work, **this repo has to start sending ISO country codes.** That is the whole website-side scope.

## What changes here

### `src/components/common/QuoteFormTest.js`

- `CountryPicker` already hands back the code as its second argument (`CountryPicker.js:81` → `onChange(countryValue, flagMap[countryValue])`), but both call sites drop it. Capture it:
  ```js
  onChange={(country, code) =>
    setForm((prev) => ({
      ...prev,
      originCountry: country,
      originCountryCode: (code || "").toUpperCase(),
    }))
  }
  ```
  `flagMap` lowercases the code, so uppercase at capture — the rules table stores uppercase alpha-2.
- Add `originCountryCode: ""` / `destinationCountryCode: ""` to the initial state **and** the post-submit reset object (duplicated at `QuoteFormTest.js:133` and `:189` — keep them in sync).
- Delete `originOther` / `destinationOther` from both objects and both `onChange` handlers. They are already dead: no input renders them and the picker resets them to `""` on every change. The picker is a closed list, so there is no free-text country any more — this retires the class of bug behind commit `3ec7703` ("form sending localized 'Other' label instead of normalized value").

### Promote the new form

`QuoteForm` has two consumers — `src/app/[locale]/page.js:12` and `src/app/[locale]/preventivi/page.js:2`, both importing it as `FromPreventivi`. Rename `QuoteFormTest.js` → `QuoteForm.js` (replacing the old file), keeping the export name `QuoteForm`, so both call sites keep working unedited. Then delete `src/app/[locale]/quote-test/` and its `src/i18n/routing.ts` entry.

### `src/app/api/contact/route.js`

No change. It spreads the whole form body through to the internal app, so the new fields ride along for free.

## Sequencing — read before shipping

There is **one shared Supabase database** behind local dev and the deployed app — no staging. The whole rollout is therefore staged so that each step is a no-op for live behaviour, and routing switches over one lane at a time under admin control.

| Stage | Where | Action | Live behaviour change |
|---|---|---|---|
| A | app | migration: new table + nullable columns (no seed row) | none |
| B | app | resolver deployed, chained behind the old locale path | none — rules table is empty |
| **C** | **this repo** | **the changes above — send ISO codes** | **none — codes stored, nothing routes on them yet** |
| D | app | admin UI; lanes entered one at a time | per-lane, reversible |
| E | app | seed the `('*','*')` default | locale path retired |
| F | app | cleanup | removes dead code |

**This repo ships at stage C, and it is a safe deploy.** The codes get persisted but nothing routes on them until lanes are entered at stage D. That ordering is deliberate: it gives a window to confirm real country codes are landing correctly in the `leads` table *before* any assignment depends on them.

Shipping this repo earlier than stage B is also harmless — the app's Zod schema is non-strict, so the extra `originCountryCode` / `destinationCountryCode` fields are silently stripped rather than rejected. They just would not be stored yet.

Stages A–C can all ship the same afternoon. None of them changes what a customer or a commercial sees.

## Verification

Run both apps — `npx next dev` on 3000 here, 3001 for the app (`localhost:3001` is already in `ALLOWED_ORIGINS` at the app's `ingest/route.ts:10`). Submit the quote form picking Italy → Tunisia and confirm the app's `leads` row has `origin_country_code = 'IT'` and `destination_country_code = 'TN'`.

Also check: the notification email is still in the submitted locale's language (locale still drives email language — it just no longer decides the assignee), and `npm run build` is clean.
