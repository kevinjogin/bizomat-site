---
title: "Managing legacy Microsoft Access databases: stabilise, upsize, rebuild, replace or retire"
description: "Many businesses still run important processes on Access databases built years ago. How to assess their risks, stabilise them and choose to upsize, rebuild, replace or retire."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

Microsoft Access has helped countless businesses build their own systems. A capable staff member, often an engineer, accountant or office manager, could create tables, forms and reports for job tracking, quoting, calibration records, maintenance schedules, training registers or customer lists without hiring a developer. Many of those databases are still running a decade or two later, now central to daily work and understood by fewer people each year.

An Access database that has served well for years is not automatically a problem. But legacy Access applications share common risks: they depend on one person's knowledge, they can corrupt when used by several people over a network, they reach size and performance limits, their code and macros raise security and compatibility issues, and they are often missing from backup and support arrangements. Businesses discover these risks when the database fails, its author leaves or an office software upgrade stops it working.

This article explains how Access databases work, the typical risks of legacy applications, how to assess an Access database, how to stabilise one in the short term, and how to choose between upsizing its data to a server database, rebuilding it on another platform, replacing it with packaged software or retiring it. It is general information for owners, managers and IT providers.

## How Access databases work

Access combines several things in one product:

- **A database engine** that stores tables in a file, traditionally with an .mdb extension and, in newer versions, .accdb.
- **Forms** for entering and viewing data.
- **Reports** for printing and summarising.
- **Queries** for retrieving and changing data.
- **Macros and Visual Basic for Applications (VBA) code** for automation and custom behaviour.

Small Access databases often keep everything in one file. Better-designed multi-user applications are **split**: a **back-end** file holding the tables, stored on a shared server, and a **front-end** file holding forms, reports, queries and code, installed on each user's computer and linked to the back end.

Access is file-based. Each user's computer reads and writes the shared back-end file directly over the network, rather than sending requests to a database server. That design is simple and works well for small numbers of users on a reliable local network, but it is the root of many problems when applications grow.

## Typical risks of legacy Access applications

| Risk | Why it arises |
|---|---|
| Key-person dependence | One person built and understands the application, often without documentation |
| Corruption | Network interruptions, unstable connections or computers shutting down mid-write can damage the shared file |
| Size limits | An Access database file is limited to 2 GB, including space used by temporary objects |
| Performance | File-based access slows as data and users grow, especially over slower networks |
| Remote access | Working over the internet or a virtual private network is slow and increases corruption risk |
| File synchronisation | Cloud file-sync services are not designed for shared multi-user Access databases and can cause conflicts and corruption |
| Security | File-level permissions are coarse; anyone who can open the file can often copy all its data |
| Macros and code | Security settings for macros and VBA, and differences between 32-bit and 64-bit Office, can stop old code working |
| Backups | Copying a file while it is open can capture an inconsistent state; some Access files are missing from backup schedules entirely |
| Platform | Access runs on Windows desktop versions of Office, not on Mac or in web browsers |

Not every Access database has every risk, but most legacy applications have several.

## Assessing an Access database

Before deciding what to do, gather facts:

- **Purpose and importance**: which processes depend on it, and what happens if it is unavailable for a day or a week?
- **Users**: how many, where they work and whether they use it simultaneously.
- **Size and growth**: file size and how quickly it is growing.
- **Structure**: split or single file, number of tables, forms, reports and code modules.
- **Data quality**: duplicates, missing values and inconsistent entries.
- **Knowledge**: who understands it, and is there documentation?
- **Integrations**: does it import or export data with other systems or spreadsheets?
- **Problems**: frequency of corruption, slowness, errors and workarounds.
- **Personal or sensitive data**: what it holds and who can access it.
- **Backups**: whether it is backed up properly, and whether a restore has been tested.

The assessment often reveals that a business has several Access databases, some of which nobody remembered.

## Stabilise first

Whatever the long-term plan, a business-critical Access database should be made safer quickly:

- **Back it up properly**, using copies taken when no one is using it, or backup tools that handle open files safely, and keep copies off site. Test a restore.
- **Split the database** if it is a single file, so each user has their own front end and the shared back end holds only tables.
- **Keep the back end on a reliable local server share**, not on a desktop computer, a cloud-synchronised folder or a removable drive.
- **Compact and repair regularly**, during quiet periods, with a backup taken first.
- **Restrict access** to the folder and file to those who need it.
- **Document** the tables, key forms and reports, the purpose of code modules and any scheduled tasks.
- **Train a second person** to support it.
- **Record the Office versions** in use and test the application before Office updates are rolled out.

These steps reduce immediate risk and buy time to decide the future.

### Security for data that stays in Access

Access offers limited protection for sensitive data. Anyone with permission to open the back-end file can usually copy it entirely, and older protection features are easily bypassed. If an Access database holds personal, financial or commercially sensitive information, restrict folder permissions tightly, keep it on encrypted storage, avoid emailing copies and consider moving the data to a server database where access can be controlled per user and audited.

## The long-term options

| Option | What it involves | Suits | Trade-offs |
|---|---|---|---|
| Keep and maintain | Continue with improved support, backups and documentation | Small, stable, low-risk applications with few users | Underlying limits remain |
| Upsize the data | Move tables to a server database, such as Microsoft SQL Server, keeping Access as the front end | Applications limited mainly by size, users or corruption | Front-end code may need changes; still Windows desktop only |
| Rebuild | Recreate the application on a low-code platform or as a custom web application | Distinctive processes that need web or mobile access | Cost and time; requires careful requirements and migration |
| Replace | Adopt packaged software that covers the process | Common processes such as CRM, maintenance, quality or job management | Process changes; subscription costs; migration |
| Retire | Stop using it, archiving the data | Processes no longer needed or absorbed by other systems | Data must remain accessible for retention periods |

