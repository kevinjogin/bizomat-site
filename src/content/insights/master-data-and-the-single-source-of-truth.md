---
title: "Master data and the single source of truth: product codes, customer records and supplier details"
description: "Item, customer and supplier records drive every order, invoice and report. How to define master data, give it owners, control changes, remove duplicates and protect payments."
publishDate: 2026-10-09
category: "Operations"
tags:
  - systems
  - operations
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Every order, purchase, invoice, production job and report in a business draws on a small set of core records: the products and parts it makes and buys, the customers it sells to, the suppliers it buys from, its locations, its employees and its price lists. These records are called **master data**. When they are accurate and consistent, transactions flow smoothly and reports can be trusted. When they are not, the problems appear everywhere at once: wrong prices on invoices, stock held under two part numbers, deliveries sent to old addresses, reports that disagree, and payments sent to bank accounts that criminals have quietly substituted.

Master data problems are rarely caused by software alone. They come from how records are created and changed: who is allowed to add a new part, whether anyone checks for an existing one first, which system holds the official version, and what happens when a supplier asks to change their bank details. Fixing them is mostly a matter of clear ownership, simple rules and steady discipline.

This article explains what master data is, how it differs from other business data, why it matters so much to manufacturers and distributors, how to decide which system holds the official version of each record, how to control creation and change, how to find and fix duplicates, how to protect supplier payment details, and how to measure master data quality. It is general information for managers in small and medium businesses.

## Three kinds of business data

Business data can be divided into three broad kinds:

| Kind | What it is | Examples | How it changes |
|---|---|---|---|
| **Master data** | The core things the business deals with | Items and parts, customers, suppliers, employees, locations, assets | Created occasionally, changed now and then, used constantly |
| **Transaction data** | Events involving master data | Orders, receipts, invoices, payments, production jobs, timesheets | Created continuously, rarely changed after completion |
| **Reference data** | Shared lists and codes used to classify other data | Units of measure, currencies, countries, payment terms, defect codes | Changes rarely and is often set by standards |

The distinction matters because errors behave differently. A wrong transaction affects one order. A wrong master record affects every transaction that uses it, often for months before anyone notices. A part with the wrong unit of measure, for example, can distort every purchase, stock count and cost calculation that involves it.

## Why master data matters to manufacturers and distributors

### The item master

In manufacturing and distribution, the most important master data is usually the **item master**: the list of every part, material, sub-assembly and finished product the business buys, makes, stocks or sells. Each item record typically holds:

- **Identification**: item number, description and classification.
- **Units of measure**: the unit stocked, bought and sold, and the conversions between them, such as metres stocked and lengths of six metres purchased.
- **Engineering information**: drawing number, current revision, material and specifications.
- **Planning information**: lead time, minimum order quantity, reorder point and whether the item is made or bought.
- **Cost and price information**: standard cost and selling prices.
- **Supplier information**: approved suppliers and their part numbers.
- **Quality and compliance**: inspection requirements, certificates and traceability needs.

Errors in any of these fields ripple outward. A wrong lead time leads to late orders; a wrong unit conversion leads to over- or under-ordering; a duplicate item leads to stock in one record and shortages in another.

### Customer and supplier records

Customer records control credit, pricing, delivery and invoicing. Supplier records control purchasing and, critically, payments. Both need accurate legal names, Australian Business Numbers where relevant, addresses, contacts and terms.

## One source of truth for each kind of record

Many businesses hold the same master data in several systems: the accounting package, the inventory or ERP system, a CRM, a quoting spreadsheet, the website and a CAD or product data system. If each can be edited independently, they drift apart.

The remedy is to decide, for each kind of master data, which system is the **system of record**: the one place where the official version is created and changed. Other systems receive copies from it, ideally automatically, and do not change those records themselves.

| Master data | Typical system of record | Systems that receive copies |
|---|---|---|
| Item engineering details | Product data or engineering system | ERP, quoting, website |
| Item stock, cost and planning details | ERP or inventory system | Accounting, reporting |
| Customers | CRM or ERP | Accounting, website, quoting |
| Suppliers | ERP or accounting system | Purchasing, reporting |
| Employees | Payroll or human resources system | Timesheets, access control |

