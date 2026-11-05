---
title: "Straight-line relationships and estimating models: slopes, intercepts, calibration and trend lines"
description: "How the equation of a straight line underpins cost estimates, break-even, sensor calibration, interpolation and trend lines, how to fit a line to data and where straight-line thinking fails."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - finance
  - quality
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

A remarkable number of practical estimates rest on the humble straight line. A job's cost is a fixed set-up amount plus a rate per unit. A pressure transmitter's output current rises steadily with pressure. Fabrication hours rise roughly in proportion to the weight of steel. Values between two entries in a table are estimated by assuming a straight line between them. Break-even is where two straight lines cross. Even when the real relationship is curved, a straight line is often a good enough approximation over a limited range.

Using straight lines well requires understanding their two parameters, slope and intercept, and what each means physically or commercially. It also requires knowing how to fit a line to scattered data, how to judge whether the fit is good, and where straight-line assumptions break down. Many estimating errors come not from arithmetic but from extending a line beyond the range of data that supports it, or from forcing a straight line onto a relationship that is clearly curved or stepped.

This article explains the equation of a straight line, its use in cost models, break-even analysis, calibration and interpolation, how to fit a line to data with a spreadsheet, how to read the quality of the fit and the limits of linear models, with worked examples.

## The equation of a line

A straight line can be written as:

y = m × x + c

where:

- **m** is the **slope** or gradient: how much y changes for each unit increase in x;
- **c** is the **intercept**: the value of y when x is zero.

The slope has units of y per unit of x, such as dollars per part, hours per kilogram or kilopascals per milliamp. Writing the units of the slope makes its meaning clear and catches errors.

Given two points (x₁, y₁) and (x₂, y₂), the slope is m = (y₂ − y₁) ÷ (x₂ − x₁), and the intercept follows from c = y₁ − m × x₁.

## Fixed and variable costs

Many cost models are straight lines. The cost of a batch is often:

total cost = fixed cost + variable cost per unit × quantity

The intercept is the fixed cost, such as set-up, programming or tooling, and the slope is the variable cost per unit, such as material and machine time. The model explains why unit costs fall with batch size: the fixed cost is spread over more units, so cost per unit is fixed ÷ quantity + variable cost, which falls towards the variable cost as quantity grows.

## Break-even

Revenue is also a straight line through the origin if the price per unit is constant: revenue = price × quantity. Break-even is the quantity where revenue equals total cost:

price × q = fixed + variable × q

so q = fixed ÷ (price − variable). The denominator, price minus variable cost, is the **contribution** per unit. With fixed costs of $2,500 per month, a price of $45 and a variable cost of $30, break-even is $2,500 ÷ $15 ≈ 167 units a month. The [two breakeven numbers every owner should know](/reados/collections/pricing-margins-and-profitability/two-breakeven-numbers-every-owner-should-know/) article applies the same idea to a whole business.

```figure
type: stats
title: Break-even for a simple product
caption: Price minus variable cost is the contribution each unit makes toward fixed costs.
- $2,500 | Fixed costs a month
- $15 | Contribution per unit | $45 price − $30 variable
- *About 167 | Units a month to break even
```

## Calibration lines

Many sensors produce an output that varies linearly with the quantity measured. A common industrial signal is 4 to 20 milliamps, where 4 mA represents the bottom of the range and 20 mA the top. For a pressure transmitter ranged 0 to 10 bar:

pressure = (current − 4) × 10 ÷ 16

so 12 mA represents 5 bar. The slope is 10 bar ÷ 16 mA = 0.625 bar per mA, and the offset of 4 mA allows a broken wire, reading 0 mA, to be distinguished from a genuine zero reading.

**Two-point calibration** checks or adjusts an instrument at two known values, usually near the bottom and top of its range, which fixes both slope and intercept. Checking at a mid-range point as well reveals whether the instrument is truly linear. The [measurement system analysis for manufacturers](/reados/collections/manufacturing-quality/measurement-system-analysis-for-manufacturers/) article explains how to judge whether measurements are good enough for their purpose.

## Interpolation

