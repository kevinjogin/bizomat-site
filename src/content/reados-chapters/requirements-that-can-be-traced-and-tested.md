---
title: "Requirements that can be traced and tested: from business need to verified solution"
description: "Many project disputes trace back to requirements nobody wrote clearly. How to elicit needs, write testable requirements, prioritise them, trace each to an objective and evaluate the result."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - systems
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A manufacturer replaces its paper job cards with a shop-floor data system. The supplier delivers what was specified: barcode scanning, job status screens and reports. Six months later, the managers who sponsored it are disappointed. Supervisors still walk the floor to find out where jobs are, because the screens refresh too slowly. Operators skip scrap entries because the screens are hard to use with gloves on. The planners still cannot get actual job times because the reports were designed for finance. Every one of these needs existed before the project started. None was written down in a form anyone could build or test.

Requirements are where many projects quietly fail. A **requirement** is a condition or capability that a solution must meet to satisfy a need. When requirements are vague, missing or disconnected from the reason for the project, the team builds the wrong thing well, disputes break out at acceptance and changes multiply. When they are clear, prioritised and traced to business objectives, the team builds the right thing, testing is straightforward and every change can be judged against what the project is for.

This article explains the difference between needs and requirements, the main types of requirement, how to elicit them, how to write requirements that can be tested, how to prioritise them, how to trace each one from business objective to test, how to control changes and how to evaluate whether the delivered solution actually works. It is general information for project managers, engineers, analysts and owners commissioning systems, equipment or process changes.

## Right thing, built right

Two questions run through every project. **Are we building the right thing?** That is the province of business analysis: understanding the need, defining the requirements and confirming the solution delivers value. **Are we building the thing right?** That is the province of project management: delivering on time, on budget and to quality. Both matter, and in small businesses the same person often answers both. The trap is to answer the second question carefully while assuming the first.

A **need** is the problem or opportunity: late orders, high scrap, poor visibility of work. A **requirement** is a condition the solution must meet to address the need. Confusing the two leads people to specify solutions before the problem is understood.

## Start with the need and the gap

Before writing requirements, describe:

- **The problem or opportunity**, its impact and the consequences of doing nothing.
- **The current state**: how things work today, measured where possible, not assumed.
- **The future state**: goals and specific, measurable objectives, such as raising on-time delivery from 78% to 92% within a year.
- **The gap** between the two, which defines what the solution must achieve.

Root-cause tools such as asking why repeatedly and cause-and-effect diagrams help make sure the project addresses the cause rather than a symptom. Options are then compared on operational, technical, financial and schedule feasibility before one is chosen. The [feasibility is more than the numbers](/reados/collections/investment-appraisal-and-business-cases/feasibility-is-more-than-the-numbers/) article covers testing options before committing.

## Types of requirement

Requirements work at several levels, and a good set covers all of them:

| Type | What it states | Example for a shop-floor data system |
|---|---|---|
| **Business requirements** | The objectives the organisation must achieve | Raise on-time delivery from 78% to 92% within 12 months |
| **Stakeholder requirements** | What particular groups need from the solution | Supervisors can see the status of every job by work centre, in close to real time |
| **Functional requirements** | What the solution must do | Operators record job start, stop and scrap by scanning a barcode |
| **Non-functional requirements** | How well it must do it, and under what conditions | Each scan entry takes under 30 seconds; screens are usable with work gloves; data are kept when Wi-Fi drops |
| **Transition requirements** | What is needed to move from the old way to the new | All operators trained and assessed; two weeks of parallel running; open jobs migrated |

Non-functional and transition requirements are the most often missed, and they frequently decide whether a solution is adopted. A system that does everything required but is slow, awkward or unreliable in the real environment will be worked around.

## Elicit requirements from the right people

Requirements are **elicited**, drawn out from stakeholders and sources, not simply collected. Useful techniques include:

