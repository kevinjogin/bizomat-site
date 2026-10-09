---
title: "Writing a data dictionary: defining the data a business relies on so everyone means the same thing"
description: "Disputed reports often come from undefined terms. How to build a practical data dictionary of fields, codes and measures, write clear definitions, assign owners and keep it current."
publishDate: 2026-10-09
category: "Operations"
tags:
  - systems
  - communication
  - quality
author: "KEVOS"
featured: false
draft: false
---

Three managers bring three different on-time delivery figures to the same meeting: 94%, 88% and 81%. None of them is wrong. Sales measured deliveries against the date promised when the order was confirmed, operations measured against the date the goods left the warehouse, and the customer's scorecard measured arrival against the date the customer originally requested. The meeting spends half an hour arguing about numbers instead of improving delivery.

Problems like this are common because business data is full of terms that seem obvious but are not defined: customer, active customer, order date, revenue, margin, lead time, defect, job completion, utilisation. Each department, report and system quietly applies its own meaning. A **data dictionary** fixes this by recording what each important piece of data means, where it comes from, what values it can take, who owns it and how key measures are calculated.

This article explains what a data dictionary is, why it matters, what to record for fields and measures, how to write clear definitions, where to start, how to resolve conflicting definitions, how to keep the dictionary current and how to put it to use. It is general information for managers, analysts, system owners and anyone responsible for reports or business systems.

## What a data dictionary is

A data dictionary is a managed reference that describes the data a business uses. Related terms are sometimes used interchangeably, but they have different emphases:

| Term | Emphasis |
|---|---|
| Business glossary | Definitions of business terms and concepts, such as "active customer" |
| Data dictionary | Descriptions of data items: fields, codes, formats, sources and owners |
| Metrics or measures catalogue | Definitions and formulas for key measures, such as on-time delivery |
| Data catalogue | An inventory of data sets and where they are held, often supported by software |
| Database documentation | Technical descriptions of tables and columns for developers |

For most small and medium businesses, one practical document combining business terms, important fields and code lists, and key measures is enough. The name matters less than the habit of defining things once and using the definitions consistently.

## Why it matters

- **Consistent reports.** Agreed definitions end disputes about whose figures are right.
- **Faster onboarding.** New staff learn what fields and codes mean without guessing.
- **Better system projects.** Requirements, data migrations and integrations depend on knowing what data means.
- **Reliable integration.** Systems exchanging data must agree on codes and meanings.
- **Privacy and security.** Recording which fields hold personal or confidential information supports access control.
- **Audits and disputes.** The business can show how figures were calculated.
- **Artificial intelligence tools.** Assistants that answer questions from business data give better answers when definitions are documented.

## What to record for each data item

| Element | Example |
|---|---|
| Name | Promised delivery date |
| Definition | The date the business committed to deliver the order to the customer, as confirmed in the order acknowledgement |
| System and field | ERP sales order header, field PROMISE_DT |
| Format | Date |
| Allowed values or range | Not earlier than the order date |
| Source | Entered by customer service when acknowledging the order; may be revised only with the customer's agreement |
| Owner | Customer service manager |
| Sensitivity | Internal |
| Related terms | Requested delivery date, dispatch date, delivered date |
| Notes | Revisions are logged; reports use the original promised date unless stated otherwise |

For **code lists**, such as order statuses, defect categories or customer types, record each code, its meaning, when it should be used and who may add new codes.

## What to record for each measure

Measures need more detail, because small differences in calculation produce large differences in results:

- **Name and purpose**: what the measure is for and which decisions it supports.
- **Formula**: exactly how it is calculated.
- **Inclusions and exclusions**: which records count, such as excluding cancelled orders, internal transfers or samples.
- **Time basis**: which date determines the period, such as invoice date or delivery date.
- **Level of detail**: whether it is calculated per order, per line or per delivery.
- **Source data**: the fields and systems used.
- **Owner**: who approves changes to the definition.
- **Target and reporting frequency**, if relevant.

