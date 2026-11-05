---
title: "Tables, keys and relationships: how business databases are structured, for the people who commission them"
description: "A plain-language guide to relational databases: entities, keys, relationships, normalisation, constraints and transactions, and how to review a proposed data model."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - design
  - operations
author: "BIZOMAT"
featured: false
draft: false
---

Most business software, from accounting packages to job management, quality and maintenance systems, stores its information in a database. Managers rarely see that database directly, yet its structure decides what the system can and cannot do: whether it can record a customer with several sites, track a part through several revisions, show which supplier batch went into which product, or report sales by region without hours of manual work.

People who commission, buy or oversee business systems do not need to become database developers. But understanding a few core ideas, such as tables, keys, relationships and normalisation, makes it much easier to explain requirements, review a developer's or vendor's proposal, spot weaknesses before they become expensive, and understand why some changes are easy and others are hard.

This article explains how relational databases organise business information, in plain language and with business examples. It covers entities and attributes, keys, relationships, normalisation, the rules a database can enforce, transactions, indexes and queries, common modelling mistakes and the questions to ask when reviewing a proposed design. It is general information for managers, engineers and business owners.

## The relational idea

In 1970, Edgar F. Codd, a researcher at IBM, published a paper proposing the **relational model**: storing data as simple tables of rows and columns, linked by shared values, and retrieving it by describing what is wanted rather than how to find it. The query language now called **SQL** was developed at IBM during the 1970s and later became an international standard. Relational databases have since become the standard way to store business records, from small accounting systems to large enterprise platforms.

Other kinds of database exist, including document, key-value and graph databases, each suited to particular jobs. For structured business records, such as customers, orders, products, jobs and invoices, relational databases remain the most common choice, and the ideas below apply to them.

## Entities, attributes and records

An **entity** is a kind of thing the business keeps information about. Typical entities include customers, suppliers, products, parts, orders, jobs, employees, machines and invoices. Each entity becomes a **table**.

An **attribute** is a piece of information about an entity, such as a customer's name, a part's material or an order's date. Each attribute becomes a **column**, sometimes called a field.

A **record** is one instance of an entity, such as one customer or one order. Each record becomes a **row**.

| Entity | Example attributes |
|---|---|
| Customer | Customer number, name, ABN, billing address, payment terms |
| Part | Part number, description, material, unit of measure, current revision |
| Job | Job number, customer, site, start date, status |
| Machine | Asset number, make, model, location, commissioning date |
| Employee | Employee number, name, role, start date |

Deciding which entities exist is the most important step in designing a database. It is a business question before it is a technical one: what are the things this business needs to keep track of, and what does it need to know about each?

## Keys: identifying each record

Every table needs a reliable way to identify each record uniquely. That identifier is the **primary key**.

There are two broad approaches:

- **Natural keys** use a value that already means something in the business, such as a part number or ABN.
- **Surrogate keys** use a value created by the system purely for identification, typically a sequence number that has no business meaning.

Natural keys are tempting but risky. Business identifiers change: customers merge, part numbering schemes are revised, and people change their names. If a meaningful code is used as the primary key throughout a database, changing it can be difficult. Many designers therefore use surrogate keys internally while still storing and enforcing the uniqueness of business codes such as part numbers.

A **foreign key** is a column in one table that holds the primary key of a record in another table, creating a link. An order table, for example, holds the customer's key rather than repeating the customer's name and address.

## Relationships between entities

Relationships describe how entities connect. There are three basic kinds:

- **One-to-many.** One customer can place many orders, but each order belongs to one customer. This is the most common relationship and is implemented with a foreign key in the "many" table.
- **Many-to-many.** An order can include many products, and a product can appear on many orders. Relational databases represent this with a linking table, often called a junction table. In this example, the linking table is the **order line**, which records which product, how many and at what price.
- **One-to-one.** Each record in one table matches at most one record in another, for example a machine and its extended technical specification. This is less common and often used to separate rarely used or sensitive information.

```figure
type: svg
title: Three kinds of relationship
alt: Three pairs of boxes. Customer to Order is one-to-many: one customer, many orders. Order to Product is many-to-many through an Order line table between them. Machine to Specification is one-to-one.
caption: Many-to-many relationships are represented with a linking table, here the order line.
viewbox: 0 0 640 250
body:
<rect class="bx" x="20" y="30" width="130" height="40" rx="6"/>
<text class="tx" x="85" y="55" text-anchor="middle">Customer</text>
<rect class="bxa" x="250" y="30" width="130" height="40" rx="6"/>
<text class="txb" x="315" y="55" text-anchor="middle">Order</text>
<path class="ln flow" d="M150 50H250"/>
<text class="tx txs" x="160" y="44">1</text>
<text class="tx txs" x="232" y="44">many</text>
<rect class="bxi" x="250" y="110" width="130" height="40" rx="6"/>
<text class="tx" x="315" y="135" text-anchor="middle">Order line</text>
<rect class="bx" x="480" y="110" width="130" height="40" rx="6"/>
<text class="tx" x="545" y="135" text-anchor="middle">Product</text>
<path class="ln flow" d="M315 70V110M380 130H480"/>
<text class="tx txs" x="322" y="96">many</text>
<text class="tx txs" x="440" y="124">many</text>
<rect class="bx" x="20" y="190" width="130" height="40" rx="6"/>
<text class="tx" x="85" y="215" text-anchor="middle">Machine</text>
<rect class="bx" x="250" y="190" width="130" height="40" rx="6"/>
<text class="tx" x="315" y="215" text-anchor="middle">Specification</text>
<path class="ln flow" d="M150 210H250"/>
<text class="tx txs" x="160" y="204">1</text>
<text class="tx txs" x="238" y="204">1</text>
```

