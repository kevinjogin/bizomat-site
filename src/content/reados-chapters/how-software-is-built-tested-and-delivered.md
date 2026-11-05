---
title: "How software is built, tested and delivered: the life cycle explained for business owners and managers"
description: "What happens between a software idea and a working system: requirements, design, building, testing levels, environments, release and maintenance, and how to judge a team or supplier's process."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - projects
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

Most businesses now depend on software they did not write themselves: accounting packages, job management systems, online stores, customer portals, spreadsheets with macros and small custom applications that grew up around particular processes. Sooner or later, many also commission software: a customer portal, an integration between systems, a quoting tool, a mobile app for field staff or changes to an existing product. At that point, managers who have never worked in software are expected to judge estimates, approve designs, accept deliveries and decide whether a project is on track.

Software projects have a reputation for running late, costing more than expected and delivering something different from what was wanted. Many of those problems are not technical. They come from unclear requirements, testing that is left too late, changes made directly in live systems, poor communication between the business and the developers and the assumption that the work ends at go-live. Understanding the main stages of how software is built, tested and delivered helps business owners ask better questions, spot warning signs early and work more effectively with developers and suppliers.

This article explains the software life cycle in plain terms: requirements, design, building, the different levels of testing, environments, release and deployment, maintenance and the main ways teams organise the work. It describes what good practice looks like at each stage and what to ask a team or supplier. It is part of a series on software and cloud foundations for business leaders.

## The software life cycle

Software passes through broadly similar stages regardless of size or method:

1. **Requirements**: understanding what the software must do and why.
2. **Design**: deciding how it will be structured to do that.
3. **Building**: writing and assembling the code.
4. **Testing**: checking that it works as intended and does not break anything else.
5. **Release and deployment**: putting it into use.
6. **Operation and maintenance**: running, supporting, fixing and improving it.

```figure
type: cycle
title: The software life cycle
caption: Maintenance is part of the cost from the start; unmaintained software becomes insecure and expensive to change.
- Requirements
- Design
- Building
- Testing
- Release and deployment
- *Operation and maintenance
```

These stages are not always sequential. Modern teams usually cycle through them repeatedly in small increments. But each stage still has to happen, and skipping one usually creates problems in the next.

## Requirements: what problem is being solved

Requirements describe what the software must do. Good requirements start with the business problem, not the solution: "Field technicians spend 30 minutes each evening re-entering job notes into the office system" is more useful than "Build a mobile app". The problem statement allows developers to suggest better or cheaper solutions, and it gives everyone a way to judge whether the result has succeeded.

Requirements usually include:

- **functional requirements**: what the software must do, such as recording a job, calculating a quote or sending an invoice;
- **non-functional requirements**: qualities such as speed, security, availability, accessibility and the number of users it must support;
- **constraints**: existing systems it must work with, regulations, budgets and deadlines; and
- **acceptance criteria**: how the business will decide that each requirement has been met.

A common format describes requirements as **user stories**, short statements written from the user's point of view that name who needs something, what they need and why: for example, a field technician needs to record job notes on a phone so that the office has them by the end of the day. Stories keep attention on who benefits and why. Each story needs acceptance criteria that make it testable, such as "notes entered offline are uploaded automatically when the phone reconnects".

The people who do the work should be involved in describing requirements. Managers often describe how a process is supposed to work; the people doing it know how it actually works, including the exceptions that cause most of the difficulty.

## Design: how the software will be structured

Design decides how the software will meet its requirements. It covers:

- **architecture**: the main parts of the system and how they connect, such as a web application, a database and links to the accounting system;
- **data design**: what information is stored and how it relates, as described in the [how business databases are structured](/reados/collections/database-foundations-for-business/how-business-databases-are-structured/) article;
- **user interface design**: screens, forms, workflows and how people move through them; and
- **technical choices**: programming languages, frameworks, hosting and third-party services.

Design decisions made early are expensive to change later. Choosing where data lives, how systems connect and how security works shapes everything that follows. For a business owner, the most useful design artefacts are usually simple: a diagram of the main parts and how they connect, mock-ups or prototypes of key screens, and a list of significant decisions with the reasons for them. Prototypes are especially valuable because they let users react to something concrete before it is built.

## Building: writing and assembling code

Developers write **source code**, the human-readable instructions that define what the software does, in a programming language. Very little software is written from scratch. Most is assembled from **frameworks**, which provide standard structures for common kinds of application, and **libraries**, reusable code for tasks such as handling dates, generating PDFs or connecting to payment services. Using established components saves time and reduces errors, but it also creates dependencies that must be kept up to date, particularly for security fixes.

Good building practice includes:

- **version control**, which records every change to the code, who made it and why, and allows changes to be reviewed and reversed;
- **code review**, in which another developer reads and questions each change before it is accepted;
- **coding standards**, so code is consistent and readable by others; and
- **automated tests written alongside the code**, so that each part can be checked repeatedly.

Code is read far more often than it is written. Code that is clear and well organised is cheaper to fix and extend; code that only its author understands is a business risk, particularly when that author leaves.

## Testing: checking at several levels

Testing checks that software works as intended. It happens at several levels, each catching different problems:

- **Unit tests** check small pieces of code in isolation, such as a function that calculates GST or rounds a price. They are fast, automated and written by developers.
- **Integration tests** check that parts work together, such as the application saving records correctly to the database or exchanging data with the accounting system.
- **System tests** check the complete application against its requirements, including performance and security.
- **User acceptance testing** has business users check that the software supports their real work, using realistic scenarios and data.
- **Regression tests** re-check existing features after changes, to make sure nothing that previously worked has been broken.

Automated tests can run every time the code changes, catching mistakes within minutes. Manual testing remains important for usability, unusual scenarios and judgement about whether the software is fit for purpose. The [testing business software that holds important data](/reados/collections/business-systems-security-and-it-decisions/testing-business-software-that-holds-important-data/) article explains what to test in systems that record money, stock and customer information.

Defects are much cheaper to fix when they are found early. A misunderstanding caught while reviewing requirements costs a conversation; the same misunderstanding found after release may cost redesign, data corrections and lost customer goodwill. This is why good teams test continuously rather than leaving testing to the end.

## Environments: keeping experiments away from live work

Software teams use separate **environments**, each a copy of the system for a different purpose:

- **Development**: where developers write and try out code.
- **Test** or **staging**: a copy of the live system, as close to it as practical, where changes are tested before release.
- **Production**: the live system that staff and customers use.

Changes should move through these environments in order, and nobody should make untested changes directly in production. Test environments should use realistic data, but copies of real customer or staff data must be protected or de-identified, because test systems are often less secure than production.

Making changes directly in a live system, sometimes called "fixing it in production", is a common source of outages and data corruption in small businesses, especially where one person maintains a system without anyone else checking.

## Release and deployment

**Deployment** is the technical act of installing a new version of the software in an environment. **Release** is making new features available to users. The two can be separated: a feature can be deployed but hidden behind a switch, sometimes called a feature flag, until the business is ready to switch it on.

Good release practice includes:

- **automated, repeatable deployment**, so that each release is done the same way rather than by a person following memory;
- **release notes** describing what has changed;
- **a rollback plan**, so a faulty release can be reversed quickly;
- **database changes planned carefully**, because data, unlike code, cannot simply be replaced with an earlier version; and
- **timing releases** to avoid peak business periods.

Smaller, more frequent releases are generally safer than large, infrequent ones, because each change is easier to test, understand and reverse.

## Operation and maintenance

Go-live is not the end of a software project. Software must be monitored, supported, backed up, secured and updated. Libraries and frameworks need security updates; operating systems and browsers change; business processes and regulations evolve; users discover defects and ask for improvements. Over a system's life, maintenance and improvement often cost more than the original build.

Maintenance falls into several types:

- **corrective**: fixing defects;
- **adaptive**: keeping the software working as its environment changes, such as new operating system versions or tax rules;
- **perfective**: improving features and performance in response to users; and
- **preventive**: improving structure and documentation to make future change easier and reduce the risk of failures.

Budgets and contracts should allow for ongoing maintenance from the start. Software that is not maintained gradually becomes insecure, unsupported and expensive to change, as the [managing legacy Visual Basic 6 applications](/reados/collections/business-systems-security-and-it-decisions/managing-legacy-visual-basic-6-applications/) article illustrates.

## Ways of organising the work

### Sequential approaches

In a **sequential**, or "waterfall", approach, each stage is completed before the next begins: all requirements are agreed, then the whole system is designed, built, tested and delivered. The approach suits work where requirements are stable and well understood, and where regulation or contracts demand full specifications up front. Its weakness is that users may not see working software until late in the project, when changes are expensive.

### Iterative and agile approaches

**Iterative** approaches deliver software in small increments, each of which is built, tested and shown to users. The Agile Manifesto, published by a group of software practitioners in 2001, emphasised working software, collaboration with customers and responding to change. Common agile methods include:

- **Scrum**, which organises work into fixed periods called sprints, typically one to four weeks long, each ending with a review of working software; and
- **Kanban**, which visualises work on a board and limits how much is in progress at once, so items flow through to completion.

Agile approaches suit work where requirements are uncertain or likely to change, which describes most business software. They require regular involvement from the business, usually through a **product owner** who decides priorities and answers questions. Without that involvement, agile projects drift.

### Minimum viable product

