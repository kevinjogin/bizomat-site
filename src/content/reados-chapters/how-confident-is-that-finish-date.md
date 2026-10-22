---
title: "How confident is that finish date? Ranges, parallel work and what a schedule's probability measures"
description: "A finish date without a confidence level is one point from a range of futures. How to use three-point estimates, why parallel streams lower your real odds and when detailed modelling helps."
publishDate: 2026-10-04
category: "Business"
tags:
  - operations
  - validation
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

Everyone wants a date. Customers need commitments, lenders want to know when revenue starts, and staff, suppliers and launches have to be planned around it. The pressure for one number is real and reasonable. The trouble starts when a single date is treated as though the uncertainty behind it has gone away. Activity durations are estimates. Suppliers may be late. People may not be available. One problem can delay several pieces of work at once. A schedule can calculate a single finish date while the real range of outcomes stays wide.

False precision does not reduce uncertainty. It moves it into a later surprise. And when someone does attach a confidence figure to a date ("we are 85% confident of finishing by March"), it is worth asking exactly what that figure measures. Often it describes one chain of activities, not the whole job. Worse, some of the most common ways of protecting a date make the real odds lower while making the reported figure look better.

This article explains how to think about a finish date as a range, how to use simple three-point estimates, why parallel streams of work lower the chance of finishing on time, what a confidence figure does and does not cover, and when more sophisticated modelling is worth the effort. It is general information for planning everyday projects in a small business.

## A date is one point in a range

Most schedules assign one duration to each task. That is fine for organising the work, but it does not describe the range of possible finish dates. Three common misreadings follow:

- **The most likely duration for every task gives the most likely finish.** Often it does not. Tasks are usually more likely to run late than early, delays accumulate, and early finishes in one place rarely make up for late finishes elsewhere.
- **Padding every task is a sensible safety margin.** Hidden padding is hard to see, tends to be used up whether it is needed or not, and makes it impossible to tell a realistic duration from a protective allowance.
- **A confidence figure is a guarantee.** "80% confident" means 80% within the assumptions of the model. If the model left out important risks, the real figure is different.

## Three-point estimates start a useful conversation

A **three-point estimate** asks for an optimistic, most likely and pessimistic duration for each important task. A traditional formula, from a method known as **PERT**, weights them as: (optimistic + 4 × most likely + pessimistic) ÷ 6.

Suppose a fit-out is most likely to take 8 weeks, could take 6 if everything goes well and 14 if it goes badly. The weighted figure is (6 + 32 + 14) ÷ 6, or about **8.7 weeks**. The extra 0.7 weeks reflects the fact that the bad outcomes are further from the most likely case than the good ones.

The formula is a useful rough guide, but its real value is the conversation it forces:

```figure
type: formula
title: A three-point estimate for the fit-out
formula: Expected ≈ (Optimistic + 4 × Most likely + Pessimistic) ÷ 6
caption: The extra 0.7 weeks reflects bad outcomes sitting further from the most likely case than good ones.
step: (6 + 4 × 8 + 14) ÷ 6
step: About 8.7 weeks
```

- What must happen for the optimistic case?
- What conditions define the most likely case?
- What credible events produce the pessimistic case?
- Are the bounds based on evidence, or on negotiation?
- Does the same cause affect several tasks?

Treat the formula as a starting point, not a complete risk model. Real durations are often skewed more than the formula assumes, and tasks are often linked.

## Parallel work: the merge point problem

When a date is under pressure, the usual response is to run work in parallel: split the job across two contractors, start one stage before the previous one finishes, or prepare several things at once. Each move shortens the expected timeline. Each also creates a **merge point**: a moment where several streams must all be finished before the next step can start.

A merge point waits for the slowest stream. It cannot start early because one stream finished early; it can only start late because one stream was late. That means the chance of starting on time is the chance that **every** stream is on time, which is lower than the chance for any one of them.

If four independent streams each have a 90% chance of finishing on time, the chance that all four do is about 66% (0.9 × 0.9 × 0.9 × 0.9). Add a fifth stream at 90%, and it falls to about 59%. The schedule looks shorter. The odds of meeting the date are worse.

```figure
type: bars
title: More parallel streams, lower odds of finishing on time
unit: %
max: 100
caption: Each stream has a 90% chance on its own; the merge point waits for the slowest.
- One stream | 90
- Two streams | 81
- Three streams | 73
- *Four streams | 66
- Five streams | 59
```

