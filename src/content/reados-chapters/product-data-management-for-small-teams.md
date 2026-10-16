---
title: "Product data management for small engineering teams: vaults, revisions, workflows and release"
description: "Why shared folders fail for CAD data, what a PDM system does, how to set up lifecycle states, revisions, workflows and permissions, and how to migrate legacy files safely."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - systems
  - design
  - product-development
author: "KEVOS"
featured: false
draft: false
---

Most small engineering teams start by storing CAD files in shared folders. For a while it works. Then the team grows, products multiply and the problems begin. Two designers edit the same assembly and one overwrites the other's work. A supplier receives a drawing that was superseded last month. A part file is renamed and fifty assemblies lose their references. Nobody can say which products use a particular bracket before changing it. The "final" folder contains files named final, final2 and final-REALLY. Production builds from a PDF that does not match the model.

These are not signs of careless people. They are signs that the way engineering data is stored has not kept up with the business. CAD files are not ordinary documents: they reference one another, they change through many versions, they carry part numbers and properties that other systems depend on and they need controlled release before anyone outside engineering uses them.

**Product data management** (PDM) systems are designed for this. This article explains, in general terms, why shared folders break down, what a PDM system does, how to design lifecycle states, revision schemes, workflows and permissions, how to migrate legacy data, how PDM connects with ERP and production and how a small team can implement it without losing momentum. It is general information and vendor-neutral; capabilities differ between products.

## Why shared folders stop working

Shared folders fail in predictable ways:

- **No check-out control.** Several people can open and save the same file, and the last save wins.
- **Broken references.** Assemblies and drawings refer to part files by location and name; moving or renaming files breaks them.
- **No reliable revision history.** Previous versions are lost, or kept as loosely named copies.
- **No release state.** It is unclear which files are work in progress and which are approved for manufacture.
- **No where-used information.** It is hard to know which assemblies or products will be affected by a change.
- **Weak security.** Anyone with folder access can change or delete released data.

The [governing a CAD environment](/reados/collections/engineering-design-practice/governing-a-cad-environment/) article explains the broader governance of CAD standards, libraries and templates. PDM is the system that makes much of that governance enforceable.

## What a PDM system does

Most PDM systems provide a common set of capabilities:

- **A secure vault** where files are stored, with users working on local copies through the PDM client.
- **Check-out and check-in**, so only one person edits a file at a time and changes are recorded.
- **Version and revision history**, keeping every saved version and distinguishing working versions from formal revisions.
- **Reference management**, tracking relationships between parts, assemblies and drawings so files can be renamed, moved or copied without breaking links.
- **Metadata and search**, storing part numbers, descriptions, materials, project codes and other properties that can be searched and reported.
- **Lifecycle states and workflows**, moving files through states such as work in progress, in review, released and obsolete, with approvals at each transition.
- **Permissions** controlling who can view, edit, approve or release files in each state.
- **Where-used and contains reports**, showing relationships across products.
- **Bills of materials** generated from assemblies and properties.
- **Integration** with ERP or MRP systems, viewers and document distribution.

Some businesses also adopt **product lifecycle management** (PLM) systems, which extend beyond CAD files to manage requirements, changes, suppliers, quality and product information across the business. For many small teams, PDM is the right first step.

## Designing the data model

Before configuring a system, decide how product data should be organised. Key decisions include:

### Part numbering

Decide whether part numbers will be **non-significant** (sequential numbers that carry no meaning) or **significant** (codes that encode product family, type or material). Non-significant numbers are simpler and never need to change when a part's use changes; descriptive information belongs in metadata. Significant numbers can help people recognise parts but tend to break down as products evolve. Either way, one part number should identify one form, fit and function.

### Revisions and versions

Distinguish **versions**, every saved change while work is in progress, from **revisions**, formally released states of a design. A common rule is that a change that affects form, fit or function, so that the new part cannot replace the old one in every use, requires a new **part number**, while a change that keeps interchangeability requires a new **revision**. Agree the revision scheme, such as letters or numbers, and when revisions increment.

