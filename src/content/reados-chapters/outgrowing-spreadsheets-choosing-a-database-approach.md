---
title: "When a business outgrows its spreadsheets: choosing between spreadsheets, databases, low-code apps and packaged systems"
description: "Spreadsheets are superb for analysis but fragile as shared record systems. How to recognise when one has become a system, and how to choose and make a move that lasts."
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

Almost every business runs on spreadsheets. They hold quotes, job registers, stock lists, quality logs, maintenance schedules, training records, price lists and cash forecasts. They are flexible, familiar and quick to change, and for many tasks nothing is better. A capable person can build in an afternoon what would take a software project weeks.

The trouble starts when a spreadsheet quietly becomes a system. More people need to use it, copies are emailed around, someone adds a tab for last year's records, formulas reach across sheets, and the business begins to depend on one file that only one person fully understands. Errors creep in unnoticed, two people overwrite each other's changes, and a customer or auditor asks a question that the spreadsheet cannot answer reliably.

This article explains what spreadsheets do well and where they fall short, the signs that a spreadsheet has become a business system, how databases work differently, the main options for moving on, from a better-structured spreadsheet to packaged software, and how to choose and make the move without losing data or goodwill. It is general information for business owners and managers who are not database specialists.

## What spreadsheets do well

A **spreadsheet** is a grid of cells that can hold numbers, text and formulas. Its strengths are real:

- **Speed.** A new calculation, list or report can be built in minutes.
- **Flexibility.** Structure can change as quickly as thinking changes.
- **Transparency of calculation.** Formulas can be inspected, and results recalculate instantly when inputs change.
- **Familiarity.** Most office workers already know the basics.
- **Analysis.** Sorting, filtering, pivot tables and charts make spreadsheets excellent for exploring data.

Spreadsheets are at their best for analysis, modelling and personal or small-team work: cost estimates, cash forecasts, what-if scenarios, one-off lists and summaries of data extracted from other systems.

## Where spreadsheets fall short as systems

The same flexibility that makes spreadsheets useful makes them fragile when they are used as shared records:

- **Nothing enforces structure.** Anyone can type text into a number column, leave required information blank or insert a row that breaks a formula.
- **Data is repeated.** A customer's name and address may be typed into hundreds of rows, each copy able to differ from the others.
- **Concurrent editing is limited.** Even with shared cloud files, it is easy for people to overwrite or reorganise each other's work.
- **History is weak.** Most spreadsheets show the current state, not who changed what and when. Version history helps, but it is hard to search.
- **Errors are hard to see.** A formula copied incorrectly or a range that misses new rows can produce plausible but wrong results for months.
- **Access control is coarse.** It is difficult to let one person see some rows and edit others.
- **Scale is limited.** Large files become slow, and older file formats have row limits.

Spreadsheet errors are not a rare problem. Researchers who have audited real business spreadsheets have repeatedly found that a large share contain errors, many of them in formulas. High-profile examples show the consequences. In 2020, Public Health England failed to transfer nearly 16,000 positive COVID-19 test results into its contact-tracing system on time, because data passed through an older spreadsheet file format whose row limit silently cut off records. The technology did exactly what it was designed to do; it was being used for a job it was not designed for.

## Signs a spreadsheet has become a system

The following symptoms suggest a spreadsheet has outgrown its role:

| Symptom | Why it matters |
|---|---|
| Several people edit the same file every day | Changes collide and responsibility blurs |
| Copies are emailed or saved locally | Nobody is sure which copy is current |
| The same information is typed in several places | Copies drift apart and reconciliation wastes time |
| Formulas link across many sheets or files | Errors spread and are hard to trace |
| People need to know who changed what | The spreadsheet cannot show an audit trail reliably |
| Customers, auditors or regulators rely on the records | Errors now carry legal or commercial consequences |
| Only one person understands the file | The business has a single point of failure |
| Data must be re-typed into other systems | Double entry creates errors and delay |
| The file is slow or near its size limits | Performance and reliability are declining |
| Reports take hours of manual preparation | Time is spent assembling data rather than using it |

One or two symptoms may be tolerable. Several together usually mean the spreadsheet is carrying more risk and cost than it appears to.

## How a database works differently

A **database** is an organised collection of data managed by software, called a **database management system**, that controls how data is stored, checked, shared and retrieved. Most business systems use **relational databases**, which store data in tables of rows and columns linked by shared identifiers. They differ from spreadsheets in several important ways:

