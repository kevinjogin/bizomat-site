---
book: demand-and-benefit-forecasts-by-the-numbers
chapterSlug: forecast-error-and-base-rates
order: 5
title: "Measuring forecast error and reading base rates"
description: "Bias, MAE, MAPE and RMSE on the 2023 budget (all 12 months over, MAPE 9.7%), naive benchmarks that beat it, six annual ratios as a base rate, and a −8.9% error reported as −1.0%."
draft: false
---

A business that wants to know how far to trust its next forecast has to know how far its past forecasts missed. That sounds simple, and it is easy to get wrong. The same miss can be reported as small or large depending on the measure, the denominator, the benchmark and, above all, which forecast is compared with the outcome. A business that measures its forecasts loosely will conclude that they are better than they are, and will carry that confidence into its next business case.

This chapter sets out the measures of forecast error that matter for a business case, works them on the mobile canning business's 2023 budget month by month, and compares the budget with forecasts that took no effort at all. It then reads the business's six annual budget ratios as a base rate, sets them beside the published base rates for demand forecasts, and explains which forecast an outcome should be scored against. It ends with a year's forecast error that was reported as −1.0% when the forecast the board had approved missed by −8.9%.

## Error, ratio and sign

Three conventions are used throughout this book:

- **error = actual − forecast**, so a negative error means the forecast was too high;
- **ratio = actual ÷ forecast**, so a ratio below 1 means the forecast was too high;
- **percentage error = error ÷ actual**, following Hyndman and Athanasopoulos's *Forecasting: Principles and Practice* (3rd edition, 2021).

For a single annual total, it is clearer to quote the ratio and the shortfall against the forecast, which is the ratio less 1. The mobile business's 2023 volume of 4.19m cans against a budget of 4.60m is a ratio of **0.911**, **8.9% below budget**. The percentage measures in the rest of this chapter are averages over months, and they use the actual as the denominator.

## The 2023 budget month by month

This is an illustration. The mobile business budgeted 4,600k cans for 2023 and phased the budget across the months using its seasonal shares, from 10.5% of the year in January and 11.5% in December down to 6.0% in June and July. It actually filled 4,190k cans. For comparison, 2022 had filled 3,820k, so the budget had assumed growth of 20.4% on the previous year; actual growth was 9.7%.

```figure
type: compare
title: Mobile business, 2023 monthly budget against actual (thousand cans)
rowhead: Month
cols: 2022 actual | 2023 budget | 2023 actual | Budget error | Seasonal naive error
caption: This is an illustration. Error = actual − forecast. The budget was too high in all 12 months; the seasonal naive forecast (the same month of 2022) was too low in all 12.
- Jan | 398 | 483 | 452 | −31 | +54
- Feb | 372 | 437 | 401 | −36 | +29
- Mar | 349 | 414 | 384 | −30 | +35
- Apr | 301 | 368 | 330 | −38 | +29
- May | 262 | 322 | 291 | −31 | +29
- Jun | 236 | 276 | 252 | −24 | +16
- Jul | 225 | 276 | 262 | −14 | +37
- Aug | 247 | 299 | 268 | −31 | +21
- Sep | 283 | 345 | 319 | −26 | +36
- Oct | 330 | 391 | 349 | −42 | +19
- Nov | 384 | 460 | 414 | −46 | +30
- * Dec | 433 | 529 | 468 | −61 | +35
- Total | 3,820 | 4,600 | 4,190 | −410 | +370
```

## Four measures and what each hides

Each common measure summarises the twelve errors in a different way.

- **Mean error (ME)**, the average signed error, is **−34.2k cans** a month. It measures **bias**: the tendency to miss in one direction.
- **Mean absolute error (MAE)**, the average size of the errors ignoring sign, is also **34.2k**. When the mean error and the mean absolute error are equal in size, every error has the same sign. All twelve months were over-forecast.
- **Mean absolute percentage error (MAPE)**, the average of each month's error as a percentage of that month's actual, is **9.7%**. The **mean percentage error (MPE)**, the same with signs kept, is **−9.7%**, again identical in size because every month missed the same way.
- **Root mean squared error (RMSE)**, the square root of the average squared error, is **36.0k**. Squaring gives large errors more weight, so RMSE is always at least as large as MAE; the gap shows how much the worst months dominate. Here the gap is small, but December's miss of 61k, the largest, came in the month with the most volume.

