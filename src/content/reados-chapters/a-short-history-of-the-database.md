---
title: "From punched cards to the cloud: a short history of the database and what it teaches businesses"
description: "Databases evolved from punched cards and tape to relational systems, NoSQL and cloud services. How each step solved a problem, and lessons about data that outlives its systems."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - systems
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

Every order, invoice, payroll run and production schedule in a modern business depends on a database, yet the technology is younger than many people realise. Within a single long career, business records moved from filing cabinets and punched cards to magnetic tape, then to disks, then to relational databases queried in a standard language, then onto personal computers, the web and finally cloud services that can store more data than any business of the 1960s could have imagined.

```figure
type: steps
title: Where business records have lived
caption: Records outlive the systems that hold them, so export retired data to documented, open formats.
- Filing cabinets and punched cards
- Magnetic tape | batch processing
- Disks | direct access
- *Relational databases | queried in a standard language
- Personal computers and the web
- Cloud services
```

Each stage in that history solved a specific problem left by the one before: the slowness of manual records, the rigidity of tape, the difficulty of changing early database structures, the expense of central computers, the scale demanded by the internet. Each also created new problems, many of which businesses still face: data trapped in old formats, applications that depend on one person's knowledge, inconsistent definitions across systems and the temptation to adopt new technology before understanding what it is for.

This article traces the main stages of database history in plain language and draws out lessons for businesses about abstraction, standards, the lasting value of data, the difference between storage and meaning, and how to judge new technology. It is general information for anyone interested in how business information systems came to be.

## Cards and tabulators

For the 1890 United States census, Herman Hollerith's electric tabulating machines read information punched into cards, allowing census data to be counted far faster than by hand. Hollerith's company later became part of the business that took the name International Business Machines, IBM, in 1924. For decades, punched cards were the standard medium for business data: each card a record, each column a field, with machines that sorted, counted and printed reports.

Card systems established ideas still central to databases: **records** with fixed **fields**, **sorting** and **summarising**, and the separation of data from the machines that processed it. They were also slow, bulky and easily disordered; a dropped tray of cards could take hours to reassemble.

## Tape and batch processing

Electronic computers arrived in business in the 1950s, storing data on **magnetic tape**. Tape held far more than cards and was faster to read, but it was **sequential**: to find one record, the computer read through everything before it. Business processing was organised in **batches**: the day's transactions were sorted into the same order as the master file and processed together overnight, producing an updated master tape and printed reports.

Batch thinking still shapes business systems, in nightly processing runs, month-end closes and the habit of reporting from yesterday's data.

### An Australian milestone

Australia was early to electronic computing. CSIRAC, built by the Council for Scientific and Industrial Research in Sydney, ran its first program in 1949 and was one of the world's earliest stored-program computers. It later moved to the University of Melbourne, where it served researchers and industry until the 1960s, and it is preserved today by Museums Victoria. Computers of that era stored data on delay lines, drums and paper tape, and their capacity was tiny by later standards, but they established the idea that a machine could hold both a program and the data it worked on. The [from transistor to smartphone](/reados/collections/engineering-history-modern-era/from-transistor-to-smartphone-engineering-the-digital-economy/) article traces how electronics then shrank and cheapened to make computing ubiquitous.

## Disks and direct access

In 1956, IBM introduced the RAMAC computer with the first commercial hard disk drive, storing about five million characters on a stack of large spinning platters. Disks allowed **direct access**: the computer could go straight to any record without reading the others. That made interactive, up-to-date systems possible, such as checking stock or a customer's account while they waited.

Direct access raised a new question: how should related records be organised on disk so programs could find them efficiently? Early answers tied data structures closely to the programs that used them, so changing the structure meant rewriting programs.

## The first database management systems

During the 1960s, software appeared to manage data on behalf of many programs:

- **Hierarchical databases** organised records in tree structures, with each record having one parent. IBM's Information Management System, developed in the 1960s in connection with the Apollo space program to manage complex bills of materials, became one of the most widely used. Hierarchies suited structures such as assemblies and components but struggled with data that did not fit a single tree.
- **Network databases** allowed records to have several relationships. Charles Bachman's Integrated Data Store, developed at General Electric in the early 1960s, was an early example, and an industry committee, CODASYL, published standards for the network model around 1970. Bachman received computing's Turing Award in 1973.

