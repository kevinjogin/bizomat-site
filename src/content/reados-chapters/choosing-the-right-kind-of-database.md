---
title: "Relational, document, graph or time-series: choosing the right kind of database for the job"
description: "Different databases suit different data shapes and workloads. How relational, document, key-value, graph, time-series, search and analytical databases compare, and how to choose."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - design
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

For several decades, choosing a database for a business system meant choosing between products of the same kind: relational databases that store data in tables and are queried with SQL. Since the late 2000s, the choice has widened. Developers and vendors now talk about document databases, key-value stores, graph databases, time-series databases, search engines, analytical column stores and, more recently, vector databases for artificial intelligence.

Each kind exists because it handles a particular shape of data or a particular workload better than the others. None is best for everything. For most small and medium businesses, a well-chosen relational database remains the right foundation for core records, and the others are useful for specific jobs such as machine data, product search or analytics. Choosing well matters because the database shapes what a system can do easily, how it performs as it grows and what skills are needed to run it.

This article explains the main kinds of database in plain language, what each is good and poor at, the trade-offs between consistency and scale, and a practical way to decide which to use. It is general information for managers and engineers commissioning or evaluating systems, not a guide to any particular product.

## Why different kinds of database exist

Data comes in different shapes. Some is highly structured and interrelated, such as orders, invoices and stock. Some varies from record to record, such as product specifications in a catalogue with thousands of different attributes. Some is a stream of timestamped readings from sensors. Some is a network of connections, such as which components go into which assemblies. Some is text that people want to search.

Workloads differ too. A business system records many small transactions and must never lose or corrupt one. An analytics system reads huge amounts of data to produce summaries. A website may serve millions of simple lookups. Designing one database to be excellent at all of these is difficult, so specialised databases emerged.

In the late 2000s, large web companies needed to store and serve data at a scale that traditional relational databases on single servers struggled with. A wave of alternatives, often grouped under the label **NoSQL**, traded some of the guarantees of relational databases for flexibility and the ability to spread data across many servers. Since then, the categories have blurred: many relational databases now store flexible documents, and many NoSQL databases have added transactions and query languages.

## Relational databases

**Relational databases** store data in tables of rows and columns, linked by keys, and are queried with SQL. Examples include Microsoft SQL Server, Oracle Database, PostgreSQL, MySQL and SQLite.

**Strengths:**

- **Structure and integrity**: data types, required fields and relationships are enforced.
- **Reliable transactions**: related changes succeed or fail together.
- **Flexible querying**: SQL can answer questions nobody anticipated when the database was designed.
- **Maturity**: decades of tools, skills, documentation and support.

**Limitations:**

- **Structural change takes care**: adding or reorganising tables in a busy system requires planning.
- **Very large scale** across many servers is harder than for some alternatives, although modern relational systems scale much further than many businesses will ever need.
- **Varied attributes** are awkward to model purely in tables, although many relational databases now store flexible document data in columns alongside structured data.

Relational databases suit core business records: customers, items, orders, invoices, jobs, stock, employees and financial transactions.

## Document databases

**Document databases** store each record as a self-contained document, usually in a format similar to JSON, with nested fields that can vary between documents. MongoDB is a well-known example.

**Strengths:**

- **Flexible structure**: each document can hold different fields, which suits catalogues, forms and records whose attributes vary.
- **Natural fit for applications** that work with whole objects, such as a product with all its specifications, images and options.
- **Scaling across servers** is often built in.

**Limitations:**

- **Relationships between documents** are weaker; data that must be consistent across many documents is harder to manage.
- **Duplication** is common, because related information is often embedded in each document.
- **Flexible structure can become inconsistent structure** without discipline.

Document databases suit content management, product catalogues with varied attributes, user profiles and event data whose shape changes.

## Key-value stores

**Key-value stores** hold values that are looked up by a unique key, like a very fast dictionary. Redis is a widely used example.

They are extremely fast for simple lookups and are often used for **caching** frequently used data, holding website session information, counting events and queuing tasks. They are poor at answering questions that require searching or combining values, so they rarely serve as the main record of a business.

## Wide-column stores

