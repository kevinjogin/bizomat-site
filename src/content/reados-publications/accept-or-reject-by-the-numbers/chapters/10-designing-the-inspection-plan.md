---
book: accept-or-reject-by-the-numbers
chapterSlug: designing-the-inspection-plan
order: 10
title: "Designing the inspection plan"
description: "Build the inspection plan: two-stage gauging, a camera review band, bench capacity, reaction plans and records, and the comparison that matters most, inspecting better against making better."
draft: false
---

The earlier chapters each improved one decision: an acceptance limit, a gauge, a repeat-measurement rule, a way of combining checks, a camera threshold, an estimate of the defect rate, a view of the customer's sampling. An inspection plan puts them together. It says, for each characteristic, how it is checked, what decision rule applies, what happens to uncertain parts, how the checks are themselves checked, what to do when something goes wrong, and what is recorded. A good plan also says what it costs, because that number decides whether the next dollar should go to inspection or to the process.

This chapter builds BU-25's plan. It designs a two-stage gauging scheme that halves the cost of wrong decisions on the bore, pairs it with the camera's review band, checks that the bench gauge has the capacity the plan needs, writes the reaction plans and records, and compares the whole plan with the alternative of centring the process. The error is a plan that worked on paper and overflowed on the floor.

## Two stages for the bore

Chapter 5 showed that a second reading is most valuable when it is independent and better than the first, and spent only where it can change the decision. The bench gauge, with a standard uncertainty of 0.30 µm against the air gauge's 1.13 µm, is that better reading, but at about a minute a bush it is far too slow for every part. A two-stage plan uses the air gauge to decide the clear cases and sends only the uncertain ones to the bench.

```figure
type: steps
title: Two-stage gauging of BU-25's bore
caption: This is an illustration. The first-stage limits are the one-U guard band of Chapter 3 and its mirror outside the tolerance. The bench gauge's own cost-based limits are worked out as in Chapter 3 with its smaller uncertainty.
- Stage 1, air gauge, every bush | reading 25.0023 to 25.0187 mm: accept
- Stage 1, air gauge | reading below 24.9977 or above 25.0233 mm: reject
- Stage 1, air gauge | any other reading: send to the bench gauge
- Stage 2, bench gauge | reading 25.0006 to 25.0204 mm: accept; otherwise reject
- * Bushes sent to the bench | about 92 a shift, under 5%
```

```figure
type: compare
title: Single-stage and two-stage gauging of the bore, per shift of 2,000 bushes
cols: Bench checks | Escapes | Good bushes rejected | Cost of errors and bench time, A$ ex GST
rowhead: Plan
- Air gauge at the tolerance limits | 0 | 3.54 | 9.6 | 1,478
- Air gauge at cost-based limits, Chapter 3 | 0 | 0.34 | 50.0 | 459
- Bench gauge on every bush | 2,000 | 0.03 | 9.4 | 2,735
- * Two stages: air gauge, then bench for uncertain bushes | 92 | 0.13 | 8.9 | 230
caption: This is an illustration. Bench time at A$1.33 a bush (a minute at A$80 an hour). The air gauge's own reading time, A$267 a shift, is the same in every plan that uses it and is not included.
```

The two-stage plan halves the cost of the best single-stage plan, from A$459 to A$230 a shift. It has fewer escapes than the cost-based single stage and a fifth of its false rejects, because the uncertain bushes, which caused almost all the wrong decisions, are now decided by a gauge four times better. Measuring every bush on the bench would be more accurate still, but at A$2,667 of bench time a shift, it costs far more than the errors it prevents. The two-stage plan spends the expensive measurement where it matters.

The choice of first-stage limits is a trade between bench load and errors. Using the one-U guard band for the accept zone sends every bush that is not clearly good to the bench. Using Chapter 3's cost-based limits instead, which accept a little closer to the tolerance, sends only about 62 bushes a shift to the bench, but lets more borderline bushes through on the air gauge alone, about 0.37 escapes a shift, for a total of about A$283. The one-U accept zone is the better choice while the bench has spare capacity; the cost-based zone is a sensible fallback when it does not, and the plan can say when to switch between them.

## The camera's review band

Chapter 7's review band applies the same principle to chatter. Bushes the camera scores below 30 are accepted, those above 40 are rejected, and those between, about 97 a shift, are checked under the microscope at the inspection bench, about 15 seconds each. At the 0.6% chatter rate, that gives about 0.85 false rejects and 0.32 escapes a shift, A$164 including the microscope time, against A$498 for the camera's original single threshold.

## Capacity at the bench

