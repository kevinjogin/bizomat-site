---
book: blending-bulk-solids-by-the-numbers
chapterSlug: after-the-blender
order: 7
title: "After the blender: bags, bins and discharge order"
description: "How filling a container builds a segregated heap and discharging it delivers the blend in a changing sequence, how to measure that sequence, and how a packaging change was proved with a planned trial."
draft: false
---

A blend is validated in the blender and used somewhere else. In between, it is discharged, packed, stored, moved and emptied again, and each step can change it. The two steps that change it most are filling a container, which builds a heap and sorts the blend as it does, and emptying it, which delivers the contents in an order set by the container's flow pattern. Together they can turn a uniform blend into a stream whose composition drifts steadily from the first kilogram to the last.

This chapter follows Plant C's premix from the ribbon blender into a bulk bag and out into the extruder's premix feeder. It shows how the filling heap and the bag's discharge combined to send stabiliser-rich premix first and stabiliser-lean premix last, how the plant measured that sequence, and how it proved a fix with a properly sized before-and-after trial.

## Filling builds a sorted heap

When a free-flowing blend is poured into a container from a single point, it builds a heap. Chapter 6's sifting mechanism acts on the heap's surface: as each layer runs down the slope, fine particles drop through the moving surface and stop near the pouring point, while coarse particles run on to the edges. Fine, light particles may also be carried sideways by displaced air. The container ends up with a core rich in fines under the inlet and a coarser annulus around it, repeated in each layer as the heap grows.

The premix has a fine component, the 150 µm stabiliser, and a coarse one, the 600 µm polypropylene powder. Filled from the blender's discharge valve into the centre of an 800 kg bulk bag, its stabiliser concentrates along the bag's axis. This is an illustration.

How strongly a heap sorts depends on how it is built. A tall drop speeds the stream, so particles bounce and roll further and the sorting is stronger. A slow fill gives each layer time to run down the slope as a thin, fast-moving sheet, which sorts well; a fast fill buries each layer under the next before it can travel far. A narrow stream builds a sharp central heap; a wide or moving one builds a flatter surface that sorts less. Filling the 800 kg bag from the blender took about half an hour from a drop of more than a metre at the start, close to the worst combination on every count.

## Discharge order depends on the flow pattern

What leaves the container first depends on how it empties. In mass flow, the whole contents move down together and the outlet receives a cross-section of each layer, so the radial sorting from filling is largely remixed. In funnel flow, a channel forms above the outlet, the central core and the top surface leave first, and the material against the walls leaves last. Bulk bags discharged through a spout in a flat base almost always empty in funnel flow, and so do most bins with shallow cones.

For the premix that combination is the worst possible: the stabiliser-rich core is the first thing the funnel draws, and the stabiliser-lean outer material is the last.

```figure
type: steps
title: How the premix's sequence was created
caption: This is an illustration. Each step is harmless alone. Together they deliver the premix's stabiliser unevenly through each bag, and the extruder's feeder passes the variation straight into the compound.
- Ribbon blender discharges a random blend | 20.0% stabiliser, s close to σ_R
- Blend poured into the centre of an 800 kg bulk bag | heap forms; fines sift to the core
- Bag stored and moved by forklift | some further settling
- Bag hung on the discharge frame, spout opened | funnel flow: core first, walls last
- * Premix feeder draws through the bag over 53 hours | composition drifts from rich to lean
```

## Measuring the sequence

To see what the feeder actually received, the plant sampled the premix at the bag discharge spout ten times through one bag, at every 80 kg, and assayed each sample for stabiliser. The results show the sequence directly.

```figure
type: line
title: Stabiliser in the premix through one 800 kg bulk bag
x: Share of the bag discharged, %
y: Stabiliser in the premix, %
ymin: 14
ymax: 25
caption: This is an illustration. One sample at the middle of each 10% of the bag. The average of the ten is exactly 20.0%, the blend's composition, but the feeder receives 23.6% at the start and 16.3% at the end.
- 5 | 23.6
- 15 | 22.4
- 25 | 21.3
- 35 | 20.6
- 45 | 20.1
- 55 | 19.7
- 65 | 19.3
- 75 | 18.8
- 85 | 17.9
- 95 | 16.3
```

