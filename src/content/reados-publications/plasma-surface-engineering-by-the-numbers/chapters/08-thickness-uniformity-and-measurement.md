---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: thickness-uniformity-and-measurement
order: 8
title: "Coating thickness, uniformity and measurement"
description: "Why PVD coating thickness varies with line of sight, rotation, distance and loading, how to measure it with the ball crater test, and how to judge a coating process's capability from witness coupons."
draft: false
---

A specification that says "CrN, 4 µm" describes a coating that does not exist. Every real PVD coating is thicker on the surfaces that face the targets most often and thinner on those that hide behind a neighbour, in a recess or at the bottom of a hole. A sharp edge collects more than a flat, a face that points along the rotation axis collects differently from one that faces outwards, and the parts at the top and bottom of a fixture differ from those in the middle. Whether a 4 µm specification is met depends on where the 4 µm is measured.

This chapter explains why line-of-sight deposition gives uneven thickness and how rotation and loading reduce the unevenness. It describes the ball crater test that the shop uses to measure thickness, works an example, and judges PV-1's CrN process from witness coupons with the KEVOS® process capability tool. It ends with a densely packed load in which the witness coupons said 4 µm and the inserts' working faces said otherwise.

## Line of sight

At PV-1's 0.5 Pa, sputtered atoms travel to the parts in nearly straight lines (Chapter 1). A surface receives coating in proportion to how much of the target it can see and how squarely it faces it. A face turned away from every target receives almost nothing; a face seen at a grazing angle receives little; a face a long way from the target receives less than a near one, roughly in proportion to the inverse square of distance for a small source.

Rotation evens this out. On PV-1's three-fold planetary fixture, the main table turns, each planet turns on it, and each part turns on its planet, so every outward-facing surface sweeps past every target many times during a run. The average thickness around a cylinder then becomes fairly uniform, and the run's thickness depends mainly on the time spent and the target power. What rotation cannot fix is shadowing: a surface hidden behind a neighbouring part, or inside a hole, is hidden on every revolution.

Distance matters as well as angle. A part on the outer edge of the main table passes closer to the targets than one near the centre, and parts at the top and bottom of a tall planet sit beyond the ends of the targets' useful zone. Coaters map these effects once, with coupons at many positions, and then define a loading zone inside which the thickness stays within the process's normal spread; parts loaded outside it are either not accepted or carry their own coupons.

## Holes, recesses and edges

Coating inside a hole falls off quickly with depth, because the walls deep inside can see only a small patch of chamber through the opening. In sputtering at PV-1's pressure, a blind hole one diameter deep typically receives only a fraction of the coating its mouth receives, and the bottom of a deep hole receives almost none. Order 27's cooling holes do not need coating and are plugged, but ejector-pin holes and narrow cavities in other moulds do, and the shop tells customers plainly how deep into a recess a useful thickness can be expected.

Edges have the opposite problem. An edge sees the targets from more directions than a flat face, and the electric field of the bias concentrates there, so edges collect more coating and more ion bombardment. A cutting edge coated too thickly is rounded and can chip, because a thick, highly stressed coating on a sharp edge is fragile; tool coaters therefore prepare cutting edges with a small, controlled hone before coating and keep coatings on cutting tools thinner than on wear parts.

## The ball crater test

The ball crater test, often called the calotest, measures coating thickness on a flat or gently curved surface. A hard steel ball of known radius, coated with a fine diamond paste, is rotated against the surface for a minute or two. It grinds a shallow spherical crater through the coating into the substrate. Seen from above under a microscope, the crater shows as two concentric circles: the outer edge where the ball first cut the coating, and an inner circle where it broke through into the substrate. An interlayer shows as a thin ring between them.

```figure
type: formula
title: Coating thickness from a ball crater
formula: t ≈ (D² − d²) ÷ (8R)
caption: t is the coating thickness, D the outer diameter of the crater at the coating's surface, d the diameter where the crater meets the substrate and R the ball's radius, all in the same units. The formula is the difference between two spherical cap depths and holds when the crater is shallow compared with the ball. On a curved part it needs a correction for the curvature.
- D | outer crater diameter
- d | inner diameter, at the substrate
- R | ball radius
```

