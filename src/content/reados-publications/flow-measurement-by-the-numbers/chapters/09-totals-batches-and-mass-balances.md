---
book: flow-measurement-by-the-numbers
chapterSlug: totals-batches-and-mass-balances
order: 9
title: "Totals, batches and mass balances"
description: "Turning flows into totals, the uncertainty of a sum, building a site water balance, charting its residual to find a leak, night flows, product losses, and two totalisers read at different times."
draft: false
---

Most flow readings end up as totals: litres per batch, cubic metres per day, tonnes per month. Totals feed bills, yields, losses and balances, and a balance, in which what goes in is compared with what comes out, is one of the most powerful uses of meters, because it can find leaks, losses and faulty meters that no single reading would reveal. It works only if every meter in it is understood, every total is read on the same basis and at the same time, and the uncertainty of the balance is known, so that a real discrepancy can be told from the meters' own scatter.

This chapter explains how totals are built and what limits their accuracy, builds the brewery's daily water balance with its uncertainty, charts the balance's residual to find a leak, looks at night flows and product losses, and finishes with a balance that swung wildly on cleaning nights because two of its totals were read six hours apart.

## From flow to total

A totaliser adds up the flow over time. Pulse-output meters, such as vortex and many magnetic meters, emit one pulse per fixed volume and the totaliser counts pulses; analogue meters send a continuous signal that the control system samples and integrates. Either way, a total inherits the meter's bias exactly, because a meter that reads 0.5% high adds 0.5% too much in every interval. Random scatter averages out over a long total, as Chapter 8 explained, so a total's uncertainty is essentially the meter's bias uncertainty.

Totals can also be corrupted in ways that have nothing to do with the meter: pulses lost when a cable is disturbed, a totaliser reset by a power cut, an analogue signal clipped at 20 mA when the flow exceeds the range, or a low-flow cutoff that discards a slow, steady flow entirely. Each shows up as a total that disagrees with something else, and a balance is how the disagreement is found. The control system therefore logs each meter's status alongside its total, so that a day with a lost signal or a reset is flagged before its total is trusted.

## The uncertainty of a sum

When independent totals are added or subtracted, their absolute uncertainties combine by root-sum-square. The uncertainty of a balance's residual, the difference between what went in and what came out, is therefore the root-sum-square of the uncertainties of every total in it, including any estimated, unmetered quantity.

```figure
type: formula
title: Residual of a balance and its uncertainty
formula: Residual: R = Σ inputs − Σ outputs
formula: Standard uncertainty: u_R = √(Σ u_i²)
caption: u_i is the standard uncertainty of each total, in the same units as the total. A residual larger than about twice u_R is unlikely to be the meters' scatter alone and points to an unmeasured flow, a leak or a faulty meter.
- R | residual of the balance
- u_R | standard uncertainty of the residual
```

## The brewery's daily water balance

The brewery takes in about 60 m³ of water a day through FT-101 and uses it in five ways, four metered and one estimated.

```figure
type: compare
title: A typical day's water balance
cols: Total | Standard uncertainty | Basis
rowhead: Item
- In: mains water, FT-101 | 60.0 m³ | 0.18 m³ | 0.3% standard, from ±0.6% at k = 2 in service
- Out: hot liquor to the brewhouse, FT-301 | 18.0 m³ | 0.09 m³ | mass converted at 20 °C; 0.52% standard
- Out: cleaning rinse, new magnetic meter | 6.0 m³ | 0.03 m³ | 0.5% standard
- Out: cooling tower make-up | 10.0 m³ | 0.05 m³ | 0.5% standard
- Out: cellar and packaging | 20.0 m³ | 0.10 m³ | 0.5% standard
- Out: amenities and unmetered uses, estimated | 6.0 m³ | 0.30 m³ | estimate from occupancy, ±5%
- * Residual | about 0 m³ | 0.38 m³ | root-sum-square of all six
caption: This is an illustration. The estimated unmetered use is the largest single uncertainty; metering it would tighten the balance more than improving any meter.
```

The residual's standard uncertainty, 0.38 m³ a day, means that a day's residual within about ±0.8 m³ is unremarkable. The largest single contribution is the unmetered estimate, not any meter, which is a common finding: the cheapest way to tighten a balance is usually to meter what is currently estimated.

## Charting the residual