Tables of data, such as material properties at different temperatures, steam properties or pricing tiers, often list values at intervals. **Linear interpolation** estimates a value between two table entries by assuming a straight line between them:

y = y₁ + (x − x₁) × (y₂ − y₁) ÷ (x₂ − x₁)

Interpolation is reliable when table entries are close together and the underlying relationship is smooth. It is less reliable across wide intervals or where the relationship curves sharply.

## Extrapolation: proceed with care

**Extrapolation** extends a line beyond the range of the data. It is often necessary, but it is risky because relationships that look straight over a limited range frequently curve, flatten or change behaviour outside it. A machine's output may rise linearly with speed until a limit is reached; a cost per kilogram may hold for typical jobs but not for very small or very large ones. Any extrapolated estimate should be labelled as such and treated with extra caution.

## Fitting a line to data

Real data rarely falls exactly on a line. The usual method of fitting a line is **least squares regression**, which chooses the slope and intercept that minimise the sum of the squared vertical distances between the data points and the line. Spreadsheets do this with functions such as SLOPE, INTERCEPT and LINEST, or by adding a trend line to a chart.

### Judging the fit

- **R²**, the coefficient of determination, shows the proportion of variation in y explained by the line, from 0 to 1. A high value suggests a strong linear relationship, but it does not prove the relationship is causal or that the line is appropriate.
- **Residuals**, the differences between actual values and the fitted line, should look random. A pattern, such as residuals that curve or grow with x, signals that a straight line is the wrong model.
- **Outliers** can pull a line strongly, so unusual points should be investigated rather than accepted or deleted automatically.

### Correlation is not causation

A strong straight-line relationship between two quantities does not mean one causes the other. Both may be driven by a third factor, or the relationship may be coincidence. Estimating models based on correlations work only as long as the underlying conditions remain similar.

## Estimating from cost drivers

Estimators often relate effort or cost to a measurable **driver**: fabrication hours to steel weight, machining time to the number of features, painting cost to surface area, or installation hours to metres of pipe. A straight-line model fitted to past jobs gives a fast, consistent first estimate, which can then be adjusted for known differences. The [estimating project costs from cost drivers](/reados/collections/project-estimates-schedules-and-costs/estimating-project-costs-from-cost-drivers/) article explains how to choose drivers and maintain estimating data.

## More than one driver

Effort and cost often depend on several drivers at once. Fabrication hours may depend on weight and on the number of parts; installation time on metres of pipe and the number of fittings. **Multiple linear regression** extends the straight-line idea to several inputs, fitting a coefficient for each: hours ≈ c + m₁ × weight + m₂ × parts. Spreadsheet functions such as LINEST can fit such models. They need more data than a single-driver model, the drivers should not be strongly related to each other, and each coefficient should make practical sense. A model in which more parts appear to reduce hours, for example, signals that the data or the model needs attention.

## Uncertainty around the line

A fitted line gives a central estimate, not a guarantee. Individual jobs scatter around the line, and the scatter gives a sense of how far a new job might differ. A simple measure is the typical size of the residuals: if past jobs usually fall within a couple of hours of the line, a quote based on the line carries about that uncertainty. Uncertainty is smallest near the middle of the data and grows towards the ends and beyond them. Quoting a range, or adding a contingency that reflects the scatter, is more honest than quoting the central figure alone.

## Showing lines on charts

A chart showing the data points, the fitted line and the range covered by the data communicates a model far better than an equation. Decision-makers can see at a glance whether the line fits, where the data is sparse and how far a proposed estimate sits from past experience. Marking break-even points, calibration points or tier boundaries on such charts makes them useful in meetings and quotes.

## Piecewise and stepped relationships

Some relationships are straight within ranges but change slope or jump between them. Freight costs often step at weight or volume thresholds. Electricity tariffs may change rates at certain times or volumes. Labour costs jump when a job needs an extra shift. Modelling these as a single straight line hides important behaviour; a **piecewise linear** model, with different lines for different ranges, is more realistic.

## When a straight line is the wrong model

Curved relationships are common in engineering and business. Fan power rises with the cube of speed, stopping distance with the square of speed, compound interest grows exponentially and learning effects reduce unit times by a constant percentage each time output doubles. Plotting data on a chart before fitting a line is the simplest guard against forcing a straight line onto a curve. Sometimes plotting against a transformed variable, such as the logarithm of x, produces a straight line that can then be fitted.