### Lifecycle states

Typical states include:

| State | Meaning | Who can change it |
|---|---|---|
| Work in progress | Being designed or modified | The owning designer |
| In review | Submitted for checking and approval | Reviewers comment; nobody edits |
| Released | Approved for use in purchasing and production | Nobody; changes require a new revision |
| In change | Released item being revised under a change | The assigned designer |
| Obsolete | No longer used for new production | Nobody |

Keep the number of states small. Complex workflows that nobody follows are worse than simple ones that everyone does.

### Metadata

Define the properties every file must carry: part number, description, material, finish, revision, designer, checker, approval date, project and any classification fields. Consistent properties allow reliable searches, title blocks and bills of materials.

## Workflows and change control

Workflows formalise how designs are reviewed and released. A simple release workflow might require a designer to submit a part, a checker to review it against the checklist and an approver to release it. On release, the system increments the revision, locks the files and creates neutral formats such as PDF and STEP for distribution.

Changes to released items should follow a defined **engineering change** process: a request describing the reason, an assessment of impact using where-used data, approval, implementation in a controlled state and re-release. The [issue, change and configuration control](/reados/collections/project-planning-and-control/issue-change-and-configuration-control/) article explains change control principles that apply equally to product data.

## Permissions

Permissions should reflect roles, not individuals, wherever possible:

- designers edit work in progress;
- checkers and approvers review and approve;
- production, purchasing and suppliers see only released data, usually in neutral or viewable formats; and
- administrators manage configuration.

Restricting edits to released data protects the integrity of what manufacturing uses.

## Migrating legacy data

Migration is often the hardest part of a PDM implementation. Years of files in shared folders contain duplicates, broken references, inconsistent names and missing properties. Practical approaches include:

- **Clean before importing.** Remove obvious duplicates, fix references and standardise properties where possible.
- **Migrate in stages.** Start with active products, and leave legacy data in a read-only archive until needed.
- **Use reference-aware tools.** Moving CAD files outside reference-aware tools breaks links.
- **Validate after import.** Open key assemblies and drawings to confirm references, properties and revisions are correct.
- **Freeze the old location.** Once migrated, make the old folders read-only so people stop using them.

## Connecting PDM to the rest of the business

Engineering data is only valuable when the rest of the business uses the right version of it. Integration points include:

- **ERP or MRP**: transferring released part numbers, descriptions and bills of materials, so purchasing and production work from released data. The [modelling bills of materials and hierarchies](/reados/collections/manufacturing-operations-and-design-for-manufacture/modelling-bills-of-materials-and-hierarchies/) article explains how engineering and manufacturing BOMs differ.
- **Document distribution**: generating controlled PDFs and neutral files for suppliers and the shop floor, with superseded versions withdrawn.
- **Quality**: linking inspection plans and first-article reports to the released revision.
- **Suppliers**: sharing released data through controlled portals rather than email attachments.

## Libraries and standard parts

Fasteners, bearings, purchased components and company standard parts appear in many assemblies. Managing them centrally in the vault, rather than each designer keeping private copies, prevents duplicates and inconsistent part numbers. Good practice includes a single library location, controlled additions with complete properties, purchased parts linked to supplier part numbers and a clear owner for the library. Content generated by CAD toolbox features, such as standard fasteners, should be configured so it creates consistent files and properties rather than a new variant each time.

## Backup, security and access

The vault holds the business's most valuable engineering knowledge, so it deserves the same protection as financial systems:

- **Back up the vault and its database together**, because files and metadata must stay consistent.
- **Test restores** periodically, not just backups.
- **Control remote access**, with secure connections and appropriate authentication.
- **Remove access promptly** when people leave or contractors finish.
- **Log significant actions**, such as releases, deletions and permission changes.

Cloud systems shift some of these tasks to the provider, but the business should still understand where data is held, how it is backed up and how it could be exported if needed.

## Measuring whether PDM is working