The brewery charts the daily residual on an individuals control chart. The [individuals control chart check](/tools/individuals-chart-check/) takes up to twelve readings in time order and gives the mean, the moving ranges and the control limits. Ten ordinary days, with residuals of 0.2, −0.3, 0.4, 0.1, −0.2, 0.3, 0.0, 0.5, −0.1 and 0.2 m³, give a mean of 0.11 m³, an estimated standard deviation of 0.39 m³ and control limits from −1.07 to +1.29 m³. The chart's standard deviation agrees closely with the 0.38 m³ the uncertainty budget predicted, which is good evidence that the meters and the estimate are behaving as expected.

```figure
type: line
title: Daily water balance residual, with two days after a leak began
x: Day
y: Residual, m³
ymin: -1.5
ymax: 2.5
caption: This is an illustration. Control limits from the first ten days: −1.07 to +1.29 m³. Days 11 and 12, at 1.9 and 2.1 m³, are above the upper limit.
- 1 | 0.2
- 2 | -0.3
- 3 | 0.4
- 4 | 0.1
- 5 | -0.2
- 6 | 0.3
- 7 | 0.0
- 8 | 0.5
- 9 | -0.1
- 10 | 0.2
- 11 | 1.9
- 12 | 2.1
```

On days 11 and 12 the residual jumped to 1.9 and 2.1 m³, above the upper limit; with those days included, the tool flags both as out of control. About 2 m³ a day was entering the site and not reaching any metered or estimated use.

### The night flow confirms it

A leak runs day and night, so it shows most clearly when everything else is off. FT-101's night flow had settled at about 0.5 m³/h; after day 11 it was about 0.58 m³/h. A rise of 2 m³ a day spread evenly over 24 hours is 0.083 m³/h, which matches. At that flow, Chapter 8 showed FT-101 accurate to about ±4%, or ±0.02 m³/h, so a rise of 0.08 m³/h, 16%, was clearly real. Walking the buried line to the packaging building with a listening stick found a cracked joint under the car park, repaired the next week. At the water authority's charges, a leak of 2 m³ a day left running for a year would have cost the brewery several thousand dollars in water and sewerage, and a slow leak under a car park can also undermine the pavement above it. The balance had found it within two days of its starting.

## Product balances and losses

The same method tracks product. The wort sent to each fermenter by FT-201, 2,620 kg for a standard brew, is compared with the beer packaged from it, measured by the filler's own meters, and the difference is the cellar's loss: yeast, trub, sampling, line flushes and spillage. Because both ends are measured by mass, or by volume at a known temperature and gravity, the loss can be tracked brew by brew, and a brew whose loss is far above the usual points to a problem, from a fermenter that dumped too much yeast to a valve left open during packaging.

## The mistake: totals read six hours apart

When the water balance was first set up, its totals were collected from two places. FT-101's total came from the control system's daily report, which closed at midnight. The cellar and packaging meter, on a separate packaging controller, reset its daily total at 6 am, the start of the first shift. Both were labelled "daily".

```figure
type: steps
title: Aligning the balance's totals in time
caption: This is an illustration. Two "daily" totals six hours out of step put each night's cleaning water in different days on the two sides of the balance.
- Symptom | residual swinging by ±3 m³ on alternate days, worst after night cleaning
- Totals' periods | FT-101 midnight to midnight; packaging meter 6 am to 6 am
- Night cleaning | about 6 m³ of packaging water used between midnight and 6 am on cleaning nights
- * Effect | that water counted in one day's intake and the next day's use
- Fix | all totals read by the control system at the same instant, midnight, from every meter
- Result | residual's scatter fell to about ±0.4 m³ standard, matching the uncertainty budget
```

On nights when the packaging line was cleaned, about 6 m³ of water passed through FT-101 between midnight and 6 am. It was counted in one day's intake but in the next day's packaging use, so the residual showed a large surplus one day and a large deficit the next. The first weeks' chart was all noise, and two "leaks" were chased that did not exist. The fix was to have the control system read every meter's running total at the same instant, midnight, and compute the daily totals itself. Every meter in a balance must be read over exactly the same period, however its own display defines a "day". After that, the residual's scatter fell to the 0.38 m³ the budget predicted, and the chart became useful.

## Low-flow cutoffs and lost totals

Most meters have a low-flow cutoff, a flow below which they report zero to stop their zero offset from slowly adding to the total when nothing is flowing. The cutoff is a setting, and it can hide exactly the flows a balance is looking for. FT-101 was commissioned with a cutoff of 0.2 m³/h, sensible for a meter whose zero is good to about 1 mm/s, or 0.018 m³/h in its bore. Had the cutoff been set at 1 m³/h, as an installer once proposed to "steady the display", the meter would have recorded no flow at night at all, and the day 11 leak would have vanished from the night flow and been understated in the daily total. The brewery's rule is that a cutoff is set no higher than a few times the meter's zero stability, and that every cutoff is recorded in the meter's file.

