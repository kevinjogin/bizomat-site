---
title: "Managing quality on a project: acceptance criteria, quality registers, reviews and concessions"
description: "Project quality fails at handover when nobody agreed what good meant. How to plan quality, separate assurance from control, track checks in a register and handle shortfalls openly."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

The new packaging line is installed, the supplier says it is finished and wants the final payment, and the production manager says it is not acceptable. The line runs, but not at the speed the business expected, the changeover takes twice as long as promised, half the operator training records are missing and the documentation refers to a different printer from the one fitted. Each side has a point. Nobody wrote down, at the start, exactly what "finished" would mean, how it would be checked or who could accept it.

Quality on projects is often treated as an inspection at the end. By then, the options are poor: accept something that falls short, pay to rework it, or argue. The projects that hand over smoothly are those that agreed early what the products must achieve, planned the checks that would prove it, recorded the results as they went and handled shortfalls through a visible decision rather than a quiet compromise.

This article explains how to plan quality on a project: the quality management plan, the hierarchy from customer expectations to acceptance criteria to product quality criteria, the difference between quality assurance and quality control, the quality register, how to run a quality review, and how to deal with defects through tolerances, concessions and change control. It is general information for project managers, engineers and owners delivering projects for customers or for their own business.

## Quality on a project means fitness for purpose, proved by evidence

On a project, **quality** is the degree to which the products delivered meet the requirements agreed for them and can be used as intended. Three ideas follow:

- **Quality must be defined before it can be managed.** If the criteria are vague, any result can be argued to pass or fail.
- **Quality is checked progressively**, product by product, not once at the end.
- **Evidence matters.** A quality claim without a record is an opinion.

A widely quoted summary of the quality management philosophy behind ISO 9001 captures this: say what you will do, do it, and prove that you did it.

## Three levels of quality definition

Quality requirements on a project work at three levels, and mixing them up causes confusion:

| Level | What it is | Example for a packaging line upgrade |
|---|---|---|
| **Customer quality expectations** | Broad statements of what the customer expects of the overall result | Reliable, fast to change over, safe and easy for existing operators to use |
| **Acceptance criteria** | A prioritised list of measurable conditions the final product must meet before the customer accepts it | Runs at 60 packs a minute for a full shift; changeover between pack sizes in under 15 minutes; all guarding compliant; operators trained and assessed |
| **Product quality criteria** | Detailed criteria for each component product, used to review it | Fixture drawings to the company drafting standard; PLC program passes the agreed test script; manual includes spare parts list |

Customer expectations shape the solution. Acceptance criteria decide whether the project is finished. Product criteria decide whether each piece is ready. Prioritise acceptance criteria, for example as must, should and could, so that if trade-offs are needed later, everyone knows which ones matter most. The [quality starts before the specification](/reados/collections/specifications-product-quality-and-sustainability/quality-starts-before-the-specification/) article explains why getting the specification right matters as much as conforming to it.

## Write product descriptions with testable criteria

For each important product, a **product description** sets out its purpose, composition, the inputs it is derived from, its quality criteria, the method used to check each criterion and who produces, reviews and approves it. A good criterion has four parts:

**Characteristic + method of checking + acceptance rule + approver.**

"Easy to use" is an expectation. "A trained operator completes a pack-size changeover, unassisted, in under 15 minutes, observed by the production supervisor, in three consecutive attempts" is a criterion. Where judgement is unavoidable, name who exercises it and against what reference, such as an approved sample or photograph.

## The quality management plan

A **quality management plan** describes how quality will be managed on the project. It does not need to be long. It should answer five questions:

1. **What will be checked**: which products and processes.
2. **How**: the methods, such as inspection, testing, review, demonstration and audit.
3. **When**: at what points in the project, including before key decisions and payments.
4. **Who**: who produces, who checks, who approves, and what independence is needed.
5. **How the project will learn and improve** as it goes.

It also states the standards that apply, the records to be kept, how defects and nonconformances are handled and how final acceptance will be given. On projects delivered by suppliers, it connects to their quality plans and to any inspection and test plans in the contracts.

## Quality assurance and quality control

The two terms are often used interchangeably, but they do different jobs:

