---
title: "Why business systems slow down: diagnosing database performance before buying more hardware"
description: "Slow business systems are often blamed on hardware. How to measure the problem, find where time is really lost, fix common database causes and plan capacity before it runs out."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

A business system that was quick when it was installed gradually becomes sluggish. Screens take seconds to open, month-end reports run for half an hour, and at busy times order entry freezes while someone else runs a report. Staff develop workarounds, such as entering orders on paper first, and the common conclusion is that the server is too old and needs replacing.

Sometimes it does. Often, though, the cause is something more specific: a missing index, a report scanning millions of rows on the live system, two processes blocking each other, out-of-date statistics, a desktop application working across a slow network link, or simply years of data that were never archived. Buying a bigger server can mask such problems for a while at considerable cost, while a targeted fix might solve them for good.

This article explains how to define and measure a performance problem, where time is typically lost in a business system, the most common database and non-database causes, a structured approach to diagnosis, how indexes help and hurt, how to plan capacity, how to work with software vendors and when more hardware really is the answer. It is general information for managers and IT providers responsible for business systems.

## What "slow" means

Performance complaints need to be made precise before they can be fixed. Two different things are often confused:

- **Response time**: how long one action takes for one user, such as opening a customer record or saving an order.
- **Throughput**: how much work the system completes in a period, such as orders processed per hour or invoices produced in a billing run.

A system can have good throughput but poor response times for some users, or fast screens but a nightly batch that no longer finishes before morning. Useful questions include:

- **Which actions are slow**, and for which users or locations?
- **When** are they slow: all the time, at certain hours, at month-end?
- **How slow**, measured in seconds or minutes rather than impressions?
- **Since when**, and what changed around that time?

## Where the time goes

Every action passes through several layers, and delay can arise in any of them:

| Layer | Possible causes of delay |
|---|---|
| User's device | Old hardware, browser problems, security software |
| Network | Slow or congested links, distance to a remote server, virtual private network overhead |
| Application | Inefficient code, many small database requests, slow integrations |
| Database | Inefficient queries, missing indexes, locking, out-of-date statistics, memory pressure |
| Storage | Slow disks, overloaded shared storage in virtual environments |
| Other workloads | Backups, maintenance jobs, reports or integrations running at the same time |

```figure
type: layers
title: Where the time can go
caption: Measure each layer before deciding where the delay lives.
- User's device
- Network
- Application
- *Database
- Storage
- Other workloads
```

Diagnosis is a matter of finding which layer is responsible, rather than assuming.

## Common database causes

### Missing or unsuitable indexes

An **index** lets the database find records without reading every row, much like a book's index. Without a suitable index, a search for one customer's orders may read the whole order table. As tables grow from thousands to millions of rows, such queries slow dramatically.

### Inefficient queries and reports

Queries that request far more data than needed, combine tables inefficiently or apply calculations that prevent indexes being used can be slow regardless of hardware. Reports designed when data volumes were small often become the main source of problems years later.

### Many small requests

Some applications send one database request per record, for example retrieving 500 order lines with 500 separate queries rather than one. Each request is quick, but together they add up, especially across a network. Developers sometimes call this the "N plus one" problem.

### Locking and blocking

When one process changes data, the database may lock records to keep them consistent, and other processes wanting those records must wait. A long-running update or report can block many users. Symptoms include freezes that clear suddenly when another process finishes.

A related problem is the **deadlock**, where two processes each hold a lock the other needs, so neither can continue. Databases detect deadlocks and cancel one of the processes, which users experience as an error or a failed save. Occasional deadlocks are normal in busy systems; frequent ones point to processes that access the same records in conflicting orders, usually something the application's developer or vendor needs to fix.

### Out-of-date statistics

The database's query optimiser chooses how to answer each query using statistics about the data. When statistics are stale, it may choose a poor plan, making a query that normally takes a second run for minutes.

### Growth without archiving

Tables accumulate years of transactions that are rarely used but must still be scanned, indexed, backed up and maintained. Archiving or partitioning old data can restore performance.

### Memory and storage pressure

Databases are fastest when frequently used data fits in memory. If memory is too small for the working data, the database reads from storage repeatedly. Slow or overloaded storage then becomes the bottleneck.

