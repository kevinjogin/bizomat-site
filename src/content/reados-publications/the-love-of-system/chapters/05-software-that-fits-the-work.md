---
book: the-love-of-system
chapterSlug: software-that-fits-the-work
order: 5
title: "Software that fits the work: fix the process, then choose the system"
description: "A scheduling and monitoring system judged by the end it serves: test process readiness before buying, compare building with buying over the full cost, and give every screen a decision to support."
draft: false
---

Software is the purest contrivance a business buys. It has no weight, no swarf and no guarding, and its beauty is entirely in its order: every job in its place, every machine on a screen, every date calculated. That makes it especially attractive to someone with a love of system, and especially easy to buy for its own sake.

This chapter takes the job shop's second proposal, a custom scheduling and machine-monitoring system with live dashboards, and judges it by the end it should serve: on-time delivery. It tests whether the shop's scheduling process is ready for software at all, compares building a custom system with buying a package, and shows what happened to a free trial of live dashboards when nobody asked which decision they supported.

## The proposal

This is an illustration. A local software developer has offered to build the shop a custom system for about **A$60,000**, plus about **A$6,000** a year of support. It would hold every job, route it through the machines, calculate a schedule, and collect live status from each machine through sensors on the controllers. A large screen in the office would show every machine, green when cutting, amber when idle, red when stopped, and every job's place in the queue.

The owner likes it very much. He has sketched some of the screens himself.

The end, from Chapter 1, is to raise on-time delivery from **78%** to **90%** and to cut typical lead time from about four weeks to three. The question is how much of that the system would deliver, and whether something simpler would deliver more.

## How the shop schedules now

Before judging software, the owner describes the current process honestly.

- **Due dates** are promised by the office when an order is taken, based on the customer's request and a feeling for how busy the shop is. Nobody checks the lathe's queue before promising.
- **Routing** is in the operators' heads. Most jobs follow obvious routes, but nobody has written down which machines each job type needs or in what order.
- **Job times** are estimated in the quote and never compared with actual times, so the estimates have drifted.
- **The schedule** is a whiteboard in the workshop and a spreadsheet in the office, updated by different people at different times. They often disagree.
- **Priorities** change when a customer calls, which is often.

A scheduling system would take all of this as its input. If the inputs are unclear, inconsistent and unreliable, the system will produce a clear, consistent and precise schedule that is wrong.

## Test readiness before choosing software

The [process or software readiness tool](/tools/process-or-software/) in BIZOMAT Tools gives a structured answer to the question of whether software will help yet. The user rates five things from 1 to 5: how clearly the process is defined, how consistently it is followed, how much manual effort it takes, how exposed it is to errors, and how ready the data are. The tool combines clarity, consistency and data readiness into a process foundation score out of 100, and manual effort and error exposure into an automation pressure score. Its rule is that below a foundation of 55, the process should be fixed before software is chosen, because software would otherwise automate the inconsistency.

The owner and the production supervisor rate the current process: clarity **2**, consistency **2**, manual effort **4**, error exposure **4**, data readiness **2**. The tool gives a process foundation of **40/100** and an automation pressure of **80/100**, and its verdict is **fix the process first**.

The pressure is real: scheduling takes a lot of effort and errors are frequent. But the foundation is too weak for software to stand on.

## Fix the process

The owner spends three months on the process, with no software purchase:

1. **Write the routing** for the shop's main job types: which machines, in which order, with standard times by part family.
2. **Record actual times** on every job card and compare them weekly with the quoted times, adjusting the standard times as evidence accumulates.
3. **Schedule from the constraint.** Each morning, a ten-minute meeting sets the lathe's sequence for the day first, because the lathe is the constraint for turned work, then fits the other machines around it.
4. **Promise dates from the queue.** Before a turned order is promised, the office checks how many hours of work are already waiting for the lathe and promises accordingly.
5. **One schedule.** The whiteboard becomes the single schedule; the spreadsheet becomes a record of what was done.

Three months later, the owner and supervisor re-rate the process: clarity **4**, consistency **4**, manual effort **4**, error exposure **4**, data readiness **3**. The tool gives a foundation of **73/100**, the same pressure of 80, and the verdict **software may help**.

```figure
type: compare
title: Scheduling process readiness, before and after three months of process work
cols: Clarity | Consistency | Data | Foundation | Verdict
caption: This is an illustration. Results from the process or software readiness tool, with manual effort and error exposure rated 4 throughout. Nothing was bought; the process was written down and followed.
- Before | 2 | 2 | 2 | 40/100 | Fix the process first
- *After three months | 4 | 4 | 3 | 73/100 | Software may help
```

The process work had an effect of its own. Over the three months, on-time delivery for turned parts rose from 78% to about **85%**, mostly because dates were now promised from the lathe's real queue and the lathe's sequence was set deliberately each morning, and partly because the quick-change workholding from Chapter 2 arrived in the second month. The end moved before any software was bought.

## Build or buy

With the process ready, the question becomes which software. The developer's custom system is one option. Several packaged scheduling and job management systems for small manufacturers are another; the owner shortlists one that fits the shop's routing and job card process well, at about **A$8,000** to set up and **A$1,100** a month.

The [build or buy software tool](/tools/build-buy-software/) compares a custom build with a package over a period. It totals the custom build cost and annual support, and the package's set-up and monthly fees, over the chosen number of years, and weighs the package's fit against how unique the requirement is and how much control the business needs, each rated 1 to 5. Its checks warn that custom builds carry schedule, quality and key-person risk, and that the package's fit should be confirmed against written requirements.

Over three years, with the package's fit rated **4**, the uniqueness of the requirement **2** and the need for control **3**, the tool gives:

