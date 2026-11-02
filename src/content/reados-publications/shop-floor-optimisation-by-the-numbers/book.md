---
title: "Shop Floor Optimisation by the Numbers"
subtitle: "Splitting, loading, balancing, choosing, cutting, nesting, sequencing and grouping work in a factory, with bounds that show how good a plan is"
description: "Solve the hard choices of a job shop: machine loading, line balancing, project selection, bar cutting, sheet nesting, sequencing, cells and simulated annealing."
category: Operations
tags: [operations, manufacturing, process-improvement, systems]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate production engineering and operations"
audience: "Production engineers, planners, supervisors, estimators and owners of fabrication, machining and assembly shops who decide how work is split between machines, which jobs or projects to take, how to cut stock and in what order to run work."
outcomes:
  - "Recognise when a shop-floor choice is combinatorial, count its possibilities and decide whether to search them all, use a rule or use a heuristic."
  - "Split and load work across machines and balance an assembly line to takt time, with lower bounds that prove how close a plan is to the best."
  - "Choose jobs or improvement projects within a budget, cut bars and nest sheet blanks with least waste, and check every plan against its bound."
  - "Sequence jobs on one machine for flow time, lateness or late jobs, and group machines into cells that minimise material moves."
  - "Use local search and simulated annealing on problems too large to solve exactly, and judge when a result is good enough."
coverVariant: category
references:
  - title: "Statistical Physics of Spin Glasses and Information Processing: An Introduction"
    creator: "H. Nishimori, Oxford University Press (International Series of Monographs on Physics 111)"
    year: "2001"
    note: "In copyright. Used only as a map of the ideas behind Chapters 1, 2, 5, 9 and 10: number partitioning, graph partitioning, the knapsack problem and simulated annealing treated as problems of finding the lowest-energy state of a many-variable system. No text, structure, figures, tables or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Computers and Intractability: A Guide to the Theory of NP-Completeness"
    creator: "M. R. Garey and D. S. Johnson, W. H. Freeman, San Francisco"
    year: "1979"
    note: "Named in Chapter 1 as the standard account of why problems such as partitioning, bin packing and sequencing have no known method that is fast for every instance."
  - title: "Bounds on multiprocessing timing anomalies"
    creator: "R. L. Graham, SIAM Journal on Applied Mathematics 17(2), 416–429"
    year: "1969"
    url: "https://doi.org/10.1137/0117039"
    note: "Source of the worst-case guarantee for the longest-processing-time rule quoted in Chapter 3."
  - title: "The differencing method of set partitioning"
    creator: "N. Karmarkar and R. M. Karp, Report UCB/CSD 82/113, University of California, Berkeley"
    year: "1982"
    note: "Named in Chapter 2 as the origin of the differencing heuristic for splitting work between two machines."
  - title: "Various optimizers for single-stage production"
    creator: "W. E. Smith, Naval Research Logistics Quarterly 3(1–2), 59–66"
    year: "1956"
    url: "https://doi.org/10.1002/nav.3800030106"
    note: "Named in Chapter 8 as the origin of the shortest-processing-time rule for least average flow time."
  - title: "Scheduling a production line to minimize maximum tardiness"
    creator: "J. R. Jackson, Research Report 43, Management Science Research Project, University of California, Los Angeles"
    year: "1955"
    note: "Named in Chapter 8 as the origin of the earliest-due-date rule for least maximum lateness."
  - title: "An n job, one machine sequencing algorithm for minimizing the number of late jobs"
    creator: "J. M. Moore, Management Science 15(1), 102–109"
    year: "1968"
    url: "https://doi.org/10.1287/mnsc.15.1.102"
    note: "Named in Chapter 8 as the source of the method for least number of late jobs, worked there on the running case."
  - title: "Discrete-variable extremum problems"
    creator: "G. B. Dantzig, Operations Research 5(2), 266–288"
    year: "1957"
    url: "https://doi.org/10.1287/opre.5.2.266"
    note: "Named in Chapter 5 for the ratio rule and the fractional bound used to judge a knapsack selection."
  - title: "A linear programming approach to the cutting-stock problem"
    creator: "P. C. Gilmore and R. E. Gomory, Operations Research 9(6), 849–859"
    year: "1961"
    url: "https://doi.org/10.1287/opre.9.6.849"
    note: "Named in Chapter 6 as the origin of cutting-pattern methods, the approach used there to find the plan the first-fit rule missed."
  - title: "An efficient heuristic procedure for partitioning graphs"
    creator: "B. W. Kernighan and S. Lin, Bell System Technical Journal 49(2), 291–307"
    year: "1970"
    url: "https://doi.org/10.1002/j.1538-7305.1970.tb01770.x"
    note: "Named in Chapter 9 as the origin of swap-based improvement for splitting a network into two groups."
  - title: "Equation of state calculations by fast computing machines"
    creator: "N. Metropolis, A. W. Rosenbluth, M. N. Rosenbluth, A. H. Teller and E. Teller, Journal of Chemical Physics 21(6), 1087–1092"
    year: "1953"
    url: "https://doi.org/10.1063/1.1699114"
    note: "Named in Chapter 10 as the origin of the acceptance rule used in simulated annealing."
  - title: "Optimization by simulated annealing"
    creator: "S. Kirkpatrick, C. D. Gelatt and M. P. Vecchi, Science 220(4598), 671–680"
    year: "1983"
    url: "https://doi.org/10.1126/science.220.4598.671"
    note: "Named in Chapter 10 as the paper that introduced simulated annealing for optimisation problems."