A **minimum viable product** is the smallest version of the software that delivers real value and allows the team to learn from real use. Starting with a focused first release, rather than trying to build every desired feature at once, reduces risk and shows early whether the software actually helps.

## Estimating and tracking progress

Software estimates are uncertain, particularly early on. Useful practices include estimating in ranges rather than single figures, breaking work into small pieces, re-estimating as the work becomes clearer and tracking progress by working, tested features rather than hours spent or code written. A project that reports being "90% complete" for months is a familiar warning sign; working software demonstrated regularly is much harder to misreport.

## Working with developers and suppliers

Whether software is built in-house or by a supplier, business owners can judge the process by asking a few questions:

- How are requirements captured and confirmed with the people who will use the software?
- Will we see working software regularly, and how often?
- What testing is done, at which levels, and how much is automated?
- How are changes controlled, reviewed and recorded?
- Which environments are used, and how is production protected?
- How are releases deployed and, if necessary, reversed?
- Who owns the source code, and where is it kept?
- What does ongoing support and maintenance include, and what does it cost?

Contracts should make clear who owns the code and data, where the code is stored and how the business can take over or move the work to another supplier.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A refrigeration service business with 15 technicians wants to replace paper job sheets. A local developer proposes a full field service app with scheduling, quoting, stock tracking and invoicing, to be delivered in nine months.

The operations manager instead agrees a smaller first release. The requirements focus on one problem: getting job notes, photos and parts used from technicians to the office the same day. Two technicians and an office administrator help write user stories and acceptance criteria, including working without mobile coverage in plant rooms.

The developer shows working screens every two weeks. During the third review, technicians point out that they often attend several units at one site, a scenario missing from the design; it is added before much code depends on it. Automated tests check calculations and data uploads, and the office team runs acceptance tests with real job scenarios in a staging environment. The first release goes live after ten weeks, with a rollback plan to paper if needed.

Within a month, job notes reach the office the same day for nearly all jobs, invoicing is faster and the business has evidence to plan the next increment, stock tracking, with the same developer. The contract confirms that the business owns the code, which is stored in the business's own repository.

```figure
type: compare
title: Nine months of everything, or one problem first
cols: Proposed | Delivered first
best: 2
caption: A missed multi-unit site scenario was caught at the third fortnightly review, before much code depended on it.
- Scope | Scheduling, quoting, stock, invoicing | Same-day job notes, photos and parts
- Timing | Nine months | Working screens every two weeks
- Users | Not involved | Two technicians and an administrator wrote the stories
- *Next step | Everything at once | Stock tracking, planned from evidence
```

## How this applies to a small Australian business

- **Start with the problem**, not the solution, when commissioning software.
- **Involve the people who do the work** in requirements and testing.
- **Ask to see working software regularly**, not just progress reports.
- **Expect testing at several levels**, including user acceptance with real scenarios.
- **Keep untested changes out of production**, and protect real data in test systems.
- **Plan releases with rollback** and database changes in mind.
- **Budget for maintenance** from the start.
- **Own the code and data**, and know where they are kept.

## Common mistakes

- **Specifying a solution** before understanding the problem.
- **Leaving testing until the end.**
- **Making changes directly in the live system.**
- **Treating go-live as the end** of the project.
- **Measuring progress by effort** rather than working features.
- **Trying to build everything at once.**
- **Not knowing who owns the code.**

## Frequently asked questions

**Is agile always better than a sequential approach?** No. Agile suits uncertain and changing requirements, which are common in business software. Sequential approaches can suit stable, well-defined or heavily regulated work. Many projects combine elements of both.

**How much testing is enough?** Enough to give confidence that the most important and risky functions work and that changes have not broken them. Systems that handle money, safety or personal information need more thorough testing than internal convenience tools.

**Why does maintenance cost so much?** Because software must keep working as its environment, users and business change, and because security updates never stop. A system that is not maintained becomes more expensive to change and more likely to fail.

**Should a small business use off-the-shelf software or have something built?** Off-the-shelf software is usually cheaper and faster where it fits standard processes. Custom software makes sense for processes that genuinely differ from the norm and give the business an advantage, or for connecting systems together.

## Questions to ask

- What business problem is this software solving, and how will we know it has worked?
- When will we see working software, and who from the business will review it?
- How are changes tested, released and reversed?
- Who owns the code and data, and where are they kept?
- What will maintenance cost each year?

## Bringing it together

Software is built through a cycle of requirements, design, building, testing, release and maintenance, usually repeated in small increments. Projects succeed when requirements start with real problems and real users, testing happens continuously at several levels, changes move through separate environments before reaching live systems, releases can be reversed and maintenance is planned and funded. Business owners who understand this life cycle can ask the questions that keep software projects honest and useful.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
