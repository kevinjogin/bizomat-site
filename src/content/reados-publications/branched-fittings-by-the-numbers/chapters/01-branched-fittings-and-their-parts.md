---
book: branched-fittings-by-the-numbers
chapterSlug: branched-fittings-and-their-parts
order: 1
title: "Branched fittings and their parts"
description: "Tees, wyes, breeches and manifolds compared; prongs, crotches and the area rule; the cone as building block; FX-4's seven fittings; and a breeches whose prong ends collided."
draft: false
---

A duct system is a tree. Air, fume, dust or grain enters at the branches and leaves through the trunk, or the other way round, and wherever two branches join, a fitting has to divide one round section into two or more. How that division is made decides how much the fitting costs to make, how much energy the system wastes pushing through it, and how difficult its pattern is to develop.

This chapter sets out the kinds of branched fitting and their parts, the area rule that sizes them, the cone that most of them are built from, the coordinates this book uses, and the seven fittings of the running case. It ends with a breeches whose prong ends collided.

## Four kinds of branched fitting

Branched fittings range from the simplest to make to the smoothest to the flow.

- A **tee** is a branch pipe cut to sit square on the side of the main, with a hole cut in the main to receive it. It is quick to make, and its pattern is a pair of cylinder intersections. The flow turns abruptly into or out of it.
- A **lateral** or **wye** is a branch pipe meeting the main at an angle, usually 45° or 30°, again as two cylinders. The flow turns less abruptly.
- A **breeches** divides the main gradually into two prongs, each of which shrinks and turns towards its own duct. The two prongs meet each other along a **crotch**, a curved line running up the middle of the fitting from the main's edge. The flow divides smoothly.
- A **manifold** or **multi-way fitting** divides the main into three or more prongs in the same way, with a crotch between each pair of neighbours.

READOS's [Sheet Metal Patterns by the Numbers](/reados/publications/sheet-metal-patterns-by-the-numbers/tees-and-branches/) covers tees and laterals on round pipe. This book deals with breeches and manifolds, where the prongs are not cylinders and their meeting line is not obvious.

```figure
type: compare
title: Branched fittings compared
rowhead: Fitting
cols: How it divides | Pattern method | Where it suits
caption: Qualitative comparison. The ductwork effect of each is a matter for the system's design; see READOS's Ductwork by the Numbers.
- Tee | branch square on the main | cylinder intersections | low-velocity systems, tight spaces
- Lateral or wye | branch at an angle | cylinder intersections | general ductwork
- * Breeches | main divides into two prongs | oblique cones or triangulation | extraction and conveying, where flow should divide smoothly
- Manifold | main divides into three or more | oblique cones or triangulation | collecting from several hoods or feeding several outlets
```

## The parts of a breeches

Every breeches in this book has the same parts, and the chapters use the same names for them.

- The **main end** is the round end where the fitting joins the trunk duct.
- Each **prong** runs from part of the main end to its own **prong end**, which joins a branch duct.
- The **crotch** is the line along which two prongs meet. It starts at two **feet** on the main end's edge, rises to a **peak**, and is the seam that joins the prongs.
- The **outer side** of each prong is the side away from the crotch, the long sweep from the main end to the prong end.

The crotch is what makes branched fittings hard. Each prong's pattern ends at the crotch, so the crotch's exact shape decides both prongs' patterns. A crotch that is a little out makes prongs that gape at their meeting line or overlap it. Most of this book is about finding the crotch.

## The area rule

A breeches in an extraction system is usually sized so that the air speed is about the same in the main and in the prongs, which means that the prongs' areas together roughly equal the main's. For two equal prongs, each prong's diameter is the main's divided by √2; for three, by √3. The ductwork reasoning behind the rule, and when it is broken deliberately, is in READOS's [Ductwork by the Numbers](/reados/publications/ductwork-by-the-numbers/branches-and-the-main/).

For FX-4, a Ø355 main divided into two equal prongs would need prongs of 355 ÷ √2 = 251.0 mm; the nearest standard size, Ø250, gives a combined area of 98,175 mm² against the main's 98,980 mm², 0.8% less. A Ø400 duct divided into three would need prongs of 230.9 mm; three Ø230 prongs give 124,643 mm² against 125,664 mm², again 0.8% less.

