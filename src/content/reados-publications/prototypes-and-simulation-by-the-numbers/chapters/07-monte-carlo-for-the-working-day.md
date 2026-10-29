---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: monte-carlo-for-the-working-day
order: 7
title: "Monte Carlo in a spreadsheet: will the unit last the day"
description: "A seeded 10,000-run model of site demand, capacity, cold and ageing finds an 8.22% chance of running out at 2 years, against a 55% margin from averages, and sizes the cell change."
draft: true
---

Requirement R1 says the BPU-5 must last a full site day, 7:00 to 15:30, on at least 95% of days on a typical residential site through its first two years. That is a statement about the bad days, not the average day. A calculation that compares average energy available with average energy used cannot answer it, however carefully it is done, because the days that matter are the ones where demand is high, the morning is cold and the pack is old.

This chapter builds the model that does answer it: a Monte Carlo simulation that draws thousands of possible site days from distributions of demand, capacity, temperature and ageing, and counts the share on which the unit runs out. It shows the inputs and where they came from, a recipe that runs in any spreadsheet, how many runs are enough, how to check the model, what it found for the BPU-5, and how an averages-only brief and a first simulation with the wrong inputs both gave the programme false comfort.

## The method in one paragraph

Monte Carlo simulation, named and described in the open literature by Metropolis and Ulam in 1949, replaces an awkward probability calculation with repeated sampling. Each run draws one value for every uncertain input from its distribution, computes the outcome, and records it. After many runs, the share of runs with a given outcome estimates its probability, and the spread of results shows the range. Law's *Simulation Modeling and Analysis* covers the practice in depth: choosing input distributions from data, generating random numbers, verifying and validating the model, and judging how many runs are needed. The method is only as good as its inputs, and most of this chapter is about them.

## The inputs and their sources

This is an illustration. All amounts are Australian dollars excluding GST.

**Daily demand.** The load loggers placed on six residential sites, the A$4,800 analytical prototype listed in [Choosing prototype fidelity: the cheapest build that answers the question](/reados/publications/prototypes-and-simulation-by-the-numbers/choosing-prototype-fidelity/), recorded 40 site-days of the AC energy that a small petrol generator actually supplied between 7:00 and 15:30. Daily energy is positive and skewed to the right: most days are moderate, and a few, with a concrete grinder or a long run on a drop saw, are much heavier. A lognormal distribution suits that shape, and fitting one to the 40 days gave a median of **2.4 kWh** and a standard deviation of the logarithm of **0.30**. The mean of that distribution is 2.4 × e^(0.30² ÷ 2) = **2.51 kWh**; its 90th percentile is **3.525 kWh** and its 95th percentile **3.931 kWh**.

**Usable capacity.** From the DVT energy test in [Measured performance: sample sizes for means and comparisons](/reados/publications/prototypes-and-simulation-by-the-numbers/measured-performance-and-sample-size/): normal, mean **4.41 kWh**, standard deviation **0.06 kWh**, for the 100 Ah cells.

**Cold derate.** Lithium iron phosphate cells deliver less energy when cold. On a winter morning in the case, a unit delivers between 92% and 100% of its rated energy, depending on the night's temperature. With no better information, the model treats the factor as uniform between **0.92 and 1.00**, mean 0.96.

**Inverter efficiency.** Fixed at **0.92**, the DC-to-AC efficiency in the product data.

**Ageing.** The case's cell data give a capacity retention of **0.94** after two years of the expected site duty. A new unit uses 1.00.

On each simulated day, the energy the unit can supply is capacity × derate × 0.92 × ageing, and the unit runs out before 15:30 if the day's demand exceeds it.

```figure
type: bars
title: Daily site demand, share of days by band
unit: %
max: 30
caption: This is an illustration. Lognormal fitted to 40 logged site-days, median 2.4 kWh, mean 2.51 kWh, σ(ln) 0.30. A 2-year-old unit on an average morning supplies about 3.66 kWh; about 8% of days need more than that. Shares rounded, so they total 99.9%.
- Below 1.5 kWh | 5.9
- 1.5 to 2.0 kWh | 21.3
- 2.0 to 2.5 kWh | 28.2
- 2.5 to 3.0 kWh | 21.7
- 3.0 to 3.5 kWh | 12.4
- * 3.5 to 4.0 kWh | 6.0 | available at 2 years falls in this band
- 4.0 to 4.5 kWh | 2.6
- Above 4.5 kWh | 1.8
```

## A recipe for a spreadsheet

The model fits in six columns, one row per simulated day:

1. Demand: `=LOGNORM.INV(RAND(), LN(2.4), 0.3)`
2. Capacity: `=NORM.INV(RAND(), 4.41, 0.06)`
3. Cold derate: `=0.92 + 0.08*RAND()`
4. Available AC energy: capacity × derate × 0.92 × 0.94 for a 2-year unit
5. Short: `=IF(demand > available, 1, 0)`
6. Shortfall: `=MAX(0, demand − available)`

