---
title: "Keeping business systems in sync: integration methods, data ownership and handling errors between applications"
description: "Online shops, ERP, CRM, payroll and warehouse systems must share data. How integration methods compare, how to decide which system owns what, and how to catch errors."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - automation
  - operations
author: "KEVOS®"
featured: false
draft: false
---

A typical small or medium business now runs several software systems: accounting, an ERP or inventory system, a customer relationship management system, an online shop, a payroll and timesheet system, perhaps a warehouse provider's system and a project or job management tool. Each holds part of the picture, and each needs data from the others. Orders from the online shop must reach the warehouse, stock levels must reach the shop, invoices must reach accounting, hours must reach payroll and customer details should be the same everywhere.

When those connections are weak, staff re-key data between systems, errors creep in, stock is sold twice, invoices go to old addresses, and month-end becomes a reconciliation exercise. When they are strong, data flows automatically, but new risks appear: an integration that fails silently overnight, a duplicated order created by a retry, or a vendor update that breaks a connection nobody documented.

This article explains why systems drift apart, the main methods of integration and when each suits, how to decide which system owns which data, how to handle timing, mapping and matching, how to design for errors, how to secure and monitor integrations and how to manage change. It is general information for managers, system owners and anyone commissioning integrations, not a technical guide to any product.

## Why systems drift apart

Data diverges between systems for predictable reasons:

- **Duplicate entry**: the same information is typed into two systems, with differences in spelling, timing or accuracy.
- **Changes in one place only**: a customer's address is updated in the CRM but not in accounting.
- **Timing**: one system updates immediately and another overnight, so they disagree during the day.
- **Different structures**: systems represent products, customers or units differently.
- **Failed transfers** that nobody notices.

Integration aims to make data flow reliably, but it only works well when the business has decided which system is authoritative for each kind of data.

## Integration methods

| Method | How it works | Suits | Watch for |
|---|---|---|---|
| Manual re-entry | Staff type data from one system into another | Very low volumes | Errors, delay and cost |
| File import and export | Scheduled files, often CSV, exported from one system and imported into another | Batch transfers, such as daily orders or payroll | Format changes, partial imports, timing gaps |
| Application programming interfaces (APIs) | Systems exchange data directly through defined interfaces | Most modern integrations | Version changes, rate limits, authentication management |
| Webhooks and events | A system notifies others immediately when something happens | Near real-time updates, such as new orders | Missed or duplicated notifications |
| Integration platforms | Software services that connect many applications with configurable flows | Businesses with several integrations | Subscription cost, dependence on the platform |
| Direct database connections | One system reads or writes another's database directly | Rarely appropriate | Bypasses business rules, breaks on upgrades, voids support |
| Electronic data interchange (EDI) | Standard message formats for orders, invoices and dispatch advice between trading partners | Supply chains, retail and large customers | Partner-specific requirements, setup cost |

Many software products also offer ready-made **connectors** to popular applications. They are quick to set up but should be understood and tested like any other integration.

### Electronic invoicing

Australia has adopted the international **Peppol** framework for electronic invoicing, with the Australian Taxation Office acting as the Peppol authority. Invoices sent through the network move directly between businesses' systems in a standard format, avoiding emailed PDFs and re-keying. Many accounting packages support it, and some large organisations and government agencies prefer or require it.

### Integration with trading partners

Some integrations reach outside the business: customers' purchasing systems, suppliers' order portals, freight carriers' booking systems and banks. These connections often follow the partner's requirements rather than the business's preferences, and they may involve formal onboarding, testing and certification. Allow time for them in project plans, and keep contact details for each partner's technical team in the integration register.

## Decide which system owns what

Before connecting anything, decide the **system of record** for each kind of data: the one place where it is created and changed. For example:

| Data | System of record | Systems that receive it |
|---|---|---|
| Customers | CRM | Accounting, online shop, ERP |
| Items and prices | ERP | Online shop, CRM, quoting |
| Stock levels | ERP or warehouse system | Online shop |
| Sales orders | Online shop for web orders, ERP for others | ERP, warehouse system, accounting |
| Invoices and payments | Accounting | CRM for customer service |
| Employee hours | Timesheet system | Payroll, job costing |

