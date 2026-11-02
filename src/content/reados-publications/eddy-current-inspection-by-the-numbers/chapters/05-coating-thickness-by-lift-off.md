---
book: eddy-current-inspection-by-the-numbers
chapterSlug: coating-thickness-by-lift-off
order: 5
title: "Coating thickness by lift-off"
description: "Measuring anodising on aluminium as lift-off, why coating thickness is not dimensional growth, calibrating with foils, a wrong zero that drove the process off target, and tolerance intervals."
draft: false
---

A non-conductive coating on a metal is, to an eddy-current probe, simply a gap. The thicker the coating, the further the coil sits from the metal and the weaker the eddy currents it induces. Chapter 1 showed lift-off as a nuisance to be suppressed when measuring conductivity. Here it becomes the measurement: a coating gauge holds the substrate's conductivity constant by calibration and reads the lift-off as thickness, to a fraction of a micrometre, without harming the coating.

This chapter applies the method to the PH-6 housings' anodising. It shows how anodising grows, why the gauge's reading is not the change in a part's dimensions, how the gauge is calibrated and checked, and how a wrong zero quietly moved a whole process off target. It finishes with the statistics that turn thirty readings into a statement about every housing in the batch.

## The method and its neighbours

Three related methods measure coatings with a probe, and they suit different combinations of coating and substrate.

```figure
type: compare
title: Probe methods for coating thickness
cols: Coating | Substrate | Principle | Standard
rowhead: Method
- * Amplitude-sensitive eddy current | Non-conductive: anodising, paint, powder coat | Non-magnetic conductive metal: aluminium, copper alloys, austenitic stainless | Lift-off changes the eddy-current signal | ISO 2360
- Magnetic induction | Non-magnetic: paint, zinc, chromium | Magnetic steel | Coating changes the magnetic flux to the substrate | ISO 2178
- Phase-sensitive eddy current | Non-magnetic metallic coatings | Metallic or non-metallic substrates | Coating's own conductivity changes the signal's phase | ISO 21968
caption: Standards named by number and scope only. A gauge must be used with the method its probe is designed for; a magnetic-induction probe reads nothing useful on aluminium.
```

The housings' sulfuric acid anodising is a non-conductive aluminium oxide on a non-magnetic conductive substrate, the classic case for the amplitude-sensitive method of ISO 2360.

## How anodising grows

Anodising does not lay a coating on the surface the way paint does. It converts the aluminium surface into oxide, so the coating grows partly into the metal and partly out from the original surface. The KEVOS® [anodising time tool](/tools/anodizing-time/) and anodising plan tool use the common rule of thumb for sulfuric acid anodising that a third of the thickness is build-up above the original surface and two-thirds is penetration into it, and the "720 rule" for the growth rate: in the tools' metric form, a growth of about 0.328 µm per minute for each A/dm² of current density, at the efficiency factor entered.

```figure
type: steps
title: The housing anodising in the anodizing time tool
caption: This is an illustration. 1.5 A/dm², 20 µm target, efficiency factor 100%, rack area 57.6 dm² (24 housings of 2.4 dm²).
- Growth rate | 0.492 µm/min
- Time to 20 µm | 40.7 min
- Build-up per surface | 6.7 µm, a third of the thickness
- * Diameter change | 13.3 µm across both sides: an outside diameter grows, a bore shrinks
- Rectifier current | 86 A
```

The gauge sits on the coating's outer surface and senses the metal beneath, so it reads the full 20 µm of oxide. The part's dimensions change by only the build-up, 6.7 µm per surface. A bore machined at 22.000 mm comes out of anodising at about 22.000 − 0.013 = 21.987 mm, not 22.000 − 0.040. Machinists who confuse the two make bores 27 µm too large. The pump maker's drawings therefore state the coating thickness for the gauge and, separately, the machined size before anodising for the critical bores, with the build-up allowance already applied.

The [anodising plan tool](/tools/anodizing-plan/) extends the same calculation to the whole batch. For 480 housings, 24 to a load, at 16 V across the bath, it gives 86 A per load against a 100 A rectifier, 1.38 kW of heat into the bath against 2 kW of cooling, 20 loads and 18.6 line hours with 15 minutes of handling per load, 18.7 kWh of energy and A$3.30 a housing at A$0.28 a kilowatt-hour and A$85 an hour of line time, excluding GST: PLAN FEASIBLE. Its check, like the time tool's, is a reminder to measure the coating and adjust the efficiency factor, because the 720 rule is a rule of thumb, and the gauge is how the line learns its real efficiency.

## Calibrating the gauge

