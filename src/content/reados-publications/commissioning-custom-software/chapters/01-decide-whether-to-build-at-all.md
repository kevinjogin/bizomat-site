---
book: commissioning-custom-software
chapterSlug: decide-whether-to-build-at-all
order: 1
title: "Decide whether to build at all"
description: "Compare buying, configuring and building software on fit to must-have needs and five-year cost, include the hidden costs of each, and build only what nothing else can do."
draft: false
---

Custom software is the most flexible and the most expensive way to solve a business problem. It does exactly what you ask, if you ask clearly, and it is yours to maintain for as long as you use it. Off-the-shelf software is cheaper to start and comes with someone else's roadmap, someone else's support and someone else's idea of how your work should be done. Between the two sit configurable products and modules of systems you already own. Each option is right for some problems and wrong for others, and the most expensive mistake in commissioning software is building something that could have been bought.

This chapter makes the build-or-buy decision for the machining business's job tracking. It states the problem in measurable terms, lists the must-have needs, compares an off-the-shelf product, a module of the existing system and a custom app on fit and five-year cost, counts the hidden costs of each, and decides. The failure case is the business's earlier custom database, built by a relative, which nobody could maintain once he left.

## State the problem in numbers

Before looking at any software, the owner and the operations manager wrote down what was wrong and what it cost. This is an illustration.

- The production supervisor spends about **6 hours a week** walking the floor and phoning operators to find job status for customers and for the morning meeting: about **288 hours** a year, about **A$23,040** at an internal cost of A$80 an hour.
- About **18%** of the roughly 350 jobs a month ship late, and the business usually learns a job is late on the day it was due.
- Actual times per operation are not recorded, so quotes use estimated times that nobody can check.
- Scrap is noticed but not counted, so its cost and causes are unknown.
- Customer inspection records are kept on paper with each traveller, and finding one for an audit takes up to an hour.

Writing the problem down this way did two things. It gave a value against which any option could be judged. And it showed that the problem was information, not software: the business needed to know job status, times, scrap and inspection results without walking the floor. Software was one way to get that information, not the goal, and keeping that in view protected the project from becoming a technology purchase looking for a purpose.

## List the must-haves, and only the must-haves

Every software project collects wishes. The owner separated needs into must-haves, without which the solution would not solve the problem, and nice-to-haves. The must-haves were twelve:

1. Operators record start, pause and finish of each operation at the machine, in seconds.
2. It works in the back bay, where the Wi-Fi is unreliable, and catches up when the connection returns.
3. Job status is visible to the supervisor and office in real time.
4. Late-running jobs are flagged before their due date.
5. Scrap is recorded with quantity and reason.
6. Inspection results are recorded against the job in each customer's required format.
7. It reads jobs and routings from the existing job and accounting system, without retyping.
8. It sends actual times back to that system for costing.
9. Each operator logs in with their own identity.
10. Records are kept for at least seven years.
11. It works on the rugged tablets the business already owns.
12. The business owns or can export all its data at any time.

Twelve must-haves is enough to be specific without describing a product. Nice-to-haves, such as dashboards on a big screen, maintenance scheduling and operator training records, were listed separately and set aside. Each must-have was tested with one question: if the solution lacked this, would we still buy it? Three items moved from the first draft's must-have list to nice-to-have on that test, which kept the comparison honest.

## Three options

The operations manager looked at three kinds of solution, with the help of an independent adviser for a day.

- **An off-the-shelf job-shop tracking product**, sold as a subscription, used by many machining businesses.
- **The job-tracking module** of the business's existing job and accounting system, which the vendor offered as an add-on.
- **A custom app** built by a local developer, connected to the existing system.

```figure
type: compare
title: Three ways to get shop-floor job tracking
cols: Must-haves met of 12 | Five-year cost, excluding GST | Main concern
caption: This is an illustration. Costs come from quotes and estimates; the off-the-shelf cost excludes the replacement of the existing system that full integration would have needed.
- Off-the-shelf product | 9 | about A$79,500 | no link to the existing system without replacing it
- Existing system's module | 7 | about A$54,000 | no offline use; inspection records too rigid
- *Custom app | 12 | about A$153,600 | cost and long-term dependence on support
```

**The off-the-shelf product** met nine of the twelve. It handled offline use well and its inspection records were flexible. It could not read jobs from, or send times to, the business's existing system, because the product expected to be the business's main system itself. Using it fully would have meant replacing the existing job and accounting system, a separate project estimated at a further A$60,000 or more, with the disruption of changing the system everyone used daily. Its cost was a set-up fee of about A$12,000 plus about A$13,500 a year for 25 users, about **A$79,500** over five years without the replacement.

**The existing system's module** met seven. It was cheapest, about A$30,000 to set up and A$6,000 a year from the second year, about **A$54,000** over five years. It needed a constant connection, which failed in the back bay, and its inspection records could not match the formats three major customers required.

**The custom app** met all twelve, by definition, at an estimated **A$96,000** to build and about **A$14,400** a year for support and hosting from the second year, about **A$153,600** over five years.

## Try before deciding

Descriptions and demonstrations show software at its best. The off-the-shelf vendor offered a free month's trial, and the operations manager used it on two machines with two experienced operators. The trial confirmed the offline handling in the back bay and showed that operators picked it up within a day. It also showed something the demonstration had hidden: entering a job meant retyping it from the existing system, about four minutes per job, which across 350 jobs a month would have been more than 23 hours of office time, roughly the supervisor time the project was meant to save. That one finding did more to clarify the decision than any feature comparison.

## Talk to businesses that chose each path

