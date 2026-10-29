---
title: "Prototypes and Simulation by the Numbers"
subtitle: "Prototype fidelity, the value of a test, sample sizes, Monte Carlo and queueing models, worked through one product from concept to release"
description: "Find design problems while they are cheap: cost of change, prototype fidelity, value of information, test sample sizes, Monte Carlo, queues, discrete-event simulation and reviews."
category: Products
tags: [product-development, prototyping, experimentation, validation, projects]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-29
referencesChecked: 2026-10-28
edition: "1"
level: "Intermediate product development and engineering decision practice"
audience: "Product, engineering and project managers, design and test engineers, and owners of Australian businesses who plan prototype builds, tests and simulations for a new product and must decide how much to spend finding out before committing."
outcomes:
  - "Put a cost on a design problem by the stage at which it is found, and plan where problems should be found."
  - "Choose the cheapest prototype that answers a question, and value a test or another iteration against its cost and delay."
  - "Size pass/fail and measured tests, and state what a small sample does and does not show."
  - "Build simple Monte Carlo, queueing and discrete-event models, check them, and read their results with their uncertainty."
  - "Run design reviews that test evidence, and set release criteria that the evidence must meet."
coverVariant: category
references:
  - title: "How Big Things Get Done"
    creator: "Bent Flyvbjerg and Dan Gardner"
    year: "2023"
    note: "Supplied source, in copyright. Used only as a subject map for the theme of planning by iterating with cheap models and tests. No passages, chapter structure, stories, heuristics or figures are reproduced, and the book's substance rests on the other sources listed."
  - title: "Experimentation Matters: Unlocking the Potential of New Technologies for Innovation"
    creator: "Stefan H. Thomke, Harvard Business School Press"
    year: "2003"
    note: "Background on experimentation as the core of development, on simulation and rapid prototyping changing its cost and speed, and on experimenting early and often. Used in Chapters 1, 2 and 4; no figures are quoted from it."
  - title: "Managing experimentation in the design of new products"
    creator: "Stefan H. Thomke, Management Science 44(6), 743–762"
    year: "1998"
    url: "https://doi.org/10.1287/mnsc.44.6.743"
    note: "Source for treating each experiment as a problem-solving cycle whose cost and duration depend on the fidelity of the model or prototype used. Background to the iteration model in Chapter 4."
  - title: "Product Design and Development, 7th edition"
    creator: "Karl T. Ulrich, Steven D. Eppinger and Maria C. Yang, McGraw-Hill Education"
    year: "2020"
    note: "Source for classifying prototypes as analytical or physical and as focused or comprehensive, and for matching each prototype to its purpose. Used in Chapter 2; the classification is described in the book's own words."
  - title: "Software defect reduction top 10 list"
    creator: "Barry Boehm and Victor R. Basili, IEEE Computer 34(1), 135–137"
    year: "2001"
    url: "https://doi.org/10.1109/2.962984"
    note: "Quoted in Chapter 1 for its software findings only: fixing a problem after delivery is often about 100 times as costly as during requirements and design, and for small, noncritical software systems the factor is more like 5:1. Neither ratio is applied to hardware; the running case uses its own records."
  - title: "Information value theory"
    creator: "Ronald A. Howard, IEEE Transactions on Systems Science and Cybernetics SSC-2(1), 22–26"
    year: "1966"
    note: "Origin of valuing information by what it changes in a decision under uncertainty. The basis of the expected value of perfect and sample information in Chapter 3."
  - title: "The use of confidence or fiducial limits illustrated in the case of the binomial"
    creator: "C. J. Clopper and E. S. Pearson, Biometrika 26(4), 404–413"
    year: "1934"
    url: "https://doi.org/10.2307/2331986"
    note: "Source of the exact binomial confidence bounds used in Chapter 5 to state what a small pass/fail sample shows."
  - title: "If nothing goes wrong, is everything all right? Interpreting zero numerators"
    creator: "James A. Hanley and Abby Lippman-Hand, Journal of the American Medical Association 249(13), 1743–1745"
    year: "1983"
    note: "Source of the rule of three for zero failures in n trials, used as a cross-check in Chapter 5."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods (NIST Handbook 151)"
    creator: "National Institute of Standards and Technology"
    year: "online, first issued 2002"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Reference for sample sizes when testing a mean (section 7.2.2.2), for confidence intervals and comparisons of means, and for planning reliability test length (section 8.3.1.1). Used in Chapters 5 and 6; the case's calculations are the book's own."
  - title: "The Monte Carlo method"
    creator: "Nicholas Metropolis and S. Ulam, Journal of the American Statistical Association 44(247), 335–341"
    year: "1949"
    note: "The paper that named and described the Monte Carlo method. Cited in Chapter 7 for the method's origin."
  - title: "Simulation Modeling and Analysis, 5th edition"
    creator: "Averill M. Law, McGraw-Hill Education"
    year: "2015"
    note: "Main reference for building, verifying, validating and running simulation models, including input distributions, random numbers, replications and output analysis. Used in Chapters 7 and 9."
  - title: "A proof for the queuing formula: L = λW"
    creator: "John D. C. Little, Operations Research 9(3), 383–387"
    year: "1961"
    url: "https://doi.org/10.1287/opre.9.3.383"
    note: "Source of Little's law, that the average number of items in a stable system equals their arrival rate times their average time in the system. Used in Chapters 8 and 9."
  - title: "The single server queue in heavy traffic"
    creator: "J. F. C. Kingman, Proceedings of the Cambridge Philosophical Society 57, 902–904"
    year: "1961"
    note: "Origin of the heavy-traffic approximation for the mean wait in a single-server queue, used in Chapter 8 to show how waiting grows with utilisation and variability."
  - title: "The Principles of Product Development Flow"
    creator: "Donald G. Reinertsen, Celeritas Publishing"
    year: "2009"
    note: "Background on cost of delay, queues in product development and fast feedback, used in Chapters 3, 4 and 8."
  - title: "IEC 61160 Design review"
    creator: "International Electrotechnical Commission"
    year: "2005 (edition 2.0)"
    note: "Named by number and scope as the international standard giving guidance on planning and conducting design reviews. No clauses are quoted; the review practice in Chapter 10 is the book's own."
  - title: "IEC 62619 Safety requirements for secondary lithium cells and batteries, for use in industrial applications"
    creator: "International Electrotechnical Commission"
    year: "2022 (edition 2.0)"
    url: "https://webstore.iec.ch/publication/64073"
    note: "Named by number and scope as an example of a battery safety standard a product like the running case's must be assessed against. No requirements are quoted."
  - title: "AS/NZS 3012 Electrical installations: Construction and demolition sites"
    creator: "Standards Australia and Standards New Zealand"
    year: "2019"
    url: "https://store.standards.org.au/product/as-nzs-3012-2019"
    note: "Named by number and scope as the standard for electrical installations and the in-service testing of electrical equipment on construction and demolition sites, the setting of the running case's product. No requirements are quoted."
  - title: "UN Recommendations on the Transport of Dangerous Goods, Manual of Tests and Criteria, subsection 38.3"
    creator: "United Nations"
    year: "current revised edition"
    note: "Named as the set of tests lithium cells and batteries must pass before they are transported. No test parameters are quoted."
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
  - title: "First-of-a-Kind Technology by the Numbers"
    href: "/reados/publications/first-of-a-kind-technology-by-the-numbers/"
  - title: "Demand and Benefit Forecasts by the Numbers"
    href: "/reados/publications/demand-and-benefit-forecasts-by-the-numbers/"
  - title: "Project Teams and Contracts by the Numbers"
    href: "/reados/publications/project-teams-and-contracts-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Design Simulation by the Numbers"
    href: "/reados/publications/design-simulation-by-the-numbers/"
  - title: "Product Development and Launch"
    href: "/reados/collections/product-development-and-launch/"
