---
title: "Building a work breakdown structure: deliverables first, product descriptions and the plan that follows"
description: "A work breakdown structure turns a goal into defined, ownable pieces. How to decompose by deliverables, apply the 100% rule, describe products, map their flow and build the plan from it."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - operations
author: "KEVOS"
featured: false
draft: false
---

A manufacturer approves a project to install a robotic welding cell. The project manager opens a scheduling tool and starts typing tasks: order robot, prepare floor, install, train operators, start production. Within an hour there is a tidy Gantt chart. Three months later, the robot is installed and nobody can use it, because the welding fixtures were never designed, the part programs were assumed to come from the supplier, the electrical compliance certificate was not arranged and the plant risk assessment was never updated. None of these items was on the chart, because the chart listed activities people thought of, not the things the project had to produce.

A **work breakdown structure (WBS)** prevents this. It divides the total scope of a project into a hierarchy of smaller, defined pieces, each of which can be described, estimated, assigned and checked. Done well, it is the foundation for almost everything else in project planning: the schedule, the budget, responsibilities, risks, procurement and progress measurement all hang from it. Done badly, or skipped, it lets important work disappear until it is late and expensive.

This article explains what a WBS is, how to build one by starting from deliverables rather than activities, the rules that keep it complete, how product descriptions and product flow diagrams strengthen it, how to decide when to stop breaking work down, and how the WBS connects to the rest of the plan. It is general information for project managers, engineers and owners running projects of any size.

## What a work breakdown structure is

A WBS is a hierarchical decomposition of the total work of a project into progressively smaller components. At the top is the project's final product or outcome. Below it are the major deliverables. Below those are smaller deliverables and, eventually, **work packages**: the lowest level at which work is planned, estimated, assigned to an owner and controlled.

A WBS can be shown as a tree diagram, an indented list or a table. The format matters less than three properties:

- **Each level decomposes the level above.** Every element traces upward to a higher-level deliverable.
- **It covers all of the work, and only the work, in scope.** This is often called the **100% rule**: the children of any element add up to 100% of that element's scope, no more and no less.
- **It is organised around outcomes**, the things the project must produce, rather than around departments or a list of activities.

## Start from deliverables, not activities

The most common mistake is to build the WBS as a list of activities: design, buy, install, test, train. Activity lists feel natural, but they hide gaps. A team can report that "design" is 80% complete without anyone knowing which designs exist, and work that nobody thought of doing simply never appears.

Starting from **deliverables**, also called products or outputs, reverses that. First ask what must exist, and be accepted, when the project is finished. Then ask what each of those things is made of. Only once the products are clear do you work out the activities needed to create, review and approve each one.

A useful test: deliverables are nouns, activities are verbs. "Approved fixture design" is a deliverable; "designing fixtures" is an activity. If an activity cannot be traced to a deliverable, question whether it is needed. If a deliverable has no activity producing it, it will not appear on its own.

Remember that projects produce **management products** as well as specialist ones: the business case, plans, risk register, approvals, test reports, training records, compliance certificates and handover documents. These are often the items that go missing.

## A three-step method

1. **Define the final product.** Write a clear statement of what the project will deliver, its purpose, its main components and how it will be accepted. "New welding capability" is vague; "a robotic welding cell producing the bracket family to drawing, at a stated rate, with trained operators and approved procedures" is specific.
2. **Identify the major deliverables.** Break the final product into the large components that together make it up. These become the first level of the WBS. Include project management and handover as deliverables in their own right.
3. **Decompose each deliverable** until the pieces are small and clear enough to be described, estimated, assigned and checked.

Number each element in a consistent scheme, such as 1, 1.1, 1.1.1, so it can be referenced in schedules, budgets and reports.

## When to stop decomposing

Break an element down further when:

- **It contains more than one type of work**, such as design and fabrication, that different people or suppliers will do.
- **Cost or duration cannot be estimated** with reasonable confidence at the current level.
- **More than one person or team** would be responsible for it.
- **Progress could not be measured** objectively, because there is no clear point at which it is finished.
- **The risk is high enough** to warrant closer control.

