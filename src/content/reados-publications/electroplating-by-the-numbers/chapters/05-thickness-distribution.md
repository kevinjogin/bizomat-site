---
book: electroplating-by-the-numbers
chapterSlug: thickness-distribution-edges-and-recesses
order: 5
title: "Thickness distribution: edges and recesses"
description: "See why plating builds up on edges and thins in recesses, map the thickness on a real part, and use design, racking and specification to meet a minimum without doubling the time."
draft: false
---

A plating tank does not coat a part like paint from a can. Current flows from the anodes to the work along paths of least resistance, and those paths reach some surfaces far more easily than others. Edges, corners and points facing the anodes take more than their share; recesses, inside corners and surfaces facing away take less. The result is a coating whose thickness can vary several-fold across one part, even when every setting is correct.

This is the reason specifications call for a minimum local thickness on significant surfaces, and the reason the bracket plan in Chapter 2 doubled the average thickness. This chapter explains the mechanism, maps the bracket and shows how a small design change saved more than any adjustment to the plating line could.

## Why current crowds onto edges

The solution between anodes and work is a conductor, and current divides through it in inverse proportion to the resistance of each path. A sharp edge sits at the end of many short paths that fan in towards it from the surrounding solution, so the electric field concentrates there and so does the current. A recess is the opposite: the solution inside it is a longer, narrower path, partly shielded by the surrounding metal, and less current reaches its bottom. Engineers call the distribution set purely by this geometry the **primary current distribution**.

Two effects soften it in practice. Each electrode surface resists the reaction slightly more as the current through it rises, which pushes current away from the heavily loaded edges towards the lightly loaded recesses. And in many baths the current efficiency falls at high current density, as Chapter 3 described, so the edges deposit less metal per unit of current than the recesses. A bath's ability to deposit metal evenly over an irregular part is called its **throwing power**. Baths differ greatly in it, and so do the additives that platers use to improve it.

The 1917 treatise observed a related effect at a smaller scale: deposits tend to roughen as they thicken, with high points growing faster than low ones. A burr on a part is a high point on a large scale, and it gathers a nodule of extra zinc for the same reason an edge does.

## Mapping the bracket

This is an illustration. Before agreeing the plating plan, the plater plated a sample rack at the planned conditions and sectioned several brackets to measure the zinc at different points. Expressed as fractions of the average thickness, the edges carried about 160%, the outer faces about 105%, the walls of the channel about 70% and the bottom of the channel recess about 50%. With an average of 16 µm, that gives:

```figure
type: bars
title: Zinc thickness around the bracket at a 16 µm average
unit: µm
max: 28
caption: This is an illustration, from sectioned sample brackets. The recess sets the plating time; the edges carry more than three times as much zinc as the recess.
- Edges | 25.6
- Outer faces | 16.8
- Channel walls | 11.2
- *Channel recess | 8.0
```

The minimum of 8 µm is reached only in the recess, and only because the average was set at 16 µm. Everywhere else carries more zinc than the specification requires: the edges more than three times as much. That excess costs plating time, zinc and rectifier capacity, and on the edges it brings the local current density close to the top of the bath's window, as Chapter 4 showed.

## Why the minimum, not the average

A zinc coating protects steel until it is consumed, and it is consumed first where it is thinnest. Chapter 8 shows that in a medium-corrosivity atmosphere, classed C3, zinc is lost at roughly 0.7 to 2.1 µm a year. This is an illustration. In such a location, an 8 µm minimum would last, on that simple model, roughly 3.8 to 11.4 years before the first steel was exposed. A coating with the same 8 µm average but only 4 µm in the recess would expose steel in the recess after roughly 1.9 to 5.7 years, however much zinc remained on the edges. The average says how much zinc was bought; the minimum says how long the part is protected. That is why modern zinc standards specify a minimum local thickness, and why the thickness map, not the rectifier setting, decides whether a plating plan meets the specification.

