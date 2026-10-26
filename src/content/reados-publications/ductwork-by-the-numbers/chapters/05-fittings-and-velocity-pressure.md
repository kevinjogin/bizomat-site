---
book: ductwork-by-the-numbers
chapterSlug: fittings-and-velocity-pressure
order: 5
title: "Fittings and velocity pressure"
description: "Express hood, elbow, junction, transition and exit losses as multiples of velocity pressure, compare elbow types, total a path's fittings, and catch single-mitre elbows that added 410 Pa."
draft: false
---

Straight duct loses pressure steadily; fittings lose it in lumps. Every hood the air enters, every elbow it turns, every junction where it merges and every exit where it leaves costs a pressure that depends on the fitting's shape and on how fast the air is moving through it. In a short, branched extraction system, the fittings often cost more than all the straight duct together, and the choice of fitting, a smooth elbow or a sharp one, an angled entry or a square tee, is where much of the fan's pressure is won or lost.

This chapter expresses fitting losses as multiples of the velocity pressure, sets out the fittings in EX-1, compares elbow types, and totals the fittings on B1's index path. The running case finds that the elbows supplied for B1's run were single mitres rather than the five-piece elbows the calculation assumed, adding about 410 Pa to the fan's duty.

## Velocity pressure

The **velocity pressure** of moving air is the pressure equivalent of its kinetic energy, ρv² ÷ 2, met in Chapter 4. At 1.2 kg/m³ it is 0.6 × v² pascals. EX-1's sections run at:

- 140 mm, 19.49 m/s: **227.9 Pa**;
- 200 mm, 19.10 m/s: **218.9 Pa**;
- 250 mm, 18.33 m/s: **201.7 Pa**.

Velocity pressure is what a pitot tube measures, as Chapter 10 shows, and it is the natural unit for fitting losses, because the loss of a fitting of a given shape is very nearly a fixed multiple of the velocity pressure of the air passing through it.

## Static, velocity and total pressure

Three pressures describe the air at any point in a duct. The **static pressure** is the pressure the air exerts on the duct wall, measured at a hole in the side; in a suction duct it is below atmospheric, a negative number. The **velocity pressure** is ρv² ÷ 2, always positive. The **total pressure** is their sum. Losses in friction and fittings are losses of total pressure; the fan's job is to raise the air's total pressure by the amount the system loses.

The distinction matters where velocity changes. When air speeds up into a smaller duct, some static pressure is converted into velocity pressure, and the static pressure falls even if nothing is lost; when it slows down in a larger duct, some is converted back, a **static regain**. A designer who adds only losses must work in total pressure throughout, and this book's running case does that, in a simplified form, by adding the losses along each path and the velocity pressure that the hood must create and the stack exit throws away. The fan's total pressure rise then equals the sum.

## Loss coefficients

A fitting's loss is written as **Δp = K × velocity pressure**, where K is the fitting's **loss coefficient**. K depends on the fitting's shape: for an elbow, its angle and the ratio of its centreline radius to its diameter; for a junction, its entry angle and the ratio of branch to main flow; for a transition, its taper angle and area ratio. It hardly depends on the velocity, which is what makes it useful.

K values come from the fitting's manufacturer, from tests, or from a recognised design reference that tabulates them for standard shapes. This book does not reproduce those tables. The K values below are **illustrations**, chosen to be plausible for the shapes described, and a real design should use values from a proper source for the actual fittings.

```figure
type: formula
title: Loss through a fitting
formula: Δp = K × ρ × v² ÷ 2
caption: This is an illustration for one 90° five-piece elbow in EX-1's 140 mm duct, with an illustrative K of 0.3.
- K | Loss coefficient of the fitting, from its data
- ρ × v² ÷ 2 | Velocity pressure at the fitting, using the velocity the K value is referred to
step: Velocity pressure at 19.49 m/s = 0.6 × 19.49² = 227.9 Pa
step: Elbow loss = 0.3 × 227.9 = 68.4 Pa
```

The velocity pressure must be the one the K value refers to. For a fitting between two sizes, such as a transition or a junction, the data says whether K applies to the upstream, downstream or branch velocity, and using the wrong one is a common error.

## EX-1's fittings

