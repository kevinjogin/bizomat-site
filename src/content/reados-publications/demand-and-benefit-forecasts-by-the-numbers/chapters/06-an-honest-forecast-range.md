---
book: demand-and-benefit-forecasts-by-the-numbers
chapterSlug: an-honest-forecast-range
order: 6
title: "From base rates to an honest forecast range"
description: "A 20,000-run simulation of 72 prospects gives P10 11.57m, P50 15.33m and P90 19.20m cans against a 25.32m plan; a top-down cross-check, and a double haircut caught."
draft: false
---

Chapter 3 replaced the sponsor's count of customers with expected values from the business's own record, and the plant's steady-state volume fell from 25.32m to 15.367m cans a year. An expected value is still one number. A board deciding whether to spend A$5.4m excluding GST on a canning line needs more than the middle of the outcomes: it needs to know how far the result could fall either side, and how likely the plan's own figure is.

This chapter turns the record into a distribution by simulation, reads the result as a forecast range, adds the effect of prospects moving together, and checks the range against the top-down ratios from Chapter 5. It ends with an error that looks prudent and is not: correcting the same optimism twice.

## From an expected value to a distribution

This is an illustration. The reviewer's driver-level forecast in February 2024 rested on 72 named prospects: 37 letters of intent and 35 other named prospects across the four segments. With the record's conversion rates of 70.8% for a letter of intent and 25.0% for another named prospect, the expected number of customers was 34.96, against the sponsor's 50. Each converted customer was then expected to deliver 0.800 of the volume the sponsor had assumed for it, the mean realisation of the 17 customers won with rig 2.

Expected values add up neatly, but they hide how lumpy the outcome is. Segment B, the ready-to-drink and seltzer brands, had only nine prospects, each assumed at 2.4m cans a year. Whether three or five of them sign moves the plant's volume by several million cans, and no amount of averaging changes the fact that a brand either signs or does not. Segment A, by contrast, had 40 small prospects at 108,000 cans each; its total is far more predictable because the ups and downs of individual brewers cancel.

Hyndman and Athanasopoulos, in *Forecasting: Principles and Practice*, treat a forecast as a probability distribution of possible futures, with the point forecast as its middle and a **prediction interval** as a range expected to contain the outcome with a stated probability. The question for the plant is therefore not "what is the forecast" but "what is the distribution of steady-state volume, given what the business knows about how prospects convert and how much customers really order".

## The simulation recipe

When the drivers are independent yes-or-no events multiplied by uncertain sizes, the distribution is easiest to find by simulation: play the launch out many times with the record's probabilities and look at the spread of results.

```figure
type: steps
title: Simulating the plant's steady-state volume from its prospects
caption: This is an illustration. Each run plays out the launch once. The probabilities and the 17 realisation values come from the rig 2 record in Chapter 3.
- List every prospect with its class | 72 named prospects: 37 letters of intent and 35 other named prospects, in segments A to D
- Draw whether each prospect converts | probability 0.708 for a letter of intent, 0.250 for another named prospect
- Give each converted customer a volume | the sponsor's volume per customer (A 108,000; B 2,400,000; C 600,000; D 960,000 cans a year) × one of the 17 recorded realisations, drawn at random
- Add up the plant | total volume, and contribution at each segment's contribution per can
- * Repeat 20,000 times | with a fixed seed, 20240227, so that the result can be reproduced
- Read the percentiles | PERCENTILE.INC on the 20,000 totals: P10, P20, P50, P80 and P90
```

Two choices in the recipe matter. First, the realisation is drawn from the 17 recorded values themselves, each with equal chance, rather than from a fitted normal curve. This is a **bootstrap**: it keeps the shape of the record, including the low tail at 0.42 and the two customers above 1.00, without assuming a shape the data may not have. Second, every draw is independent of every other, which the next section relaxes.

