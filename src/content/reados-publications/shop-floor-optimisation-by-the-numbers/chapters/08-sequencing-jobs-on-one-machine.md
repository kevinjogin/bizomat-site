---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: sequencing-jobs-on-one-machine
order: 8
title: "Sequencing jobs on one machine"
description: "Order jobs on one machine for least flow time, least lateness or fewest late jobs with the shortest-first, due-date and Moore rules, and order changeovers to cut set-up time."
draft: false
---

When work queues at a single machine, the order in which it runs changes nothing about when the last job finishes: the total time is the sum of the jobs, whatever the order. But it changes everything about when each job finishes, and therefore about which customers wait, how much work sits in the shop and how many promises are broken. The laser in the running case is such a machine: every sheet-metal part in the shop starts there, so its sequence sets the pace for everything downstream.

Single-machine sequencing is unusual among the problems in this book because several of its versions have exact rules, proved best for every set of jobs, that need no search at all. This chapter applies three of them to a shift's laser jobs, checks them against an exhaustive search of all 40,320 orders, then turns to changeovers between materials, where no such rule exists. Its error is the order of arrival.

## The laser's shift

This is an illustration. At the start of Thursday's shift, eight jobs wait for the laser. Each has a cutting time, including loading and unloading, and a due time, the time in minutes from the start of the shift at which the parts are needed downstream or by the customer.

```figure
type: compare
title: Thursday's laser jobs
cols: Work | Time, min | Due, min after shift start
rowhead: Job
- L1 | job work: guard panels | 65 | 150
- L2 | EC-600 gland plates | 30 | 120
- L3 | job work: large switchboard | 90 | 330
- L4 | EC-600 mounting plates | 45 | 140
- L5 | job work: urgent brackets | 20 | 60
- L6 | EC-600 doors | 75 | 240
- L7 | job work: covers | 40 | 200
- L8 | EC-600 bodies | 55 | 300
caption: This is an illustration. The jobs total 420 minutes, the whole shift. All are the same material for now; changeovers are added later in the chapter.
```

Because the eight jobs fill the shift exactly, the last finishes at 420 minutes whatever the order. What the order decides is each job's completion time, and from it three measures: the average time a job spends waiting and being cut, called the flow time; the lateness of each job, its completion time minus its due time; and the number of jobs that finish after their due time.

## Three rules, each best at one thing

```figure
type: compare
title: Exact rules for one machine
cols: Rule | Proved best for
rowhead: Name
- Shortest processing time first, SPT | run jobs in order of increasing time | least average flow time, least average work in progress
- Earliest due date first, EDD | run jobs in order of increasing due time | least maximum lateness
- Moore's rule | EDD, but whenever a job would be late, remove the longest job so far and run it at the end | fewest late jobs
caption: Smith proved the first in 1956, Jackson the second in 1955, and Moore published the third in 1968. Each is best for its own measure and for no other.
```

Shortest first is best for flow time because each job's time delays every job behind it, so short jobs should go first, where their time delays the most jobs, and long jobs last. The average number of jobs in the queue falls with the average flow time, so shortest first also minimises work in progress, which matters on a machine that feeds the rest of the shop.

Earliest due date first is best for the worst lateness because any order that runs a later-due job before an earlier-due one can be improved, or at least not made worse, by swapping them. It is the rule most planners use by instinct, and it is right for its purpose.

Moore's rule aims for as few late jobs as possible. It works through the earliest-due-date sequence, and whenever a job would finish late, it removes the longest job scheduled so far, including that one, and moves it to the end. The removed jobs are late anyway, so they may as well be run last, and removing the longest frees the most time for the others.

## The rules on Thursday's jobs

```figure
type: compare
title: Thursday's laser sequence by each rule
cols: Order | Average flow time, min | Late jobs | Worst lateness, min | Total lateness, min
rowhead: Rule
- In order of arrival | L1 L2 L3 L4 L5 L6 L7 L8 | 241.9 | 5 | 190 | 650
- Shortest first | L5 L2 L7 L4 L8 L1 L6 L3 | 186.3 | 3 | 105 | 285
- * Earliest due date | L5 L2 L4 L1 L7 L6 L8 L3 | 193.8 | 4 | 90 | 165
- Moore's rule | L5 L2 L4 L7 L6 L8, then L1 L3 | 190.6 | 2 | 180 | 270
caption: This is an illustration. All 40,320 orders were checked: none beats shortest first on flow time, none beats earliest due date on worst lateness or on total lateness, and none has fewer than 2 late jobs.
```