On a witness coupon from order 27's run, with a 25 mm ball, R = 12.5 mm, the outer crater measures 0.850 mm and the inner boundary of the CrN 0.568 mm: t = (0.850² − 0.568²) ÷ (8 × 12.5) = 0.0040 mm, 4.0 µm. The chromium interlayer's ring, from 0.568 mm in to 0.540 mm where the crater reaches the steel, gives (0.568² − 0.540²) ÷ 100 = 0.0003 mm, 0.3 µm, as the recipe intended.

The test is quick and cheap, and also reveals adhesion problems: a coating that flakes at the crater's edge is poorly bonded. Its accuracy depends on measuring the two diameters well; an error of 0.01 mm in d changes this result by about 0.1 µm. Other methods include X-ray fluorescence, which is non-destructive and suits production checks once calibrated, and metallographic cross-sections, which also show the coating's structure. Magnetic and eddy current thickness gauges, useful for paint on steel, struggle with a few micrometres of hard nitride on a nitrided steel substrate.

## The case: capability from witness coupons

Every PV-1 run carries five flat witness coupons of hardened steel, mounted at the top, upper middle, middle, lower middle and bottom of one planet, facing outwards like the parts. Each is calotested after the run. Over the first twenty runs of the CrN recipe, the coupons averaged 4.05 µm, and the average range within a run, the difference between the thickest and thinnest of the five, was 0.42 µm. The coating specification is 3 to 5 µm.

The [process capability tool](/tools/process-capability-check/) works out the process standard deviation from the average range and the d₂ constant for the subgroup size, the X̄ and R control limits, the capability indices Cp and Cpk against the specification and the predicted fraction out of tolerance. With an average of 4.05 µm, an average range of 0.42 µm, subgroups of five and limits of 3 and 5 µm:

```figure
type: steps
title: PV-1's CrN thickness capability from witness coupons
caption: This is an illustration. Results from the process capability check tool. The calculation assumes the process is stable, which the X̄ and R chart over the twenty runs supported, and roughly normal.
- Subgroups | five coupons per run, twenty runs
- Average thickness X̄ | 4.05 µm
- Average range R̄ | 0.42 µm
- Process standard deviation, R̄ ÷ 2.326 | 0.181 µm
- X̄ control limits | 3.81 to 4.29 µm
- * Cp / Cpk | 1.85 / 1.75
- Predicted out of tolerance | well under 1 ppm
```

On the coupons, the process is comfortably capable, and the X̄ chart showed no run outside its limits and no drift towards either of them. The question the rest of this chapter answers is whether the coupons represent the parts.

## Run-to-run control

A capable process can still drift. The thickness a run delivers depends on the energy put into the targets, not just the time, and the targets themselves change as they erode: the racetrack groove deepens, the target surface moves closer to the magnets, and the rate at a given power changes. PV-1's controller therefore ends the deposition step on accumulated energy, in kilowatt-hours per target, rather than on time alone, and the shop plots each run's average coupon thickness on an X̄ chart with the limits from the capability study, 3.81 to 4.29 µm. A point outside the limits, or a run of points drifting towards one, is investigated before the next production load: a target near the end of its life, a power supply out of calibration or a change of loading are the usual causes. Each target's life is tracked in kilowatt-hours, so that a change, with its qualification run (Chapter 7), can be planned rather than forced.

## How thick should a coating be?

More coating is not always better. A thicker coating lasts longer against steady abrasive wear, but it carries more internal stress, so it is more likely to crack or flake under impact, at sharp edges or where the substrate flexes. It also adds to the part's dimensions. Order 27's inserts are coated all round, so a 4 µm coating adds 8 µm to their 60 mm diameter, and the toolmaker's fit between insert and die block must allow for it; the toolmaker grinds the inserts to a size reduced by the coating allowance before sending them. For close-fitting sliding parts such as ejector pins, the allowance is part of the drawing.