For example, "on-time in full to promise" might be defined as the percentage of order lines delivered complete on or before the promised delivery date, counting by order line, excluding cancelled lines and customer-requested delays, with the period determined by the promised date.

## Writing clear definitions

Good definitions share a few qualities:

- **They state what something is**, not how it is used.
- **They set boundaries**: what is included and excluded.
- **They avoid circularity**, such as defining a customer as "a customer of the business".
- **They are precise about numbers and time**, such as "in the previous 12 complete calendar months".
- **They use plain language** and define any technical term.
- **They include examples** where boundaries are tricky.

| Weak definition | Clearer definition |
|---|---|
| Active customer: a customer who buys from us | Active customer: an account with at least one invoice, excluding credit notes, in the previous 12 complete calendar months |
| Lead time: how long it takes | Supplier lead time: the number of calendar days from purchase order issue to goods receipt, measured per purchase order line |
| Defect: a bad part | Defect: a unit that fails one or more inspection criteria on its current drawing or specification, recorded at the inspection point where it is found |
| Job complete: when the job is done | Job complete: all work orders on the job are closed, final inspection is recorded and the completion notice has been sent to the customer |

## Naming things consistently

Consistent names make definitions easier to find and harder to confuse. Useful conventions include:

- **Name measures by what they measure and against what**, such as "on-time in full to original promise", rather than a bare "OTIF".
- **Qualify dates explicitly**: order entry date, requested date, promised date, dispatch date and delivered date, never just "date".
- **Distinguish quantities by unit and basis**, such as ordered quantity, shipped quantity and invoiced quantity.
- **Use the same term in every system and report** once it is agreed, and record synonyms so people searching under an old name still find the definition.
- **Avoid abbreviations** that are not universally understood in the business.

## How much detail is enough

A definition is detailed enough when two people working independently from it would produce the same figure from the same data. If they would have to make assumptions about which records to include, which date to use or how to treat exceptions, the definition needs more detail. Test important measures by asking two analysts to calculate them separately and comparing results.

## Where to start

A complete dictionary of every field in every system is neither achievable nor useful for most businesses. Start where disagreement and risk are greatest:

1. **Key measures** reported to management and customers.
2. **Master data** fields for customers, suppliers and items.
3. **Status and category codes** used in reports.
4. **Fields that hold personal or confidential information.**
5. **Fields involved in integrations** between systems.

Fifty well-defined terms that people use are worth far more than thousands of technical descriptions nobody reads. The [data readiness is a business habit](/insights/data-readiness-is-a-business-habit/) article explains why giving data business owners and agreeing conventions early matters.

## Gathering the information

- **Collect existing reports** and note the terms and measures they use.
- **Interview the people** who enter and use the data, especially about exceptions.
- **Read system documentation** and configuration screens for code lists and field meanings.
- **Examine actual data** to see how fields are really used, which often differs from intention.
- **Extract technical details** from database catalogues, such as field names and types, where available.

## Resolving conflicting definitions

When departments define a term differently, there are usually two good resolutions:

- **Choose one definition** for the business, decided by the owner, and change reports to use it.
- **Name the variants separately**, when each serves a legitimate purpose. "On-time to promise", "on-time to request" and "dispatched on time" can all be valid measures if they are named distinctly and used deliberately.

What must not continue is several measures sharing one name.

## Classifying sensitivity

Recording a sensitivity level for each data item, such as public, internal, confidential or personal, helps the business:

- **Set access controls** in systems and reports.
- **Meet privacy obligations**, where the Privacy Act applies, for personal information.
- **Decide what can be shared** with customers, suppliers, consultants and AI tools.
- **Plan retention and destruction** of personal information.

## Tools

The dictionary can live in:

- **A shared spreadsheet**, simple to start with and adequate for many small businesses.
- **A wiki or intranet page**, easier to link from other documents and reports.
- **Features in reporting and data platforms**, which can show definitions alongside reports.
- **Dedicated data catalogue software**, useful for larger organisations with many systems.

The best tool is the one people will consult and maintain. Link to definitions from reports and dashboards so readers can check them in one click.

## Keeping it current