The choice depends on the business's systems. What matters is that the choice is made, written down and followed.

## Ownership and stewardship

Every kind of master data needs a business owner who decides what each field means and what good looks like, and people responsible for maintaining it day to day, sometimes called **data stewards**. Typical arrangements include:

- **Engineering** owns item descriptions, revisions and specifications.
- **Purchasing** owns supplier details and purchased-item lead times.
- **Sales or customer service** owns customer contacts and delivery details.
- **Finance** owns payment terms, credit limits and supplier bank details.
- **Operations or planning** owns stocking and planning parameters.

Ownership by field, rather than only by record, reflects reality: several departments contribute to one item record. The [data readiness is a business habit](/insights/data-readiness-is-a-business-habit/) article explains why giving data a business owner is the foundation of usable information.

## Controlling how records are created

Most duplicates and inconsistencies are created at the moment a new record is added, often in a hurry. A simple creation process prevents many problems:

1. **Search first.** Before creating a new item, customer or supplier, search for an existing one by several attributes, such as description, supplier part number, ABN or address.
2. **Use a request form.** Collect all required information in one place, with mandatory fields for what the business needs.
3. **Apply naming standards.** Descriptions follow an agreed pattern, such as noun first then attributes, so similar items sort and search together, for example "Bolt, hex, M12 x 50, grade 8.8, zinc plated".
4. **Check and approve.** The data steward checks for duplicates and completeness before the record is activated.
5. **Restrict who can create records.** A small number of trained people create master records, rather than everyone with system access.

### Item numbering

Businesses often debate whether item numbers should be "intelligent", with codes that encode the product family, material or size, or simple sequential numbers. Intelligent codes are easy for people to read but break when products do not fit the scheme or attributes change. Sequential numbers never need to change but carry no meaning. Many businesses use simple numbers for identification and store the attributes as separate, searchable fields, which gives the benefits of both.

## Controlling how records change

Changes to master data can matter as much as creation. Good practice includes:

- **Defined change authority**: who may change prices, lead times, revisions or credit limits.
- **Approval for sensitive changes**: such as price changes beyond a threshold or changes to bank details.
- **A change log**: recording what changed, from what to what, who changed it and when.
- **Effective dates**: so that new prices or revisions apply from a specified date rather than retrospectively.
- **Linked engineering change**: when a design changes, the related item, bill of materials and documents are reviewed together. The [issue, change and configuration control](/insights/issue-change-and-configuration-control/) article explains configuration control in more detail.

## Protecting supplier bank details

Supplier master data is a favourite target of fraud. In a common scam, a criminal impersonates a supplier, often using a compromised or look-alike email address, and asks for the supplier's bank details to be changed. The next payments go to the criminal's account. Australian government cyber security guidance warns businesses about this type of business email compromise, and losses can be large and hard to recover.

Practical controls include:

- **Never change bank details on the strength of an email alone.**
- **Verify changes by calling the supplier** on a phone number already held on file, not one supplied in the request.
- **Require a second person** to approve any change to payment details.
- **Notify the supplier** through a separate channel after a change is made.
- **Review the change log** for bank detail changes regularly, especially before payment runs.
- **Pay attention to timing**, as requests often arrive just before large payments are due.

The [cyber security basics for small businesses](/insights/cyber-security-basics-for-small-businesses/) article covers the wider defences against email-based fraud.

## Reference data and units of measure

Reference data, such as units of measure, currencies, countries and defect codes, looks trivial but causes a surprising share of errors. Units of measure are the classic example. An item might be bought by the box of 100, stocked in individual pieces and sold in packs of 10; a pipe might be bought in six-metre lengths and issued by the metre. If conversions are missing or wrong, every purchase, stock count and cost is distorted.

Keep reference lists short, controlled and shared across systems. Where standards exist, use them: the United Nations publishes standard codes for units of measure used in electronic trade, and GS1, whose Australian member organisation issues barcode numbers, provides global standards for identifying products and locations. Using recognised codes makes exchanging data with customers and suppliers much easier.