FT-401, the compressed air vortex meter of Chapter 7, has a cutoff imposed by its physics rather than a setting, and it reads zero on weekends when the air demand is only leaks. Its totals therefore understate the true air use by the leak flow during every quiet period, which matters when the air balance is used to estimate leakage.

## Energy from flow and temperature

A flow multiplied by a temperature difference and a specific heat gives a heat flow, and the brewery uses FT-501's glycol audits that way. At 40 m³/h of glycol at 1,035 kg/m³, 11.5 kg/s, with a specific heat of about 3.8 kJ/(kg·K) and a temperature rise of 3.0 K across the fermenter jackets, the cooling delivered is 11.5 × 3.8 × 3.0 = 131 kW. The uncertainty of that figure combines the flow's, about 3% for the clamp-on meter, with the temperature difference's: two sensors each uncertain by 0.1 K make the 3.0 K difference uncertain by about 0.14 K, or 4.7%. Together, about 5.6%. In heat balances on small temperature differences, the temperature measurement usually matters more than the flow, and matched, calibrated sensor pairs are the cheapest improvement.

## Monthly reconciliation with the bill

Each quarter the water authority's bill gives an independent total for the intake, from its boundary meter. The brewery compares it with FT-101's total for the same dates. Over a quarter of about 5,400 m³, the two should agree within their combined uncertainty, which Chapter 8 estimated at about ±2.1%, or ±113 m³. A difference within that is unremarkable; a difference outside it, or one that grows quarter by quarter, means one of the meters is drifting, and the authority can be asked to test its meter. Because the bill's dates rarely match midnight exactly, the brewery reads FT-101's running total on the day the authority's reader visits, which is noted on the bill, rather than adding up its daily totals.

## Who owns the balance

A balance that nobody owns decays. Meters are replaced without being added, new uses appear without meters, estimates go stale, and the residual drifts until it is ignored. The brewery's utilities engineer owns the water balance: reviews its chart each week, keeps its list of meters and estimates current, investigates any point outside the limits, and records each cause beside the point on the chart. The engineer also re-estimates the amenities use each year from the site's headcount and from a week of temporary metering, which keeps the largest uncertainty in the table honest. The time this takes is about an hour a week, and in its first year the balance found one buried leak, one meter reading 8% low and one recipe in the wrong temperature's litres.

## Batching

A batch is a total with a target. The control system opens a valve, totals the flow, and closes the valve when the total reaches the target less an allowance for the overrun, as Chapter 5 described for the wort line. The batch's accuracy depends on the meter's bias, the overrun's repeatability and the timing of the stop. For hot liquor, where FT-301 delivers 1,846 kg per brew, a 0.5% meter bias is 9 kg, and a valve that closes in 3 seconds at 15 m³/h lets through about 6 kg of overrun, learned and allowed for by the controller from the last few batches.

## Exercise: tightening the balance

The brewery considers metering the amenities and unmetered uses, currently estimated at 6.0 m³ a day with a standard uncertainty of 0.30 m³, with a small magnetic meter accurate to 0.5% standard. Using this chapter's table, calculate the residual's new standard uncertainty and the size of the smallest leak, in cubic metres a day and in litres per hour, that would then exceed twice the uncertainty. Compare it with the leak found on day 11.

### Answer

**Given:** standard uncertainties 0.18, 0.09, 0.03, 0.05 and 0.10 m³ for the metered totals; the new meter's 0.5% of 6.0 m³ = 0.03 m³.

**Assumptions:** independent uncertainties; the amenities meter installed well and sized for its flows.

**Method:** u_R = √(Σ u_i²); smallest clear leak ≈ 2 u_R.

**New uncertainty:** √(0.18² + 0.09² + 0.03² + 0.05² + 0.10² + 0.03²) = √(0.0324 + 0.0081 + 0.0009 + 0.0025 + 0.0100 + 0.0009) = √0.0548 = 0.234 m³.

**Smallest clear leak:** 2 × 0.234 = 0.47 m³ a day, about 20 L/h, against 2 × 0.38 = 0.76 m³ a day, about 32 L/h, before.

**Comparison:** the day 11 leak, 2 m³ a day or 83 L/h, was four times the new threshold and would have been flagged at once either way; the new meter would let the balance find leaks about 40% smaller. FT-101's own 0.18 m³ now becomes the largest term, so further tightening would need a better intake meter.

**Verification:** the old uncertainty, with 0.30 m³ in place of 0.03, is √(0.0548 − 0.0009 + 0.09) = 0.379 m³, matching the table.
