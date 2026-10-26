---
book: diffusion-by-the-numbers
chapterSlug: controlling-a-diffusion-process
order: 8
title: "Controlling a diffusion process"
description: "Combine temperature, time, carbon potential, model and measurement errors into DS-40's case-depth spread, centre the target in the tolerance, chart coupon results, and requalify when anything changes."
draft: false
---

Every chapter so far has calculated one effect at a time: a few degrees of temperature error, a lean atmosphere, a lagging load, a measurement that reads a little high. A real furnace load experiences all of them at once, and the case depth delivered is the result of their combination. Controlling a diffusion process means knowing how large each contribution is, combining them honestly, setting the target so that the combination stays inside the tolerance, and watching the results for the drift that tells you something has changed.

This chapter turns the sensitivities of the earlier chapters into an error budget for DS-40's case depth, combines them, moves the target to centre the result in the 0.7 to 1.0 mm tolerance, sets up coupon charting and requalification triggers, and ties the records together. The failure case is a change of steel supplier that nobody told the heat treater about.

## The error budget

DS-40's effective case depth is, from Chapter 2, **x = 2z√(Dt)**, where z depends on the surface and core carbon, D on temperature through the Arrhenius law, and t on the cycle. Each input carries an uncertainty, and each translates into a fractional uncertainty in depth.

```figure
type: stats
title: Contributions to the spread of DS-40's effective case depth
caption: This is an illustration. Each figure is a typical plus-or-minus range for one source, expressed as a percentage of a 0.8 mm case, using the sensitivities found in Chapters 2 to 4. Combined by root-sum-square, they give about ±10%, or about ±0.08 mm.
- ±3.1% | Furnace temperature, ±5 °C | depth changes about 0.62% per degree near 925 °C
- ±0.9% | Cycle time, ±10 minutes in 8.9 hours | depth goes with √t
- *±5.8% | Carbon potential, ±0.05% in the diffuse stage | changes z in the error function
- ±2.5% | Diffusion model, calibrated on coupons | about ±5% in effective D
- ±6.9% | Case-depth measurement, about ±0.055 mm | Chapter 2's carbon-gradient estimate
- ±3.2% | Load position, slowest parts lagging | Chapter 3's 45-minute lag
```

The two largest contributors are the measurement of case depth and the carbon potential. Temperature, the variable most people think of first, is third, because a well-controlled furnace holds a few degrees. Time is almost negligible, because depth goes with its square root.

Treating the contributions as independent and combining them as the square root of the sum of their squares gives about **±10%**, or about **±0.08 mm** on a 0.8 mm case. That is not a guarantee: it is a combined estimate of the typical spread, of the kind built for a measurement in *Random Error and Drift by the Numbers*, and it assumes the contributions are independent and that nothing else has gone wrong.

### Where each sensitivity comes from

Each line of the budget comes from one of the earlier chapters, and it is worth seeing how, so that the budget can be rebuilt for a different process.

- **Temperature.** Depth goes with √D, and D changes by Q ÷ (RT²) per degree, about 1.24% per degree near 925 °C (Chapter 3). Depth therefore changes by half that, about **0.62% per degree**, or about 3.1% for 5 °C.
- **Time.** Depth goes with √t, so a fractional change in time changes depth by half as much: 10 minutes in 534 is about 1.9%, giving about **0.9%** in depth.
- **Carbon potential.** The potential sets C_s, which sets z in erfc(z) = (0.40 − C₀) ÷ (C_s − C₀). With C_s at 0.75%, z falls from 0.6841 to about 0.642; at 0.85%, it rises to about 0.721. Depth goes with z, so ±0.05% moves it by about **−6.1% and +5.4%**, about ±5.8% on average.
- **The diffusion model.** A coupon-calibrated D known to about ±5% gives depth to about **±2.5%**.
- **Measurement.** Chapter 2 found the profile's slope at the boundary to be about 0.36% carbon per millimetre, so an uncertainty equivalent to ±0.02% carbon becomes about **±0.055 mm**, or ±6.9% of 0.8 mm.
- **Load position.** A 45-minute lag in an 11.7-hour cycle shortens the effective time by about 6%, and depth by about **3%** (Chapter 3).

The same procedure applies to any diffusion process: write the result as a formula in its inputs, find the fractional change in the result per fractional change in each input, and multiply by each input's realistic uncertainty.

