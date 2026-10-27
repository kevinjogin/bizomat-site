---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: fin-spacing-in-natural-convection
order: 6
title: "Fin spacing in natural convection"
description: "Too few fins waste the footprint; too many choke the rising air. The channel correlation and the optimum spacing set HS-150's 18 fins, and expose a dense catalogue profile that ran 26 K hotter."
draft: false
---

Adding fins to a natural-convection heat sink adds area, but it also narrows the gaps through which the air must rise. In a wide gap, the boundary layers on the two facing fins grow independently, as on the isolated plate of Chapter 5, and the coefficient is as good as a plate's. In a narrow gap, the two layers meet, the air in the gap is heated throughout and slowed by friction on both walls, and the coefficient falls sharply. Somewhere between the two lies a spacing that sheds the most heat from a given footprint. Finding it is the central design decision for any natural-convection heat sink.

This chapter sets out the channel correlation that covers both regimes, the optimum-spacing relation that follows from it, and the sweep that chose HS-150's 18 fins. Its failure case is a catalogue profile with 28 fins, chosen because it had half as much area again, which ran its junction about 26 K hotter than HS-150's design.

## Air in a vertical channel

Treat each gap between two of HS-150's vertical fins as a channel of width S between two parallel plates of height L, both at the base temperature, open at the bottom and top. Air enters at the bottom at the ambient temperature, is heated as it rises and leaves at the top. Elenbaas measured such channels in the 1940s, and Bar-Cohen and Rohsenow later combined the limiting behaviours into a single composite correlation, written with the Rayleigh number based on the gap width, Ra_S = g β ΔT S³ ÷ (ν α), multiplied by the aspect ratio S ÷ L. For symmetric, isothermal plates it is:

Nu_S = [576 ÷ (Ra_S S ÷ L)² + 2.873 ÷ (Ra_S S ÷ L)^½]^(−½)

with the coefficient h = Nu_S × k ÷ S. The first term dominates in narrow channels, where the flow is fully developed and Nu_S approaches Ra_S S ÷ L ÷ 24; the second dominates in wide ones, where the plates behave as isolated plates.

```figure
type: formula
title: HS-150's channel coefficient at full load, 18 fins
formula: Nu_S = [576 ÷ (Ra_S S/L)² + 2.873 ÷ (Ra_S S/L)^½]^(−½),   h = Nu_S k ÷ S
caption: This is an illustration at a base temperature of 94.5 °C in 40 °C air, with air properties at the 67 °C film temperature from Chapter 5. HS-150's 18 fins, 2.5 mm thick, on a 200 mm base leave 17 gaps of about 9.12 mm.
- S | (200 − 18 × 2.5) ÷ 17 ≈ 9.12 mm
- Ra_S | g β ΔT S³ ÷ (ν α) ≈ 2,180
- Ra_S S ÷ L | 2,180 × 9.12 ÷ 250 ≈ 79.6
step: Nu_S ≈ [576 ÷ 79.6² + 2.873 ÷ 79.6^½]^(−½) ≈ 1.56
step: h ≈ 1.56 × 0.0293 ÷ 0.00912 ≈ 5.0 W/m²·K
```

That coefficient, 5.0 W/m²·K, is the one Chapter 4 used for HS-150's fins. It happens to equal the isolated plate's value from Chapter 5, which is a sign of a well-chosen spacing: the gap is just wide enough that the boundary layers barely interfere, and no wider.

## The optimum spacing

Bar-Cohen and Rohsenow found the spacing that maximises the heat from a fixed footprint of isothermal plates by differentiating the composite correlation. Its result, in the form usually quoted, is:

S_opt ≈ 2.714 × L ÷ Ra_L^¼

where Ra_L is the Rayleigh number on the full height L, the same as Chapter 5's 4.50 × 10⁷ for HS-150. With Ra_L^¼ ≈ 81.9, S_opt ≈ 2.714 × 250 ÷ 81.9 ≈ **8.3 mm**. Comparing with Chapter 5, the optimum is about 2.7 times the boundary-layer scale L ÷ Ra_L^¼ of about 3 mm: the gap is about the width of the two thermal layers that would grow on its walls.

The relation shows what moves the optimum. Taller sinks want wider gaps, roughly as L^¼, because their boundary layers grow thicker. Hotter sinks want narrower gaps, roughly as ΔT^(−¼), because buoyancy is stronger. And the optimum barely depends on the fin's height, which is why fin height is chosen for area and spacing for air flow.

## Choosing HS-150's fins

