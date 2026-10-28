---
book: project-teams-and-contracts-by-the-numbers
chapterSlug: choosing-the-delivery-model
order: 10
title: "Choosing the delivery model: comparing contracts by simulation"
description: "A seeded 20,000-run comparison of six contract models for the DC: target cost averages A$15.485m with P80 A$15.938m, an alliance needs a 2.15% cost edge, and admin costs change the answer."
draft: true
---

Chapters 3 to 6 worked each contract model at a handful of chosen outturns, and Chapters 7 to 9 priced the team practices that make any of them work better. The owner now has to choose. A choice made on one outturn, usually the estimate, flatters whichever model looks best at that point and hides what happens when the cost lands somewhere else. The fair comparison runs every model through the same range of outcomes, includes what each costs the owner to administer, and reads the results as a distribution, not a single number.

This chapter sets up a simple simulation of the distribution centre's works cost, runs the five contract models of Chapters 3 to 6 and a hybrid through the same 20,000 outcomes, and compares them on mean cost, P80 and the chance that the contractor loses money. It tests how large a cost advantage the alliance needs to pay for its overhead, describes a comparison that went wrong by leaving the owner's own costs out, and sets out the decision the manufacturer made and why.

## The simulation set-up

This is an illustration. All amounts are A$ million excluding GST. The works' direct cost in each run is modelled as:

```figure
type: formula
title: Direct cost of the works in one simulated run
formula: A = 13.50 × behaviour factor × exp(0.07 × Z) + integration event
- 13.50 | the P50 direct cost under neutral behaviour, from Chapter 1
- Behaviour factor | how the contract model is assumed to move direct cost; a teaching assumption, not research
- exp(0.07 × Z) | general cost uncertainty, Z a standard normal draw; median 1.00
- Integration event | conveyor-WMS integration defects: probability 0.20, adding A$0.90m when it occurs
- Owner changes | a planning allowance of A$0.50m of direct cost, included in every run
step: Seed 20261028, 20,000 runs; the same random draws are used for every model
caption: This is an illustration. Common random numbers mean that differences between models come from the contracts, not from luck in the draws.
```

The owner changes are a planning allowance of A$0.50m of direct cost in every run, not a forecast of any single change; the 400 m² chilled zone of Chapter 5, at A$0.62m, was the largest single change in the case history. Each model prices the change its own way: at a 15% margin under the lump sum, and at the fee under the cost-based models, with the target or TOC adjusted for it.

The **behaviour factors** are the book's teaching assumptions about how each model changes the contractors' own cost. They are stated together here for the first time, and they are not research findings:

- **Lump sum:** 1.00. The contractor already has every incentive to control cost.
- **Cost-plus with a percentage fee:** 1.05. Cost drifts up when the fee rises with it (Chapter 4).
- **Cost-plus with a fixed fee:** 1.03. Less drift, but no reason to cut cost either (Chapter 4).
- **Target cost with bands:** 1.01. The 50% share restores most of the incentive (Chapter 5).
- **Alliance:** 0.98. Joint planning and open problem solving bring cost below neutral (Chapter 6).

Each model also carries the owner's **external cost of administering the contract**, inside the A$15.60m works allowance: quantity surveying, audits, legal, independent estimating and facilitation. These are A$0.15m for the lump sum, A$0.25m for either cost-plus model, A$0.22m for the target cost, A$0.40m for the alliance and A$0.20m for the hybrid. They exclude the owner's own project team of Chapter 8, which is the same under every model.

Two model rules need stating. Under the **lump sum**, when the contractor's cost exceeds the price, the owner is assumed to pay 30% of the contractor's loss through claims, and a further A$0.10m in dispute costs when the loss exceeds A$0.3m. That happens in 8% of runs. The **hybrid** lets the building and civil works (direct cost 9.9) as a lump sum of **11.088**, including a 12% fee and risk allowance, and the racking and conveyors (direct cost 3.6) as a target-cost package with a target of **3.60**, a fee of 0.288 and the same bands as Chapter 5. The integration event falls in the target-cost package.