Other systems should not change data they do not own, or changes will conflict. Two-way synchronisation, where both systems can change the same data, is possible but complex and should be used only when necessary, with clear rules for resolving conflicts.

## Direction and timing

For each data flow, decide:

- **Direction**: one-way or two-way.
- **Trigger**: on each change, on a schedule, or on request.
- **Frequency**: immediately, every few minutes, hourly or daily.

Faster is not always better. Stock levels for a busy online shop may need updating every few minutes to avoid overselling; general ledger postings may be fine daily. Match frequency to the cost of being out of date.

## Mapping and transformation

Systems describe the same things differently. Integration requires **mapping** each field and value:

- **Codes**: payment terms, tax codes, order statuses, units of measure and product categories rarely match between systems.
- **Formats**: dates, phone numbers, addresses and currency amounts.
- **Structures**: one system may hold a single address while another holds separate billing and delivery addresses.
- **Calculations**: whether prices include GST, how discounts are applied, how freight is treated.

Document mappings, have business owners confirm them, and test with real records, including unusual ones.

## Matching records across systems

Integrations need a reliable way to know that a customer in one system is the same as a customer in another. The best approach is usually to store each system's identifier in the other, sometimes called an **external reference**, rather than matching by name or email address, which change and may be duplicated. Agree how new records are matched and what happens when a match is uncertain.

## Designing for errors

Every integration eventually meets an error: a system is unavailable, a record fails validation, a field is missing or a network connection drops. Good design expects this:

- **Validation**: check data before sending and reject records that would fail, with a clear reason.
- **Retries**: try again automatically when failures are temporary.
- **Safe repetition**: design so that processing the same message twice does not create two orders or two invoices. Developers call this **idempotency**; in plain terms, each transaction carries a unique reference so duplicates are recognised and ignored.
- **Holding areas for failures**: records that cannot be processed go to a queue for review, rather than disappearing.
- **Alerts**: someone is told promptly when failures occur or flows stop.
- **Reconciliation**: regular comparisons between systems, such as order counts, stock totals or invoice values, catch problems that individual checks miss.

The most dangerous integration failure is the silent one, where data simply stops flowing and nobody notices until a customer complains.

## Security

Integrations hold keys to the business's systems. Protect them:

- **Use dedicated integration accounts** with only the permissions needed.
- **Store API keys and credentials securely**, not in emails or spreadsheets.
- **Rotate credentials** periodically and when staff or vendors change.
- **Use encrypted connections.**
- **Review connected apps** in subscription software and remove those no longer used.
- **Log integration activity** so problems and misuse can be investigated.

## Monitoring and ownership

Integrations need an owner, just like applications. Assign someone to watch alerts, review failures, check reconciliation reports and coordinate with vendors when something breaks. A simple dashboard showing each integration's last successful run and current error count makes problems visible.

## Managing change

Integrations break when systems change:

- **Software updates** may change data formats or retire API versions.
- **New fields, codes or products** may not be mapped.
- **Business process changes** may alter what data is needed.

Keep an **integration register** listing each integration, its purpose, systems, method, schedule, owner, credentials location and documentation. Check vendors' release notes for interface changes, test integrations after updates, and include integration testing in any system change. The [systems integration: making the parts work together](/insights/systems-integration-making-the-parts-work-together/) article explains the wider discipline of managing interfaces between parts of a system.

## Build, buy or configure

There are three broad ways to create an integration:

- **Ready-made connectors** supplied by software vendors or marketplaces are quickest and cheapest for common pairings, such as an online shop and an accounting package. Check what they actually synchronise, how they handle errors and who supports them.
- **Integration platforms** let a business or its provider configure flows between many applications without extensive programming, with built-in monitoring and retry features. They suit businesses with several integrations, at the cost of a subscription and dependence on the platform.
- **Custom code** gives full control and suits unusual systems or complex logic, but must be documented, maintained and supported, often by a developer who may not always be available.

