---
title: "Issue, change and configuration control: keeping project baselines true while the project changes"
description: "Projects change constantly; the danger is change nobody decided. How to classify issues, assess impact, route decisions to the right authority and keep drawings and code current."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - quality
  - systems
author: "KEVOS®"
featured: false
draft: false
---

A machine builder is three weeks from factory acceptance testing on a special-purpose assembly machine. The customer has asked, informally, for it to handle a second product size. A cycle-time test shows the machine running at 14 seconds against a requirement of 12. A bracket in the workshop has been made to an earlier drawing revision because the updated drawing was emailed to the designer but never released. The PLC program on the machine is not the version that was last reviewed. Each problem is manageable on its own. Together, unrecorded and undecided, they are how projects lose control: not through one big failure, but through many small changes nobody formally decided.

Projects exist to create change, and they change constantly themselves. Customers refine what they want, products fail tests, suppliers slip and better ideas emerge. Change control is not meant to stop any of that. It exists to make sure that every change to what has been approved is noticed, assessed, decided by someone with the authority to decide and then reflected consistently in every plan, drawing, program and document it affects. **Configuration control** is the partner discipline that keeps track of which version of each product is current, approved and in use.

This article explains how to classify issues, the five steps of a practical issue and change procedure, how to delegate change authority with a change budget, what configuration management involves, how to write a useful change request and how to keep the paperwork in proportion. It is general information for project managers, engineers and owners on projects of any size.

## Baselines: what change control protects

A **baseline** is an approved version of something used for control: the scope, a product description, a drawing set, a schedule, a budget, a program. Once something is baselined, changing it can affect cost, time, quality, benefits, risk, contracts and other products. Change control protects baselines from being altered without a decision, while still allowing them to change when a change is worthwhile.

Change control is not about changes to the world that the project is creating. It is about changes to what the project has agreed to deliver and how.

## Three kinds of issue

An **issue** is something that has happened, was not planned and needs management attention. It is different from a risk, which might happen. Three kinds of issue need different handling:

| Type | What it is | Example |
|---|---|---|
| **Request for change** | A proposal to alter an approved baseline | The customer wants the machine to handle a second product size |
| **Off-specification** | Something that does not, or will not, meet its approved specification | The machine runs at 14 seconds against a 12-second requirement |
| **Problem or concern** | Anything else needing attention | A key supplier will deliver late; a team member is leaving |

Classifying correctly matters because the options differ. A request for change asks whether the baseline should move. An off-specification asks whether to fix the product, accept it with a concession or change the requirement. A problem may lead to either, or to a risk response.

## A five-step procedure

1. **Capture.** Record the issue promptly, with who raised it and when. Do an initial assessment: which product or objective is affected, which type is it, and does it need formal handling or can it be dealt with routinely? Recording every passing conversation overloads the system; failing to record significant issues destroys traceability.
2. **Assess.** Check the current baseline, then analyse the impact across scope, time, cost, quality, benefits, risk, contracts, resources, operations and other products. Use the work breakdown structure, schedule and requirements links to trace the effects.
3. **Propose.** Develop options, including doing nothing where that is legitimate, with the cost, time, risk and consequences of each, and a recommendation.
4. **Decide.** Route the decision to the person or group with authority for that kind and size of change. Record the decision: approve, reject, defer, request more information, grant a concession or escalate.
5. **Implement.** Authorise the work, update every affected product, plan and record, verify the result, communicate it and close the issue only when the evidence is complete.

Urgent safety or containment action sometimes cannot wait for the full procedure. Take it, then record what was done and confirm it through the normal authority afterwards.

## Delegate change authority, with limits

Not every change needs the sponsor or the board. Define in advance who can approve what:

- **Small changes** within the project's tolerances, such as minor scope adjustments with no effect on cost or the finish date, may be approved by the project manager.
- **Moderate changes** may be approved by a change authority, such as the project manager and the customer's representative together, within a defined **change budget** set aside for approved changes.
- **Changes that would exceed tolerances**, affect the business case or exceed the delegated limits go to the sponsor, board or customer.