A component simulation like this is a standard tool, and its limits are well understood. [Forecasting by component: simulation and correlation](/reados/publications/reference-class-forecasting-by-the-numbers/forecasting-by-component/) in *Reference Class Forecasting by the Numbers* shows how much the answer depends on whether components go wrong together, which this model handles crudely by using one draw for all the general uncertainty.

## The results

Across the 20,000 runs, the direct cost under neutral behaviour, before the owner changes, has a mean of 13.716, a P50 of 13.680, a P80 of 14.554 and a P90 of 15.049. The mean sits above the P50 because the integration event adds to the right-hand tail.

```figure
type: compare
title: Owner's cost of the works by contract model, including external administration
cols: Mean | P50 | P80 | P90 | Contractor loss
rowhead: Model
caption: This is an illustration. A$m excluding GST, 20,000 runs, seed 20261028. Against a works allowance of 15.60 and 16.00 with the owner's contingency.
- Lump sum | 15.862 | 15.845 | 15.845 | 15.845 | 8%
- Cost-plus, percentage fee | 16.334 | 16.295 | 17.277 | 17.839 | 0%
- Cost-plus, fixed fee | 15.992 | 15.957 | 16.849 | 17.363 | 0%
- * Target cost with bands | 15.485 | 15.498 | 15.938 | 16.099 | 7%
- Alliance | 15.496 | 15.474 | 15.906 | 16.148 | 0%
- Hybrid | 15.819 | 15.797 | 15.986 | 16.050 | not reported
```

Read against the budget, the works allowance is 15.60, and with the owner's contingency of 0.40 the most the owner can spend is 16.00. Each model's mean is compared with the allowance and its P80 with 16.00:

- **Lump sum:** mean **0.262** over the allowance; P80 **0.155** under 16.00. The owner pays a near-fixed price in 92% of runs, so P50, P80 and P90 are all 15.845. The mean is higher because of claims and disputes in the 8% of runs where the contractor loses.
- **Cost-plus, percentage fee:** mean **0.734** over; P80 **1.277** over. The owner carries every dollar of cost and pays a fee on it, with the worst behaviour assumption.
- **Cost-plus, fixed fee:** mean **0.392** over; P80 **0.849** over. Better, but the owner still carries the whole spread.
- **Target cost:** mean **0.115** under; P80 **0.062** under 16.00. The lowest mean of all six.
- **Alliance:** mean **0.104** under; P80 **0.094** under. Within A$10k of the target cost on the mean, slightly better at P80 and worse at P90.
- **Hybrid:** mean **0.219** over; P80 **0.014** under. The narrowest spread after the lump sum, at a higher average.

```figure
type: range
title: P10 to P90 of the owner's cost by model
min: 14.5
max: 18
unit: A$m
ticks: 14.5 | 15.0 | 15.5 | 16.0 | 16.5 | 17.0 | 17.5 | 18.0
caption: This is an illustration. Excluding GST. The lump sum is a single point from P10 to P90; cost-plus spreads widest; target cost and alliance sit close together across the middle of the range.
- Lump sum | 15.845 | 15.845
- Cost-plus, percentage fee | 14.899 | 17.839
- Cost-plus, fixed fee | 14.686 | 17.363
- * Target cost with bands | 14.874 | 16.099
- Alliance | 14.868 | 16.148
- Hybrid | 15.615 | 16.050
```

The contractor's side completes the picture. Under the lump sum the contractor's profit runs from 0.146 at its P10 to 2.752 at its P90, and it loses money in 8% of runs: that is the risk premium of Chapter 3 at work. Under the target cost its profit runs from 0.182 to 1.586 and it loses in 7% of runs, when overruns pass the break-even of 113.8% of target. Under the alliance, the cap on painshare means the NOPs never lose, and their profit runs from 0.492 to 1.772. Cost-plus pays a steady fee whatever happens. A model that never lets the contractor lose is not necessarily bad for the owner, but the owner must then carry the tail itself, and the alliance's P90 of 16.148 above the target cost's 16.099 is the cap of Chapter 6 showing through.

