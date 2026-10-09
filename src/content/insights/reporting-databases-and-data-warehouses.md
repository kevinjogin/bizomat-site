---
title: "Reporting databases and data warehouses: separating day-to-day systems from analysis"
description: "Reports run on live systems slow work and disagree with each other. How reporting copies, data warehouses and dimensional models give consistent figures, and how to start small."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - strategy
author: "KEVOS"
featured: false
draft: false
---

As a business grows, its questions grow faster than its systems' standard reports. Managers want sales by customer, product and region over three years; margin by job compared with estimate; on-time delivery by supplier; and figures that combine the ERP system, the CRM, the online shop and the timesheet application. The usual response is a growing collection of spreadsheet exports, assembled by hand each month by someone who knows which numbers to trust and which to adjust.

That approach works up to a point. Then month-end reporting takes days, different reports give different answers to the same question, heavy queries slow the systems staff use to serve customers, and history disappears whenever a source system overwrites old values. The underlying problem is that systems designed to record transactions are poorly suited to analysing them.

This article explains the difference between transaction and analytical workloads, why reporting directly on live systems causes trouble, the range of options from reporting copies to data warehouses, how dimensional models organise data for analysis, how data is loaded and checked, and how a business can start small. It is general information for managers, finance staff and analysts in small and medium businesses.

## Two different kinds of work

Database specialists distinguish two kinds of workload:

| | Transaction processing | Analytical processing |
|---|---|---|
| Purpose | Record business events reliably | Summarise and analyse events |
| Typical activity | Many small reads and writes, such as entering an order | Fewer, larger reads, such as totalling a year of sales |
| Users | Staff serving customers and running operations | Managers, analysts, finance |
| Design priority | Accuracy, speed of individual transactions, no duplication | Fast summaries, history, consistent definitions |
| Data | Current state, detailed | History over many years, often summarised |

Business systems such as ERP, CRM and accounting software are designed for transaction processing. Their databases are normalised, storing each fact once across many related tables, which is ideal for recording data accurately but makes analytical queries complex and slow.

## Why reporting on live systems causes trouble

- **Performance.** Large analytical queries compete with staff entering orders and serving customers, slowing everyone.
- **Complexity.** Answering a simple question may require joining a dozen tables whose meanings are undocumented.
- **Scattered data.** Customers may be in the CRM, orders in the ERP, web sales in the online shop and hours in a timesheet system, each with its own codes.
- **Lost history.** Many systems overwrite values, such as a customer's region or a product's category, so past figures change when structures change.
- **Inconsistent definitions.** Each report author decides what counts as a sale, a late delivery or an active customer, so reports disagree.

## The options

Businesses can choose from a range of approaches, each suited to a stage of growth:

| Option | What it is | Suits | Effort and cost |
|---|---|---|---|
| Built-in reports | Standard reports within each application | Simple, single-system questions | Low |
| Reporting copy | A regularly refreshed copy of a system's database used for queries | Heavy queries on one system | Low to moderate |
| Consolidated reporting database | A database combining selected data from several systems | Questions across systems | Moderate |
| Data warehouse | An integrated, historical store organised for analysis | Consistent, multi-year reporting across the business | Moderate to high |
| Data lake or lakehouse | Large stores of raw and structured data, often in the cloud | Very large or varied data, including machine and text data | Moderate to high |

Most small and medium businesses benefit from moving progressively: start with a reporting copy or a small consolidated database for the most painful questions, then grow towards a warehouse as needs justify.

## What a data warehouse is

The term **data warehouse** was popularised by Bill Inmon, who in the early 1990s described it as a collection of data that is subject-oriented, integrated, time-variant and non-volatile:

- **Subject-oriented**: organised around business subjects such as sales, purchasing and production, rather than around applications.
- **Integrated**: combining data from different systems with consistent codes and definitions.
- **Time-variant**: keeping history, so the business can see how things changed.
- **Non-volatile**: data is added and kept rather than overwritten.

Around the same time, Ralph Kimball developed **dimensional modelling**, a practical way of organising warehouse data so that business users can query it easily. Both approaches remain influential, and many modern warehouses combine their ideas.

