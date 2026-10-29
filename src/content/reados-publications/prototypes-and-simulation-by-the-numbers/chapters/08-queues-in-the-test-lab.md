---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: queues-in-the-test-lab
order: 8
title: "Queues in the test lab: utilisation, waiting and Little's law"
description: "One climatic chamber at 79% utilisation: M/M/1 and Kingman waits, the utilisation curve, a peak checked by simulation, Little's law on the lab log, and a week lost to a queue."
draft: true
---

Development plans usually show a test as a bar of fixed length that starts when the prototype is ready. In a test lab shared by many jobs, that is rarely what happens. The prototype arrives, joins a queue, and waits for the one piece of equipment it needs. The wait does not appear on the plan, but it lengthens every build-test-learn loop that passes through the lab, and on the critical path it delays release week for week.

This chapter treats the BPU-5's climatic chamber as a queue. It works out how busy the chamber is, how long a job should expect to wait using two standard results, how that wait grows as the chamber gets busier, what a simulation shows for a short peak, and how Little's law turns the lab's own job log into a measured wait. It ends with the week the programme lost by treating 79% utilisation as spare capacity.

## The chamber and its work

This is an illustration. All amounts are Australian dollars excluding GST. The business has one climatic chamber large enough for a whole BPU-5. Through EVT and DVT it served the thermal tests for R2 (1 hour at 3 kW in 35 °C ambient), cold-capacity tests, charging tests at temperature, and the same kinds of work for the business's other products. Test requests arrived at an average of **2.2 jobs a week**. A job, including setup, soak, test and teardown, took a mean of **1.8 working days**, or 0.36 of a five-day week, so the chamber could complete at most 1 ÷ 0.36 = **2.778 jobs a week**.

Utilisation is the ratio of arrivals to capacity: ρ = 2.2 ÷ 2.778 = **0.792**. The chamber was busy 79% of the working week. The plan read the other 21% as spare capacity and assumed that each test would start when its prototype was ready.

## Utilisation is not spare capacity

Idle time in a queue is not stored up for later. If requests arrived exactly every 2.27 days and every job took exactly 1.8 days, the chamber would be 79% busy and no job would ever wait. Real requests bunch: three may arrive in one week and none in the next. Real jobs vary: a soak runs long, a test is repeated. When work arrives while the chamber is busy, it waits; when the chamber is free and nothing has arrived, the capacity is lost. Queueing theory puts numbers on the result, and Reinertsen's *The Principles of Product Development Flow* makes the case that such queues are the largest hidden cost in development, because they are invisible on the plan and grow sharply as utilisation rises.

## Two estimates of the wait

The simplest model, M/M/1, assumes random arrivals and job times that are exponentially distributed, which means highly variable. Its mean wait in the queue, before the job starts, is

Wq = ρ ÷ (μ − λ) = 0.792 ÷ (2.778 − 2.2) = **1.37 weeks**, or **6.9 working days**,

where λ is the arrival rate and μ the service rate. On average 2.2 × 1.37 = 3.02 jobs would be waiting.

Chamber jobs are not that variable. Most take close to their planned time. Kingman's 1961 heavy-traffic approximation allows for that. For a single server it gives

Wq ≈ ((ca² + cs²) ÷ 2) × (ρ ÷ (1 − ρ)) × ts

where ca² and cs² are the squared coefficients of variation (standard deviation divided by mean, squared) of the time between arrivals and of the job time, and ts is the mean job time. Requests from many engineers arriving independently are close to random, so ca² = **1.0**. The lab's records showed job times with a standard deviation about half their mean, so cs² = 0.5² = **0.25**. Then

Wq ≈ 0.625 × (0.792 ÷ 0.208) × 0.36 = 0.625 × 3.808 × 0.36 = **0.86 weeks**, or **4.3 working days**.

Kingman's formula is an approximation, good at high utilisation and less exact at low, but it shows the three things that make a queue: variability (the first term), utilisation (the second) and job length (the third). Each can be managed, and the second does by far the most damage when it is high.

Both coefficients come from records the lab already keeps. The squared coefficient of variation of job time is the variance of the logged durations divided by the square of their mean: jobs with a mean of 1.8 days and a standard deviation of 0.9 day give cs² = (0.9 ÷ 1.8)² = 0.25. The same calculation on the gaps between request dates gives ca². A value near 1 means requests arrive at random, below 1 that they are regular, and above 1 that they bunch, as they do when a whole build reaches the lab in the same week. A DVT build of 12 units, each needing chamber time within days of the others, pushes ca² above 1 for a while, and Kingman's formula then predicts a longer wait than the averages used here. That is one reason the DVT peak needs its own analysis.

