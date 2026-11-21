# Consolidation, intercompany and currencies in BIZOMAT ERP

Batch 2, item 2 (owner's request of 20 Nov 2026: "Consolidation, intercompany and multi-currency in Finance").
Catalogue module 21. Code: `apps/work/src/worker/erp/objects/intercompany.ts` (intercompany documents and the
consolidated report), `fx.ts` (exchange rates), `postings.ts` (conversion of postings); the screen
`apps/work/src/client/system/erp/objects/Consolidation.tsx`; migration `0041_erp_batch2.sql` (`erp_ic_contacts`);
tests `apps/work/test/erp-consolidation.test.ts`.

## The group

The group is the company's legal entities (Organisation structure, Legal entities) that name a **Finance workspace**:
the company's own, one of another registered company where the person is the owner or an administrator (a subsidiary
that runs its own BIZOMAT company), or one the person owns in their own company. The example company names only its
own, and no real company names the example's. Another company's books are read only in a browser session (an API
token reaches this company's own books only), by its owner or an administrator, and only what they may read in Finance
itself. An entity whose workspace may not be read is left out of the report, with the reason; nothing is added
silently.

## Exchange rates

Rates are the company's own (Organisation structure, Exchange rates): BIZOMAT fetches no market rates. The rate between
two currencies on a date is the latest rate in use dated on or before it, entered either way round (a rate from A to B,
or the inverse of one from B to A). With no rate, the step that needs one is refused and says which rate to add.

## Intercompany transactions

A sale of goods or services between two entities: made, sent for approval, approved by someone else (segregation of
duties), then **Make the invoice and the bill**:

- a draft invoice in the seller's workspace to the buyer, and a draft bill in the buyer's workspace to the seller, through
  Finance's own `createDoc`, once each however often it is asked (`erp_integration_events`);
- the amount is in the seller's currency; the bill is converted at the rate on the transaction's date when the buyer's
  workspace keeps another currency, and its notes say at which rate;
- the Finance contact that stands for each entity is found (by a remembered link or by name) or made, and remembered in
  `erp_ic_contacts`: one contact per entity and workspace. When trade goes the other way it becomes a customer and
  supplier, and when it was archived it is restored, never replaced, so what was posted against it is still eliminated.
  Either change needs the person's Finance right to change that contact and is written to the workspace's audit log;
- the person needs a Finance role that may create invoices in the seller's workspace and bills in the buyer's. Both
  documents stay drafts: each workspace's own Finance roles check and approve them.

## The consolidated report

`/erp/c/<company>/m/consolidation/consolidated` (and `GET /api/erp/c/<company>/x/consolidation`, CSV with
`format=csv`), for a period and a presentation currency:

- each entity's profit and loss for the period and balance sheet at its end, from its workspace's posted journals;
  earnings not yet closed to retained earnings are shown in equity, so each balance sheet balances;
- every amount translated at the **closing rate** (the rate on or before the period's end);
- **eliminations**: the balances posted against a contact that stands for another entity of the group, on every
  account except bank, cash, card and tax accounts (a payment between entities is still cash, and GST is still owed to
  the tax office; an intercompany loan is eliminated on both sides). The difference between the two sides, if any, is
  shown;
- the consolidated column is the entities' amounts plus the eliminations.

## Not done

- No translation reserve: a group with more than one currency may not balance to the cent after translation.
- No minority interest: every entity is consolidated in full, whatever its ownership (the report shows the ownership).
- One currency within each Finance workspace, as before.
- Intercompany loans, dividends and management fees are recorded as ordinary invoices and bills, or as journals in
  Finance.