The optimum spacing sets the number of fins for a given footprint and fin thickness, but the best choice also accounts for the fin thickness itself, the fin efficiency and radiation. The simplest robust method is a sweep: for each candidate number of fins, calculate the channel coefficient, the fin efficiency, the convective and radiative heat at a trial base temperature, and solve for the base temperature that sheds 150 W. The resistance is then the excess over 150 W.

```figure
type: line
title: HS-150's base temperature against number of fins, 150 W in 40 °C air
x: Number of 2.5 mm fins on the 200 mm base
y: Base temperature, °C
legend: Isothermal base, convection plus radiation
ymin: 90
ymax: 125
caption: This is an illustration from the channel correlation, fin efficiency and the envelope radiation model of Chapter 7. The coolest base, about 94.5 °C (0.363 K/W), is at 18 fins, a 9.1 mm gap, close to the 8.3 mm optimum spacing; 10 fins give 0.463 K/W and 28 fins 0.536 K/W. The curve is flat near its minimum and steep beyond it.
- 8 | 117.1
- 10 | 109.5
- 12 | 103.4
- 14 | 98.8
- 16 | 95.7
- 18 | 94.5
- 20 | 95.7
- 22 | 99.2
- 24 | 104.8
- 28 | 120.4
```

The sweep's minimum is at 18 fins, with a resistance of about **0.363 K/W** and the base at about 94.5 °C, inside the 0.40 K/W target. The curve is shallow on the wide-gap side, where adding fins adds area with little penalty, and steep on the narrow-gap side, where each extra fin chokes the flow further. That asymmetry is the practical rule: when in doubt, err towards fewer, wider-spaced fins.

## The failure case: the profile with more area

This is an illustration. Before the sweep was done, a catalogue extrusion with the same 200 mm × 250 mm footprint and 45 mm fins was proposed, carrying 28 fins with gaps of about 4.8 mm. Its fin area, about 0.65 m², was more than half as much again as HS-150's 0.42 m², and its catalogue entry quoted a lower resistance than any 18-fin profile in the same range. The catalogue figure, it turned out, was measured with forced air.

In natural convection, the 4.8 mm gaps are well under the 8.3 mm optimum. The channel Rayleigh number at the gap width is about 400, the aspect-ratio product Ra_S S ÷ L only about 7.7, and the flow is in the narrow, fully developed regime: the coefficient falls to about **1.9 W/m²·K**, less than two-fifths of HS-150's. The extra area cannot compensate. The 28-fin sink's resistance is about **0.536 K/W**, its base runs at about 120 °C at 150 W, and the junction, with the same interface and spreading allowance, reaches about **148 °C**, against 122 °C for the 18-fin design.

```figure
type: compare
title: Three fin counts on HS-150's footprint at 150 W in 40 °C air
cols: Gap | Channel coefficient | Fin area | Sink resistance | Junction
caption: This is an illustration. Radiation is calculated on the sink's outer envelope (Chapter 7), so it rises with base temperature rather than with fin count. Junction temperatures include the interface and spreading resistances of Chapters 2 and 9.
- 10 fins | 19.4 mm | 6.0 W/m²·K | 0.23 m² | 0.463 K/W | 137 °C
- *18 fins | 9.1 mm | 5.0 W/m²·K | 0.42 m² | 0.363 K/W | 122 °C
- 28 fins | 4.8 mm | 1.9 W/m²·K | 0.65 m² | 0.536 K/W | 148 °C
```

The difference was found by asking for the catalogue figure's test conditions. The correction was the sweep above, done before any extrusion was ordered. The general lesson is that natural-convection sinks are limited by air flow, not by area, and a profile designed for a fan is usually too dense for still air. A catalogue resistance should only be compared with a requirement when it was measured in the same mode of cooling, orientation and temperature rise.

## Two limits and the composite between them

The composite correlation is built from two simpler results, and seeing them separately explains why the optimum exists. In a very narrow channel, the air is heated across its whole width almost as soon as it enters, and the flow is fully developed; then Nu_S ≈ (Ra_S S ÷ L) ÷ 24, which falls steeply as the gap closes, because Ra_S contains S³. In a very wide channel, the two walls do not feel each other, and each behaves as an isolated vertical plate; then Nu_S ≈ (Ra_S S ÷ L)^¼ ÷ √2.873, the isolated-plate law rewritten on the gap width. The composite takes whichever limit is smaller and blends them smoothly where they cross.

For HS-150's three candidate designs at 150 W, the two limits tell the story. With 28 fins, Ra_S S ÷ L is about 7.7: the narrow-channel limit gives about 0.32 and the wide-channel limit about 0.98, so the narrow limit governs and the composite gives about 0.31. With 10 fins, the product is about 1,900: the narrow limit would give about 79, the wide limit about 3.9, and the wide limit governs. With 18 fins, at about 80, the two limits give about 3.3 and 1.8, close enough to each other that the composite, about 1.56, sits below both. The optimum lies near the crossing of the two limits: wide enough to escape the choking of the narrow channel, narrow enough not to waste footprint on cool, idle air.