A dictionary decays unless maintenance is part of normal work:

- **Assign an owner** for each term or measure.
- **Require dictionary updates** as part of system changes, new reports and new codes.
- **Record changes** with dates and reasons, so historical reports can be interpreted.
- **Review key entries** at least annually.
- **Make one person responsible** for the dictionary as a whole.

### When a definition changes

Definitions sometimes need to change, for example when a measure is aligned with a major customer's scorecard. Record the old and new definitions, the date of change and the reason. Where possible, recalculate recent history under the new definition, or mark the break clearly on trend charts, so a sudden improvement or decline is not mistaken for a change in performance.

## A dictionary makes system projects easier

System changes are where a data dictionary pays for itself most visibly. When a business replaces an ERP system, connects an online shop to its stock system or migrates customer records into a new CRM, every field and code in the old system must be mapped to the new one. Without definitions, project teams guess, and errors appear after go-live as wrong prices, misclassified customers or reports that no longer match history.

With a dictionary, the mapping starts from known meanings. Differences between systems become visible early, such as an old status code that combined two meanings which the new system separates, and decisions can be made deliberately by the data owners. The dictionary then becomes part of the new system's documentation.

## Putting it to use

- **Footnote reports** with the definitions they use.
- **Include it in onboarding** for new staff.
- **Use it in system projects** for requirements, data mapping and testing.
- **Share relevant parts with customers and suppliers** when agreeing performance measures.
- **Provide it to analysts and AI tools** so questions are answered using the agreed meanings.

The [reports that change decisions](/insights/reports-that-change-decisions/) article explains how clearly defined measures make reports more useful.

## Common mistakes

- **Trying to document everything** before anything is useful.
- **Writing technical descriptions only**, without business meaning.
- **No owners**, so conflicting definitions are never resolved.
- **Hiding the dictionary** where report readers cannot find it.
- **Letting it drift** from how systems and reports actually work.
- **Changing definitions silently**, so trends break without explanation.

## A worked example

This is an illustrative example. A manufacturer of commercial kitchen equipment regularly argues about on-time delivery. Sales reports 94%, operations 88% and the largest customer's scorecard 81%.

**Investigation.** An analyst finds three definitions: sales measures orders against the latest promised date, including revisions; operations measures dispatch against the planned dispatch date; and the customer measures arrival against its originally requested date.

**Definitions.** The general manager, as owner, approves three distinctly named measures: on-time in full to request, on-time in full to original promise and dispatched on schedule. Each has a written formula, inclusions, exclusions and time basis. The main management measure becomes on-time in full to original promise, because it reflects the commitment the business made.

**Wider dictionary.** Over two months, the analyst documents about 60 terms, including active customer, gross margin, lead time, defect categories and order statuses, with owners for each. Reports are footnoted with links to definitions.

**Result.** Delivery meetings now discuss causes rather than numbers. The gap between promise and request becomes visible, leading to better quoting of lead times, and the customer's scorecard improves over the following two quarters.

## Applying this in an Australian business

- **Start with disputed measures** and key master data.
- **Write precise definitions** with boundaries and examples.
- **Name variants distinctly** rather than sharing one name.
- **Assign owners** and record changes.
- **Classify sensitivity**, including personal information.
- **Link definitions to reports** and use them in system projects.
- **Keep it simple** enough that people maintain it.

## Questions worth considering

- Which of our measures produce arguments about whose figures are right?
- Could a new employee find out what our order status codes mean?
- Who decides how our key measures are calculated?
- Which fields in our systems hold personal information?
- When did we last change a definition, and did anyone record why?

## Bringing it together

A data dictionary records what a business's data means: its key terms, fields, codes and measures, with sources, owners and sensitivity. It ends disputes about figures, speeds onboarding, supports system projects and integrations and helps protect personal information. Start with the measures and data that cause the most disagreement, write precise definitions, give each an owner, link them to reports and keep the dictionary current as part of normal work.

---

*Source: KEVOS editorial notes, drawing on general data management and business analysis practice. The worked example is illustrative. This article is general information.*
