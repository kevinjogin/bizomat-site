---
title: "Which dependencies in your schedule are real? Testing the logic behind the dates"
description: "A schedule looks calculated, but its length rests on claims that one task must wait for another. How to test what enforces each link, buy out resource links and find time honestly."
publishDate: 2026-10-04
category: "Business"
tags:
  - operations
  - systems
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

A maintenance shutdown is planned at 34 days. The customer's window is 30. The schedule has been built, the software has calculated the critical path, and the number is what it is. Then someone experienced spends an afternoon with the sequence, points at three links and asks what makes each one true. Four days appear. One of the links was a habit.

That afternoon is either the most valuable work anyone did on the job, or the moment the plan stopped being a forecast. Which one depends on a question nobody in the room is likely to ask: would those days have been found if the deadline had not forced the search?

Schedules arrive looking computed. Software calculates start and finish dates, float, the critical path and resource loading, and presents dates to the day. But none of that is where the duration comes from. Every calculated date is a consequence of statements someone entered: this task cannot start until that one finishes. This article explains how to test those statements, distinguish the dependencies that are real from those that are habits, price the ones that can be bought out, and do it on a planned date rather than under pressure.

## Key terms

- A **dependency** is a link stating that one task cannot start, or finish, until another has started or finished.
- The **critical path** is the longest chain of dependent tasks through a project. It sets the shortest possible duration.
- **Float** is how much a task can slip without delaying the project.

Scheduling software can calculate all of these. It cannot decide whether a dependency is real. That judgement is made by people, often early, often by someone other than the person who will eventually be held to the date, and rarely revisited, because once inside the model it looks like output.

## What enforces a dependency

The usual way of describing dependencies, such as finish-to-start or start-to-start, describes the shape of a link but says nothing about whether it exists. A more useful question is what enforces it. There are four common answers:

| Type | What enforces it | Example | Can it move? |
|---|---|---|---|
| Physical | The properties of the work | Concrete must cure before loading; a vessel must cool before entry | No |
| Contractual or regulatory | A contract, permit or inspection | A permit before work starts; an inspection before a ceiling is closed | Sometimes, by starting the process earlier |
| Resource | The same people or equipment do both tasks | One crew does rough-in in both areas | Yes, with money |
| Convention | Habit: it was done that way last time | Joinery always goes in after all painting | Yes, by examining it |

Only the first two are properties of the work. The third is a property of how the business allocates its people and equipment. The fourth is nobody's decision in particular, and it looks identical to the other three inside a schedule.

```figure
type: decision
title: What enforces this link?
question: Why can this task not start until the other is done?
caption: Only physical and contractual links are properties of the work; the others are choices.
- Physical | Keep it | the properties of the work
- Contractual or regulatory | Start the process earlier
- Resource | Break it with money | a second crew or machine
- *Convention | Examine it | it may just be habit
```

## Compression is often correction

Schedule compression is usually taught as a set of techniques: add resources, run tasks in parallel, work extra shifts. In practice, one of the largest sources of time is discovering that a dependency was never real. Nothing was sped up. The model was corrected.

That is good news, with a catch. Removing a false dependency is the same act whether it is done as analysis or as accommodation, and the difference is invisible in the result. A dependency tested before anyone knew the deadline is a finding. The same dependency removed on the afternoon the deadline became unavoidable is a hypothesis that happens to be convenient, and it will be tested for the first time on site.

## Treat the schedule as a set of claims

A helpful shift is to treat the schedule as a register of claims, each with an owner. For every link on the longest path, three questions are enough:

- **Who asserted it?**
- **What enforces it?**
- **What happens if it is wrong?**

The third question matters most. A physical dependency that is wrong can produce a safety incident. A convention that is wrong produces a slightly longer job. Those errors have nothing in common, and a schedule that does not distinguish them treats them the same.

```figure
type: checklist
title: Treat each dependency as a claim
caption: A wrong physical dependency can cause a failure; a wrong convention only costs time, quietly.
- ? Who asserted it?
- ? What enforces it?
- ? What happens if it is wrong?
```

## Estimates are claims too

