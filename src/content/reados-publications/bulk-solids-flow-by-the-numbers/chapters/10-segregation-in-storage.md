---
book: bulk-solids-flow-by-the-numbers
chapterSlug: segregation-in-storage
order: 10
title: "Segregation in storage"
description: "How bins and silos sort particles by size during filling and discharge, how the flow pattern decides what comes out when, and how to measure segregation and tell it apart from attrition."
draft: false
---

Particles of different sizes do not stay mixed when they are moved. They separate as they are poured into a heap, as they slide down a slope, as they are blown into a silo and as they are vibrated. A bin or silo does all of these things, so it is one of the most effective sorting machines in a plant. Whether the sorting matters depends on what comes out of the outlet, and that depends on the flow pattern of Chapter 6.

This chapter describes the main segregation mechanisms, shows how filling and discharge combine in a funnel-flow silo, and works through the fines that turned up at Plant C's extruder after every pellet delivery. The error in this chapter is a diagnosis that blamed segregation for a problem that was partly made somewhere else. Mixing and blending, and segregation of blends, are a large subject of their own, covered in [Blending Bulk Solids by the Numbers](/reados/publications/blending-bulk-solids-by-the-numbers/); this chapter deals only with what storage does.

## How particles separate

Williams's review of segregation, listed in the references, groups the mechanisms in a way that has stood up well. Four matter most in bins and silos.

1. **Sifting, or percolation.** Small particles fall through the gaps between larger ones whenever the bed moves. It needs a size difference, a moving bed and particles free enough to move individually, so it is strongest in free-flowing mixtures of different sizes.
2. **Rolling and trajectory.** On a heap, large and round particles roll further down the slope than small or angular ones, and in a falling stream, particles with different drag fly different distances. Both send coarse particles to the outside of a heap.
3. **Air entrainment and elutriation.** When a material is blown or dropped through air, fine particles are carried by the air and settle where it slows down, often against the walls, in corners or in the vent filter. Very fine dust leaves with the air entirely.
4. **Fluidisation.** When a powder is aerated, coarse and dense particles sink and fine light ones rise, leaving a fine layer on top.

Plant C's two materials show the range. S1's pellets are nearly uniform in size, so sifting among the pellets themselves is weak; the trouble is the small fraction of fines, dust and stringy plastic streamers that arrive with them, which sift and elutriate readily. B2's filler is too cohesive for its particles to move individually, so it hardly segregates by size at all, a rare advantage of a cohesive powder.

```figure
type: compare
title: Segregation mechanisms in Plant C's stores
rowhead: Mechanism
cols: Where it acts | S1 pellets with fines | B2 filler
caption: This is an illustration. Segregation needs particles that can move independently, so the free-flowing pellets with their fines are far more prone to it than the cohesive filler.
- Sifting | moving beds, heaps, the flow channel | * strong: fines fall through pellets | weak: particles stick together
- Rolling and trajectory | heap slopes, falling streams | moderate | weak
- Air entrainment | pneumatic filling, free fall | * strong: fines settle near the walls | possible when bags are emptied
- Fluidisation | aerated fine powders | not applicable | possible after aeration
```

## Filling S1

S1 is filled pneumatically: pellets arrive in a stream of conveying air through the central roof inlet. The coarse pellets drop out of the air near the centre and build the central heap of Chapter 3. As each layer slides down the heap, fines sift down through the moving surface and stay near the centre, under the pouring point. At the same time, the conveying air spreads out across the silo and slows, dropping the finest dust and light streamers near the walls or carrying them to the vent filter on the roof.

After a delivery, S1 therefore holds a fines-rich column down its centre, a band of light dust and streamers against the walls near the top of each delivery's layer, and relatively clean pellets in between. The pattern repeats with each delivery.

## Discharging S1

What comes out depends on the flow pattern. In mass flow, the whole contents move down together and the material converging in the hopper draws from the centre and the walls at once, so the outlet receives a cross-section of each layer. Segregation across the silo is largely remixed. In funnel flow, which Chapter 6 showed is what S1 actually does, the flow channel draws first from the centre and from the top surface, where material slides into the crater. The fines-rich centre and the top of the newest delivery come out first, and the material against the walls comes out last.

That is what the plant saw at the extruder. Samples taken at the extruder's hopper every half hour after a delivery showed fines, defined as material passing a 2 mm sieve, rising from a baseline of about 0.05% to a peak of about 0.6% within the first 3 t drawn, then falling back over the next 10 t. This is an illustration.