Stop when each work package has a single accountable owner, a clear finish, an estimate people trust and acceptance criteria. Going much further usually creates administration rather than control. Detail can also be uneven: near-term and risky parts of the project can be broken down further than later, routine parts. The [how finely to break down the work](/insights/sizing-work-packages-to-find-problems-in-time/) article examines how the size of work packages determines how quickly problems surface.

A useful rule is that one person may own several work packages, but no work package should have more than one owner. Shared ownership usually means no ownership.

## Describe the products

A WBS lists the pieces; a **product description** defines what each important piece must be. For deliverables that matter, write a short description covering:

- **Purpose**: why the product is needed.
- **Composition**: what it consists of.
- **Derivation**: what it is based on or developed from, such as a specification or an earlier product.
- **Quality criteria**: what it must achieve to be accepted, and how that will be checked.
- **Who produces it, who reviews it and who approves it.**

Product descriptions settle the definition of "done" before work begins. They also make reviews quicker, because reviewers check against agreed criteria rather than personal preference.

## Map how the products flow

The WBS shows what is in scope, but not the order in which things can be produced. A **product flow diagram** arranges the products in the sequence in which they depend on each other, including inputs from outside the project, such as a supplier's drawings or a council approval.

Drawing the flow is one of the best ways to find missing products. Look for:

- **Products with no predecessor**: what do they actually depend on?
- **Products with no successor**: who uses them, and are they needed?
- **External inputs with no named owner**: an "approval" with nobody responsible for obtaining it is not a plan.

The flow then drives the schedule. Activities for each product are linked according to the product dependencies, which gives the schedule logic a sound basis instead of guesses.

## The WBS dictionary

For larger projects, a **WBS dictionary** records, for each work package: its number and name, a description of the work and deliverables, the owner, acceptance criteria, estimated cost and duration, key assumptions, dependencies and any related risks. It is the reference that stops scope arguments later, because it records what was and was not included in each package.

## From WBS to the rest of the plan

The WBS connects to almost every other planning element:

| Plan element | How it uses the WBS |
|---|---|
| **Schedule** | Activities are derived from work packages and linked using product dependencies |
| **Budget** | Costs are estimated per work package and rolled up the hierarchy |
| **Responsibility** | Each work package has one accountable owner; a responsibility matrix maps who does, approves and is consulted |
| **Procurement** | Packages delivered by suppliers become the basis of contracts and purchase scopes |
| **Risk** | Risks are identified against specific packages, and contingency is allocated where uncertainty sits |
| **Progress** | Progress is measured by completed and accepted deliverables, not effort spent |
| **Change control** | Proposed changes are assessed by which packages they add, remove or alter |

Two related structures are sometimes used alongside the WBS: an **organisational breakdown structure**, showing who is responsible, and a **resource breakdown structure**, grouping the people, equipment and materials needed. Mapping work packages against them makes resource demands and responsibilities visible.

## Plan in levels and stages

A whole project rarely needs to be planned in full detail on day one. A practical approach uses levels of plan:

- **A project plan** shows the major products, stages, milestones, costs and resources, in enough detail to judge whether the project is worth doing.
- **A stage plan** covers the next stage in detail, because near-term information is more reliable.
- **Team plans**, where useful, organise the work within individual work packages.

Stage boundaries work best at points where a real decision is made, such as approving a design, committing to a contract or authorising installation. The WBS for later stages can stay at a higher level until the stage approaches, then be broken down further.

## Use the WBS to control scope

Because the WBS defines the scope, it also controls changes to it. When someone proposes additional work, ask which deliverables it adds or changes, and update the WBS, estimates and schedule through change control. Work that appears in the schedule but not in the WBS, or deliverables delivered without anyone approving their addition, are early signs of scope creep.

## A worked example