---

## About this book

Every new product carries design problems that nobody has found yet. The plan cannot remove them; it can only decide where they will be found, and that decides what they cost. A problem found in a spreadsheet model costs an engineer's afternoon. The same problem found in a production unit costs rework, retesting and lost weeks, and one found by customers after release costs field repairs and reputation. Planning by iterating means spending deliberately on cheap models, prototypes and tests early, so that the expensive surprises happen in the lab rather than on a customer's site.

This book puts numbers on that spending. It starts with the cost of a problem by the stage at which it is found, then covers how to choose the fidelity of each prototype, how to value a test before paying for it, and how many rounds of iteration are worth running. It turns to test statistics: what a pass/fail test on a small sample shows, and how many units a measured comparison needs. It then builds three kinds of model that any engineering team can run: a Monte Carlo simulation of a product in use, a queueing model of a test lab, and a discrete-event simulation of a production test line. It ends with design reviews that examine evidence and the release decision that the evidence must support. Each chapter follows one running case, includes a plausible error and how it was found, and ends with an exercise and its worked answer.

It is for product, engineering and project managers, design and test engineers, and owners who plan development work. It assumes spreadsheet arithmetic and a little school statistics; probability, sampling and simulation are introduced where they are needed.

## The running case

Every chapter follows one fictional development programme. This is an illustration. A Brisbane manufacturer of temporary power and lighting equipment for building sites, with about 45 staff, is developing the **BPU-5**, a wheeled battery power unit that replaces small petrol generators on residential building sites. It has a lithium iron phosphate battery of **5.12 kWh** nominal, a **3.0 kW** inverter supplying 230 V outlets, and a target mass of **82 kg**, and it must run a typical site's tools from 7:00 to 15:30 and recharge overnight.

