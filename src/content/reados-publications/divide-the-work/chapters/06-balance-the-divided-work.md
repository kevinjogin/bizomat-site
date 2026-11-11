---
book: divide-the-work
chapterSlug: balance-the-divided-work
order: 6
title: "Balance the divided work: takt time and the station that sets the pace"
description: "Divided work runs at the pace of its slowest station. How to set takt time, find the constraint, move tasks between stations to balance them, and stop improving stations that do not limit output."
draft: false
---

Dividing work creates a new problem that generalists never had. When each person builds whole benches, each works at their own pace and the business's output is simply the sum. When the work is split into stations, a bench must pass through every station, and the whole line can go no faster than its slowest station. Smith's pin makers had to keep eighteen operations in step; the bench maker has to keep three.

This chapter sets the pace the business needs, finds the station that limits output, rebalances the stations by moving tasks between them, and shows the expensive mistake of improving a station that is not the constraint.

## The pace the customer sets

This is an illustration. The workshop runs one shift. After breaks and the daily toolbox meeting, each person has about **456 minutes**, or 7.6 hours, of working time a day. The contract requires fifteen benches a week, which over five days is **three a day**.

Takt time is the available time divided by the required output: the interval at which one finished bench must leave the line for the business to keep up with demand. Here it is 456 ÷ 3 = **152 minutes**. Every station must complete its part of a bench in 152 minutes or less, on average, or the line falls behind.

## Find the constraint

After the learning and the fixture described in Chapters 2 and 4, the three stations' times per bench are:

- **Station A**, cutting and folding: **96 minutes**;
- **Station B**, welding the leg frame with the fixture: **116 minutes**;
- **Station C**, polishing, fitting the undershelf and feet, assembling, inspecting and packing: **160 minutes**.

The [bottleneck and line balance tool](/tools/bottleneck/) in BIZOMAT Tools compares up to three step cycle times with the required takt. From the available production time, the demand and each step's cycle time, it gives the takt, identifies the constraint, expresses each step's load as a share of takt, and reports the line's capacity and its balance efficiency: the total work divided by the number of steps times the constraint's time. Its guidance is that improving any step other than the constraint will not raise output.

With these times, the tool reports takt **152 minutes**, Station C as the **constraint** at **105.3%** of takt, and a line balance efficiency of **77.5%**. The line can produce about 456 ÷ 160 = **2.85 benches a day**, short of the three required.

```figure
type: bars
title: Station times against takt, before rebalancing
unit: min
max: 170
caption: This is an illustration. Takt is 152 minutes. Results from the bottleneck and line balance tool: Station C exceeds takt and sets the pace; Stations A and B have time to spare that the line cannot use.
- Station A, cut and fold | 96
- Station B, weld with fixture | 116
- *Station C, polish, fit, assemble, inspect, pack | 160
- Takt | 152
```

The line balance efficiency of 77.5% has a direct meaning. Of the total station time available per bench, three stations at 160 minutes each, or 480 minutes, only 372 minutes are actual work. The other 108 minutes, about a fifth, are spent by the faster stations waiting for the slowest. In a business paying for every one of those minutes, that is the cost of imbalance.

The picture is common after work is divided. One station, often the one that collected the leftover tasks, is overloaded, while the others have slack. Station A spends a third of each takt period waiting for the next bench to be needed. Station B, which received all the attention in the earlier chapters, is not the constraint at all.

## The failure case: improving the wrong station

The welding station was the obvious problem in the first weeks of the contract, when weld times were high and the fixture did not exist. The owner's attention, the welder's improvement time and A$4,800 for the fixture all went to Station B, and rightly at the time.

But the constraint moves. Once the fixture brought welding to 116 minutes, Station B was no longer limiting output, and Station C was. The owner kept measuring welding times weekly and praising each reduction, and approved a second improvement for the welding station, a positioner to rotate the frame, at A$3,200. It would have reduced welding to about 100 minutes. It would not have produced one more bench, because benches would simply have waited longer in front of Station C.