A few simple measures show whether PDM is delivering value: the number of errors from superseded drawings reaching suppliers or production, time spent searching for files, the number of broken references found when opening assemblies, release cycle time from submission to approval, and whether purchasing and production report confidence that they are using the current revision. Reviewing these measures after six and twelve months helps refine the configuration and training.

## Implementing PDM in a small team

A practical sequence for a small team is:

1. **Define the problems** you need to solve and the rules you want: numbering, revisions, states and permissions.
2. **Choose a system** that integrates well with your CAD software and fits your size, including cloud-based options.
3. **Configure simply**: a minimal set of states, properties and workflows.
4. **Pilot with one active project** and a few users.
5. **Train everyone**, including how to work with checked-out files and how to search.
6. **Migrate active data**, then archive the rest.
7. **Review after a few months** and adjust configuration based on experience.

## A worked example

This is an illustrative example. The business and events are hypothetical.

A small machine builder with four designers stores CAD files in a shared server folder. In one month, a supplier makes forty brackets to a superseded drawing, costing about $3,200 in scrap and delay, and two designers lose a day's work after overwriting each other's assembly changes.

The business implements a PDM system integrated with its CAD software. It adopts non-significant part numbers, four lifecycle states, a two-step release workflow and automatic PDF and STEP generation on release. Released drawings are published to a read-only folder that purchasing and suppliers use, and superseded PDFs are removed automatically. Active projects are migrated first; ten years of older files are archived read-only and imported only when a product is revised.

In the following year, there are no supplier errors from superseded drawings and no lost work from overwritten files. Where-used searches before changes reveal several cases where a part was shared across products, preventing unintended changes. Designers report spending less time searching for files.

## How this applies to a small Australian business

- **Recognise the warning signs**: overwritten files, broken references, superseded drawings reaching suppliers.
- **Decide your rules first**: numbering, revisions, states, properties and permissions.
- **Keep the configuration simple** and add complexity only when a real need appears.
- **Release before use.** Purchasing, production and suppliers should only see released data.
- **Migrate active data carefully** and archive the rest.
- **Connect PDM to purchasing and production**, so released data flows through the business.
- **Back up the vault** and test restores.
- **Manage standard parts centrally**, so every designer uses the same fasteners, bearings and purchased components with consistent part numbers.

## Common mistakes

- **Moving CAD files outside reference-aware tools.**
- **Over-complicated workflows** that people bypass because they slow everyday work.
- **Significant part numbers** that break as products change.
- **No clear rule for revision versus new part number.**
- **Migrating every legacy file at once** without cleaning.
- **Allowing production to use work-in-progress files**, or emailing drawings outside the controlled release process.
- **Not backing up** or testing restores of the vault.

## Frequently asked questions

**Is cloud PDM suitable for small teams?** Often, yes. Cloud systems reduce server administration and support remote work, but check integration with your CAD software, performance with large assemblies, data location and backup arrangements.

**How long does a PDM implementation take?** For a small team with a simple configuration, a pilot can often be running within weeks. Migration of legacy data and refinement of workflows usually take longer, so plan for a staged rollout rather than a single cut-over.

**Do we need PLM instead?** PLM suits businesses that need to manage requirements, changes, suppliers and quality across the product lifecycle in one system. Many small teams start with PDM and add wider capabilities later.

## Questions to ask

- How often do overwritten files, broken references or superseded drawings cause problems for us?
- What are our rules for part numbers, revisions and release?
- Who can change released data today?
- How do purchasing, production and suppliers know they have the current revision?
- How would we migrate our existing files without breaking them?
- Is our engineering data backed up and recoverable?

## Bringing it together

Shared folders break down as engineering teams and product ranges grow, because CAD data needs reference management, revision control, release states and permissions that ordinary file storage cannot provide. A PDM system supplies a secure vault, check-out and check-in, version history, metadata, lifecycle workflows and where-used information. Success depends less on the software than on clear rules for numbering, revisions, states and permissions, a simple configuration, careful migration and integration with purchasing and production, so that everyone who builds or buys from a drawing works from the released revision.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