- **Interviews** with sponsors, managers and specialists.
- **Observation** of the work as it is actually done, which reveals needs people do not mention because they take them for granted.
- **Workshops** that bring different groups together to agree requirements and resolve conflicts.
- **Document analysis**: existing procedures, reports, forms, contracts and regulations.
- **Prototypes and mock-ups**, which let people react to something concrete.
- **Surveys**, for larger or dispersed groups.

Involve the people who will use, operate and maintain the solution, not only those who will pay for it. In the opening example, an hour watching operators record scrap with gloves on would have produced a requirement that the specification missed.

## Write requirements that can be tested

A good requirement is:

- **Necessary**: it traces to a real need or objective.
- **Clear and unambiguous**: one interpretation, using defined terms.
- **Verifiable**: there is a way to test or inspect whether it is met.
- **Feasible** within the project's constraints.
- **Singular**: one requirement per statement, so each can be tested and traced.
- **Traceable**: uniquely identified and linked to its source.

Words such as "fast", "user-friendly", "flexible", "approximately" and "as appropriate" are warnings: they cannot be tested. "The dashboard must be fast" becomes "the job status dashboard updates within one minute of a scan". Where a requirement involves judgement, name who judges and against what reference.

Separate requirements from design. "The system shall use tablets mounted at each work centre" is a design decision; the requirement may be "operators can record a transaction within ten metres of their work centre without leaving the process unattended". Keeping them separate leaves room for better solutions.

## Validate the requirements before building

Requirements can be clear, testable and still wrong. Before the requirements are baselined, check them with the people who gave them and the people who will use the result:

- **Walk through the requirements** with each stakeholder group and confirm that they describe the need correctly and completely.
- **Use scenarios**: step through a typical day, an unusual job, a breakdown and a busy period, and check that the requirements cover each.
- **Show a prototype or mock-up** where the solution involves screens, layouts or workflows; people often recognise a missing requirement only when they see something concrete.
- **Check for conflicts**, such as one group needing more data entry and another needing less, and resolve them explicitly.

Finding a missing or wrong requirement at this stage costs a conversation; finding it after delivery costs a change.

## Prioritise

Not every requirement is equally important, and the budget rarely covers everything. Prioritise explicitly, for example using **must, should, could and won't (this time)**. Tie priorities to the business objectives: a requirement that does not contribute to any objective is a candidate for "won't". Agreed priorities make trade-offs faster when time or money runs short, and they stop minor preferences crowding out what matters.

## Trace every requirement

A **requirements traceability matrix** links each requirement backwards to the need it serves and forwards to the design element that satisfies it and the test that verifies it:

| Objective | Stakeholder requirement | Solution requirement | Design element | Test | Status |
|---|---|---|---|---|---|
| On-time delivery 92% | Supervisors see job status in close to real time | FR-14: dashboard updates within 1 minute of a scan | Dashboard module | TC-14 | Verified |
| On-time delivery 92% | Planners get actual job times | FR-18: report of actual times by operation, exportable | Reporting module | TC-18 | Implemented |
| Scrap reduced 30% | Scrap recorded with a reason | FR-11: scrap entry with reason codes in under 30 seconds | Scan screen | TC-11 | Approved |

**Forward tracing** shows that every requirement is designed and tested; nothing is forgotten. **Backward tracing** shows that every feature exists for a reason; nothing is added without purpose, a habit sometimes called gold-plating. Track each requirement's status, from proposed to approved, implemented and verified.

## Baseline and control change

Once the requirements are agreed, **baseline** them: record the approved version. After that, changes go through change control. The traceability matrix makes **impact analysis** quick: a proposed change can be traced to the objectives it serves, the design elements and tests it affects, and the cost and time involved. A change that serves no business objective deserves hard questions, however attractive it is. The [when the project succeeds and the strategy fails](/reados/collections/from-approval-to-benefits/when-the-project-succeeds-and-the-strategy-fails/) article explains how projects can deliver outputs that do not produce the intended benefits.

## Verification and solution evaluation

Two checks close the loop:

- **Verification** confirms that the solution meets its requirements, through the tests in the traceability matrix.
- **Solution evaluation** confirms that the solution actually delivers the value intended, by measuring the business objectives after it is in use and comparing actual results with expected ones.

Evaluation often continues well after go-live. Its findings lead to one of four broad recommendations: keep the solution as it is, improve it, replace it or retire it. Evaluation also feeds learning into the next project.

## A requirements management plan

For larger projects, a short **requirements management plan** states how requirements will be elicited, documented, prioritised, approved, traced, changed and verified, who owns each step and which tools will be used. For a small project, a spreadsheet with clear columns and an agreed approval process may be all that is needed.

## A worked example

This is an illustrative example. A 120-person metal products manufacturer is replacing paper job cards with a shop-floor data system. On-time delivery is 78%, supervisors spend much of their day chasing job status and planners use estimated times that are often wrong.

**Need and objectives.** The sponsor and operations manager agree two business objectives: raise on-time delivery to 92% within 12 months, and reduce scrap by 30% by making its causes visible.

**Elicitation.** The analyst, an engineer seconded for the project, interviews supervisors and planners, runs a workshop with team leaders and spends two shifts observing operators. Observation reveals three needs nobody had mentioned: operators wear gloves, Wi-Fi drops out in the welding bay and scrap is often found at the next operation rather than where it was made.

**Requirements.** The resulting list of 46 requirements covers business, stakeholder, functional, non-functional and transition levels. Examples include a scan entry under 30 seconds, gloved operation, offline buffering when Wi-Fi drops, scrap recording with reason codes at any work centre, dashboard updates within a minute, exportable actual times by operation, two weeks of parallel running and training with assessment for every operator. Each is prioritised and traced to an objective.

**Change.** Midway through, the sales team asks for a customer portal showing order status. Impact analysis shows it serves neither business objective and would delay go-live by six weeks. It is recorded as a requirement for a later phase.

**Verification and evaluation.** All must-have requirements pass their tests before go-live. Six months later, on-time delivery has reached 88% and scrap has fallen 22%. Analysis of the data shows night-shift scrap entries are incomplete. A small improvement adds a prompt at shift end, and a supervisor checks entries. After twelve months, on-time delivery reaches 91% and scrap is down 31%. The evaluation report recommends keeping the system and extending it to the paint line.

## Applying this in an Australian business

- **Define the need and the gap** before specifying solutions.
- **Cover all requirement types**, especially non-functional and transition.
- **Observe the work**, not just interview managers.
- **Write testable, singular requirements**, separate from design.
- **Prioritise** against business objectives.
- **Trace every requirement** forwards and backwards.
- **Baseline and control changes** with impact analysis.
- **Verify** against requirements and **evaluate** against objectives after go-live.

## Where requirements go wrong

- **Specifying a solution** before understanding the problem.
- **Missing non-functional requirements** such as speed, usability and reliability.
- **Untestable words** like fast and user-friendly.
- **Requirements from managers only**, never from users.
- **No priorities**, so everything is equally urgent.
- **Features with no trace** to any objective.
- **Declaring success at go-live** without evaluating the outcome.

## Questions to ask before you specify

- What problem are we solving, and how will we know it is solved?
- Who will use, operate and maintain the solution, and have we watched them work?
- Which requirements describe how well, not just what?
- Could we write a test for every requirement?
- Which requirements are musts, and which can wait?
- How will we judge a requested change?
- When and how will we measure whether the solution delivered its value?

## Bringing it together

Clear requirements are among the cheapest forms of project insurance. Start from the need and the gap between current and future state, elicit requirements from the people who will live with the solution, and cover business, stakeholder, functional, non-functional and transition requirements. Write each one so it can be tested, separate it from design and prioritise it against the business objectives. Trace every requirement from objective to test, control changes through impact analysis, verify the solution against the requirements and then evaluate whether it actually delivered the value intended. Projects run this way still change, but every change is judged against what the project is for.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® project management study material on business analysis domains, needs assessment, requirements traceability and solution evaluation, and requirements management plans. The worked example is illustrative. This article is general information.*