- **Each fact is stored once.** A customer's details live in one customer record; orders refer to that record rather than repeating the details.
- **Structure is enforced.** Each field has a defined type, such as a date, number or code from a list, and required fields cannot be left blank.
- **Relationships are protected.** The database can prevent an order from referring to a customer who does not exist, or stop a customer being deleted while orders depend on it.
- **Many users can work at once.** The database manages simultaneous changes so that one person's work does not silently overwrite another's.
- **Changes can be all-or-nothing.** Related changes, such as moving stock between locations, either complete together or not at all.
- **Access can be controlled finely.** Different people can be allowed to see, add or change different information.
- **History can be kept.** Changes can be logged with who made them and when.

```figure
type: compare
title: Spreadsheet or database
cols: Spreadsheet | Database
best: 2
caption: Spreadsheets remain excellent for analysis; they are fragile as shared systems of record.
- Facts | Repeated in many rows | Stored once and referred to
- Structure | Nothing enforced | Types, required fields, relationships
- Users | Edits collide | Many users managed at once
- History | Mostly current state | Changes logged with who and when
```

Most people never work with a database directly. They use applications, such as accounting software, customer relationship management systems or custom forms, which store their data in a database behind the scenes.

## The options for moving on

There is no single right answer. The options range from improving the spreadsheet to replacing it with packaged software:

| Option | Suits | Strengths | Risks and limits |
|---|---|---|---|
| A better-structured spreadsheet | Small teams, low risk, mainly analysis | Cheap, quick, familiar | Still fragile if many people edit records |
| Shared lists and online forms | Simple registers, data collection from many people | Easy to set up, consistent entry | Limited relationships and reporting |
| Desktop database, such as Microsoft Access | Small teams on one network, moderate complexity | Real tables, forms and reports at low cost | Depends on in-house skills; can become a new single point of failure |
| Low-code application platform | Departmental systems built by capable staff | Fast to build, web and mobile access, permissions | Subscription costs, platform dependence, governance needed |
| Custom database application | Distinctive processes not served by packages | Fits exactly; can scale | Development cost, ongoing maintenance, key-developer risk |
| Packaged software (accounting, CRM, ERP, quality, maintenance) | Common business processes | Proven, supported, updated | Licence cost, configuration effort, changing processes to fit |

### Improve the spreadsheet first, where that is enough

For many small problems, a well-structured spreadsheet is the right answer. Useful improvements include:

- **One row per record and one column per field**, with no merged cells or blank spacer rows.
- **Formatted tables** so formulas and filters extend automatically to new rows.
- **Data validation** to restrict entries to dates, numbers or lists.
- **Separate input, calculation and output areas**, with formulas protected.
- **A single shared master file** in managed cloud storage with version history, rather than emailed copies.
- **A named owner** responsible for the structure and for checking results.

### Prefer packaged software for common processes

Accounting, payroll, customer management, inventory, maintenance and quality management are common needs served by many established products. Packaged software brings tested logic, regular updates and support, and avoids building what already exists. The [choosing an ERP system for a small manufacturer](/reados/collections/business-systems-security-and-it-decisions/choosing-an-erp-system-for-a-small-manufacturer/) article explains how to select broader business systems by starting from the problems they must solve.

### Build only where the process is distinctive

Custom databases and low-code applications make sense when a process is specific to the business and gives it an advantage, or when packaged products would need so much adaptation that they lose their benefits. They need ongoing ownership: someone must maintain, back up, secure and improve them.

## Questions that guide the choice

- **How many people use the records, and from where?** More users and remote access favour databases and web applications.
- **How critical are the records?** Records that support safety, compliance, customer commitments or money deserve stronger controls.
- **Do auditors, customers or regulators rely on them?** If so, history, access control and evidence of approvals become important.
- **Does the data need to flow to or from other systems?** Integration is easier with structured databases and packaged products.
- **Who will maintain the solution?** A system nobody can maintain recreates the original problem.
- **What is the full cost over five years?** Include licences, development, configuration, training, data migration, support and the time of internal staff.
- **Can the business get its data out?** Any platform should allow complete export in a usable format.
- **Is the process stable?** A process still changing weekly may be better left in a flexible tool until it settles.

## Making the move well

Moving records from a spreadsheet into a database or application is a small project and benefits from being treated as one.

