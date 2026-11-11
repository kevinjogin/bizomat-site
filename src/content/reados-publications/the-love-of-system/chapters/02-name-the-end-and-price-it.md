---
book: the-love-of-system
chapterSlug: name-the-end-and-price-it
order: 2
title: "Name the end and price it: where the lathe's week actually goes"
description: "Before comparing machines or systems, measure where time and money are lost and price an hour of the constraint. A machine hour rate and an improvement calculation turn a vague end into a number."
draft: false
---

Chapter 1 ended with a rule: state the end before the means, and price the end. It sounds obvious, and it is routinely skipped, because naming the end is less interesting than choosing the means. A robot cell is a fascinating thing to specify. Working out where the lathe's week goes is tedious.

This chapter does the tedious part for the job shop's main lathe. It measures where the lathe's time goes, prices an hour of it with a machine hour rate, and values an alternative to the robot that the shop had not considered because it was too ordinary to be exciting. It also shows how the choice of rate can make the same improvement look twice as valuable as it is.

## The end, stated plainly

This is an illustration. The shop's problem, in its customers' terms, is late delivery: 78% on time, with two customers complaining. Most of the late orders are for turned parts, and turned parts mostly go through the main CNC lathe. Orders for the lathe routinely wait a week or more before they start. The lathe is the shop's constraint for turned work, in the sense used throughout operations practice: the resource whose capacity limits how much work flows through.

So the end, for every proposal touching the lathe, is the same: **more useful lathe hours each week, so that turned orders start sooner and finish on time.** Lower labour cost is welcome, but it is a secondary end. A proposal that cuts labour cost without adding lathe hours does not solve the shop's main problem.

## Where the lathe's week goes

The owner asks the lathe operator to log, for four weeks, what the lathe is doing in each quarter-hour of the shift: cutting, loading and unloading, changing over between jobs, waiting for material or inspection, or stopped for another reason. The lathe runs one shift of about 40 hours a week.

```figure
type: bars
title: The main lathe's average week
unit: h
max: 20
caption: This is an illustration. Four weeks of quarter-hour logs, averaged. Changeovers take nearly as much of the week as cutting. Loading and unloading, the time a robot would address, is a fifth of the size.
- *Changeovers between jobs | 18
- Spindle cutting | 16
- Loading and unloading parts | 4
- Waiting for material, programs or first-off inspection | 2
```

### Collecting the log without blame

A time log of this kind can feel like surveillance, and an operator who feels watched will log what looks good rather than what happens. The owner explains in advance that the log is about the lathe, not the operator; asks the operator to help design the categories; and agrees that the results will be shared before anyone else sees them. The categories are deliberately few and plain, so that a quarter-hour can be classed in a second. After the first week the operator suggests splitting "waiting" into waiting for material and waiting for first-off inspection, because the second turned out to be more common than either of them expected.

A log is not a precise measurement. Quarter-hours are rounded, and a busy operator sometimes fills in the sheet from memory at the end of the day. But four weeks of rough data are far better than none, and they are good enough to show where the large losses are. Precision matters when choosing between two similar options; a log that shows changeovers at 18 hours and loading at 4 does not need to be precise to change the decision.

The result surprises the owner. The robot cell addresses loading and unloading, which takes about **4 hours** of the lathe's week. Changeovers between jobs take about **18 hours**: about nine changeovers a week, each about two hours, covering chuck jaw changes, tool changes and offsets, program loading, first-off cutting and measurement. With batches averaging about 40 parts, the lathe spends almost as much time being set up as cutting.

The end has now been located. The largest loss of lathe hours is changeovers, not loading. A robot cell would leave the largest loss untouched, and might even add to it, because a robot also has to be set up for each new job.

## Price an hour of the lathe

