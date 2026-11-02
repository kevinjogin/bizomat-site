---
title: "Breakdowns and Buffers by the Numbers"
subtitle: "Markov models for repairable machines: availability, stoppage counts, series lines, buffers, repair crews, spares, redundancy and the cost of downtime"
description: "Model breakdowns, repairs, buffers, maintenance crews, spares and standby machines as Markov processes, and use the results to choose improvements that raise a line's output."
category: Operations
tags: [operations, manufacturing, systems, strategy]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate production, maintenance and reliability engineering"
audience: "Production, maintenance and reliability engineers, operations managers, planners and students who need to predict and improve the output of machines that stop and get repaired."
outcomes:
  - "Build two-state and multi-state Markov models of repairable machines from a stoppage log and solve their balance equations."
  - "Test whether stoppages are random enough for a Markov model, with Poisson counts, control charts and simple checks on intervals."
  - "Predict the output of machines in series, with and without a buffer, and judge what a buffer is worth."
  - "Size a repair crew and a spares holding with birth–death models, and know when an infinite-source queue overstates the waits."
  - "Calculate the time to first failure of a redundant pair with repair, including common-cause failures, and rank improvements by the output and contribution they add."
coverVariant: category
references:
  - title: "A Modern Course in Statistical Physics, 2nd edition"
    creator: "L. E. Reichl, John Wiley & Sons"
    year: "1998"
    note: "In copyright. Used only as a map of the probability behind the book: the Poisson distribution, Markov chains, the master equation, detailed balance, mean first passage times and birth–death processes. No text, structure, figures, tables or problems are reproduced."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods, Chapter 8: Assessing Product Reliability"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/apr/apr.htm"
    note: "Open reference for lifetime distributions, repairable-system models and the treatment of failure data used in Chapters 1, 2 and 10."
  - title: "6.262 Discrete Stochastic Processes"
    creator: "R. G. Gallager, MIT OpenCourseWare"
    year: "2011"
    url: "https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/"
    note: "Open university course used as the checkable reference for Poisson processes, finite-state Markov chains, birth–death processes and queues."
  - title: "Queueing Systems, Volume 1: Theory"
    creator: "L. Kleinrock, John Wiley & Sons"
    year: "1975"
    note: "Named in Chapters 6 and 7 as a standard text for the M/M/c queue, the Erlang C formula and the finite-source (machine repair) model. No text is reproduced."
  - title: "A proof for the queuing formula L = λW"
    creator: "J. D. C. Little, Operations Research 9(3), 383–387"
    year: "1961"
    note: "Named in Chapters 5 and 7 as the source of Little's law."
  - title: "Stochastic Models of Manufacturing Systems"
    creator: "J. A. Buzacott and J. G. Shanthikumar, Prentice Hall"
    year: "1993"
    note: "Named in Chapters 4 and 5 as a standard text on transfer lines, operation-dependent failures and buffers between machines. The book's line results come from its own calculations and simulation."
  - title: "Optimal Inventory Modeling of Systems: Multi-Echelon Techniques, 2nd edition"
    creator: "C. C. Sherbrooke, Kluwer Academic Publishers"
    year: "2004"
    note: "Named in Chapter 8 as a standard account of Palm's theorem and spares for repairable items."
  - title: "IEC 61165 Application of Markov techniques"
    creator: "International Electrotechnical Commission"
    year: "current edition"
    note: "Named by number and scope as the international standard on applying Markov models in dependability analysis. Paywalled; no clauses or values are quoted."
  - title: "Model Code of Practice: Managing risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 3 and 6 for isolation before clearing jams and repairing machines. Readers check whether the code applies in their state or territory."
related:
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Prototypes and Simulation by the Numbers"
    href: "/reados/publications/prototypes-and-simulation-by-the-numbers/"
  - title: "Compressed Air Plant by the Numbers"
    href: "/reados/publications/compressed-air-plant-by-the-numbers/"
---

## About this book

Machines stop. A packing line, a press, a compressor or a pump runs for a while, fails or jams, waits for someone to fix it, and runs again. Over a shift the pattern looks like noise. Over a month it has a shape that probability describes well: stops arrive at a fairly steady average rate, repairs take a fairly steady average time, and the machine spends a predictable share of its life in each state. That description is a Markov model, and once a machine is written down that way, questions that look like guesswork become calculations. What output will this line make? What is a bigger buffer worth? Is one fitter enough for four machines? How many spare drives should be on the shelf? How often will both compressors be down at once?

This book builds the models one step at a time. It starts with a single machine that is either running or stopped, tests whether real stoppage data are random enough for the model, and adds states for minor and major stops. It then joins machines in series, with and without a buffer between them, and turns to the people and parts that repairs need: the fitter, the maintenance crew and the spares shelf. It finishes with standby machines and the time until both are down, and with the decision that all of this serves: which improvement buys the most output for the money.

It is for production, maintenance and reliability engineers, operations managers, planners and students who keep or analyse stoppage records. It assumes algebra, averages and the idea of probability; the exponential function is explained where it appears. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tool that performs the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional line. This is an illustration. A snack-food manufacturer runs four identical packing lines. Each line has a bagger, a vertical form-fill-seal machine making 60 bags a minute, feeding a case packer rated at the equivalent of 66 bags a minute through an accumulation conveyor that holds five minutes of the bagger's output, 300 bags. The plant works two 8-hour shifts a day, 250 days a year: 500 shifts.

- **The bagger:** stops on average every 2.0 running hours and takes 15 minutes on average to restart. Most stops are minor film and product jams cleared by the operator in a few minutes; about one in five is a breakdown that needs a fitter for about an hour.
- **The case packer:** stops on average every 4.0 running hours and takes 12 minutes on average to restart, with most stops a short carton jam and a few long ones.
- **Maintenance:** the four lines share one fitter per shift for breakdowns; the site's wider crew looks after 40 machines.
- **Parts and services:** 24 servo drives across the four lines, repaired by the maker overseas, and two air compressors, one needed, serving the packing hall.
- **Money:** each bag contributes A$0.10 towards fixed costs and profit, excluding GST.

The line, its stoppage data, the costs and the contribution are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 to 3 in order: they set out the two-state model, the tests of randomness and the balance equations that every later chapter uses. Chapters 4 and 5 deal with lines of machines and should be read together. Chapters 6 to 9 each take one supporting resource (the fitter, the crew, the spares and the standby machine) and can be read in any order. Chapter 10 brings the results together into a decision.

The models are solved with closed-form results where they exist and with a simulation, checked against those results, where they do not. Values are given to more figures than the data could justify, so that a reader can follow each step.

## Source limits and professional responsibility

Markov models describe machines whose stops arrive at random and whose repairs are independent of the past. Real machines also wear out, follow shift patterns and depend on the people who run them, and the book shows how to test for those effects and when to use other methods instead. Its numbers are only as good as the stoppage records behind them.

Clearing jams and repairing machines are among the most hazardous tasks in a factory. Work health and safety law requires plant to be isolated before such work, and Safe Work Australia's model code of practice on managing the risks of plant sets out how. Nothing in this book's arithmetic about shortening repair times justifies skipping isolation. The book teaches how to model and improve the output of repairable machines. It is educational and is not a maintenance plan for any site.
