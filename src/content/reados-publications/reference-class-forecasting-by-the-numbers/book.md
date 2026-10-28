---
title: "Reference Class Forecasting by the Numbers"
subtitle: "Base rates, percentiles, uplifts and fat tails for project cost and time estimates, worked through one factory expansion"
description: "Correct an optimistic project estimate with the outcomes of similar past projects: overrun ratios, P50 and P80 budgets, fat tails, simulation and calibration."
category: Projects
tags: [projects, finance, strategy, operations]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: draft
publishDate: 2026-10-28
referencesChecked: 2026-10-28
edition: "1"
level: "Intermediate project estimating and decision practice"
audience: "Owners, operations and engineering managers, project managers, estimators and finance staff who prepare, review or approve the cost and duration of capital projects in small and medium Australian businesses."
outcomes:
  - "Explain why estimates built from the inside view are biased, and measure past overruns on a consistent baseline."
  - "Build a reference class of similar past projects and read its distribution as medians, percentiles and P-values."
  - "Turn a chosen confidence level into an uplift, a budget and a visible contingency without double counting."
  - "Recognise fat-tailed project types, and separate thin-tailed from fat-tailed parts of one project."
  - "Combine component forecasts by simulation, act on the tail before approval, and calibrate forecasts against outcomes."
coverVariant: category
references:
  - title: "How Big Things Get Done"
    creator: "Bent Flyvbjerg and Dan Gardner"
    year: "2023"
    note: "Supplied source, © Connaught Street Inc. and Bent Flyvbjerg, in copyright, read with its supplementary PDF. Used as a subject map for the inside and outside views, uniqueness bias, fat tails and reference class forecasting. No passages, chapter structure, stories or figures are reproduced. The headline results attributed to it in Chapters 1 and 6 (the shares of projects on budget, on time and on benefits, and three rows of the cost-risk base-rate table) are quoted as published, with attribution."
  - title: "Five things you should know about cost overrun"
    creator: "Bent Flyvbjerg and thirteen co-authors, Transportation Research Part A: Policy and Practice 118, 174–190"
    year: "2018"
    url: "https://doi.org/10.1016/j.tra.2018.07.013"
    note: "Source for measuring overrun against the budget at the decision to build, in real terms, using all valid data, and for the argument that overrun distributions are fat-tailed and behavioural in origin."
  - title: "Quality control and due diligence in project management: getting decisions right by taking the outside view"
    creator: "Bent Flyvbjerg, International Journal of Project Management 31(5), 760–774"
    year: "2013"
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2229700"
    note: "Background on reference class forecasting as a due-diligence check on a forecast prepared by someone else."
  - title: "Procedures for dealing with optimism bias in transport planning: guidance document"
    creator: "Bent Flyvbjerg, Carsten Glenting and Arne Rønnest, for the UK Department for Transport"
    year: "2004"
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2278346"
    note: "The first published method for setting uplifts from a reference class at a chosen acceptable chance of overrun. The book's uplift method follows the same idea with its own fictional data; no uplift values from the guidance are reproduced."
  - title: "Green Book supplementary guidance: optimism bias"
    creator: "HM Treasury"
    year: "2013 (page published); underlying study 2002"
    url: "https://www.gov.uk/government/publications/green-book-supplementary-guidance-optimism-bias"
    note: "Named as an example of a government applying explicit optimism-bias adjustments to cost, benefit and duration estimates when better local data is missing. Its percentages are not quoted."
  - title: "Cost Estimation Guidance, including Guidance Note 3A Probabilistic Cost Estimation and Guidance Note 3B Deterministic Contingency Estimation"
    creator: "Australian Government, Department of Infrastructure"
    year: "version 2.0, November 2023"
    url: "https://investment.infrastructure.gov.au/resources-funding-recipients/cost-estimation-guidance"
    note: "Australian source for P50 and P90 outturn cost estimates, and for the requirement to use a probabilistic method for projects seeking Commonwealth funding with an anticipated outturn cost above A$25 million. Cited for those points only."
  - title: "Cost estimation toolkit, Commonwealth Investment Framework"
    creator: "Australian Government Department of Finance"
    year: "current online guidance"
    url: "https://www.finance.gov.au/government/commonwealth-investment-framework/commonwealth-investments-rmg-toolkit/cost-estimation-toolkit"
    note: "Source for the plain-language meaning of a P-value: a P90 estimate carries enough contingency that there is a 90 per cent likelihood it will not be exceeded."
  - title: "Intuitive prediction: biases and corrective procedures"
    creator: "Daniel Kahneman and Amos Tversky, TIMS Studies in Management Science 12, 313–327"
    year: "1979"
    note: "Origin of the distinction between singular information about the case at hand and distributional information about similar cases, and of the recommendation to start from the distribution."
  - title: "Delusions of success: how optimism undermines executives' decisions"
    creator: "Dan Lovallo and Daniel Kahneman, Harvard Business Review 81(7)"
    year: "2003"
    note: "Background on optimism in business forecasts and the outside view as its correction."
  - title: "Sample quantiles in statistical packages"
    creator: "Rob J. Hyndman and Yanan Fan, The American Statistician 50(4), 361–365"
    year: "1996"
    note: "Reference for the several conventions for computing a percentile from a small sample. The book uses linear interpolation between ranks, as spreadsheet PERCENTILE.INC functions do."
  - title: "Bootstrap methods: another look at the jackknife"
    creator: "Bradley Efron, Annals of Statistics 7(1), 1–26"
    year: "1979"
    note: "Origin of resampling from observed data, the basis of the component simulation in Chapter 8."
  - title: "Verification of forecasts expressed in terms of probability"
    creator: "Glenn W. Brier, Monthly Weather Review 78(1), 1–3"
    year: "1950"
    note: "Origin of the Brier score used in Chapter 10 to check whether probability forecasts were well calibrated."
  - title: "Producer Price Indexes, Australia"
    creator: "Australian Bureau of Statistics"
    year: "quarterly release"
    url: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/producer-price-indexes-australia"
    note: "Named as a source of construction and manufacturing price indexes for converting past project costs to current dollars. The index values in Chapter 2 are illustrative, not ABS figures."