1. **Define what the records are for.** List the questions the business needs to answer and the decisions the records support.
2. **Identify the things and facts.** Decide which things the business keeps records about, such as customers, jobs, parts or machines, and what information belongs to each.
3. **Clean the data.** Remove duplicates, standardise names and codes, and fill or flag gaps before moving anything. The [data readiness is a business habit](/reados/collections/ai-in-business-practice/data-readiness-is-a-business-habit/) article explains how to judge what is good enough for each use.
4. **Build and test with real examples.** Try typical and awkward cases, including records with missing or unusual information.
5. **Migrate and reconcile.** Check record counts and key totals between the old spreadsheet and the new system.
6. **Train the people who use it.** Show them how the new system makes their work easier, not only what to click.
7. **Retire the spreadsheet.** Make the old file read-only and archive it. If both remain in use, the business will soon have two inconsistent sources.
8. **Assign ownership.** Someone must own the system's structure, users, backups and improvements.

```figure
type: steps
title: Moving off a spreadsheet well
caption: If both the old file and the new system stay in use, the business soon has two inconsistent records.
- Define what the records are for
- Identify the things and facts
- Clean the data
- Build and test with real examples
- Migrate and reconcile
- Train the people who use it
- Retire the spreadsheet
- *Assign ownership
```

## Keep spreadsheets for what they do best

Moving records into a database does not mean abandoning spreadsheets. They remain excellent for analysing data exported from systems, modelling decisions and exploring ideas. A sensible division is that systems hold the records and spreadsheets analyse copies of them. Analysis that becomes routine, such as a weekly report, may later move into the system's own reporting so it no longer needs manual preparation.

## A worked example

This is an illustrative example. An engineering fabricator with about 40 staff keeps its non-conformance records in a spreadsheet. Six people record issues, there are three copies in different folders, and about 900 issues are logged each year. The quality manager spends about six hours a month reconciling the copies and preparing a report. In a customer audit, the business cannot show who closed several corrective actions or when, and receives a finding.

**Options considered.** The team considers improving the spreadsheet, buying a quality management package or building a simple application on the low-code platform included in its existing office software subscription.

**Choice.** Because the process is simple and stable and the business already pays for the platform, it builds a low-code application. A capable quality engineer, supported by an external developer for about 40 hours at an assumed $120 an hour, or $4,800, builds forms for raising, investigating and closing issues, with required fields, drop-down lists for causes and products, automatic notifications and a log of every change.

**Migration.** Two years of records are cleaned, duplicates removed and codes standardised, then imported. Counts by month and by product are checked against the spreadsheet before it is made read-only.

**Result.** Monthly reporting falls from six hours to under one, saving about 60 hours a year. More importantly, the next audit finds complete records showing who did what and when. The business also notes a new responsibility: the application needs an owner, documented design and a plan for changes, or it could become the next single point of failure.

```figure
type: bars
title: Monthly non-conformance reporting
unit: hours
max: 7
caption: About 900 issues a year, previously in three spreadsheet copies; the next audit found complete records.
- Spreadsheet copies reconciled by hand | 6
- *Low-code application | 1 | under an hour
```

## Applying this in an Australian business

- **List the spreadsheets** the business depends on and who maintains each.
- **Check them against the warning signs** in this article.
- **Improve structure** where a spreadsheet is still the right tool.
- **Use packaged software** for common processes.
- **Build only for distinctive processes**, with ownership and documentation.
- **Protect personal information** in any system, in line with the Privacy Act where it applies to your business.
- **Keep records for required periods**, such as tax and employee records.
- **Retire old spreadsheets** once records have moved.

## Questions worth considering

- Which spreadsheet would hurt the business most if it were wrong or lost?
- How many people edit our most important spreadsheets, and how do we know which copy is current?
- Which records are relied on by customers, auditors or regulators?
- Who could maintain our key spreadsheets if their author left tomorrow?
- Which reports take hours to prepare because data must be gathered by hand?

## Bringing it together

Spreadsheets are outstanding tools for analysis and small-scale work, but fragile as shared record systems. When several people depend on the same records, when history and access control matter, and when data must flow between systems, a database-backed solution is usually safer and cheaper over time. Choose between improving the spreadsheet, packaged software, low-code applications and custom databases by considering users, criticality, integration, maintenance and full cost. Then make the move as a small project: define the purpose, clean and migrate the data, train people, retire the old file and give the new system an owner.

---

*Source: BIZOMAT editorial notes, drawing on general database and information systems practice. The worked example is illustrative. This article is general information.*
