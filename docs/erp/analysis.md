# Product Management: sales and margin analysis

Owner's request of 20 Nov 2026: Product Management "just like Phocas software in all features" (Phocas a functional
reference only: no Phocas name, screen, text or data is used), with the owner's choice "Product list + Phocas-style
analysis". Built 20 Nov 2026; released on for everyone, as the owner asked for the ERP redesign ("Straight on for
everyone"), behind its own module switch.

## What it is

Two pages in Product Management's side menu, under **Analysis**:

| Page | Address | What |
| --- | --- | --- |
| Sales and margin analysis | `/erp/c/<company>/products/analysis` | Sales before tax, cost, margin and margin % of the goods dispatched in a period, by one dimension at a time, against a comparison period, with the months as a chart, drill-down, saved views and CSV |
| Stock against sales | `/erp/c/<company>/products/analysis/stock` | Each product's on hand, reserved, available, value and reorder point against what was dispatched in the last 30, 90, 180 or 365 days: days of cover, and To reorder, Slow, Not moving or Moving |

How it maps to the reference's ideas:

| Reference idea | BIZOMAT |
| --- | --- |
| Databases of a business's own data | The company's own ERP records, read only (nothing is copied or imported) |
| Dimensions and drill-down streams | Product, Category, Family, Customer, Salesperson, Warehouse and Month; click a row to see it by the next dimension; the trail goes back |
| Measures | Sales, Quantity, Cost, Margin, Margin % (sort by any) |
| Periods and comparisons | Last 12 months, this and last month, quarter, financial year (1 July) and calendar year, or chosen dates; against the same dates last year or the period just before |
| Favourites | Saved views, private or shared in the company; a named period moves with the date |
| Grid and charts | The grid with each row's share and its change, the four headline figures, and the months as columns with the comparison as a line (hover, keyboard focus and a table view) |
| Export | CSV of the grid (and of stock against sales) |
| Budgets and forecasts, scheduled subscriptions, alerts | Planned, not built |

## Where the figures come from

`apps/work/src/worker/erp/analysis.ts`. The facts are the shipment lines dispatched (status dispatched or delivered) in
the period: each line's quantity at its share of the sales order line's value before tax (the same as the supply chain's
sales report, which a test checks to the cent), and the cost that left stock for it: the sum of the `sales_dispatch`
movements of that shipment and product in the append-only stock ledger, shared over the shipment's lines of that
product. The warehouse is the one the goods left from. The salesperson is the owner of the CRM deal the order came from,
else the person who made the order. One currency is analysed at a time (the order's currency).

Not in the facts: returns (the returns report has them), freight, invoices made in Finance without a sales order, and
anything not dispatched. A dispatch with no stock movement (a service, a product not kept in stock) has no cost: its
sales count, its margin is left out, and the page says how much had no cost.

Stock against sales leaves quarantine out of available; days of cover is available stock over the average dispatched
per day in the window; the value is the product's valuation in Warehouse.

## API

| Method and address (under `/api/erp`) | What |
| --- | --- |
| `GET /c/:company/analysis/meta` | Dimensions, currencies, today's date on the server, the source note |
| `POST /c/:company/analysis/query` | `{from, to, compare, dimension, filters, currency, sort, limit}`: rows, totals, the comparison's totals and the trend by month; `?format=csv` for the CSV. Periods of three years at most |
| `GET /c/:company/analysis/stock?days=` | Stock against sales; `format=csv` |
| `GET, POST /c/:company/analysis/views`, `PATCH, DELETE /c/:company/analysis/views/:id` | Saved views: one's own and those shared in the company; only the owner changes one; the owner or an ERP administrator deletes it; 100 per person and company |

## Access and switches

- `reports.view` (every ERP role, viewers included), as for the supply chain and job profitability reports, which show
  value and cost. Another company's people get the usual 404.
- Under `company_members_v2` (off) the member module is Reports (`company/members-gate.ts`), and saved views are
  personal settings.
- The module switch `module_analysis_enabled` (on by default, like every module) and Products' own switch: either off
  answers 403 MODULE_DISABLED to the company's people. A platform administrator switches it in the Control Centre.

## Data

Migration `0039_erp_analysis.sql` adds `erp_analysis_views` (company table: `company_id` on every row and statement);
its reverse drops it. The analysis writes nothing else.

## Tests

`apps/work/test/erp-analysis.test.ts`: the example company's figures against the sales report and the stock ledger, every
dimension, drill-down, both comparisons, CSV, refused periods, stock against sales, saved views (private, shared read
only, deleted), another company's 404 and both switches.