related:
  - title: "Project Estimates, Schedules and Costs"
    href: "/reados/collections/project-estimates-schedules-and-costs/"
  - title: "Modular Projects by the Numbers"
    href: "/reados/publications/modular-projects-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Building Approval for Factory Projects"
    href: "/reados/publications/building-approval-for-factory-projects/"
---

## About this book

Most project estimates are built from the inside: a list of the work, a price for each item, a schedule and a contingency for what might go wrong. That method is necessary, and it is reliably optimistic. Past projects of the same kind finished later and cost more than their approved budgets far more often than they finished early and under, and the estimates for them were built the same careful way. An estimate that ignores how similar projects actually turned out is ignoring the most relevant evidence there is.

This book works through **reference class forecasting**, the method of correcting an inside-view estimate with the recorded outcomes of a class of similar past projects. It starts with the inside view and how to measure overrun consistently, then builds a reference class, reads its distribution, and turns a chosen confidence level into a budget and a contingency. It treats fat tails, where a few projects blow out by multiples of their budget and averages mislead, then extends the method to schedule and benefits, to forecasting by component with a simple simulation, to reducing tail risk before approval, and finally to tracking and calibrating forecasts so that the reference class improves with every project. Each chapter carries one running case, includes a plausible error and how it was found, and ends with an exercise and its worked answer.

It is for owners, managers, project managers, estimators and finance staff in small and medium Australian businesses. It assumes spreadsheet arithmetic and no statistics beyond averages; percentiles, simulation and calibration are introduced where they are needed. [Project Estimates, Schedules and Costs](/reados/collections/project-estimates-schedules-and-costs/) covers how inside-view estimates are built, and this book picks up where that leaves off.

## The running case

Every chapter follows one fictional decision. This is an illustration. A precision machining business in western Sydney, with about sixty staff, plans an expansion called **Bay 4**: a 600 m² extension to its factory, two five-axis machining centres with tooling, a pallet automation system that lets the machines run unattended overnight, and the software and network work to schedule and monitor them. The team's estimate, built item by item from quotes and allowances, is a base cost of **A$2.28 million** plus a contingency of **A$120,000**, an approved budget of **A$2.40 million excluding GST**, and a duration of **36 weeks** from approval to the first production shift.

The business has kept records of **24 capital projects** completed between 2011 and 2025: machine purchases, building works, automation and software. Their approved budgets and final costs, converted to 2026 dollars, form the reference class that the book builds, reads and extends.

The business, its projects, its records and its numbers are invented. None describes KEVOS® work, a real business or a real project.

## How to use the book

Read Chapters 1 and 2 first: the inside view and a consistent measure of overrun underlie everything else. Chapters 3 to 5 build the reference class and turn it into a budget, and should be read in order. Chapter 6 on fat tails, Chapter 7 on schedule and benefits, and Chapter 8 on component simulation can be read in any order after Chapter 5. Chapters 9 and 10 cover the decision itself and what happens after it. Every calculation in the book was checked by running it, and the spreadsheet functions named in the text reproduce the results.

## Source limits and professional responsibility

The method is published and widely used, and the sources are listed with what each was used for. Where the book quotes results from published research, they are attributed and are about the projects that research studied, which were mostly large and public; their relevance to a small private project is discussed where they are used. The running case's records are fictional and teach the method only: the right reference class for a real decision is built from real, checked records. This book is general information about estimating and project decisions. It is not financial, legal or investment advice, and approval of real expenditure is a matter for the people accountable for it, with professional advice where the stakes require it.