Whichever approach is chosen, the design questions in this article still apply.

## Testing integrations

Integrations should be tested as thoroughly as any other part of a system, ideally in test copies of the connected applications. Useful test cases include:

- **Normal transactions**, such as a typical new order.
- **Changes and cancellations**, such as an order amended or cancelled after it was sent.
- **Unusual records**, such as long addresses, special characters, zero-value items and multiple currencies.
- **Duplicates**, such as the same message sent twice.
- **Failures**, such as one system being unavailable for an hour, followed by recovery.
- **Volume**, such as the busiest day of a promotion.

Testing failure and recovery is particularly important, because it shows whether records are lost, duplicated or held safely for retry.

## What integration costs

Integration costs include initial design and build, subscriptions for connectors or platforms, ongoing monitoring, fixes when vendors change their interfaces, and testing after updates. Budget for the ongoing work as well as the build. Compared with re-keying, the savings are usually clear, but an integration nobody maintains can cost more in errors than the manual process it replaced.

## Common mistakes

- **Connecting systems before deciding which owns each data type.**
- **Two-way synchronisation by default**, creating conflicts.
- **Matching records by name** instead of identifiers.
- **No handling for duplicates and retries.**
- **Silent failures**, with no alerts or reconciliation.
- **Writing directly into another system's database.**
- **Undocumented integrations** built by someone who has since left.
- **Credentials shared** or stored insecurely.

## A worked example

This is an illustrative example. A business selling outdoor equipment online and to retailers uses an online shop, an ERP system for stock and purchasing, accounting software and a third-party logistics provider that stores and ships goods. Stock levels are exported from the ERP to the shop once a night, and web orders are downloaded and keyed into the ERP each morning.

**Problems.** During promotions, the shop sells stock that sold out earlier in the day, about 25 oversold orders a month at busy times. Staff spend about 12 hours a week re-keying web orders. Differences between shipped quantities and invoices take days to reconcile at month-end.

**Design.** The ERP is confirmed as the system of record for items, prices and stock; the shop for web orders; and accounting for invoices and payments. New web orders are sent to the ERP immediately through webhooks, each with the shop's order number as a unique reference so duplicates are ignored. Stock levels flow from the ERP to the shop every five minutes, with a safety buffer for fast-selling items. The logistics provider's dispatch confirmations update the ERP, which creates invoices in accounting. Failed messages go to a review queue, and alerts are sent if any flow stops for more than 30 minutes. A nightly report reconciles orders, dispatches and invoices.

**Result.** Oversold orders fall to about one a month, mostly from simultaneous purchases of the last unit. Re-keying is eliminated, and month-end reconciliation takes hours rather than days. The integration register and documentation mean the business is not dependent on the developer who built it.

## Applying this in an Australian business

- **List the systems** you use and the data each needs from the others.
- **Decide the system of record** for each kind of data.
- **Prefer supported APIs, connectors and standards** such as EDI and Peppol e-invoicing over direct database access.
- **Match records by identifiers**, not names.
- **Design for errors**, duplicates and retries.
- **Monitor integrations**, with alerts and reconciliation.
- **Keep an integration register** and test after every system update.
- **Secure integration credentials** and review connected apps.

## Questions worth considering

- Where do our staff still re-key data from one system into another?
- Which system is the official source of our customer, item and stock data?
- Would we know today if an integration stopped working last night?
- Who owns each integration, and where is it documented?
- What happens if an order is sent twice?

## Bringing it together

Business systems need to share data, and the way they do so determines whether information is consistent or constantly reconciled by hand. Decide which system owns each kind of data, choose integration methods that suit volume and timing, map codes and formats carefully, match records by identifiers, design for errors and duplicates, secure credentials, monitor every flow and manage change with an integration register. Reliable integration reduces errors and re-keying, and frees people to use the data rather than move it.

---

*Source: KEVOS® editorial notes, drawing on general business systems integration practice. The worked example is illustrative. This article is general information.*