## A worked example

This is an illustrative example. The data and figures are hypothetical.

A fabrication business wants a faster way to estimate hours for steel frames. It records five completed jobs:

- 120 kg took 11.5 hours;
- 250 kg took 17.0 hours;
- 400 kg took 24.5 hours;
- 600 kg took 32.5 hours; and
- 900 kg took 47.0 hours.

A least squares fit gives approximately:

hours ≈ 5.9 + 0.045 × kg

with an R² of about 0.999. The intercept of about 5.9 hours represents fixed work per job, such as drawing review, set-out and handling, and the slope means about 2.7 minutes per kilogram. The residuals are small and show no obvious pattern.

For a new 700 kg frame, the model estimates about 37.7 hours, well within the range of the data. When asked to quote a 2,000 kg frame, the estimator notes that this is far outside the data: the model gives about 97 hours, but heavier frames need crane handling, different welding positions and possibly site assembly, so the estimate is built up from first principles instead. The business adds each completed job to its data set and refits the line every quarter.

```figure
type: line
title: Hours against frame weight
x: Frame weight (kg)
y: Hours
ymin: 0
ymax: 50
caption: hours ≈ 5.9 + 0.045 × kg from five jobs (R² about 0.999); a 2,000 kg frame lies far outside the data, so it is estimated from first principles.
legend: Completed jobs | Fitted line
- 120 | 11.5 | 11.3
- 250 | 17 | 17.2
- 400 | 24.5 | 23.9
- 600 | 32.5 | 32.9
- 900 | 47 | 46.4
```

## How this applies to a small Australian business

- **Write slopes with their units** to make their meaning clear.
- **Separate fixed and variable costs** in pricing and quoting.
- **Use two-point calibration with a mid-range check** for instruments.
- **Interpolate within tables**, but label extrapolations clearly.
- **Plot data before fitting lines**, and check residuals.
- **Quote ranges or contingencies** that reflect the scatter around a fitted line.
- **Keep estimating data current** with actual results from completed jobs.

## Common mistakes

- **Extrapolating far beyond the data.**
- **Forcing a straight line** onto a curved or stepped relationship.
- **Treating a high R² as proof** of a good model or a causal link.
- **Ignoring the intercept**, which often represents real fixed effort.
- **Deleting awkward data points** instead of investigating them.
- **Using one cost rate** across very different job types.

## Frequently asked questions

**What does the intercept mean in a cost model?** It represents costs that occur regardless of quantity, such as set-up or administration. A negative intercept usually signals that the model does not apply near zero.

**How many data points are needed to fit a line?** Two points define a line, but more are needed to judge the fit. As a practical minimum, use enough points to see whether the relationship is genuinely straight, spread across the range of interest.

**When is linear interpolation not good enough?** When table entries are far apart, when the relationship curves strongly or when high precision is needed. Closer table entries or a curved fit are then better.

**Should a model ever be forced through zero?** Only when there is a physical reason that y must be zero when x is zero, such as revenue at zero sales. For cost and effort models, forcing the line through zero usually distorts the slope, because real jobs carry fixed effort.

**How often should estimating models be refitted?** Whenever enough new results accumulate to change the picture, and whenever methods, equipment or labour rates change significantly. Quarterly or half-yearly reviews suit many small businesses.

## Questions to ask

- Which of our estimates rely on straight-line models, and over what range were they built?
- Do our quotes separate fixed and variable costs?
- How are our instruments calibrated, and is linearity checked?
- Where do we extrapolate beyond our data without saying so?
- Do we refit our estimating models with recent actual results?

## Bringing it together

The straight line y = m × x + c underlies cost models, break-even, sensor calibration, interpolation and estimating from cost drivers. Its slope and intercept have practical meanings worth stating with units. Least squares fitting, R² and residual plots show how well a line describes data, while plotting first, avoiding wild extrapolation and recognising curves and steps prevent the most common errors. Kept current with real results, simple linear models give fast, consistent and defensible estimates.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