```figure
type: compare
title: Three-year cost of a custom system and a package
cols: Set-up | Running cost over three years | Total cost of ownership
caption: This is an illustration. Results from the build or buy software tool, excluding GST. With good package fit and no unusual requirement, the tool's verdict is to buy.
- Custom build | A$60,000 | A$18,000 | A$78,000
- *Package | A$8,000 | A$39,600 | A$47,600
```

The tool's verdict is **buy**. The custom system would cost about **A$78,000** over three years against about **A$47,600** for the package, and the shop's scheduling requirement, once written down, turned out to be ordinary: a job shop with routings, a constraint and promised dates. The custom system's appeal lay in its screens and its tailoring, both features of the contrivance rather than requirements of the end. The [chapter on choosing an ERP system for a small manufacturer](/reados/collections/business-systems-security-and-it-decisions/choosing-an-erp-system-for-a-small-manufacturer/) covers the wider selection process.

## The failure case: dashboards nobody watched

Before the process work, the owner had accepted a free one-month trial of a machine-monitoring service, with sensors on the lathe and one machining centre and a live dashboard on a large screen in the office. It looked superb. Every visitor commented on it.

At the end of the month, the service's own usage report showed how often the dashboard had been opened on staff computers, and the owner noted who looked at the office screen. In the first week, people checked it constantly, about forty times a day. By the fourth week, about three times a day, mostly by the owner. In the whole month, the owner could not name a single scheduling decision that had been made differently because of it.

The dashboard showed machine status updated every few seconds. The shop's scheduling decisions were made once a day, at the morning meeting, and its capacity decisions once a week. The data were vastly more precise than any decision that used them, Smith's watch in software form.

### How it is detected

The detection is a simple question asked of every screen, report and alert: **which decision does this support, who makes it, and how often?** If the answer is "nobody in particular" or "it's good to know", the screen is admired, not used. If the decision is daily, the data need to be daily, and a summary at the decision is worth more than a live feed in between.

### How it is corrected

The shop keeps one thing from the monitoring trial and drops the rest. The lathe's daily summary, hours cutting, hours in changeover, hours stopped and why, is genuinely useful at the morning meeting and in the weekly review, because it tracks the constraint's losses that Chapter 2 identified. The package the shop buys can produce that summary from job card data, without sensors. The live office screen is not renewed.

```figure
type: checklist
title: A screen earns its place when
caption: This is an illustration. The owner's test for any dashboard, report or alert, applied after the monitoring trial. The open item is the one the shop found hardest to keep to.
- x It supports a named decision
- x The person who makes that decision looks at it when they make it
- x Its refresh rate matches the decision's frequency
- x It shows the constraint's losses, not every machine equally
- x Someone acts differently when it changes
- ? It is removed when its decision no longer needs it
```

## The data the system will run on

A scheduling system's output is only as good as three inputs: the routings, the standard times and the record of what has been done. The three months of process work improved all three, but the data readiness rating rose only to 3, and the reason matters. Standard times for the shop's most common part families are now based on recorded actual times; for rarer jobs they are still estimates from the quote. A schedule built on those estimates will be precise and partly wrong.

The owner sets two rules before the package goes live. Every job card records actual set-up and run times, which the package uses to update its standard times. And any job whose actual time differs from its standard by more than a quarter is flagged for review at the weekly meeting, so the standards improve where they are weakest. Software makes good data more useful; it does not make poor data better, and a confident schedule built on poor data is worse than an uncertain whiteboard, because people believe it.

## Introduce it in stages

The package will change how the office and the workshop work, and Chapter 6 deals with how to introduce change without arranging people like chess pieces. For the software, the owner chooses a staged start: first the job list and routings, used alongside the whiteboard for a month; then scheduling of the lathe only, the constraint, for another month; then the other machines. Each stage is reviewed before the next begins. A staged start is slower on paper and faster in practice, because problems are found while they are small and while the old method still exists as a fall-back.

## What the system is worth now

With the process fixed, the remaining question is what the package adds to the end. On-time delivery has reached about 85% without software. The package is expected to save the office several hours a week of manual schedule updating, to make promised dates more consistent, and to keep actual times recorded reliably, which supports better quotes. The owner estimates that together these could take on-time delivery to the 90% target. That estimate is checked in Chapter 8, after a year of use.

The contrast with the original proposal is instructive. The custom system was designed to show the shop beautifully. The package, chosen after the process was fixed, is designed to run the process the shop actually has. The first would have cost more and, by the evidence of the monitoring trial, been looked at less.

## Exercise: rate a different process

The owner applies the readiness tool to the shop's purchasing process, which the package could also handle. Purchasing is done by the office manager, who knows every supplier and does it consistently, but nothing is written down; it takes a moderate amount of effort with few errors; and supplier and price data sit in an old spreadsheet in good order. He rates clarity **3**, consistency **4**, manual effort **3**, error exposure **2**, data readiness **4**. What do the tool's scores and verdict tell you, and what would you do?

**Worked answer.** The process foundation is (3 + 4 + 4) ÷ 15 × 100 = **73/100**, above the threshold of 55. The automation pressure is (3 + 2) ÷ 10 × 100 = **50/100**, below the tool's 60 for "software may help". The verdict is **improve the process**: the process is sound enough for software, but there is not much pain for software to relieve.

The sensible step is to write down the office manager's purchasing knowledge, which is the main risk, since it lives in one person's head, and to leave purchasing out of the first phase of the package. If the package's purchasing module turns out to cost little extra and fits the written process, it can be added later. Buying it now because it is available would be adding a contrivance to a process that is not asking for one.