### When contributions are not independent

Root-sum-square combination assumes the contributions are independent. Some are not. A furnace that runs a little cold near its door may also lose carbon potential near the door, through the same air leak that cooled it, so the temperature and potential errors push the same parts the same way. Load position and temperature are related for the same reason. Where contributions share a cause, they should be added directly rather than in quadrature, which widens the spread. DS-40's budget treats the door-zone effects as one combined contribution for that reason when the load fills the front of the furnace, and the coupons placed at the front test whether the combined estimate is right.

The budget is reviewed whenever the coupon chart's observed spread departs from it. A spread consistently smaller than predicted means some estimates are pessimistic and the target could come down; a larger spread means a source is missing or underestimated, and finding it is worth more than any adjustment to the target.

## Centring the target

DS-40's tolerance is **0.7 to 1.0 mm**, and its target has been 0.8 mm. With a spread of about ±0.08 mm, a 0.8 mm target puts the lower end of the spread at about **0.72 mm**, just above the minimum, while the upper end, about **0.88 mm**, is well below the maximum. The tolerance is asymmetric about the target: there is 0.1 mm of room below and 0.2 mm above.

Moving the target to **0.85 mm** centres the spread better: about **0.77 to 0.93 mm**, with margin at both ends. The cost is furnace time. Because time grows with the square of depth, the boost-and-diffuse cycle lengthens by a factor of **(0.85 ÷ 0.8)² ≈ 1.13**, from about 8.9 to about **10.1 hours**.

```figure
type: compare
title: DS-40's target case depth and the spread around it
cols: Expected range, about ±0.08 mm | Margin to 0.7 mm | Margin to 1.0 mm | Cycle time
caption: This is an illustration with the combined spread from the budget. A slightly deeper target trades about an hour of furnace time for margin at the minimum, where a shallow case is the more serious failure.
- 0.80 mm target | about 0.72 to 0.88 mm | about 0.02 mm | about 0.12 mm | about 8.9 hours
- *0.85 mm target | about 0.77 to 0.93 mm | about 0.07 mm | about 0.07 mm | about 10.1 hours
```

The heat treater and the designer agreed on the 0.85 mm target. They also agreed that the more effective long-term improvement was to shrink the two largest contributions: tighter control of the carbon potential, with more frequent shim checks, and a better case-depth measurement, with the traverse procedure and the hardness tester's own uncertainty reviewed.

### A capability view

If the ±10% combined spread is read as about two standard deviations, the standard deviation of DS-40's case depth is about **0.041 mm** at a 0.8 mm target. The usual process capability index for the nearer limit is the distance from the average to that limit divided by three standard deviations. At the 0.8 mm target, the distance to 0.7 mm is 0.1 mm, giving an index of only about **0.80**: too low for comfort, meaning that a noticeable share of loads could fall below the minimum. At the 0.85 mm target, with the spread scaled to the deeper case, the index is about **1.13** to both limits: balanced and better, though still short of the 1.33 that many customers expect. The capability arithmetic tells the same story as the ranges above, in the language a customer's quality department uses, and it shows why reducing the two largest contributors matters: halving the spread would roughly double the index.

## Coupons and charts

Every DS-40 load carries test coupons of the same steel, placed where the slowest parts are, and one coupon per load is sectioned for a hardness traverse. The effective case depths from successive loads are plotted in time order with the target and limits, as Chapter 3's failure case showed was worth doing.

```figure
type: checklist
title: What DS-40's heat treater records for every load
caption: This is an illustration of the batch record. Each item is needed to explain a result that drifts, and to recalculate a load with the diffusion model if a question arises later.
- x Steel grade and heat number of the bar | from the mill certificate
- x Cycle: boost and diffuse times and set points | from the recipe and the controller
- x Logged temperatures: control and load thermocouples | every minute
- x Logged carbon potential and the latest shim check | probe reading and shim analysis
- x Coupon position in the load | sketched on the load sheet
- x Effective case depth and surface hardness from the coupon | traverse record
- x Reheat, quench and temper records | including atmosphere for the reheat
- ? Plating and bake record, for plated parts | time from plating to bake
```

A chart of coupon depths shows three things a single result cannot: the process average, its spread from load to load, which can be compared with the budget's ±0.08 mm, and any trend. If the observed spread is much larger than the budget predicts, a source is missing from the budget; if the average drifts, something has changed.

