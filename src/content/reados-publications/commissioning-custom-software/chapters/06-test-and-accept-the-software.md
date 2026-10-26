---
book: commissioning-custom-software
chapterSlug: test-and-accept-the-software
order: 6
title: "Test and accept the software"
description: "Turn acceptance criteria into tests, test the whole system under real load and integrations, classify defects by severity, run old and new in parallel and accept only against agreed rules."
draft: false
---

Each increment in Chapter 5 was accepted on its own stories. Final acceptance asks a larger question: does the whole system do the job, under real conditions, connected to the existing system, with every operator, for long enough to trust it? Increment testing finds most problems. Final testing finds the ones that only appear when everything runs together, under a full day's load, through a night's integration run, over weeks rather than hours.

This chapter takes the job-tracking app through final acceptance. It builds a test plan from the acceptance criteria, tests the system end to end under realistic load, checks the integration by reconciling numbers between the two systems, classifies defects by severity with clear acceptance rules, and runs paper and app in parallel for two weeks before switching. The failure case is a reconciliation that found times for jobs paused overnight counted twice, which would have distorted every job cost the app produced.

## Build the test plan from the brief

The acceptance criteria written in Chapter 2 became the test plan. Each criterion produced one or more test cases: a set-up, an action and an expected result. Story 1's criterion that "starting, pausing and finishing each take no more than two taps after the scan" became a test in which a tester scanned a traveller and counted taps. The criterion that "the action completes in under one second at the machine, with or without a network connection" became two tests, one online, one with the tablet's network switched off, each timed.

This is an illustration. The twelve must-haves produced about **60** test cases. The product owner wrote them with the developers' tester, who added cases for errors, such as scanning a traveller for a job not yet released, and for edge cases from the supervisor's description of a day in Chapter 2: jobs split between machines, reworked parts, the Friday rush.

## Test the whole system together

Final testing used the real tablets at real machines, the real hosting environment and a test copy of the existing job and accounting system, loaded with a recent month's jobs.

```figure
type: steps
title: The stages of final testing
caption: This is an illustration. Each stage built on the previous one; the parallel run was the only stage that used live production jobs.
- Functional | every test case run by the tester and the product owner, results recorded
- Load | a simulated busy day, 18 tablets, about 300 scans in four hours, 6 tablets offline for 8 hours then reconnected
- Integration | jobs imported every 15 minutes for a week; nightly time exports reconciled against the app
- Security | each role tried every function it should and should not reach; logins tested for shared or weak passwords
- *Parallel run | two weeks of live jobs on paper and app together, compared daily
```

The load test was deliberately harder than a normal day: about **300** scans in four hours, against about 200 in a normal day, with six tablets disconnected for a whole shift and reconnected together. The system handled it, with every action under one second and every offline record synchronised in order. A harder-than-normal test gives a margin: a system that copes with a day half again as busy as usual will cope with the busiest real days, such as the end of a quarter, when the business can least afford a problem. Load testing found one problem: when all six tablets reconnected at once, the job-status screen in the office froze for about 40 seconds while it processed the backlog. The developers changed the screen to update progressively, and the retest passed.

## Reconcile the numbers between systems

Integration tests that only check whether files transfer miss the most important question: are the numbers right? The product owner reconciled the two systems daily during integration testing and the parallel run. For each job, the total of the operation times recorded in the app was compared with the times imported into the existing system for costing. The counts of jobs, operations and scrap records were compared too. Any difference was investigated the same day, while the jobs were fresh in everyone's memory.

## Classify defects and agree the rules

Every problem found was logged with its severity, using definitions agreed in the contract:

- **Critical:** a must-have does not work, data is lost or corrupted, or the system cannot be used.
- **Major:** a must-have works incorrectly in some cases, with a workaround.
- **Minor:** cosmetic, or an inconvenience with an easy workaround.

The acceptance rules were set before testing began: no critical or major defects open at acceptance; no more than ten minor defects open, each with an agreed fix date within the warranty period.

```figure
type: stack
title: Defects found in final testing, by severity
unit: defects
caption: This is an illustration. All critical and major defects were fixed and retested before acceptance; eight minor defects remained open with fix dates inside the warranty.
- Minor | 22
- Major | 7
- Critical | 2
```

About **31** defects were found in final testing: **2** critical, **7** major and **22** minor. The two critical defects were the overnight time doubling described below and a fault in which an inspection record could be saved against the wrong operation if the operator switched jobs mid-entry. Both were fixed and retested within a week, and each gained a permanent test case. At acceptance, eight minor defects remained open, within the agreed rule.

## Run old and new in parallel

For two weeks before switching, every job ran on both the paper travellers and the app. Operators recorded their work on the tablet as normal and also filled in the traveller. Each day, the supervisor compared a sample of jobs on both, and the product owner ran the reconciliation.

Parallel running doubles some of the operators' work for two weeks, which they tolerated because they had been involved since increment 1. It is the only test that compares the new system with the real work it replaces, day after day, before the old way is abandoned.

## What the parallel run showed

This is an illustration. Over the two weeks, about **170** jobs ran on both paper and app. The supervisor compared about **50** in detail, and the product owner reconciled all of them.

```figure
type: compare
title: Two weeks of paper and app in parallel
cols: Paper travellers | App
caption: This is an illustration from the parallel run. Most differences were the paper's, which was the point: the app recorded what paper had always missed.
- Operations with start and finish recorded | about 70%, many filled in at the end of the shift | 100%, at the time of the action
- Scrap recorded with a reason | about a third of scrap events | all, once operators were reminded in the first two days
- Jobs whose status the office knew without asking | none | all, in real time
- *Differences in job totals after the export fix | not applicable | none outside rounding
- Inspection records found for an audit sample of 10 jobs | 10, in about 35 minutes | 10, in under 3 minutes
```