In a spreadsheet the recipe needs one row per prospect, a `RAND()` compared with the conversion probability, and an `INDEX` into the 17 realisations with `RANDBETWEEN(1,17)`; a data table repeats the calculation. Spreadsheet random numbers cannot be seeded, so once the run is accepted its 20,000 totals should be pasted as values and kept with the forecast, or every recalculation will produce slightly different percentiles. [Monte Carlo in a spreadsheet: will the unit last the day](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/) in *Prototypes and Simulation by the Numbers* sets out the same spreadsheet discipline for an engineering question.

A first check on any simulation is that its mean agrees with the arithmetic it replaces. The simulated mean was 15.37m cans, the same as the expected value of 15.367m from Chapter 3, and the simulated customer count averaged 35.00 against the expected 34.96. A simulation that cannot reproduce the hand calculation has a fault in it, and should not be trusted for anything the hand calculation cannot show.

## What the range says

This is an illustration. Across 20,000 runs with independent prospects, steady-state volume came out as follows.

```figure
type: stats
title: Simulated steady-state volume, independent prospects
caption: This is an illustration. 20,000 runs, seed 20240227. Only 0.1% of runs reached the sponsor's 25.32m cans.
- 11.57m | P10 | 1 run in 10 falls below this
- 12.82m | P20 | 1 run in 5 falls below this
- * 15.33m | P50 | the median outcome
- 17.86m | P80 | 1 run in 5 exceeds this
- 19.20m | P90 | 1 run in 10 exceeds this
- 0.1% | runs at or above 25.32m | the inside-view forecast
```

The plan's 25.32m cans sits far outside the range: one run in a thousand reached it. Even the customer count tells the story. The simulated number of customers had a P10 of 30 and a P90 of 40, so in nine runs out of ten the plant signed at least 10 fewer customers than the 50 in the business case.

Contribution follows the volume but not exactly, because each run has its own mix of segments. The P10 contribution was A$1,499.8k a year, the P50 A$1,907.3k and the P90 A$2,321.6k, against the inside view's A$3,201.6k. Fixed costs of A$1.30m a year were covered in 97.5% of runs, so the record did not suggest the plant would lose money before depreciation. It suggested something quieter and more important for the decision: an EBITDA nearer A$0.6m than A$1.9m a year, on a capital cost of A$5.4m.

### Where the spread comes from

Recording each segment's volume in every run shows which driver makes the range wide. Segment B alone accounted for 82.4% of the variance of total volume, with its own P10 of 4.368m and P90 of 11.328m cans. Segment C accounted for 11.5%, segment D for 5.0% and the 40 craft prospects for only 0.8%.

That is a practical finding, not a statistical curiosity. The width of the forecast range was almost entirely a question of how many RTD brands would sign and how much each would fill. Before approval, an extra week spent firming up the nine RTD prospects was worth more than any amount of work on the craft list. The same decomposition tells the benefits tracking in Chapter 8 where to look first.

## Correlation: when prospects move together

Independent draws assume that one prospect signing tells you nothing about another. Real markets do not behave like that. A hot summer, an excise change, a new competitor or a fashion for a drink category affects many customers at once. When outcomes move together, good and bad years cluster, and the range widens.

The reviewer modelled this with a **common market factor**. In each run, one of the business's six annual budget ratios was drawn at random and divided by their mean, giving factors of 0.828, 0.958, 1.279, 0.992, 0.906 and 1.037, and every customer's volume in that run was multiplied by it. The factor averages 1, so it does not move the centre; it only makes all prospects share a good or bad year. The 1.279 factor is 2020's unplanned surge in packaged orders, which is exactly the kind of market-wide shock the factor is meant to carry, and it appears in one run in six.

