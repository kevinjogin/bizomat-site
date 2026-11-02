---
book: modular-projects-by-the-numbers
chapterSlug: learning-curves
order: 5
title: "Learning curves: unit and cumulative-average models"
description: "Compare the unit and cumulative-average learning curves for twelve cells (13,191 h against 10,722 h), fit an 84.0% curve from six builds and forecast 870 h for cell 12."
draft: false
---

The second cell of a design takes less time to build than the first, and the twelfth less than the second. Anyone who has built the same thing repeatedly knows that, and it is one of the main reasons a modular programme is cheaper than a bespoke one. To plan with it, the effect has to be a number: how fast the hours fall, what the next cell will take, and what the whole programme's assembly will cost.

This chapter sets out the learning curve in its two common forms, the cumulative-average model that T. P. Wright published in 1936 and the unit model widely used since, and shows that for the running case they differ by about 2,500 hours over twelve cells. It then fits a curve to the hours actually recorded for the first six cells, step by step, forecasts the remaining six, and ends with a fit that was spoiled by hours that did not belong to the curve.

## The idea and its two forms

Wright studied the labour needed to build aircraft and found that it fell in a regular way: each time the cumulative number built doubled, the **average** labour per aircraft over all those built so far fell to a roughly constant fraction of what it had been. That fraction is the **learning rate**. On an 85% curve, doubling the cumulative output brings the measure to 85% of its previous value.

The relationship is a power law. If T₁ is the first unit's hours and n the unit number, the measure at unit n is T₁ × n^b, where the exponent b = log₂ of the learning rate. For 85%, b = log₂ 0.85 = **−0.2345**. Doubling n multiplies n^b by 2^b = 0.85, which is the learning rate by definition.

The two forms of the curve apply that law to different things.

- In the **cumulative-average model**, Wright's form, T₁ × n^b is the average hours per unit over the first n units. The total for n units is n × T₁ × n^b, and the hours for unit n alone are the difference between successive totals.
- In the **unit model**, T₁ × n^b is the hours for unit n itself. The total for n units is the sum of the unit hours.

```figure
type: formula
title: Two forms of the 85% learning curve
formula: unit model: hours for unit n = T₁ × n^b
formula: cumulative-average model: average hours over units 1 to n = T₁ × n^b
caption: This is an illustration. The same formula, applied to unit hours or to the running average, gives two different curves with the same first unit.
- T₁ | first unit's hours, 1,600 hours in the case
- b | log₂ of the learning rate, log₂ 0.85 = −0.2345
- n | unit number, 1 to 12
step: Unit model, unit 2: 1,600 × 2^−0.2345 = 1,360 hours
step: Cumulative-average model, units 1–2: average 1,360 hours, total 2,720, so unit 2 takes 1,120 hours
```

Neither form is right in general. They are two empirical descriptions of the same phenomenon, and a business should choose one, state it and fit it to its own data. What matters is not to mix them.

## The case's planning curve

This is an illustration. In the running case, the integrator's assembly of each standard cell is planned on an **85% unit curve** with a first unit of **1,600 hours**, at A$120 an hour, excluding GST. The planning curve is a forecast made before any cell was built, from the integrator's records of similar machines.

```figure
type: line
title: Hours for each cell on an 85% curve, two models
x: Cell number
y: Assembly hours for that cell
legend: Unit model | Cumulative-average model, implied unit hours
ymin: 0
ymax: 1700
caption: This is an illustration with a first unit of 1,600 hours. From the same starting point, the cumulative-average model implies much faster learning in each unit: 691 hours for cell 12 against 893.
- 1 | 1600 | 1600
- 2 | 1360 | 1120
- 3 | 1237 | 990
- 4 | 1156 | 914
- 5 | 1097 | 861
- 6 | 1051 | 822
- 7 | 1014 | 790
- 8 | 983 | 764
- 9 | 956 | 742
- 10 | 933 | 723
- 11 | 912 | 706
- 12 | 893 | 691
```

On the unit model, the hours for the twelve cells sum to **13,191 hours**, an average of 1,099 hours a cell and A$1,582.9k of assembly labour. On the cumulative-average model, with the same first unit and learning rate, the total for twelve is 12 × 1,600 × 12^−0.2345 = **10,722 hours**. The difference is 2,469 hours, or 2,469 × A$120 = **A$296,280**, excluding GST, about 23% of the smaller figure.

## Why the choice of model matters

A difference of that size is not a rounding matter; it is more than half the A$470,000 hardware price of a cell. It arises because the cumulative-average model's first unit is an average of one, and every later average includes it. For the average to fall to 85% at unit 2, unit 2 itself must take only 1,120 hours, 70% of the first. The unit model's unit 2 takes 1,360 hours.

