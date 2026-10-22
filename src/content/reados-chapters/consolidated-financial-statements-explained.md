---
title: "Consolidated financial statements: reporting a group as one business"
description: "How a parent and its subsidiaries are combined into one set of accounts: adding line by line, eliminating the investment and intra-group dealings, recognising goodwill and non-controlling interests."
publishDate: 2026-10-04
category: "Business"
tags:
  - finance
  - systems
  - operations
author: "GoCore"
featured: false
draft: false
---

Many businesses are really groups of companies. A manufacturer might have a separate company for each factory, another for its distribution business and another holding its intellectual property. An Australian family business might combine an operating company, a property-holding entity and a company that employs staff. A listed company might own hundreds of subsidiaries across many countries.

Each of these companies keeps its own accounts. But looking at them one by one can give a misleading picture. Sales between group companies inflate revenue; loans between them inflate both assets and liabilities; profits can be moved around through internal pricing. To show the group's real position and performance, accounting standards require **consolidated financial statements**: one set of accounts presenting the parent and its subsidiaries as a single economic entity.

This article explains how consolidation works in practice: the steps, a worked example, the treatment of non-controlling interests, the elimination of transactions within the group, and what consolidated statements do and do not reveal. It builds on [What control means](/reados/collections/acquisitions-groups-and-investment-accounting/what-control-means-in-accounting/) and is part of GoCore's series on investments, groups and acquisitions.

## The single economic entity

The central idea of consolidation, emphasised in the source course material, is that a parent and its subsidiaries are presented as a single economic entity. Although they are separate legal entities, for financial reporting the subsidiaries are treated as if they were divisions of the parent.

Two consequences follow:

1. **Everything the group controls is included.** The subsidiaries' assets, liabilities, revenues, expenses and cash flows are added to the parent's in full, even if the parent owns less than 100%.
2. **Nothing the group does with itself counts.** Transactions and balances between group members are removed, because a business cannot earn revenue from itself, owe money to itself or invest in itself.

## The basic steps

Consolidation is usually prepared using a worksheet that starts from each entity's own accounts and makes adjustments. The main steps are:

```figure
type: steps
title: The basic consolidation steps
caption: Include everything the group controls; remove everything the group does with itself.
- Align the accounts | same reporting date and policies
- Add line by line | cash with cash, revenue with revenue
- Eliminate the investment | against the subsidiary's equity
- Recognise non-controlling interests | their share of equity and profit
- *Eliminate intra-group items | loans, sales, fees and unrealised profit
```

1. **Align the accounts.** Ensure subsidiaries use the same reporting date and consistent accounting policies, adjusting where necessary.
2. **Add line by line.** Combine like items: cash with cash, receivables with receivables, revenue with revenue, and so on.
3. **Eliminate the investment.** Remove the parent's investment in each subsidiary against the parent's share of the subsidiary's equity at acquisition, recognising goodwill and fair value adjustments from the acquisition.
4. **Recognise non-controlling interests.** Show the share of subsidiaries' equity and profit belonging to other owners.
5. **Eliminate intra-group balances.** Remove receivables and payables, loans and other balances between group members.
6. **Eliminate intra-group transactions.** Remove sales and purchases, interest, management fees, dividends and other transactions between group members.
7. **Eliminate unrealised profits.** Remove profits on goods or assets sold within the group that have not yet been sold to outside parties.

## A worked example: at acquisition

This is an illustration with round numbers, in thousands of dollars.

On 1 July, Parent Co buys 80% of Sub Co for $400,000. On that date, Sub Co's identifiable net assets are $450,000, and for simplicity their fair values equal their book values.

The balance sheets immediately after the acquisition:

| | Parent Co | Sub Co | Adjustments | Consolidated |
| --- | --- | --- | --- | --- |
| Cash | 200 | 100 | | 300 |
| Investment in Sub Co | 400 | — | −400 | — |
| Other assets | 900 | 650 | | 1,550 |
| Goodwill | — | — | +40 | 40 |
| **Total assets** | **1,500** | **750** | | **1,890** |
| Liabilities | 500 | 300 | | 800 |
| Equity: Parent Co shareholders | 1,000 | — | | 1,000 |
| Equity: Sub Co | — | 450 | −450 | — |
| Non-controlling interest | — | — | +90 | 90 |
| **Total liabilities and equity** | **1,500** | **750** | | **1,890** |

How the adjustments are calculated:

```figure
type: formula
title: Parent Co buys 80% of Sub Co for $400,000
formula: NCI = 20% × Sub Co net assets
formula: Goodwill = Price paid − 80% × Sub Co net assets
caption: Proportionate-share method; Sub Co's net assets are $450,000 at fair value.
step: NCI = 20% × $450,000 = $90,000
step: Goodwill = $400,000 − $360,000 = $40,000
step: Investment ($400,000) and Sub Co equity ($450,000) are eliminated
```

- **Non-controlling interest:** 20% of Sub Co's net assets of $450,000 = **$90,000**.
- **Goodwill:** the $400,000 paid, less Parent Co's 80% share of Sub Co's net assets ($360,000) = **$40,000**.
- **Elimination:** Parent Co's investment ($400,000) and Sub Co's equity ($450,000) are removed, replaced by goodwill ($40,000) and the non-controlling interest ($90,000).

The consolidated balance sheet shows the group's combined cash, other assets and liabilities, goodwill from the acquisition, the equity of Parent Co's shareholders and the share belonging to Sub Co's other shareholders.

### Two ways to measure non-controlling interests

Under Australian standards (AASB 3), a parent can choose, for each acquisition, to measure the non-controlling interest either at its **proportionate share of the subsidiary's identifiable net assets**, as in the example, or at **fair value**. Measuring it at fair value usually produces a larger non-controlling interest and larger goodwill, sometimes called "full goodwill", because goodwill is then recognised for the whole subsidiary, not only the parent's share. US standards require non-controlling interests to be measured at fair value.

## After acquisition: profits and non-controlling interests

In later periods, the subsidiary's profits are included in full in consolidated profit. Consolidated profit is then divided between:

- **owners of the parent**, and
- **non-controlling interests**, their share of the subsidiary's profit.

Continuing the example, suppose Sub Co earns a profit of $60,000 in its first year. Consolidated profit includes all $60,000, of which $12,000 (20%) is attributed to the non-controlling interest. The non-controlling interest on the balance sheet rises accordingly.

```figure
type: stack
title: Sub Co's $60,000 first-year profit in the group accounts
unit: $'000
caption: All $60,000 is included in consolidated profit, then attributed between the owners.
- Owners of Parent Co, 80% | 48
- Non-controlling interest, 20% | 12
```

## Eliminating intra-group transactions

Suppose that, during the year:

- Parent Co lends Sub Co $100,000.
- Parent Co sells goods that cost it $30,000 to Sub Co for $50,000, and Sub Co still holds half of them at year end.
- Sub Co pays Parent Co a management fee of $10,000.

In the consolidated statements:

**The loan disappears.** Parent Co's receivable and Sub Co's payable of $100,000 cancel out, along with any interest income and expense between them. From the group's perspective, it owes the money to itself.

**The sale is removed.** Group revenue and cost of sales are both reduced by $50,000. The group has not sold anything to an outside customer.

**Unrealised profit is eliminated.** Parent Co made a $20,000 profit on the sale. Half the goods are still held within the group, so half the profit, $10,000, is unrealised. The group's inventory is reduced by $10,000, back to its cost to the group, and group profit is reduced by the same amount. The profit will be recognised when Sub Co sells the goods to an outside customer.

**The management fee cancels.** Parent Co's fee income and Sub Co's fee expense of $10,000 are both removed.

**Dividends within the group are removed.** If Sub Co pays a dividend, the share received by Parent Co is eliminated against Sub Co's dividend, and the share paid to non-controlling interests reduces the non-controlling interest.

## Why eliminations matter

Without eliminations, a group could appear larger and more profitable than it is. Selling goods between subsidiaries at a markup would create revenue and profit from nothing. Lending money between group companies would inflate assets and liabilities. Consolidation removes these internal effects so that the group's statements reflect only dealings with the outside world.

## Fair value adjustments and goodwill

When a subsidiary is acquired, its identifiable assets and liabilities are measured at fair value in the consolidated statements, even though the subsidiary's own accounts may continue to show book values. If a building is worth more than its book value, the consolidated statements show the higher value and depreciate it accordingly. Identifiable intangible assets not recorded in the subsidiary's own books, such as customer relationships or brands, may also be recognised in the consolidated statements.

Goodwill arising on acquisition is recognised only in the consolidated statements. Under Australian standards it is not amortised, but it is tested for impairment at least annually. These topics are explained in [Goodwill in acquisitions](/reados/collections/acquisitions-groups-and-investment-accounting/goodwill-in-acquisitions/).

