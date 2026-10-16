---
title: "APIs and integration patterns: how business systems exchange data and what makes connections reliable"
description: "What an API is, how web APIs, authentication, webhooks, rate limits and versioning work, and the main patterns for connecting business systems, from file transfers to events and integration platforms."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - automation
  - operations
author: "KEVOS"
featured: false
draft: false
---

A typical small business now runs on a collection of systems: accounting software, a CRM, an online store, a job management or ERP system, payroll, email marketing, a payment provider and perhaps a few spreadsheets that fill the gaps. Each system holds part of the picture. When they are not connected, staff re-key orders, copy customer details, export and import files and reconcile differences by hand. Errors creep in, information is out of date and much of the value of each system is lost.

**Application programming interfaces**, or APIs, are how software systems talk to each other. Almost every modern business application offers one, and the integration features advertised by software vendors, such as "connects with your accounting package", are built on them. Understanding what APIs are, how they work and the common ways of connecting systems helps business owners choose software that will fit together, commission integrations sensibly and recognise why some connections are reliable while others fail silently.

This article explains what an API is, how web APIs work, authentication and permissions, webhooks, rate limits, pagination and versioning, documentation, older and specialised interfaces, the main integration patterns and how to make integrations reliable. It is part of a series on software and cloud foundations for business leaders. The [keeping business systems in sync](/reados/collections/business-systems-security-and-it-decisions/keeping-business-systems-in-sync/) article covers the related questions of data ownership and handling errors between applications.

## What an API is

An **API** is a defined way for one piece of software to request information or actions from another. It specifies what can be asked for, how to ask, what information must be supplied and what will be returned. An API is a contract: as long as both sides follow it, neither needs to know how the other works internally.

A restaurant menu is a common analogy. The menu lists what can be ordered and how; the kitchen's internal processes are hidden. Customers order from the menu, and the kitchen can change its methods without changing the menu. In the same way, an online store's API might allow another system to retrieve orders, update stock levels or create products, without exposing the store's database or code.

APIs exist at many levels, including within operating systems and programming libraries, but in business integration the term usually refers to **web APIs**, which are reached over the internet.

## How web APIs work

Most modern business APIs follow a style called **REST**, short for representational state transfer. They use the same technology as websites: requests and responses sent over HTTPS. Key elements include:

- **Resources**: the things the API deals with, such as customers, orders, invoices and products, each reached at its own web address, often called an endpoint.
- **Methods**: the action requested. GET retrieves information, POST creates something, PUT or PATCH updates it and DELETE removes it.
- **Data format**: information is usually exchanged as **JSON**, a simple text format of named values and lists that is easy for programs to read and write.
- **Status codes**: responses indicate success or failure, such as 200 for success, 201 for a created record, 400 for an invalid request, 401 for failed authentication, 404 for something not found, 429 for too many requests and 500 for a server error.

For example, an integration might send a GET request to an accounting system's invoices endpoint to retrieve unpaid invoices, receive a JSON list in response, and then send a POST request to a CRM to record each customer's balance.

Other styles exist. **GraphQL** lets the requesting system specify exactly which data it wants in a single query, which suits complex applications. **SOAP**, an older style based on XML messages and formal contracts, is still common in enterprise and government systems.

## Authentication and permissions

APIs must know who is making each request and what they are allowed to do. Common methods include:

- **API keys**: long secret strings issued to a connecting system and sent with each request. They are simple but must be protected like passwords.
- **OAuth 2.0**: a widely used framework that lets a user grant an application limited access to their account in another system, without sharing their password. When a business connects its accounting software to another app and clicks "allow", OAuth is usually at work. Access is granted through tokens that expire and can be revoked.
- **Service accounts**: dedicated accounts for integrations, separate from any individual's login, so integrations do not break when staff leave.

Good practice is to grant each integration only the permissions it needs, known as **least privilege**: an integration that reads invoices should not be able to delete customers. Businesses should keep a register of connected applications and review it, removing connections that are no longer used.

## Webhooks: being told when something happens

