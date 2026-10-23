---
layout: '../../../layouts/LibraryChapterLayout.astro'
title: 'The three statements tell one story'
chapterNumber: 2
---

A company's annual report usually contains three main financial statements. They are not three separate mysteries: each describes a different part of the same business.

## Income statement: What did the business earn?

The income statement records revenue and expenses over a period, often a financial year. The result is profit or loss. It answers questions about pricing, costs and profitability.

For example, a company sells $10 million of goods and incurs $6.5 million of direct production costs. Its **gross profit** is $3.5 million, before administrative costs, financing costs and tax.

```figure
type: bars
title: From sales to gross profit
unit: $m
caption: Gross profit is earned before administrative costs, financing costs and tax.
- Revenue | 10.0
- Direct production costs | 6.5
- *Gross profit | 3.5
```

## Balance sheet: What does the company own and owe?

The balance sheet is a snapshot at a specific date. It lists **assets** such as cash, inventory and equipment; **liabilities** such as bills and borrowings; and **shareholders' equity**.

The basic relationship is:

**Assets = Liabilities + Equity**

Imagine the company owns $12 million in assets and owes $7 million. Its accounting equity is $5 million. That does not mean someone would necessarily pay $5 million for the business. Book values and market values may differ substantially.

```figure
type: stack
title: Assets = Liabilities + Equity
unit: $m
caption: The $12m of assets is financed by $7m owed and $5m of accounting equity, which is not the same as market value.
- Liabilities | 7
- Equity | 5
```

## Cash flow statement: Where did the cash go?

A profitable company may still run short of cash. It may sell goods on credit, hold too much inventory or spend heavily on equipment. The cash flow statement separates movements into operating, investing and financing activities.

Suppose a company reports $1 million of net profit but has not yet collected $1.5 million of invoices. Depending on other working-capital changes, its operating cash flow could be much weaker than its reported earnings suggest.

## How they connect

Revenue may create receivables on the balance sheet before cash arrives. Buying equipment reduces cash and creates an asset, while depreciation spreads the accounting expense over future periods. Borrowing increases cash and debt together; the interest affects profitability later.

Rather than studying each statement in isolation, move between them. When profits rise, check whether cash from operations rises too. When sales grow, check what happened to inventory and receivables. When earnings improve, check whether the company took on more debt.

```figure
type: cycle
title: How the three statements connect
caption: Move between the statements: a gap between profit and cash usually shows up somewhere on the balance sheet.
- Income statement | revenue is earned and recorded as profit
- Balance sheet | unpaid sales sit in receivables until collected
- Cash flow statement | collection turns receivables into operating cash
- Balance sheet again | cash, debt and equity change at the period end
```

## Why profit and cash differ: accruals

Financial statements are prepared on an **accrual** basis. Revenue is recorded when it is earned, usually when goods are delivered or services performed, not when the customer pays. Expenses are recorded when they are incurred, not when they are paid. This gives a better picture of the economic activity in a period than counting cash alone, but it means profit and cash can diverge.

Consider a simple case. On the last day of the financial year, the company delivers $500,000 of goods on 30-day credit. The sale, and the profit on it, appear in this year's income statement. The cash arrives next year. At the year end, the balance sheet shows a $500,000 receivable, and this year's operating cash flow is $500,000 lower than it would have been had the customer paid immediately.

Nothing is wrong with that. Most businesses sell on credit. It becomes a concern only when receivables grow faster than sales year after year, which can mean customers are paying more slowly, or that sales are being recorded more aggressively than cash is being collected.

## Depreciation: spreading the cost of long-lived assets

When a company buys equipment that will be used for several years, it does not record the whole cost as an expense in the year of purchase. Instead, it records the equipment as an asset and spreads the cost over its useful life through **depreciation**. Similar treatment applies to some intangible assets, through **amortisation**.