Task durations carry the same issue. The three-point estimating method, often written as (optimistic + 4 × most likely + pessimistic) ÷ 6, looks like arithmetic. But its inputs are claims about how long similar work has taken. Few businesses keep records of comparable jobs, so the inputs usually come from someone's memory in a meeting. The formula is honest. The inputs may be opinion presented as data. Where possible, record actual durations on completed jobs, so future estimates rest on evidence.

## Unnecessary dependencies hide in plain sight

An unnecessary dependency rarely causes a visible failure. It produces a slower baseline that everyone then meets. Consider a fit-out contractor whose standard schedule says painting must be complete before joinery installation. In fact, joinery only needs painting finished on the walls where it attaches, perhaps a third of the space. Held as a blanket rule, the dependency adds days to every job. Because every job finishes on the schedule it set for itself, no review ever questions it.

## Five steps

Apply these before a schedule is fixed, and again at any major replan:

1. **Extract the longest path.** Usually eight to twenty links. Tasks off this path are not setting the duration.
2. **For each link, name what enforces it**: physical, contractual or regulatory, resource, or convention. Ask the person who does the work, not just the person who built the schedule. If nobody can answer, the link is probably a convention.
3. **Record who asserted it and when.** This turns a dependency into a decision by a named person rather than a property of a diagram.
4. **Price the resource dependencies.** For each, estimate what it would cost to break, such as a second crew, a second machine or extra equipment hire, and how many days that would save. These are options the business can choose to buy.
5. **Re-test on a fixed date, not on a bad day.** Schedule the review in advance, such as at the end of planning or at a project gate. A challenge made on a planned date is analysis. The same challenge made in the week a deadline becomes unavoidable is something else.

```figure
type: steps
title: Five steps to test a schedule's logic
caption: Record dependencies that survive a challenge as tested, with the date.
- Extract the longest path | usually 8 to 20 links
- Name what enforces each link
- Record who asserted it
- Price resource links | cost to break each one
- *Re-test on a fixed date
```

Record dependencies that survive a challenge as tested, with the date. Otherwise the same link is re-argued on every job by people who do not know it was already examined.

## Contractual links can often move earlier

Contractual and regulatory dependencies are real, but they often have flexibility in timing. A permit, inspection, landlord approval or customer sign-off may be on the critical path simply because the request is made late. Ask when each approval could be requested, what information it needs and how long it typically takes. Starting these processes earlier is often the cheapest way to shorten a schedule without touching the work itself.

## Build a dependency library

Businesses that do similar work repeatedly, such as fit-outs, installations, machine builds or maintenance shutdowns, use many of the same dependencies on every job. A simple library records each common dependency, what enforces it, who tested it, when and under what conditions. For example: "joinery after painting: needed only on walls where joinery attaches; tested on three fit-outs in 2026". New schedules then start from tested logic rather than copied habit.

The library also captures exceptions. A dependency that is a convention in one setting may be physical in another, for example where a particular finish needs a longer curing time or a site has restricted access. Record the conditions so the library does not become a new source of untested habits.

## Supplier and subcontractor links

Many critical-path dependencies involve suppliers and subcontractors: equipment that must arrive before installation, a subcontractor who must finish before the next trade starts, documentation needed before inspection. Test these in the same way. Is the link physical, or could part of the work proceed with partial delivery? Is the subcontractor's sequence real, or simply their habit? Could critical documents be supplied earlier than the goods? Conversations with suppliers during planning often reveal flexibility that never appears in a schedule copied from the last job.

## A worked example

This is an illustration. A small commercial fit-out contractor is quoting a shop fit-out. The client wants the work completed in eight weeks. The contractor's standard schedule says ten. The quoting manager reviews the longest path with the trade leads during the quoting stage, as a planned step, before committing to a date.

Of the twelve links on the longest path, six are examined closely:

- **Joinery after all painting**: convention. Joinery needs painting finished only on the walls where it attaches, about 30% of the walls. Painting those first saves about four days.
- **Flooring after the ceiling grid**: physical, because of dust and dropped materials. Kept.
- **Electrical fit-off after joinery**: physical only for outlets mounted in joinery. Other fit-off can proceed earlier. Saves about two days, though this link is not on the final critical path.
- **Fire inspection before the ceiling is closed**: regulatory. Kept, but the inspection is booked as early as allowed.
- **One electrical crew does rough-in in both zones**: resource. A second crew for one week would cost about $6,500 and save about five days.
- **Shopfront glazing after the landlord's signage approval**: contractual. Requesting approval three weeks earlier removes about four days of waiting.

