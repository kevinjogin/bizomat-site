---
title: "What a database management system does: storage, queries, concurrency, recovery and security explained"
description: "Behind every business system sits software that stores, protects and shares its data. What a database management system does, in plain language, and what owners should ask about it."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
author: "KEVOS®"
featured: false
draft: false
---

Accounting software, job management systems, ERP platforms, online shops and quality systems look very different on screen, but most of them rely on the same kind of software underneath: a **database management system**, usually shortened to DBMS. It stores the business's records, lets many people use them at once, finds information quickly, protects it from corruption when something fails and controls who can see or change it.

Most managers never deal with the DBMS directly, and they do not need to. But it shapes things they do care about: whether the system survives a power failure without losing data, how much work can be recovered after a mistake, whether it slows down as the business grows, what it costs to license and host, and who in the business or its suppliers is responsible for looking after it.

This article explains in plain language what a database management system does: how it stores data, answers questions, lets many users work at once, recovers from failures, enforces rules and controls access. It also describes the main kinds of database products and the questions business owners should ask about the database behind their key systems. It is general information for managers and owners who are not database specialists.

## A database and the software that manages it

A **database** is an organised collection of related data, such as a company's customers, items, orders and invoices. A **database management system** is the software that creates, stores, protects and provides access to that data. Applications, such as an accounting package or a job management system, send requests to the DBMS, and the DBMS does the work of reading and writing the data safely.

Separating the application from the data management has important benefits:

- **Many applications can share the same data**, such as an ERP system, a reporting tool and a website.
- **Data is protected consistently**, whatever application is used.
- **The physical storage can change** without the applications needing to change.
- **Specialised software handles difficult problems**, such as simultaneous users and crash recovery, which would be costly for every application to solve itself.

In the 1970s, a standards committee in the United States described this separation as three levels: how individual users see the data, the overall logical structure of the data, and how it is physically stored. The idea that the logical structure should be independent of physical storage, called **data independence**, remains a foundation of database design.

## Storing data

At the lowest level, a DBMS stores data in files on disks or solid-state drives. It organises those files into fixed-size blocks, often called **pages**, and keeps frequently used pages in memory to avoid slow reads from storage. It also maintains **indexes**, separate structures that let it find records quickly without reading everything, much like a book's index.

The DBMS also keeps a **catalogue**, sometimes called the data dictionary or system catalogue, which records the structure of the database: its tables, columns, data types, relationships, indexes, rules and users. Applications and reporting tools can read the catalogue to understand what data exists.

## Answering questions: query processing

Applications retrieve and change data by sending requests, usually written in the language **SQL**. A request describes what is wanted, such as all open orders for one customer, rather than how to find it. The DBMS then:

1. **Checks the request** for correct syntax and confirms the user is allowed to see the data.
2. **Plans how to answer it**, using a component called the **query optimiser**, which considers different ways of finding and combining the data, such as which index to use and in which order to join tables, and estimates the cost of each.
3. **Executes the chosen plan** and returns the results.

```figure
type: steps
title: How a database answers a question
caption: The query optimiser chooses among different ways of finding and combining the data.
- Check the request | syntax and permissions
- Plan the answer | the query optimiser
- *Execute the plan | and return results
```

The optimiser's choices make a large difference. The same question can take a fraction of a second with a good plan or minutes with a poor one. Optimisers rely on statistics about the data, such as how many rows each table holds and how values are distributed, so out-of-date statistics can cause slow performance.

## Letting many people work at once: concurrency control

In a busy business, many people and processes use the data at the same time: sales staff enter orders, the warehouse records dispatches, finance posts payments and reports run in the background. Without coordination, simultaneous changes could interfere. Two people could sell the last unit of stock, or one person's change could silently overwrite another's.

The DBMS prevents this through **concurrency control**. Common approaches include:

- **Locking**, in which a transaction temporarily reserves the records it is changing so others must wait.
- **Versioning**, in which readers see a consistent snapshot of the data while writers create new versions, so reading and writing interfere less.
- **Conflict detection**, in which simultaneous changes are allowed to proceed but checked before they are saved, and one is rejected if they conflict.