Each measure hides something. MAE and RMSE are in cans, so they cannot be compared between a small business and a large one or between a quiet month and a busy one. MAPE fixes that by scaling, but Hyndman and Koehler (2006) set out its weaknesses: it is undefined when the actual is zero and explodes when the actual is small, it depends on the choice of denominator, and it treats errors above and below the actual differently. Computed with the forecast as the denominator instead of the actual, the 2023 budget's MAPE is **8.8%**, not 9.7%. Neither is wrong; they answer different questions, and a report must say which it uses.

The small-denominator problem matters for a new plant. The canning plant's first-year forecast was 17.724m cans; it filled 7.133m. The error of −10.591m is **−148.5%** of the actual, and −59.8% of the forecast. A ratio of **0.402** says the same thing more plainly. For volumes that start near zero, ratios are the safer summary, and percentage errors relative to actual should be kept for established series like the mobile business's months.

## Naive benchmarks

A measure of error on its own does not say whether a forecast was good. A MAPE of 9.7% could be excellent for a volatile business or poor for a steady one. The standard remedy, recommended by Hyndman and Athanasopoulos, is to compare a forecast with a **naive benchmark**: a forecast that takes no judgement at all.

For a seasonal business, the obvious benchmark is the **seasonal naive** forecast: each month will be the same as the same month last year. For 2023 that forecast was simply 2022's actuals, totalling 3,820k. It under-forecast every month, with an MAE of **30.8k** and a MAPE of **8.9%**. The budget's MAE of 34.2k was larger. The **relative MAE**, the budget's MAE divided by the benchmark's, is the total absolute error 410k ÷ 370k = **1.108**: the budget, built with a sales plan and the managing director's knowledge of customers, was about 11% worse than copying last year.

A slightly better benchmark adds a growth allowance that anyone could have set without a sales plan. Last year's months plus 5% total 4,011k, with an MAE of **14.9k** and a MAPE of **4.4%**. Its absolute errors total 179k, so against this benchmark the budget's relative MAE is 410 ÷ 179 = **2.291**: its errors were more than twice as large. Hyndman and Koehler (2006) formalise the idea by scaling every error by a naive forecast's error, so that a scaled error above 1 always means "worse than naive".

```figure
type: stats
title: Error measures for the 2023 budget and two naive benchmarks
caption: This is an illustration. Thousand cans a month; percentages relative to actual. A relative MAE above 1 means the budget did worse than the benchmark.
- * −9.7% | Budget bias (MPE) | ME −34.2k; over-forecast in 12 of 12 months
- 9.7% | Budget MAPE | MAE 34.2k; RMSE 36.0k
- 8.9% | Seasonal naive MAPE | MAE 30.8k; under-forecast in 12 of 12 months
- 1.108 | Budget ÷ seasonal naive MAE | the budget was worse than last year's months
- 4.4% | Seasonal naive + 5% MAPE | MAE 14.9k
- 2.291 | Budget ÷ seasonal naive + 5% MAE | more than twice the error of a growth allowance
```

The lesson is not that judgement is useless. The naive forecasts knew nothing the budget did not; they simply did not add optimism. The business's judgement added information about customers and also added a bias of about −10%, and the bias outweighed the information. The general practice of tracking bias and naive comparisons for running products is covered in [Demand forecasting for small manufacturers](/reados/collections/manufacturing-operations-and-design-for-manufacture/demand-forecasting-for-small-manufacturers/).

## Six annual ratios as a base rate

A base rate for a business case needs one number per forecast: the ratio of actual to forecast for each year. The mobile business has six. Sorted, they are 0.728, 0.796, 0.842, 0.871, 0.911 and 1.124.

- The **mean** is 0.879 and the **aggregate ratio**, total actual over total forecast, is 17.81 ÷ 20.30 = 0.877.
- The **median**, by linear interpolation (PERCENTILE.INC), sits halfway between the third and fourth values: (0.842 + 0.871) ÷ 2 = **0.857**.
- The **20th percentile** sits (6 − 1) × 0.2 = 1.0 places along the sorted list, exactly on the second value: **0.796**.
- The **80th percentile** sits 4.0 places along, on the fifth value: **0.911**.

Read as a base rate, these say that a volume budget from this business has typically delivered about 0.857 of its forecast, and that one year in five came in at 0.796 or below. Five of the six years were below budget. Six years is a small sample, and each percentile rests on one or two values, so these figures are a guide to direction and rough size, not a precise distribution. They also come from budgets for customers the business already had, which matters when Chapter 6 asks whether they suit a plant built for new customers. [From base rates to an honest forecast range](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/an-honest-forecast-range/) compares the two.

## Published base rates

[The Hiding Hand and the evidence on optimistic forecasts](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/hiding-hand-and-the-evidence/) introduced the largest published study of demand-forecast error. It concerns large transport projects, and it is worth restating with its attribution because it shows the business's record is not unusual in direction.