The practical danger is a quote on one model read as the other. Suppose an integrator quotes "an 85% curve from 1,600 hours" meaning Wright's cumulative average, and the buyer's budget uses the unit model. The integrator expects cell 7 to take about 790 hours; the buyer's budget allows 1,014. If the crew takes 1,000 hours, the integrator sees an overrun of about 210 hours and the buyer sees a cell that came in under budget. Neither is wrong on their own model, and both will argue from it. The remedy is to write the model into the contract or the plan: the form, the first unit, the rate and what counts as an assembly hour.

The KEVOS® [Learning Curve Unit Time and Cost calculator](/tools/learning-curve/) uses the unit form, Tₙ = T₁ n^b, and reports unit, cumulative and average hours, so its results match the case's planning curve. *Welder Training by the Numbers* applies the same law to a trainee's falling time per coupon in [The learning curve](/reados/publications/welder-training-by-the-numbers/the-learning-curve/).

## What the learning is worth

In the case, assembly is the only part of a modular cell's cost that changes from cell to cell: the hardware, site work, lost contribution and expected disruption are the same for every cell. The fall in cell cost from A$720,600 for the first to A$635,819 for the twelfth, A$84,781, is therefore exactly the fall in assembly labour from 1,600 hours (A$192,000) to about 893 hours (A$107,219). Without any learning, twelve cells at 1,600 hours would take 19,200 hours; the unit curve's 13,191 hours saves about 6,009 hours, roughly **A$721,000**, excluding GST, across the programme. That saving is one of the reasons the modular programme costs less than the bespoke one, and it exists only because the same crew builds the same design repeatedly.

The bespoke option in the case gets no learning credit at all: every bespoke cell is costed at the same A$860,000. That is a simplification, but a defensible one. A crew assembling a different design on each line, in place, around a working factory, does learn something from one cell to the next, but much of what it learns is about a design it will not build again. The learning curve rewards repetition of the same work content, and the bespoke option has little of it. A comparison that gave bespoke cells the same 85% curve as the modular ones would flatter bespoke delivery, and Chapter 9 keeps the two treatments separate for that reason.

## Where the learning comes from

A learning rate is a summary of many separate improvements: the crew remembers the build sequence, jigs and fixtures are made for repeated tasks, parts arrive in kits, design queries stop, and small changes in the order of work remove waiting. Not every part of a build learns at the same rate. Mechanical and electrical assembly usually learn quickly; loading tested software and running the factory test learn little, because their content is fixed. It is therefore worth booking hours by stage, such as frame, mechanical, electrical, software and test, and looking at each stage's curve. A stage whose hours are not falling is either fixed work, which is fine, or a place where the crew is meeting the same problem every time, which is a fault in the standard or the build book.

## Fitting the curve from six cells

A planning curve is a guess until there are data. After six cells, the case has them. This is an illustration. The integrator's booked assembly hours for cells 1 to 6, with format change-part fitting booked separately as Chapter 2 required, were **1,640, 1,330, 1,270, 1,120, 1,105 and 1,030 hours**.

Because the curve is a power law, taking logarithms of both sides turns it into a straight line: ln(hours) = ln T₁ + b × ln n. Fitting a straight line through the points (ln n, ln hours) by least squares gives b as the slope and ln T₁ as the intercept. The steps are short enough to do in a spreadsheet, and worth doing once by hand.

```figure
type: compare
title: Fitting the learning curve to cells 1 to 6 on log-log axes
cols: ln n | Hours | ln hours
caption: This is an illustration. The fit is ordinary least squares on the logarithms; natural logarithms are used throughout.
- Cell 1 | 0.0000 | 1,640 | 7.4025
- Cell 2 | 0.6931 | 1,330 | 7.1929
- Cell 3 | 1.0986 | 1,270 | 7.1468
- Cell 4 | 1.3863 | 1,120 | 7.0211
- Cell 5 | 1.6094 | 1,105 | 7.0076
- Cell 6 | 1.7918 | 1,030 | 6.9373
- * Means | 1.0965 | – | 7.1180
```

The steps are:

1. Take the mean of the ln n column, **1.0965**, and of the ln hours column, **7.1180**.
2. Work out Sxx, the sum of the squared deviations of ln n from its mean: **2.1955**.
3. Work out Sxy, the sum of the products of the deviations of ln n and ln hours from their means: **−0.5524**.
4. The slope is b = Sxy ÷ Sxx = −0.5524 ÷ 2.1955 = **−0.2516**.
5. The intercept is ln T₁ = 7.1180 − (−0.2516 × 1.0965) = **7.3939**, so the fitted first unit is e^7.3939 ≈ **1,626 hours**.
6. The learning rate is 2^b = 2^−0.2516 = **84.0%**.

The coefficient of determination, R², is **0.982**: the straight line explains about 98% of the variation in the logarithms of the hours. The residuals, the differences between the booked hours and the fitted curve, are between −36 and +37 hours for every cell, with no pattern. Spreadsheet users can check the result with the slope and intercept functions applied to the two logarithm columns.