**Wide-column stores**, such as Apache Cassandra, organise data in rows that can hold very large and variable numbers of columns and are designed to spread data across many servers and data centres. They handle enormous volumes of writes and remain available when individual servers fail. They are used for large-scale logging, messaging and sensor platforms, and are more than most small businesses need.

## Graph databases

**Graph databases** store **nodes**, such as parts, people or companies, and **relationships** between them, such as "is a component of", "supplies" or "reports to". Neo4j is a well-known example.

They excel at questions that follow chains of relationships of unknown length: which finished products contain a particular component at any level, which suppliers depend on a single sub-supplier, how two accounts are connected through intermediaries, or what the shortest route is through a network. Relational databases can answer many such questions using recursive queries, but graph databases make deep and varied relationship queries simpler and often faster.

Graph databases suit supply chain mapping, fraud detection, network and infrastructure management, recommendation systems and complex product structures. They are less suited to high-volume transaction recording and routine reporting.

## Time-series databases

**Time-series databases** store measurements recorded over time, such as temperatures, pressures, energy use, machine states and prices. Each record is essentially a timestamp, a source and one or more values. Industrial **process historians**, long used in manufacturing and utilities, are a specialised form.

They are designed to:

- **Ingest large volumes** of readings continuously.
- **Compress data** efficiently, because readings often change little.
- **Answer time-based questions** quickly, such as averages per minute or maximums per shift.
- **Downsample and expire data**, keeping detailed readings for a short period and summaries for longer.

They suit machine monitoring, energy management, environmental monitoring and any application with sensors.

## Search engines

**Search engines**, such as Elasticsearch and OpenSearch, index text so that people can search it quickly with relevance ranking, spelling tolerance and filters. They power website search, document search and log analysis.

They are usually a secondary store: data is copied into the search index from the system of record, and the index is rebuilt if needed. They should not be relied on as the only copy of business records.

## Analytical databases

**Analytical databases**, often called data warehouses, are designed for reading and summarising large amounts of data rather than recording individual transactions. Many store data **by column** rather than by row, so a query that totals one column across millions of records reads only that column. They suit reporting, dashboards and analysis across years of history, and are commonly offered as cloud services.

## Vector databases

**Vector databases** store numerical representations of text, images or other content, called embeddings, produced by artificial intelligence models. They find items that are similar in meaning rather than matching exact words. They are used in AI applications that search company documents to answer questions. The [putting company knowledge to work with RAG](/reados/collections/ai-in-business-practice/putting-company-knowledge-to-work-with-rag/) article explains how such systems retrieve information. Many relational and search databases now offer vector search as a feature, so a separate vector database is not always needed.

## Spatial data

Location data, such as customer sites, delivery routes, asset positions, service areas and property boundaries, has its own needs: finding everything within a distance, testing whether a point lies inside an area or calculating routes. Many relational databases offer **spatial extensions** for this, such as PostGIS for PostgreSQL, and geographic information systems build on them. Businesses with field service, logistics, infrastructure or property data often benefit from storing locations properly rather than as text addresses, because spatial queries then become simple and fast.

## Databases inside products

Databases are not only found in business systems. Machines, instruments, controllers and mobile apps often contain small **embedded databases**, such as SQLite, that store settings, logs, recipes and readings on the device itself. Manufacturers of equipment should treat these like any other component: understand their limits, plan how data is synchronised with central systems, protect them from corruption when power is lost and consider how logs will be retrieved for service and failure investigation.

## Consistency and scale: the trade-off

When data is spread across several servers, a system must decide what to do if those servers cannot communicate. In 2000, the computer scientist Eric Brewer proposed what became known as the **CAP theorem**: a distributed system that experiences a network partition, a break in communication between servers, must choose between **consistency**, where every user sees the same up-to-date data, and **availability**, where every request still receives a response.

Traditional business systems usually favour consistency: it is better to refuse an order briefly than to sell stock that does not exist. Some large-scale web systems favour availability and accept **eventual consistency**, where copies of data may differ briefly before converging. For business records involving money, stock and commitments, strong consistency is usually the right choice.

## A practical decision guide