An amplitude-sensitive gauge must be zeroed on the bare substrate and adjusted with foils of known thickness, because the signal for a given gap depends on the substrate's conductivity, its shape and its thickness. The pump maker zeroes on an uncoated area of the same alloy, a masked spot on each housing or an uncoated witness coupon of the same 6061-T6 bar, and checks with certified plastic foils laid on the bare metal.

At the gauge's annual check, five foils spanning the range were read on a 6061-T6 coupon, and the [instrument calibration check tool](/tools/instrument-calibration-check/) compared each reading with its certified value against an accuracy class of 1% of the 0 to 100 µm span.

```figure
type: compare
title: The coating gauge at five points in the instrument calibration check tool
cols: Reference | Reading | Error | Error as % of span
rowhead: Point
- Zero, bare 6061-T6 | 0.0 µm | 0.2 µm | +0.2 | 0.2%
- Foil 1 | 10.2 µm | 10.5 µm | +0.3 | 0.3%
- Foil 2 | 24.8 µm | 25.3 µm | +0.5 | 0.5%
- Foil 3 | 50.1 µm | 50.6 µm | +0.5 | 0.5%
- Foil 4 | 99.6 µm | 99.9 µm | +0.3 | 0.3%
caption: This is an illustration. Worst error 0.5% of span at point 3, against the 1% class: WITHIN ACCURACY CLASS. A service reading of 20.0 µm corrects to 19.57 µm by interpolation between the two bracketing points.
```

The gauge reads slightly high across its range. The tool interpolates a correction for any reading; a reading of 20.0 µm corresponds to a true 19.57 µm. The pump maker records the correction but does not apply it to routine readings, because 0.43 µm is small against the 10 µm tolerance band; it is included in the budget instead, and the gauge's own adjustment routine is run if the worst error exceeds half the class.

Foils have their own limits. A plastic foil pressed under a probe compresses slightly, and a foil on a curved surface does not lie flat, so foils on flat coupons calibrate the gauge for flat surfaces. For the housings' 22 mm bore, the gauge uses a small probe zeroed and checked on a bare bore of the same diameter.

### The referee method

The gauge is an indirect method; the referee for coating thickness is a microsection. A coated coupon is cut, mounted, polished and measured under a microscope, the method of ISO 1463 for metal and oxide coatings. The pump maker keeps a 6061-T6 coupon anodised with each month's first load, has it sectioned at a laboratory and compares the gauge's reading on the coupon with the section. Sectioning destroys the coupon and takes a few days, so it is used to check the gauge, not to replace it. The same discipline applies to the pump maker's other coating gauge, a magnetic-induction gauge for the zinc-plated steel cover bolts: it is zeroed on bare bolt steel, checked with foils and cross-checked against sectioned bolts, because its readings depend on the steel's magnetic properties just as the eddy-current gauge's depend on the aluminium's conductivity. That monthly check on the anodised coupon found the mistake below.

## The mistake: a wrong zero that moved the process

For two months, the housings' anodising readings averaged about 22 µm, against a 20 µm target. The anodising supervisor, seeing the batches running thick, shortened the time from 40.7 to 37.0 minutes, scaling it by 20 ÷ 22.0, and the readings came back to about 20 µm. Everyone was satisfied until the monthly coupon came back from the laboratory with a sectioned thickness of 20.0 µm and a gauge reading of 22.6 µm: the gauge read 2.6 µm high.

The cause was the zero. When the anodising line moved, the gauge's zero had been set on a convenient uncoated offcut kept at the new workstation, which turned out to be a free-machining alloy used for fixtures, with a different conductivity from 6061-T6. Zeroed on that metal, the gauge read every 6061-T6 housing about 2.6 µm thick.

```figure
type: steps
title: How the wrong zero moved the process
caption: This is an illustration. Gauge offset +2.6 µm; true batch mean before the time change 19.4 µm, standard deviation 1.3 µm.
- Gauge zeroed on a fixture-alloy offcut | Every reading 2.6 µm high
- Batches read about 22.0 µm against a 20 µm target | True mean still 19.4 µm
- Time cut from 40.7 to 37.0 min to bring readings to 20 | True mean fell to about 17.6 µm
- * Monthly coupon | Section 20.0 µm, gauge 22.6 µm: offset found
- Correction | Zero reset on the 6061-T6 witness coupon; time restored to 40.7 min; batches since the change re-measured
- Prevention | Zero coupon engraved with its alloy and bar number, kept with the gauge; foil check on that coupon before each batch
```