## Changes in ownership without losing control

A parent's percentage ownership of a subsidiary can change while it keeps control, for example if it buys out some minority shareholders, or sells a small stake to a new investor. Under Australian standards, such changes are treated as transactions between owners. No gain or loss is recognised in profit, and goodwill is not remeasured. Instead, the carrying amount of the non-controlling interest is adjusted to reflect the new ownership split, and any difference between that adjustment and the amount paid or received is recognised directly in equity attributable to the parent.

The logic follows from the single economic entity view: if the group still controls the subsidiary, nothing has changed about the group's assets and liabilities; only the division of ownership among its shareholders has changed. By contrast, losing control is treated as disposing of the subsidiary, with any retained interest remeasured at fair value and a gain or loss recognised in profit.

## What consolidated statements reveal, and what they hide

Consolidated statements give the best overall picture of a group's scale, performance and financial position. But they have limits.

**Legal entities still matter.** Creditors of a subsidiary generally have claims against that subsidiary, not the whole group, unless guarantees or cross-guarantees apply. Cash in one subsidiary may not be freely available to another, especially across countries.

**Non-controlling interests have claims.** A share of subsidiaries' profits and net assets belongs to other owners.

**Segment information helps.** Listed groups disclose information about their operating segments, which reveals how different parts of the group perform. Without it, strong and weak businesses can be hidden inside a single total.

**Parent-only information can matter.** For lenders to the parent company specifically, the parent's own position, including its ability to receive dividends from subsidiaries, may be more relevant than the consolidated picture.

## Consolidation in Australian practice

Whether consolidated statements are required depends on whether an entity must prepare financial statements under the Corporations Act and accounting standards. Listed entities, public companies, large proprietary companies and certain other entities generally have financial reporting obligations, and where they control other entities they generally prepare consolidated statements. Many small proprietary companies have no general obligation to prepare financial reports, though they may still prepare them for lenders, investors or management. The thresholds and requirements change from time to time, so current rules should be checked.

Two other kinds of consolidation should not be confused with financial reporting consolidation:

- **Tax consolidation:** Australia's income tax consolidation regime allows wholly owned groups headed by an Australian company to choose to be treated as a single entity for income tax. Its rules differ from those of accounting consolidation.
- **Management reporting:** businesses often prepare combined management accounts for their group of entities, which may or may not follow accounting standards.

## Practical tips for growing groups

For businesses that are building groups of entities:

- **Keep intra-group transactions well documented.** Clear records of loans, charges and sales between entities make consolidation and tax compliance much easier.
- **Align reporting dates and accounting policies.** Different year ends and policies make consolidation harder.
- **Reconcile intra-group balances regularly.** Mismatches between what one entity says another owes are a common source of errors.
- **Understand who owns what.** Keep a current group structure chart showing ownership percentages and control.
- **Plan for reporting obligations.** As a group grows, it may cross thresholds that bring new reporting and audit requirements.

## Common mistakes

**Adding accounts without eliminations.** Internal revenue, profits and balances inflate the group's figures.

**Forgetting unrealised profit in inventory.** Profit on goods still held within the group must be removed.

**Ignoring non-controlling interests.** Part of subsidiaries' profit and equity belongs to others.

**Assuming group cash is freely available.** Legal entities, lenders and regulations can restrict movements.

**Confusing accounting and tax consolidation.** They follow different rules.

## Questions to ask

- Which entities does the parent control, and are they all included?
- Have all intra-group balances and transactions been eliminated?
- How are non-controlling interests measured and presented?
- What fair value adjustments and goodwill arose on acquisitions?
- For your own business: if you combined all your entities' accounts, what would the group really look like?

## Bringing it together

Consolidated financial statements present a parent and its subsidiaries as a single economic entity. They combine the entities' accounts line by line, eliminate the parent's investment against the subsidiaries' equity, recognise goodwill and fair value adjustments from acquisitions, show non-controlling interests, and remove all balances, transactions and unrealised profits within the group.

The result is the most complete picture of a group's scale and performance, though legal entities, non-controlling interests and restrictions on cash still matter. For growing businesses, good records of intra-group dealings and a clear structure make consolidation, and the decisions it informs, far easier.

---

*Sources: course materials from an advanced financial reporting course (Module 1, based on US GAAP), together with Australian Accounting Standards, including AASB 3 and AASB 10. Figures are illustrations. This article is general information, not accounting, tax or financial advice; consult a qualified accountant about your circumstances.*