- **Quality assurance** is proactive and process-focused. It gives confidence that the project's way of working will produce acceptable products: agreed standards, competent people, planned reviews, audits of whether the quality plan is being followed. It prevents problems.
- **Quality control** is product-focused. It checks specific products against their criteria through inspection, testing and review, and records the results. It finds problems.

A project that relies only on control, building first and testing at the end, finds problems late, when they are most expensive. A project that relies only on assurance can follow every procedure and still deliver a product that fails its tests. Both are needed. On larger projects, some assurance should be independent of the project team.

## The quality register

A **quality register** is a simple log of every planned quality activity: what product, which check, when it is planned, who is responsible, when it actually happened, the result and where the record is kept. Its value is twofold:

- It makes **planned checks visible**, so they are scheduled and resourced rather than squeezed in at the end.
- It provides **evidence** at handover that every product was checked and approved, and it shows which checks are still open.

A product should not be reported as complete until its quality check has passed and been recorded. That simple rule stops progress reports from claiming completion for products that have not been proved.

## Running a quality review

Many products, such as designs, specifications, documents and software, are checked by review rather than measurement. A structured **quality review** is far more effective than circulating a document for comments. A practical approach:

1. **Prepare.** The reviewers receive the product and its quality criteria in advance and each prepares a list of questions or issues, marked against the criteria.
2. **Meet briefly.** A chair runs the meeting, the presenter, usually the producer, walks through the product, and reviewers raise their issues. Someone records actions. The meeting checks the product against its criteria; it does not redesign it.
3. **Decide.** The outcome is one of: complete, complete subject to agreed actions, or incomplete and to be reviewed again.
4. **Follow up.** Actions are completed and signed off by the named reviewers, and the result is recorded in the quality register.

```figure
type: steps
title: Running a quality review
caption: The outcome is recorded in the quality register.
- Prepare | reviewers read against the criteria
- Meet briefly | the producer walks through
- Decide | complete, complete with actions, or incomplete
- *Follow up | actions signed off
```

Choose reviewers who represent the users and the people who will operate and maintain the product, not only technical peers.

## Factory and site acceptance testing

On engineering projects involving equipment, two acceptance tests are common:

- **Factory acceptance testing (FAT)** takes place at the supplier's premises before shipment. It checks that the equipment works as specified, and problems found here are cheap to fix.
- **Site acceptance testing (SAT)** takes place after installation, under real conditions, often with the customer's own materials and operators.

Both need agreed test scripts, based on the acceptance criteria, before the tests begin. The [inspection and test plans for supplier work](/reados/collections/suppliers-contractors-and-government-work/inspection-and-test-plans-for-supplier-work/) article covers hold and witness points and the evidence to require from suppliers.

## When a product falls short: tolerance, concession or change

Not every shortfall is a disaster, but each must be handled visibly. Three mechanisms apply, and they must not be confused:

- **Quality tolerance** is an allowable range around a criterion, agreed in advance as part of the plan. A result within tolerance passes without escalation.
- **A concession** is a decision to accept a product that does not meet its criteria, after assessing the impact. It is made by someone with the authority to do so, usually the customer or the person who owns the requirement, and is recorded with any conditions, such as a price reduction, a later fix or added inspection.
- **A change** alters the requirement itself, through change control, with its effect on cost, time, risk and benefits assessed.

The danger is the silent version of each: a supervisor accepting a product "because it's close enough", or a team quietly lowering a criterion to make it pass. Concessions must never be used to accept products that breach safety, legal or mandatory contractual requirements.

## Track defects and learn

Record defects and nonconformances as they are found, with their cause and the action taken. Simple quality tools help analyse them: check sheets to collect data, Pareto charts to see which problems dominate, cause-and-effect diagrams to explore causes, and run charts to see trends. The **plan–do–check–act** cycle applies within the project: when a problem recurs, change the process, not just the product.

## Acceptance, handover and benefits

Final **acceptance** is a formal decision by the customer, or the person authorised by them, that the project's products meet the acceptance criteria. It should be based on the quality register, test records and any approved concessions, and recorded in writing. Handover then transfers the products, documentation, spares, training records and responsibilities to the people who will operate them.

Acceptance is not the same as benefit realisation. A line can be accepted as meeting its criteria while the improved output it was meant to deliver is still to be proven in production. Keep the two separate, and make sure someone owns the benefits after the project closes.