## Cones as building blocks

Most of the prongs in this book are parts of **oblique cones**. A cone is every straight line from a point, its apex, to a circle, its base; when the apex is not on the circle's axis, the cone is oblique. A prong whose end is parallel to the main end is always part of such a cone: the two circles, one at each end, define the cone, and its apex is where the lines through matching points of the two circles meet. Cones are developable, so those prongs have exact patterns, laid out by radial lines from the apex.

A prong whose end is tilted relative to the main end is not part of a cone, and is triangulated, as in Transitional Elbows by the Numbers. Chapters 5 and 7 develop prongs of that kind.

The great convenience of cone prongs is the subject of Chapter 4: when every prong of a fitting is a cone standing on the same main circle, the crotch between any two of them lies in a plane. A crotch in a plane can be found exactly from a few points and drawn as a flat curve, and that turns the hardest part of a breeches into one of the easiest.

## Coordinates for branched fittings

Every fitting in this book is set on three axes in the same way. The origin is the centre of the main end, z runs along the main's axis towards the prongs, and x runs across the fitting in the direction in which the prongs spread. A fitting with two prongs is usually symmetric about the plane x = 0, or at least about the plane y = 0, and the coordinates make the symmetry plain.

Each prong end is given by its centre, its diameter and, if it is tilted, its tilt. Everything else is calculated: each prong's apex, its elements, its crotch and its pattern.

## What the job sheet must give

A branched fitting is fully defined by its ends, and the job sheet gives each end in the same four parts used throughout this book.

- **The main end**: its diameter, with its centre at the origin and its plane square to z.
- **Each prong end**: its centre as a coordinate, its diameter, and whether its plane is parallel to the main end's or tilted, and if tilted, by how much and about which axis.
- **The length**: the distance along z from the main end to the prong ends, implied by their centres.
- **The joints**: what each end connects to, a spigot, a flange or a slip joint, which decides its allowance.

Two things are deliberately left off: the crotch and the shape of the prongs. They follow from the ends, and a job sheet that specified them as well would risk specifying a shape the ends cannot produce. If a particular crotch height is wanted, for strength or for clearance, it is achieved by moving the prong ends, not by drawing a crotch.

## Which way the flow goes

A breeches in an extraction system collects: air enters through the prongs and leaves through the main. The same fitting in a supply system divides: air enters through the main and leaves through the prongs. The geometry and the patterns are the same either way. Two things change.

The **laps** of the seams are made so that the flow passes over them, not into them: seen from inside, each upstream edge lies over the edge downstream of it, so that the air slides over each joint rather than catching on it. On a crotch seam, which runs across the flow at its peak, the lap direction is chosen to face downstream.

The **crotch** itself faces the flow differently. In a dividing fitting, the crotch splits the incoming stream and takes its impact; in a collecting fitting, it is where two streams meet. Fume and dust tend to deposit at a collecting crotch, so it is the first place inspected for build-up.

## Breeches beyond ductwork

The same fittings are made for gravity chutes carrying grain, stock feed, sawdust or crushed rock, where a breeches with a flap at its crotch diverts the flow to one bin or another. Chute fittings are usually heavier, in 1.6 to 3 mm sheet or plate, and their prongs are steeper so that material slides rather than piles, but their geometry is the same as a duct's. On heavy work the patterns are developed on the mean line, as READOS's Plate Work by the Numbers explains, and the crotch is often lined against wear.

## A tee or a breeches?

A tee costs less to make: two straightforward patterns and a hole. A breeches costs considerably more: several patterns to develop, a crotch seam to make and seal, and more forming. A breeches earns that cost in two situations: where the system's resistance matters, because a smooth division wastes less of the fan's energy; and where material must not settle, because a breeches has no sharp corner or dead space at the junction. FX-4 uses breeches because welding fume carries fine particles that settle in dead spaces, and because the filter unit's fan has little pressure to spare.

## Taking prong ends from site

