# Postings to Finance's ledger from BIZOMAT ERP

Batch 2, item 1 (owner's request of 20 Nov 2026: "Posting to Finance's ledger (depreciation, payroll, revenue)").
Code: `apps/work/src/worker/erp/objects/postings.ts`; migration `0041_erp_batch2.sql`; tests
`apps/work/test/erp-postings.test.ts`.

## The decision on accounts

The owner was asked which accounts to post to. Rather than fix accounts in code, **each company chooses its own** on the
Finance postings tab of Fixed assets, Payroll and Revenue recognition (`/erp/c/<company>/m/<module>/postings`). The
screen suggests an account from the company's chart by name and type (for example 416 Depreciation, 790 Less
accumulated depreciation, 477 Wages and salaries, 478 Superannuation, 825 PAYG withholding payable, 826 Superannuation
payable, the default bank account for net pay, the default income account for earned revenue). A suggestion is only
shown: nothing posts until an ERP administrator or a finance controller (who can see the chart in Finance) saves the
accounts. Deferred revenue has no account in the starter chart, so the company adds one in Finance (for example "Income
in advance", a current liability) and chooses it.

| Part | Kind of account | Debit or credit |
| --- | --- | --- |
| Depreciation expense | Expense | Debit, each month |
| Accumulated depreciation | Asset (contra) | Credit, each month |
| Wages and salaries expense | Expense | Debit, gross pay |
| Employer contribution expense (when used) | Expense | Debit, the employer's contribution |
| Tax withheld payable (when used) | Liability | Credit, tax withheld |
| Employer contribution payable (when used) | Liability | Credit, the employer's contribution |
| Other deductions payable (when used) | Liability | Credit, other deductions |
| Net pay owed or paid from | Liability or asset | Credit, net pay (a wages payable account, or the bank account paid from) |
| Deferred revenue | Liability | Debit, each earned month (credit, once, when the invoiced amount is moved there) |
| Revenue earned | Income | Credit, each earned month (debit, once, when the invoiced amount is moved to deferred revenue) |

## What posts, and when

- **Fixed assets** (in service, disposed or written off): Post depreciation to Finance with a date. Every month of the
  asset's depreciation schedule that ends on or before the date (and before the disposal month) and is not posted yet
  gets one journal dated the month's last day. Post every asset's depreciation does the same for all assets (the
  Finance postings tab).
- **Pay runs** (approved or paid): Post to Finance makes one journal dated the pay date. A payslip whose net pay is not
  its gross less tax withheld and deductions is refused. BIZOMAT makes no payment: the journal records the cost and what
  is owed.
- **Revenue schedules** (active or completed): Post earned revenue to Finance with a date: each month that ends on or
  before it moves its share from deferred revenue to revenue. Move the invoiced amount to deferred revenue posts, once,
  the whole amount from revenue to deferred revenue, for an invoice that went to revenue. Post every schedule's earned
  revenue does the same for all schedules.

## Rules

- **Finance's own code:** journals are built and checked by `validateJournal` and written by `journalStmts`
  (`src/worker/fin/ledger.ts`): balanced, accounts of the workspace, not archived, never into a locked period. They are
  manual journals (`source_type` 'manual', `source_id` the ERP record) whose memo starts with "BIZOMAT ERP:", in
  Finance's audit log as `journal.posted` with the source.
- **Who:** the ERP side needs the record's role (fixed assets and revenue: finance controller or ERP administrator;
  pay runs: the HR manager, a finance controller or an ERP administrator); the Finance side needs a role that may post
  journals (owner, administrator or accountant). Both must pass.
- **Once:** each journal writes one row per month (or per pay run, or the deferral) to `erp_integration_events` (kind
  `finance.journal`, key `fin:<company>:<object>:<record>:<part>`) in the same transaction. A second attempt, at the same
  moment or later, fails on that key and posts nothing.
- **Locked periods:** months on or before the workspace's lock date are posted together in one journal on the first open
  day, and the memo says so. A pay run in a locked period is posted on the first open day the same way.
- **Currency:** a record in another currency than the workspace's is converted at the company's own exchange rate (Organisation structure, Exchange rates) on the record's own date (the asset's acquisition, the revenue's start, the pay date), the same rate for every journal of it, so the accounts it posts to net to nothing; the memo names the rate; with no rate it is refused (`docs/erp/consolidation.md`).
- **Reversing:** Reverse Finance postings reverses each journal once (a second request at the same moment is refused)
  through Finance's `reversalStmts`, dated today, or the first open day, where the original is in a locked period, and
  frees the record's keys, so it can be posted again. A journal reversed in Finance itself no longer counts for the
  guards at once, and its month is posted again by the next posting, however many times that happens.
- **Guards:** a fixed asset with posted depreciation cannot change its cost, residual value, life, method, rate or dates,
  and cannot be disposed of in or before a posted month, until the postings are reversed. A posted pay run cannot go back
  to worked out, and a revenue schedule with journals cannot be cancelled, until reversed.
- **History:** each posting and reversal is in the record's history; changes to the posting accounts in the ERP's
  history (`postings.accounts`).

## Not done

- A disposal's journal (cost, accumulated depreciation, proceeds, gain or loss) is entered in Finance.
- Stock, production and maintenance values are still not posted (`docs/erp/STATUS.md`).
- BIZOMAT is not certified payroll: posting a pay run records what the company worked out with its own rates.