The average of the ten samples is exactly 20.0%: nothing has been lost, only rearranged. The premix feeder adds premix at 1% of the compound, so the compound's stabiliser content follows the premix's, divided by 100: from **0.236%** at the start of each bag to **0.163%** at the end, against a target of 0.20%. Over the last quarter of the bag the compound averaged about **0.174%**.

At 15 kg/h, one bag lasts 800 ÷ 15 = 53 hours, so the drift is slow, a little over 0.0014 percentage points of stabiliser an hour, and it was invisible in the hour-to-hour data. It showed only when the quality laboratory's lot results were plotted against the age of the premix bag in use, which nobody had done.

## The error: validating the blend in the wrong place

This is an illustration. The premix had been validated in the blender, as Chapters 3 and 4 described, and passed comfortably. Its uniformity in the bag, and at the feeder, had never been tested, on the assumption that a blend validated in the blender stays validated. The customer's complaint about two compound lots with low oxidative stability, mentioned in Chapter 3, was traced partly to the shortened blend time and partly to this: both lots had been made while a premix bag was in its last quarter.

The engineer considered three fixes: a mass-flow discharge cone for the bulk bags, re-blending each bag at the feeder, and packing the premix in 25 kg sacks instead of 800 kg bags. The sacks won. A sack fills through a short spout in seconds, with a small heap and little drop, so it sorts far less than a bulk bag filled over half an hour. It is then emptied whole into the feeder's 30 kg refill hopper, which holds a complete sack and a remnant of the previous one, and at 15 kg/h a sack lasts about an hour and forty minutes. Whatever sequence remains inside a sack lasts under two hours instead of two days, and the refill hopper blends the end of one sack with the start of the next.

## Proving the fix

A change made to fix a complaint has to be shown to work, and shown with enough data that a real improvement is not missed and a chance one is not claimed. The [process change trial tool](/tools/process-change-trial/) plans and evaluates exactly this kind of before-and-after comparison. It calculates the sample size per group needed to detect a chosen smallest worthwhile difference at a significance level and power, then runs a Welch two-sample t-test on the results, gives the p-value and a confidence interval for the difference, and states whether the improvement is confirmed, not proven or a change for the worse.

The engineer chose the compound's stabiliser content during the last quarter of each premix container as the measure, since that was where the problem lay. With an expected standard deviation of 0.012 percentage points from the laboratory's records and a smallest worthwhile difference of 0.010, at 5% significance and 80% power, the tool asked for **23 results per group**. The plant collected 24 from bulk bags before the change and 24 from sacks after it.

```figure
type: compare
title: Compound stabiliser during the last quarter of each premix container
rowhead: Measure
cols: Before, 800 kg bulk bags | After, 25 kg sacks
caption: This is an illustration. Evaluated with the process change trial tool: Welch t = −7.91 on 45.6 degrees of freedom, p well below 0.001, and a 95% confidence interval for the difference of −0.030 to −0.018 percentage points. The improvement is confirmed and larger than the 0.010 worth detecting.
- Results | 24 | 24
- Mean stabiliser, % | 0.175 | * 0.199
- Standard deviation, % | 0.011 | 0.010
- Shortfall against the 0.20% target | 0.025 | 0.001
```

The tool reported **improvement confirmed**: a difference of 0.024 percentage points, a 95% confidence interval from 0.018 to 0.030, a p-value far below 0.05, and both the sample size and the practical size of the change passing their checks. Its last check is a reminder of the assumptions: independent, roughly normal results. Successive results from the same bag are not entirely independent, so the plant took the 24 results from twelve containers, two each, rather than 24 from one.

## Why the extruder could not help

The extruder mixes its feed thoroughly, but only over the time material spends inside it, about a minute. Chapter 8 shows that a disturbance much shorter than that is smoothed out and one much longer passes straight through. The premix's drift over 53 hours is about three thousand times longer than the extruder's residence time, so the extruder reproduced it faithfully in the compound, very well mixed at the wrong concentration. Slow drifts must be prevented upstream; no downstream mixer of reasonable size can remove them, because it would have to hold days of production to average them out.

## Other ways to keep the order

The plant's choice of sacks suited its small premix rate. Other plants with the same problem use other fixes.

