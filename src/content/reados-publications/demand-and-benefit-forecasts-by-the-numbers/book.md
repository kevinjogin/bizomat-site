---
title: "Demand and Benefit Forecasts by the Numbers"
subtitle: "Volume drivers, ramp-up curves, forecast-error base rates, scenarios and benefit tracking for a business case, worked through one canning plant"
description: "Build a volume forecast from drivers, test it against the record, model the ramp-up, measure forecast error, run scenarios, then track benefits and treat surprises honestly."
category: Business
tags: [finance, strategy, customers, projects, operations]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-29
referencesChecked: 2026-10-28
edition: "1"
level: "Intermediate business-case, forecasting and benefits practice"
audience: "Owners, general and finance managers, sales and operations managers, and board members of Australian businesses who prepare, review or approve business cases that depend on forecasts of volume, ramp-up and benefits."
outcomes:
  - "Explain the claim that underestimated difficulties are offset by ingenuity, and what the published tests of that claim found."
  - "Build a demand forecast from customers, runs, run sizes and contribution, and test each driver against the business's own records."
  - "Model ramp-up month by month with an S-curve, separating how fast customers arrive from how fast the line learns."
  - "Measure forecast error with bias, MAPE and a naive benchmark, and turn base rates into a forecast range without double counting."
  - "Find the switching values that decide a business case, build coherent scenarios, and track benefits against a phased plan with leading indicators."
  - "Account for upside surprises honestly: separate luck, later decisions and their costs from the accuracy of the original forecast."