## Four ways to meet the minimum

When the thinnest significant surface sets the plating time, there are four broad responses, and they fall to different people.

```figure
type: decision
title: Meeting a minimum in a recess
question: Who can change what?
caption: Changing the part or the specification is usually cheaper than changing the plating, but it has to be decided early.
- Designer | Can the recess be opened or shallowed? | better distribution; shorter time
- Designer | Is the recess a significant surface? | mark it non-significant if it is not
- *Plater | Can racking or anodes improve it? | orientation, shields, auxiliary anodes
- Plater | Can the bath throw better? | different chemistry or additives
- Purchaser | Is a longer cycle acceptable? | pay for the time and zinc
```

**Change the part.** A recess that is deep for its width is hard to plate. Opening a channel, adding a radius to an inside corner, adding holes so solution circulates, or shortening a blind feature all move the recess's share of current up. The READOS chapter on [designing sheet metal parts for manufacture](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/) covers the forming side of such choices.

**Change the specification.** If the recess does not matter for service or appearance, the drawing can show it as a non-significant surface, and the minimum then applies to the surfaces that do matter. That is not a loophole; it is the purpose of marking significant surfaces.

**Change the racking.** The plater can orient parts so recesses face the anodes, space parts so they do not shield each other, fit non-conducting shields to reduce current at exposed edges, fit **auxiliary anodes** that reach into a recess, or place **robbers**, sacrificial cathodes beside edges that steal some of their excess current. Some of these are economic only for large or expensive parts.

**Accept a longer cycle.** Running longer to reach the minimum in the recess works, and is what the original bracket plan did, but every surface then receives more zinc and the line's capacity falls.

## The bracket redesign

This is an illustration. Once the map was available, the workshop's designer looked at the channel. It had been formed deep and narrow to stiffen the bracket, but a stiffness check showed a slightly wider and shallower channel gave almost the same stiffness. The plater plated a sample of the revised form and found the recess now received about **70%** of the average current, and the edges about 150%.

With 70% in the recess, an average of 8 ÷ 0.7 ≈ **11.43 µm** gives the 8 µm minimum. At the same 2.0 A/dm² and 80% efficiency, that takes about 11.43 ÷ 0.4555 ≈ **25.1 minutes** instead of 35.1, ten minutes less per rack. The edges carry about 17.1 µm instead of 25.6 µm, and their local current density at 2.0 A/dm² average is about 3.0 A/dm², further from the burning limit.

```figure
type: compare
title: Original and revised channel
cols: Original | Revised
caption: This is an illustration. The same 8 µm minimum, reached with less zinc, less time and more margin at the edges.
- Recess share of average | 50% | 70%
- Average thickness needed | 16.0 µm | 11.43 µm
- Plating time at 2.0 A/dm² | 35.1 min | 25.1 min
- Edge thickness | 25.6 µm | 17.1 µm
- *Zinc per bracket | 2.285 g | 1.632 g
```

Over the order, the revised bracket uses about 2.61 kg less zinc and saves about ten minutes of plating on each of the 100 racks. With three racks in the tank at a time, that is about 5.6 hours of tank time, before counting the shorter rinsing and passivating that a lighter coating needs. Chapter 10 prices the saving at about A$856 for the order. The plating line did not change at all.

## Holes, bends and edges

The same mechanism decides what happens in holes. Current reaches the inside of a hole only through its opening, so the wall of a hole plates thinner than the face around it, and the deeper the hole relative to its diameter, the thinner the coating towards its middle. This is an illustration. If the bracket's 10 mm hole receives about 30% of the average, a 16 µm average puts about 4.8 µm on its wall and reduces its diameter by about 9.6 µm, not the 16 µm a uniform coating would remove. That is a smaller dimensional effect than Chapter 1 assumed, and also less corrosion protection inside the hole, which matters if water can collect there.