These relationships are often drawn in an **entity-relationship diagram**, a notation introduced by Peter Chen in 1976, in which boxes represent entities and lines represent relationships, with symbols showing whether each side is "one" or "many" and whether the relationship is optional.

Getting relationships right is essential. If a system assumes each customer has one site, but some customers have twenty, the design will force people into workarounds, such as creating duplicate customers for each site.

## Normalisation: store each fact once

**Normalisation** is the process of organising tables so that each fact is stored in one place. It prevents a set of problems that anyone who has managed a large spreadsheet will recognise.

Consider an orders spreadsheet in which each row holds the order number, date, customer name, customer address, product and quantity. If a customer has placed 200 orders, their address appears 200 times. That causes three classic problems, called **anomalies**:

- **Update anomaly.** When the customer moves, all 200 copies must be changed. Miss one, and the records disagree.
- **Insertion anomaly.** A new customer cannot be recorded until they place an order, because customer details exist only on order rows.
- **Deletion anomaly.** Deleting a customer's only order also deletes the only record of that customer.

```figure
type: compare
title: What goes wrong when a fact is stored many times
cols: The anomaly | The cause
caption: A customer with 200 orders has their address repeated 200 times on an orders spreadsheet.
- Update | All 200 copies must change | Miss one and the records disagree
- Insertion | A new customer cannot be recorded | Customer details live only on order rows
- *Deletion | Deleting the only order loses the customer | Nothing else holds the record
```

Normalisation resolves these by splitting the data into a customer table, an order table and an order line table, each holding only the facts that belong to it.

Database theory defines a series of **normal forms**. The first three cover most practical needs and can be summarised in plain language:

1. **First normal form**: each field holds a single value, and there are no repeating groups such as "Product 1", "Product 2" and "Product 3" columns.
2. **Second normal form**: every fact in a table depends on the whole of its key, not just part of it. A product's description belongs in the product table, not in the order line table, because it depends on the product alone.
3. **Third normal form**: facts depend only on the key, not on other non-key facts. A customer's region, if it is determined by their postcode, belongs in a postcode or region table rather than being stored separately on every customer.

### When to break the rules deliberately

Normalised designs are ideal for recording transactions accurately. For reporting and analysis, designers sometimes **denormalise**, deliberately combining data into wider tables that are faster and simpler to query. That is a legitimate choice when it is deliberate, documented and kept separate from the records of truth, usually in a reporting database or data warehouse.

## Rules a database can enforce

One of the great advantages of a database over a spreadsheet is that it can refuse bad data at the moment of entry. Common rules, called **constraints**, include:

| Rule | Example |
|---|---|
| Data type | A delivery date must be a valid date; a quantity must be a number |
| Required field | Every job must have a customer |
| Uniqueness | No two parts may share a part number |
| Referential integrity | An order line cannot refer to a product that does not exist |
| Allowed values | Status must be one of quoted, accepted, in progress, complete or cancelled |
| Range checks | A discount cannot exceed an approved maximum |

Rules enforced in the database apply no matter which screen, import or integration adds the data. Rules enforced only in one form can be bypassed by another route. For important rules, ask where they are enforced.

## Transactions: all or nothing

Many business actions involve several changes that must succeed or fail together. Transferring stock between two locations reduces one quantity and increases another; if only one change were saved, stock would vanish or appear from nowhere.

Databases handle this with **transactions**, groups of changes treated as a single unit. Database specialists describe reliable transactions with the acronym **ACID**: they are atomic, meaning all or nothing; consistent, meaning rules are satisfied before and after; isolated, meaning simultaneous transactions do not interfere; and durable, meaning completed changes survive failures such as power loss. These properties are why databases can support many users entering orders and payments at once without corrupting each other's work.

## Indexes, queries and performance

An **index** is like the index of a book: a separate structure that lets the database find records quickly without reading every row. Indexes on commonly searched fields, such as customer numbers or order dates, make searches and reports fast. They also have costs: each index takes space and slows the saving of new data slightly, because the index must be updated too.