```figure
type: range
title: Steady-state volume ranges against the plan
caption: This is an illustration. P10 to P90 for 20,000 runs each. A shared market factor widens the range from 7.63m to 9.32m cans without moving the centre much; both ranges sit well below the plan.
min: 0
max: 30
unit: m cans
ticks: 0 | 10 | 20 | 30
- Independent prospects, P10 to P90 | 11.57 | 19.20 | P50 15.33m
- Common market factor, P10 to P90 | 10.98 | 20.30 | P50 15.01m
- Break-even volume at the inside mix | 10.281 | 10.281 | 4.0% of independent runs fall below it
- * Inside-view forecast | 25.32 | 25.32 | reached by 0.1% of independent runs
```

With the common factor the percentiles were P10 10.98m, P20 12.28m, P50 15.01m, P80 18.24m and P90 20.30m cans, and the chance of reaching the inside view rose from 0.1% to 1.2%. The mean stayed at 15.37m. Positive correlation widens a forecast range without changing its expected value, which is why a forecast built from independent parts tends to look more certain than it is. [Forecasting by component: simulation and correlation](/reados/publications/reference-class-forecasting-by-the-numbers/forecasting-by-component/) in *Reference Class Forecasting by the Numbers* shows the same effect on a cost estimate split into parts.

Which version to present depends on the decision. For the question "how likely is the plan", both say the same thing: very unlikely. For questions about the downside, such as whether the plant could fall below break-even, the correlated version is the more honest, because a bad year for the market is a bad year for most customers at once.

## Reading a prediction interval

The P10 to P90 range is an **80% prediction interval**: if the method is sound and the record is relevant, about eight outcomes in ten should fall inside it, one below and one above. A board paper can state it in a single sentence that carries the whole forecast: "On the business's record, steady-state volume is expected to be between 11.6m and 19.2m cans a year, most likely about 15.3m; the business case's 25.32m has about a one in a thousand chance."

An interval is only as wide as the uncertainty the model contains. This one includes conversion, the size of each customer's orders and, in the second version, a shared market swing. It leaves out prospects not yet named, a customer category that did not exist in the record, price changes, and any customer whose volume moved further from its letter than the record's extremes of 0.42 and 1.24. The model cannot produce a customer at eight times its planned volume, because no such customer is in the record. Chapter 9 shows what happened when one appeared, and Chapter 10 checks where the plant's actual run-rate fell within this range.

Two habits make an interval useful later. Record it with the forecast, with its date, method and seed, so that it can be scored against the outcome. And state what it leaves out, so that a surprise outside it can be traced to a known gap rather than treated as proof that forecasting is futile.

## The top-down cross-check

Chapter 5 summarised the business's six annual volume budgets as ratios of actual to forecast: median 0.857 and P20 0.796. Applying those ratios to the whole inside view is the simplest outside view there is: 25.32m × 0.857 gives about 21.7m cans (21.688m), and 25.32m × 0.796 gives about 20.2m (20.151m).

Both figures are well above the driver-level range. Only 1.9% of independent runs reached 21.688m, and 5.7% reached 20.151m. The two methods disagree by about 6m cans, and the disagreement has a cause that can be named. The annual budgets were forecasts for a running business whose customers already existed: the error they record is mainly how much each customer ordered. The plant depended on customers who had not yet signed, and the record says that letters of intent convert at 70.8% and other prospects at 25.0% before any shortfall in volume. The top-down ratio measures the business's habitual optimism about existing customers; it says nothing about the conversion risk that dominates a new facility.

```figure
type: compare
title: Five estimates of the plant's steady-state volume
cols: Volume, m cans a year | Share of inside view | Basis
caption: This is an illustration. The driver-level expected value is the forecast; the top-down figures are a check that answers a different question; the double haircut counts the same optimism twice.
- Inside view | 25.320 | 100.0% | sponsor's customers, runs and run sizes
- Top-down, median ratio 0.857 | about 21.7 | 85.7% | annual budgets for existing customers
- Top-down, P20 ratio 0.796 | about 20.2 | 79.6% | the same, at a cautious percentile
- * Driver-level expected value | 15.367 | 60.7% | record conversion and realisation, Chapter 3
- Double haircut | 13.163 | 52.0% | driver-level × 0.857
```