## How much better an alliance must be

The alliance and the target cost are close enough that the behaviour assumption decides between them. Rerunning the alliance with different behaviour factors, holding everything else fixed, shows that its mean matches the target cost's at a factor of **0.9785**, a direct cost **2.15% below neutral**. The case assumes 0.98, so the alliance falls just short, by about A$10k on the mean.

The mean hides a split. On the same draws, the alliance is cheaper than the target cost in about **82%** of runs, mostly the ordinary ones, because its lower behaviour factor saves money near the middle of the distribution. It is dearer in the remaining runs, the expensive ones, because the NOPs' painshare stops at A$1.080m while the target-cost contractor keeps paying 80% of overruns beyond 110%. The chance of exceeding 16.00 is about 15% for the alliance and 17% for the target cost; both are well above the lump sum's 5%, which comes only from disputes.

The honest reading is that the simulation cannot separate these two models. A behaviour factor is not something anyone can measure in advance to the nearest half per cent. The choice between them has to rest on other grounds: the owner's capacity to run an alliance, whether the work's uncertainty justifies it, and whether the collaborative practices that are supposed to produce the 0.98 can be had without the alliance.

## Checking the simulation before using it

A simulation is a calculation like any other, and it needs checking before a board relies on it. Four checks were made on this one. First, each model's payment rule was tested against hand calculations already in the book: the target-cost rule against the share table of Chapter 5 and the alliance rule against the cap table and exercise of Chapter 6, run through the code with Z = 0 and no event. Second, the run is **reproducible**: the seed is recorded, so anyone can rerun it and get the same numbers. Third, the number of runs is enough for the question. Because every model uses the same draws, the difference between the alliance and the target cost varies much less than either model's cost; its standard deviation across runs is about 0.108, so the standard error of the A$10k difference in means is under A$1k. The difference is real within the model, even though it is small. Fourth, the inputs that matter most were varied one at a time. The behaviour factor is the most powerful of them, which is why the break-even of 0.9785 is reported; the probability and size of the integration event matter next, because they drive the tail where the cap and the bands differ.

None of these checks makes the behaviour factors true. They show only that the arithmetic does what it says, and that the conclusion depends on assumptions the reader can see and replace.

## The error: comparing contract prices without the cost of running them

This is an illustration. The first version of the comparison, prepared for the steering group, compared the models on the owner's payments to the contractors alone. On that basis the alliance's mean was **15.096** against the target cost's **15.265**, and the alliance looked **0.170** cheaper. The draft paper recommended the alliance.

The owner's contract administrator noticed that the alliance's independent estimator, audits, facilitation and joint office share appeared nowhere in the comparison, although they were real costs inside the works allowance. Adding each model's external administration, 0.40 for the alliance and 0.22 for the target cost, reversed the result: the target cost became cheaper by about **A$10k** (the means of 15.485 and 15.496 shown in the results differ by A$10k before rounding). The recommendation was withdrawn and the paper rewritten around the full cost to the owner.

The lesson is general. A comparison of contract models should include everything the owner spends because of the choice: external administration, the risk premium priced into a lump sum, the claims that a lump sum generates when the contractor is losing, and the owner's own time where it differs between models. Leaving out the cost of running a contract always favours the models that cost most to run.

## The decision

The choice had to be made before the works were awarded at the start of month 5, the point at which the owner commits most of its money; comparing options by their expected cost and spread at that point is the same reasoning as [Expected value and the decision tree at the development gate](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/the-decision-tree-at-the-gate/) in *Stage Gates and Stopping Rules by the Numbers*.