### Upsizing to a server database

Moving the tables to a server database while keeping the Access forms and reports is often a practical middle step. Microsoft provides a migration assistant tool for moving Access data to SQL Server. Benefits include removal of the file size limit, much lower corruption risk, better security, proper server backups and the ability for other systems and reporting tools to use the data. Some queries and code may need rewriting to perform well, because the way Access processes queries against linked server tables differs from local tables.

### Rebuilding

Rebuilding on a modern platform suits applications whose processes are worth keeping but whose users need web or mobile access, better security or integration. Treat it as a proper project: capture requirements from the existing application and its users, improve the data model rather than copying its limitations, migrate and reconcile data, and test with real scenarios.

### Replacing

Many Access databases were built because suitable packaged software was unavailable or unaffordable at the time. Today, subscription products exist for most common processes. Replacement brings vendor support and updates but may require changing how work is done.

## Choosing among the options

Useful questions include:

- **How critical is the process**, and how much risk is acceptable?
- **Is the process distinctive** to the business or common to many?
- **Do users need remote, web or mobile access?**
- **How much is the data growing?**
- **Who will support the solution** in five years?
- **What will each option cost** over five years, including migration, training and support?

The [managing legacy Visual Basic 6 applications](/insights/managing-legacy-visual-basic-6-applications/) article discusses a similar decision for another generation of in-house software, and many of the same considerations apply.

## Why Access databases became critical in the first place

It helps to understand why these applications exist. Most were built quickly to solve a real problem that packaged software did not address, or could not address affordably, at the time. They often capture years of refinement by the people who use them: special reports for particular customers, checks that prevent common mistakes and fields for information nobody else records. That embedded knowledge is valuable. Before replacing or rebuilding, interview users about what they rely on, including features they may not think to mention, and review every report and form for business rules hidden in queries and code. Replacements that ignore this knowledge are often rejected by users or quietly supplemented with new spreadsheets.

## Costs to compare

A fair comparison of options over five years includes:

- **Staff time** spent on workarounds, repairs and manual reporting with the current database.
- **Risk costs**, such as the effect of a week without the system or the loss of its author.
- **Upsizing costs**: server database licences or services, migration work and query changes.
- **Rebuild costs**: platform subscriptions, development, testing and ongoing support.
- **Replacement costs**: subscriptions, configuration, migration and training.
- **Archive costs**: keeping old data readable for required retention periods.

The cheapest option in licence terms is not always the cheapest overall, especially once support and risk are counted.

## Migrating the data

Whichever option is chosen, data must move safely:

- **Profile the data** for duplicates, gaps and inconsistent values.
- **Map fields** to the new structure, including lookup values stored as text or numbers.
- **Clean data** before or during migration.
- **Rehearse the migration** and reconcile counts and totals.
- **Freeze changes** in the Access database during the final migration.
- **Archive the final Access files** in a read-only location for reference and retention.

## Common mistakes

- **Leaving a single-file database** shared by many users.
- **Storing the back end in a cloud-synchronised folder** or on a desktop computer.
- **Copying open files** as the only backup.
- **No documentation** and no second person who understands it.
- **Rolling out Office updates** without testing the application.
- **Copying the old design** into a new platform, limitations included.
- **Ignoring small Access databases** that quietly became critical.

## A worked example

This is an illustrative example. A precision engineering business uses an Access database for calibration records, instrument recalls and inspection results. It was built 14 years ago by a quality engineer who has since moved to another role. Fifteen people use it, including from a second site over a virtual private network. The single file has grown to 1.4 GB, corruption requiring repair occurs about once a fortnight, and customer auditors rely on its records.

**Stabilisation.** The IT provider sets up proper backups, splits the database into front and back ends, moves the back end to the main server, schedules compacting and documents the tables and key reports with the original author's help. A second staff member is trained. Corruption incidents fall immediately.

**Decision.** The business considers upsizing the back end to SQL Server, rebuilding on a low-code platform, or replacing it with a calibration management package. Because calibration management is a common process and auditors expect features such as change history and electronic sign-off, it chooses a packaged product, with the upsizing option rejected as a costly interim step.

**Migration.** Instrument records, calibration history and certificates are migrated and reconciled. The Access files are archived read-only and retained for the period required by the business's quality system and customer contracts.

**Result.** Users at both sites access records reliably through a web browser, auditors receive complete histories, and the business no longer depends on one person's knowledge of an ageing file.

## Applying this in an Australian business

- **Find every Access database** the business relies on.
- **Assess importance, users, size, knowledge and risks.**
- **Stabilise critical ones** with backups, splitting, documentation and a second supporter.
- **Keep back ends off cloud-sync folders** and desktop computers.
- **Choose deliberately** between maintaining, upsizing, rebuilding, replacing and retiring.
- **Migrate and reconcile data carefully.**
- **Archive old files** for required retention periods.

## Questions worth considering

- Which of our processes depend on Access databases, and who understands them?
- How often do our Access databases need repairing?
- Are our Access files backed up properly, and has a restore been tested?
- Would an Office update stop any of them working?
- Which of them could be replaced by packaged software today?

## Bringing it together

Legacy Access databases often support important processes long after their authors have moved on. Their risks, including key-person dependence, corruption, size limits, security and backup gaps, are well understood and manageable. Stabilise critical databases first with proper backups, splitting, documentation and a second supporter, then decide deliberately whether to maintain, upsize, rebuild, replace or retire each one. Migrate data carefully and keep archived files for as long as records must be retained.

---

*Source: KEVOS® editorial notes, drawing on general database administration and business systems practice. Product details are summarised for orientation; check current Microsoft documentation for your versions. The worked example is illustrative. This article is general information.*