- **Mass-flow discharge.** A bulk bag discharger with a steep cone, or a bin with a mass-flow hopper, draws a cross-section of every layer, which remixes the radial sorting from filling. It needs a hopper designed from the blend's wall friction and flow properties.
- **Distributed filling.** Filling the container from a rotating spout, or through a cone that spreads the stream, reduces the central heap and so the radial sorting.
- **Re-blending at the point of use.** A small blender between the container and the feeder remixes each portion before it is fed, at the cost of another machine.
- **Reformulation.** Granulating the premix, or using a polypropylene carrier powder closer in size to the stabiliser, removes the size difference that drives sifting.

## Sampling a discharge sequence

A discharge sequence is only seen by sampling the stream at known points through a container's discharge. Plant C's procedure takes a full cross-section of the falling stream at the spout with a sample cup passed through it, at evenly spaced fractions of the container, records the mass discharged at each sample, and analyses every sample. Ten samples through a container are enough to see a trend; the samples must be large enough to sit well above the random-mixture limit of Chapter 2, or the trend will be lost in the scatter.

## Other containers, other sequences

The same reasoning applies to every container a blend passes through.

- **Octabins and bins** filled from a central point and emptied from a central outlet in funnel flow give a rich-first or lean-first sequence depending on which component sifts.
- **Conveyor transfers** deliver a stream whose composition across the belt varies after trajectory segregation at the previous transfer; a sample from one side of the belt is not representative.
- **Refill hoppers on feeders** that are refilled from the bottom of a supply hopper when nearly empty may receive the leanest material all at once.
- **Silos** that hold several blend batches in funnel flow mix the batches unpredictably and may deliver material weeks old.

[Mass flow and funnel flow](/reados/publications/bulk-solids-flow-by-the-numbers/mass-flow-and-funnel-flow/) in the bulk solids book covers the flow patterns themselves; for blends, the rule is that any container that does not discharge in mass flow should be assumed to deliver its contents out of order until sampling shows otherwise.

## The plant's handling review

After the trial, the plant reviewed every route its three blends take from where they are made to where they are used, with the same questions for each container and transfer.

```figure
type: checklist
title: Blend handling review, premix route after the change
caption: This is an illustration. The open item is a residual sequence inside each sack, measured at 19.2% to 20.8% stabiliser from first to last kilogram, small enough that the refill hopper's blending of successive sacks absorbs it.
- x Blend validated where it is made | ribbon blender, 12 minutes, Chapter 3
- x Container size against the next stage's hold-up | 25 kg sack into a 30 kg refill hopper
- x Filling method | short spout, small heap, seconds per sack
- ? Discharge order within each container | small residual sequence remains
- x Blend sampled where it is used | compound stabiliser by container age, plotted monthly
```

The monthly plot of compound stabiliser against the age of the premix container in use is now one of the plant's standard quality charts. It costs nothing, since the laboratory measures every lot anyway, and it would have revealed the bulk bag problem months before the customer did.

## How this applies to a small Australian business

Validate a blend where it is used, not only where it is made, because every container and transfer between the two is a chance for it to change. If a product's quality drifts over hours or days, plot it against the age of the container or bag in use: a pattern that repeats with each container is the signature of filling and discharge segregation. Smaller containers emptied whole, mass-flow discharge or blending at the point of use usually fix it. When you make a change, plan the before-and-after comparison with enough results to tell, and spread the results across several containers.

## Exercise: a half-size bulk bag

The plant considers 400 kg bulk bags instead of sacks, filled and emptied the same way. Suppose the stabiliser profile through a bag has the same shape as in the figure, scaled to the bag. (a) How long does one bag last at 15 kg/h? (b) Would the compound's stabiliser over the last quarter of each bag be any closer to target? (c) What does that say about bag size as a fix?

**Worked answer.** (a) 400 ÷ 15 = **26.7 hours**, half as long. (b) **No.** If the profile has the same shape, the last quarter of a 400 kg bag delivers the same lean premix, averaging about 17.4% stabiliser, and the compound again averages about 0.174% over that quarter; it simply happens twice as often. (c) Halving the container does not help unless the container is small enough for the next stage, here the feeder's refill hopper, to hold and mix a large share of it. A 25 kg sack works because a whole sack goes into the refill hopper at once; a 400 kg bag does not.