The manufacturer chose **one target-cost contract for the works**, with the same 50% inner band and 80% and 30% outer bands as Chapter 5, and required the builder to let the conveyor and controls package on **back-to-back target terms**, so that the integrator shares in the outcome of the work where the integration risk sits. It did not form an alliance. It adopted instead the collaborative practices of Chapters 7 to 9: a core coordination group of 7, a weekly joint forum with delegated decision limits, the shared scorecard, and the joint site office from month 10 to month 18.

The reasons, in order: the target cost had the lowest mean and a P80 inside the 16.00 limit; its P90 was below the alliance's; the alliance's A$400k overhead needed a 2.15% cost advantage just to break even, which the owner could not count on; and the owner, a food manufacturer running its first large project, did not have the people to sit in an alliance leadership group for 18 months. The lump sum was rejected despite its narrow spread because it cost about A$377k more on average for that certainty, and because the conveyor and WMS integration was too incomplete at award to price without the renegotiation costs that Bajari and Tadelis (2001) associate with fixed prices on incomplete designs. The hybrid's narrow spread was attractive, but it cost A$334k more than the target cost on average.

```figure
type: decision
title: When each contract model fits
question: How complete is the design, and who can control the main risks
- Design complete, risks priceable | Lump sum | the owner buys certainty and pays the risk premium; avoid when integration is open
- Design incomplete, work too new to price | Cost-plus, fixed fee | with open-book audit; a guaranteed maximum price if a cap is needed
- * Design mostly complete, shared risks remain | Target cost with bands | the case's choice, with back-to-back target terms where the shared risk sits
- Large, uncertain, owner able to lead jointly | Alliance | only if the behaviour advantage is credible and the owner can staff the leadership group
- Parts differ sharply in definition | Hybrid | lump sum for the defined part, target cost for the uncertain part, at extra interface cost
caption: This is an illustration. The highlighted branch is the manufacturer's choice for the DC works; the conditions are general and each real project needs its own comparison.
```

The contract model is only one part of the delivery decision. Who designs, when the contractor is involved, and whether the owner manages trade packages itself are separate choices, covered in [Early contractor involvement, managing contractors and construction management explained](/reados/collections/project-delivery-procurement-and-governance/early-contractor-involvement-and-managing-contractors/). Walker and Lloyd-Walker (2015) set these choices in a wider taxonomy of relationship-based procurement. For readers who want to build a simulation like this one, [Monte Carlo in a spreadsheet: will the unit last the day](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/) in *Prototypes and Simulation by the Numbers* works a simulation step by step and compares it with a plan built on averages.

## Exercise: one run with the integration event

Take a single run in which the integration event occurs and every other cost is at its median (Z = 0). Under the target-cost contract, what does the owner pay including administration? Under the lump sum, does the contractor make a claim, and what does the owner pay?

**Worked answer.** Under the **target cost**, the direct cost is 13.50 × 1.01 + 0.90 = **14.535**, and with the owner changes 14.535 + 0.50 = **15.035**. The target, adjusted for the changes, is 13.50 + 0.50 = **14.00**, so the overrun is **1.035**, inside the 10% band of 1.40, and the contractor's pain is half of it, 0.5175, about **0.518**. The fee, adjusted by 8% of the changes, is 1.080 + 0.040 = **1.120**. The owner pays 15.035 + 1.120 − 0.5175 = 15.6375, about **15.638**, or **15.858** with the A$0.22m administration. Under the **lump sum**, the contractor's cost is 13.50 + 0.90 + 0.50 = **14.900**, below the price of 15.120 + 0.575 = **15.695**, so the contractor still makes a profit and has no loss to recover through claims. The owner pays 15.695 + 0.15 = **15.845**. In this run the lump sum is about A$12.5k cheaper: the integration event is exactly the kind of risk whose cost the lump-sum contractor absorbs from its risk premium. The target cost wins on average because, across all runs, the owner pays less than that premium for the risks that do occur.