```figure
type: line
title: Fines at the extruder after a delivery to S1
x: Pellets drawn from S1 after the delivery, t
y: Fines passing 2 mm, % by mass
ymin: 0
ymax: 0.8
caption: This is an illustration. Each point is the average of two samples from the extruder hopper. The spike is the fines-rich centre of the newest delivery reaching the outlet first through S1's funnel-flow channel.
- 0 | 0.05
- 1 | 0.31
- 2 | 0.55
- 3 | 0.60
- 5 | 0.42
- 8 | 0.21
- 13 | 0.08
- 20 | 0.06
```

At 0.6% fines the extruder's feed throat bridged occasionally and the screw's output became uneven, giving surges of melt pressure and variation in the filler content. The plant's first conclusion was the obvious one: S1 segregates, and the deliveries carry too many fines.

## The error: blaming segregation for everything

This is an illustration. The plant asked the pellet supplier to cut the fines in its deliveries and fitted a dedusting unit at S1's inlet, which strips fines and dust from the pellets with an air wash as they enter. The fines peaks after deliveries became smaller. The baseline fines at the extruder did not fall at all, and streamers, long thin strands of polypropylene, still turned up in the extruder's feed.

The engineer then sampled at three points in the same hour: the tanker's discharge, S1's outlet below the rotary valve and the extruder's hopper at the end of the 85 m pneumatic conveying line. To decide how many samples were needed at each point, the engineer used the [sample size for a mean tool](/tools/sample-size-mean/), which gives the minimum number of measurements to estimate a mean within a chosen margin at a confidence level from an expected standard deviation. With a standard deviation between repeat samples of 0.04 percentage points, from the plant's earlier results, and a margin of ±0.02 percentage points at 95% confidence, it gave **16** samples at each point; with a margin of ±0.03 it gave 7. The engineer took 16.

```figure
type: compare
title: Fines and streamers along the pellet route, steady running between deliveries
rowhead: Sampling point
cols: Fines passing 2 mm, mean of 16 | Streamers per kilogram
caption: This is an illustration. Margins about ±0.02 percentage points at 95% confidence. Fines more than doubled between S1's outlet and the extruder: the conveying line, not segregation, was making them.
- Tanker discharge, after the deduster | 0.02% | 0
- S1 outlet, below the rotary valve | 0.03% | 0
- * Extruder hopper, after 85 m of conveying | 0.07% | 3 to 5
```

Between deliveries, fines more than doubled between S1's outlet and the extruder, and the streamers appeared only at the extruder. They were being made in the conveying line. Polypropylene pellets conveyed at high velocity through smooth, long-radius bends slide along the outside of each bend and melt a thin skin by friction, which peels off as streamers and dust. The line had been run at a higher air velocity than its design since a blower was replaced.

The fixes were in the conveying system: the blower's speed was reduced to bring the pick-up velocity back to the conveying supplier's recommended value, and two bends were replaced with bends designed to reduce pellet sliding. The deduster stayed, because it cut the post-delivery peaks. The baseline fines at the extruder fell to about 0.03%. The lesson was to measure at every stage before deciding where a problem comes from: storage segregation was real, but it was only part of the story.

## Side-to-side segregation

Not all segregation is centre-to-wall. A silo filled off-centre, from a single inlet near one side or from a chute that throws material against the far wall, builds a heap whose peak is off the axis. Fines collect under the peak and coarse particles run down the long slope to the opposite wall. If the silo then discharges in funnel flow, the flow channel draws more from one side than the other, and the outlet receives a stream whose composition drifts as the channel wanders. The same off-centre filling also loads the wall unevenly, which is a structural concern in its own right, as Chapter 5 noted for eccentric discharge.

S1's inlet is on its axis, so its segregation is symmetrical. B2 is filled from a bag discharger whose spout is offset 250 mm from the axis to clear the level sensor, so its heap is off-centre too. Because the filler is cohesive, it hardly segregates, and the offset matters only for the level reading; with a free-flowing blend it would matter a great deal.

## Measuring a material's tendency to segregate

Whether a material will segregate badly can be tested before it is stored. Standard practices published by ASTM International describe two common laboratory tests: one for sifting segregation, in which a sample is repeatedly poured into a small heap and samples are taken from the first and last material discharged, and one for fluidisation segregation, in which an aerated column of powder is allowed to settle and its top and bottom are compared (ASTM D6940 and D6941, named here by number and scope only). The tests rank materials and show which mechanism a material is prone to. They do not predict the composition at a particular silo's outlet, which depends on the filling and the flow pattern.