Requesting data repeatedly to check for changes, called **polling**, wastes effort and delays updates. **Webhooks** reverse the direction: when something happens in one system, such as a new order, a payment or a status change, it sends a message to a web address nominated by another system. The receiving system then acts immediately.

Webhooks make integrations faster and more efficient, but the receiving system must be available to accept messages, must verify that they genuinely came from the sender and must cope with messages that arrive twice, late or out of order. Most providers retry failed webhooks for a period, and good integrations also run periodic checks to catch anything missed.

## Rate limits, pagination and versioning

Practical features of APIs affect how integrations are designed:

- **Rate limits** restrict how many requests a system can make in a period, protecting the provider from overload. Integrations that exceed limits receive errors and must slow down and retry. Bulk operations, such as loading thousands of products, need to be designed around limits.
- **Pagination** splits large results into pages. An integration requesting all orders may receive them a hundred at a time and must request each page in turn. Integrations that read only the first page silently miss data, a common defect.
- **Versioning** allows providers to change APIs without breaking existing integrations. Providers announce new versions and eventually retire old ones. Integrations must be updated before old versions are switched off, which requires someone to watch provider announcements.

API access may also be limited by subscription tier, and some providers charge for high volumes of requests, which should be checked before relying on an API.

## Documentation

Good APIs are well documented, describing each endpoint, the data it accepts and returns, authentication, limits, errors and examples. Many providers publish specifications in a standard format, the **OpenAPI** specification, which tools can read to generate code and tests. When choosing business software, the quality and openness of its API documentation is a useful indicator of how easily it can be integrated. The [choosing an ERP or business system for a small manufacturer](/reados/collections/business-systems-security-and-it-decisions/choosing-an-erp-system-for-a-small-manufacturer/) article includes integration among the selection criteria.

## Other ways systems exchange data

Not every integration uses a modern web API:

- **File transfers**: one system exports a file, such as a spreadsheet or delimited text file, and another imports it, manually or on a schedule. Simple and widely supported, but prone to format errors and delays.
- **Direct database access**: one system reads or writes another's database. This is fast but fragile and risky, because it bypasses the business rules and checks built into the application and breaks when the database structure changes.
- **Electronic data interchange**, or EDI: long-established standards for exchanging business documents such as purchase orders, invoices and despatch advices between trading partners, common with large retailers and in logistics.
- **E-invoicing networks**: Australia has adopted the Peppol framework for exchanging electronic invoices between businesses' systems, and many accounting packages support it.
- **Email parsing**: extracting data from emails or attachments, increasingly with AI tools; useful when no other option exists, but less reliable.

## Integration patterns

### Point-to-point

The simplest pattern connects two systems directly, such as an online store to an accounting package. Point-to-point connections are quick to set up, and many are available as ready-made connectors. As the number of systems grows, the number of connections multiplies, each with its own logic and failure points, making the overall picture hard to understand and maintain.

### Hub and integration platforms

In a **hub** pattern, systems connect to a central integration layer rather than to each other. The hub transforms data between formats, applies rules, routes messages and records what happened. **Integration platforms as a service**, sometimes called iPaaS, and workflow automation tools provide hubs as cloud services with ready-made connectors for popular applications. They suit small businesses well, provided someone owns and monitors the workflows.

### Events and message queues

In an **event-driven** pattern, systems publish events, such as "order placed" or "job completed", and other systems subscribe to the events they care about. **Message queues** hold events until each subscriber has processed them, so a temporary outage does not lose information. This pattern decouples systems, so that adding a new subscriber does not require changing the publisher.

### Batch and real time

Integrations may run in **real time**, as events happen, or in **batches**, on a schedule such as nightly. Real time suits stock levels, order status and payments; batches suit large volumes and information that does not change minute to minute, such as daily sales summaries. Choosing the right timing for each flow avoids unnecessary complexity.

## Mapping data between systems

Systems rarely describe the same things in the same way. One system's "customer" is another's "account" or "contact"; tax codes, units of measure, product codes and status values differ. Every integration needs a **data mapping**, specifying how each field in one system corresponds to fields in the other, how values are converted and what happens when there is no equivalent. Mapping is often where most of the integration effort and most of the defects lie, and it benefits from involving the people who understand each system's data.