These systems were powerful but demanding. Programmers had to navigate from record to record along predefined paths, and questions the designers had not anticipated could require new programs.

## The relational revolution

In 1970, Edgar F. Codd, a researcher at IBM, proposed the **relational model**: store data in simple tables, link them through shared values rather than physical pointers, and let users describe what data they want rather than how to navigate to it. The idea separated the logical view of data from its physical storage, so structures could change without rewriting every program.

Research projects turned the idea into working systems during the 1970s: IBM's System R, which produced the query language that became SQL, and Ingres at the University of California, Berkeley. Commercial products followed. Oracle released one of the first commercial SQL databases in 1979, and IBM released DB2 in 1983. SQL became an American national standard in 1986.

Codd received the Turing Award in 1981. Later awards recognised Jim Gray in 1998 for work on transactions, the techniques that let many users change data safely at once, and Michael Stonebraker in 2014 for contributions to modern database systems.

```figure
type: timeline
title: From tabulators to SQL
caption: The relational model made data queryable in a standard language, and SQL became a national standard in 1986.
- 1890 | Hollerith's tabulators | the US census on punched cards
- 1949 | CSIRAC runs | one of the earliest stored-program computers
- 1956 | IBM RAMAC | the first commercial hard disk
- *1970 | Codd's relational model | data as tables
- 1979 | Oracle | an early commercial SQL database
- 1986 | SQL standardised | an American national standard
```

### Transactions: keeping the money right

As databases took over banking, airline reservations and inventory, a practical problem became urgent: how to let many people change data at the same time, and survive failures, without losing or duplicating money and stock. Through the 1970s, researchers including Jim Gray developed the theory and techniques of **transactions**: groups of changes that succeed or fail as a unit, kept isolated from each other and recorded durably in logs so they survive crashes. These ideas, later summarised by the acronym ACID, are why an automatic teller machine withdrawal either completes fully or not at all, and why two people cannot both book the last seat on a flight. Every modern business system relies on them.

## Personal computers and departmental databases

From the late 1970s, personal computers brought databases to desktops. Products such as dBase in the early 1980s and Microsoft Access, released in 1992, let non-specialists build their own applications. Spreadsheets also became de facto databases in countless businesses.

This democratisation produced enormous value and a lasting legacy problem: thousands of small applications built by enthusiastic staff, holding important records, often undocumented and dependent on their authors.

## Client-server, ERP and the data warehouse

In the 1990s, businesses moved from central mainframes and isolated PCs to **client-server** systems, with desktop applications connected to shared database servers. Integrated **enterprise resource planning** systems combined finance, purchasing, inventory, production and sales on one database, replacing collections of separate programs.

As transaction systems multiplied, businesses struggled to analyse their data. **Data warehouses**, described by Bill Inmon and Ralph Kimball among others in the early 1990s, collected and reorganised data from operational systems for reporting and analysis, keeping history and applying consistent definitions.

## The web and open source

The web made databases public-facing: online shops, booking systems and customer portals required databases available around the clock to unknown numbers of users. Open-source databases, including MySQL, first released in 1995, and PostgreSQL, which grew from Berkeley research, made capable databases available without licence fees and became foundations of web applications.

## Scale, NoSQL and the cloud

In the 2000s, the largest internet companies needed to store and serve data at a scale beyond what traditional databases on single servers handled easily. Influential papers from Google, describing its Bigtable system in 2006, and Amazon, describing its Dynamo system in 2007, prompted a wave of **NoSQL** databases that spread data across many servers, often trading strict consistency or flexible querying for scale and availability.

At the same time, cloud providers began offering databases as services. Amazon's relational database service launched in 2009, and other providers followed. Businesses could now rent a managed database by the hour rather than buying servers and hiring administrators.

Since then, the lines have blurred. Relational databases have added flexible document storage and scaled further; many NoSQL databases have added transactions and SQL-like languages; and analytical databases, time-series databases and vector databases for artificial intelligence have joined the mix.

## Lessons for businesses

### Abstraction lowers the cost of change

