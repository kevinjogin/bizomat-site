---
title: "Schedule compression and recovery: crashing, fast-tracking and bringing a late project back"
description: "When a project slips and the deadline cannot move, panic costs money. How to reschedule first, crash the cheapest critical work, fast-track with care and know when recovery is not worth it."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - operations
  - finance
author: "KEVOS®"
featured: false
draft: false
---

Every project manager eventually faces the moment when the schedule slips and the deadline does not. A supplier delivers late, weather stops work, a key person falls ill or the client adds scope. The forecast finish moves past a date that matters: a contractual completion date with damages attached, a plant shutdown window, a product launch, a funding milestone.

The usual reaction is to push harder everywhere: overtime across the board, more people on whatever seems behind, pressure on every team. This spends money on work that does not affect the finish date, tires people, increases mistakes and often fails to recover the time. Disciplined schedule recovery is different. It starts by finding out where the project really stands, then applies the right technique to the right activities, compares the cost of saving each day with the value of that day, and knows when to stop.

This article explains how to reschedule before acting, the two main compression techniques, crashing and fast-tracking, the step-by-step crashing method with a worked example, other ways to recover time, and the risks and contractual points to manage. It is general information for project managers, sponsors and business owners. It assumes a basic critical path schedule; the same logic applies to simpler schedules.

## Key terms

- **Critical path**: the longest sequence of dependent activities through the project, which sets the earliest possible finish. Delay on the critical path delays the project.
- **Float**, or slack: how much an activity can slip without delaying the project (**total float**) or the next activity (**free float**). Critical activities have zero total float.
- **Crashing**: adding resources, such as people, equipment, overtime or extra shifts, to critical activities to shorten them, at extra direct cost.
- **Fast-tracking**: overlapping activities that were planned in sequence, saving time at the cost of extra risk.
- **Direct costs**: costs of doing specific activities, such as labour and materials.
- **Indirect costs**: costs that accrue with time regardless of progress, such as site overheads, supervision, equipment hire and project management.
- **Liquidated damages**: amounts payable under a contract for each day of late completion.

## Step 1: reschedule before you act

When the project falls behind, first update the schedule with actual progress: remaining durations for activities under way, actual start and finish dates, and any changes to logic. Then recalculate the critical path.

This step is often skipped in the rush to respond, and it matters. Delays change which activities are critical. An activity that was critical may now have float, and one that had plenty of float may have become critical. Teams that act without rescheduling often spend money accelerating activities that no longer affect the finish date.

Rescheduling also shows the size of the gap. A forecast five days late needs a different response from one five weeks late. Earned value measures, such as the schedule performance index, can show the trend; the [earned value: what it shows and what it cannot](/insights/earned-value-what-it-shows-and-what-it-cannot/) article explains their limits.

## Step 2: understand why the project is late

The cause shapes the response. A one-off event, such as a late delivery, may be recovered by compressing later work. A systemic problem, such as consistently optimistic estimates, low productivity or unresolved design questions, will keep generating delay, and compressing the schedule without fixing the cause only postpones the next slip. Ask what caused the delay, whether it will recur and whether remaining estimates are realistic.

## Step 3: choose the technique

| Aspect | Crashing | Fast-tracking |
|---|---|---|
| How it works | Adds resources to shorten critical activities | Overlaps activities planned in sequence |
| Main trade-off | Time for money | Time for risk |
| Cost effect | Increases direct costs | May not increase direct costs, but rework can be costly |
| Works best for | Activities that genuinely go faster with more resources | Activities with flexible, discretionary dependencies |
| Main risks | Diminishing returns, fatigue, congestion, budget overrun | Rework when earlier work changes, coordination failures |
| Typical phase | Execution-heavy work | Design-heavy and early work |

Most recoveries use both, applied selectively to different activities.

### Crashing

Crashing works only on critical activities, and only where more resources actually shorten the work. Some activities cannot be crashed at all: concrete curing, shipping transit, regulatory approvals and inspections take the time they take. Others show **diminishing returns**: doubling a crew in a confined space does not halve the duration, and adding new people to complex knowledge work can slow it down while they learn.