| Need | Usually suitable |
|---|---|
| Core business records: orders, stock, invoices, jobs, finance | Relational database |
| Records with highly variable attributes | Relational with document columns, or a document database |
| Very fast lookups, caching and sessions | Key-value store, alongside the main database |
| Deep relationship and network questions | Recursive queries in a relational database, or a graph database |
| Sensor and machine readings | Time-series database or process historian |
| Text search across documents or a website | Search engine, fed from the system of record |
| Reporting across large history | Analytical database or data warehouse |
| Similarity search for AI applications | Vector search, often within an existing database |

```figure
type: decision
title: Which kind of database?
question: What does the data need to do?
caption: Most businesses need a relational database for core records, and add others only for specific workloads.
- Core business records | Relational
- Highly variable attributes | Document columns or a document database
- Very fast lookups and caching | Key-value, alongside
- Sensor and machine readings | Time-series
- Text search | Search engine, fed from the record
- *Reporting across long history | Analytical database
```

## The cost of using many kinds

Using a different database for every job, sometimes called **polyglot persistence**, can give each part of a system the best tool. It also multiplies costs: more products to license, host, secure, back up, patch and monitor, more skills to maintain and more data copies to keep consistent. For small and medium businesses, the sensible default is one well-chosen relational database for core records, adding specialised databases only where a clear need justifies the extra complexity. The [right choice depends on the system around it](/reados/collections/business-systems-security-and-it-decisions/the-right-choice-depends-on-the-system-around-it/) article explores this principle more widely.

## Questions to ask when a supplier proposes a database

- **Why this kind of database for this data?**
- **What happens to data consistency if a server or network fails?**
- **How are backups, restores and upgrades handled?**
- **What skills are needed to operate it, and who has them?**
- **How will data be reported on and exported?**
- **What does it cost to license and host as volumes grow?**
- **How long has the product been established, and how widely is it used?**

## A worked example

This is an illustrative example. A manufacturer of configurable conveyor systems plans three new capabilities: an online configurator for customers, monitoring of conveyors installed at customer sites, and better search on its website. A consultant initially proposes four databases: a document database for configurations, a graph database for product structures, a time-series database for monitoring and a search engine for the website.

**Review.** The manufacturer's engineering manager asks what each adds and who will run it. The business has one IT staff member and an external provider.

**Decision.** Configurations and orders go into the existing relational database, with variable configuration options stored in a document column. Product structures are handled with recursive queries, which the database supports, because structures are at most six levels deep. Conveyor monitoring uses a managed time-series service, because readings arrive every few seconds from hundreds of sensors and must be summarised by hour and day. Website search uses the search feature built into the existing website platform.

**Result.** The business adds one new database service instead of four, reducing licensing, hosting and support costs and keeping skills requirements manageable, while each capability still uses a tool suited to its data.

```figure
type: compare
title: Four proposed databases, one added
cols: Proposed | Decided
caption: The business had one IT staff member and an external provider to run whatever it chose.
- Configurations | Document database | Existing relational database, document column
- Product structures | Graph database | Recursive queries; at most six levels deep
- *Monitoring | Time-series database | A managed time-series service
- Website search | Search engine | Fed from the system of record
```

## Applying this in an Australian business

- **Default to a relational database** for core business records.
- **Add specialised databases** only for clear needs, such as sensor data or search.
- **Prefer consistency** for records involving money, stock and commitments.
- **Count the operating costs** of each additional database.
- **Check skills and support** available locally for any product chosen.
- **Make sure data can be exported** from every database you adopt.

## Questions worth considering

- What shapes of data does our business hold, and does our current database handle them well?
- Are we using several databases where one would do?
- Which of our data needs strong consistency, and which can tolerate brief delays?
- Who has the skills to operate each database we rely on?
- How would we move our data if a database product were discontinued?

## Bringing it together

Different kinds of database suit different data and workloads: relational databases for structured, interrelated business records; document databases for varied records; key-value stores for fast lookups; graph databases for relationships; time-series databases for sensor data; search engines for text; analytical databases for reporting; and vector search for AI applications. For most businesses, a relational database remains the right foundation, with specialised databases added only where they clearly earn their extra cost and complexity.

---

*Source: KEVOS® editorial notes, drawing on general database systems principles and industry practice. Product names are examples only. The worked example is illustrative. This article is general information.*