```figure
type: stats
title: The climatic chamber in numbers
caption: This is an illustration. EVT to DVT averages. Kingman's approximation with ca² 1.0 and cs² 0.25; M/M/1 assumes far more variable job times and overstates the wait.
- 2.2 a week | Test jobs arriving | λ
- 2.778 a week | Chamber capacity | μ = 1 ÷ 0.36 week
- * 0.792 | Utilisation | ρ = λ ÷ μ
- 4.3 days | Mean wait before a job starts | Kingman, 0.86 week
- 6.9 days | Same, M/M/1 | 1.37 weeks
- 2.68 jobs | Mean jobs in the lab | Little's law, λ × 1.22 weeks
```

## The utilisation curve

The term ρ ÷ (1 − ρ) is what makes busy labs slow. It is 1 at 50% utilisation, 3.8 at 79%, 9 at 90% and about 35 at 97%. Holding the job mix fixed and varying the arrival rate, Kingman's formula gives the following mean waits:

- 1.5 jobs a week, ρ 0.54: **1.3 days**
- 2.0 jobs a week, ρ 0.72: **2.9 days**
- 2.2 jobs a week, ρ 0.792: **4.3 days**
- 2.5 jobs a week, ρ 0.90: **10.1 days**
- 2.6 jobs a week, ρ 0.936: **16.5 days**
- 2.7 jobs a week, ρ 0.972: **39.1 days**

An increase of 18% in arrivals, from 2.2 to 2.6 a week, multiplies the steady-state wait by almost four. A lab run at high utilisation looks efficient on a utilisation report and slow on every project plan that depends on it.

```figure
type: line
title: Mean wait for the chamber against its utilisation
x: Utilisation, %
y: Mean wait before a job starts, working days
ymin: 0
ymax: 40
mark: 79 | EVT–DVT average
caption: This is an illustration. Kingman's approximation, ca² 1.0, cs² 0.25, mean job 1.8 working days. The wait more than triples between 79% and 94% utilisation.
- 54 | 1.3
- 72 | 2.9
- 79 | 4.3
- 90 | 10.1
- 94 | 16.5
- 97 | 39.1
```

## Peaks are not steady states

Queueing formulas describe a system that has run at the same rates long enough to settle. Development work comes in waves. In the BPU-5 programme, the DVT build sent a burst of tests to the chamber: about **2.6 jobs a week for 8 weeks**, at a utilisation of 0.936. The steady-state formula says 16.5 days, but a queue takes time to build up, and an eight-week peak ends before it reaches that level.

A simulation answers the question the formula cannot. The model ran 32 weeks: 16 weeks at 2.2 jobs a week, the 8-week peak at 2.6, then 8 weeks at 2.0. Arrivals were random (Poisson), and job times followed an Erlang distribution with four stages, mean 0.36 week, which has the cs² of 0.25 used above. One chamber served jobs in order of arrival. The model was run **2,000 times** with seed **20261028** and the results averaged:

- Jobs arriving during the peak waited a mean of **1.15 weeks**, or **5.7 working days**.
- Over all 32 weeks, the mean wait was **0.88 weeks**, or **4.4 working days**.
- The largest number of jobs in the lab at once averaged **7.3** per replication.

The peak was less severe than the steady-state formula said, and more severe than the plan's assumption of no wait at all. The all-weeks figure of 4.4 days sits close to Kingman's 4.3 days at the average rate, which is a useful check that the simulation and the formula agree where they should.

## Little's law and the lab log

Little's law, proved by Little in 1961, states that in any stable system the average number of items in the system equals the arrival rate times the average time each spends there: **L = λW**. It needs no assumption about distributions, priority rules or job times. That makes it the best check a manager has, because it uses only counts.

Applied to the chamber's model, a job spends the wait plus the job time in the lab: W = 0.86 + 0.36 = 1.22 weeks, so L = 2.2 × 1.22 = **2.68 jobs** in the lab on average.

The lab's own records gave a different answer. Over DVT, the test technician's daily log showed an average of **3.0 jobs** in the lab, waiting or in the chamber, while jobs were completed at 2.2 a week. By Little's law the mean time a job spent in the lab was W = 3.0 ÷ 2.2 = **1.36 weeks**, or **6.8 working days**. Taking away the 1.8-day job leaves a mean wait of about **5.0 working days**, higher than both the formula and the simulation's all-weeks figure. Some of the difference is the peak; some is jobs that were run twice. The log is the measurement, and the models explain it.