## What a confidence figure usually measures

Many confidence figures are calculated along the **critical path**: the longest chain of tasks through the schedule, based on expected durations. Everything off that chain is treated as certain to be ready when needed. Three things can make the real figure lower than the reported one:

- **Near-critical paths.** Other chains may be only slightly shorter but much less certain, and under uncertainty they may finish last quite often. The "critical path" is a best guess, not a permanent fact. A task with spare time in the plan may still deserve attention if it becomes critical in many plausible scenarios. The [testing the dependencies in your schedule](/reados/collections/project-estimates-schedules-and-costs/testing-the-dependencies-in-your-schedule/) article covers checking whether the links between tasks are real in the first place.
- **Merge points.** As above, every place where streams converge lowers the real chance of finishing on time.
- **Common causes.** When one cause, such as the same approval body, the same busy specialist, the same supplier or the same weather, affects several tasks in sequence, their delays add up rather than offsetting each other. The range of finish dates is wider than a calculation that treats tasks as independent suggests.

The most important warning sign is a confidence figure that **improves after a replan that added parallel work**. That is only possible if the new ways of being late were not counted.

When someone gives you a confidence figure, ask:

1. How many separate streams or paths lead to the finish?
2. Which path was the figure calculated on?
3. How many points require several streams to converge?
4. Which common causes, such as shared suppliers, approvals or people, were assumed not to matter?
5. When was it last recalculated, and has more parallel work been added since?

```figure
type: checklist
title: Questions to ask of any confidence figure
caption: Be wary of a figure that improves after a recovery plan adds parallel work.
- ? How many streams lead to the finish?
- ? Which path was it calculated on?
- ? How many merge points?
- ? Which common causes were assumed away?
- ? When was it last recalculated?
```

## Choose the confidence level to fit the decision

The right date depends on what it will be used for:

| Use | What it needs |
|---|---|
| Internal target to drive action | Achievable logic and stretch assumptions; fast feedback |
| Plan the business will work to | Realistic scope, resources and risks |
| Promise to a customer or the public | A stated confidence level and an understanding of what being late would cost |
| Contingency for time | Clear drivers, an owner and rules for using it |
| Recovery plan | Evidence that the action actually improves the odds, not just the date |

An internal target can be ambitious. A date printed on a launch invitation, written into a contract or tied to a lease starting should carry much more protection. Confusing the two invites either complacency or avoidable failure. The [what is a day of delay worth](/reados/collections/valuing-time-delay-and-uncertainty/what-is-a-day-of-delay-worth/) article covers putting a value on lateness, which helps choose how much protection a date deserves.

## Put time contingency where everyone can see it

Rather than padding each task, hold time contingency openly:

- **at the end of the job**, protecting the final date;
- **where streams merge**, protecting the critical work from late feeders;
- **for shared external events**, such as approvals or seasonal weather.

Decide who controls it and how its use is recorded. Hidden padding is consumed locally without anyone seeing the effect on the whole job.

## When detailed modelling helps

More sophisticated methods exist. **Monte Carlo simulation** runs a schedule thousands of times with durations drawn from their ranges to show the spread of possible finish dates and which tasks drive it. **Decision trees** map choices made in stages, where later actions depend on what is learned. These can be valuable for large, high-stakes commitments.

But a model is only as good as its structure and inputs. Simulating a schedule with missing scope, weak logic or unrealistic resources produces a precise-looking version of the same weakness. Before investing in detailed modelling, ask:

- **Would a better understanding of uncertainty change a real decision**, such as a commitment date, contingency or design choice?
- **Are the input ranges based on evidence** or on guesses dressed as data?
- **Does the method answer the actual question?**
- **Can the people deciding understand its assumptions well enough to challenge them?**
- **What will we do differently depending on the result?**

For most small-business projects, honest three-point estimates, a list of merge points and common causes, and visible contingency will do more than a sophisticated model.

## A worked example

This is an illustration. A café owner is opening a second site and has announced an opening date of 1 December, to catch the Christmas trade. Four streams must all be complete before the café can open:

| Stream | Chance of finishing on time |
|---|---|
| Fit-out by the builder | 85% |
| Coffee machine and kitchen equipment from the importer | 90% |
| Hiring and training staff | 95% |
| Signage and point-of-sale system | 95% |