Most branched fittings join ducts that already exist or are being installed at the same time, so their prong ends are often measured on site rather than taken from a drawing. Three measurements fix each prong end: the distance along the main's axis from the main end to the prong end's centre, the distance across, and the angle of the branch duct. The first two are taken with a tape from a datum on the main, the third with a digital angle gauge on the branch. A sketch with the three numbers, converted to a coordinate on the job sheet, is all the pattern needs. The shop's practice is to measure each prong end twice, by different people, before any pattern is developed, because every number in the fitting follows from those few measurements.

## The running case's seven fittings

This is an illustration. The FX-4 fittings were chosen to cover the range of branched work.

```figure
type: compare
title: The seven FX-4 fittings
rowhead: Fitting
cols: Ends | Prong ends | Method | Chapter
caption: This is an illustration. Diameters on the mean line of 0.8 mm galvanised sheet. Prong-end positions are given in each chapter.
- G1 wall hood | Ø600 to Ø250, flat on one side | parallel | oblique cone frustum | 2, 3 and 9
- G2 breeches | Ø355 to 2 × Ø250 | parallel to the main | two oblique cones, crotch in a plane | 4
- G3 breeches | Ø355 to 2 × Ø250 | tilted 30° outward | triangulated, crotch in the plane of symmetry | 5
- * G4 unequal breeches | Ø355 to Ø300 and Ø200 | parallel to the main | two oblique cones, tilted crotch plane | 6
- G5 wye | Ø355 to Ø300 straight and Ø200 at 45° | one parallel, one tilted | cone and triangulation | 7
- G6 manifold | Ø400 to 3 × Ø230 | parallel to the main | three oblique cones, three crotch planes | 8
- G7 pipe into hood | Ø150 into G1's side | square to the wall | intersection with a cone | 9
```

## The error: prong ends that collided

This is an illustration. G2's drawing showed the two Ø250 prong ends 300 mm apart, centre to centre, 400 mm from the main end. A worker setting out a second G2 for another bay read the spacing from a print scaled at 1:5 and took it as 240 mm.

The prongs were developed correctly as cones for that spacing. But two Ø250 ends with centres only 240 mm apart overlap by 10 mm, and the crotch between them, instead of peaking below the prong ends, rose to **411.6 mm**, above the prong ends' 400 mm. The two prongs' patterns each had a notch where the other prong's end cut into it, and the formed fitting could not take two branch collars side by side. With the drawing's 300 mm spacing, the ends are 50 mm apart and the crotch peaks at **350.6 mm**, comfortably below them.

The error was found when the patterns were laid out and the notch appeared. It was a drawing-reading error, not a development error, and the shop's fix was the usual one: every prong end's centre is written on the job sheet as a coordinate, (±150, 0, 400) for G2, and never scaled from a print. The check that would have caught it before any pattern was drawn is simple: two prong ends whose centres are closer than the sum of their radii will collide. For G2, the sum of the radii is 250 mm, so any spacing under 250 mm is impossible, and spacings only a little over it leave too little room for the branch collars.

```figure
type: bars
title: G2's crotch peak by prong spacing
unit: mm
max: 450
caption: This is an illustration. With the prong ends 400 mm from the main end, the crotch must peak below 400 mm or the prong ends collide.
- * Centres 300 mm apart | 350.6
- Centres 240 mm apart | 411.6
- Prong ends | 400
```

## Exercise: sizing a three-way manifold

A system designer asks for a manifold dividing a Ø450 duct into three equal prongs at about the same air speed. Find the prong diameter by the area rule, choose the nearest of Ø250 and Ø260, and find how the combined area compares with the main's.

**Worked answer.**

- By the area rule, each prong's diameter is 450 ÷ √3 = **259.8 mm**.
- The nearest of the two sizes is **Ø260**.
- Three Ø260 prongs have a combined area of 3 × π × 130² = 159,279 mm²; the Ø450 main has π × 225² = 159,043 mm². The prongs' combined area is **0.15% more**, and the air speed in them is almost exactly the main's.

The area rule gives a starting size. The system designer may choose a different size to balance the branches' flows, and the fitting is then developed for whatever sizes are chosen.
