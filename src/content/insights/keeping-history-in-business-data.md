---
title: "Keeping history in business data: revisions, effective dates and audit trails"
description: "Many systems store only what is true now. How to keep the history businesses need: what price applied, which revision was built and who changed what, without drowning in records."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - quality
  - manufacturing
author: "KEVOS®"
featured: false
draft: false
---

A customer disputes an invoice from eight months ago, saying the agreed price was lower. A warranty claim arrives for a machine built two years ago, and engineering needs to know which revision of a critical part went into it. An auditor asks who changed a supplier's bank details and when. A manager wants to compare this year's sales by region with last year's, but several customers have since moved regions. Each question asks what was true at a particular time, and many business systems cannot answer it.

The reason is simple. Many databases and spreadsheets store only the current state of things. When a price changes, the old price is overwritten. When a drawing is revised, the old revision number disappears. When a customer moves, their old address is replaced. The system knows what is true now, but not what was true then, or who changed it.

This article explains why history matters in business data, the different kinds of time a system may need to track, the main techniques for keeping history, including effective dates, revisions, snapshots and audit logs, the common pitfalls, and how to decide how much history is enough. It is general information for managers, engineers and anyone specifying or overseeing business systems.

## Why current-state data is not enough

Storing only current values is simple and efficient, which is why so many systems do it. It fails whenever a business needs to answer questions about the past:

- **Commercial questions**: what price, discount or terms applied to a quote, order or contract when it was made.
- **Engineering and quality questions**: which revision of a design, bill of materials or process was used for a particular batch, serial number or job.
- **Accountability questions**: who approved or changed a record, when and from what to what.
- **Reporting questions**: how results compare across periods when the underlying structure, such as regions, product groups or cost centres, has changed.
- **Legal and regulatory questions**: what information was held or supplied at a given time, for example in a dispute, recall or audit.

A business that cannot answer these questions relies on memory, email searches and goodwill, all of which fail precisely when the stakes are highest.

## Two kinds of time

Database specialists distinguish two kinds of time that a record may need to carry:

- **Valid time** is when a fact is true in the business world. A price list may apply from 1 July to 30 June; an employee may hold a role from one date to another.
- **Recorded time**, often called transaction time, is when the fact was entered or changed in the system.

The difference matters. Suppose a price increase effective from 1 July is entered on 25 June, and an error in it is corrected on 10 July. Asking "what was the price on 5 July?" has two answers: the price the business intended to apply, which is the corrected one, and the price the system showed on that day, which was wrong. For a dispute about an invoice issued on 5 July, the second answer explains what happened; for a commercial agreement, the first may be the right one. Systems that track both kinds of time can answer both questions. Most businesses need valid time for some data and an audit log of recorded changes for important records, rather than full tracking of both for everything.

## Techniques for keeping history

### Effective dates

The simplest way to keep history of changing facts is to store each version with an **effective from** date and, often, an **effective to** date. A price table might hold:

| Item | Price | Effective from | Effective to |
|---|---|---|---|
| Pump P200 | $1,450 | 1 July 2025 | 30 June 2026 |
| Pump P200 | $1,520 | 1 July 2026 | (open) |

To find the price on any date, the system selects the row whose date range includes that date. Future changes can be entered in advance and take effect automatically.

Effective dating suits prices, cost rates, tax and duty rates, employee roles and pay rates, customer terms, organisational structures and approved supplier lists.

### Revisions and versions

Engineering and controlled documents use **revisions**: each change produces a new, identified version, such as revision A, B and C, while earlier revisions are retained and marked superseded. The same principle applies to bills of materials, process routings, inspection plans, procedures and software.

Revision control works best when:

- **Each revision is immutable** once released: changes create a new revision rather than editing the old one.
- **The reason for change is recorded**, along with who approved it and when it became effective.
- **Transactions record the revision used**, so a job, batch or serial number shows exactly which design and process applied.

The [issue, change and configuration control](/insights/issue-change-and-configuration-control/) article explains how revision control fits into wider configuration management.

### Snapshots on transactions

Sometimes the right approach is to copy the relevant values onto the transaction itself at the moment it happens. An invoice line should store the price, description, tax and discount that applied, not just a reference to the item. Later changes to the item's price or description then do not alter the historical invoice.

Snapshots are deliberate exceptions to the principle of storing each fact once. They are justified wherever a transaction must preserve what was agreed or supplied at the time.

### Audit logs

An **audit log** or audit trail records changes to records: which record and field changed, the old and new values, who made the change, when and, ideally, why. Audit logs answer accountability questions and help investigate errors and fraud.

Important records for audit logging include:

- Supplier and customer bank details, credit limits and terms.
- Prices, discounts and cost rates.
- Approvals of orders, payments, quality decisions and engineering changes.
- User access rights.
- Safety-related and quality records.

Audit logs must be protected from alteration, including by administrators where possible, or they lose their value as evidence.

### Append-only records and ledgers

Accounting has long used a different approach: transactions are never edited or deleted, only added. A mistake is corrected by a reversing entry and a new correct entry, so the full history remains visible. This **append-only** principle suits financial records, stock movements, quality inspections and other records where the sequence of events matters. The current position, such as a stock level or account balance, is calculated from the accumulated entries.

### Soft deletion

Deleting records destroys history. Many systems instead mark records as inactive, blocked or archived, a practice called **soft deletion**. The customer, item or supplier no longer appears in normal use, but historical transactions still refer to it and reports remain complete.

### Built-in temporal features

Some database systems now offer built-in support for history. The SQL standard added temporal features in 2011, and several major database products can automatically keep previous versions of rows and answer questions about data as it stood at a past time. When commissioning a system, it is worth asking whether such features are available and used.