Databases offer different **isolation levels**, which trade strictness for performance. Stricter levels prevent more kinds of interference but may make users wait more. Application designers choose levels to suit each task.

## Keeping changes all or nothing: transactions

Many business actions involve several related changes. Posting an invoice may create the invoice, reduce stock, update the customer's balance and record the tax. If the system failed halfway through, the records would disagree.

A DBMS groups related changes into a **transaction**, which is completed entirely or not at all. Database specialists summarise the guarantees of reliable transactions as **ACID**:

- **Atomicity**: all changes in the transaction happen, or none do.
- **Consistency**: the database's rules are satisfied before and after the transaction.
- **Isolation**: simultaneous transactions do not see each other's incomplete work.
- **Durability**: once a transaction is confirmed, its changes survive failures such as power loss.

```figure
type: layers
title: What a transaction guarantees
caption: Related changes either all happen or none do, and confirmed changes survive a power loss.
- Atomicity | all or nothing
- Consistency | rules satisfied before and after
- Isolation | no one sees incomplete work
- *Durability | confirmed changes survive failures
```

## Surviving failures: logging and recovery

Durability depends on a technique called **write-ahead logging**. Before changing data in its main files, the DBMS records the change in a **transaction log**, and the log is written to durable storage before a transaction is confirmed. If the server crashes, the DBMS uses the log when it restarts to complete confirmed transactions and undo incomplete ones, returning the database to a consistent state.

The log also supports recovery from larger problems. With regular full backups and backups of the transaction log taken in between, a database can often be restored to a specific point in time, such as just before a mistaken bulk deletion. How much data could be lost depends on how often logs are backed up and where those backups are stored.

## Enforcing rules: integrity

A DBMS can enforce rules that keep data valid, whatever application or import adds it:

- **Data types**, so a date field holds a valid date.
- **Required values**, so essential information cannot be left blank.
- **Unique values**, so two items cannot share a part number.
- **Relationships**, so an order cannot refer to a customer who does not exist.
- **Checks**, such as quantities that must be positive.

Rules enforced in the database are stronger than rules enforced only on application screens, because they also apply to imports, integrations and direct changes.

## Controlling access: security

A DBMS controls who can connect and what each user or application can do:

- **Authentication** confirms the identity of a user or application, through passwords, certificates or integration with the organisation's identity system.
- **Authorisation** grants permissions, such as reading certain tables or changing certain records, often through **roles** that group permissions for a job function.
- **Auditing** records who did what, for investigation and compliance.
- **Encryption** protects data stored on disk and data travelling across networks.

A sound principle is **least privilege**: each user and application receives only the access it needs. Applications should not connect with administrator-level accounts, and administrative access should be limited and monitored.

## Common misunderstandings

Several beliefs about databases cause trouble in small and medium businesses:

- **"Copying the database file is a backup."** Copying the files of a running database can produce an inconsistent copy that will not open or contains half-finished changes. Use the database's own backup tools or a backup product designed for it.
- **"Mirrored disks mean we are backed up."** Disk mirroring protects against a failed drive, but it faithfully copies deletions, corruption and ransomware encryption too.
- **"The cloud provider backs everything up."** Some services include backups and some do not, and retention periods vary. Confirm what is covered, for how long and how a restore is requested.
- **"The software vendor looks after the database."** Many vendors support their application but expect the customer or its IT provider to manage the database, backups and patching. Check the support agreement.
- **"More hardware will fix a slow system."** Sometimes it will, but slow performance is often caused by missing indexes, poorly written queries or out-of-date statistics, which extra hardware only partly hides.

## Memory, storage and growth

Databases are fastest when the data they use most often fits in memory, because reading from memory is far quicker than reading from storage. As a business grows, its data grows, and a system that was fast with two years of records may slow with ten. Solid-state storage has greatly reduced the penalty of reading from disk, but memory, storage speed and the amount of history kept in active tables still shape performance. Archiving old records, maintaining indexes and planning capacity before the system becomes slow are routine parts of looking after a database.

