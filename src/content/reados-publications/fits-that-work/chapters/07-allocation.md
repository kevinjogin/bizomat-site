---
book: fits-that-work
chapterSlug: spend-the-tolerance-budget-deliberately
order: 7
title: "Spend the tolerance budget deliberately"
description: "Compare nominal shifts, tighter features, adjustment and selective assembly using functional margin, manufacturing effort and inspection consequences."
draft: false
---

Once a stack fails, the quickest response is often to tighten every dimension. That can produce an expensive drawing while leaving the underlying problem untouched. A better response identifies which change creates useful functional margin and what it asks of manufacturing, assembly and inspection.

The tolerance budget is a design decision. It should make the assembly work with a process that can be maintained, rather than reward the smallest number on a drawing.

## Compare changes against the complete model

This is an illustration. Retain the stop-cartridge requirement of 1.85 to 2.15 mm. Use the stated uniform temperature range and coefficients, and provisionally allocate ±0.010 mm at the output for geometry. C remains 52.00 ± 0.04 mm and S remains 6.00 ± 0.03 mm.

The following bounds include dimensional variation, uniform temperature from 20 to 60 °C and the provisional geometric contribution:

| Housing proposal | Lowest modelled gap | Highest modelled gap | Interpretation |
|---|---:|---:|---|
| A: 60.00 ± 0.06 mm | 1.860000 mm | 2.167449 mm | Upper limit exceeded |
| Shift only: 59.98 ± 0.06 mm | 1.840000 mm | 2.147430 mm | Lower limit exceeded |
| Tighten only: 60.00 ± 0.04 mm | 1.880000 mm | 2.147430 mm | Passes this model with little upper margin |
| B: 59.98 ± 0.04 mm | 1.860000 mm | 2.127412 mm | Passes this model with more upper margin |

```figure
type: range
title: Four housing proposals against the complete model
unit: mm
min: 1.8
max: 2.2
caption: Shifting the centre alone or tightening alone fixes one end and stresses the other; Revision B does both.
- Functional requirement | 1.85 | 2.15
- A: 60.00 ± 0.06 | 1.86 | 2.167 | upper limit exceeded
- Shift only: 59.98 ± 0.06 | 1.84 | 2.147 | lower limit exceeded
- Tighten only: 60.00 ± 0.04 | 1.88 | 2.147 | little upper margin
- *B: 59.98 ± 0.04 | 1.86 | 2.127
```

Shifting the nominal redistributes margin; it does not reduce variation. Tightening the housing reduces variation but does not remove the thermal shift. Combining the changes gives a more useful balance for this case.

The table is not a release certificate. The geometric allocation still needs evidence, and the uniform-temperature model remains limited. Its value is that options are compared on the same basis.

## Rank the contributors before choosing

A simple ranking shows where effort could pay. For Revision A at the reference temperature, the worst-case half-width of 0.13 mm divides as follows:

- **Housing span H:** 0.06 mm, about 46%
- **Cartridge C:** 0.04 mm, about 31%
- **Spacer S:** 0.03 mm, about 23%

Under the illustrative normal model of Chapter 3, where each standard deviation is a third of the half-width, the shares of the gap variance are different, because variances add as squares. The housing then contributes about 59% of the variance, the cartridge about 26% and the spacer about 15%.

```figure
type: bars
title: Share of the gap variation, Revision A
unit: %
max: 70
caption: Worst-case shares follow the half-widths; variance shares follow their squares, so the largest contributor dominates more strongly.
- *Housing H, share of variance | 59
- Housing H, share of worst-case | 46.2
- Cartridge C, share of variance | 26.2
- Cartridge C, share of worst-case | 30.8
- Spacer S, share of variance | 14.8
- Spacer S, share of worst-case | 23.1
```

The squared effect has a practical lesson. In a statistical stack, halving a small contributor achieves little, because its square was already small. Halving the largest contributor can change the result substantially. In a worst-case stack, every reduction counts in proportion, so a cheap reduction on a small contributor may still be worth having. Knowing which kind of stack governs the decision tells you which ranking to use.

## Ask where a tighter tolerance is economical

The largest contributor is an obvious place to investigate, but not automatically the cheapest place to change. A housing span may require a second set-up or a different inspection method, while a spacer thickness may be controlled readily by an existing finishing operation.

