---
book: commissioning-custom-software
chapterSlug: go-live-and-train-the-floor
order: 7
title: "Go live and train the floor"
description: "Plan a software go-live on the shop floor: readiness checks, the right date, short role-based training, floor champions, open work in progress, a paper fallback and close support for the first weeks."
draft: false
---

Software projects are often judged by the build, but they succeed or fail at go-live. A system that worked perfectly in testing can still be abandoned in its first week if operators were not shown how to use it, the tablets run flat by lunchtime, nobody knows who to ask when something odd happens, or the switch lands in the busiest week of the month. Go-live is a change in how forty people work, and it deserves as much planning as the software.

This chapter takes the job-tracking app live. It checks readiness, chooses the date, trains each role briefly and practically, appoints floor champions, brings open jobs into the app, keeps a paper fallback, communicates openly about what the app records, and supports the floor closely for the first weeks. The failure case is the second day, when tablets went flat because their chargers were in the office.

## Check readiness, not just the software

Two weeks before the planned date, the product owner ran a readiness review with the supervisor, the developers and the owner, against a checklist built up over the increments.

```figure
type: checklist
title: Go-live readiness for the job-tracking app
caption: This is an illustration of the business's readiness review. Go-live waited until every line was ticked or had an agreed workaround.
- Software accepted, with open minor defects and their fix dates known | Chapter 6
- Every machine has a tablet mounted at working height, with a charger at the machine | added after the failure case
- Every operator has a login and has completed training | records kept by the supervisor
- Open jobs entered in the app with their current operation | about 120 jobs in progress
- Paper travellers kept for two weeks as a fallback | stocked at each machine
- Staff told what the app records and why | in writing and at a toolbox meeting
- ? Developer on site for the first two days and on call for two weeks | agreed and booked
- x Going live in the last week of the month, during the dispatch rush | moved to the first Tuesday of the month
```

## Choose the date deliberately

The first proposed date was the last Monday of the month, simply because that was when the build finished. The supervisor pointed out that the last week of every month was the dispatch rush, when the floor was busiest and least tolerant of anything new. Go-live moved to the **first Tuesday** of the following month: early in the week, so problems could be fixed before the weekend, early in the month, when the workload was lightest, and not Monday, when the weekend's backlog of setup work was being cleared.

```figure
type: timeline
title: The go-live week
caption: This is an illustration of the business's cutover plan. Monday prepared everything without changing how anyone worked; the change itself started on Tuesday morning.
- Monday afternoon | Prepare | open jobs entered; tablets mounted and charged; logins checked
- Tuesday 6.30 am | Go live | first shift starts on the app; developer and champions on the floor
- Tuesday to Friday | Close support | morning stand-up; issue log reviewed daily; paper fallback at every machine
- *Friday afternoon | First review | issues, adoption and any decision about the fallback
- Following week | Steady state | developer on call; champions handle questions
```

## Train each role briefly and practically

Different people need different things from the app, and nobody needs a two-hour course on all of it.

- **Operators**, about 30, had a 20-minute session at their own machine, in groups of two or three, on a real job: log in, scan, start, pause, finish, record scrap, check the next job. Each operator then did it themselves, twice, while the trainer watched.
- **The supervisor and leading hands** had an hour on the job-status screen, late-running flags and how to correct a mistaken entry.
- **The quality inspector** had an hour on the customer inspection forms.
- **The office staff** had an hour on job status, the nightly export and what to do if the export failed.

About **30 × 20 minutes**, roughly **10 hours** of operator time, plus about **5 hours** for the other roles. The trainers were the product owner, the supervisor and the floor champions, not the developers, because people learn the new way of working better from colleagues who know the work.

## Appoint floor champions

The four operators who had tried every increment during the build knew the app better than anyone outside the developers. Each became a floor champion for a section of the factory: the first person to ask, with a short list of common problems and fixes and the product owner's phone number for anything else. The champions were paid for the extra time and thanked publicly at the end of the first month. Most questions in the first weeks were answered by a champion within a minute, without reaching the product owner at all, and the champions' notes of what people asked became the first draft of the one-page guides.

## Bring the open work across

On go-live day, about **120** jobs were already in progress, part-way through their routings. They had to be in the app with their current operation, or the job-status screen would be wrong from the start. The office staff entered them over the Monday afternoon before go-live, taking about **3 minutes** each from the travellers, about **6 hours** in total, and the supervisor checked a sample. Jobs that started after go-live came in automatically from the existing system.

## Write a one-page guide for each role

Training fades, and the first time an operator meets an unusual case may be weeks after their session. Each role has a one-page guide, laminated at each machine for operators and kept beside the supervisor's desk: the five most common actions with a picture of each screen, the three most common problems and what to do, and who to ask. The guides were written by the champions in their own words and tested on two operators who had missed the training. They replaced a twelve-page manual the developers had drafted, which the champions said nobody on the floor would read.

## Keep a paper fallback

For the first two weeks, every machine kept a supply of paper travellers. If the app failed, or a tablet could not be used, operators recorded on paper, and the office entered it later. The fallback was used twice: once during the failure case below, and once when a tablet's screen cracked. Knowing it was there made the change less stressful for operators, several of whom said so. Entries made on paper during those two incidents were keyed in by the office the same day, about twenty minutes' work each time, so the app's records stayed complete.

## Tell people what the app records