The programme runs from concept approval to production release in **72 weeks**, with a development budget of **A$1.45 million**, through a concept stage, an engineering validation build of 4 units, a design validation build of 12 units and a production pilot of 30 units, each followed by a formal review. The unit sells for **A$6,900**, and the business estimates that each week of later release costs about **A$25,000** of contribution. The business's records from its previous new product, a lighting tower, show where that product's design problems were found and what each cost to fix.

The business, its products, its records, its people and every number in the case are invented. None describes KEVOS® work, a real business or a real product. All amounts are Australian dollars excluding GST.

## How to use the book

Read Chapter 1 first, because the cost of a problem by stage and the cost of delay are used throughout. Chapters 2 to 4 cover what to build and when to stop iterating, Chapters 5 and 6 test sample sizes, Chapters 7 to 9 simulation and queueing models, and Chapter 10 reviews and release. Chapters 5 to 9 can be read in any order after Chapter 1. Every calculation was checked by running it, simulation results state their random seed and number of runs, and the WORKOS tools linked in the chapters reproduce the sample-size arithmetic.

The book is one of a series of KEVOS® READOS books on planning and delivering projects. The most relevant companions are *Modular Projects by the Numbers*, which applies models, pilots and acceptance tests to a rollout of identical units; *Stage Gates and Stopping Rules by the Numbers*, which treats the gate decisions that this book's evidence feeds; *First-of-a-Kind Technology by the Numbers*, which deals with the extra risk of technology that has not been used at scale; and *Reference Class Forecasting by the Numbers*, which corrects cost and schedule estimates with the outcomes of similar past projects.

## Source limits and professional responsibility

The methods are established and the sources are listed with what each was used for. Where the book quotes published results, they are attributed and their limits are stated; the cost-of-change ratios from software research, in particular, are not transferred to hardware. The running case's costs, rates, test results and model inputs are teaching values, not market prices or measured data, and a real programme needs its own records, tests and analysis. Battery power equipment for building sites is subject to electrical safety, battery safety and transport requirements, work health and safety law, and the standards and regulators that apply in each state and territory; it must be designed, tested and certified by competent people. This book teaches how to plan development work and read its evidence. It is not an engineering design, a safety assessment, a compliance opinion or advice for any real product.