A two-stage plan moves work to the second stage, and the second stage must have the capacity. The bench gauge is also used for the daily audit of Chapter 8, 200 bushes at a minute each.

```figure
type: stats
title: Inspection bench load per shift
caption: This is an illustration. A shift has about 420 minutes of working time. The bench is also needed for first-article checks, gauge setting and audits of other parts.
- 92 min | bench gauge, second-stage bore checks
- 200 min | bench gauge, daily audit of 200 bushes
- 24 min | microscope, camera review band, 97 bushes at 15 s
- 316 min | total, three-quarters of a shift
```

The bench is loaded to about three-quarters of a shift, before first-article inspection and other parts' audits. That is workable, but tight, and the load varies: on a day when the process drifts towards the upper limit, more bushes fall in the uncertain band and the second stage grows. The plan therefore needs a rule for what happens when the bench falls behind, and the error below shows what happens without one.

## The plan on one page

```figure
type: compare
title: BU-25 inspection plan, bore and chatter
cols: Method | Decision rule | Checks on the check | Reaction plan
rowhead: Item
- Bore, stage 1 | air gauge, every bush | accept 25.0023 to 25.0187; reject outside 24.9977 to 25.0233; otherwise stage 2 | master check each shift; Type 1 study monthly | failed master check: quarantine bushes since the last good check
- Bore, stage 2 | bench gauge | accept 25.0006 to 25.0204 | bench master each day | bench queue over 30 bushes: stop and call the supervisor
- Chatter | camera, every bush; microscope review | accept score below 30; reject above 40; review between | reference set each week; score distributions after any camera change | confirmed chatter: next 5 bushes need camera and microscope passes; inspect the boring bar
- Base rates | daily audit of 200 bushes, bench and microscope | p-chart, then update the rate if in control | audit method reviewed yearly | signal: investigate; record against the special cause
- Lots | customer's plan, n = 132, c = 3 | customer's decision | shared audit data | rejected lot: treat as a special cause
caption: This is an illustration. Every limit carries the date of the capability study, gauge budget and costs it was calculated from, so it can be recalculated when they change.
```

The page records the decisions the earlier chapters argued for, and their reasons. It also fixes the rules that are easy to forget: one reading decides at the air gauge, never measure until it passes; the reference set and the master's certificate, not memory, define the checks on the checks; special causes are recorded, not averaged.

## Where the inspection sits

An inspection plan is also a decision about where in the process each check happens, and the position matters as much as the method. BU-25's air gauge sits beside the lathe, so each bore is measured within a minute of being cut. That position does two jobs at once. It sorts bushes, and it watches the process: a run of readings creeping towards the upper limit tells the operator to adjust the boring offset before any bush is out of tolerance, which is worth far more than sorting the bad ones afterwards. The same readings, charted, are the process data from which capability and the prior are kept current.

A final inspection at the end of the line, after washing and packing, would sort just as well but watch the process badly, because by the time it saw a drift, a whole batch would already be made. The general rule is to inspect a characteristic as close as possible to the operation that creates it, and to use the readings to control that operation, keeping a final check only for what can change later, such as damage in handling or contamination in washing. For BU-25, the chatter camera sits after the washing station, because coolant on the bore confuses its scores, and that is a reasonable exception: the chatter's cause, the boring bar, is watched instead through the neighbouring-bush rule and the tool counter.

## Keeping the plan current

Every number in the plan rests on inputs that change. The plan therefore names its own review triggers: a new capability study or a shift in the bore mean; any change to a gauge, its master or the camera's optics or software; a change in the costs, such as a new customer charge for escapes; a new defect type found in audits or returns; and a change in the customer's sampling plan or specification. Any of these prompts a recalculation of the limits and thresholds affected, by the methods of Chapters 2, 3 and 7, and a dated revision of the one-page plan. Without any trigger, the plan is reviewed once a year in any case, with the year's audit results, escape reports and bench queue records.

Training is part of keeping the plan current. Each rule on the page has a reason, and operators who know the reasons apply the rules better than those who only know the numbers. The reasons behind measuring once, not until a pass, and behind treating a growing bench queue as a process signal, are short enough to explain at the gauge, and are the two most likely to be lost when people change.

## Who decides

The decisions in this book belong to different people. The quality engineer owns the calculations and the plan. Production owns the process and the response to process signals. The costs of escapes and false rejects are a management judgement, agreed between quality, production and whoever deals with the customer. The customer owns the specification and, where the contract says so, the decision rule. For parts whose failure could cause injury, or whose acceptance is governed by regulation or a contract standard, acceptance rules must follow that standard and be approved by qualified people, whatever a cost calculation suggests, and the methods here serve only to show what the required rules cost.

