---
book: cad-data-you-can-trust
chapterSlug: licences-and-workstations
order: 8
title: "Licences and workstations sized from evidence"
description: "Measure concurrent CAD licence demand from server logs, remove idle sessions before buying more, find the break-even value of an extra floating licence and plan workstation refresh."
draft: false
---

CAD licences and workstations are among the largest recurring costs of a design office, and both are often bought on instinct. A team that feels short of licences buys another; a designer who feels their computer is slow gets a new one. Sometimes instinct is right. Often the real problem is something else, such as idle sessions holding licences or a settings fault slowing a computer, and money is spent without fixing it.

This chapter sizes the running case team's floating licence pool from its licence server's own records, calculates the break-even value of an additional licence without assuming any vendor's price, and sets out a workstation refresh plan based on measurement. Its error case is a request for three more licences that rested on counting sessions rather than work.

## Licence types

CAD vendors offer licences in several forms, with names and terms that vary by product. Three are common, and the vendor documentation cited in this book's references describes them for one product.

- A **node-locked** or standalone licence is tied to one computer. It suits a user who always works at the same machine, and it cannot be shared.
- A **floating** or network licence is held in a pool on a licence server. Any authorised user can take one when they start the software and return it when they finish. Because not everyone works in the software at the same moment, a pool can serve more users than it has licences.
- A **borrowed** licence is a floating licence taken out of the pool for a set period so that it can be used away from the network, for example on a laptop at a customer's site.

Many licence managers can also return a licence to the pool after a period of inactivity, so that a session left open over lunch does not hold a licence nobody is using.

The running case team has nine CAD users and a pool of six floating licences. The question is whether six is enough.

## Measure demand, not feelings

Every floating licence server keeps a log of when licences are taken and returned. From that log, it is possible to calculate how many licences were in use at any moment and how often people asked for one when none was free.

The administrator exported the log for 20 working days and sampled it every 15 minutes across an eight-hour working day, giving **32** samples a day and **640** in total. At each sample, demand was the number of people who were using, or had tried to start, the software. The licence manager had been set to return licences after 30 minutes of inactivity, for reasons the error case explains.

```figure
type: bars
title: Concurrent demand for CAD licences over 20 working days
unit: samples
max: 300
caption: This is an illustration. Each sample is a 15-minute interval; 640 samples in all. Demand above six means someone was waiting for a licence.
- Four or fewer | 288
- Five | 160
- Six | 112
- *Seven | 56
- *Eight | 20
- *Nine | 4
```

The counts add to **288 + 160 + 112 + 56 + 20 + 4 = 640**. Demand exceeded six licences in **56 + 20 + 4 = 80** samples, **12.5%** of the time. In those samples, the number of people without a licence was one, two or three.

## Convert waiting into hours

Each sample in which a person could not get a licence represents up to 15 minutes in which that person could not use the software. Summing the shortfall across all samples gives the unmet demand. With six licences:

- 56 samples with demand of seven leave **1** person short each: 56 person-samples;
- 20 samples with demand of eight leave **2** short: 40;
- 4 samples with demand of nine leave **3** short: 12.

The total is **108** person-samples, or **108 × 15 ÷ 60 = 27 hours** over 20 days. Over a year of about 230 working days, that scales to about **27 × 230 ÷ 20 = 310.5 hours**.

The same calculation for seven and eight licences gives:

```figure
type: compare
title: Unmet demand by size of licence pool
cols: Person-samples short in 20 days | Hours short in 20 days | Hours short a year
caption: This is an illustration, scaling 20 sampled days to 230 working days. Each 15-minute shortfall is counted as 15 minutes lost, which overstates the loss when people switch to other work.
- Six licences | 108 | 27 | 310.5
- *Seven licences | 28 | 7 | 80.5
- Eight licences | 4 | 1 | 11.5
```

With seven licences, only samples with demand of eight or nine leave anyone short: **20 × 1 + 4 × 2 = 28** person-samples. With eight, only demand of nine does: **4 × 1 = 4**.

## Find the break-even value

The team did not need a vendor's price list to decide whether another licence was worthwhile. It needed to know what the licence would have to cost to be worth buying, and then compare that with the quote it received.

Moving from six licences to seven reduces unmet demand from 310.5 to 80.5 hours a year, a saving of **230 hours**, worth **230 × 95 = A$21,850** a year at the internal rate. A seventh licence is worth buying if its annual cost, including maintenance or subscription, is less than that.

Moving from seven to eight saves a further **69 hours**, worth **69 × 95 = A$6,555** a year. The eighth licence has a much lower break-even value, because by then most shortfalls have already been met.

```figure
type: bars
title: Break-even annual value of each additional licence
unit: A$
max: 22000
caption: This is an illustration. Compare each value with the business's own quote for the annual cost of a licence, including maintenance or subscription.
- *Seventh licence | 21850
- Eighth licence | 6555
```

These figures are upper bounds. Not every 15 minutes without a licence is 15 minutes wasted: a designer who cannot start the software may check drawings, answer email or plan. If only half of the shortfall is really lost, every value halves, and the seventh licence's break-even falls to about A$10,925. The team asked its reseller for a quote, compared it with both the full and the halved break-even, and found the seventh licence clearly worthwhile on either assumption. The eighth was not, on the halved assumption, and the team decided to wait.

## The error case: counting sessions instead of work

Before the analysis above, the engineering manager had received a request from the designers for three more licences. Their evidence was the licence server's display, which often showed all six licences in use and a queue of people waiting. A first look at the raw log seemed to confirm it: all six licences were checked out for nearly a quarter of the working day.

