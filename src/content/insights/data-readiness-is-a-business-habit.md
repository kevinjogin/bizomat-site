---
title: "Data readiness is a business habit, not an IT project"
description: "Messy data is usually a symptom of how work is done. How to define good-enough data for each use, give information an owner, control access and fix errors where they start."
publishDate: 2026-10-04
category: "Technology"
tags:
  - ai
  - systems
  - operations
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Many businesses discover their data problems at the moment they try to use a new system or AI tool. Customer names appear three different ways. Job codes mean different things to different people. Drawings exist in several versions with no clear indication of which is current. Supplier records are incomplete. Important context lives only in experienced people's heads. And the shared drive turns out to give everyone access to files that only a few should see.

The instinct is to treat this as an IT problem: clean the data, build a connection, move on. But many data problems are symptoms of how work is actually done. They return after every clean-up because the process that creates them has not changed. **Data readiness** is better understood as a business habit: the ability to produce trusted, usable and properly controlled information as part of normal work, not a one-off clean-up before each new technology.

This article explains why data quality depends on the business process, how to define good-enough data for each use, why information needs a business owner, how new tools can expose access weaknesses, and how to fix errors at their source so quality improves over time.

## Common misreadings

- **Data must be perfect before we start.** Perfection is unrealistic and can delay useful learning. Readiness should match the use: a tool that helps search past quotes can tolerate more imperfection than one that influences payments, safety or employment decisions.
- **A better connection solves data quality.** Moving data between systems can spread bad, ambiguous or unauthorised data more efficiently. Ownership and process controls remain essential.
- **More data is always better.** Extra volume can add noise, outdated information, privacy exposure and maintenance cost. Relevance and quality matter more than quantity.

## Common data problems in small businesses

Most small businesses face some combination of the same problems:

- **Duplicates**: the same customer, supplier or product recorded several times with slightly different names.
- **Inconsistent codes and units**: job codes, product codes or measurements recorded differently by different people.
- **Free text where categories are needed**: notes typed freely where a standard choice would allow analysis.
- **Unclear versions**: several copies of a document with no indication of which is current.
- **Missing dates and owners**: records that do not show when they were last checked or who is responsible.
- **Spreadsheets as systems of record**: important information kept in personal spreadsheets that others cannot see or trust.

None of these needs sophisticated technology to fix. They need agreed standards and someone responsible.

## Start from the decision

Define data readiness around the decision or task the data supports:

- **What information is needed?**
- **Who owns its meaning**, such as what a job status, customer category or product code actually means?
- **How is it created**, and by whom?
- **Who may use it**, and for what?
- **How is quality checked?**
- **How are errors corrected at the source?**

Answering these for one important use case is far more useful than a general data clean-up.

## Meaning needs a business owner

Field definitions, document status, customer categories and job codes carry context that technical people cannot safely guess. Someone who understands the business process and the consequences of misuse should own the meaning of each important type of information: the estimator for quotes, the engineer for drawings, the accounts person for customer and supplier records. Ownership does not mean doing all the data entry. It means deciding what the information means, setting simple standards and being the person others go to when something is unclear.

## Good enough depends on the use

Data quality has several dimensions: accuracy, completeness, timeliness and consistency. How much each matters depends on the use. A tool that suggests similar past jobs can tolerate some missing fields. A system that calculates invoices cannot tolerate wrong prices. A safety system needs current information, not last month's. Define "good enough" for each use, based on what happens if the data is wrong, and focus effort accordingly.

## Access and origin are part of readiness

New tools, especially AI tools that search and combine information, can expose weaknesses in access that were previously hidden by the effort needed to find things manually. A staff member who would never have browsed the payroll folder might find payroll details in an AI search result if the folder was never properly restricted. Before connecting tools to business information, check who can access what, whether sensitive information is properly restricted and where important information came from. Over-restricting access, on the other hand, can strip away useful context and push staff towards uncontrolled workarounds, such as keeping private copies.

## Fix errors where they start

When someone finds a wrong classification, an outdated document or missing context, the correction should improve the original source, not just a local spreadsheet or the user's own copy. Otherwise the same errors are fixed again and again, and different people end up with different versions of the truth. A simple route helps: when someone spots an error, they flag it to the owner, the owner fixes it at the source and, if the same error keeps recurring, the process that creates it is changed.

## Agree conventions before you need the data

The most expensive data decisions are often made years before anyone wants to analyse the data, by people who did not know they were making them. One branch records jobs by customer name and another by site address. One team codes defects by cause and another by location. Each choice is sensible locally, but when the business later wants to compare branches or train a tool on its history, the records cannot be joined. Agree a few shared conventions early, such as customer identifiers, job and product codes, units and date formats, and make someone responsible for keeping them consistent as the business grows or adds new systems.

## Data from outside the business

Some important information comes from customers, suppliers and other systems: orders, specifications, delivery notes, certificates and price lists. Its quality depends partly on others. Agree formats and required details with regular partners where you can, check incoming information at the point it arrives and record where it came from. Problems caught at the door are far cheaper to fix than problems discovered after the information has spread through quotes, orders and invoices.

## Context in people's heads

Some of the most important information in a small business is undocumented: why a particular customer gets special terms, which supplier to avoid for certain jobs, how a machine needs to be set for a difficult material. When experienced people are away or leave, that context disappears. Capturing it does not require a large documentation exercise. Short notes attached to customer records, job files or equipment logs, written when the knowledge is used, gradually build a record others can rely on. The article on [key-person dependence](/insights/key-person-dependence-in-a-small-business/) covers this in more detail.

## A simple data map

For the most important use you are planning, list each critical source of information and record five things:

| Information | Owner | Who may access it | Known quality issues | How errors are corrected |
|---|---|---|---|---|
| Customer records | Accounts | All staff read, accounts edit | Duplicates, old contacts | Flag to accounts; merge monthly |
| Job files and quotes | Estimator | Sales and production | Inconsistent naming | Naming standard; estimator renames |
| Drawings | Engineer | Production read, engineering edit | Superseded versions in use | Revision control; archive old versions |
| Staff and payroll files | Owner | Owner and payroll only | Stored in shared folder | Move to restricted location |

Even this small table often reveals the most important fixes.

## Simple standards that help

A few simple standards prevent many problems:

- **File naming**: a consistent pattern, such as job number, client and document type, so files can be found and sorted.
- **Required fields**: a short list of fields that must be completed when a record is created, such as customer contact, job type and due date.
- **Pick lists**: standard choices for categories instead of free text where the information will be analysed.
- **Date and unit formats**: one agreed format for dates and one set of units for measurements.
- **Version marking**: clear marking of current and superseded documents, with old versions archived.

Write the standards on one page, keep them short and apply them to new records first. Older records can be fixed gradually, starting with the ones used most.

## Measure data quality simply

A few simple measures show whether data is improving: the number of duplicate records found, the share of records with required fields missing, the share of key records checked or updated in the last year and the number of flagged errors fixed. Review them every month or quarter alongside other operational measures. What gets measured tends to improve, and these measures make data quality visible rather than a vague complaint.

## Make data part of everyday roles

Data quality improves when it becomes part of normal work rather than a periodic project. Practical habits include agreed naming conventions for files, standard fields completed at specific points in a process, a short review of key records each month, clear archiving of superseded documents and an expectation that owners fix flagged errors promptly. Build these into procedures and checklists so they do not depend on one careful person.

## A worked example

This is an illustration. A fabrication business wants to use an AI tool to search its past jobs, so estimators can find similar projects, drawings and prices quickly. The first trial produces poor results.

The owner builds a simple data map and finds:

- **Three different naming conventions** for job folders, depending on who created them.
- **Drawings in several revisions** in the same folder, with no clear marking of which was built.
- **Quotes stored separately from the job files** they relate to.
- **Staff and payroll files** in a shared folder accessible to everyone, which the AI search could surface.

The fixes are modest. A single naming convention is agreed and applied to new jobs, with the past two years' jobs renamed by a junior staff member over two weeks. The engineer becomes owner of drawings and introduces a simple rule: superseded drawings move to an archive subfolder. The estimator owns quote and job files and links them. The owner moves staff and payroll files to a restricted location and checks access permissions across the shared drive. A simple process lets users flag wrong search results to the relevant owner, who fixes the source.

The second trial works well. Estimators find relevant past jobs in minutes rather than hours. Just as importantly, the business now has a habit that will support future tools.

## How this applies to a small Australian business

Small businesses often have data spread across email, shared drives, accounting software and individual computers. Practical steps:

- **Pick one important use** and map the information it needs.
- **Give each type of important information an owner.**
- **Define good enough** for that use.
- **Check access permissions** before connecting new tools, especially AI search.
- **Fix errors at the source** and change processes that keep creating them.
- **Capture key context** in short notes as it is used.
- **Know your privacy obligations**: the Privacy Act applies to many businesses, and those covered must protect personal information and may need to report eligible data breaches. The Office of the Australian Information Commissioner publishes guidance, including on AI products.

The articles on [adopting AI by starting with the work](/insights/adopting-ai-start-with-the-work/) and [standardising the routine](/insights/standardise-the-routine-not-the-thinking/) cover related practices.

## Signals worth watching

- The same data problems cleaned up separately for each new project.
- Nobody able to say who decides what an important piece of information means.
- New tools revealing access nobody expected.
- Important interpretation living only in experienced people's heads.
- Technical connections progressing while quality criteria remain undefined.
- Staff keeping private spreadsheets because shared records are unreliable.

## Common mistakes

- **Waiting for perfect data.**
- **Treating data quality as an IT task only.**
- **Collecting more data** instead of better data.
- **Connecting tools** before checking access permissions.
- **Fixing errors locally** rather than at the source.
- **Running one-off clean-ups** without changing the process.

## Frequently asked questions

**Where should a small business start?** With the information behind one important decision or task, such as quoting, scheduling or invoicing. Map it, assign owners and fix the biggest problems.

**How much time does this take?** Often a few hours to map, and a few days or weeks of part-time effort to fix the main issues. The habit then takes a little time each week.

**Do we need new software?** Usually not to start. Clear ownership, naming conventions, access controls and correction routes can be applied in the tools you already use.

**Who should own data in a very small business?** Often the owner and one or two key staff. Divide ownership by type of information, such as customers, jobs and suppliers, so each person knows what they are responsible for keeping accurate.

**What about old records we rarely use?** Archive them in a clearly marked location rather than deleting them, keeping anything you are legally required to retain. Focus improvement effort on the records the business uses most.

**What about information held in email?** Important decisions, approvals and customer agreements buried in email are hard to find later. Agree which information should be saved to shared records, such as job files or the customer record.

## Questions to ask

- What process creates the data problems we keep cleaning up?
- Who owns the meaning of our most important information?
- What quality is genuinely needed for the use we have in mind?
- Could a new tool show someone information they should not see?
- When someone finds an error, how is it fixed at the source?
- What important knowledge exists only in people's heads?

## Bringing it together

Data readiness is not a gate that IT opens once. It is a business habit of producing information that is meaningful, controlled and correctable. Define readiness around specific decisions, give information owners, set quality in proportion to consequences, check access before connecting new tools, fix errors where they start and capture context as it is used. That habit will outlast any particular system or AI tool, and make every future one more useful.

---

*Source: KEVOS notes. Examples and figures in this article are illustrations. This article is general information, not legal or privacy advice.*