## Inspecting better or making better

Every chapter so far has improved the inspection of a process that runs 3.6 standard deviations from its lower limit and only 2.4 from its upper. The cheapest improvement of all may be to the process. BU-25's bore mean is 2 µm above the middle of its tolerance. Centring it, by adjusting the boring offset and holding the mean with a control chart, would leave the spread unchanged and move the mean to 25.0105 mm.

The [parts out of tolerance tool](/tools/normal-out-of-spec/), with a mean of 25.0105 mm and the same 3.5 µm standard deviation, gives 1,350 ppm below and 1,350 ppm above the limits, 0.27% in total, or 5.4 bushes per 2,000 against 15.5 now. With fewer bushes near the limits, the inspection's work shrinks too.

```figure
type: compare
title: The bore's cost of wrong decisions per shift, current and centred process
cols: Bushes out of tolerance | Single stage at cost-based limits, A$ | Two stages, A$ | Bushes to the bench
rowhead: Process mean
- 25.0125 mm, current | 15.5 | 459 | 230 | 92
- * 25.0105 mm, centred | 5.4 | 221 | 110 | 49
caption: This is an illustration. Same spread, same gauges, same costs; the cost-based limits recalculated for the centred process's prior. Centring halves the cost of either plan and the bench load.
```

Centring cuts the bore's cost of wrong decisions by more than half under either plan, reduces the bench's second-stage load from 92 to 49 bushes a shift, and, more importantly, cuts the bad bushes made from 15.5 to 5.4 a shift, which no inspection can do. The two improvements are complementary. Inspection decides which of the bushes made are shipped; the process decides which are made. When a process runs off-centre or with a wide spread, the money spent on inspection is partly a tax on that, and the best inspection plan includes a line asking the process to stop needing so much of it.

## What the plan costs, and what it saved

This is an illustration. Before the work of this book, the shop gauged every bore at the tolerance limits and ran the camera at a single threshold. With the air gauge's reading time, those decisions cost about A$1,478 + A$267 + A$498 = A$2,243 a shift. The plan above costs about A$230 + A$267 + A$164 = A$661, a saving of about A$1,580 a shift. With the process centred as well, the total would fall to about A$541. These are the costs of wrong decisions and inspection time only, before the costs of the gauges, the camera and the bench, which the shop already owned.

## The error: a second stage that overflowed

This is an illustration. In the plan's second month, the bore mean drifted towards the upper limit over several days as a coolant chiller lost performance. More bushes fell in the air gauge's uncertain band, and the bench queue grew to over 150 bushes a shift on top of the daily audit. The bench inspector, unable to keep up, began passing queued bushes that had read only slightly above 25.0187 mm without measuring them, reasoning that they were probably good.

They mostly were, as Chapter 2 would predict, but the monthly escape audit found oversize bushes among them, and the cylinder maker reported two. The plan had assumed a second stage that always had capacity, and had no rule for when it did not. Its first warning sign, the growing queue, had also been the first sign of the process drift, and nobody had treated it as one.

The corrections were three. The plan now limits the bench queue: above 30 bushes, the line stops and the supervisor is called, because a growing queue means the process has moved. The bench queue length is recorded each hour and charted, which turned it into an early warning of process drift. And the chiller was repaired and the bore mean recentred, which also cut the normal bench load, as the comparison above shows. The lesson is that every stage of an inspection plan is a process with a capacity, and a plan that silently degrades when overloaded will fail exactly when the process is at its worst.

## Exercise: the centred process

This is an illustration. After centring, BU-25's bore runs at 25.0105 mm with a standard deviation of 3.5 µm.

1. How many standard deviations is each limit from the mean, and what fraction falls outside each?
2. How many bushes per shift of 2,000 are out of tolerance?
3. With the two-stage plan, about 49 bushes a shift go to the bench. What is the bench load in minutes, with the daily audit, and how does it compare with the 292 minutes before centring?

**Worked answer.**

1. Each limit is 10.5 µm from the mean, **3.0 standard deviations**. The fraction beyond each is about **0.135%**, 1,350 ppm, from the normal distribution, as the parts out of tolerance tool reports.
2. 2 × 0.00135 × 2,000 = **5.4 bushes** a shift, against 15.5 before centring.
3. 49 minutes of second-stage checks plus 200 minutes of audit is about **249 minutes**, against 92 + 200 = 292 minutes before. Centring frees about 43 minutes of bench time a shift, and the plan's capacity margin grows with it.