This is an illustration, with K values as stated:

- **Hood entry**: air accelerates from rest into the duct, which costs one velocity pressure, and the hood's shape adds a loss of K = 0.5. The suction needed just inside the hood is therefore (1 + 0.5) × 227.9 = **342 Pa**.
- **Elbows**: 90° five-piece elbows with a centreline radius of 1.5 diameters, K = 0.3 each.
- **Branch entries**: B2 and B3 enter the main at 45°, K = 0.25 on the branch's velocity pressure.
- **Straight-through flow at junctions**: small, and neglected in this illustration.
- **Mezzanine crossing transitions**: two, K = 0.15 each on the rectangle's velocity pressure, as Chapter 2 estimated.
- **Stack exit**: air leaving the stack carries its velocity pressure away, a loss of one velocity pressure, **202 Pa**.

```figure
type: compare
title: Fitting losses on B1's index path
cols: K | Velocity pressure | Loss
caption: This is an illustration with illustrative K values. The hood and the stack exit together are more than half of the fittings' total.
- Hood entry, including acceleration | 1.5 | 227.9 Pa | 342 Pa
- Two elbows, B1 to N2 | 2 × 0.3 | 227.9 Pa | 137 Pa
- Two elbows, N3 to fan | 2 × 0.3 | 201.7 Pa | 121 Pa
- Mezzanine transitions | 2 × 0.15 | 197.5 Pa | 59 Pa
- *Stack exit | 1.0 | 201.7 Pa | 202 Pa
```

B1's path carries about **861 Pa** of fitting losses, against the 555 Pa of straight-duct friction that Chapter 4 found. The fittings are the larger share, as is usual in a compact system.

## Elbows

An elbow's loss depends mostly on how sharply it turns. A single mitre, two straight pieces joined at 45° each to make 90°, turns the air abruptly and loses heavily; an elbow made of more, shorter segments, or a smooth pressed elbow with a generous radius, turns it gradually and loses much less.

```figure
type: bars
title: Loss in one 90° elbow in 140 mm duct at 19.49 m/s, by type
unit: Pa
max: 300
caption: This is an illustration with illustrative K values: 1.2 for a single mitre, 0.45 for three pieces, 0.3 for five pieces at 1.5 D radius, 0.2 for a smooth elbow at 2.5 D. Real values come from the fitting's data.
- Single mitre, K 1.2 | 273.5
- Three-piece, K 0.45 | 102.5
- *Five-piece at 1.5 D, K 0.3 | 68.4
- Smooth at 2.5 D, K 0.2 | 45.6
```

In an extraction system the elbow's shape matters for wear as well as loss. Abrasive dust is flung against the outer wall of every turn, and a sharp turn concentrates that wear on a small area. Generous radii, and heavier gauge or replaceable wear backs on the outer wall of elbows, are common in dust systems for that reason.

## The error: single-mitre elbows

This is an illustration. The fabricator who supplied EX-1's ducts made the two elbows on B1's run from 140 mm duct as single mitres, which are quick to make, rather than the five-piece elbows the drawing called for, because the drawing's elbow note was on a general arrangement sheet the fabricator did not receive.

With single mitres at K = 1.2 in this illustration, the two elbows lose 2 × 1.2 × 227.9 = **547 Pa** instead of 137 Pa: **410 Pa more**, on the index path. Had the elbows been installed, the fan would have been about 410 Pa short of the duty B1 needed, and B1 would have drawn noticeably less than 0.30 m³/s; the shortfall would have shown at commissioning as a weak furthest hood, the hardest kind of fault to trace afterwards.

The site supervisor noticed the sharp elbows on delivery, because they looked different from the elbows on the rest of the job, and checked them against the fittings schedule. The fix was to replace them with five-piece elbows and to put each fitting's type, angle and radius on the ductwork's own fabrication drawings, not only on the general arrangement. A fitting's K value is only as good as the assurance that the fitting built is the fitting calculated.

A useful way to see a fitting's cost is in velocity pressures. On B1's 140 mm run, every 1.0 of K costs about 228 Pa; on the 250 mm main, about 202 Pa. Choosing a five-piece elbow over a three-piece saves 0.15 velocity pressure, about 34 Pa for each elbow at B1, and on the index path that saving reaches the fan directly. On a short branch, by contrast, a saving in K is simply added back by the branch's orifice plate, so effort spent on fittings pays most on the index path, and least on the branches nearest the fan.