## Dimensional models: facts and dimensions

A dimensional model organises data into two kinds of table:

- **Fact tables** record measurable business events, such as sales lines, production runs or deliveries, with numbers such as quantity, revenue, cost and hours.
- **Dimension tables** describe the context of those events: date, customer, product, region, supplier, employee or machine.

A fact table at the centre, surrounded by dimension tables, is called a **star schema**, from the shape of its diagram. For sales, a fact table might hold one row per invoice line, with links to the date, customer, product, salesperson and region, and measures such as quantity, revenue, cost and margin.

### Choosing the grain

The most important design decision for a fact table is its **grain**: what one row represents. One row per invoice line allows analysis by product and customer; one row per invoice does not. Choosing the most detailed grain the business can reasonably capture keeps options open, because detailed data can always be summarised but summaries cannot be broken down.

### Keeping history in dimensions

When a customer moves region or a product moves category, the warehouse must decide whether past sales stay with the old value or move to the new one. Warehouses often keep both by adding a new version of the dimension record with effective dates, so historical reports remain stable and current views are still possible.

## Getting data in: extract, transform and load

Data reaches a warehouse through processes known as **extract, transform and load**, or ETL. Increasingly, data is loaded first and transformed within the warehouse, sometimes described as ELT.

- **Extract**: copy new and changed data from source systems, ideally without slowing them.
- **Transform**: standardise codes, match customers and products across systems, calculate measures, apply business rules and check quality.
- **Load**: add the results to fact and dimension tables.

Good loading processes:

- **Run automatically** on a schedule, often overnight, or more frequently where needed.
- **Load only changes** after the first full load, to save time and cost.
- **Check quality**, such as reconciling totals with source systems and flagging records that fail rules.
- **Record lineage**, so users can see where each figure came from.
- **Alert someone** when a load fails, rather than silently leaving old data.

## One set of definitions

A warehouse is valuable only if its figures are trusted. That depends on agreed **definitions** of key measures and terms:

- What counts as revenue: invoiced, delivered or ordered? Including or excluding freight and GST?
- What is an on-time delivery: by the promised date, the requested date or within a tolerance?
- What is an active customer: one who bought in the past 12 months, or 24?
- How are credit notes, returns and cancellations treated?

Record definitions in a data dictionary, have them approved by the business owners of each area, and implement them once in the warehouse rather than in every report. The [reports that change decisions](/insights/reports-that-change-decisions/) article explains how to present trusted figures so that people act on them.

## How fresh does data need to be

Many analytical questions are well served by data refreshed overnight. Some, such as today's production output or open orders at risk, need more frequent updates. More frequent refreshes cost more and add complexity. Decide refresh frequency by question, not by default, and make the "data as at" time visible on every report.

## Cloud data warehouses

Cloud services now offer analytical databases that store data by column, scale automatically and charge by storage and the computing used to run queries. They lower the entry cost for small businesses, but costs can rise with heavy or inefficient use. Monitor usage, set budgets and alerts, and design reports to query efficiently.

## Data lakes and when they make sense

A **data lake** stores large volumes of data in its raw form, such as files exported from systems, machine logs, sensor readings, documents and images, usually in low-cost cloud storage. Structure is applied when the data is read rather than when it is stored. Lakes suit organisations with very large or varied data, data scientists who want raw detail, and uses such as machine learning. Newer **lakehouse** designs add warehouse-like structure and query performance on top of lake storage.

For most small and medium businesses, a lake is not the first step. Without careful organisation and documentation, lakes become collections of files nobody can find or trust. A modest warehouse built around clear business questions usually delivers value sooner, and a lake can be added later for data that does not fit the warehouse, such as high-frequency machine readings.

## Governance and security

Reporting databases concentrate information from across the business, which makes them valuable and sensitive. Apply the same care as to source systems:

- **Control access** by role, especially for pay rates, margins and personal information.
- **Remove or mask personal information** that analysis does not need.
- **Assign owners** for each subject area and its definitions.
- **Document** sources, transformations and definitions.
- **Back up** the warehouse and its loading code.