The app records who did what and when, which is information about employees. Before go-live, the owner told all staff, in writing and at a toolbox meeting, what the app records, why, who can see it and how long it is kept. It records operation start, pause and finish times, scrap and inspection results against the logged-in operator. The purpose was job status, costing and quality, not individual performance ratings. Questions were welcomed, and the most common, whether the app would be used to time people's breaks, was answered plainly: no, and the app did not record breaks at all. The business had taken advice on how workplace surveillance and privacy laws applied, as Chapter 4 noted.

## Support the floor closely, then less

For the first two days, one of the developers was on the floor all day. For the next two weeks, the developers were on call, and the product owner held a ten-minute stand-up each morning with the supervisor and champions to review the issue log from the previous day.

```figure
type: bars
title: Issues raised per working day in the first two weeks
unit: issues
max: 25
caption: This is an illustration from the go-live issue log. Most early issues were questions, not defects; day 2 includes the charging problem below.
- Day 1 | 18
- *Day 2 | 22
- Day 3 | 11
- Day 4 | 8
- Day 5 | 6
- Days 6 to 10, average | 3
```

Issues fell from about 18 on day one, and 22 on day two, to about **3** a day by the second week. Of the roughly **80** issues logged over the two weeks, about **60** were questions answered by a champion or the supervisor, about **15** were small improvements added to the list for after the warranty, and about **5** were defects, fixed under warranty.

## Watch for workarounds

In the second week, the supervisor noticed that one machine's operations were all being recorded in bursts at the end of each shift, not as they happened. The operator had found the tablet's position awkward, behind a guard they had to walk around, and was writing times on a scrap of paper and entering them later. Nobody had asked where the tablet should go; the electrician had mounted it where the power was. That defeats the purpose: status is wrong all day and times are approximate. The tablet was moved to the operator's side of the guard the same afternoon. Workarounds like this are rarely reported, because people do not think of them as problems. They show up in the data, as clusters of entries at shift end, and the product owner added a weekly check for them.

## Retire the old way

The paper fallback was meant to be temporary, and temporary fallbacks have a way of becoming permanent. At the end of the second week, with issues down to a few a day and every machine using the app, the owner announced the date, the end of the fourth week, after which travellers would no longer be printed except for the rare job run on a machine without a tablet. Operators who had kept writing on travellers as a habit, about a quarter of them in the second week, stopped within days of the announcement. A clear end to the old way matters as much as a clear start to the new one. The remaining stock of blank travellers was moved to the office, so that the fallback stayed available for a genuine failure but was no longer the easy choice at every machine.

## The first month's numbers

This is an illustration. By the end of the first month, about **97%** of operations were being recorded at the time they happened, judged by the share not entered in end-of-shift bursts. The supervisor's time spent finding job status had fallen from about six hours a week to under one, mostly spent on the job-status screen in the morning meeting. Scrap was being recorded with reasons for the first time, and, as the parallel run had warned, the recorded scrap rate was higher than the business had believed. That turned into the first improvement project the app made possible: the two most common scrap reasons, both set-up related, were addressed within the quarter.

## Thank the people who made it work

At the end of the first month, the owner thanked the operators, champions, supervisor, office staff and developers at a short gathering, with the first month's numbers on a slide. Most software projects end without anyone saying thank you to the people whose working day changed. Saying it, with evidence that the change had been worthwhile, made the next change easier to ask for.

## A failure case: tablets that went flat

This is an illustration. On day one, the tablets were fully charged from the office overnight, carried to the machines and used all day without trouble. On day two, several were collected from the machines in the afternoon, put on charge in the office and returned the next morning. Others were not, because nobody had been told to collect them.

By early afternoon on day two, about a third of the tablets were flat. Operators at those machines switched to the paper fallback. Some, frustrated, said the app "did not work". The issue log for day two shows the result: 22 issues, more than on day one.

Testing in Chapter 6 had used tablets charged in the office between tests, so it never ran a tablet for a full double shift. The readiness checklist had covered tablets and mounts but not where they would charge. The detection came on the floor, on day two, and the correction took three days: a charger and a lockable mount at every machine, wired by the business's electrician, so tablets stay at the machine and charge continuously. The checklist now includes it, as the figure above shows. The developers also added a battery indicator to the app's status bar and a warning below 20%, a small change that would have given operators an hour's notice.

## How this applies to a small Australian business

Go-live is where small businesses most often under-plan, because the software is finished and everyone is tired of the project. Check readiness on a list, choose the quietest week, train each role on real work in short sessions, let experienced colleagues lead the training, bring open work across before day one, keep a paper fallback and support the floor closely for two weeks. Tell people plainly what any system that records their work collects and why. In Australian workplaces, consulting workers about changes that affect how they work is good practice and, in many situations, part of an employer's obligations, so involve them early.

## Exercise: training a second shift

The business adds an afternoon shift with **12** new operators six months after go-live. Each needs the 20-minute machine session, and the business wants each to be observed using the app for one hour on their first shift by a champion. How many hours of training and observation does that take in total? If each champion can observe two new operators at once, how many champion-hours are needed?

**Worked answer.** Training is **12 × 20 minutes = 4 hours** of new operators' time, plus the trainer's time, about **4** hours if trained one at a time or less in pairs. Observation is **12 × 1 hour = 12 hours** of new operators' time. With each champion observing two operators at once, observation needs **12 ÷ 2 = 6 champion-hours**. The total is about **16 hours** of new operators' time and about **10 hours** of champions' and trainers' time if training is done one at a time. Training two or three at a time, as at go-live, would reduce the trainer's share.