For an existing silo, the most useful measurement is the one Plant C made: samples at the outlet at known intervals of discharged mass, analysed for the property that matters, size, fines or composition, and plotted against the mass drawn. A flat line means segregation does not matter at the outlet, whatever is happening inside. A spike or a drift shows where the problem is and how much material it affects.

## How much the user feels

Whether a segregated stream causes trouble also depends on what receives it. The extruder's feed hopper holds about 60 kg, about three and a half minutes of polypropylene at 1,035 kg/h, and the material in it is partly mixed as it is drawn down. A short spike of fines lasting a few minutes is therefore softened before it reaches the screw, while the plant's 3 t fines peak lasted almost three hours at the extruder's rate and passed through largely intact. As a rule, a disturbance much shorter than the residence time in the next vessel is smoothed out; one much longer passes straight through. [Feeders and back-mixing](/reados/publications/blending-bulk-solids-by-the-numbers/feeders-and-back-mixing/) in the blending book works that smoothing through in detail.

## Dust that leaves with the air

The finest particles in a pneumatically filled silo do not settle at all. They leave with the conveying air through the vent filter on the roof, which must be able to pass the full air flow of the tanker's blower without letting the silo pressurise. A blocked or undersized vent filter is a known cause of silos bulging or splitting during filling, and the dust it collects is combustible for many materials, polypropylene included. The filter's condition is therefore a safety item as well as a dust item, and Chapter 11 includes it in S1's inspection plan.

## Reducing segregation in storage

Where segregation in a bin or silo does matter, the options fall into three groups.

- **Change the material.** Narrow the size range, remove fines before storage, or, for a blend, make the components closer in size and density. Segregation needs a difference to act on.
- **Change the filling.** A distributor or a cone-shaped deflector under the inlet spreads the stream so that it does not build a single central heap; filling through several inlets, or a ladder chute that lets material slide down gently, reduces the drop and the heap. Reducing the air velocity in pneumatic filling reduces elutriation.
- **Change the discharge.** Mass flow remixes across the bin and is the most reliable single measure. Inserts that draw from the centre and the walls together can do the same in an existing hopper. In funnel flow, emptying the silo completely between deliveries prevents layers from building up but does not prevent the first-out material from being fines-rich.

```figure
type: checklist
title: S1 segregation and fines actions
caption: This is an illustration. The open item would make S1's discharge independent of where the fines settle; the plant is weighing its cost against the improvement already achieved.
- x Fines measured at each stage of the route | tanker, S1 outlet, extruder
- x Deduster at S1's inlet | post-delivery peak reduced
- x Conveying velocity restored | streamers and baseline fines cut
- x Silo cycled to the cone monthly | wall material refreshed
- ? Mass-flow insert or new cone for S1 | would remix centre and wall material
```

## How this applies to a small Australian business

If a product changes quality as a bin empties, or after each delivery, suspect segregation and look at the flow pattern. But before buying a fix, sample at several points along the material's route, enough samples to see a real difference, and find out where the change happens. Fines and dust can be made by handling, conveying and feeders as well as sorted by bins, and the right fix depends on which.

## Exercise: the fines peak

From the line chart above, estimate roughly how much fines left S1 in the first 13 t drawn after a delivery, above the 0.05% baseline. Treat the curve as straight lines between the points.

**Worked answer.** Using trapezoids on the excess over 0.05%: from 0 to 1 t, average excess (0 + 0.26) ÷ 2 = 0.13%, over 1 t: 1.3 kg. From 1 to 2 t, (0.26 + 0.50) ÷ 2 = 0.38%: 3.8 kg. From 2 to 3 t, (0.50 + 0.55) ÷ 2 = 0.525%: 5.25 kg. From 3 to 5 t, (0.55 + 0.37) ÷ 2 = 0.46% over 2 t: 9.2 kg. From 5 to 8 t, (0.37 + 0.16) ÷ 2 = 0.265% over 3 t: 7.95 kg. From 8 to 13 t, (0.16 + 0.03) ÷ 2 = 0.095% over 5 t: 4.75 kg. The total is about **32 kg** of excess fines, which matches the order of the fines a 27 t delivery at about 0.1% would carry.