Each rule wins on its own measure, as the theory promises, and the exhaustive check confirms it. The table also shows that the measures pull against each other. Moore's rule has the fewest late jobs, two, but one of them, L1, is three hours late, because the rule sacrifices it entirely. Earliest due date has four late jobs, but none more than 90 minutes late, and the least total lateness of any order, which an exhaustive check confirmed is also the best possible on that measure for these jobs. Shortest first gets work through the shop fastest but lets the long switchboard job, L3, and the guard panels, L1, run late.

```figure
type: bars
title: Lateness of each job under the earliest due date sequence
unit: min
max: 100
caption: This is an illustration. L5, L2, L4 and L7 finish on time; L1 is 10 minutes late, L6 35, L8 30 and L3 90. The 90 minutes is the least worst lateness any order can achieve.
- L5 | 0
- L2 | 0
- L4 | 0
- L1 | 10
- L7 | 0
- L6 | 35
- L8 | 30
- * L3 | 90
```

Which rule to use is a business decision. If every late job costs about the same, such as a fixed penalty or a phone call, Moore's rule is right. If lateness costs in proportion to how late, such as idle time downstream, earliest due date is right. If the main concern is work in progress and flow, shortest first is right. For the laser, the shop chose earliest due date as the default, because a late laser job delays the brakes, welding and assembly in proportion to its lateness, and used Moore's rule's insight on days when a job is already hopelessly late: run it last and protect the others.

The more useful conclusion from Thursday's table is that no order can make the shift work. Even the best order has the switchboard job 90 minutes late, because 420 minutes of work cannot be finished by due times that sum to less. The rules make the best of the shift; only capacity, overtime, a second machine or a renegotiated due time can fix it.

## Jobs that matter more than others

The three rules treat every job as equally important. In practice, some jobs matter more: the EC-600 parts feed the assembly line, whose idle time costs far more than a job-work customer's patience, and a job for a customer with a penalty clause matters more than one for a customer who will wait. Smith's 1956 paper also covered this case. If each job has a weight expressing how much an hour of its flow time costs, the weighted average flow time is least when jobs run in order of increasing time divided by weight. A job that is short and important goes first; one that is long and unimportant goes last.

This is an illustration. Suppose the shop weights the four EC-600 jobs at 3, because they feed assembly, and the job work at 1. The ratios of time to weight become: L2 30 ÷ 3 = 10, L4 45 ÷ 3 = 15, L8 55 ÷ 3 = 18.3, L5 20, L6 75 ÷ 3 = 25, L7 40, L1 65 and L3 90. The weighted rule runs L2, L4, L8, L5, L6, L7, L1 and L3, pulling the EC-600 bodies, L8, forward from fifth to third. It also pushes the urgent brackets, L5, from first to fourth, where they finish at 150 minutes against a due time of 60, a reminder that weights express the cost of waiting in general, and that a hard due time must be handled as a constraint, not a weight.

The practical approach used in many shops is a two-level sequence. Jobs with hard due times are placed first, by earliest due date, so that they are met if they can be. The remaining jobs fill the gaps in order of time divided by weight, so that the most valuable work flows fastest. The resulting sequence is not provably best for any single measure, but it respects the commitments that cannot be broken and makes good use of the time that is left.

## Keeping the sequence current

A sequence made at the start of the shift starts to age as soon as the first new job arrives. The rules in this chapter work as dispatching rules too: whenever the machine finishes a job, it takes the next by the rule from whatever is waiting at that moment. Shortest first and earliest due date both work this way without change, and with jobs arriving during the shift they remain good rules, though no longer provably best, because a rule that looks only at the jobs present cannot account for a short urgent job about to arrive.

Two cautions apply to dispatching by shortest first. A long job can wait indefinitely if short jobs keep arriving, which is unfair to its customer and may make it very late. The usual cure is to promote any job that has waited more than a set time, or to switch to earliest due date when a job's slack, its due time minus the current time minus its own cutting time, falls below a threshold. Second, re-sorting the queue too often can unsettle the floor: an operator who has staged the next sheets and set the nozzle for one job should not have the sequence changed under them. Re-sorting at fixed points, such as the start of each shift and after each changeover, is usually often enough.

## Changeovers between materials

On a real laser, jobs differ in material and thickness, and changing from one to another costs time: a different nozzle, a different assist gas, a new focus setting and a test cut. The changeover time depends on both the material being left and the material being started, so the order of materials matters, and none of the simple rules above takes it into account.

This is an illustration. Next week, the laser must run one batch each of five material groups. It is currently set for 1.6 mm mild steel. The changeover times, in minutes, are measured from the shop's records.