The re-measured batches made since the time change had a true mean of about 17.6 µm with a standard deviation of 1.3 µm. All their individual readings were above 15 µm, but the statistics showed the risk. The [normal tolerance interval check tool](/tools/normal-tolerance-interval-check/) found, from 30 readings, that 95% of housings lie between 14.29 and 20.91 µm with 95% confidence: TOLERANCE INTERVAL OUTSIDE SPEC. The process had been running close enough to the 15 µm limit that some housings in a large batch could be expected below it. The affected batches were sorted housing by housing, with three readings on each, and four housings below 15.0 µm were stripped and re-anodised.

The error was in no single reading. Every reading was repeatable; the gauge was simply measuring from the wrong zero, and a well-meant process adjustment turned a measurement offset into a real thinning of the coating. Only an independent reference, the sectioned coupon, could reveal it.

## Where to measure

Coating thickness is not uniform over a part. Anodising current crowds onto edges and outer corners and is starved in recesses and deep bores, so coatings run thicker at edges and thinner inside, for the same reasons [Electroplating by the Numbers](/reados/publications/electroplating-by-the-numbers/) sets out for plated deposits. A single reading on a flat face says little about the bore. The pump maker's first-article plan for each new housing design measures five locations: the two large flat faces, the mounting flange, the entry of the main bore and the bottom of the deepest pocket. Production checks then use the two locations that ran thickest and thinnest on the first article, so that every batch is checked at both extremes.

The gauge has edge effects of its own. Its small probe needs a few millimetres of flat coating around it, and readings within that distance of an edge or a hole read wrongly, usually high, because part of the eddy-current field is lost and the gauge interprets the weaker signal as a thicker coating. The least edge distance for the probe is found the same way as for the conductivity meter in Chapter 4, by stepping in from an edge on a coated coupon, and it is marked on the measurement plan.

## Sealing, dyeing and paint

After anodising, the housings are sealed in hot water, which closes the pores of the oxide. Sealing changes the coating's thickness very little, but it is the finished, sealed coating the customer specifies, so measurements are made after sealing. Dyed coatings measure the same way, since the dye sits in the pores of a non-conductive oxide.

Some customers order housings painted over the anodising. The gauge then reads the total non-conductive layer, oxide plus paint, because it cannot tell one insulator from another. Paint thickness is found by measuring the same marked points before and after painting and subtracting, or by painting a witness coupon whose anodising was measured first. A single reading on the finished part cannot separate the two layers.

## The gauge's uncertainty in brief

The coating gauge's budget is built the same way as the conductivity meter's in Chapter 4. Its sources are the foils' certified thickness, the gauge's repeatability on a coated coupon, about 0.3 µm as a standard deviation, the residual calibration error of up to 0.5 µm, and the zero, which the mistake above showed can be the largest of all when it is set on the wrong metal. With a correct zero, the expanded uncertainty of a single reading is about 1 µm, a tenth of the 10 µm tolerance band, which is adequate for a batch decision and for sorting.

## From thirty readings to the whole batch

With the zero corrected and the time restored, the next batch's 30 readings, one on each of 30 housings chosen across the loads, had a mean of 19.4 µm and a standard deviation of 1.3 µm. The tolerance interval tool gave a two-sided factor k = 2.5496 for 30 readings, 95% coverage and 95% confidence, and limits of 19.4 ± 2.5496 × 1.3 = 16.09 to 22.71 µm, inside the 15 to 25 µm specification: TOLERANCE INTERVAL WITHIN SPEC. In words: with 95% confidence, at least 95% of the housings in the batch have coatings between 16.09 and 22.71 µm.

A tolerance interval answers the question the customer actually asks, which is about the parts, not the average. The mean alone, 19.4 µm, says nothing about how many housings are near a limit, and the sample's range says only what the 30 measured housings were. The tool's check reminds the user that the factor assumes normally distributed readings; the pump maker plots each batch's readings on a normal probability plot before relying on the interval.

## Exercise: a thinner coating

A customer asks for a version of the housing with an 18 µm coating at a lower current density of 1.2 A/dm². Using the anodising time tool, find the growth rate, the time, the build-up per surface and the change in a bore's diameter. What will the coating gauge read on a correctly anodised housing, and what machined size should a 22.000 mm finished bore have before anodising?

### Answer

The anodising time tool gives a growth rate of 0.393 µm/min, a time of 45.8 minutes to reach 18 µm, a build-up of 6.0 µm per surface and a diameter change of 12.0 µm across both sides.

A correctly zeroed gauge will read the full coating, 18 µm, because it senses the metal beneath the oxide. The bore shrinks by twice the build-up, 12.0 µm, so to finish at 22.000 mm it should be machined to 22.012 mm before anodising. Using the coating thickness instead of the build-up would give 22.036 mm, 24 µm too large. Because the gauge and the bore gauge measure different things, the inspection record for the new version shows both: the coating reading from the eddy-current gauge and the finished bore diameter measured after sealing.