coverVariant: category
references:
  - title: "How Big Things Get Done"
    creator: "Bent Flyvbjerg and Dan Gardner"
    year: "2023"
    note: "Supplied source, © Connaught Street Inc. and Bent Flyvbjerg, in copyright. Used as a subject map only, for the theme of optimistic forecasts and the debate about Hirschman's Hiding Hand. No passages, chapter structure, stories, figures or heuristics are reproduced; the substance of the book rests on the other sources listed."
  - title: "Development Projects Observed, Chapter 1: The Principle of the Hiding Hand"
    creator: "Albert O. Hirschman, Brookings Institution"
    year: "1967"
    url: "https://www.brookings.edu/book/development-projects-observed/"
    note: "Origin of the Hiding Hand: the argument that planners who underestimate the difficulties of a project also underestimate their own ability to solve them, so that ignorance can lead people into worthwhile projects. Stated in Chapter 1 and revisited in Chapter 9. An essay of the same title appeared in The Public Interest in 1967."
  - title: "The fallacy of beneficial ignorance: a test of Hirschman's Hiding Hand"
    creator: "Bent Flyvbjerg, World Development 84, 176–189"
    year: "2016"
    url: "https://papers.ssrn.com/abstract=2767128"
    note: "Statistical test of the Hiding Hand on a large sample of projects. Its abstract reports that the principle is rejected at p < 0.0001 and that the average project suffers substantial cost overruns compounded by substantial benefit shortfalls. Quoted with attribution in Chapters 1 and 9."
  - title: "Beneficial or detrimental ignorance: the straw man fallacy of Flyvbjerg's test of Hirschman's Hiding Hand"
    creator: "Lavagnon A. Ika, World Development 103, 369–382"
    year: "2018"
    note: "Critique of the 2016 test, arguing that it misstates Hirschman's principle and leaves out life-cycle benefits, unintended effects and problem-solving. Used in Chapters 1 and 9 so that the counter-argument is stated fairly."
  - title: "Planning fallacy or Hiding Hand: which is the better explanation?"
    creator: "Bent Flyvbjerg, World Development 103, 383–386"
    year: "2018"
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3106736"
    note: "Reply to the critics. Its abstract accepts that the Hiding Hand exists and reports it in about one fifth of projects in the author's data, while arguing that it is not the typical case. Used in Chapters 1 and 9."
  - title: "How (in)accurate are demand forecasts in public works projects? The case of transportation"
    creator: "Bent Flyvbjerg, Mette K. Skamris Holm and Søren L. Buhl, Journal of the American Planning Association 71(2), 131–146"
    year: "2005"
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2238050"
    note: "Source of the published base rates for demand-forecast error quoted in Chapters 1 and 5, taken from the abstract: 210 projects in 14 nations; rail passenger forecasts overestimated in nine out of ten projects, by 106 per cent on average; road traffic forecasts out by more than 20 per cent either way for half of the projects; no improvement over the 30 years studied. These are results for large transport projects, and the book discusses how far they transfer to a small private business."
  - title: "Measuring inaccuracy in travel demand forecasting: methodological considerations regarding ramp up and sampling"
    creator: "Bent Flyvbjerg, Transportation Research Part A 39(6), 522–530"
    year: "2005"
    note: "Argument for measuring forecast accuracy against the forecast made at the decision to build and against actual demand in the first year of operation, and for treating samples of known forecast errors as likely to understate inaccuracy. Used in Chapters 4 and 5."
  - title: "Toll roads in Australia: an overview of characteristics and accuracy of demand forecasts"
    creator: "Zheng Li and David A. Hensher, Transport Reviews 30(5), 541–569"
    year: "2010"
    note: "Australian evidence that toll road traffic forecasts carried a sizeable error, especially in the first year of operation. Cited in Chapter 4 for that qualitative finding only; no figures from it are quoted."
  - title: "Forecasting: Principles and Practice, 3rd edition"
    creator: "Rob J. Hyndman and George Athanasopoulos, OTexts, Melbourne"
    year: "2021"
    url: "https://otexts.com/fpp3/"
    note: "Free online text by two Australian forecasters. Used for forecast-error measures and naive benchmarks (Chapter 5), prediction intervals (Chapter 6) and judgmental and scenario forecasting (Chapters 2 and 7)."
  - title: "Another look at measures of forecast accuracy"
    creator: "Rob J. Hyndman and Anne B. Koehler, International Journal of Forecasting 22(4), 679–688"
    year: "2006"
    note: "Source for the weaknesses of percentage error measures and for scaling errors against a naive forecast, the basis of the benchmark comparison in Chapter 5."
  - title: "A new product growth for model consumer durables"
    creator: "Frank M. Bass, Management Science 15(5), 215–227"
    year: "1969"
    note: "Origin of the diffusion model in which adoption depends on innovators and on imitation of earlier adopters, giving an S-shaped cumulative curve. Background to the ramp-up curves in Chapter 4; the book fits a simpler logistic curve to its own case data."
  - title: "Timid choices and bold forecasts: a cognitive perspective on risk taking"
    creator: "Daniel Kahneman and Dan Lovallo, Management Science 39(1), 17–31"
    year: "1993"
    note: "Source for the inside view: forecasts built from the details of the plan at hand while neglecting the statistics of similar past cases. Used in Chapters 1 and 3."
  - title: "Superforecasting: The Art and Science of Prediction"
    creator: "Philip E. Tetlock and Dan Gardner, Crown"
    year: "2015"
    note: "Background on keeping score of forecasts, breaking questions into parts and updating in small steps as evidence arrives. Used in Chapters 8 and 10."
  - title: "TPG24-31 Benefits Management Guide"
    creator: "NSW Treasury"
    year: "2025"
    url: "https://arp.nsw.gov.au/tpg24-31-benefits-management-guide"
    note: "Australian public-sector guidance on managing benefits from appraisal through delivery, with a benefits management plan and a register kept up to date. Named in Chapter 8 as an example of practice; the book's register is its own and nothing is reproduced."
  - title: "Assessment Framework, Stage 4: Post completion review"
    creator: "Infrastructure Australia"
    year: "2021"
    url: "https://www.infrastructureaustralia.gov.au/stage-4-post-completion-review"
    note: "Australian guidance on reviewing a completed project against the benefits in its business case. Named in Chapter 10 as an example of a formal post-completion review; the case's review is a simplified private-sector version."
related:
  - title: "Reference Class Forecasting by the Numbers"
    href: "/reados/publications/reference-class-forecasting-by-the-numbers/"
  - title: "Modular Projects by the Numbers"
    href: "/reados/publications/modular-projects-by-the-numbers/"
  - title: "Front-End Planning by the Numbers"
    href: "/reados/publications/front-end-planning-by-the-numbers/"
  - title: "Stage Gates and Stopping Rules by the Numbers"
    href: "/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/"
  - title: "Outcome-First Projects by the Numbers"
    href: "/reados/publications/outcome-first-projects-by-the-numbers/"
  - title: "Prototypes and Simulation by the Numbers"
    href: "/reados/publications/prototypes-and-simulation-by-the-numbers/"
  - title: "First-of-a-Kind Technology by the Numbers"
    href: "/reados/publications/first-of-a-kind-technology-by-the-numbers/"
  - title: "Project Teams and Contracts by the Numbers"
    href: "/reados/publications/project-teams-and-contracts-by-the-numbers/"
  - title: "Investment Appraisal and Business Cases"
    href: "/reados/collections/investment-appraisal-and-business-cases/"
  - title: "From Approval to Benefits"
    href: "/reados/collections/from-approval-to-benefits/"
  - title: "Valuing Time, Delay and Uncertainty"
    href: "/reados/collections/valuing-time-delay-and-uncertainty/"
---

## About this book