## The branches' fittings

B2 and B3 each have the same hood as B1, one five-piece elbow and a 45° entry into the main. Their fitting losses, from the hood to the main, are the hood's 342 Pa plus (0.3 + 0.25) × 227.9 = about 125 Pa, a total of about **467 Pa** each, before their 104 Pa of straight duct. Those totals, about 571 Pa per branch, are the figures Chapter 3 compared with the main's needs at N2 and N3, and the shortfalls they leave are what the orifice plates absorb.

## Fittings close together

Published K values are measured with a length of straight duct before and after the fitting, so that the air arrives evenly distributed across the section. Two fittings placed close together, an elbow straight into a junction, or two elbows back to back in different planes, interact: the air leaving the first arrives at the second unevenly, and the pair usually loses more than the sum of their separate K values. Design references give corrections for some combinations. The practical rule is to leave a few diameters of straight duct between fittings where the layout allows, and to treat closely coupled fittings with suspicion in the calculation, adding a margin rather than assuming the published values hold.

## Dampers and blast gates

A damper or blast gate is a fitting whose loss is adjustable. Fully open, a blast gate adds a small loss; partly closed, it adds whatever the commissioning engineer sets. That makes it useful for balancing, and a hazard in service, because anyone can move it. In EX-1 the fixed orifice plates of Chapter 3 do the balancing, and the blast gates at each booth are used only to shut a booth that is not in use, which itself changes the balance of the others, as Chapter 3 warned. A system that relies on shutting booths should be calculated for the combinations that will really run.

## Junctions and entries

A junction's losses are more complicated than an elbow's, because two streams meet. The branch stream loses pressure as it turns and merges, and the main stream loses a little as it is disturbed; both depend on the angle of entry and on the ratio of branch to main flow and area. Published data gives K values for each stream as functions of those ratios. The general pattern, which EX-1 follows, is that 30° and 45° entries cost much less than 90° tees, and that a junction where the main enlarges smoothly costs less than one where it steps.

## Hoods

The hood's loss is often the largest single fitting on a branch. It has two parts: the velocity pressure needed to accelerate the air from rest, which every hood must pay, and the hood's own entry loss, which depends on its shape. A plain duct end has a high entry loss; a flanged opening less; a bell-mouthed or tapered hood least. The suction measured just inside the hood, the **hood static pressure**, combines both, and it is a useful check at commissioning: if a hood's static pressure matches its calculated value, its flow is close to design, as Chapter 10 shows.

## Exits and stacks

Air leaving a duct into the open carries away its velocity pressure, which counts as a loss to the system. EX-1's stack exit at 18.33 m/s costs about 202 Pa, a large share of the system's total. A stack that tapers out slightly at its top, a diffuser, recovers some of that pressure by slowing the air before it leaves, but a stack must also discharge the exhaust high and fast enough to disperse it clear of the building and its air intakes. A rain cap of the flat, conical kind sometimes fitted to stacks adds a large loss and deflects the exhaust downwards, which is why vertical discharge designs without such caps are commonly used for extraction stacks. The stack's height and design are part of the ventilation designer's work and the building's requirements.

## Exercise: two offsets instead of a crossing

Chapter 2's mezzanine crossing converts the 250 mm main to a 160 × 310 mm rectangle for 4 m, at a cost of about 14 Pa of extra friction and 59 Pa in its two transitions. Suppose instead the main stays round and drops under the obstruction with two 45° offsets, each with an illustrative K of 0.15 on the 250 mm velocity pressure. Which costs less pressure?

**Worked answer.** The offsets cost 2 × 0.15 × 201.7 = about **61 Pa**, with the duct's friction unchanged at the round duct's 15.0 Pa/m. The crossing costs about 59 + 14 = **73 Pa**. The offsets save about 12 Pa, and they keep the duct round, with no rectangular corners for dust to settle in and no flat sides to stiffen. If the headroom under the obstruction allows a 250 mm duct, the offsets are the better choice on every count; the crossing is worth having only if it does not.