Edges are the opposite case. Thick zinc at an edge is not a problem for corrosion; edges are where paint and thin coatings fail first, so extra metal there helps. But electroplated zinc is relatively soft and thick deposits on sharp edges can be rough or nodular, especially near the top of the current density window. A part that is bent or formed after plating can also crack or flake its coating at the bend, where the thickest deposit meets the greatest strain. The rule that follows is simple: form, pierce and deburr before plating, and specify on the drawing that the part is to be plated in its finished shape.

## Barrel-plated parts

Parts plated in a barrel experience the distribution differently. They tumble through the solution and make intermittent contact with the barrel's internal contacts and with each other, and the perforated barrel wall itself restricts the current. Thickness varies not only across each part but between parts in the same load, depending on where each spent its time. Barrel platers therefore control average thickness by load size, current and time, and measure a sample of parts from each load. Small recesses on barrel parts, such as the inside of a clip's bend, behave as they would on a rack, plating thin. The hardened clips that Chapter 7 introduces would be barrel plated, and their thinnest significant surface needs to be named just as the bracket's was.

## Measuring where it matters

A thickness specification is only as good as the places where thickness is measured. Magnetic gauges, which measure zinc on steel quickly and without damage, need room for their probe and a reasonably flat surface; they cannot reach the bottom of a narrow channel. X-ray instruments can measure smaller spots. A cross-section through a sample part, polished and measured under a microscope, is the reference method when access is poor or when results are disputed, at the cost of destroying the sample.

The measurement plan therefore needs to name locations, and the locations need to include the thinnest significant surface. If that surface cannot be reached by the routine method, the plan can measure a reference point that has a known, established relationship to it, such as a flat face whose thickness the sectioned samples showed to be about twice the recess thickness, with periodic sections to confirm the relationship still holds.

## A failure: the average that passed inspection

This is an illustration. Before the thickness map was made, the plater had read "8 µm" on the original order as an average and set the plating time to about 17.6 minutes, which at 80% efficiency gives an 8 µm average. Incoming inspection at the workshop measured the outer faces with a magnetic gauge, found readings of about 8 to 9 µm and accepted the batch.

The brackets were installed. Within months a site inspection found white corrosion products and then rust inside the channels, where the zinc had been only about 4 µm, half the average. The coating had been measured, but only where it was thickest relative to the problem. The investigation, a few sectioned brackets from the same batch, showed the distribution immediately.

The corrections addressed both readings of the number. The specification was clarified as a minimum local thickness, with the channel recess named as a significant surface and a measurement location. Because the recess could not be reached with the magnetic gauge, the inspection plan used the outer face as a reference point with a required reading of at least 17 µm, about 2.1 times the recess minimum, since the sections showed the outer faces at 105% of the average and the recess at 50%, confirmed by sectioning one bracket in every batch. Later, after the redesign moved the recess share to 70%, the reference reading was recalculated from new sections. The lesson is that a measured thickness says nothing about the places that were not measured. The batch already installed was assessed for remaining life and, because the channels faced downward and stayed damp, the affected brackets were replaced at the next planned shutdown rather than left to fail.

## Exercise: plating the revised bracket

For the revised bracket, the recess receives 70% of the average current density and the edges 150%. Using the same bath at 80% efficiency and a working window of 0.5 to 4.0 A/dm², calculate the average thickness and plating time needed at 2.0 A/dm², then check whether the average could safely be raised to 2.5 A/dm² to save more time.

The average needed is 8 ÷ 0.7 ≈ **11.43 µm**, which at 0.4555 µm/min takes about **25.1 minutes**. At 2.5 A/dm², the rate would be about 17.08 × 2.5 × 0.80 ÷ 60 ≈ 0.569 µm/min, so the time falls to about 20.1 minutes, but the edges would run at 1.5 × 2.5 = **3.75 A/dm²**, close to the top of the window, and the efficiency may fall at the higher current density, eroding the saving. A sample rack, sectioned and measured, should confirm both the recess thickness and the edge quality before the change is adopted.