The builder's schedule shows 85% confidence, and the owner had been quoting that figure. But the chance that all four streams are ready is about **69%** (0.85 × 0.9 × 0.95 × 0.95). The food business registration and inspection by the local council can only happen after the fit-out, adding another dependency the builder's figure does not include.

The builder suggests speeding up the fit-out by having a separate contractor install the cool room in parallel. That raises the builder's own confidence to 92%, and the builder's report looks better. But the cool room becomes a fifth stream, at about 88%. The overall chance falls to about **66%** (0.92 × 0.88 × 0.9 × 0.95 × 0.95). The plan is faster on paper and less likely to open on time.

The owner takes three steps:

- **Reduces the number of streams that must merge.** The equipment is ordered earlier so it arrives with time to spare, and the point-of-sale system is set up and tested at the existing café first.
- **Identifies a common cause.** The builder and the cool room contractor rely on the same electrician. A single delay there would hold up both. The owner books the electrician's time directly and confirms it in writing.
- **Changes what is promised.** The public announcement becomes "opening early December", with the exact date confirmed two weeks out, once the council inspection is booked. Internally, the team keeps 1 December as its target.

```figure
type: bars
title: The café opening: reported confidence against the real odds
unit: %
max: 100
caption: Running the cool room in parallel made the builder's report look better and the opening less likely.
- Builder's reported confidence | 85
- All four streams ready | 69
- Builder's figure with a parallel cool room | 92
- *All five streams ready | 66
```

## How this applies to a small Australian business

- **Ask for three-point estimates** on the tasks that matter.
- **Count your merge points** and the streams feeding each.
- **List common causes**: shared people, suppliers, approvals, equipment and weather.
- **Be suspicious of a confidence figure that rises** after work is split or overlapped.
- **Hold time contingency openly**, at the end and at merge points.
- **Match the confidence level to the commitment.** Public and contractual dates need more protection than internal targets.
- **Use detailed modelling only when it will change a decision** and the inputs justify it.
- **Compare actual durations with estimates** after each job to calibrate the next.

## Signals worth watching

- A single date with no range or confidence attached.
- Every task padded "just in case".
- Several streams converging at one critical moment.
- One person, supplier or approval body feeding many tasks.
- Confidence figures that improve after more parallel work is added.
- A detailed model nobody can explain.

## Common mistakes

- **Treating a calculated date as a forecast of reality.**
- **Adding parallel streams** without counting the extra merge points.
- **Assuming tasks are independent** when they share a cause.
- **Hiding contingency inside task estimates.**
- **Promising customers an internal stretch target.**
- **Trusting a sophisticated model** built on weak inputs.

## Frequently asked questions

**Do we need special software for this?** No. A spreadsheet with three-point estimates and a list of merge points and common causes goes a long way.

**What confidence level should we use for customer promises?** It depends on what lateness would cost you and the customer. The higher the cost, the more protection the date needs.

**Is running work in parallel a bad idea?** No. It often saves real time. Just recognise that each extra stream adds a way to be late, and manage the merge points deliberately.

**How do we get better estimates?** Record actual durations against estimates on every job and use them next time. Your own history is the best data you have.

**When is Monte Carlo simulation worth it?** For large commitments with many uncertain, interacting tasks, where the result could change a significant decision and you have reasonable data for the ranges.

## Questions to ask

- What range of finish dates is realistic, not just the calculated one?
- How many streams must merge before we can finish?
- What common causes could delay several tasks at once?
- What exactly does our confidence figure cover?
- Where is our time contingency, and who controls it?
- Is the date we are promising a target or a commitment?

## Bringing it together

A finish date is one point in a range of possible futures, and the range is what matters for commitments. Use three-point estimates to bring out the assumptions behind each duration, and remember that every parallel stream adds a merge point that lowers the real chance of finishing on time, even as it shortens the plan. Ask what any confidence figure actually measures, look for common causes that make several tasks late together, hold contingency where everyone can see it, and match the protection on a date to what being late would cost. Detailed modelling helps when it can change a decision and its inputs deserve trust; otherwise, honest ranges and a clear view of the merge points will serve you better.

---

*Source: KEVOS® notes, drawing on teaching material on three-point estimating, PERT, schedule risk analysis, Monte Carlo simulation and decision trees, and on the US Government Accountability Office's Schedule Assessment Guide. Examples and figures in this article are illustrations. This article is general information.*