The CAD administrator noticed something odd in the log. Several licences stayed checked out through the lunch hour and through the weekly design review meeting, when the people holding them were demonstrably not at their desks. Sessions were being left open while people did other things, and each open session held a licence.

The licence manager could return licences after a period of inactivity. That option had never been switched on. The administrator enabled it with a 30-minute timeout, told everyone in advance that an idle session would lose its licence and that unsaved work would be safe because the session itself stayed open, and measured again for 20 days. That second measurement is the one shown above.

The difference was large. The raw log had suggested the pool was exhausted about a quarter of the time; with idle licences returned, demand exceeded six licences 12.5% of the time, and the evidence supported one more licence, not three. The cost of the analysis was a few hours. The saving, against a request for three licences, was two licences' annual cost.

The lesson is general. A licence log records sessions, and sessions are not work. Before buying licences, make sure the pool is not being consumed by people who have walked away.

## Borrowing and travelling users

Two of the team's engineers visit customer sites to commission skids and sometimes need CAD on a laptop. A borrowed licence lets them take one from the pool for the length of a visit. While it is borrowed, it is unavailable to everyone else, which reduces the pool from seven to six for those days.

The team set a simple rule: borrow only for the days actually needed, return the licence on return to the office, and record borrowings on the shared calendar so that the administrator can see when the pool will be short. If borrowing became frequent, it would be worth repeating the demand analysis with the borrowed days removed from the pool.

Borrowing has one more trap. A laptop with a borrowed licence that is lost, stolen or broken on site may not return the licence until the borrowing period expires. Keeping borrowing periods short, a few days rather than the maximum the licence manager allows, limits how long the pool is a licence down if that happens.

## Add-ins, viewers and the vault

The core CAD licence is not the only one. Simulation, routing for pipework, advanced rendering and similar add-ins are often licensed separately, sometimes from their own pools. The vault usually needs its own licences too, possibly of more than one kind: full licences for people who check files in and out, and cheaper or free viewer licences for people who only look.

The same measurement applies to each pool. The team's routing add-in, used for skid pipework, had three licences. Its log showed that it was in use simultaneously by more than one person on only a handful of occasions in 20 days, and never by three. At the next renewal the team reduced the routing pool to two, with no complaints. The vault's viewer licences were sized for the fourteen production, purchasing and quality staff and reviewed after the first quarter, when the log showed that only about half of them used the vault directly; the others relied on the released PDF folder. The team kept the viewer licences, because they were inexpensive and occasional use was valuable, but recorded the finding for the next review.

## Review licences once a year

Licences are usually renewed on a fixed date, and the weeks before renewal are the time to review them. The team's annual licence review takes about two hours and covers every pool: the number of licences, peak and typical demand from the log, unmet demand, borrowing, and whether any add-in has gone unused. It also confirms that every licence is assigned to a current user or pool and that former staff hold nothing.

The review is also when the team checks its licence terms. Some licences restrict where software may be used, how long it may be borrowed or whether it may run in a virtual machine. Reading the terms once a year is cheaper than discovering a breach during a vendor audit.

## Plan workstation refresh from measurements

Workstations are the second half of the cost picture. CAD performance depends heavily on processor clock speed, graphics cards supported by the CAD vendor, enough memory for the largest assemblies and fast local storage. READOS's chapter on [specifying a CAD workstation](/reados/collections/cad-modelling-and-design-intent/specifying-a-cad-workstation/) explains how CAD software uses hardware.

The team plans to replace its nine CAD workstations on a cycle of about four years, which means two or three a year rather than all nine at once. Spreading the cost smooths the budget, and it means the team always has recent machines to compare with older ones.

Each candidate machine is tested before purchase with a reference assembly: the largest skid the team regularly works on. The test records the time to open the assembly, the time for a full rebuild and the time to create a standard drawing from it. The same test is run on the oldest machine in the office. A new machine that is not noticeably faster on the team's own work is not worth buying yet, however impressive its specification.

## Keep the workstations the same

Standardising workstations matters for the same reasons as standardising CAD settings. The team's IT provider builds every CAD workstation from one standard image: the same operating system build, the graphics driver version the CAD vendor certifies for the card, the CAD software at the team's current service pack and the vault client. When a new machine arrives, it is built from the image, tested with the reference assembly and then handed over.

Graphics drivers deserve particular attention. CAD vendors test specific driver versions with specific cards and publish the results. A driver updated automatically by the operating system can cause display faults or crashes that look like CAD problems. The team's machines are configured so that graphics drivers are updated only by the IT provider, to versions the CAD vendor lists, after testing on one machine.

## Exercise: test the eighth licence again

A new designer joins, making ten CAD users. The administrator expects demand to rise roughly in proportion and estimates that, with seven licences, unmet demand will grow from 80.5 to about 140 hours a year, and with eight licences from 11.5 to about 35 hours a year. On the full-loss assumption, what is the break-even annual value of the eighth licence now? On the half-loss assumption?

**Answer.** The eighth licence now saves **140 − 35 = 105 hours** a year. On the full-loss assumption its break-even value is **105 × 95 = A$9,975** a year; on the half-loss assumption it is about **A$4,988**. Both are higher than before, when the eighth licence would have saved 69 hours. Compare them with the quote. A sensible step before deciding is to repeat the 20-day measurement once the new designer is working normally, because the estimate of how demand scales is the weakest part of the calculation.