Which to use follows from what each measures. Where the drivers have records, as here, the driver-level range is the forecast and the top-down ratio is a check. Where no driver records exist, a top-down ratio from a reasonably similar set of past forecasts is better than nothing. Where the two disagree, the gap should be explained before either is chosen; an unexplained gap means one of the methods is measuring the wrong thing. [Testing each driver against the record](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/testing-the-drivers/) set out the evidence behind the driver-level figure, and [Measuring forecast error and reading base rates](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/forecast-error-and-base-rates/) the evidence behind the ratios.

## The error: a double haircut

This is an illustration. Preparing the board's figures in February 2024, the finance manager took the reviewer's driver-level 15.367m cans and multiplied it by the median annual ratio, 0.857, "to allow for our usual optimism". The result, 13.163m cans, about 13.2m, went into a draft appraisal. At the outside view's contribution of A$0.124 per can and the rig 2 ramp, it gave an NPV of −A$4,400.0k, about A$1.5m worse than the −A$2,852.5k at the simulated P50 that Chapter 7 uses.

The reviewer caught it by asking a simple question of each correction: which optimism does it remove? The driver-level figure had already replaced the sponsor's conversion rate with the record's and the sponsor's volume per customer with the record's realisation of 0.800. The 0.857 ratio measures the same thing, the business's habit of forecasting more volume than customers deliver, observed on a different set of forecasts. Applying both counted that habit twice. The double haircut also sat at the 23.6th percentile of the simulated distribution, so it was not a central estimate of anything: it was a low-side figure presented as a forecast.

A double haircut feels prudent, but it is a bias in the other direction. It can turn down a project that the evidence supports, and it sets a benefits target that the operation will beat for no merit of its own, which spoils the scorekeeping that later chapters depend on. The correction was procedural: the forecast register now records, for every forecast, which corrections were applied and the evidence for each, and a second correction is allowed only if it addresses a source of error the first did not. The driver-level range became the forecast; the top-down ratio stayed in the paper as a labelled cross-check.

## What went to the board

The reviewer's forecast section in the board paper had four lines: P50 15.33m cans a year at steady state; P10 to P90 11.57m to 19.20m with independent prospects, and 10.98m to 20.30m allowing for a shared market swing; a 0.1% chance of reaching the business case's 25.32m; and a top-down cross-check of about 21.7m, with the reason it overstates a new facility's volume. Segment B was flagged as the source of most of the uncertainty. [Scenarios, sensitivity and switching values](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/scenarios-and-switching-values/) takes this range into the appraisal and asks which volume the plant needs to break even.

## Exercise: a lower conversion rate

A board member argues that the 2021 record flatters letters of intent, because rig 2 was new and brewers were keen to try it. Test the effect of an LOI conversion rate of 60% instead of 70.8%, keeping other named prospects at 25.0% and the mean realisation at 0.800. What is the driver-level expected volume, and how does it compare with 15.367m?

**Worked answer.** Expected customers become A 22 × 0.60 + 18 × 0.25 = 17.70, B 4 × 0.60 + 5 × 0.25 = 3.65, C 8 × 0.60 + 12 × 0.25 = 7.80 and D 3 × 0.60 = 1.80. Multiplying by each segment's volume per customer and by 0.800 gives A 1.529m, B 7.008m, C 3.744m and D 1.382m cans, a total of **13.664m cans a year**, which is **88.9%** of 15.367m. Segment B again moves most, by 0.832m of the 1.703m fall, because each RTD letter carries 2.4m cans. The test shows that the forecast is sensitive to the LOI rate mainly through four RTD letters, so the useful response is to test those four letters directly, for example by asking each brand for a printed-can order date, rather than to argue about the rate in general.