### Maintenance at the wrong time

Backups, index maintenance and large imports running during business hours compete with users.

## Common causes outside the database

- **Distance and network links.** Older desktop applications that exchange many small messages with a database work well on a local network but poorly across the internet or a virtual private network.
- **Security software** scanning database files or application folders on servers.
- **Overloaded remote desktop servers** hosting many users.
- **Integrations** that poll the database constantly, such as an online shop checking stock every few seconds.
- **Virtual servers** sharing physical resources with other busy machines.

## A structured approach to diagnosis

1. **Define the symptoms precisely**: which actions, which users, when and how slow.
2. **Measure a baseline**: time key actions and collect resource figures, such as processor use, memory, storage response times and network latency.
3. **Look at the database's own information**: most database products record which queries consume the most time and what they spend time waiting for.
4. **Find the top consumers**: often a handful of queries or reports account for most of the load.
5. **Check for blocking** during the slow periods.
6. **Review recent changes**: software updates, new reports, data growth, new integrations, changes to security software or virtual infrastructure.
7. **Test one fix at a time**, ideally on a copy of the system first, and measure the effect.
8. **Record what was found and changed**, so future problems are easier to solve.

```figure
type: steps
title: Diagnosing a slow system
caption: A handful of queries or reports often account for most of the load.
- Define the symptoms precisely
- Measure a baseline
- Read the database's own information
- Find the top consumers
- Check for blocking
- Review recent changes
- Test one fix at a time
- *Record what was found
```

### Wait statistics

Many database products record what queries wait for: reading from storage, obtaining locks, processor time, memory or network. A database spending most of its time waiting for locks needs a different fix from one waiting for storage. Asking an IT provider for this information turns guesswork into evidence.

## Indexes: help with a cost

Indexes speed up searches but carry costs:

- **Every index must be updated** whenever data changes, slowing saves and imports slightly.
- **Indexes use storage** and memory.
- **Too many indexes** can make a busy transaction system slower overall.

Good indexing supports the most frequent and important queries. For packaged software, the vendor may restrict changes to indexes or require them to be made through supported updates, so involve the vendor before changing anything.

## Set performance targets

Performance is easier to manage when acceptable times are written down. For each key action, agree a target with the people who use it, for example:

| Action | Example target |
|---|---|
| Open a customer or job record | Under 2 seconds |
| Save a sales order | Under 3 seconds |
| Search for an item by description | Under 2 seconds |
| Month-end margin report | Under 1 minute |
| Overnight batch processing | Finished by 6 am |

Targets give the business a basis for monitoring, for acceptance testing of new systems and upgrades, and for discussions with vendors and IT providers. When buying or commissioning software, include performance targets for realistic data volumes and user numbers in the requirements, and test them before go-live rather than discovering problems afterwards.

## Capacity planning

Performance problems are easier to prevent than to fix in a hurry:

- **Track growth** in data volumes, users and transactions over time.
- **Keep a baseline** of response times for key actions, so deterioration is visible early.
- **Watch peaks**, such as month-end, end of financial year and seasonal trading.
- **Maintain headroom** in processor, memory and storage, rather than running at capacity.
- **Plan archiving** before tables become unmanageable.

The [how quickly would you find out](/reados/collections/risk-controls-and-assurance/how-quickly-would-you-find-out/) article discusses building early-warning measures into decisions, a principle that applies equally to system performance.

## Working with software vendors

For packaged business software, the vendor often knows the common performance problems and their fixes. Before contacting them, gather evidence: the slow actions, timings, versions, data volumes, server specifications and any database information about slow queries. Ask:

- **Is this a known issue**, and is it fixed in a later version?
- **Are our server and database configured as recommended?**
- **Which reports or functions are known to be heavy**, and can they run on a reporting copy or outside hours?
- **May we add indexes**, or will the vendor provide them?

## Performance in cloud and subscription systems

Cloud and subscription software changes who can fix what. With software as a service, the business cannot tune the database itself, but it can still measure and report slow actions, check its own internet connection and devices, review how heavy reports and integrations are used, and press the provider with evidence. Providers often publish status pages and performance information, and service agreements may include response-time commitments.