```figure
type: stats
title: The curve fitted to cells 1 to 6
caption: This is an illustration. The fitted curve is slightly steeper than the planning curve and starts slightly higher; for the remaining cells it forecasts 124 hours less than the plan.
- * 84.0% | learning rate | slope b = −0.2516
- 1,626 hours | fitted first unit | against 1,600 planned
- 0.982 | R² on log-log axes | residuals within ±37 hours
- 870 hours | forecast for cell 12 | 893 on the planning curve
- 5,566 hours | forecast for cells 7 to 12 | 5,690 on the planning curve
```

## Reading and using the fit

The fitted curve forecasts cell 12 at 1,626 × 12^−0.2516 ≈ **870 hours**, and cells 7 to 12 at a total of about **5,566 hours**. The planning curve gave 5,690 hours for the same cells, so the fit suggests about 124 hours less, about A$14,900 at A$120 an hour. The six cells already built took 7,495 hours against a plan of 7,501, so the plan was very close for the first half and the fit's refinement for the second is modest.

Three cautions apply to any fit from a few points. First, six points are few; one unusual cell moves the slope noticeably, as the error below shows. Fitting only cells 1 to 3 gives a rate of 84.7% and a cell 12 forecast of 892 hours, close here but resting on very little. Second, the curve describes learning by a stable crew building a stable design. A crew change, a long gap between builds or a design change breaks it, which is the subject of Chapter 6, [Experience, proven technology and keeping the team](/reados/publications/modular-projects-by-the-numbers/experience-and-the-team/). Third, extrapolating far beyond the data assumes learning continues at the same rate, which real processes seldom do for long: there is usually a floor set by the work content that no amount of practice removes.

Used with those cautions, the fitted curve does three jobs. It refines the programme's forecast of assembly cost. It gives a target for each cell's hours against which the integrator's weekly bookings can be compared, so that a cell drifting above its curve is noticed while it is being built. And, at the end of the programme, it becomes the business's evidence for the next one: the first unit and learning rate actually achieved, not those hoped for.

## The error: hours that belonged to the kit

This is an illustration. When the curve was first fitted, the analyst used the integrator's raw time sheets rather than the cleaned assembly bookings. Cell 4 was the first format-B cell, and its raw time sheet included **180 hours** of fitting and setting the format-B change-part kit, which the contract booked to the kit, not to the cell. The analyst's data for cell 4 was therefore 1,300 hours instead of 1,120.

The fit with cell 4 at 1,300 hours gives a learning rate of **85.1%**, a cell 12 forecast of **917 hours** and a forecast for cells 7 to 12 of **5,835 hours**: 269 hours, about A$32,280, more than the correct fit. The error would have made the programme look as if it were learning more slowly than planned, when it was in fact learning slightly faster.

It was found by looking at the fit, not just its result. R² fell from 0.982 to **0.900**, and cell 4's residual was **+117 hours**, about twice as large as any other cell's, in a fit where the rest were scattered without pattern. One point far from a line that fits the others is a reason to check that point's data before believing the line. The time sheet showed the kit hours as a separate job code, the cleaned bookings were used, and the fit was repeated.

```figure
type: checklist
title: Before fitting a learning curve
caption: This is an illustration. The open question is this chapter's error: 180 hours of format-B kit fitting in cell 4's data moved the forecast by 269 hours.
- Model stated: unit or cumulative average | the case uses the unit model throughout
- Hours defined: what counts as an assembly hour | kit fitting, rework and waiting booked separately
- Each cell's data checked against its job codes | raw time sheets reconciled to bookings
- Residuals inspected, not just R² | cell 4 at +117 hours stood out
- x Mixing variant work into the standard's curve | 1,300 hours booked for a 1,120-hour cell
- ? Whether any cell was built by a different crew or after a long gap | Chapter 6 deals with both
```

## Exercise: a two-point estimate

Early in the programme, before cell 5 was built, a manager estimated the learning rate from cells 2 and 4 alone, 1,330 and 1,120 hours. What learning rate and first-unit hours does that imply on the unit model, what does it forecast for cell 12, and how does it compare with the six-cell fit?

**Worked answer.** Cell 4 is one doubling after cell 2, so the learning rate is 1,120 ÷ 1,330 = **84.2%**, and b = log₂ 0.842 = −0.2479. The implied first unit is 1,330 ÷ 2^−0.2479 = 1,330 ÷ 0.842 ≈ **1,579 hours**, and cell 12 is forecast at 1,579 × 12^−0.2479 ≈ **853 hours**, 17 hours below the six-cell fit's 870. The answer is close this time by luck: a two-point estimate rests entirely on two cells, and a different pair can give a noticeably different rate. Cells 1 and 4, also two doublings apart, give √(1,120 ÷ 1,640) ≈ 82.6%. The regression uses all six cells, weighs them together and shows by its residuals whether any one of them is out of line, which a two-point estimate cannot.