A business case for new capacity is usually decided by one forecast more than any other: how much work will come, how fast it will arrive, and what it will earn once it does. Cost estimates get checked line by line against quotes. Volume forecasts rarely get the same treatment, because they are built from conversations with customers, judgement about a market and a sponsor's confidence, and because the people who prepare them often need the project to go ahead. The published evidence on demand forecasts for large projects shows errors that are large, mostly in the optimistic direction and not improving over time.

There is an old argument that this does not matter much. In 1967 the economist Albert Hirschman proposed the **Hiding Hand**: planners who underestimate a project's difficulties also underestimate their own ingenuity, so that ignorance leads people into projects they would otherwise have avoided and then manage to rescue. Later research tested the claim against large samples and found that cost overruns and benefit shortfalls usually arrive together, while critics argued that the tests missed what Hirschman meant. This book takes the debate seriously and asks the practical question for a smaller business: when the forecast for a new facility is optimistic, what does the record say will happen, and how should the forecast be built, checked, tracked and reviewed so that the decision rests on evidence rather than hope?

It works through building a demand forecast from its drivers and testing each driver against the business's own records, modelling the ramp-up to full volume, measuring forecast error and reading base rates, turning those into a forecast range, and finding the switching values and scenarios that decide the case. It then follows the investment into operation: tracking benefits against a phased plan with leading indicators, treating an upside surprise honestly, and running the post-completion review that feeds the next decision. Each chapter carries one running case, includes a plausible error and how it was found, and ends with an exercise and its worked answer.

It is for owners, general and finance managers, sales and operations managers and board members in Australian businesses. It assumes spreadsheet arithmetic and simple discounting; S-curves, error measures and a small simulation are introduced where they are needed.

## The running case

Every chapter follows one fictional decision. This is an illustration. A contract-canning business near Geelong in Victoria has run two mobile canning rigs since 2018, visiting craft breweries to fill and seam their beer on site. In February 2024 its board considered a **fixed canning plant** in a leased industrial unit: one line rated at **200 cans a minute**, with depalletiser, filler and seamer, tunnel pasteuriser, coder, packer and cold room, at a capital cost of **A$5.4 million excluding GST**. The plant would can for four kinds of customer: craft brewers without their own line, ready-to-drink and seltzer brands, non-alcoholic drinks such as kombucha, cold brew and functional drinks, and overflow work from larger brewers.

The managing director's business case forecast **25.32 million cans a year** from the third year, reached through a ramp-up of 70 per cent of that volume in the first year and 95 per cent in the second, and a contribution of about **A$3.2 million a year** against fixed costs of **A$1.3 million**. An independent reviewer tested the forecast against the business's six years of mobile-canning budgets, its record of converting letters of intent into customers, and the ramp-up of its second rig. The plant opened in January 2025, and the book follows it to September 2026, its twenty-first month, through a shortfall in some segments, an unexpected surge in another, and a proposal for a second line.

The business, its customers, its records and every number in the case are invented. None describes KEVOS® work, a real business, a real brand or a real project.

## How to use the book

Read Chapter 1 first: it sets out the Hiding Hand argument and the evidence that the rest of the book tests on the case. Chapters 2 to 4 build the forecast from drivers, test the drivers and model the ramp-up, and are best read in order. Chapters 5 to 7 cover forecast error, the corrected forecast range and the scenarios that decide the case. Chapters 8 to 10 follow the plant into operation: benefit tracking, an upside surprise and the post-completion review. Every calculation in the book was checked by running it, and the WORKOS tools linked in the chapters reproduce the appraisal arithmetic.

The book is one of a series of KEVOS® READOS books on planning and delivering projects, written to be read alongside each other. *Reference Class Forecasting by the Numbers* corrects cost and schedule estimates with the outcomes of similar past projects, and this book applies the same outside view to volumes and benefits. *Front-End Planning by the Numbers* covers the work done before approval that a reliable forecast depends on, *Stage Gates and Stopping Rules by the Numbers* covers how to set the conditions under which a business case is revisited or stopped, and *Outcome-First Projects by the Numbers* covers defining the result a project must deliver before deciding how to deliver it.

## Source limits and professional responsibility

The methods are established and the sources are listed with what each was used for. Where the book quotes published results, they are attributed, they come from the studies' own summaries, and they describe mostly large public projects; their relevance to a small private investment is discussed where they are used. The case's customers, volumes, prices and costs are teaching values, not market data, and a real forecast must be built from real, checked records. This book is general information about forecasting and business cases. It is not financial, investment, legal or tax advice. Decisions about real investments, finance, contracts with customers and the production of food and beverages are matters for the people accountable for them, with professional advice and the applicable regulatory requirements where the stakes require it.