Suppose the company buys a $1 million machine expected to last five years, with no value at the end. Using straight-line depreciation, it records an expense of $200,000 each year. In the year of purchase, cash falls by the full $1 million, in investing cash flow, while profit falls by only $200,000. In each of the following four years, profit is reduced by $200,000 although no cash is spent on the machine.

```figure
type: compare
title: A $1 million machine over five years
cols: Effect on profit | Effect on cash
caption: The cash leaves in the year of purchase; the expense is spread over the machine's useful life.
- Year of purchase | −$200,000 depreciation | −$1,000,000 investing outflow
- Each of the next four years | −$200,000 depreciation | No cash for the machine
- *Over five years | −$1,000,000 in total | −$1,000,000 in total
```

Over the machine's whole life, total profit and total cash are reduced by the same amount. Only the timing differs. That is why Chapter 4 looks at depreciation alongside the capital expenditure needed to replace worn assets.

## Working capital in one example

**Working capital** is the money tied up in running the business day to day: mainly inventory and receivables, less the amounts owed to suppliers, called payables. Changes in working capital explain much of the gap between profit and operating cash flow.

Take a company with $1 million of net profit in a year. During that year, its receivables rise by $1.5 million because a large customer has not yet paid, its inventory rises by $300,000, and its payables rise by $400,000 because it has taken longer to pay its own suppliers. Ignoring other items, operating cash flow is roughly:

**$1.0m − $1.5m − $0.3m + $0.4m = −$0.4m**

The company reported a profit of $1 million but used $400,000 of cash in its operations. If the customer pays early next year, the position will reverse. If the receivable is never collected, the profit was overstated and will eventually be reduced by a write-off. Either way, the cash flow statement shows what the income statement alone could not.

## Follow one transaction through all three statements

Tracing a single transaction across the statements is the best way to see how they connect. Suppose the company borrows $2 million at 6% interest and uses it to buy a machine with a five-year life.

- **On the day of the purchase:** the balance sheet shows cash up $2 million then down $2 million, a new $2 million machine and a new $2 million loan. The cash flow statement shows $2 million borrowed under financing and $2 million spent under investing. The income statement does not change.
- **Over the first year:** depreciation of $400,000 reduces profit and the machine's book value. Interest of $120,000 reduces profit and, when paid, reduces cash. If the machine helps the company earn more, revenue and operating cash flow rise.

```figure
type: steps
title: One loan and one machine through the statements
caption: Borrowing and buying move the balance sheet and cash flow at once; the income statement feels the cost gradually.
- Borrow $2m | cash and debt both rise; financing inflow
- Buy the machine | cash falls, equipment rises; investing outflow
- Depreciate $400k a year | profit and book value fall; no cash
- Pay $120k interest | profit and cash both fall
- *Earn from the machine | revenue and operating cash rise, if it pays off
```

Whether the purchase was a good decision depends on whether the extra profit from the machine exceeds its depreciation and interest, a question Chapter 6 develops as the return on invested capital.

## The fourth statement and the notes

Annual reports also contain a **statement of changes in equity**. It explains how shareholders' equity moved during the year: profit added, dividends paid out, new shares issued, shares bought back and certain gains or losses recorded directly in equity rather than through profit. It is short, but it shows clearly how much of the year's profit was returned to shareholders and how much new capital was raised.

The **notes to the financial statements** are where the detail lives. They explain accounting policies, break down revenue and expenses, list borrowings with their interest rates and due dates, describe leases, show what is included in intangible assets, and disclose commitments and contingent liabilities that do not appear on the face of the balance sheet. A headline number is often impossible to interpret properly without its note.

## A practical reading order

For a company you are reading for the first time, a sensible order is: the segment and revenue notes, to understand what the business sells; the income statement over several years; the cash flow statement, comparing operating cash flow with profit; the balance sheet, especially debt and working capital; and finally the notes on borrowings, leases and anything unusual. Management's commentary is most useful after this, when you can test its explanations against the numbers.

## When is a sale a sale?