Ask suppliers how each proposed limit affects the route. Identify the locating surfaces, number of set-ups, tool wear sensitivity, inspection access and likely adjustment frequency. A supplier statement that a machine is “accurate to five microns” does not establish the capability of the complete part-making process.

Also check whether the characteristic is stable over the actual batch size. A short finishing cut on a warm machine may behave differently from the first parts after start-up. The process proposal should explain how these conditions are controlled, not merely quote a favourable sample.

If several dimensions are controlled from one functional reference in one set-up, changing the architecture may improve their relationship without tightening every individual size. Record the actual dependency rather than assuming that one set-up eliminates all error.

## Look for tolerance that can be relaxed

Allocation is not only about tightening. A tolerance budget often contains features that are tighter than the function needs, either because a drawing template applied a default or because a feature was once in a chain that has since changed. Relaxing those saves cost without touching the functional requirement.

Two checks find them. First, confirm that each toleranced feature on the components appears in a functional chain or another requirement; features that appear in none can usually take a general tolerance. Second, for features that are in a chain, check whether the margin at the relevant end allows more. In Revision B, the upper side has about 0.023 mm of margin and the lower side 0.010 mm. That asymmetry suggests that any future relaxation should be one that moves the gap up, not down, and that a tolerance which opens the gap might be loosened slightly before one that closes it.

## Let process capability guide the numbers

A tolerance that a process holds comfortably is cheap; one at the edge of its capability is expensive, because it needs more inspection, more adjustment and more scrap. Allocation decisions should therefore use the supplier's actual capability for each feature, not a general sense of what machines can do.

Ask for evidence in a form that supports the decision: the feature, process route, measured standard deviation over a representative period, the centring achieved and the measurement method. If the housing span can be held to a standard deviation of 0.008 mm with good centring, a ±0.04 mm tolerance is five standard deviations each side and is likely to be economical. If the best demonstrated value is 0.015 mm, the same tolerance is under three standard deviations each side, and Revision B's housing becomes a feature that will need close watching, sorting or a different route.

## Price the work introduced by the decision

For a fictional annual quantity of 3,000 housings, suppose the tighter span adds 0.7 minutes of machining at an internal planning rate of A$60 per hour and 1.2 minutes of inspection at A$48 per hour.

The additional machining allocation is **0.7 / 60 × 60 = A$0.70 per part**. Inspection adds **1.2 / 60 × 48 = A$0.96 per part**. Together they add **A$1.66 per part**, or **A$4,980 per year** at the assumed volume.

```figure
type: stack
title: The price of tightening the housing
unit: A$
caption: About A$1.66 a part, or A$4,980 a year at the assumed volume.
- Additional machining | 0.70
- *Additional inspection | 0.96
```

If a gauge costs A$900 and method development takes six hours at A$60 per hour, the initial allocation is another **A$1,260**. The first-year total is **A$6,240**, before any other costs or savings.

These are invented planning figures, not market prices. The calculation helps compare alternatives, but it does not establish a business case until avoided losses, capacity effects, maintenance and uncertainty are considered. A non-negotiable functional requirement cannot be waived merely because the compliance cost is inconvenient.

## Consider adjustment without hiding its obligations

A shim or adjustable stop can absorb component variation. It also creates an assembly process that must select, install and verify the adjustment correctly.

For a target gap of 2.00 mm, the ideal spacer thickness would be **S = H − C − 2.00**. If the measured H − C is 8.015 mm, the calculated ideal S is 6.015 mm. A nominal 6.02 mm option would predict a 1.995 mm gap if those inputs were exact.

They are not exact. The measurement has uncertainty, the selected spacer has its own tolerance, and the assembled contacts may differ from the measurement state. A selection rule must account for those influences. Merely rounding to the nearest shim size is not a complete acceptance process.

Specify the available range and increments, identification method, permitted combinations, retention and reinspection requirement. Consider whether future maintenance must reproduce the selection or preserve a matched set. A simple-looking adjustment can move cost from machining into assembly and service.

## Work an adjustment through to its result