Fill the formulas down 10,000 rows. The average of column 5 is the probability of running out; the sum of column 6 divided by the sum of column 5 is the mean shortfall on the days the unit runs out. Each `RAND()` call is a separate, independent draw, which is what the model assumes.

A spreadsheet's `RAND()` recalculates every time the sheet changes, so the answer moves each time it is opened. For a result that others can check, either copy the random columns and paste them as values once generated, or generate the random numbers with a seeded generator and import them. The numbers in this chapter came from a short script using the mulberry32 generator with seed **20261028**; a spreadsheet will give slightly different results, within the sampling error described next.

```figure
type: steps
title: Building the site-day model
caption: This is an illustration. The order matters: the question and the requirement come before any distribution is chosen.
- State the question | probability that a 2-year-old unit runs out before 15:30; R1 allows at most 5%
- Choose each input and its source | demand from 40 logged site-days; capacity from 12 DVT units; derate, efficiency and ageing from data sheets
- Fix the random numbers | seeded generator, seed 20261028, 10,000 runs
- Compute each day | available = capacity × derate × 0.92 × ageing; short if demand exceeds it
- Count and measure | share of short days, its standard error, mean shortfall
- * Verify and validate | fixed-input check against a hand calculation; other seeds; logged days against the fitted distribution
- Use it for the decision | capacity needed, options compared on the same seed
```

## How many runs are enough

A simulated probability is an estimate with a standard error of √(p(1 − p) ÷ N) for N runs. To estimate a probability near 5% within ±0.5 percentage points at 95% confidence needs

N = 1.96² × 0.05 × 0.95 ÷ 0.005² = **7,299 runs**,

so 10,000 is a sensible round number. At 10,000 runs, a result of 8.22% has a standard error of 0.27 points.

Running the same model with three other seeds is a cheap check on that arithmetic. For the 2-year unit, seeds 20261029, 20261030 and 20261031 gave **7.95%, 8.12% and 7.80%**, all within two standard errors of the main run. If repeated seeds disagreed by much more than the standard error, the model would have an error in it, such as a random number reused across inputs.

## Verifying the model

Verification asks whether the model does what its author intended. The simplest test is to switch off every source of spread except one, where the answer can be worked by hand. With capacity fixed at 4.41 kWh and derate fixed at 0.96, a 2-year unit always supplies 4.41 × 0.96 × 0.92 × 0.94 = 3.661 kWh, and the probability of running out is just the probability that lognormal demand exceeds 3.661 kWh: **7.96%** from the normal tables. The seeded simulation with those inputs fixed gave **7.85%**, within one standard error. The model's arithmetic is right.

The same test shows something useful about the BPU-5. With full spread in capacity and derate, the answer rises only from 7.96% to 8.22%. Almost all the risk comes from the spread of site demand; the unit-to-unit spread of 0.06 kWh hardly matters. Effort spent narrowing the capacity spread would buy little. Effort spent on more energy, or on the heaviest days, would buy a lot.

Validation asks whether the model represents the real system well enough for the decision. Its weakest input is the demand distribution, fitted to 40 days from six sites. Two checks belong here: compare the share of logged days above 3.5 kWh with the fitted distribution's prediction of 10.4%, about 4 of the 40 days, and rerun the model with σ(ln) set either side of 0.30 to see whether the conclusion changes. Both are ordinary steps in Law's account of validation. A third limit was noted and left open: the model treats cold mornings and heavy demand as independent, and on real sites they may not be. [Forecasting by component: simulation and correlation](/reados/publications/reference-class-forecasting-by-the-numbers/forecasting-by-component/) in *Reference Class Forecasting by the Numbers* shows how much an ignored correlation can understate a tail.

## Results for the DVT design

This is an illustration. With 10,000 runs and seed 20261028:

- **New unit:** runs out on **5.41%** of days (standard error 0.23 points), with a mean shortfall of 0.548 kWh on those days.
- **2-year unit:** runs out on **8.22%** of days (standard error 0.27 points), with a mean shortfall of **0.554 kWh**.

R1 allows 5% at two years, so the DVT design fails it, and not narrowly. The mean shortfall shows what a short day looks like: on a heavy day drawing about 3.9 kWh over the 8.5 hours, 0.55 kWh is a little over an hour of work lost at the end of the afternoon. To find what would pass, the model was run repeatedly with the same seed and the mean usable capacity adjusted until the 2-year probability fell to 5%. That happens at **4.749 kWh**, 0.34 kWh or 7.7% more than the DVT units deliver.

## Options, and the one chosen

Two options were modelled on the same seed, so that their differences reflect the options and not the random numbers.

**Same-footprint 120 Ah cells.** The cell maker offered a 120 Ah cell in the same case size. Sixteen of them give 16 × 3.2 V × 120 Ah = 6.144 kWh nominal, and scaling the DVT result gives an expected usable energy of 4.41 × 1.2 = **5.29 kWh**. The model gives **1.35%** for a new unit and **2.25%** at two years, comfortably inside R1. The cost is **A$320 a unit**, raising the target unit cost from A$4,400 to **A$4,720** and cutting the contribution from A$2,500 to A$2,180, and **5 kg**, raising the mass from 82 kg to **87 kg**. The handling question that the 82 kg plywood mock-up answered at concept had to be asked again at the new mass.

