# Finance and currencies

Code: `apps/work/src/shared/money.ts` (decimal-safe arithmetic and formatting), `src/shared/finance.ts` (summaries),
`src/worker/routes/finance.ts`, the currency column in `src/shared/columns.ts`, interface
`src/client/board/FinancePanel.tsx` and Settings > Finance (`src/client/pages/settings/Platform.tsx`).

## Supported currencies (ISO 4217)

AUD Australian Dollar, USD US Dollar, INR Indian Rupee, EUR Euro, GBP British Pound, NZD New Zealand Dollar, CAD
Canadian Dollar, SGD Singapore Dollar, JPY Japanese Yen (no decimals), CHF Swiss Franc, CNY Chinese Yuan. Reports and
summaries show the code ("AUD 1,234.50"); the board shows the local symbol.

## Where a column's currency comes from

1. The column's own code, when it is fixed (an administrator chose it, or the column existed before this release).
2. Otherwise the project's currency (board settings, Project details).
3. Otherwise the organisation's default currency (Settings > Finance).
4. Otherwise none: amounts show without a currency, and reports say so.

New currency columns follow the project or organisation ("Use the project's or organisation's currency"). Changing a
currency never changes amounts.

## Existing data (the migration rule)

Nothing is assumed about what existing numbers mean. Migration 0006 does not touch a single stored value or column
setting. Columns made before this release keep the code stored on them (most often USD, the old template default) and
are shown as **unconfirmed** on the board's Finance panel, in reports and in Settings > Finance, where an
administrator decides per column: keep that code, follow the project or organisation currency, or choose another.
Number columns (such as one titled "Finance" holding 12, 33, 78) stay plain numbers until an administrator marks them
as money ("Mark as money"); from then on finance permissions and summaries apply to them. Every decision is recorded
in the audit trail (`finance.column_changed`, `finance.settings_changed`) with before and after.

## Financial fields

A column's **finance role** says what its amounts are: approved budget, estimated cost, actual cost, committed
expenditure, or other. The organisation lists which roles it uses. Templates now create their Budget column as
"approved budget". Financial notes are an ordinary long-text column.

Calculated (never stored):

| Figure | Formula |
| --- | --- |
| Total approved budget, estimated cost, actual cost, committed | Sum of the column(s) with that role, per currency |
| Remaining budget | Approved budget - actual cost - committed expenditure |
| Budget variance | Approved budget - actual cost (positive: under budget) |
| Forecast variance | Approved budget - estimated cost |
| Budget utilisation | (Actual cost + committed) / approved budget, percent with one decimal |

Totals add top-level tasks only (a parent's amount is taken as its total, so subitems are not counted twice).

## Decimal safety

Amounts stay stored as JSON numbers (unchanged format), which keep exactly the decimal text entered (up to 15
significant digits). Every total, difference and percentage is computed on integers: each amount's decimal text is
read into BigInt units of 1/10,000, summed exactly, and only the final figure is rounded (half away from zero) to the
currency's minor unit. New entries in currency columns are limited to 4 decimal places and 15 significant digits. The
table's group subtotals for currency columns use the same arithmetic (0.10 + 0.20 shows 0.30). Different currencies are
kept in separate totals and never added.

Currency conversion is not implemented. If it is added, each converted figure must keep the original amount, its
currency, the exchange rate, the rate's date and the converted amount.

## Display and permissions

Formatted amounts on the board, sorting and filtering as numbers, group subtotals in the table, project totals in the
Finance panel (per currency, per column, per group), and the financial summary in reports. Who sees financial data:
everyone with access to the project (default, the behaviour before this release), people who can edit, or managers
only (Settings > Finance), with per-person exceptions on each project. Without finance access the columns and values
are absent from every response (board, task, activity, My Work, search, dashboards, reports).

## API

| Method and path | |
| --- | --- |
| `GET /api/finance/currencies` | The supported currencies |
| `GET/PUT /api/workspaces/:ws/finance` | Default currency, visibility, enabled roles; for admins also every amount column with its currency source |
| `POST /api/workspaces/:ws/finance/columns/:column` | `confirm`, `inherit`, `set` (with `currency`), `mark_financial`, `unmark_financial`, `role` |
| `PATCH /api/boards/:id/project` | The project's currency (needs edit-finance), start date, manager |
| `GET /api/boards/:id/finance` | The project's summary (needs view-finance) |