## Starting small

A practical path for a small or medium business:

1. **Choose one painful subject**, such as sales reporting, where manual effort is high and value is clear.
2. **List the questions** managers need answered and agree the definitions.
3. **Identify sources** and check their data quality.
4. **Build a simple star schema** at the most detailed sensible grain.
5. **Automate the load** with reconciliation checks.
6. **Connect a reporting tool** and replace the manual spreadsheets.
7. **Retire the old reports**, so there is one version of the truth.
8. **Extend to the next subject**, such as purchasing, production or jobs.

The [turning business data into decisions](/insights/turning-business-data-into-decisions/) article covers the broader steps from collecting data to using it.

## Knowing whether it is working

A reporting database is a business asset, so measure its value like one:

- **Time to produce regular reports**, compared with the manual process it replaced.
- **Number of manual spreadsheet reports retired.**
- **Load reliability**: how often nightly loads fail or need correction.
- **Reconciliation results**: how often warehouse totals disagree with source systems, and why.
- **Use**: how many people use the reports, and which reports nobody opens.
- **Time to answer a new question**, which shows whether the design is flexible enough.

## Common mistakes

- **Building everything at once** instead of one subject at a time.
- **Copying source tables unchanged**, which moves the complexity rather than removing it.
- **Skipping definitions**, so the warehouse reproduces old disagreements.
- **Choosing too coarse a grain**, preventing later analysis.
- **Ignoring data quality** in sources, so the warehouse displays errors faster.
- **Leaving old spreadsheet reports running** alongside the new ones.
- **No owner** for the loading process, so failures go unnoticed.

## A worked example

This is an illustrative example. A distributor of building products uses an ERP system for orders, stock and invoicing, a CRM for customer contacts and sales opportunities, and an online shop for trade customers. Monthly sales reporting takes a finance analyst about four days, combining exports in spreadsheets, and sales managers often dispute the figures.

**Scope.** The business starts with sales reporting. Managers list 20 questions, such as sales and margin by customer, product group, branch and salesperson, compared with the same month last year.

**Definitions.** The finance and sales managers agree that revenue means invoiced value excluding GST and freight, net of credit notes, and that customers are matched across systems by account number.

**Build.** A consultant builds a small cloud reporting database with a sales fact table at invoice-line grain and dimensions for date, customer, product, branch and salesperson, keeping history when customers change branch or salesperson. Data loads nightly, and totals are reconciled with the ERP's invoice register automatically. The build costs about $25,000 and running costs about $600 a month in this illustration.

**Result.** Monthly reporting falls from four days to about half a day, mostly reviewing results. Disputes over figures largely stop because definitions are visible. Within a year, the business adds purchasing and stock data to the same warehouse.

## Applying this in an Australian business

- **Separate analysis from transaction systems** once reporting becomes heavy.
- **Start with one subject** where manual effort and value are highest.
- **Agree definitions** and record them in a data dictionary.
- **Design at a detailed grain** and keep history in dimensions.
- **Automate loading** with reconciliation checks and failure alerts.
- **Protect sensitive data** in reporting databases.
- **Retire old reports** once the new ones are trusted.
- **Remember Australian specifics**, such as GST treatment and the July to June financial year, in definitions and date tables.

## Questions worth considering

- How many hours do we spend each month assembling reports by hand?
- Do different reports give different answers to the same question?
- Which questions require data from more than one system?
- Do our historical figures change when we reorganise regions or product groups?
- Who owns the definitions of our key measures?

## Bringing it together

Transaction systems are designed to record business events, not to analyse them. Reporting copies, consolidated reporting databases and data warehouses separate analysis from day-to-day work, combine data from several systems, keep history and apply consistent definitions. Dimensional models of facts and dimensions make the data easy to query. Start with one painful subject, agree definitions, automate loading with checks and grow from there, retiring manual reports as trust in the new figures builds.

---

*Source: KEVOS editorial notes, drawing on general business intelligence and data warehousing practice. Costs in the worked example are illustrative assumptions. This article is general information.*