### How it is detected

The clearest sign of a constraint is where unfinished benches accumulate. In the fourth week, there are routinely three or four welded frames waiting beside Station C, and Station C is the only station where the person is never waiting for work. A simple daily count of benches waiting in front of each station shows the constraint more reliably than any station's own productivity figure.

### How it is corrected

The positioner is deferred. The owner adopts a rule from the bottleneck tool's guidance: **improvement time and money go to the constraint first.** Improving a non-constraint station is justified only if it releases time that can be used to relieve the constraint, which is exactly what rebalancing does.

## Rebalance by moving tasks

The constraint can be relieved in several ways: reduce its work, add capacity there, or move some of its tasks to a station with spare time. The last is often the cheapest and is the essence of line balancing.

Station C's 160 minutes include about **30 minutes** of fitting the adjustable undershelf brackets and the feet. Those tasks need no polishing equipment, and they can be done on the frame before it is polished, as long as the parts are protected. Station A has about 56 minutes of slack against takt. The owner moves the undershelf and feet fitting to Station A, which now receives each welded frame back briefly before it goes to polishing. The route becomes A, B, A, C.

The new station times are:

- **Station A**: 96 + 30 = **126 minutes**;
- **Station B**: **116 minutes**;
- **Station C**: 160 − 30 = **130 minutes**.

The bottleneck and line balance tool now reports all stations within takt, Station C still the longest at **130 minutes**, **85.5%** of takt, and a line balance efficiency of **95.4%**. The line can now make about 456 ÷ 130 = **3.5 benches a day**, comfortably above the required three.

```figure
type: compare
title: Station times before and after moving the undershelf and feet fitting
cols: Before | After | Share of takt after
caption: This is an illustration. Results from the bottleneck and line balance tool at a takt of 152 minutes. The total work is unchanged at 372 minutes a bench; only its distribution changes.
- Station A, cut, fold, fit shelf and feet | 96 | 126 | 82.9%
- Station B, weld with fixture | 116 | 116 | 76.3%
- *Station C, polish, assemble, inspect, pack | 160 | 130 | 85.5%
- Line balance efficiency | 77.5% | 95.4% |
```

The total work content per bench has not changed: it is still 372 minutes. But because the line runs at the pace of its slowest station, moving 30 minutes from the slowest to the fastest raised the line's capacity by about 23%, from 2.85 to 3.5 benches a day. That is the central lesson of balancing divided work: **where the work sits matters as much as how much of it there is.**

## Other ways to relieve the constraint

Moving tasks is one remedy. Several others are cheap, and the owner uses some of them in busy weeks.

- **Protect the constraint's time.** Station C should never wait for work or spend time on benches that will be rejected. A quick check of each frame and top before it reaches polishing, done by Station A or the floater, stops the constraint polishing a frame that later fails inspection.
- **Stagger breaks.** If the polisher's break is covered by the floater, the constraint keeps working through the break, adding effective minutes to the busiest station without adding anyone.
- **Move inspection off the constraint.** Final inspection is currently part of Station C's 130 minutes. Some of it, such as checking dimensions and paperwork, could be done by the floater after polishing, leaving Station C to polish and assemble.
- **Add capacity only at the constraint.** If more output is needed, a second polisher, part-time or the floater, adds capacity where it matters. A second welder would not.

Each of these follows the same logic. An hour gained at the constraint is an hour gained for the whole line. An hour gained anywhere else is an hour of extra waiting.

## Coordinating divided work

Smith's pin makers worked in one room where everyone could see the work move. Dividing work always creates a coordination job that generalists do not need, and in a small business it often falls to the owner by default. The bench maker's coordination is deliberately simple: a whiteboard at the end of the line showing the day's three benches, the number waiting in front of each station at the start and middle of the day, and any problem holding a bench up. A five-minute look at it each morning tells everyone where the constraint is that day and whether the floater is needed. Coordination is a real cost of dividing work. Keeping it visible and brief stops it becoming a hidden one.