```figure
type: compare
title: Laser changeover times between material groups, minutes
cols: To MS 1.6 | To MS 3.0 | To SS 1.2 | To AL 2.0 | To GA 1.0
rowhead: From
- MS 1.6 mild steel | — | 12 | 18 | 20 | 8
- MS 3.0 mild steel | 10 | — | 22 | 24 | 12
- SS 1.2 stainless | 16 | 20 | — | 9 | 15
- AL 2.0 aluminium | 18 | 22 | 10 | — | 17
- GA 1.0 galvanised | 7 | 13 | 14 | 16 | —
caption: This is an illustration. The times are not symmetric: changing from thick to thin or from oxygen to nitrogen assist differs from the reverse. Mild and galvanised steel share an oxygen set-up; stainless and aluminium share nitrogen.
```

Ordering the four remaining groups is a small travelling-salesman problem: visit each material once, starting from mild steel 1.6, at the least total changeover time. There are only 4! = 24 orders, and checking them all gives the answer.

```figure
type: compare
title: Orders of the four remaining material groups
cols: Order after MS 1.6 | Changeover minutes
rowhead: Method
- Worst of the 24 | AL 2.0, MS 3.0, SS 1.2, GA 1.0 | 79
- As listed on the schedule | MS 3.0, SS 1.2, AL 2.0, GA 1.0 | 60
- Nearest next: always the quickest change | GA 1.0, MS 3.0, SS 1.2, AL 2.0 | 52
- * Best of the 24 | MS 3.0, GA 1.0, SS 1.2, AL 2.0 | 47
caption: This is an illustration. The best order keeps the oxygen materials together, then makes the single switch to nitrogen and runs stainless before aluminium.
```

The nearest-next rule, always choosing the quickest change from where the laser is now, does reasonably well but not best: it takes the cheap 8-minute change to galvanised first, and then pays 13 minutes to reach 3 mm mild steel. The best order groups the materials that share an assist gas and makes the expensive switch between gases only once. That is a general principle for changeovers: group by the most expensive set-up feature first, then order within the groups. With more groups, the count of orders grows like the job sequences of Chapter 1, and Chapter 10's local search takes over.

Changeovers and due dates interact. Grouping jobs by material saves changeover time but may run some jobs out of due-date order. A practical compromise is to sequence by due date within each day, but to group the day's jobs by material where doing so makes no job late. The changeover minutes saved are added to the shift's capacity, which, as Thursday showed, is often what is really short.

## The error: first come, first served

This is an illustration. Before the shop adopted a sequencing rule, the laser operator ran jobs in the order their paperwork arrived at the machine, on the reasonable-sounding principle of fairness. On Thursday's jobs, that order is L1 to L8.

The result was five late jobs, including the urgent brackets, L5, which were due at 60 minutes and finished at 250, 190 minutes late, and the EC-600 mounting plates, L4, which held up the brake work for an hour and a half. The supervisor noticed the urgent brackets waiting at the laser at mid-morning, and the planner's review used the table of rules above to show what had been lost: arrival order was the worst of the four on every measure, with an average flow time 56 minutes longer than shortest first and a total lateness four times that of earliest due date.

The cause was that arrival order carries no information about urgency or size. A long, non-urgent job that arrives first delays everything behind it. The correction was simple: the laser's queue is now re-sorted by due date at the start of each shift and whenever a new job arrives, with jobs of the same material grouped where that makes nothing late. The paperwork still arrives in any order; the sort takes the operator a minute.

## Exercise: five jobs on the press

This is an illustration. Five jobs wait for a turret punch press, with times and due times in minutes: A 30, due 40; B 20, due 50; C 50, due 90; D 10, due 100; E 40, due 110.

1. What order does shortest first give, and what is the average flow time?
2. What order does earliest due date give, and what is the worst lateness?
3. Apply Moore's rule. How many jobs are late?

**Worked answer.**

1. Shortest first: D, B, A, E, C. Completion times 10, 30, 60, 100 and 150, an average flow time of 350 ÷ 5 = **70 minutes**. A finishes at 60 against 40, and C at 150 against 90, so two jobs are late.
2. Earliest due date: A, B, C, D, E. Completion times 30, 50, 100, 110 and 150. Lateness: A −10, B 0, C 10, D 10, E 40. The worst lateness is **40 minutes**, the least possible for these jobs; three jobs are late.
3. Moore's rule: in due-date order, C is the first job that would be late (100 against 90). Of A, B and C, the longest is C, 50 minutes, so C moves to the end. The sequence A, B, D, E finishes at 30, 50, 60 and 100, all on time, and C finishes at 150, 60 minutes late. **One** late job, the fewest possible, confirmed by checking all 120 orders.