The comparison showed what the business had been missing. Nearly a third of operations on paper had times written in from memory at the end of a shift, and two thirds of scrap events had never been recorded at all. The app was not just as good as paper. It recorded things paper had always lost, which also meant the business's first month of app data looked worse than its paper history: more scrap, more late jobs. That was not the app's fault. It was the truth, visible for the first time, and the owner warned the managers in advance so that nobody blamed the new system for it.

## Who tests

Testing was shared, deliberately. The developers' tester ran the functional and load tests, because they knew how to set up difficult cases. The product owner ran the integration reconciliations and checked every acceptance criterion personally, because acceptance was the business's decision, not the developer's. The supervisor and four experienced operators ran the floor tests and the parallel run, because only they could tell whether the app fitted the real work. The office's accounts officer checked the costing figures in the existing system after the nightly imports, because they would be the first to notice a costing error in practice.

No single group could have found everything. The developer's tester would never have spotted a reworked part being counted against the wrong job, and the operators would never have found the 40-second freeze when six tablets reconnected.

## Test the things you hope never to need

Two tests checked promises the business hoped never to rely on. The first was a **restore**. The brief required a tested restore from backup within one working day. Before acceptance, the developers restored the previous night's backup to a separate environment while the product owner watched, and the product owner checked that a sample of the day's jobs and inspection records were present. It took about three and a half hours, within the promise. Backups that have never been restored are a hope, not a safeguard.

The second was an **independent build**. The contract in Chapter 4 required that another developer could build the system from the business's repository using the written instructions. The business paid an independent developer for half a day to try. They succeeded, with two small corrections to the instructions, which the developers made before acceptance. That half day was the best evidence the business had that the code it owned was code it could actually use without its original developer.

## Keep the tests for the future

The test plan did not end at acceptance. The developers turned as many test cases as possible into automated tests that run every time the code changes, including the overnight-pause reconciliation and the offline reconnection. The rest, mostly floor tests with real tablets, became a short checklist the product owner runs before accepting any future change. When the support developer in Chapter 8 makes a change two years from now, those tests will show whether anything that worked at acceptance has broken. A business that keeps its acceptance tests keeps the ability to judge future work, whoever does it.

## A failure case: times counted twice

This is an illustration. On the third day of integration testing, the reconciliation showed that for about one job in eight, the time imported into the existing system was larger than the app's total for that job. The difference was not random. Every affected job had an operation that was paused at the end of a shift and resumed the next morning.

The developers traced it to the nightly export. For an operation paused overnight, the export included the time up to the pause as a completed segment and then, when the operation finished the next day, included the whole operation's time from its original start, not just the time since resuming. The overnight segment was counted twice. For an operation paused after three hours and finished after another two, the existing system received **3 + 5 = 8** hours instead of **5**.

Had the defect reached live use, every job with an overnight pause would have been costed too high, quietly distorting the business's view of its most complex jobs, and the quoting times that Chapter 1 hoped to improve would have been worse than the estimates they replaced. The detection came from reconciling numbers, not from checking that files had transferred. The developers fixed the export to send only new time since the last export for each operation, and the product owner added a reconciliation test case that pauses an operation overnight, which now runs in every future regression test.

## Accept formally

Acceptance was a short signed document: the test plan with its results, the defect log with the open minor defects and their fix dates, the reconciliation results from the parallel run and the product owner's statement that the system met its acceptance criteria. Signing it started the 90-day warranty in Chapter 4 and triggered the payment for increment 5, less retention.

Formal acceptance matters because it fixes a point in time. After it, a problem is either a defect against the acceptance criteria, fixed under warranty, or a change, handled through change control. Without it, every later request becomes an argument about whether the work was ever finished. The developers welcomed it too: a signed acceptance told them clearly what they had delivered and what was still owed, and it ended the uncertainty of an open project for both sides.

## How this applies to a small Australian business

Small businesses often accept software by using it and hoping. Turn your acceptance criteria into test cases, test under a heavier load than normal, reconcile numbers between systems rather than just checking that data moves, and run old and new together for a short period before switching. Agree defect severities and acceptance rules before testing starts, so acceptance is a fact rather than a negotiation. The time you spend testing, perhaps a few days of your own people's time, is small next to the cost of finding a costing error after a year of quotes built on it.

## Exercise: reconciling a job

In the parallel run, a job has three operations. The app records: operation 10, 2.5 hours; operation 20, started, paused after 1.5 hours at the end of a shift, resumed the next day and finished after a further 2.0 hours; operation 30, 0.75 hours. The existing system, before the fix, received operation 20's time as the paused segment plus the full time from its original start. What total should the existing system show, what did it show before the fix, and by what percentage was the job over-costed?

**Worked answer.** The correct total is **2.5 + (1.5 + 2.0) + 0.75 = 6.75 hours**. Before the fix, operation 20 was sent as the paused segment, **1.5 hours**, plus the full time from its original start, **3.5 hours**, a total of **5.0 hours** instead of 3.5. The job total became **2.5 + 5.0 + 0.75 = 8.25 hours**. The job was over-costed by **1.5 hours**, about **22%** of the correct total. For a job quoted from these times, that is a 22% error on its labour cost.