Revenue recognition sets when income appears in the accounts. In Australia, companies apply AASB 15, which is aligned with the international standard IFRS 15. In broad terms, revenue is recognised when the company transfers control of the promised goods or services to the customer, which may happen at a point in time, such as delivery, or over time, as with a long service contract or a construction project.

Over-time recognition requires judgement. A company building a large piece of equipment over eighteen months may recognise revenue as the work progresses, based on its estimate of how far the project has advanced. If those estimates prove optimistic, revenue and profit recognised in earlier years may have to be reversed. The revenue note explains which methods a company uses; for businesses with long contracts, it is worth reading carefully and comparing the timing of revenue with the timing of cash received from customers.

## Leases now sit on the balance sheet

Since AASB 16 took effect, most leases, such as rented premises or leased vehicles, appear on the lessee's balance sheet as a **right-of-use asset** and a matching **lease liability**. The asset is depreciated, and the liability accrues interest, much like a purchase financed by a loan.

This changes how some numbers look. Lease payments are now split in the cash flow statement: the interest portion may sit in operating or financing cash flow depending on the company's policy, and the principal portion sits in financing cash flow. As a result, operating cash flow can look stronger than it did when the whole rent payment was an operating outflow, even though the business pays exactly the same rent. When comparing companies, or one company across the change, check how leases are treated and consider deducting lease payments when judging the cash a business really generates.

## Statutory and "underlying" profit

The income statement shows **statutory profit**, prepared under accounting standards. Many companies also report an "underlying", "adjusted" or "normalised" profit that excludes items management considers unusual, such as restructuring costs, impairment charges or gains on asset sales.

These adjusted figures can help show the ongoing performance of the business, but they are management's choice and are not defined by the accounting standards. Read the reconciliation between the two and ask whether the excluded items really are unusual. A company that excludes "one-off" restructuring costs every year is really reporting a recurring cost. A fair adjusted figure removes both unusual losses and unusual gains; one that excludes only the losses flatters the result.

## Check that the statements agree

The three statements must reconcile, and a quick check builds confidence that you are reading them correctly. The closing cash in the cash flow statement should match the cash on the balance sheet, after allowing for any overdrafts the company nets against cash. The change in retained earnings should equal profit less dividends, adjusted for any items shown in the statement of changes in equity. Movements in borrowings on the balance sheet should match the borrowing and repayment lines in financing cash flow.

If you cannot make a reconciliation work, the notes usually explain why: exchange-rate movements, an acquisition that brought new assets and debts onto the balance sheet, or a reclassification. Working through those explanations is often where the most useful insights about a company emerge.

## Read the auditor's report

Every annual report includes the independent auditor's report on the financial statements. Most of the time it states an unmodified opinion: in the auditor's view, the statements give a true and fair view in accordance with accounting standards. That is reassuring but not a guarantee that the business is sound; an audit examines whether the accounts are properly prepared, not whether the company is a good investment.

Two parts deserve attention. **Key audit matters** describe the areas the auditor considered most significant, such as the valuation of goodwill, revenue on long contracts or the recoverability of large receivables. They point directly to the judgements most likely to affect the numbers. A **material uncertainty related to going concern**, or any modified opinion, is a serious warning that the auditor has doubts about the company's ability to continue operating or about the accounts themselves. Either should prompt careful reading before any further analysis.

## Keep notes as you read

Reading financial statements is easier when you write as you go. A simple page with one line for each year, recording revenue, profit, operating cash flow, debt and the number of shares, builds into a picture no single report provides. Add a short note whenever something needs explaining, such as an acquisition, a change in accounting policy or a large one-off item, and the reason given for it. When the next report arrives, add a line and compare. Over time, these notes become the most valuable research you have, because they show how the business has actually behaved rather than how it was described in any one year.

### Key takeaway

**Income explains performance, the balance sheet explains financial position, and cash flow reveals how money actually moved.**

### Quick reference

| Statement | Main question |
|---|---|
| Income statement | Is the business profitable, and why? |
| Balance sheet | Is it financially resilient? |
| Cash flow statement | Does it generate usable cash? |
