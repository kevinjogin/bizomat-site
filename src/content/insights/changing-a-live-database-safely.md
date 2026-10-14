---
title: "Changing a live business database safely: structure changes, migration scripts, testing and rollback"
description: "Custom systems change as businesses change. How to alter a live database's structure without losing data or stopping work: environments, versioned scripts, staged changes and rollback."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - projects
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Business systems are never finished. A custom job management system that recorded one address per customer must now handle customers with many sites. A quoting tool needs a new pricing method. A production database needs fields for a new compliance requirement. Each change alters the structure of a database that people are using every day, filled with years of records the business cannot afford to lose or corrupt.

Database changes are riskier than many other software changes. Application code can usually be replaced with the previous version if something goes wrong; data that has been transformed, merged or deleted cannot always be put back. A change that works perfectly with a developer's small test database may fail, run for hours or produce wrong results against millions of real records. And because reports, integrations and spreadsheets often read the database directly, a change can break things far from where it was made.

This article explains how businesses with custom or in-house databases can change them safely: separate environments, version-controlled change scripts, testing with realistic data, staged changes that avoid downtime, backups and rollback plans, coordinating with reports and integrations, and the special case of packaged software. It is general information for managers and system owners who commission or oversee changes, and for developers working in small teams.

## Why database changes are different

- **Data persists.** Code is replaced; data is transformed. Mistakes in transformations can be permanent.
- **Scale matters.** Operations that are instant on a small table can lock a large table for minutes or hours.
- **Many consumers.** Applications, reports, integrations and analysts may all depend on the current structure.
- **Order matters.** Changes must be applied in sequence, and every environment must end up with the same structure.
- **Timing matters.** Changes may need to happen while people are working, or within short maintenance windows.
- **Security and permissions change too.** New tables and columns need the right access permissions, and sensitive new fields may need encryption, masking in test copies and inclusion in retention rules from the day they are created.

## Types of change and their risks

Not every change deserves the same caution. A rough guide:

| Change | Typical risk | Why |
|---|---|---|
| Add a new table | Low | Nothing existing depends on it |
| Add an optional column | Low | Existing code ignores it |
| Add an index | Low to medium | Building it on a large table can slow or lock the system |
| Add a required column or new rule | Medium | Existing data and code may not satisfy it |
| Backfill or recalculate data | Medium | Errors affect many records at once |
| Change a data type or length | High | Values may not convert; dependent code may fail |
| Rename a table or column | High | Everything that refers to it breaks |
| Split or merge tables | High | Requires data transformation and code changes together |
| Delete a column or table | High | Irreversible without a backup |

Low-risk changes can follow a light process. High-risk changes deserve staged approaches, rehearsals and explicit approval.

## Separate environments

Changes should flow through separate environments before reaching the live system:

| Environment | Purpose | Data |
|---|---|---|
| Development | Developers build and try changes | Small, synthetic or masked data |
| Test | Testers and business users check changes | Realistic volumes, masked where personal information is involved |
| Staging or pre-production | Final rehearsal, configured like production | Recent production-like copy, protected appropriately |
| Production | The live system | Real data |

Small businesses may combine development and test, but making changes directly in production should be the rare exception, with explicit approval and a backup taken first.

## Keep every change in version-controlled scripts

The most important practice is to make every structural change through a **change script**, often called a migration, stored in version control alongside the application code:

- **Each script has a unique sequence or version number.**
- **Scripts are applied in order** in every environment, by a tool or a documented process, so environments match.
- **The database records which scripts have been applied**, so nobody needs to guess its current state.
- **Scripts are reviewed** by a second person before being applied to production.
- **Manual changes made directly in a database tool are avoided**, because they are not repeatable and leave environments out of step.

Many development frameworks and specialised tools support this approach. The specific tool matters less than the discipline that every change is scripted, versioned and applied consistently.

## Changing structure without stopping work

Some changes, such as adding a new optional column, are quick and safe. Others, such as renaming a column, splitting a table or changing a data type, can break the application or lock tables during busy periods. A widely used approach, sometimes called **expand and contract**, breaks risky changes into safe steps:

1. **Expand**: add the new structure alongside the old, such as a new table or column, without removing anything.
2. **Migrate data**: copy or transform existing data into the new structure, in batches if volumes are large.
3. **Write to both**: update the application to write to both old and new structures, keeping them consistent.
4. **Switch reads**: update the application, reports and integrations to read from the new structure.
5. **Contract**: once everything uses the new structure and it has proved reliable, remove the old structure.

Each step can be deployed and verified separately, and the old structure remains available as a fallback until the final step. This approach takes longer than a single change, but it avoids long outages and makes problems recoverable.

### Large data changes

Updates affecting millions of rows should usually run in batches, with progress checks, rather than as one enormous operation that locks tables and fills transaction logs. Schedule them for quiet periods and monitor their effect on users.

### Keep changes small and frequent

Teams that change their databases in small, frequent steps generally have fewer problems than those that bundle months of changes into one large release. Each small change is easier to understand, test, review and reverse, and when something goes wrong the cause is obvious. Large releases combine many risks at once and make diagnosis harder. Where business processes allow, prefer a steady flow of modest, well-tested changes.

## Data fixes need the same care

Not all changes alter structure. **Data fixes**, such as correcting a batch of wrong prices, merging duplicate customers or recalculating a field, change records directly. They should also be scripted, reviewed, tested on a copy, run with a backup taken immediately beforehand, and verified afterwards with agreed checks. A data fix applied without a precise condition can change far more records than intended.

## Testing with realistic data

Changes that work on small test data can fail on real data because of volume, unexpected values or old records created under earlier rules. Before production:

- **Test on a recent, realistic copy** of production data, masked where it contains personal information.
- **Time the change**, so the production window is planned realistically.
- **Check results** with record counts, totals and samples.
- **Test the application, reports and integrations** against the changed structure.
- **Test the rollback** as well as the change.

## Backups and rollback plans

Every significant change needs a way back:

- **Take a verified backup** immediately before applying the change.
- **Prepare a rollback script** that reverses the change, where reversal is possible.
- **Know when rollback is no longer possible**, such as after data has been transformed and new transactions entered, and plan a **roll-forward** fix instead.
- **Decide in advance** who can call a rollback and on what criteria.

Restoring a backup reverses the change but also loses work entered since it was taken, so it is a last resort once users have resumed.

## Coordinate with everything that reads the database

Before changing a structure, identify everything that depends on it:

- **The main application**, including scheduled jobs.
- **Reports and dashboards**, including those built by analysts in reporting tools.
- **Integrations** with other systems.
- **Spreadsheets** that connect directly to the database.
- **Data warehouses** and reporting copies.

Keep an inventory of database consumers, notify owners of planned changes, and test affected reports and integrations. Providing **views**, stable query interfaces that hide the underlying tables, for reporting and integrations can reduce how often structural changes break them.

## Approvals and documentation

For each significant change, record:

- **What is changing and why**, linked to the business requirement.
- **Risk and impact**, including affected users, reports and integrations.
- **Test evidence.**
- **Planned timing and duration.**
- **Backup and rollback arrangements.**
- **Approval** by the system's business owner.
- **Verification** after the change.

The [issue, change and configuration control](/insights/issue-change-and-configuration-control/) article describes change control principles that apply equally to databases.

## Telling users and checking afterwards

Users should know when a change will happen, whether the system will be unavailable or slow, what will look different and whom to contact if something seems wrong. After the change, monitor error logs, performance and support requests closely for the first days, keep the pre-change backup until the change is clearly stable, and hold a short review of what went well and what to improve next time. Problems reported early are much easier to fix than problems discovered at month-end.

## A proportionate process for small teams

Many custom business systems are maintained by one developer or a small external firm. The practices in this article still apply, scaled to fit:

- **Scripts and version control** cost little and prevent the most serious problems.
- **A second reviewer** can be another developer, the vendor or a contractor engaged occasionally for important changes.
- **A simple checklist** covering backup, testing, timing, rollback, communication and verification replaces a formal change board.
- **A test copy of the database**, refreshed periodically and masked, is worth maintaining even for small systems.
- **Documentation of each change** protects the business if the developer moves on.

## Packaged software is different

For packaged business software, the vendor controls the database structure. Changing it directly, such as adding columns, triggers or indexes, can break upgrades, cause support to be refused and void warranties. Use the vendor's supported options instead:

- **Configuration settings** and custom fields provided by the product.
- **Extension mechanisms** and published interfaces.
- **Separate databases** for custom data, linked through supported integration methods.

Ask the vendor before making any change that touches the database.

## Common mistakes

- **Changing production directly** without scripts or testing.
- **Testing only with small data.**
- **Renaming or removing columns in one step** while applications and reports still use them.
- **No backup immediately before a change.**
- **Forgetting reports, integrations and spreadsheets** that read the database.
- **Running huge updates** during business hours.
- **Environments drifting apart** because some changes were made manually.
- **Modifying a packaged product's database** outside supported methods.

## A worked example

This is an illustrative example. A building maintenance contractor uses a custom job management system built six years ago. Each customer record holds one address, and jobs inherit it. The business now serves strata managers and retailers with dozens of sites each, and staff have been creating duplicate customers for each site, which breaks invoicing and reporting.

**Design.** The developer and operations manager agree a new structure: customers can have many sites, and each job belongs to a site. Existing customer addresses become each customer's first site.

**Expand and migrate.** The first change adds a sites table and a site reference on jobs, without removing anything. A script creates a site for every existing customer address and links existing jobs to it. Tested on a masked copy of production with about 180,000 jobs, it runs in eight minutes and reconciles exactly: every job has a site, and job counts by customer are unchanged.

**Transition.** The application is updated to create and select sites, while still filling the old address fields for reports that have not been updated. Duplicate customers created for individual sites are merged, with their records becoming sites of the main customer, after review by the accounts team.

**Switch and contract.** Reports and the accounting integration are updated to use sites. Two months later, after confirming nothing still reads the old fields, they are removed in a final change.

**Result.** Each step is deployed with a backup, a rollback plan and verification. Staff experience no outage longer than a few minutes, invoicing by site becomes possible, and duplicate customers disappear.

## Applying this in an Australian business

- **Use separate environments** for development, testing and production.
- **Script and version every database change.**
- **Break risky changes into stages** that keep the old structure until the new one is proven.
- **Test with realistic, masked data** and time the change.
- **Take a backup immediately before** and plan rollback or roll-forward.
- **Inventory everything that reads the database** and test it.
- **Approve and record** significant changes.
- **Use supported methods** for packaged software.

## Questions worth considering

- Are changes to our custom databases scripted and version-controlled?
- Do our test environments match production?
- What reads our databases directly, and who would know if a change broke it?
- When did a database change last cause a problem, and what did we learn?
- Who approves changes to our business systems' data structures?

## Bringing it together

Databases must change as businesses change, but data is harder to put back than code. Use separate environments, script and version every change, stage risky changes so the old structure remains until the new one is proven, test with realistic data, take backups and plan rollback, coordinate with every report and integration that depends on the database, and record approvals. For packaged software, change through supported methods only. These habits let a system evolve for years without losing data or stopping work.

---

*Source: KEVOS® editorial notes, drawing on general software engineering, database administration and change management practice. The worked example is illustrative. This article is general information.*