## The main kinds of database products

| Kind | Examples | Typical use |
|---|---|---|
| Embedded databases | SQLite | Inside applications, devices and mobile apps; one application at a time |
| Desktop databases | Microsoft Access | Small departmental applications on a local network |
| Server databases | Microsoft SQL Server, Oracle Database, PostgreSQL, MySQL | Business systems serving many users |
| Managed cloud databases | Database services offered by major cloud providers | Server databases operated by the provider, paid by use or capacity |
| Specialised databases | Document, key-value, graph, time-series and search databases | Particular data shapes and workloads |

Many packaged business systems are built on one of the major server databases or run on a cloud service that hides the database entirely. Even then, the database's characteristics affect performance, cost, backup arrangements and the ability to report on or extract data.

## What business owners should ask

Owners do not need to manage the DBMS, but they should know the answers to a few questions about each critical system:

- **Which database does the system use, and who looks after it?**
- **How often are backups taken, including transaction logs, and where are they stored?**
- **How much data could we lose, and how long would recovery take, if the server failed or someone deleted records by mistake?**
- **When was a restore last tested?**
- **Who has administrator access, and is it limited and monitored?**
- **Is the database software supported and kept up to date with security patches?**
- **What are the licensing terms and costs, especially if we add users, processors or servers?**
- **Can we extract all of our data in a usable form if we change systems?**

The [cyber security basics for small businesses](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/) article explains the wider controls, including backups and patching, that protect business systems.

## A worked example

This is an illustrative example. A wholesale business runs its order and inventory system on a server database at its office. Full backups are taken each night at 11 pm and copied to cloud storage.

**The incident.** At 2:15 pm on a busy weekday, a staff member running a clean-up of old customer records mistakenly deletes about 300 active customers along with their open orders.

**With nightly backups only.** Restoring the 11 pm backup would recover the customers but lose every order, receipt and dispatch recorded since then, about 15 hours of work, which would have to be re-entered from paper, emails and memory.

**With transaction log backups.** The business's IT provider had recommended transaction log backups every 15 minutes, also copied off-site, and they had been set up the previous year. The provider restores the database to 2:14 pm, one minute before the deletion. Work entered in the following hour, while the problem was being diagnosed, is re-entered from a short list.

```figure
type: timeline
title: A mistaken deletion at 2:15 pm
caption: About 300 active customers and their open orders were deleted during a clean-up of old records.
- 11:00 pm | Nightly full backup | copied to cloud storage
- 2:15 pm | The deletion
- Nightly backup only | About 15 hours of work lost
- *With 15-minute log backups | Restored to 2:14 pm | one hour re-entered from a short list
```

**Lessons.** The business limits bulk deletion rights to two trained people, adds a confirmation step to the clean-up tool, and schedules a restore test every six months. The cost of the more frequent backups was a few hundred dollars a year in storage; the cost of losing a day's transactions would have been far higher.

## Applying this in an Australian business

- **Identify the database** behind each critical business system.
- **Confirm backup frequency**, including transaction logs, and off-site copies.
- **Test restores** regularly and time them.
- **Limit administrator access** and use least privilege for applications.
- **Keep database software supported and patched.**
- **Understand licensing** before adding users or servers.
- **Confirm you can export your data** completely.

## Questions worth considering

- How much work would we lose if our main system's server failed right now?
- Who could restore our database, and how long would it take?
- Who has administrator rights to our databases?
- Is our database software still supported by its vendor?
- Could we get all our data out if our software supplier went out of business?

## Bringing it together

A database management system is the quiet engine of most business software. It stores data efficiently, plans how to answer questions, lets many people work at once without interfering, keeps related changes together, recovers from crashes using its transaction log, enforces rules and controls access. Owners do not need to run it, but they should know which database supports each critical system, who looks after it, how much data could be lost, how quickly it could be restored and whether the business could take its data elsewhere.

---

*Source: KEVOS® editorial notes, drawing on general database systems principles and information technology practice. The worked example is illustrative. This article is general information.*