related:
  - title: "Breakdowns and Buffers by the Numbers"
    href: "/reados/publications/breakdowns-and-buffers-by-the-numbers/"
  - title: "Sheet Metal Production Runs by the Numbers"
    href: "/reados/publications/sheet-metal-production-runs-by-the-numbers/"
  - title: "Quoting Sheet Metal Work by the Numbers"
    href: "/reados/publications/quoting-sheet-metal-work-by-the-numbers/"
  - title: "Bills of Materials by the Numbers"
    href: "/reados/publications/bills-of-materials-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
---

## About this book

Every day a shop makes choices that look simple and are not: which press brake gets which job, which tasks go to which station on the assembly line, which improvement projects fit the year's budget, how to cut a stack of tube lengths from stock, how to lay blanks on a sheet, which job the laser runs next and which machines share a bay. Each has a small number of inputs and an enormous number of possible answers. Twelve jobs on two machines can be split 4,096 ways; eight jobs can be run in 40,320 orders; twenty jobs in more orders than a computer could check in a lifetime.

This book shows how to make these choices well with arithmetic a planner can check. It counts the possibilities, uses simple rules that are known to work, calculates bounds that show how far a plan could still be from the best, and, when the problem is too large to check, uses local search and simulated annealing. The ideas come from operations research and from the statistical physics of disordered systems, which treats a plan as a configuration and its cost as an energy to be minimised.

It is for production engineers, planners, supervisors, estimators and owners of fabrication, machining and assembly shops. It assumes school algebra and comfort with a spreadsheet. Each chapter works the running case with real numbers, includes one plausible mistake and how it was caught, links the KEVOS® tool that does the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional shop. This is an illustration. A sheet-metal and assembly shop in Geelong, Victoria, makes a powder-coated steel electrical enclosure called EC-600, a 600 × 600 × 250 mm wall cabinet, alongside job work for local customers.

- **Cutting and forming:** a fibre laser with a 3,000 × 1,500 mm bed, two identical press brakes and a cold saw for square hollow section bought in 6.5 m lengths, with a 3 mm kerf and 10 mm trimmed from each end.
- **Joining:** three weld bays for frames, stands and job work.
- **Assembly:** a three-station final assembly line for EC-600, with 420 minutes of net working time a shift and demand for 60 cabinets a day.
- **Improvement budget:** A$60,000 excluding GST for the year's capital projects.

Times, prices, demands and savings in the book are invented for the case and do not describe KEVOS® work, any real business or any real product.

## How to use the book

Read Chapter 1 first: it introduces the counting, the bounds and the vocabulary every later chapter uses. Chapters 2 to 4 split work between machines and stations, Chapters 5 to 7 choose and cut within limits, Chapter 8 orders work on one machine, Chapter 9 groups machines, and Chapter 10 gives a general method for problems too large for the others. Each chapter can be read alone after Chapter 1.

Every calculation in the book was checked by running it, including the exhaustive searches that prove which plans are best. The KEVOS® tools linked from the chapters perform the same calculations with the reader's own data.

## Source limits and professional responsibility

The methods here are standard heuristics and bounds. They give good plans quickly, and the bounds say how good; they do not replace judgement about what the plan leaves out, such as operator skills, tooling, material availability, quality risk or a customer's priorities. Real schedules change hourly, and a plan is only as good as the times and quantities put into it. This book is educational. Planning decisions that affect safety, contracts or people's working hours remain the responsibility of the people who make them.
