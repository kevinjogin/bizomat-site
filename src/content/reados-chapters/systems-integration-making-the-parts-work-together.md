---
title: "Systems integration: who makes the parts work together?"
description: "Projects split work into packages, but someone must put the system back together. How interface owners, configuration control and staged testing turn good parts into a working whole."
publishDate: 2026-10-04
category: "Business"
tags:
  - systems
  - operations
  - product-development
author: "KEVOS®"
featured: false
draft: false
---

Any project bigger than a single task gets divided up so it can be managed. A new facility is split into building, services and equipment packages. A product is split into mechanical, electrical and software subsystems. An IT upgrade is split between the accounting system, the website, the warehouse software and the payment provider. Each piece goes to a team or supplier with a defined scope and its own measures of success.

Dividing the work is necessary, but it creates a second job: putting the pieces back together so they work as one system. That job is **systems integration**. It covers the points where separately delivered parts must connect, the management of changes that affect more than one part, and the testing that proves the whole works, not just each piece.

Projects fail at the interfaces surprisingly often. Every supplier can deliver exactly what its contract requires while the system as a whole does not work, because nobody owned the spaces between the contracts. This article explains what systems integration involves, why it must start early, and how even a small business can make sure someone owns the whole.

## Local success is not system success

Consider some familiar situations:

- A conveyor supplier and a labelling machine supplier each pass their own acceptance tests, but the line cannot run at speed because the machines' controls do not communicate.
- A new machine meets its specification but cannot be maintained because the layout leaves no access space.
- A new online shop works, and the accounting software works, but orders have to be re-keyed because the two do not exchange data properly.
- A software module passes its tests but fails when the whole system runs under real load.

In each case, every component met its local requirements. The failure sat at an interface. **Local acceptance is not system acceptance.**

Research and practice on large, complex projects, such as a 2019 report by Andrew Davies for the Association for Project Management, treats systems integration, interface management, change control and configuration management as core capabilities rather than technical afterthoughts. The same principles apply, at smaller scale, to almost any project with several parts and several parties.

## Four common misunderstandings

1. **"Clear package boundaries mean clear accountability."** Boundaries create accountability for what is inside each package. The boundaries themselves still need an owner.
2. **"Integration happens at the end."** By the end, design decisions are fixed, suppliers have moved on and changes are expensive. Components that each meet their specifications rarely work perfectly the first time they are combined, so time for integration must be planned from the start.
3. **"Interface management is a technical register."** Interfaces are also commercial and organisational. Two suppliers may disagree about whose scope covers a connection. A change by one party may create costs for another.
4. **"The biggest supplier can own the architecture."** If the most powerful supplier becomes the de facto designer of the whole system without explicit agreement, knowledge of the system fragments across contracts and your interests may not come first.

## Systems integration is managing consequences across boundaries

The essential question of integration is: **if we change this, what else becomes true?**

- A change to a machine's base dimensions may affect its foundations, guarding, services and maintenance access.
- A change to a data field may affect reports, interfaces, testing and data migration.
- A schedule change in one package may affect the commissioning sequence, temporary arrangements and when operators are trained.
- A substituted component may affect performance, compliance evidence and spare parts.

The person or team doing integration asks this question for every significant change, before it is approved.

## Start with an architecture

Integration begins before detailed delivery. The project needs a clear picture of the system: the major parts, how they connect, which requirements cross boundaries, and how the parts together deliver the result. This need not predict every detail. It needs enough definition to stop teams making incompatible assumptions.

A useful integration plan identifies:

- **Who owns the overall system requirement.**
- **The major technical and operational interfaces**, such as mechanical, electrical, data, physical layout and handovers between people.
- **Requirements that cross component boundaries**, such as overall throughput or response time.
- **What configuration must be controlled**, such as drawings, software versions and settings.
- **How changes will be assessed** for consequences beyond their own package.
- **When larger and larger groupings will be tested together.**
- **Who resolves disputes about interfaces.**

Include the operator, the people who will run and maintain the result. Early involvement of users improves the chances that the final system fits how work is actually done. Technically optimised systems that are awkward to operate are a common integration failure.