With hosted servers and managed databases, resources can be increased quickly, which is convenient but makes it tempting to pay for more capacity instead of fixing inefficiencies. Cloud providers' monitoring tools show resource use and slow queries; review them regularly, and check bills for steady increases that indicate growing load.

## How people use the system matters too

Some slowness comes from how systems are used. Searching for every customer containing "a", opening reports for all years when only the current month is needed, or leaving large lists to load in many browser tabs all add load. Short training on efficient searches, sensible default filters on reports and screens, and progress indicators for long-running tasks can noticeably improve the experience without any technical change.

## When hardware is the answer

More or faster hardware is the right fix when evidence shows resources are genuinely exhausted after inefficiencies are addressed: storage response times are consistently poor, memory is too small for the working data, or processors are saturated by legitimate work. In cloud environments, resizing a server or database service can be quick, but costs continue every month, so fix inefficiencies first. The [change the control logic before adding capacity](/reados/collections/business-systems-and-operating-rhythm/change-the-control-logic-before-adding-capacity/) article makes a similar argument for production systems.

## Common mistakes

- **Buying hardware before diagnosing.**
- **Relying on impressions** rather than measured timings.
- **Running heavy reports on the live system** during business hours.
- **Changing several things at once**, so nobody knows which change helped.
- **Ignoring data growth** until performance collapses.
- **Adding indexes without considering their cost** or vendor support.
- **Moving a chatty desktop application** across a slow network link.

## A worked example

This is an illustrative example. A construction services business uses a job costing system with about 40 users. Every month-end, the system becomes almost unusable: order entry freezes for minutes at a time, and the job margin report takes about 18 minutes. The IT provider has quoted about $30,000 for a new server.

**Measurement.** Before approving the purchase, the owner asks for a diagnosis. Timings are recorded for key actions over a week, and the database's own reports of slow queries and waits are collected during month-end.

**Findings.** Storage, processor and memory use are moderate. Most of the waiting is for locks. The job margin report, run by several managers at once, reads every cost transaction for the past seven years without a suitable index, holding locks that block order entry. The cost transaction table has grown to several million rows, most of them for jobs closed years ago.

**Fixes.** The vendor supplies an index supported in the current version. Managers run the margin report from a reporting copy refreshed overnight, rather than the live system. Transactions for jobs closed more than three years ago are archived using the vendor's tool, after confirming retention requirements.

**Result.** The margin report runs in about 40 seconds, order entry no longer freezes, and the server purchase is deferred. The business sets up a monthly check of key timings and data growth so problems are caught earlier next time.

```figure
type: compare
title: Month-end slowdowns without a $30,000 server
cols: Found | Fixed
best: 2
caption: The job margin report fell from about 18 minutes to about 40 seconds, and the server purchase was deferred.
- Waiting | Mostly for locks | Order entry no longer freezes
- Margin report | Seven years read with no suitable index | A supported index from the vendor
- Who runs it | Several managers on the live system | A reporting copy refreshed overnight
- *Data growth | Millions of rows for long-closed jobs | Jobs closed over three years archived
```

## Applying this in an Australian business

- **Define and measure** performance problems before acting.
- **Find the layer responsible**: device, network, application, database or storage.
- **Ask for database evidence**, such as top queries and wait statistics.
- **Move heavy reporting** off the live system.
- **Archive old data** in line with retention requirements.
- **Involve vendors** for packaged software.
- **Track growth and baselines** for capacity planning.
- **Buy hardware** when evidence shows resources are genuinely exhausted.

## Questions worth considering

- Which actions in our main systems are slow, and how slow, in seconds?
- Are heavy reports running on our live systems during business hours?
- How much has our data grown in the past three years?
- Do we have baseline timings to compare against?
- What evidence supports the last hardware upgrade we were advised to buy?

## Bringing it together

Business systems slow down for identifiable reasons: missing indexes, inefficient reports, chatty applications, locking, stale statistics, data growth, resource pressure, network distance and competing workloads. Measure the problem precisely, find which layer is responsible, use the database's own evidence, fix the biggest causes one at a time and plan capacity from tracked growth. Hardware is sometimes the answer, but it should follow diagnosis rather than replace it.

---

*Source: BIZOMAT editorial notes, drawing on general database administration and information technology practice. Figures in the worked example are illustrative. This article is general information.*