## The new route has costs

Moving the fitting to Station A is not free. The bench now visits Station A twice, which adds a short handling step and a chance of mix-ups between frames waiting for fitting and new tops waiting for folding. The fitted brackets must be protected during polishing. And Station A's work is now more varied, which slightly reduces the switching gain from Chapter 3.

The owner manages these with simple measures: a marked area for frames returning from welding, a protective sleeve for the brackets, and a fixed time each morning for the fitting work at Station A. These are small costs against a 23% gain in line capacity, but they belong in the decision. A balance that looks perfect in a calculation can introduce handling errors that cost more than they save.

## People and stations are not the same

The line has three stations, but the business has four people, as the staffing calculation in Chapter 1 required. The labour content of three benches a day is 3 × 372 = 1,116 minutes, about **2.45 person-days**, so three people at the stations are each busy about 82% of the time on average, and the fourth person is free for other work.

The owner uses the fourth person as a **floater**: covering the constraint in busy weeks, building custom benches by the generalist method, packing and dispatch, and providing leave cover after cross-training. This arrangement keeps the stations' pace steady while giving the business the flexibility that dedicated stations lack. It also means the 3.60 full-time equivalents from Chapter 1 are spread across people rather than tied rigidly to stations.

## Variation and small buffers

The station times above are averages. On a given day a top may need extra polishing, or a frame may need a weld repaired, and a station's time for that bench may run well over the average. In a line with no space between stations, one slow bench stops the station after it, which waits, and blocks the station before it, which cannot pass on its finished work.

A small buffer of one or two benches between stations absorbs most of that variation. It costs a little floor space and a little work in progress, examined in Chapter 7, and it is usually worth it in a small workshop where times vary more than on an automated line. The bottleneck tool's check makes the same point: use observed cycle times over several cycles, not best-case times, and allow for variation before concluding the line has enough capacity.

```figure
type: checklist
title: Balancing divided work
caption: This is an illustration. The owner's checks after rebalancing. The open item is the positioner, deferred until it would relieve the constraint.
- x Takt set from net available time and required output
- x Constraint found from station times and confirmed by where work waits
- x Tasks moved to stations with slack, total work unchanged
- x Handling, mix-ups and protection checked for the new route
- x Small buffers between stations to absorb variation
- ? Improvements at non-constraint stations only where they relieve the constraint
```

## Exercise: when demand rises again

After six months, the distributor asks whether the business can supply **17** or **18** benches a week. Over a five-day week the available time is 5 × 456 = **2,280 minutes**. Using the bottleneck and line balance tool's method with the rebalanced station times (126, 116 and 130 minutes), find the takt and the constraint's load at each volume, and say what the business would need to do for 18.

**Worked answer.** At **17 a week**, takt is 2,280 ÷ 17 = **134.1 minutes**. Station C at 130 minutes is at **96.9%** of takt and Station A at 126 minutes is at 93.9%. All stations meet takt, but with very little margin: any variation will cause missed output, and the tool flags both as near takt.

At **18 a week**, takt is 2,280 ÷ 18 = **126.7 minutes**. Station C at 130 minutes is at **102.6%** of takt and is the constraint; Station A at 126 minutes is at 99.5%. The line can make about 2,280 ÷ 130 = 17.5 benches a week, half a bench short.

For 18, the business would need to reduce Station C's time by at least about 3.3 minutes, or add capacity there, for example by having the floater polish for part of each day. Moving more work from C to A is no longer an option, because A is also at takt. This is the point at which the improvement deferred earlier becomes worth revisiting, but at Station C, the constraint, not at the welding station. The polishing jig in Chapter 4's exercise, saving 12 minutes a bench at Station C, would bring it to 118 minutes and give a comfortable margin at 18 a week.