After these changes, the original longest path shortens by more than two weeks, and a different chain of tasks becomes the longest path, at about eight weeks. The contractor quotes eight weeks, including the cost of the second crew, and records the tested dependencies in a simple library so future quotes start from the corrected logic rather than the old habits.

```figure
type: bars
title: Days found by questioning four links
unit: days
caption: Ten weeks became eight, including $6,500 for a second electrical crew; the tested links went into a library.
- Joinery only after painting on its walls | 4 | convention
- Electrical fit-off before joinery where possible | 2
- *Second electrical crew for one week | 5 | about $6,500
- Landlord signage approval sought earlier | 4 | contractual
```

## How this applies to a small Australian business

Small businesses often reuse the schedule from the last job, which carries its assumptions forward. Practical steps:

- **List the longest path** on your next significant job.
- **Ask your trade leads or team** what enforces each link.
- **Separate physical and regulatory links** from resource links and habits.
- **Price the cost of breaking resource links.**
- **Start permits, inspections and approvals early**, after checking requirements with the relevant council, certifier or authority.
- **Keep a library of tested dependencies** for repeat work.
- **Record actual durations** so future estimates rest on evidence.
- **Do the review at quoting or planning**, not when the deadline is already at risk.

The articles on [sizing work packages](/reados/collections/project-estimates-schedules-and-costs/sizing-work-packages-to-find-problems-in-time/) and [mapping dependencies across your projects](/reados/collections/project-estimates-schedules-and-costs/mapping-dependencies-across-your-projects/) cover related planning.

## Signals worth watching

- Time found late, repeatedly, just before deadlines.
- Identical schedules across jobs of different scope or site.
- Planners unable to say where a link came from.
- Compression achieved at no cost, which usually means the model was corrected.
- Old sequences surviving new methods or equipment.
- Estimates given as single numbers with no range.

## Common mistakes

- **Treating the schedule as a calculation** rather than a set of claims.
- **Copying the last job's logic** without testing it.
- **Removing dependencies under pressure** without checking what enforces them.
- **Ignoring resource links** that could be bought out cheaply.
- **Requesting approvals late.**
- **Re-arguing the same links** on every job without recording results.
- **Removing physical or safety-related dependencies** to meet a date.

## Frequently asked questions

**Is this only for big projects?** No. Any job with a sequence of trades or steps has dependencies. A short review of the longest path can be done in an hour for a small job.

**Who should test the dependencies?** The people who do the work, together with the person who planned the schedule. Trades and operators usually know which links are real.

**What if removing a dependency adds risk?** Then it is not purely a convention. Record the risk, decide whether the time saved is worth it, and put controls in place if you proceed. Never remove a physical or safety-related dependency to meet a date.

**What if the client insists on a date our tested logic cannot meet?** Show the longest path and what enforces each link, and offer options: buying out resource links, starting approvals earlier or reducing scope. A client who sees the logic can make an informed choice, which is better than a date nobody believes.

**How often should we revisit tested dependencies?** When methods, equipment, regulations or team structures change. A dependency that was real with old equipment may not be with new.

## Questions to ask

- Who asserted the links that set our end date, and what enforces them?
- When we last found time late in a job, did we find an error or accommodate a target?
- Which resource dependencies could we buy out, and at what cost per day saved?
- Which approvals sit on our critical path only because they were requested late?
- Do we keep a record of dependencies we have already tested?
- If a competitor quoted the same job, what would they question that we did not?

## Bringing it together

The most important numbers in a schedule are not the ones the software calculates. They are the dependencies someone entered before anyone was paying attention. Some describe the physical world and cannot move. Some describe contracts and regulations and can often start earlier. Some describe how people and equipment are allocated and can be bought out. And some describe only the order things were done last time. Tell them apart by asking what enforces each link, record who asserted it, price the resource links, and do it on a planned date rather than the day you need the answer.

---

*Source: BIZOMAT notes. Examples and figures in this article are illustrations.*