```figure
type: compare
title: Three views of the chamber's wait
cols: Mean wait before a job starts | Basis
caption: This is an illustration. The models bracket the measured value. Little's law turns two counts in the lab log into a time without any timestamps.
- Plan | 0 days | tests start on request
- Kingman, 2.2 a week steady | 4.3 days | ca² 1.0, cs² 0.25
- Simulation, all 32 weeks | 4.4 days | 2,000 replications, seed 20261028
- Simulation, jobs arriving in the peak | 5.7 days | 2.6 a week for 8 weeks
- * Lab log with Little's law | about 5.0 days | 3.0 jobs ÷ 2.2 a week = 6.8 days in the lab, less 1.8 days of test
- M/M/1, 2.2 a week | 6.9 days | assumes highly variable job times
```

## The error: 79% read as spare capacity

This is an illustration. The programme plan scheduled each DVT thermal test to start on the day its unit was ready. The planning note said the chamber was 79% utilised, so there was capacity to spare. Several of the DVT thermal tests sat on the critical path: their results were needed for the DVT review, and the next build could not be released without them.

At the DVT peak, critical-path thermal tests waited **about 6 working days** for the chamber, close to the simulation's 5.7 days for jobs arriving in the peak. The programme lost **1 week** before a second chamber could be hired, at a cost of delay of **A$25,000**.

The problem was detected from the lab's job log. The product manager, tracking why the DVT review date was slipping, asked for the daily count of jobs in the lab and the weekly completions; Little's law turned those two numbers into a lead time far longer than the plan's bars. The corrections were:

- **A hired chamber** for the 8 weeks of the peak at A$1,800 a week, **A$14,400**. With two chambers sharing 2.6 jobs a week, each runs at 47% utilisation, and an M/M/2 model gives a 0.298 chance that a job waits at all and a mean wait of about **0.5 day**. A week of hire cost less than a tenth of a week of critical-path delay.
- **Fixed booking slots** for the rest of the programme: each test booked into a half-week slot, prepared before the slot, and run to a standard duration. That made arrivals and job times more regular. With ca² reduced to 0.3 and cs² to 0.1, Kingman's formula at 2.6 jobs a week gives **1.05 weeks**, against 3.29 weeks with random requests and the original job variation.
- **A priority rule** that a critical-path test goes ahead of others in the queue, set by the product manager, not by whoever asked first.

The lesson is general. A shared resource run near full utilisation is cheap for its owner and expensive for everyone who depends on it. Who holds the capacity, and who decides the order of work in it, are questions of authority as much as of arithmetic. [Shared goals, co-location and decision rights](/reados/publications/project-teams-and-contracts-by-the-numbers/shared-goals-co-location-and-decision-rights/) in *Project Teams and Contracts by the Numbers* treats those questions for a project team made up of several organisations, and [Locking in the plan: long-lead orders, readiness and change after approval](/reados/publications/front-end-planning-by-the-numbers/locking-in-the-plan/) in *Front-End Planning by the Numbers* covers securing scarce resources at approval rather than when they are needed.

## Queues lengthen loops

The chamber's queue also changes the economics of iteration. [How many loops: diminishing returns and the speed of iteration](/reados/publications/prototypes-and-simulation-by-the-numbers/how-many-loops/) priced a standard thermal loop on the assumption that the chamber was available. Every day of waiting adds to each loop's duration, and on the critical path adds A$25,000 a week to its cost, which can turn a loop that was worth running into one that is not. A queue does not have to be on the critical path to matter: off it, the wait still stretches feedback, so problems are found later and cost more to fix.

The same tools work on a factory floor, where they are usually first met. [Cutting lead time with flow and pull](/reados/collections/manufacturing-operations-and-design-for-manufacture/cutting-lead-time-with-flow-and-pull/) applies Little's law to work in progress in a fabrication shop. When the shift rules, blocking and retests become too awkward for a formula, a discrete-event simulation takes over: see [Discrete-event simulation: sizing the end-of-line test](/reados/publications/prototypes-and-simulation-by-the-numbers/discrete-event-simulation-of-the-test-line/).

## Exercise: a quieter quarter

After release, the business expects chamber requests to fall to **2.0 jobs a week**, with the same job mix (mean 1.8 working days, cs² 0.25) and random arrivals. What is the chamber's utilisation, the mean wait before a job starts by Kingman's approximation, and the mean number of jobs waiting?

**Worked answer.** Utilisation is ρ = 2.0 × 0.36 = **0.72**. Kingman's approximation gives Wq ≈ ((1.0 + 0.25) ÷ 2) × (0.72 ÷ 0.28) × 0.36 = 0.625 × 2.571 × 0.36 = **0.579 weeks**, or **2.89 working days**. By Little's law, the mean number waiting is Lq = λ × Wq = 2.0 × 0.579 = **1.157 jobs**. A 9% fall in arrivals, from 2.2 to 2.0 a week, cuts the mean wait by about a third, from 4.3 to 2.9 days: the same curve that punishes a busy lab rewards a modest reduction in load.