## Configuration control is the project's memory

**Configuration management** means keeping track of which version of each design, document, setting and software build is current and authorised. It is often treated as document administration, but on a complex project it is closer to the project's memory of what has actually been agreed.

Leaders should be able to answer:

- Which version of each design and requirement is current?
- Why was each change made, and which requirements does it affect?
- Which interfaces must be reassessed after a change?
- What has already been built, bought or tested against an earlier version?
- Do operating and maintenance documents match what is installed?

Without this discipline, different teams end up working on different versions of reality, and the cost appears during testing or after handover.

## Give the integrator authority, but not every decision

Integration can be done by the client, by a prime contractor or by a partner, depending on the project. What matters is that the responsibility is explicit and the integrator has enough technical knowledge to challenge component decisions and enough authority to resolve issues that cross packages.

Centralising every decision with the integrator creates a different problem: slow approvals and loss of specialist ownership. A better approach defines **interface decision rights**: teams decide within their own boundaries, and decisions that affect shared interfaces, overall performance or configuration go to the integrator.

## Test progressively

Do not wait until every package is finished to find out whether they work together. Test integration in stages:

1. **Component tests**: each part meets its own requirements.
2. **Interface tests**: pairs or small groups of parts work together, for example two machines exchanging signals.
3. **Subsystem tests**: larger groups work together, such as a whole packing line.
4. **System tests**: the whole system works under realistic conditions, including peak loads, changeovers and failures.
5. **Operational tests**: real users run the system as part of normal work.

Mock-ups, simulations, test environments and staged demonstrations can bring integration learning forward, when problems are cheaper to fix.

## Keep an interface register

An **interface register** is a simple list of every point where two parts of the system must work together, with an owner and a status for each. It can live in a spreadsheet. For each interface, record:

| Field | What to record |
|---|---|
| Interface | The two parts that connect, such as "filler to capper conveyor" |
| Type | Mechanical, electrical, data, physical space, process handover, people |
| Requirement | What must be true, such as speed, signal, dimension, data format, timing |
| Owner | The party responsible for making the interface work |
| Contributors | Other parties whose work affects it |
| Evidence | How it will be proven, such as a drawing check, interface test or trial run |
| Status | Open, agreed, tested, closed |

The register earns its keep in three ways. It forces the team to find interfaces early, while they can still be designed rather than patched. It makes ownership visible, so disputes about scope surface before commissioning. And it gives the integrator a checklist for assessing changes: when something changes, look down the register for every interface that part touches.

## Put integration into contracts

Many integration problems are created when contracts are written. If each purchase order describes only a supplier's own equipment, each supplier can reasonably say the interfaces are someone else's problem. Practical ways to avoid this:

- **Describe interfaces in each contract**: the signals, dimensions, speeds, data and services the supplier must provide to, or accept from, others.
- **Require cooperation**: suppliers attend interface meetings, share drawings and support integration testing.
- **Define system acceptance**, not just equipment acceptance, and say which tests must pass before final payment.
- **Hold back part of the payment** until integrated performance is demonstrated, where that is commercially reasonable.
- **Set out how interface changes are priced and approved.**

Contract terms are a legal matter, so take advice on the wording. The point here is commercial: if integration is not written into contracts, it is likely to fall to you, at your cost.

## A worked example

This is an illustration. A small manufacturer of packaged sauces is installing a new filling and packing line. It buys the filler from one supplier, the capping machine from a second, the labeller and checkweigher from a third, and asks a local electrical contractor to wire everything. A builder modifies the room.

In the first plan, each supplier is responsible only for its own machine. Nobody owns the line. At commissioning, problems appear: the filler and capper run at different speeds with no buffer between them, the checkweigher rejects bottles but the reject bin is not accessible, the labeller's controller cannot receive batch codes from the filler's system, and the wash-down layout puts electrical panels in the spray zone. Each supplier says its machine meets its specification. The owner spends weeks and significant money resolving disputes.

In a better plan, the owner appoints a systems integrator for the line, in this case an independent engineer engaged for the project, and gives the engineer clear responsibilities:

- **An architecture**: a line layout, throughput requirement and interface list covering speeds, buffers, signals, batch data, rejects, services, hygiene zones and maintenance access.
- **Interface owners**: for each interface, a named supplier responsible, with the integrator resolving disputes.
- **Configuration control**: one current set of layout drawings and settings, with every change checked for its effects on other machines.
- **Progressive testing**: factory acceptance tests for each machine, then pairwise interface tests on site, then a full line test at rated speed with all products.
- **Operator involvement**: the production supervisor reviews the layout for cleaning, changeovers and maintenance before it is finalised.

Commissioning still finds problems, as it always does, but they are found earlier, owned by someone and fixed within days. The integrator's fees are a small fraction of the cost of the disputes in the first plan.

## How this applies to a small Australian business

Small businesses are often integrators without realising it. When you buy equipment from several suppliers, connect new software to existing systems or coordinate trades on a fit-out, someone has to own the whole. Practical steps:

- **Decide who integrates**: yourself, a capable staff member, a prime contractor or an independent adviser.
- **List the interfaces** before you buy: physical, electrical, data, layout, people and handovers.
- **Assign an owner** to each interface in contracts or purchase orders.
- **Keep one current set** of drawings, settings and versions.
- **Assess changes** for their effects beyond the package that raised them.
- **Plan integration testing** from the start, with time and budget for problems.
- **Involve the people who will operate and maintain** the result.

The articles on [design first or design and build](/reados/collections/procurement-and-tendering/design-first-or-design-and-build/) and [planning the path from supplier to installation](/reados/collections/suppliers-contractors-and-government-work/planning-the-path-from-supplier-to-installation/) cover related decisions.

## Signals that integration is at risk

- Interface problems are found during testing rather than design.
- Suppliers argue that problems sit outside their scope.
- Each package reports green while system milestones slip.
- Changes are approved without assessing their effects on other packages.
- Teams work from different drawings, versions or definitions.
- Operators are involved only at the end.
- Integration testing is squeezed to recover earlier delays.
- Nobody can name the person responsible for the system as a whole.

## Common mistakes

- **Leaving nobody responsible** for the spaces between contracts.
- **Planning integration for the end** of the project.
- **Treating interfaces as purely technical** and ignoring commercial and organisational boundaries.
- **Letting a supplier define the architecture by default.**
- **Weak version control**, so teams work from different information.
- **Skipping interface and subsystem tests** and going straight to the full system.
- **Ignoring operations and maintenance** until handover.

## Frequently asked questions

**Is systems integration only for large projects?** No. Any project with several parts from different suppliers, or new systems connecting to existing ones, needs someone to own the whole. The effort scales with complexity.

**Should we pay a supplier to be the integrator?** Sometimes. A prime contractor or system integrator can take responsibility for the whole, usually at a higher price. Make sure the contract clearly states that responsibility and the acceptance tests for the integrated system.

**What is the most important first step?** List the interfaces and give each one an owner. Many integration failures come from interfaces nobody was responsible for.

## Questions to ask

- Who knows more about the whole system than any individual supplier?
- Which interfaces carry the greatest safety, performance or schedule risk?
- Where do our contract boundaries conflict with how the system actually works?
- How does a change in one package get assessed for its effects elsewhere?
- Are we testing integration progressively, or saving it for the end?
- Have the people who will operate and maintain the system shaped its design?
- What integration knowledge should we keep after the project ends?

## Bringing it together

Dividing work makes projects manageable. Integration makes the divided work useful. A project succeeds not when every supplier has delivered its package, but when the combined system works reliably in real operation. That needs someone who owns the whole: an architecture that shows how the parts combine, owners for every important interface, disciplined configuration control, change assessment that looks beyond each package, progressive testing and early involvement of operators. Without explicit integration, complexity does not disappear. It moves into the spaces between teams, where it is most expensive to find.

---

*Source: KEVOS® notes, drawing on Andrew Davies, report on systems integration in complex projects for the Association for Project Management (2019). Examples in this article are illustrations.*