```figure
type: stats
title: Published base rates for demand forecasts
caption: Flyvbjerg, Skamris Holm and Buhl (2005), Journal of the American Planning Association 71(2), abstract: large transport projects, not small private investments. The reading aid for 106% is arithmetic for one project, not the study's average ratio.
- 210 | Transport projects | in 14 nations, worth US$59 billion
- * 9 of 10 | Rail projects with passenger forecasts overestimated | average overestimation 106%
- 0.485 | Reading aid: actual ÷ forecast for a 106% overestimate | the forecast was 2.06 times the actual
- Half | Road projects with traffic more than ±20% from forecast | actual outside 0.8–1.2 of forecast
- 30 years | Period studied | forecasts did not become more accurate
```

Two methodological points from Flyvbjerg's companion paper (2005) in *Transportation Research Part A* shape how these figures should be read. First, accuracy should be measured against the forecast made **at the decision to build** and demand in the **first year of operation**. Second, samples of known forecast errors are likely to **understate** the inaccuracy in the wider population of projects. A reader can see one reason without any statistics: forecasts are easiest to find and check where someone kept the records and chose to publish them. The business's own six years, kept because the finance manager kept them, are not exempt from that caution.

## Which forecast to score against

A forecast changes during a year. Budgets are reforecast, and by the end of the year a reforecast contains nine or ten months of actuals and only two or three of forecast. Scored against the last reforecast, almost any year looks accurate. Scored against the forecast on which a decision was made, the same year may look poor. Only the second comparison says anything about how far the next decision should trust the next forecast. The practical safeguard is in the record itself: for every forecast kept, note the date it was made, the decision it supported and who approved it, so that nobody later has to reconstruct which version was the one that counted. A record without those three fields will drift, year by year, towards the most flattering version.

## The error: scoring against the reforecast

This is an illustration. In its annual report to the board, the finance manager reported that the 2023 volume forecast had been accurate to within **−1.0%**: 4,190k cans actual against a forecast of 4,233k. The forecast was the September reforecast, which held actual volumes for January to September and a forecast only for October to December. Even its three forecast months had missed: 1,231k against 1,274k, −3.4%.

The reviewer asked which forecast the board had approved when it set the year's crew numbers and bought the rig's consumables. It was the budget of 4,600k, and against that the year's actual was **8.9% below budget**, a ratio of 0.911. The −1.0% was arithmetically correct and told the board nothing about the reliability of the business's forecasts, because nine twelfths of the forecast it scored were actuals.

The correction became a standing rule: **score every forecast against the forecast the decision used**. Reforecasts are kept and reported, because they are useful for running the year, but the record of forecast error, the one that feeds the base rate in the previous section, uses the decision-time figure. [Measuring overrun: baselines, real dollars and scope](/reados/publications/reference-class-forecasting-by-the-numbers/measuring-overrun/) in *Reference Class Forecasting by the Numbers* applies the same rule to cost: overrun is measured from the budget approved at the decision to proceed, not from a later top-up.

For the canning plant, the rule fixes the baseline now. The plant will be scored against the February 2024 business case: 17.724m cans in 2025, 24.054m in 2026 and 25.32m a year from 2027, with a contribution of A$3,201.6k a year, excluding GST. By that standard, 2025's 7.133m cans is a ratio of 0.402, and the deseasonalised run-rate of 16.95m cans a year reached at month 21 is 0.669 of the steady-state forecast. Chapter 10 completes that comparison in the post-completion review.

## Exercise: the last quarter of 2023

Take October to December 2023 alone. Using the monthly table, calculate the budget's errors, MAE, MAPE and MPE, then the same for the seasonal naive forecast with 5% growth (347k, 403k and 455k), and the relative MAE of the budget against that benchmark. What does the result say about where the budget did worst?

**Worked answer.** The budget's errors are 349 − 391 = **−42k**, 414 − 460 = **−46k** and 468 − 529 = **−61k**. The MAE is (42 + 46 + 61) ÷ 3 = **49.7k**. The percentage errors relative to actual are 12.0%, 11.1% and 13.0%, so the MAPE is **12.1%** and the MPE **−12.1%**. The benchmark's errors are 349 − 347 = **2k**, 414 − 403 = **11k** and 468 − 455 = **13k**, an MAE of **8.7k** and a MAPE of **2.0%**. The relative MAE is 149 ÷ 26 = **5.731**, the ratio of the two quarters' total absolute errors: in the last quarter the budget's errors were nearly six times those of a simple growth allowance. The budget did worst exactly in the peak months, when crew rosters, consumables and the year's targets were set, which is where a biased forecast costs the most.