The usual ranges reflect these trade-offs: about 1 to 4 µm on cutting tools, where edge sharpness and toughness matter, and 3 to 8 µm on forming and moulding tools and wear parts, where steady wear dominates. Duplex treatments like order 27's let a moderate coating thickness do a heavy job, because the hard nitrided layer underneath supports the coating and stops it from being pushed into a softer substrate under load, the eggshell effect that cracks a hard thin coating on a soft base.

## Fixturing and masking

Every part touches the fixture somewhere, and the point of contact stays uncoated. The shop chooses contact points on non-functional surfaces: for order 27's inserts, the back face that sits against the die block, held on a spigot fixture that also masks the cooling-hole plug. Threads, bearing seats and close-fitting bores that must not be coated are masked with caps, plugs or clips that shadow them completely, since a partial shadow leaves a thin, ragged coating edge that can flake. The job card shows each part's fixture and masking with a photograph, so that a repeat order is fixtured identically and gives the same thickness pattern.

## When it goes wrong: what the coupons could not see

The second batch of order 27 was loaded more densely than the first: two inserts per planet spindle position instead of one, to fit the batch into a single run. The witness coupons read 3.9 to 4.2 µm, inside specification. Three months later the toolmaker reported soldering on several cores after about half the expected number of shots, in a band along the side of each core.

Why did the toolmaker's report point so quickly at thickness? Because soldering began in a band rather than at random spots, and a band along one side of every core means a cause that is the same for every core: something geometric in the coating run, not a defect in an individual part. The shop's engineer drew the loading pattern, marked which face of each insert had faced its neighbour, and found it matched the failed band on every returned core. Only then were the spare inserts coated and measured to confirm it.

The shop coated two spare inserts in a run loaded the same way and calotested them at five positions along the working face that had failed, which in the dense loading had faced the neighbouring insert for part of each rotation. The results were very different from the coupons'.

```figure
type: compare
title: Witness coupons against the inserts' working faces in the dense loading
cols: Average | Average range of five readings | Cpk against 3–5 µm | Verdict
rowhead: Measured on
- Witness coupons on an open planet position | 4.05 µm | 0.42 µm | 1.75 | Capable
- * Working face of densely loaded inserts | 3.55 µm | 0.70 µm | 0.61 | Not capable
caption: This is an illustration. Both lines from the process capability check tool with subgroups of five; the insert figures come from the spare inserts coated in the repeat run, with the same loading as the failed batch.
```

The inserts' working faces averaged only 3.55 µm, with much more spread, because each insert shadowed its neighbour; the tool gives a Cpk of 0.61 and predicts about 3.4% of readings below 3 µm. The thinnest readings, around 2.6 µm, were on the band that had failed. The coupons, on an open position, never saw the shadowing.

The shop made three changes. The loading for order 27 went back to one insert per position, with a written loading pattern and a photograph on the job card. A sacrificial insert, or a coupon mounted in the same shadowing geometry as the parts, now runs in each new loading pattern until its thickness is proven. And the coating certificate states where the thickness was measured. The toolmaker's failed cores were stripped and recoated at the shop's cost.

## Exercise: a ball crater on a punch

A crater ground with a 30 mm ball (R = 15 mm) on a TiAlN-coated punch measures 0.92 mm across at the coating surface and 0.70 mm where it reaches the substrate.

1. What is the coating thickness?
2. The specification is 3 ± 0.5 µm. Does the punch comply?
3. If the inner diameter were misread by 0.01 mm, how much would the result change?

**Answer.**

1. t = (0.92² − 0.70²) ÷ (8 × 15) = (0.8464 − 0.49) ÷ 120 = 0.00297 mm, about 2.97 µm.
2. Yes, at 2.97 µm it is inside 2.5 to 3.5 µm.
3. With d = 0.71 mm, t = (0.8464 − 0.5041) ÷ 120 = 2.85 µm; with d = 0.69 mm, 3.09 µm. A misreading of 0.01 mm changes the result by about 0.12 µm, a quarter of the tolerance's half-width, which is why the shop measures each crater in two directions and averages them, and checks its microscope's scale against a stage micrometer.
