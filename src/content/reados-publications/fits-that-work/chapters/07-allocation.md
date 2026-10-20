---
book: fits-that-work
chapterSlug: spend-the-tolerance-budget-deliberately
order: 7
title: "Spend the tolerance budget deliberately"
description: "Compare nominal shifts, tighter features, adjustment and selective assembly using functional margin, manufacturing effort and inspection consequences."
draft: true
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

Shifting the nominal redistributes margin; it does not reduce variation. Tightening the housing reduces variation but does not remove the thermal shift. Combining the changes gives a more useful balance for this case.

The table is not a release certificate. The geometric allocation still needs evidence, and the uniform-temperature model remains limited. Its value is that options are compared on the same basis.

## Ask where a tighter tolerance is economical

The largest contributor is an obvious place to investigate, but not automatically the cheapest place to change. A housing span may require a second set-up or a different inspection method, while a spacer thickness may be controlled readily by an existing finishing operation.

Ask suppliers how each proposed limit affects the route. Identify the locating surfaces, number of set-ups, tool wear sensitivity, inspection access and likely adjustment frequency. A supplier statement that a machine is “accurate to five microns” does not establish the capability of the complete part-making process.

Also check whether the characteristic is stable over the actual batch size. A short finishing cut on a warm machine may behave differently from the first parts after start-up. The process proposal should explain how these conditions are controlled, not merely quote a favourable sample.

If several dimensions are controlled from one functional reference in one set-up, changing the architecture may improve their relationship without tightening every individual size. Record the actual dependency rather than assuming that one set-up eliminates all error.

## Price the work introduced by the decision

For a fictional annual quantity of 3,000 housings, suppose the tighter span adds 0.7 minutes of machining at an internal planning rate of A$60 per hour and 1.2 minutes of inspection at A$48 per hour.

The additional machining allocation is **0.7 / 60 × 60 = A$0.70 per part**. Inspection adds **1.2 / 60 × 48 = A$0.96 per part**. Together they add **A$1.66 per part**, or **A$4,980 per year** at the assumed volume.

If a gauge costs A$900 and method development takes six hours at A$60 per hour, the initial allocation is another **A$1,260**. The first-year total is **A$6,240**, before any other costs or savings.

These are invented planning figures, not market prices. The calculation helps compare alternatives, but it does not establish a business case until avoided losses, capacity effects, maintenance and uncertainty are considered. A non-negotiable functional requirement cannot be waived merely because the compliance cost is inconvenient.

## Consider adjustment without hiding its obligations

A shim or adjustable stop can absorb component variation. It also creates an assembly process that must select, install and verify the adjustment correctly.

For a target gap of 2.00 mm, the ideal spacer thickness would be **S = H − C − 2.00**. If the measured H − C is 8.015 mm, the calculated ideal S is 6.015 mm. A nominal 6.02 mm option would predict a 1.995 mm gap if those inputs were exact.

They are not exact. The measurement has uncertainty, the selected spacer has its own tolerance, and the assembled contacts may differ from the measurement state. A selection rule must account for those influences. Merely rounding to the nearest shim size is not a complete acceptance process.

Specify the available range and increments, identification method, permitted combinations, retention and reinspection requirement. Consider whether future maintenance must reproduce the selection or preserve a matched set. A simple-looking adjustment can move cost from machining into assembly and service.

## Preserve the meaning of interchangeability

Selective assembly groups parts by measured characteristics so that suitable combinations can be built. It can be useful when the process and traceability support it. It changes the promise that any accepted component can be combined with any other accepted component.

Before adopting it, test stock balance. A batch of large cartridges may require a disproportionate number of thin spacers, leaving other bins stranded. Consider replacement parts and field repairs as well as the initial production run.

Keep the pairing record and prevent accidental mixing. If the product is sold or maintained on the assumption of unrestricted interchangeability, a hidden matching process can create later failures even when the original assemblies were acceptable.

## Evaluate decisions that simplify the chain

Removing an unnecessary interface can eliminate both a tolerance contribution and a seating uncertainty. Combining features may reduce part count but make machining or repair harder. Moving a functional stop can shorten the sensitive thermal path.

Evaluate these changes against the whole product. An integral spacer may simplify assembly while preventing inexpensive wear replacement. A compliant element may tolerate size variation while introducing force, creep or fatigue requirements. The dimensional benefit does not settle the mechanical trade-off.

Use a decision record that states the option, result, manufacturing evidence, inspection consequence and unresolved limitation. Choose the option with the strongest supported fit to the requirements, not the neatest spreadsheet.

## Exercise: explain the centre-only failure

Why does changing H from 60.00 ± 0.06 to 59.98 ± 0.06 mm fail the complete teaching model even though it reduces the hot upper gap?

The nominal reduction shifts the entire reference-temperature interval downward by 0.02 mm. With the additional ±0.010 mm geometric allocation, the lowest gap becomes **1.84 mm**, below the 1.85 mm limit. The change transfers the problem to the lower side.

Write the next evidence request for Revision B. A useful answer asks the supplier to demonstrate a sustainable method for the revised housing span and asks the design team to substantiate the geometric and thermal assumptions. The next chapter plans the pilot evidence without mistaking a few satisfactory parts for long-run capability.