## Heat per kilogram

The sweep minimises resistance for a given footprint, but sinks are also bought by the kilogram. This is an illustration with 6063's density of 2,700 kg/m³ and solid rectangular fins. The 10-fin profile weighs about 2.11 kg, the 18-fin about 2.72 kg and the 28-fin about 3.48 kg. The 18-fin design sheds 150 W at a 54.5 K excess; the 28-fin profile uses 28 % more aluminium to shed the same heat at a 80 K excess, which is worse on both counts. The 10-fin profile is the lightest but needs a 69 K excess. A designer short of mass rather than footprint would look at thinner fins at the same pitch, which Chapter 4's exercise showed cost almost nothing in natural convection, before looking at fewer fins.

## Chimneys and shrouds

A natural-convection sink's flow is driven by the buoyancy of the warm air in its channels, and that buoyancy grows with the height of the warm column. A vertical duct, or chimney, above the sink's outlet extends the column and increases the draft, drawing more air through the channels. Chimneys are used in some cabinets and in passively cooled enclosures, and they can give a useful improvement when the sink's own height is limited. They also have a cost: the chimney adds friction, it must not be blocked, and it can carry warm air to places where it is not wanted. The channel correlation in this chapter does not include a chimney; its effect is best estimated with a model of the whole flow path or measured on a prototype. A shroud over the fin tips, which turns the open channels into closed ducts, generally does not help natural convection, because it removes the inflow through the open front of each channel; shrouds belong to the fan-cooled designs of Chapter 8.

## Fins at the edges and the open top

The channel model treats every gap as identical, but the two outer fins of HS-150 face the open air on one side, behaving like isolated plates on that face, and the air also enters partly through the open front of each channel, between the fin tips, not only from the bottom. Both effects help, and both are ignored in the estimate above, which is therefore slightly conservative for a sink in open air. On the other hand, anything that blocks the bottom or top of the channels, a cabinet plinth, a cable duct, a guard with small openings, starves the flow and can cost far more than those small gains. HS-150's installation drawing keeps 100 mm clear above and below the fins, and its guard is a coarse mesh whose open area was checked against the fins' gaps.

## How this applies to a small Australian business

The optimum spacing for a vertical natural-convection sink is a few millimetres for small sinks and grows slowly with height; about 6 to 10 mm is typical for sinks 100 to 300 mm tall at moderate temperatures. A sweep over the number of fins, in a spreadsheet using the channel correlation, takes an hour to set up and settles the question for any footprint. The most common error in buying natural-convection sinks is choosing a dense profile because it has more area, or because its catalogue figure, measured under forced air, looks better. Asking how and at what temperature rise the figure was measured avoids it. Where the sink's position is fixed but its profile is not, keeping the gaps near the calculated optimum and spending any spare budget on fin height, rather than on extra fins, is almost always the better use of aluminium.

## Exercise: HS-150 at 50 W

At 50 W the 18-fin sink's base runs at about 64.3 °C. With the air properties of Chapter 5's exercise (k ≈ 0.0282 W/m·K, ν ≈ 18.1 × 10⁻⁶ m²/s, α ≈ 25.7 × 10⁻⁶ m²/s, β ≈ 0.003 08 per K), find Ra_S for the 9.12 mm gap, the channel Nusselt number and the coefficient. Then find the optimum spacing at this load, using Ra_L ≈ 2.46 × 10⁷. Is HS-150's spacing still near the optimum?

**Worked answer.** Ra_S = 9.81 × 0.003 08 × 24.3 × 0.009 12³ ÷ (18.1 × 10⁻⁶ × 25.7 × 10⁻⁶) ≈ 1,200, and Ra_S S ÷ L ≈ 1,200 × 0.0365 ≈ 43.6. Then Nu_S ≈ [576 ÷ 1,904 + 2.873 ÷ 6.61]^(−½) ≈ [0.303 + 0.435]^(−½) ≈ **1.16**, and h ≈ 1.16 × 0.0282 ÷ 0.009 12 ≈ **3.6 W/m²·K**.

The optimum spacing is 2.714 × 250 ÷ (2.46 × 10⁷)^¼ ≈ 2.714 × 250 ÷ 70.4 ≈ **9.6 mm**. At light load the optimum widens, because buoyancy is weaker, and HS-150's 9.12 mm gap is now slightly narrower than optimal. A spacing chosen at full load is always a little tight at part load, which is acceptable because part load needs less cooling; the design point should be the worst case, as Chapter 1 required.