To compare options, the shop needs a value for a lathe hour. The [machine hour rate tool](/tools/machine-hour-rate/) in BIZOMAT Tools works out the hourly cost of a machine from the capital recovery on its installed cost and resale value over its economic life at an interest rate, plus floor space, power, maintenance and tooling, spread over its productive hours, and adds the operator's loaded hourly cost to give a machine-and-operator rate.

For the main lathe, the owner enters an installed cost of A$280,000, a resale value of A$40,000 after ten years, an interest rate of 8%, 3,000 productive hours a year across the shift and overtime, A$6,000 a year of floor space, 10 kW average power at A$0.30 per kWh, A$9,000 a year of maintenance, A$12 an hour of tooling and consumables, and an operator at A$68 an hour fully loaded. The tool gives:

```figure
type: compare
title: What an hour of the main lathe costs
cols: Per hour
caption: This is an illustration. Results from the machine hour rate tool, excluding GST. The operator is about two-thirds of the combined rate; the machine itself costs about A$33 an hour to own and run.
- Capital recovery, A$38,967 a year over 3,000 hours | A$12.99
- Floor space | A$2.00
- Maintenance | A$3.00
- Power | A$3.00
- Tooling and consumables | A$12.00
- Machine rate | A$32.99
- *Machine and operator rate | A$101.00
```

The machine-and-operator rate of **A$101 an hour** is the cost of running the lathe with its operator for an hour. It is the right figure for valuing hours released that would otherwise have to be bought, for example as overtime or as another shift.

## An ordinary alternative

With the end located and priced, the owner asks a simpler question than "should we buy a robot?": what would cut changeover time? The answer is ordinary. Quick-change workholding, with jaws and chucks that change in minutes rather than half an hour, a preset tool system, and standard programs and offsets for the shop's recurring part families, could bring the average changeover from about **120 minutes** to about **45**. The quoted cost, including the jaw system, a tool presetter and some programming time, is about **A$22,000** excluding GST.

The [improvement value tool](/tools/improvement-value/) in BIZOMAT Tools translates time saved into an annual value. From the current and improved time per occurrence, the occurrences per week, the working weeks a year, an hourly rate and the implementation cost, it gives the time saved per occurrence, the hours released a year, their value and the payback in months. Its output repeats the point made throughout this book: released time is not automatically a cash saving, and the user must show whether it avoids cost, raises output or frees capacity for other work.

With nine changeovers a week, 48 working weeks, 75 minutes saved per changeover and the machine-and-operator rate of A$101 an hour, the tool gives **540 hours** released a year, worth **A$54,540**, and a payback of **4.8 months**.

Here the released hours are genuinely useful, because the lathe is the constraint. The 540 hours are about 11 more hours of lathe time each week, enough to start waiting turned orders days sooner, and they come at the constraint, which is the only place where extra hours raise the shop's output.

## The failure case: the rate that doubled the case

The owner's first version of this calculation used a different rate: **A$145 an hour**, the shop's charge-out rate for lathe work. At that rate the tool gives an annual value of **A$78,300** and a payback of 3.4 months. The case looked even better.

The charge-out rate is a price, not a cost. It includes the shop's overheads and profit margin, and it is earned only when an hour is sold to a customer. Using it to value released hours assumes that every hour released will be sold at full price, which may be true at the constraint when there is a queue of orders, but it double-counts if the hours are really used to catch up on late work already sold, or to avoid overtime.

```figure
type: compare
title: The same 540 hours valued three ways
cols: Annual value | Payback | When the rate is right
caption: This is an illustration. Results from the improvement value tool for 75 minutes saved on nine changeovers a week over 48 weeks, against A$22,000, excluding GST. The rate must match what the released hours will actually do.
- Operator only, A$68 an hour | A$36,720 | 7.2 months | Hours released only from the operator's time
- *Machine and operator, A$101 an hour | A$54,540 | 4.8 months | Hours that replace overtime or another shift
- Charge-out price, A$145 an hour | A$78,300 | 3.4 months | Only if every released hour is sold at full price
```

### How it is detected