## Master data during system changes

A new ERP, accounting or inventory system is the best opportunity to fix master data, and the worst time to ignore it. Loading duplicate, incomplete or inconsistent records into a new system carries the old problems into an expensive new platform, often with less familiarity among staff to spot them. Clean master data before migration, agree naming standards and ownership as part of the project, and test the new system with real records rather than tidy samples. Businesses that treat master data as a separate workstream within a system change usually find the go-live smoother and the reports more trustworthy.

## Finding and fixing duplicates

Even well-run businesses accumulate duplicates over time. A clean-up usually follows these steps:

1. **Identify likely duplicates** by comparing descriptions, supplier part numbers, ABNs, addresses and phone numbers, allowing for differences in spelling and abbreviation.
2. **Confirm** each suspected duplicate with someone who knows the items or customers.
3. **Choose the surviving record**, usually the one with the most complete and correct information and the most transaction history.
4. **Move stock, open orders and references** to the surviving record.
5. **Block the duplicate** from new use, keeping it for history rather than deleting it.
6. **Fix the cause**, such as an unclear naming standard or an open creation process.

## Measuring master data quality

Simple measures show whether master data is improving:

| Measure | What it shows |
|---|---|
| Percentage of records with all required fields complete | Completeness |
| Number of suspected duplicates found per month | Whether creation controls work |
| Time to create a new item, customer or supplier | Whether the process is workable |
| Errors traced to master data in orders, invoices or stock counts | The business impact |
| Number of bank detail changes verified by call-back | Whether payment controls are followed |

Measures work best when they are reviewed regularly by the owners of the data, not just reported.

## A worked example

This is an illustrative example. A distributor of industrial fasteners and fittings has about 8,000 items in its inventory system. Purchasing staff, warehouse staff and sales staff can all create items. Stock counts often show surplus stock of some items and shortages of what appear to be the same items under other numbers.

**Diagnosis.** A review finds about 480 suspected duplicates, around 6% of active items, mostly caused by inconsistent descriptions such as "M12x50 hex bolt 8.8 ZP", "Bolt hex M12 50mm gal" and "HEX BOLT M12 X 50". Many duplicates hold stock, so the business has been reordering items it already holds.

**Clean-up.** Over three months, a purchasing officer confirms 410 genuine duplicates with the warehouse supervisor, moves stock and open orders to surviving records and blocks the duplicates. Surplus stock worth an estimated $95,000 is identified; most is absorbed by normal demand over the following year, reducing purchases by about that amount.

**Prevention.** The business adopts a description standard, restricts item creation to two trained staff using a request form, and requires a search before creation. Supplier bank detail changes now require a call-back to a known number and a second approver.

**Result.** New duplicates fall to a handful a year, stock counts reconcile more closely, and an attempted bank detail fraud the following year is stopped at the call-back step.

## Applying this in an Australian business

- **List your master data**: items, customers, suppliers, employees, locations and price lists.
- **Choose a system of record** for each and stop editing copies elsewhere.
- **Assign owners and stewards** by field as well as by record.
- **Control creation** with search-first rules, standards and approval.
- **Log and approve changes**, especially prices and bank details.
- **Verify bank detail changes by phone** on a number already held.
- **Clean duplicates periodically** and fix their causes.
- **Measure quality** and review it with data owners.

## Questions worth considering

- Which system holds the official version of our items, customers and suppliers?
- How many people can create new items, and do they search first?
- How many duplicates are in our item master, and what stock do they hold?
- What happens when a supplier emails new bank details?
- Who owns each important field in our master records?

## Bringing it together

Master data, the records of items, customers, suppliers and other core things, drives every transaction and report in a business. Its errors multiply across everything that uses it. Decide which system holds the official version of each kind of record, give the data owners, control how records are created and changed, verify bank detail changes independently, remove duplicates and measure quality. These are modest disciplines, but they make orders, stock, invoices and reports more reliable and protect the business from expensive fraud.

---

*Source: KEVOS® editorial notes, drawing on general information management and business systems practice. The worked example is illustrative. This article is general information.*
