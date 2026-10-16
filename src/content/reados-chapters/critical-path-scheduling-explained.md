---
title: "Critical path scheduling explained: building the network, calculating float and keeping the schedule honest"
description: "A schedule models how work depends on other work. How to sequence activities, run the forward and backward pass, read total and free float, and keep the critical path credible."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - operations
author: "KEVOS®"
featured: false
draft: false
---

Most project schedules start life as a bar chart: a list of tasks with start and finish dates drawn across a calendar. A bar chart is easy to read, but on its own it says nothing about why the dates are what they are. If one task slips by a week, does the project finish a week late, or not at all? Which tasks can wait, and which cannot? A bar chart drawn by hand cannot answer, because the logic that connects the tasks lives only in the planner's head.

**Critical path scheduling** makes that logic explicit. Each activity is linked to the activities it depends on, durations are estimated, and simple arithmetic then calculates the earliest and latest dates for every activity, the finish date of the project and the chain of activities that determines it. That chain is the **critical path**: any delay to an activity on it delays the project, while activities off it have some room to move, called **float**.

This article explains how to build a schedule network, the four kinds of dependency, how the forward and backward passes work with a fully worked example, what total and free float mean, how calendars, lags and constraints affect the result, how to check a schedule's quality and how to keep it honest during delivery. It is general information for project managers, engineers and owners who build or rely on schedules.

## From work breakdown to activities

A schedule starts from the scope. Each work package in the work breakdown structure is broken into the **activities** needed to produce it: discrete pieces of work with a clear start and finish, a duration and, usually, an owner. Milestones, which have no duration, mark significant events such as approvals, deliveries and handovers.

For each activity, record its duration, the resources it needs and the calendar it follows. Durations should reflect the real working pattern: shifts, weekends, public holidays in the relevant state, planned leave, site access windows and any restrictions such as noise limits on working hours.

## The four kinds of dependency

Activities are linked by **dependencies** that state how one depends on another:

| Type | Meaning | Example |
|---|---|---|
| **Finish-to-start (FS)** | B cannot start until A finishes | The foundation must be finished before the machine is installed |
| **Start-to-start (SS)** | B cannot start until A starts | Cable laying can start once trenching has started |
| **Finish-to-finish (FF)** | B cannot finish until A finishes | Documentation cannot finish until testing finishes |
| **Start-to-finish (SF)** | B cannot finish until A starts | The old system cannot be switched off until the new one starts |

Finish-to-start is by far the most common and is the default in most scheduling software. A **lag** adds a delay to a dependency, such as concrete curing time between pouring a foundation and loading it. A **lead**, or negative lag, allows overlap.

Every dependency is a claim about how the work must be done. Some are physical, some are contractual, and some are habits. The [which dependencies in your schedule are real](/reados/collections/project-estimates-schedules-and-costs/testing-the-dependencies-in-your-schedule/) article explains how to test them.

## Draw the network

Modern scheduling uses the **precedence diagramming method**: each activity is a box, and arrows between the boxes show the dependencies. A good network has a single start and a single finish, and every activity except the first has at least one predecessor and every activity except the last has at least one successor. Activities with no successor, often called **open ends**, are a sign of missing logic: their delay would not be reflected anywhere.

## The forward pass: earliest dates

The **forward pass** works from the start of the project to the end, calculating for each activity:

- **Early start (ES)**: the earliest it can start, which is the latest early finish among its predecessors, plus any lag.
- **Early finish (EF)**: early start plus duration.

The latest early finish of all activities is the earliest the project can finish.

## The backward pass: latest dates

The **backward pass** works from the project finish back to the start, calculating for each activity:

- **Late finish (LF)**: the latest it can finish without delaying the project, which is the earliest late start among its successors, less any lag.
- **Late start (LS)**: late finish minus duration.

## Float

Two kinds of float follow:

- **Total float** is how much an activity can be delayed without delaying the project finish: late start minus early start.
- **Free float** is how much an activity can be delayed without delaying the early start of any successor.