Ask, as the tool does, what the released hours will do, and match the rate to that answer. At the job shop, most of the released lathe hours will go to clearing the queue of orders already taken, so they replace overtime the shop would otherwise work. The machine-and-operator rate is the defensible figure; the charge-out rate is an upper bound that applies only to new work won because of the shorter lead time.

### How it is corrected

The owner records the case at A$101 an hour, with a note that any new work won because of the shorter lead time would add to it. That makes the case honest without making it weak: at 4.8 months, it still pays back faster than almost anything the shop could buy.

## Put the robot on the same footing

The owner now has a fair basis for comparing the robot cell. The robot addresses about 4 hours a week of loading and unloading on the lathe, and the operator's time during long runs. The quick-change system cuts changeovers from about 18 hours a week to about 6.75, releasing about 11.25 hours a week, at about an eighth of the robot's price. Chapter 3 tests the robot's case in detail. But the comparison already shows something important: until the changeover loss is dealt with, a robot would be automating the smaller part of the problem.

That is the practical meaning of Smith's watch. The robot is the finer contrivance. The quick-change jaws are humble. The jaws serve the end better.

## The same end, priced differently elsewhere

An hour has a different value depending on where it is released. At the lathe, the constraint for turned work, an hour released becomes an hour of output that the shop needs. At one of the machining centres, which run below capacity most weeks, an hour released by a similar improvement mostly becomes an hour of waiting for the next job. Its value is only the operator time it saves, and only if that time is used for something else.

The owner applies this when ranking the shop's improvement ideas. Ideas at the lathe are valued at the machine-and-operator rate; ideas at machines with spare capacity are valued at the operator rate, and only where the operator's released time has a named use. The ranking puts most of the shop's improvement effort on the lathe for the coming year, which is exactly where the late deliveries come from.

### What else the log showed

The log's smallest category turned out to be informative. About two hours a week were spent waiting for first-off inspection, with a completed first part sitting at the measuring machine while the lathe stood idle. That waiting happens at the constraint, so each hour of it costs an hour of output. The obvious response, a faster measuring machine, is the subject of the sales representative's proposal examined in Chapter 4. The less obvious response, giving first-off parts from the lathe priority at the measuring machine and preparing measuring programs before the job starts, costs almost nothing.

## The end is not always money

Pricing the end does not mean turning everything into dollars. Some ends are better measured directly: on-time delivery as a percentage, lead time in days, rework as a rate, injuries as a count. What matters is that the end is measured, that its current level is known, and that each proposal states how much it will move it. Money is useful when options must be compared or weighed against cost; a direct measure is useful when the end itself is what the business has committed to.

At the job shop, the owner keeps two measures on the office whiteboard: on-time delivery for turned parts, and the number of lathe orders waiting more than a week to start. Both started the year at uncomfortable levels. Both are what the quick-change system is supposed to move.

## Exercise: fewer changeovers

The owner considers a second measure that would combine with quick-change workholding: grouping similar jobs so that some changeovers become partial, cutting the number of full changeovers from nine to about **six** a week. Using the improvement value tool's method at the machine-and-operator rate, what would the quick-change system be worth at six changeovers a week, and what does that suggest about doing both?

**Worked answer.** At six changeovers a week, the 75-minute saving releases 75 × 6 × 48 ÷ 60 = **360 hours** a year, worth 360 × A$101 = **A$36,360**, and the payback on A$22,000 lengthens to about **7.3 months**.

Grouping jobs reduces the number of changeovers the quick-change system can shorten, so the two measures overlap: the second one lowers the value of the first. Together they still release more lathe time than either alone, because grouping removes some changeovers entirely and quick change shortens the rest. But their combined value is less than the sum of their separate values, and a business case that added them as if they were independent would overstate the gain. The habit Chapter 1 recommended applies again: state the end, which is lathe hours released, and estimate what the combination delivers, not each part in isolation.