Delegation works only with clear limits. A series of small changes, each within a delegated limit, can together push the project past its tolerances. Track the cumulative effect, and escalate when the total approaches the limits. The [escalation rules that fire on the right things](/reados/collections/project-sponsors-governance-and-decisions/escalation-rules-that-fire-on-the-right-things/) article covers designing escalation thresholds, including accumulation.

## The anatomy of a useful change request

A **change request** should let a decision-maker understand the change and its consequences without a meeting. It typically covers:

- **Description**: what is proposed, by whom and why.
- **Categories affected**: scope, quality, requirements, cost, schedule, documents, contracts.
- **Justification**: how the change supports the project's objectives or business case.
- **Impact analysis**: quantified effects on cost, schedule, quality, risk and benefits, with the basis for each estimate.
- **Options**, including not proceeding.
- **Funding source**: change budget, contingency or additional funding.
- **Decision**: approve, reject or defer, with signatures and date.

Quantify rather than describe. "A few extra days" is not an impact. "24 hours of design time and 30 hours of programming, costing $3,800, using float on a non-critical path without moving the finish date" is.

## Configuration management: knowing which version is real

**Configuration management** keeps track of the project's products, their versions, their relationships and their status. It answers simple questions that become surprisingly hard on busy projects: which drawing revision is current? Which version of the program is on the machine? Which test results apply to the product as it now exists?

Four activities make it work:

- **Identification**: decide which products are controlled, called configuration items, and give each a unique identifier. Typical items on an engineering project include drawings, models, bills of materials, specifications, software and PLC programs, test procedures and results, manuals and approvals.
- **Control**: changes to configuration items are made only through change control. Approved versions are protected from casual editing, while remaining accessible to the people who need them.
- **Status accounting**: record the current status of each item, such as draft, under review, approved, superseded or withdrawn, and its history.
- **Verification and audit**: check that the actual products and records match the approved configuration, particularly before testing, release, acceptance and handover.

Version numbers alone are not enough; status tells people how a version may be used. A drawing marked revision C but still "under review" should not be manufactured from. A program labelled version 2.3 is useful only if someone knows whether that is the version on the machine.

For each configuration item, a simple record covers the identifier, title, owner, current version and status, location, related items, links to requirements and test evidence, and change history. On small projects, a disciplined folder structure, a document register and clear naming rules can do the job. On larger or regulated projects, document management or product data management software helps.

## Interfaces deserve special attention

A change to one item often invalidates others. A revised bracket drawing may change the bill of materials, the assembly instruction, the inspection plan and the test results that were obtained on the old design. When assessing a change, trace its effects across interfaces, and when implementing it, update everything affected together. Stale related documents are a common cause of products built to a mixture of old and new information.

## Change control in iterative and agile work

Iterative and agile delivery expects priorities to change, and reordering the backlog within agreed scope, budget and dates is normal work for the product owner, not a formal change. But some things remain baselines even in agile work: the overall budget and release dates, contractual commitments, safety and compliance requirements, interfaces with hardware or other systems, and released versions of software. Changes to those still need the five-step procedure and the right authority. Configuration control matters just as much, because frequent releases multiply the number of versions in circulation. Version control for software, tagged releases and a record of which version is installed where are the agile equivalents of a drawing register.

## The issue register

An **issue register** records every formal issue: identifier, date, raised by, type, description, priority, impact assessment, options, decision, decision-maker, actions, status and closure date. Minor matters can be kept in a simple daily log until they need formal handling. A well-kept register lets the project show, at any time, what changed, why, who authorised it, what impact was accepted and which baseline is now current. That is valuable in a contract dispute, an audit or simply a handover to a new project manager.

## Keep it proportionate