The adviser arranged short calls with three businesses: one using the off-the-shelf product, one that had commissioned custom shop-floor software from a developer, and one using its accounting vendor's module. Each was asked what they would do differently. The off-the-shelf user said they had changed some of their own processes to fit the product, and were glad they had. The custom-software business said the build had gone well but that they had underestimated the time their own staff needed for testing and training, and had not budgeted enough for support after the first year. The module user said it was fine for simple jobs and frustrating for anything unusual. Those three conversations, an hour in total, shaped the conditions the owner attached to the decision below.

```figure
type: decision
title: Build, configure or buy?
question: Does a product you can buy or configure meet every must-have that matters daily, at an acceptable total cost?
caption: This is an illustration of the reasoning the owner used. The answer depends on the must-haves, which is why they come first.
- Yes | Buy or configure | adapt your process where the product's way is reasonable; build nothing
- Nearly, but integration fails | Buy and connect | a small custom connector may be cheaper than a full custom system
- *No, and the gaps matter daily | Build, narrowly | custom software for the must-haves only, with ownership and support planned
```

## Count the hidden costs

The five-year figures leave out costs that differ between options:

- **Changing how people work.** The off-the-shelf product came with its own way of running a job shop, close to but not the same as the business's. The custom app would match current practice, which is comfortable but may preserve habits that should change.
- **Integration.** The off-the-shelf product's lack of a connection to the existing system meant either double entry or replacing that system.
- **Dependence.** A product used by hundreds of businesses has a vendor whose survival does not depend on any one customer. A custom app depends on one developer, or on the business's ability to find another who can take over the code. Chapters 4 and 8 deal with this risk directly.
- **The owner's time.** Custom software needs far more of the business's own time during the project, for the brief, decisions, testing and training. The owner estimated about 150 hours from the business across the project.

```figure
type: bars
title: Five-year cost including the hidden costs the business could estimate
unit: A$ thousands, excluding GST
max: 180
caption: This is an illustration. The off-the-shelf figure adds the estimated replacement of the existing system; the custom figure adds about 150 hours of the business's own time at A$80 an hour.
- Existing system's module | 54
- *Custom app, with the business's time | 165.6
- Off-the-shelf, with system replacement | 139.5
```

With the hidden costs, the gap between custom and off-the-shelf narrowed from about A$74,000 to about A$26,000. The module remained cheapest but failed must-haves that mattered daily, including offline use and the customers' inspection formats.

## Decide

The owner chose the custom app, with three conditions drawn from the analysis. The scope would be limited to the twelve must-haves. Nice-to-haves would wait until the app proved itself. The business would own the code and data outright, as Chapter 4 describes. And the decision would be revisited if quotes came in more than 20% above the A$96,000 estimate, in which case the off-the-shelf product with a system replacement would be reconsidered.

Against a measurable value of about A$23,000 a year in supervisor time alone, plus better on-time delivery, real costing data and faster audits, the custom app was expected to repay its cost in about four to five years on supervisor time, and sooner if the on-time and costing benefits appeared. The owner accepted that the larger benefits were the ones hardest to measure in advance, and planned to measure them afterwards.

The decision was written up on two pages: the problem in numbers, the twelve must-haves, the three options with their costs and gaps, the hidden costs, the choice and its conditions. That record proved its worth twice. When the first quotes arrived, the owner checked them against the conditions rather than against a feeling. And eighteen months later, when a director asked why the business had not simply bought a product, the answer was on paper, with the reasons that had been true at the time.

## A failure case: the database nobody could change

This is an illustration. Four years earlier, the owner's nephew, studying information technology, had built a desktop database to track jobs. It worked well for two years. Then he took a job interstate. Nobody else understood how it worked, the code had no documentation, and it ran on one office computer under his personal software licence. When a routine operating system update stopped one of its forms working, nobody could fix it, and the business drifted back to paper and spreadsheets.

The lesson was not that custom software is a mistake. It was that custom software is a long-term commitment that needs an owner, documentation, ownership of the code and the tools to build it, and a support arrangement that does not depend on one person's goodwill. The detection came when the software failed and nobody could repair it, which is the moment every unowned system eventually reaches. The new project wrote those requirements into the brief and the contract from the start.

## How this applies to a small Australian business

Small Australian manufacturers are often told they need either a large off-the-shelf system or nothing. There is a middle path, but it is not free. State the problem in hours and dollars, list no more than a dozen must-haves, and compare at least one bought option honestly before commissioning anything. Count the business's own time, the cost of changing how people work and the risk of depending on one developer. The general considerations in choosing business systems are covered in [Choosing an ERP system for a small manufacturer](/reados/collections/business-systems-security-and-it-decisions/choosing-an-erp-system-for-a-small-manufacturer/).

## Exercise: fixing the Wi-Fi first

An IT provider says that adding three wireless access points to the back bay, for about **A$4,000**, would give the existing system's module reliable connectivity, so that it meets the offline must-have. The module would then meet eight of twelve. Would you change the decision? What would the module's five-year cost be, and what must-haves would still be missing?

**Worked answer.** The module's five-year cost becomes about **A$54,000 + A$4,000 = A$58,000**, still far below the custom app. It would meet **8** must-haves. Still missing would be customer-format inspection records (6), and three others on the original list that the module did not support. Whether to change the decision depends on how important those are. If the inspection formats are required by major customers' contracts, the module still fails a must-have that matters daily. A reasonable step is to fix the Wi-Fi anyway, since every option benefits from it, and ask the module's vendor whether the inspection formats can be configured before committing to the custom build.