## A worked example

This is an illustrative example. A 70-person food manufacturer is upgrading a packaging line with a new case packer, labelling system and controls, supplied and installed by an equipment supplier, with the manufacturer's own engineer as project manager.

**Planning quality.** At the start, the project manager and production manager agree customer quality expectations: reliable, quick to change over, safe and easy for current operators. These become prioritised acceptance criteria: 60 packs a minute sustained over a full shift (must), changeover between pack sizes in under 15 minutes (must), label placement within ±2 mm (must), operators trained and assessed (must) and reduced noise at the operator position compared with the old line (should). A quality tolerance allows line speed to reach 57 packs a minute in the first two weeks while operators gain experience, rising to 60 thereafter.

**Products and checks.** Product descriptions are written for the functional specification, the guarding design, the PLC program, the operating manual, the training package and the installed line. The quality register lists each check: specification review, guarding design review with the safety officer, FAT at the supplier, SAT on site, training assessments and documentation review.

**Reviews and tests.** The functional specification review, with an operator and a maintenance technician present, finds that the specification lacks a changeover procedure; one is added before manufacture begins. FAT reveals that label placement drifts at high speed. The supplier fixes it before shipping, and the test is repeated and recorded.

**A concession.** During installation, the supplier proposes a different label printer model because the specified one is unavailable. The project manager assesses the impact, confirms equivalent performance and spare parts support, and the production manager approves a concession, conditional on the supplier providing two days of extra training on the new model. It is recorded in the register.

**Acceptance.** SAT shows the line running at 58 packs a minute in week one, within tolerance, and 61 in week three. Changeover averages 12 minutes. One training assessment is outstanding; acceptance is given subject to its completion within two weeks, with the final payment held until it is done. Benefits, such as reduced labour per case, are assigned to the production manager to measure over the next six months.

```figure
type: bars
title: Site acceptance of a packaging line upgrade
unit: packs a minute
max: 65
caption: The acceptance criterion was 60 packs a minute for a full shift; changeover averaged 12 minutes against a 15-minute target.
- Week one | 58 | within tolerance
- *Week three | 61
- Acceptance criterion | 60
```

## Applying this in an Australian business

- **Agree acceptance criteria early**, prioritised and measurable.
- **Write product descriptions** with criteria, methods and approvers.
- **Keep a short quality management plan** answering what, how, when, who and how to improve.
- **Use assurance and control**, not just end inspection.
- **Maintain a quality register** and report products complete only when checked.
- **Run structured quality reviews** with users and maintainers present.
- **Plan FAT and SAT** with agreed scripts for equipment projects.
- **Handle shortfalls** through tolerance, concession or change, never silently.
- **Record acceptance formally** and keep benefits ownership separate.

## Where project quality goes wrong

- **Defining "done"** only at handover.
- **Mixing expectations, acceptance criteria and product criteria.**
- **Treating document circulation** as a review.
- **Reporting progress** for products that have not been checked.
- **Accepting shortfalls informally.**
- **Skipping factory testing** to save travel.
- **Confusing acceptance** with benefits achieved.

## Questions to ask at project start

- What exactly must the final product achieve before we accept it, in priority order?
- Which products will be checked, how, when and by whom?
- Where is our quality register, and who keeps it?
- Who can approve a concession, and who can change a requirement?
- How will we test equipment before it leaves the supplier?
- Who will own the benefits after acceptance?

## Bringing it together

Quality on a project is decided long before handover. Agree customer expectations, turn them into prioritised acceptance criteria, and write product descriptions with testable criteria, methods and approvers. Keep a short quality management plan, use both assurance and control, and track every planned check in a quality register so that no product is called complete without evidence. Run structured reviews, test equipment at the factory and on site, and handle every shortfall visibly through tolerance, concession or change. Then accept formally, hand over completely and keep the benefits in view. Projects managed this way still find problems, but they find them early and settle them on facts.

---

*Source: BIZOMAT editorial notes, drawing on earlier BIZOMAT project management handbooks on planning project quality, project quality assurance and control, product quality and acceptance control, and the PRINCE2 quality theme. The worked example is illustrative. This article is general information.*