Good crash estimates come from the people who do the work. Ask supervisors and trade leads what extra crews, shifts or equipment would actually achieve, what it would cost and what would limit it, such as access, supervision, supply of materials or the capacity of inspectors. Estimates made from a desk often assume that time falls in proportion to resources, which it rarely does.

### Fast-tracking

Fast-tracking applies to **discretionary dependencies**, sequences chosen for convenience or caution rather than necessity. Starting procurement of long-lead items before design is fully complete, beginning fabrication of early parts while later drawings are finished, or fitting out lower floors while upper floors are built are common examples. **Mandatory dependencies**, such as testing after building, cannot be overlapped. The risk is rework: if the earlier activity changes, the overlapping work may have to be redone. Manage it with early release of stable information, design freezes for the parts being started, and close coordination between teams.

## Step 4: the crashing method

Crashing should be done systematically:

1. **Calculate the crash cost per day** for each activity that can be shortened: the crash cost minus the normal cost, divided by the normal duration minus the crash duration.
2. **Identify the critical path or paths.**
3. **Shorten the cheapest critical activity by one day.**
4. **Recalculate the schedule.** Another path may now be critical, and when several paths are critical, each must be shortened together to gain a day.
5. **Compare the cost of the day saved** with its value: the indirect costs avoided, damages avoided and any business value of earlier completion.
6. **Repeat** until the target is reached, no more crashing is possible, or saving another day costs more than it is worth.

The relationship between total cost and duration is the **time-cost trade-off curve**. Shortening from the normal duration usually lowers total cost at first, because indirect costs and damages fall faster than crashing costs rise, then raises it as crashing becomes expensive. The best point lies where the next day saved costs more than it saves.

## A worked example

This is an illustrative example. A plant upgrade has two paths to completion. Path 1 runs through activities A, B and C, taking 33 days; it is critical. Path 2 runs through D and E, taking 31 days, so it has two days of float. After a late equipment delivery, the forecast finish is five days after the contractual completion date. Indirect costs are $3,500 a day, and liquidated damages are $5,000 a day, so each day of lateness avoided is worth $8,500.

| Activity | Normal duration | Crash duration | Crash cost per day |
|---|---|---|---|
| A | 10 days | 8 days | $3,000 |
| B | 15 days | 12 days | $2,000 |
| C | 8 days | 6 days | $4,000 |
| D | 20 days | 18 days | $2,500 |
| E | 11 days | 11 days | Cannot be crashed |

**First two days.** The cheapest critical activity is B at $2,000 a day. Crashing B by two days shortens Path 1 to 31 days at a cost of $4,000. Path 2 is now also 31 days, so both paths are critical.

**Third day.** Both paths must now be shortened together. The cheapest combination is B (its last available day, $2,000) and D ($2,500), costing $4,500, for a duration of 30 days.

**Fourth day.** B is fully crashed. The cheapest combination is A ($3,000) and D's last day ($2,500), costing $5,500, for 29 days.

**Fifth day.** D is fully crashed and E cannot be crashed, so Path 2 cannot be shortened further by crashing. The project manager considers fast-tracking: starting E one day before D finishes, using a section of D's work that is already complete. The engineers judge the rework risk to be low and manageable with daily coordination, so the overlap is adopted, and Path 1 is shortened by crashing A's remaining day at $3,000.

**Economics.** The four crashed days cost $14,000 and save $34,000 in indirect costs and damages. The fifth day costs $3,000 in crashing plus some managed risk and saves $8,500. Recovery is clearly worthwhile. Had damages not applied, each day saved would have been worth only $3,500 in indirect costs. Only the first two days, at $2,000 each, would clearly have been worth buying; the later days cost more than they saved unless earlier completion had other value.

## Other ways to recover time

Before or alongside crashing and fast-tracking, consider:

- **Moving resources** from activities with float to critical ones.
- **Changing the working calendar**, such as an extra shift or weekend work on critical activities only.
- **Resequencing** work or changing dependencies, for example finish-to-start to start-to-start where logic allows.
- **Technical changes** that simplify work, such as prefabrication or a different method.
- **Expediting suppliers** for critical deliveries.
- **Reducing or deferring scope**, with the client's agreement, such as staging non-essential elements after handover.
- **Challenging estimates**: remaining durations padded for comfort can sometimes be tightened, but beware of replacing honest estimates with wishful ones.
- **Accepting the delay** when recovery costs more than the delay, and managing the consequences openly.

Before committing to a recovery plan, test how confident the new finish date really is. The [how confident is that finish date](/insights/how-confident-is-that-finish-date/) article explains using ranges and simulation rather than single dates.

## Risks to manage

- **Fatigue and safety**: extended hours and compressed work raise the risk of injury and error. Work health and safety duties apply, and fatigue must be managed with rosters, breaks and supervision.
- **Quality**: rushed work and overlapping activities can create defects that cost more time later.
- **Congestion**: too many people or trades in one area slow each other down.
- **Morale**: repeated recovery drives wear teams out, especially if the underlying cause is not fixed.
- **New critical paths**: compressed schedules have less float everywhere, so small new delays bite harder.

## Contractual points

Under many contracts, including common Australian construction contract forms, contractors who are delayed by causes outside their control may be entitled to an **extension of time**, but only if they give notice and claim within the time limits the contract sets. Owners who direct acceleration may have to pay for it. Before compressing a schedule because of a delay caused by another party, check the contract: give required notices promptly, record the cause and effect of delays, and agree in writing who will pay for acceleration. Contractual rights lost through late notice are hard to recover.

## Communicating the recovery

A recovery plan should state the forecast before recovery, the actions proposed, their cost, the expected new forecast with its uncertainty, the risks introduced and the decisions needed from the sponsor or client. Decision-makers can then weigh the cost of recovery against the cost of delay. Decisions about recovery are themselves time-critical; the [cost of waiting for decisions](/insights/the-cost-of-waiting-for-decisions/) can exceed the cost of acting.

## Applying this in an Australian business

- **Reschedule with actual progress** before deciding anything.
- **Find and fix the cause** of the delay.
- **Crash only critical activities**, cheapest first, one day at a time.
- **Recheck the critical path** after every step.
- **Compare the cost of each day saved** with its value.
- **Fast-track only discretionary dependencies**, managing rework risk.
- **Manage fatigue, safety and quality.**
- **Protect contractual rights** with timely notices and records.

## Where schedule recovery goes wrong

- **Accelerating everything** instead of the critical path.
- **Skipping the reschedule** and chasing activities that no longer matter.
- **Ignoring parallel paths** that become critical.
- **Crashing activities** that cannot go faster with more resources.
- **Overlapping mandatory dependencies.**
- **Burning out teams** without fixing the cause.
- **Losing extension of time rights** through late notice.

## Questions to ask when a project falls behind

- What does the updated schedule say, and what is now critical?
- Why did we fall behind, and will it happen again?
- What does each day of delay cost, and what is each day of recovery worth?
- Which critical activities can be shortened, and at what cost per day?
- Which dependencies could safely be overlapped?
- What notices and approvals do our contracts require?

## Bringing it together

Schedule recovery is a disciplined process, not a burst of effort. Reschedule with actual progress, understand the cause of delay, and apply crashing and fast-tracking selectively to the critical path, cheapest days first, rechecking the schedule after each step. Compare the cost of each day saved with the value of that day, and stop when recovery costs more than delay. Manage fatigue, quality and rework risk, protect contractual rights and communicate clearly. The result is recovered time at the lowest cost, or an honest, informed decision to accept a delay.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® project management study material on schedule compression, schedule recovery, the time-cost trade-off and schedule control, together with established project management practice. The worked example is illustrative. This article is general information, not legal advice.*