## When to requalify

A calibrated diffusion model and a good record make it possible to change a cycle with confidence, but only within the conditions they were calibrated for. DS-40's procedure lists the changes that trigger requalification, a trial load with coupons sectioned for both carbon profile and hardness traverse, before production resumes:

- a change of steel grade, steel supplier or melting practice;
- a change of furnace, or major maintenance to the furnace's heating, atmosphere or circulation;
- a change of cycle beyond the range already qualified;
- a change in part geometry that affects section thickness, edges or masking;
- a new hardening, tempering or grinding practice.

Each of those can change the effective D, the boundary condition or the geometry that the model assumes. A requalification is cheap compared with a batch of parts found shallow at the customer's inspection, and the trial load's coupons become the new baseline on the chart.

## What the customer should ask for

A company buying carburised parts, or buying carburising as a service, can apply this chapter without running a furnace. Its drawings should state the effective case depth with its limit hardness and measurement method, say whether the depth applies before or after grinding, and state the surface hardness. Its purchase order should ask for the coupon results for each batch, the batch's thermal and atmosphere records on request, and notification before any change of cycle, furnace or subcontractor. For a new part or a changed process, it should ask for a first-article section that includes an edge or corner, not only a plain surface. None of that requires expertise in diffusion; all of it is easier to ask for with an understanding of what the heat treater is controlling.

## Beyond carburising

The same approach controls every diffusion process in this book and many outside it. Nitriding builds a hard case by diffusing nitrogen at lower temperatures, with its own diffusion coefficients and boundary conditions. Diffusion coatings, such as aluminised or chromised surfaces, grow by inward diffusion of the coating element. Hydrogen bakes, decarburisation limits and scale allowances follow the square-root and Arrhenius laws already developed. Outside metallurgy, the drying of moulded plastic parts and the curing of thick adhesive joints are diffusion processes too, governed by the same thickness-squared scaling. In each, the result is a formula in a few inputs, each input has an uncertainty, and the combination can be budgeted, centred, charted and requalified in exactly the way DS-40's case depth is.

## A failure case: a new bar supplier

This is an illustration. DS-40's purchasing team, offered a better price, switched to a different supplier of bar in the same nominal grade. The bar met the grade's specification, and nobody thought to tell the heat treater, because the grade had not changed.

Over the next few weeks, the coupon chart showed the case depth stepping down by about 0.05 mm, from around 0.85 mm to around 0.80 mm, with the spread unchanged. The detection came from the chart: a step, not a drift, pointed to a single change at a single date, and the batch records showed the new heat numbers from that date. Carbon analysis of coupons from the new bar showed the profile slightly shallower than the model predicted, consistent with an effective D about 10% lower; the new supplier's alloy content sat at a different point within the grade's ranges, enough to slow carbon diffusion a little.

The correction was a requalification: the effective D was refitted from the new coupons as in Chapter 2, the diffuse time was extended by about 10% to restore the 0.85 mm target, and the change list for requalification was sent to purchasing, so that the next supplier change would reach the heat treater before the bar did.

## How this applies to a small Australian business

Build an error budget for any diffusion process that matters: list the sources, find each one's effect on the result, and combine them. Expect measurement and atmosphere control to matter as much as temperature, and time to matter little. Set the target so that the combined spread sits comfortably inside the tolerance, and reduce the largest contributors where you can. Carry coupons with every load, chart the results in time order, keep complete batch records, and requalify whenever the steel, the furnace, the cycle or the part changes.

## Exercise: tighter atmosphere control

After the heat treater adds more frequent shim checks, the carbon potential is held to **±0.025%** instead of ±0.05%, roughly halving its contribution to about **±2.9%**. With the other contributions unchanged, what is the new combined spread? With the 0.85 mm target, what range of case depth should the chart show?

**Worked answer.** The combined spread is **√(3.1² + 0.9² + 2.9² + 2.5² + 6.9² + 3.2²) ≈ 9.1%**, down from about 10.4%. On a 0.85 mm target that is about **±0.077 mm**, so the chart should show case depths of about **0.77 to 0.93 mm**. The improvement is modest because the measurement, at ±6.9%, is now the dominant contributor; the next improvement should come from the traverse procedure.