Data is retrieved with **queries**, usually written in SQL. A simple query to list open jobs for one customer might look like this:

```sql
SELECT job_number, site, start_date
FROM jobs
WHERE customer_id = 1042
  AND status = 'In progress'
ORDER BY start_date;
```

The query describes what is wanted, and the database works out how to retrieve it efficiently. Most users never write SQL; reporting tools and application screens generate queries for them.

## Common modelling mistakes in business systems

Many problems with business systems trace back to a few design mistakes:

- **Free text where a list is needed.** Recording causes of defects as free text makes reporting impossible; a controlled list, with an option to add detail, does not.
- **Several values in one field.** A field holding "Pump, motor, coupling" cannot be counted or searched reliably.
- **Wide tables with repeating columns.** Columns for January, February and March, or Contact 1, Contact 2 and Contact 3, limit the design and complicate reporting.
- **Storing what should be calculated.** Totals stored separately from their components can disagree; storing them is justified only where a historical value must be preserved, such as the price charged on an invoice.
- **Meaningful codes as permanent keys.** When the coding scheme changes, the whole database must change with it.
- **No history.** Overwriting values, such as prices, addresses or revisions, loses the ability to answer what was true at a particular time.
- **Catch-all fields.** Fields named "Other" or "Notes" that gradually hold important information nobody can report on.
- **Ignoring real-world variety.** Designing for the typical customer, product or job and forcing exceptions into workarounds.

## Reviewing a proposed data model

When a developer or vendor proposes a database design or configuration, a manager can test it with practical questions:

- **Which entities does it include, and are any business things missing?**
- **How are records identified, and what happens if a business code changes?**
- **Can a customer have several sites, contacts and billing arrangements?**
- **Can a product have revisions, alternatives and several suppliers?**
- **Which rules are enforced in the database, and which only on screens?**
- **What history is kept, and can we see who changed what?**
- **How will reports be produced without slowing daily work?**
- **How can all of our data be exported if we change systems?**

Walking through real examples, especially awkward ones, is one of the most effective tests. If the design cannot represent last month's most complicated job without workarounds, it needs more work. The [requirements that can be traced and tested](/reados/collections/project-planning-and-control/requirements-that-can-be-traced-and-tested/) article explains how to write requirements that can be checked against a design.

## A worked example

This is an illustrative example. A maintenance contractor with 25 technicians tracks work in a spreadsheet with one row per job, holding the customer's name, site address, contact, job description, technician, hours and parts used, with up to five parts recorded in "Part 1" to "Part 5" columns.

**Problems.** Customers with several sites appear under slightly different names; when a site contact changes, old rows still show the old contact; jobs needing more than five parts are split across rows; and the business cannot easily report parts usage or hours by site.

**The model.** Working with a developer, the operations manager identifies the entities: customer, site, contact, job, technician, time entry, part and part usage. Each customer can have many sites, and each site many contacts and jobs. Each job can have many time entries and many part usages, and each part usage links one job to one part with a quantity.

**Rules.** Every job must belong to a site; every time entry must have a technician, a date and hours between 0.25 and 16; part numbers must be unique; and job status must come from a fixed list.

**Result.** The new system records each fact once. Reports of hours and parts by customer and site, which took about a day each month to prepare, are produced in minutes. Duplicate customers, about 8% of the original list, are merged during migration. The manager could review and improve the design without writing code, because the model was explained in terms of the business's own things and rules.

```figure
type: stats
title: A maintenance contractor leaves its job spreadsheet
caption: Every job belongs to a site; time entries need a technician, a date and 0.25 to 16 hours.
- A day → minutes | Monthly hours-and-parts reports
- *8% | Duplicate customers merged
```

## Applying this in an Australian business

- **List the things your business tracks** before choosing or building a system.
- **Use real, awkward examples** to test whether a design fits.
- **Ask how records are identified** and what happens when codes change.
- **Check that important rules are enforced** wherever data enters.
- **Decide what history matters** and confirm the design keeps it.
- **Separate reporting from transaction recording** when volumes grow.
- **Make sure your data can be exported** in a usable form.

## Questions worth considering

- Which things does our business keep track of, and are they all represented in our systems?
- Where are we typing the same information into several places?
- Which of our reports require manual work because data is stored in free text or wide tables?
- What would break if we changed our part numbering or customer coding?
- Who in the business understands the structure of our key systems?

## Bringing it together

Relational databases organise business information as tables of entities, identified by keys and linked by relationships. Normalisation stores each fact once, avoiding the update, insertion and deletion problems familiar from large spreadsheets. Constraints refuse bad data at entry, transactions keep related changes together, and indexes make searches fast. Managers who understand these ideas can describe their requirements clearly, test designs with real examples and avoid common mistakes, without needing to write code themselves.

---

*Source: BIZOMAT editorial notes, drawing on general relational database principles and information systems practice. The worked example is illustrative. This article is general information.*