Activities with zero total float form the **critical path**: the longest path through the network, which sets the project duration. Activities with small total float are **near-critical**; a modest delay will make them critical.

An important subtlety: total float usually belongs to a chain of activities, not to each activity separately. If two activities in sequence share nine days of float and the first uses all nine, the second has none left. The [what your schedule quietly decides](/reados/collections/project-estimates-schedules-and-costs/what-your-schedule-quietly-decides/) article explains why deciding who may use that float matters.

## A worked example

This is an illustrative example. A manufacturer is installing a new machine. The activities, durations in working days and dependencies are:

| Activity | Duration | Depends on |
|---|---|---|
| A: Prepare specification | 5 | Project start |
| B: Order and deliver machine | 30 | A |
| C: Design foundation | 6 | A |
| D: Build foundation | 8 | C |
| E: Upgrade electrical supply | 10 | A |
| F: Install machine | 4 | B; D, with a 7-day curing lag; E |
| G: Train operators | 3 | F |
| H: Commission and accept | 5 | F |

**Forward pass.** A runs from day 0 to day 5. B, C and E can each start at day 5: B finishes at day 35, C at day 11 and E at day 15. D starts when C finishes and runs from day 11 to day 19. F can start only when all its predecessors allow: B finishes at 35, D finishes at 19 plus 7 days of curing, which is 26, and E finishes at 15. The latest of these is 35, so F runs from day 35 to day 39. G and H both start at 39; G finishes at 42 and H at 44. The project's earliest finish is day 44.

**Backward pass.** Starting from day 44, H must finish by 44, so its late start is 39. G must finish by 44, so its late start is 41. F must finish before both G and H can start, so its late finish is the earlier of 41 and 39, which is 39, and its late start is 35. B must finish by 35, so its late start is 5. D must finish 7 days before F's late start, so its late finish is 28 and its late start is 20. C must finish by 20, so its late start is 14. E must finish by 35, so its late start is 25. A must finish before B, C and E can start at their latest, so its late finish is the earliest of 5, 14 and 25, which is 5.

| Activity | ES | EF | LS | LF | Total float | Free float |
|---|---|---|---|---|---|---|
| A | 0 | 5 | 0 | 5 | 0 | 0 |
| B | 5 | 35 | 5 | 35 | 0 | 0 |
| C | 5 | 11 | 14 | 20 | 9 | 0 |
| D | 11 | 19 | 20 | 28 | 9 | 9 |
| E | 5 | 15 | 25 | 35 | 20 | 20 |
| F | 35 | 39 | 35 | 39 | 0 | 0 |
| G | 39 | 42 | 41 | 44 | 2 | 2 |
| H | 39 | 44 | 39 | 44 | 0 | 0 |

**Reading the result.** The critical path is A, B, F, H: 5 + 30 + 4 + 5 = 44 days. Machine delivery dominates the project. The foundation chain, C and D, has 9 days of total float, shared between them: C has no free float, because any delay to C pushes D, but the chain as a whole can absorb up to 9 days. The electrical upgrade has 20 days of float, so it could be scheduled later to suit the electrician. Training has 2 days.

**Using it.** If the supplier warns that delivery will slip by five days, the project finish moves to day 49 unless something changes. The team can now ask useful questions. Could training start before commissioning finishes, using a start-to-start link? Could some commissioning preparation happen before installation? Is faster freight worth its cost? Meanwhile, nobody needs to rush the electrical work, which has float to spare. And because the foundation chain has only 9 days of float, a wet spell that delays curing is worth watching.

## Calendars, constraints and resources

Real schedules add complications that change the critical path:

- **Calendars**: different activities may follow different working patterns, such as a supplier working a different week or a site closed over Christmas. An activity on a five-day calendar takes longer in elapsed time than one on a seven-day calendar.
- **Date constraints**: fixed dates, such as "start no earlier than" or "must finish on", override the logic. Use them sparingly and only for genuine external dates. Hard constraints can hide the true critical path and create negative float when the logic says a date cannot be met.
- **Resources**: the logic may allow two activities to run at once, but if both need the same specialist, one must wait. **Resource levelling** shifts activities to respect resource limits, which can lengthen the project and change which activities are critical. The critical path then depends on both logic and resources.