### History in reports

Reporting raises its own version of the problem. Suppose a customer moved from the northern sales region to the southern one in March. Should last year's sales to that customer appear under north or south? Reporting specialists call attributes that change occasionally, such as a customer's region or a product's category, **slowly changing dimensions**, and they handle them in a few standard ways:

- **Overwrite** the old value, so all history is reported under the new value. Simple, but past reports change when they are rerun.
- **Add a new version** with effective dates, so each sale is reported under the value that applied when it happened. Past reports stay stable.
- **Keep both values** in separate fields, such as original region and current region, so users can choose.

None is universally right. What matters is choosing deliberately, so that managers comparing periods understand why figures differ, rather than discovering that last year's results have quietly changed.

## Choosing the right technique

| Need | Suitable technique |
|---|---|
| Know what price, rate or term applied on a date | Effective dates |
| Know which design or procedure was used | Revisions, recorded on the transaction |
| Preserve what was agreed or supplied | Snapshots on the transaction |
| Know who changed what and when | Audit log |
| Keep a complete sequence of events | Append-only records |
| Retire records without breaking history | Soft deletion |
| Compare results across reorganisations | Effective-dated structures, such as region membership by date |

Most business systems combine several of these techniques.

## Common pitfalls

- **Overlapping or gapped date ranges.** Two prices effective on the same day, or no price at all for a period, produce errors. Systems should check that ranges neither overlap nor leave gaps where continuity is required.
- **Retrospective changes.** Changing an effective date or value after transactions have used it rewrites history. Corrections should be visible, not silent.
- **Time zones and daylight saving.** Businesses operating across Australian states, or internationally, can record events in different local times. Many systems store times in Coordinated Universal Time and convert them for display, so events can be ordered reliably.
- **Revision not recorded on the transaction.** Keeping old drawings is of little use if production records do not show which revision was built.
- **Audit logs nobody can read.** Logs stored in a technical format that only a developer can query are rarely used. Important change histories should be visible to the people who need them.
- **Unlimited history.** Keeping every change to every field forever increases storage, slows systems and may conflict with privacy obligations to destroy personal information that is no longer needed. Decide what history is needed and for how long.

## How much history is enough

Keeping history has costs: design effort, storage, performance and complexity for users. A practical approach is to decide, for each important kind of data:

1. **Which questions about the past the business must be able to answer.**
2. **How far back those questions reach**, based on warranties, contracts, product life, legal retention requirements and audit needs.
3. **Which technique answers them most simply.**
4. **Who needs to see the history**, and how they will find it.
5. **When history can be archived or destroyed**, in line with legal requirements and privacy obligations.

In Australia, retention periods for some records are set by law. For example, the Australian Taxation Office generally requires business records to be kept for five years, companies must keep financial records for seven years under the Corporations Act, and employers must keep employee records for seven years under the Fair Work Act. Industry, safety and product regulations can require longer periods for particular records. Check requirements that apply to your business with your advisers. The [keeping the record of what you promised](/insights/keeping-the-record-of-what-you-promised/) article shows the same principle of preserving history applied to project plans.

## A worked example

This is an illustrative example. A manufacturer of hydraulic power units builds about 300 units a year. Its job system stores each unit's serial number, customer and model, and the bill of materials links to the current revision of each part. Old revisions of drawings are kept in a folder, but jobs do not record which revisions were used.

**The problem.** A customer reports cracking in a manifold block on a unit built 18 months earlier. Engineering knows that the manifold design was changed twice in the past two years, once to correct a weakness. Without records of which revision went into which unit, the business cannot tell which customers might be affected and considers contacting all 450 customers who bought units in the period.

**Changes made.** The business changes its system so that each job records the revision of every controlled part and the bill of materials revision at the time of build, as snapshots on the job. Bill of materials changes become effective from a date, with the engineering change number recorded. Price lists are effective-dated, and an audit log is turned on for prices, customer terms and supplier bank details.

**Reconstruction.** For the existing fleet, engineering and production reconstruct the revisions used from purchase and goods receipt records for the manifold blocks, identifying about 110 units built with the weaker revision.

**Result.** The business contacts 110 customers rather than 450 and replaces the affected blocks under a planned program. For future units, the same question can be answered in minutes from the job records.

## Applying this in an Australian business

- **List the questions about the past** your business must be able to answer.
- **Effective-date** prices, rates, terms and structures.
- **Record revisions on transactions** for designs, bills of materials and procedures.
- **Snapshot agreed values** on quotes, orders and invoices.
- **Log changes** to sensitive records, and protect the logs.
- **Use soft deletion** instead of deleting records with history.
- **Set retention periods** that meet legal and business needs, and destroy what is no longer required.

## Questions worth considering

- Could we tell which revision of each critical part went into a product built two years ago?
- Could we show what price applied to a disputed invoice and who set it?
- Who can change prices, terms and bank details, and is each change logged?
- Do our reports change when we reorganise regions or product groups?
- How long do we keep history, and is that period based on any requirement?

## Bringing it together

Many business systems remember only the present, but businesses are constantly asked about the past. Keeping history means choosing the right technique for each need: effective dates for changing prices and terms, revisions recorded on transactions for designs and procedures, snapshots for what was agreed, audit logs for who changed what, append-only records for sequences of events and soft deletion for retired records. Decide which questions must be answered and for how long, and design history in from the start, because reconstructing it later is slow, costly and sometimes impossible.

---

*Source: KEVOS® editorial notes, drawing on general database design and records management practice. Record-keeping periods are summarised for orientation only; check current requirements with your advisers and the relevant authorities. The worked example is illustrative. This article is general information.*