**A lunchtime top-up.** A 30-minute charge from a site 10 A outlet at 2.0 kW adds about 2.0 × 0.5 × 0.92 = 0.92 kWh to the battery. With the 100 Ah cells, the 2-year probability falls to **2.01%**. It costs nothing in the product, but it depends on a site outlet being free at lunch and on someone plugging the unit in every day, which the business could not promise its customers.

The DVT review chose the 120 Ah cells. The change reopened the evidence that depended on the cells, which Chapter 10 counts in the programme's outturn.

```figure
type: compare
title: What each analysis said about R1
cols: New unit | 2-year unit | Verdict
caption: This is an illustration. Simulations use 10,000 runs, seed 20261028. Only the DVT-based model with ageing answers R1 as written; the earlier two answered easier questions.
- Averages only, concept method with DVT capacity | 55.1% margin | 45.8% margin | looked comfortable
- Concept Monte Carlo, 4.50 kWh, no ageing | 4.62% | not run | apparent pass
- Concept inputs with ageing added | | 7.30% | fails
- * DVT capacity 4.41 kWh | 5.41% | 8.22% | fails R1
- 120 Ah cells, 5.29 kWh | 1.35% | 2.25% | passes; A$320 and 5 kg a unit
- 100 Ah with 30-minute top-up | | 2.01% | passes if sites cooperate
```

## The error: an average, then the wrong inputs

This is an illustration. The concept brief checked R1 with averages: usable capacity times the mean cold derate times the inverter efficiency, compared with mean daily demand. Repeated with the measured DVT capacity, the same method gives 4.41 × 0.96 × 0.92 = **3.895 kWh** available against a mean demand of 2.51 kWh, a margin of **55.1%**. Even at two years, 3.661 kWh against 2.51 kWh leaves **45.8%**. A margin of that size invites the conclusion that the battery is oversized. It says nothing about the 95% requirement, because a lognormal demand exceeds its own mean on about 44% of days, and about 8% of days need more than 3.661 kWh. The averages-only method cannot see those days, whatever capacity is put into it.

The first Monte Carlo model, run at concept, was a real improvement but answered the wrong question. It used the nameplate usable energy of 4.50 kWh and left out ageing, so it described a new unit with the claimed energy. It gave **4.62%**, an apparent pass, and was reported as one. With ageing included, those same inputs would have given **7.30%**, a fail.

The error was detected at DVT, when the lead electrical engineer replaced the claimed capacity with the measured mean of 4.41 kWh and the review asked which condition R1 named. Rerun with measured capacity and the 2-year ageing factor, the model gave 8.22%. The correction had two parts: the model's inputs were taken from measurements as soon as they existed, and every result was reported against the condition the requirement states, here a 2-year-old unit. Had the 2-year case been run at concept, the shortfall would have been visible while choosing cells cost a concept-stage change rather than a requalification at DVT.

## When a spreadsheet model is enough

The BPU-5's model has five inputs and one output, and it runs in seconds in a spreadsheet. That is the right size for a question of this kind: a single performance requirement stated as a probability, with inputs that can be measured or bounded. It is not a substitute for testing. The model's capacity input came from twelve measured units, its demand from 40 logged days, and its conclusion was later checked against the PVT build. A model with more inputs than evidence is a different matter: every distribution is then a guess, and the output inherits them all. The same discipline appears in planning projects against fixed dates; [A fixed deadline: the cost of delay as a cliff](/reados/publications/front-end-planning-by-the-numbers/the-harvest-deadline/) in *Front-End Planning by the Numbers* applies a schedule simulation to a seasonal deadline in the same way. The PVT result and the final R1 evidence appear in [Design reviews and the release decision](/reados/publications/prototypes-and-simulation-by-the-numbers/design-reviews-and-release/).

## Exercise: the smallest cell that meets R1

The cell maker's catalogue offers same-footprint cells in 100 Ah and 120 Ah only, but the product manager asks what capacity would just meet R1, to judge whether a custom cell is worth requesting. Assume usable energy scales with cell capacity from the DVT result. What is the smallest cell capacity that meets R1 at two years, which catalogue cell is needed, and what does the change add to cost in year 1?

**Worked answer.** R1 at two years needs a mean usable capacity of 4.749 kWh. The 100 Ah cells give 4.41 kWh, so the cell must be at least 4.749 ÷ 4.41 × 100 Ah = **107.7 Ah**. The next catalogue size is **120 Ah**, which gives 5.29 kWh and a 2-year probability of 2.25%, well inside R1. At A$320 a unit over the year-1 volume of 1,000 units, the change adds **A$320,000** in year 1. A custom 108 Ah cell would cut that only if its price premium were well under A$320 a unit, and it would leave almost no margin against R1; the catalogue cell buys margin as well as compliance.