## Making integrations reliable

Integrations fail in predictable ways: networks drop, systems are down for maintenance, data is invalid, limits are reached and APIs change. Reliable integrations:

- **retry** temporary failures, with increasing delays between attempts;
- are **idempotent**, meaning that processing the same message twice has the same effect as processing it once, so retries do not create duplicate orders or payments, as the [retrying database work without repeating business effects](/reados/collections/database-performance-concurrency-and-change/retrying-database-work-without-repeating-business-effects/) article explains;
- **log** each transaction with enough detail to trace problems;
- **alert** a named person when errors persist, rather than failing silently;
- **validate** data before sending it, rejecting records that would cause problems downstream;
- include **reconciliation checks**, such as comparing order counts or totals between systems daily; and
- are **documented**, so others can understand and maintain them.

## Security considerations

Each integration is a potential path into business systems. Credentials for integrations should be stored securely, given minimal permissions and changed when people with access leave. Webhook endpoints should verify message signatures. Personal and financial information passed between systems must be protected in transit and handled in line with privacy obligations, including when integration platforms store data temporarily overseas.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

An outdoor equipment retailer sells through its own online store and a marketplace, with stock held in a warehouse system and finances in a cloud accounting package. Staff export orders from both channels each morning, import them into the warehouse system and enter invoices into accounting. Stock levels online are updated twice a day, and the business oversells popular items several times a week.

The retailer adopts an integration platform. Webhooks from the store and marketplace send new orders to the platform immediately, which maps them to the warehouse system's format and creates them through its API. When the warehouse despatches an order, an event updates the sales channel with tracking details and creates the invoice in the accounting package. Stock changes in the warehouse system update both channels within a minute.

During testing, the team discovers that the marketplace sometimes sends the same order webhook twice. The integration uses the marketplace's order number to detect and ignore duplicates. A daily reconciliation compares order counts and totals across all systems and emails the operations manager if they differ. Within two months, re-keying has stopped, overselling is rare and the morning order processing that took two hours now takes minutes of exception checking.

## How this applies to a small Australian business

- **Check API availability and documentation** before choosing business software.
- **Use service accounts** and least-privilege permissions for integrations.
- **Keep a register** of connected applications and review it.
- **Prefer webhooks or events** for time-sensitive flows.
- **Design for rate limits, pagination and duplicates.**
- **Agree data mappings** with people who know each system.
- **Monitor and reconcile** rather than assuming integrations work.
- **Watch for API version changes** announced by providers.

## Common mistakes

- **Direct database connections** that bypass application rules.
- **Integrations tied to an individual's login.**
- **Reading only the first page** of results.
- **No handling of duplicate messages.**
- **Silent failures** with no alerts.
- **Undocumented integrations** that nobody understands after their builder leaves.

## Frequently asked questions

**Do all business applications have APIs?** Most modern cloud applications do, though access may depend on the subscription tier. Older on-premise systems may offer only file imports and exports or direct database access.

**Should a small business use an integration platform or custom code?** Integration platforms suit common applications and straightforward flows, and allow faster changes. Custom code suits unusual systems, complex logic or high volumes. Many businesses use both.

**What happens when a provider changes its API?** Providers usually announce changes and support old versions for a period. Integrations must be updated before old versions are retired, so someone must be responsible for watching announcements.

**Are ready-made connectors reliable?** Many are, but they still need configuration, monitoring and checks that their mapping matches the business's data and processes.

## Questions to ask

- Which systems do we re-key data between, and what does it cost us?
- Does each system we rely on have a documented API we can use?
- Who owns and monitors each integration?
- How would we know if an integration stopped working?
- What permissions do our connected applications hold?

## Bringing it together

APIs are contracts that let software systems request information and actions from each other, usually through web requests carrying JSON data, secured with keys or OAuth tokens and shaped by rate limits, pagination and versions. Webhooks and events notify systems when things happen; file transfers, EDI and e-invoicing networks remain important. Integration patterns range from simple point-to-point connections to hubs, platforms and event-driven designs. Reliable integrations handle retries and duplicates, map data carefully, log and alert, reconcile results and have a named owner.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