The shim example above can be completed to show what adjustment achieves. Suppose the measured H − C of 8.015 mm has an expanded uncertainty of 0.006 mm, and the chosen 6.02 mm spacer is supplied to ±0.005 mm. The three-part chain has been replaced by two terms: the measurement of H − C and the shim. Treating both as bounds, the predicted gap is:

**8.015 − 6.020 = 1.995 mm, ± (0.006 + 0.005) = 1.984 to 2.006 mm**

That interval, about 0.022 mm wide, is a fraction of the 0.26 mm worst-case width of Revision A at the reference temperature. The housing and cartridge can then be made to wider, cheaper tolerances, provided the selection process works as specified. The interval still excludes the thermal and geometric effects of earlier chapters, which apply to the adjusted assembly as well.

The choice of shim series follows from the same arithmetic. A series stepped every 0.02 mm, from 5.97 to 6.07 mm, can bring any measured H − C within its range to within half a step, 0.01 mm, of the target before uncertainties. Finer steps reduce that rounding but add more part numbers to stock and identify. The range must cover the full spread of H − C that the component tolerances allow, or some assemblies will have no suitable shim.

## Preserve the meaning of interchangeability

Selective assembly groups parts by measured characteristics so that suitable combinations can be built. It can be useful when the process and traceability support it. It changes the promise that any accepted component can be combined with any other accepted component.

Before adopting it, test stock balance. A batch of large cartridges may require a disproportionate number of thin spacers, leaving other bins stranded. Consider replacement parts and field repairs as well as the initial production run.

Keep the pairing record and prevent accidental mixing. If the product is sold or maintained on the assumption of unrestricted interchangeability, a hidden matching process can create later failures even when the original assemblies were acceptable.

## Evaluate decisions that simplify the chain

Removing an unnecessary interface can eliminate both a tolerance contribution and a seating uncertainty. Combining features may reduce part count but make machining or repair harder. Moving a functional stop can shorten the sensitive thermal path.

Evaluate these changes against the whole product. An integral spacer may simplify assembly while preventing inexpensive wear replacement. A compliant element may tolerate size variation while introducing force, creep or fatigue requirements. The dimensional benefit does not settle the mechanical trade-off.

Use a decision record that states the option, result, manufacturing evidence, inspection consequence and unresolved limitation. Choose the option with the strongest supported fit to the requirements, not the neatest spreadsheet.

## Material choice is also an allocation

The thermal term is part of the budget, and it can be changed by design rather than by tolerance. With the assumed coefficients, the aluminium housing outgrows the steel internal parts, opening the nominal gap by about 0.027 mm over the 40 °C rise. If the housing were made of a material with the same coefficient as the internal parts, the net change would come only from the difference in length between the housing span and the internal stack:

**(60 − 52 − 6) × 12 × 10⁻⁶ × 40 ≈ 0.001 mm**

That would return almost all of the thermal shift to the budget, without tightening any tolerance. It would also change weight, cost, machining, corrosion behaviour and heat dissipation, so it is a design decision with its own evidence, not a free fix. The point is that the options for recovering margin include the physics of the chain as well as the numbers on the drawing.

## Record why each tolerance is what it is

Once the allocation is settled, record the reason for each functional tolerance next to it: which requirement it serves, what share of the budget it takes, what process evidence supports it and who agreed it. A short table is enough.

That record pays off later. When a supplier asks to relax a tolerance, the team can see immediately which requirement would be affected and by how much. When a new engineer wonders why a housing span is held to ±0.04 mm, the answer is written down rather than rediscovered. And when a design change alters the chain, the record shows which tolerances may now be relaxed or tightened, instead of leaving obsolete numbers on the drawing for years.

## Exercise: explain the centre-only failure

Why does changing H from 60.00 ± 0.06 to 59.98 ± 0.06 mm fail the complete teaching model even though it reduces the hot upper gap?

The nominal reduction shifts the entire reference-temperature interval downward by 0.02 mm. With the additional ±0.010 mm geometric allocation, the lowest gap becomes **1.84 mm**, below the 1.85 mm limit. The change transfers the problem to the lower side.

Write the next evidence request for Revision B. A useful answer asks the supplier to demonstrate a sustainable method for the revised housing span and asks the design team to substantiate the geometric and thermal assumptions. The next chapter plans the pilot evidence without mistaking a few satisfactory parts for long-run capability.