## Check the schedule's quality

Before relying on a schedule, check it:

- **Every activity has a predecessor and a successor**, apart from the start and finish.
- **Few hard date constraints**, each with a documented reason.
- **Lags are justified**, rather than used to fudge timing.
- **Durations are reasonable**: very long activities hide detail and progress problems.
- **Activities reflect the scope**, traced to work packages.
- **Calendars reflect real working time**, including holidays.
- **The critical path makes sense** to the people doing the work.
- **Near-critical paths are known**, not just the single critical path.

A simple test is to delay a critical activity in the software and confirm that the finish date moves by the same amount. If it does not, the logic is broken somewhere.

## Gantt charts are views, not schedules

A **Gantt chart** shows activities as bars on a calendar. It is the best way to communicate a schedule, but it is a view of the network, not a substitute for it. A Gantt chart drawn without logic cannot recalculate when something changes. For small, simple projects, a **milestone chart** showing key dates may be all that stakeholders need, as long as the network behind it is sound.

## Keep the schedule honest during delivery

A schedule is useful only if it reflects reality. During delivery:

- **Set a status date** and update every active activity as of that date.
- **Record actual starts and finishes.**
- **Estimate remaining duration** from current knowledge, rather than simply assuming the original duration less elapsed time.
- **Mark activities on hold** with the reason, separating work that is waiting from work that is slow.
- **Recalculate** and look at what changed: the finish date, the critical path and the float on near-critical paths.
- **Keep the baseline**, the approved original, so that variance can be measured and lessons learned.
- **Diagnose before re-planning**: find the first late or blocked activity on the controlling path, classify the cause and re-estimate the remaining work.

Schedules give a single date, but every duration is uncertain. The [how confident is that finish date](/reados/collections/project-estimates-schedules-and-costs/how-confident-is-that-finish-date/) article explains three-point estimates and why parallel paths reduce the real chance of finishing on time.

## Applying this in an Australian business

- **Build schedules from the scope**, with activities traced to work packages.
- **Link every activity with logic**, not fixed dates.
- **Use realistic calendars**, including state public holidays and site restrictions.
- **Run the forward and backward pass**, or understand what the software is doing when it does.
- **Know the critical and near-critical paths.**
- **Treat float as belonging to chains**, and agree how it can be used.
- **Check schedule quality** before baselining.
- **Update with actuals and remaining durations** at a regular status date.
- **Keep the baseline** and diagnose delays before moving dates.

## Where schedules go wrong

- **Bar charts with no logic.**
- **Open ends and missing dependencies.**
- **Hard date constraints** masking the critical path.
- **Lags used as padding.**
- **Ignoring resource conflicts.**
- **Updating percent complete** without re-estimating remaining work.
- **Overwriting the baseline** whenever dates move.
- **Watching only the critical path** while a near-critical path quietly overtakes it.

## Questions to ask about any schedule

- What drives the finish date, and is that what the team expected?
- Which paths are within a few days of becoming critical?
- Which dates are fixed by constraints rather than logic, and why?
- Do the calendars reflect how and when people really work?
- Which resources are needed by several activities at once?
- If the critical activity slipped tomorrow, what would we do?

## Bringing it together

A schedule is a model of how work depends on other work. Build it from the scope, link activities with real dependencies, use honest durations and calendars, and let the forward and backward passes calculate the earliest and latest dates, the float and the critical path. Understand that float belongs to chains, watch the near-critical paths as well as the critical one, and limit fixed dates to genuine external constraints. Check the schedule's quality before relying on it, then keep it honest with regular updates, real remaining estimates and a preserved baseline. Done this way, the schedule stops being a picture of hopes and becomes a tool for deciding what to do when things change.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® project management handbooks on project scheduling, Gantt charts and the critical path, schedule readiness reviews, and schedule status, delay and recovery. The worked example is illustrative. This article is general information.*