This is an illustrative example. A 50-person fabrication business is installing a robotic welding cell to produce a family of steel brackets for a key customer. The project manager builds the WBS from deliverables.

**Final product.** A robotic welding cell producing the bracket family to drawing, at the target rate, operated by trained staff under approved procedures, with compliance documentation complete.

**Level 1 deliverables.**

1. Project management products: business case, plans, risk register, reports.
2. Cell specification and layout.
3. Procured equipment: robot and controller, positioner, guarding and interlocks, fume extraction.
4. Prepared site: floor, power, compressed air, shielding gas.
5. Installed and commissioned cell.
6. Production capability: welding fixtures, robot programs, qualified welding procedures, first-article inspection.
7. People capability: trained operators and programmers, safe work procedures, updated plant risk assessment.
8. Handover products: operating and maintenance documentation, electrical compliance certificate, acceptance report.

**Product descriptions.** For the qualified welding procedures, the description states the purpose, the bracket family covered, that procedures must be qualified to the applicable welding standard, the tests required and who approves them. For the welding fixtures, it states the locating and clamping requirements and the acceptance check: ten consecutive brackets within drawing tolerance.

**Product flow.** Drawing the flow reveals three gaps in the original task list. Robot programs cannot be finished until the fixtures exist, so fixtures move earlier. The electrical compliance certificate depends on an electrician who was not engaged, so that becomes an external input with a named owner and date. The updated plant risk assessment had not been planned at all, yet the cell cannot be used without it.

**Work packages.** Each level 1 deliverable is broken down until each package has one owner, a clear finish and an estimate. Fixture design and manufacture becomes two packages, because different people do the design and the fabrication. The robot supplier's scope is defined from packages 3 and 5, and the contract specifies which programming support is included.

**The result.** The schedule is built from the product flow, with fixtures on the critical path. Progress is reported by accepted products. When the customer later adds a new bracket variant, the change is assessed against packages 6 and 7, priced and approved before work starts. The cell starts production with procedures, training and compliance documents complete.

## Applying this in an Australian business

- **Start every project plan with the final product** and its acceptance criteria.
- **Decompose by deliverables**, including management and compliance products.
- **Apply the 100% rule** at every level.
- **Give each work package one owner**, a clear finish and an estimate.
- **Write product descriptions** for important deliverables.
- **Draw the product flow** to find missing products and external inputs.
- **Build the schedule, budget and contracts** from the WBS.
- **Measure progress** by accepted deliverables.
- **Route scope changes** through the WBS.
- **Remember regulatory deliverables**, such as electrical certification, risk assessments and approvals.

## Where work breakdown structures go wrong

- **Listing activities** instead of deliverables.
- **Forgetting management and compliance products.**
- **Organising by department** rather than outcome.
- **Shared ownership** of work packages.
- **Decomposing too far**, creating administration rather than control.
- **Treating the WBS as a one-off** rather than the scope baseline.
- **External inputs** with no named owner.

## Questions to ask before the schedule is built

- What exactly will exist, and be accepted, when this project is finished?
- Does our WBS include every deliverable, including approvals, certificates and training?
- Does each work package have one owner and a clear finish?
- Which deliverables depend on people or organisations outside the project?
- How will we know each product is good enough?
- What would a change to scope do to the WBS?

## Bringing it together

A work breakdown structure turns a project's goal into a complete set of defined, ownable pieces. Start from the final product and its acceptance criteria, decompose by deliverables rather than activities, and apply the 100% rule so that nothing is missing and nothing extra creeps in. Describe the important products, map how they flow, and give every work package one owner, an estimate and a clear finish. Then build the schedule, budget, contracts, risk register and progress measures from it, and route every scope change through it. The extra hours spent on the WBS at the start are usually the cheapest hours in the project.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS project management handbooks on work breakdown structures, product-based planning and stage plans, and PRINCE2-style product-based planning and work packages. The worked example is illustrative. This article is general information.*