Change control should be scaled to the project. A small internal project may need a one-page change form, a spreadsheet register and a rule that drawings are issued only from one folder. A large contract with a customer may need a formal change control board, a document management system and configuration audits at each stage. Too little control lets baselines drift; too much makes people bypass the process, which is worse. The [how work gets in without a decision](/reados/collections/project-sponsors-governance-and-decisions/how-work-gets-in-without-a-decision/) article shows how informal requests escape control in the first place.

## A worked example

This is an illustrative example. A 40-person engineering business is designing and building a special-purpose assembly machine for a manufacturing customer, under a fixed-price contract with a change clause. Factory acceptance testing is three weeks away.

**Change approach.** At project start, the business and customer agreed that the project manager may approve changes under $2,000 with no effect on the delivery date, that the project manager and the customer's engineer jointly control a $10,000 change budget, and that larger changes go to the customer's operations manager and the business's general manager.

**Three issues.**

- **Request for change.** The customer wants the machine to handle a second product size. The assessment identifies new tooling, two new fixtures, PLC program changes, an updated risk assessment and additional tests: $18,500 and three weeks. It exceeds the delegated limits and goes to the senior decision-makers, who approve it as a separately priced variation after the initial acceptance, so the original delivery date holds.
- **Off-specification.** The cycle time is 14 seconds against 12. Options are a concession accepting 13 seconds with a price reduction, or a faster actuator and program change for $3,200 and one week, using float. The customer's engineer and the project manager approve the actuator from the change budget.
- **Problem.** A sensor supplier advises a two-week delay. It is recorded and managed as a schedule issue, with an alternative sensor identified as a fallback.

**Configuration audit.** Before factory testing, the project engineer audits the machine against the configuration register. The audit finds the bracket made to revision B while revision C was approved, and a PLC program on the machine one version behind the reviewed one. The bracket is remade, the correct program is loaded and the register is updated. The release process is tightened so that drawings are released to the workshop only from the controlled register, never by email.

**Result.** Factory acceptance testing passes with the machine matching its approved configuration. The issue register records every decision, which later makes agreeing the variation price with the customer straightforward.

## Applying this in an Australian business

- **Baseline what matters**: scope, requirements, drawings, programs, schedule and budget.
- **Classify issues** as requests for change, off-specifications or problems.
- **Use a five-step procedure**: capture, assess, propose, decide, implement.
- **Delegate change authority** with limits, a change budget and cumulative tracking.
- **Quantify impacts** in change requests.
- **Control configuration**: identify items, protect approved versions, record status and audit.
- **Trace interfaces** so related documents change together.
- **Release documents from one controlled source.**
- **Keep the process proportionate** to the project.

## Where change control breaks down

- **Informal changes** agreed in conversation and never recorded.
- **Every change escalated**, so decision-makers become a bottleneck.
- **Delegated approvals** that add up to a major overrun.
- **Impact described** but not quantified.
- **Superseded drawings and programs** still in use.
- **Related documents** not updated with the change.
- **Closing issues** before the change is verified.

## Questions to ask on your current project

- What are our approved baselines, and where are they kept?
- Who can approve which changes, up to what limits?
- How much of our change budget is used, and what is the cumulative effect of approved changes?
- Could we prove which drawing and program versions are on the product today?
- When did we last check the product against its approved configuration?
- Which issues are open, and who is deciding them?

## Bringing it together

Projects change; the danger is change that nobody decided. Protect approved baselines with a simple procedure: capture issues and classify them correctly, assess their impact across the whole project, propose options, route the decision to the right authority and implement it completely. Delegate change authority with clear limits and a change budget, and watch the cumulative effect. Pair change control with configuration management, so that everyone knows which version of every drawing, program and document is current, and audit the product against its approved configuration before testing and handover. Kept in proportion, these disciplines let a project change freely while staying in control.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® project management handbooks on issue, change and configuration control, the PRINCE2 change theme and change request practice. The worked example is illustrative. This article is general information.*