The relational model's great contribution was separating what data means from how it is stored. Businesses benefit from the same principle in their own systems: interfaces, views and documented data models let parts change without breaking everything else.

### Standards create ecosystems

SQL's standardisation created a vast ecosystem of tools, skills and products that work together. When choosing technology, widely adopted standards usually beat clever proprietary alternatives, because skills, tools and support remain available.

### Data outlives applications

Businesses have moved their records from cards to tape, tape to disk, mainframes to servers and servers to the cloud. Applications come and go; data persists. Plan for every system to be replaced eventually: choose systems that can export complete data, document what data means and keep archives readable.

### Storage became cheap; meaning did not

The cost of storing data has fallen by many orders of magnitude since the first disk drives. The expensive parts are now deciding what data to keep, defining it consistently, keeping it accurate and using it well. Investment in data quality and definitions often returns more than investment in storage.

### Democratisation brings legacy

Desktop databases and spreadsheets let businesses solve problems quickly, and many of those solutions became critical. The lesson is not to prevent people building tools, but to recognise when a tool has become a system and give it proper ownership, backups and documentation. The [managing legacy Visual Basic 6 applications](/reados/collections/business-systems-security-and-it-decisions/managing-legacy-visual-basic-6-applications/) article describes how to deal with one common generation of such tools.

### New technology solves specific problems

Each generation of databases solved a real limitation of the previous one, but none made the previous one obsolete for every purpose. Tape still stores backups; hierarchical databases still run in some large organisations; relational databases remain the foundation of most business systems. When a new technology is promoted, ask what problem it solves and whether the business has that problem.

### Batch habits linger

Many business processes still reflect the batch era: overnight runs, monthly reports and data that is a day old. Some of these remain sensible; others are worth revisiting now that up-to-date information is cheap to provide.

## A worked example

This is an illustrative example. A family-owned engineering business founded in the 1970s has kept customer and job records through several generations of technology: card files in the early years, a minicomputer accounting system in the 1980s, an Access job database built by an engineer in the late 1990s, an accounting package in the 2000s and a cloud job management system adopted in the 2020s.

**The problem.** A customer asks for the original design records and inspection data for equipment supplied 25 years earlier, which is now being modified. The relevant job number exists in old paper registers, but the Access database that held inspection results was archived as a file on a backup drive, and nobody has a computer that opens it easily.

**Recovery.** With help from an IT provider, the old database is opened in a virtual machine and the records exported to open formats. The paper drawings are found in storage, but some are damaged.

**Changes.** The business inventories its historical records across all generations, exports old databases to documented open formats, scans critical paper records, and adopts a policy that every system retirement includes a tested export and archive. It adds a requirement that any new system must allow complete data export.

**Result.** The customer receives most of the information requested, and the business is better prepared for the next request, and for the day its current systems are themselves replaced.

## Applying this in an Australian business

- **Inventory historical records** across every generation of systems the business has used.
- **Export retired systems' data** to documented, open formats and test that it can be read.
- **Require complete data export** from every new system and service.
- **Document what key data means**, so it survives changes of system and staff.
- **Prefer widely adopted standards** and established products for core records.
- **Give home-grown tools** proper ownership, backups and documentation once they matter.
- **Question batch habits** where more current information would help decisions.

## Questions worth considering

- How many generations of systems have held our business records, and can we still read them?
- Which of our current systems could export all our data in documented formats?
- Where are our critical records defined, and by whom?
- Which processes still follow batch-era habits that no longer serve us?
- What problem does the next technology we are considering actually solve?

## Bringing it together

Databases evolved from punched cards and tape to disks, hierarchical and network systems, the relational model and SQL, desktop databases, client-server and ERP systems, data warehouses, open-source web databases, NoSQL and cloud services. Each step solved a real problem and left new ones. For businesses, the lessons are enduring: separate meaning from storage, prefer widely adopted standards, plan for data to outlive every application, invest in definitions and quality, give important home-grown tools proper care and judge new technology by the problem it solves.

---

*Source: BIZOMAT editorial notes, drawing on established histories of computing and database systems. Dates are widely cited approximations. The worked example is illustrative. This article is general information.*
