---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: counting-strain-and-thickness
order: 2
title: "Counting strain and thickness"
description: "Measure stretch and shrink as engineering and true strain, predict thickness from constant volume, read a circle grid on a trial dome, and catch grid lines that started the cracks."
draft: false
---

A worker forming a dome by hand feels the metal getting harder and sees it changing shape, but cannot see its thickness. Thickness is what the customer's drawing for HF-01 controls, at least 1.3 mm anywhere, and thickness is what decides whether a stretched region will tear. Fortunately it can be predicted from what can be seen and measured on the surface, because metal deforming plastically keeps its volume.

This chapter sets out the two ways of measuring strain, the constant-volume rule that turns surface strain into thickness, and the circle grid, a simple marking method that lets a worker read the strain on a trial part. It applies them to a trial dome and finds the dome's thinnest point before the customer does.

## Engineering strain and true strain

Strain is the change in a length divided by a length. **Engineering strain** divides by the original length: a 10 mm line stretched to 11 mm has a strain of (11 − 10) / 10 = 10%. It is the strain on a tensile test certificate, and it is easy to measure.

**True strain** divides each small increment of stretch by the length at that moment, which adds up to the natural logarithm of the length ratio: ln(11 / 10) = 9.5%. For small strains the two are nearly equal. For the strains of hand forming, which run to 20% and more, they differ, and true strain has one great advantage: true strains in the three directions of a piece of sheet always add up to zero.

```figure
type: compare
title: Engineering and true strain for a 10 mm line
cols: Engineering strain | True strain
caption: The two agree for small strains and diverge as strain grows. In shrinking they diverge the other way. The BIZOMAT true stress and strain calculator converts between them.
- 10 mm to 11 mm | 10.0% | 9.5%
- 10 mm to 12 mm | 20.0% | 18.2%
- 10 mm to 12.5 mm | 25.0% | 22.3%
- 10 mm to 9 mm | −10.0% | −10.5%
```

The [true stress and strain calculator](/tools/true-stress-strain/) in BIZOMAT Tools converts between the two and between engineering and true stress, for anyone who wants to check the logarithms.

## Constant volume

During plastic forming, metal's volume hardly changes. A piece of sheet stretched in its plane must get thinner, and one compressed in its plane must get thicker. In true strains the rule is exact and simple:

```figure
type: formula
title: Thickness from surface strain, by constant volume
formula: ε₁ + ε₂ + ε₃ = 0     t = t₀ × exp(ε₃)
caption: True strains. ε₁ and ε₂ are measured on the surface; ε₃ is the thickness strain. Equivalently, thickness falls in proportion to the growth of area: t = t₀ × A₀ / A.
- ε₁, ε₂ | True strains in the two directions on the surface
- ε₃ | True thickness strain
- t₀, t | Original and formed thickness, mm
step: For a region stretched to 1.25 times its area: t = 1.6 / 1.25 = 1.28 mm
step: For a region stretched 10% each way: area × 1.21, t = 1.6 / 1.21 = 1.32 mm
```

The second line is worth dwelling on. A stretch of only 10% in each direction, which a worker would barely notice by eye, takes 1.6 mm sheet down to 1.32 mm, just above HF-01's 1.3 mm limit. The limit allows the area of any region to grow by at most 1.6 / 1.3 = 1.23 times, or about 10.9% in each direction if the stretch is equal both ways. Stretching in two directions at once thins sheet much faster than stretching in one, which is why the middle of a dome, stretched equally in every direction, is where it gets thin.

Shrinking works the other way. A rim compressed to 90% of its circumference, with its width unchanged, thickens to 1.6 / 0.9 = 1.78 mm. Shrinking does not threaten the thickness limit; its danger is wrinkling, because thin sheet under compression would rather buckle than thicken, as the paper on a dome showed in Chapter 1.

A wrinkle is the sheet's way of avoiding compression: rather than thicken, it folds out of plane and keeps its length. A shrinking operation succeeds only if each wrinkle is kept small enough to be hammered back down into thickness before it folds over on itself. That is why raising is done in many light courses and why a shrinker takes small bites. Once a wrinkle has folded over and been hammered flat, it becomes a lap, two layers of sheet pressed together with a crack-like seam between them, and no amount of planishing will remove it. Chapters 4 and 5 return to this, because it is the characteristic failure of shrinking, just as thinning and tearing are the failures of stretching.

## The circle grid

To measure strain on a real part, the worker needs marks on the sheet that move with it. The **circle grid** method, introduced in the 1960s for press-formed car panels and listed in the references, marks the blank with a pattern of small circles of known diameter before forming. After forming, each circle has become an ellipse. Its long axis gives the largest surface strain at that point, its short axis the smallest, and constant volume gives the thickness.

This is an illustration. Before committing a customer blank, the workshop formed a trial dome from scrap of the same 1.6 mm batch, marked with 10 mm circles at 20 mm spacing along two diameters. After forming, the worker measured each ellipse with a flexible clear rule and dividers. The circle at the very top of the dome measured 11.5 mm by 10.6 mm.

- True major strain: ln(11.5 / 10) = 14.0%.
- True minor strain: ln(10.6 / 10) = 5.8%.
- True thickness strain: −(14.0 + 5.8) = −19.8%.
- Thickness: 1.6 × exp(−0.198) = **1.31 mm**.

The same answer comes from area: the ellipse's area is 11.5 × 10.6 / 100 = 1.219 times the circle's, so the thickness is 1.6 / 1.219 = 1.31 mm. That trial dome would have just met the 1.3 mm limit at its top, with no margin for the variation between one dome and the next.

```figure
type: stats
title: Strain at the top of the trial dome, from one circle
caption: This is an illustration. A 10 mm circle marked on the blank measured 11.5 × 10.6 mm after forming. Constant volume gives the thickness, checked later with an ultrasonic gauge.
- 14.0% | Major true strain | ellipse 11.5 mm long
- 5.8% | Minor true strain | ellipse 10.6 mm wide
- *1.31 mm | Predicted thickness | limit 1.3 mm
```

The worker confirmed the prediction with an ultrasonic thickness gauge, which read 1.32 mm at that point, close enough to trust the grid for the rest of the dome. The grid also showed something the gauge alone would not: the strain was not equal in both directions at the top, because the trial dome had been sunk slightly off centre and was stretched more along one diameter than the other. An evenly sunk dome would have been thinner at its top for the same depth, but more uniform elsewhere.

### Where to put the grid

A full grid over a blank is tedious to read, and most of it tells the worker nothing new. For a shape with symmetry, such as a dome, a line of circles along two diameters at right angles is enough: it shows the strain from top to rim, and comparing the two diameters shows whether the forming was even. For a part with a known problem area, such as the corner of a flange or the middle of a crowned panel, a cluster of circles over that area alone is better than a sparse grid everywhere.

Circle size is a compromise. Small circles resolve local strain, such as the ring of heavy blows that the exercise below uncovers, but are harder to measure accurately; a 0.2 mm error on a 5 mm circle is a 4% strain error. Large circles are easy to measure but average the strain over their area. Circles of 8 to 10 mm, read with a flexible clear rule to a quarter of a millimetre, suit hand-formed parts of HF-01's size.

### Measuring thickness directly

The grid predicts thickness; a gauge measures it. Three tools are common in small workshops:

- An **ultrasonic thickness gauge** sends a pulse through the sheet from one side and times its echo from the other. It reads anywhere on a curved part without access to the back, which makes it the best tool for the middle of a dome. It must be calibrated on a sample of the same alloy, because the sound's speed differs between metals.
- A **micrometer with a ball anvil** reads accurately on curved sheet near an edge, where both sides can be reached.
- **Calipers** read only at the edge, which is the least interesting place on a stretched part.

The grid and the gauge complement each other. The grid shows the pattern of strain over the whole part and how it got there; the gauge confirms the thickness at the points that matter. On HF-01, the workshop gauges every dome at its top and at four points halfway down, and records the readings, as Chapter 8 describes.

## The error: grid lines that started cracks

This is an illustration. On the workshop's first attempt at a circle grid, an apprentice scribed the circles onto the trial blank with a steel scriber and dividers, the way a pattern is marked out for cutting. The trial dome cracked during sinking, along an arc that followed one of the scribed circles near its top, at a strain well below what the sheet had stood in earlier trials.

A scribed line is a groove, and a groove in a stretched surface concentrates strain at its root. In bending, a scribe line on the outside of a fold is a well-known starting point for cracks. In biaxial stretching, where the surface is pulled in every direction, a scribed circle is a crack waiting to happen. The grid had done exactly what a grid should not: changed the behaviour it was meant to measure.

The workshop changed its method. Circles are now drawn with a fine permanent marker through a thin plastic stencil cut with a circle punch, which leaves no groove and is easily removed with solvent. In industry, grids are usually printed or electrochemically etched for the same reason. The lesson was written into the workshop's trial procedure: **nothing that marks a blank to be formed may cut into its surface**. That includes scribed layout lines on the formed region, which should be marked with a marker or pencil and only scribed outside the trim line.

## How far the metal will go

The certificate for a batch of sheet gives its elongation in a tensile test, the engineering strain at which a standard strip pulled in one direction broke. This is an illustration. The certificate for HF-01's batch shows 30%. That number is a useful guide but not a forming limit, for three reasons:

1. **The strain path differs.** A tensile strip is stretched one way and narrows in the other. The middle of a dome is stretched both ways at once, and sheet generally reaches its limit at a different combination of strains under biaxial stretching. The forming limit diagram, which grew out of the same circle grid work, maps that limit for each strain combination, but it is measured for specific materials and is rarely available for a small batch of sheet.
2. **Local strain matters, not average.** A dome's average strain may be modest while its top or a region struck too hard is stretched far more. The grid finds those regions.
3. **Work hardening and annealing change the material.** As soft aluminium is hammered, it hardens and becomes less able to stretch further. Annealing restores softness but not thickness.

For hand forming, the practical limit is usually the drawing's thickness limit, not the metal's tearing limit. HF-01's 1.3 mm limit allows a true thickness strain of ln(1.3 / 1.6) = −20.8%, which the trial dome's top nearly used up. Chapter 3 shows how to choose a blank so that less of the dome's area has to come from stretching.

### Work hardening and annealing

Soft aluminium sheet hardens noticeably under the hammer: it rings rather than thuds, springs back more and resists further stretching. Experienced workers feel this and anneal before the metal starts to crack, typically after one or two stages of heavy work. Annealing practice, the temperature and time for the specific alloy and temper, must come from the metal supplier's data; overheating some alloys damages them, and annealing temperatures that suit one alloy are wrong for another. The workshop's practice for HF-01 is set out in Chapter 4. What matters here is that annealing resets the metal's hardness and its ability to stretch, while every reduction in thickness already made is permanent.

## Exercise: reading a second circle

On the trial dome, a circle halfway between the top and the rim measured 12.2 mm by 10.9 mm.

1. What are the true major, minor and thickness strains there, and the predicted thickness?
2. Is that point thinner or thicker than the top, and what does that suggest about how the dome was formed?

**Worked answer.**

1. Major: ln(12.2 / 10) = **19.9%**. Minor: ln(10.9 / 10) = **8.6%**. Thickness strain: −(19.9 + 8.6) = **−28.5%**. Thickness: 1.6 × exp(−0.285) = **1.20 mm**, below the 1.3 mm limit.
2. It is thinner than the top. In an evenly formed dome the top is usually thinnest, because it is stretched equally in all directions. A thinner region halfway down suggests that the worker concentrated blows there, probably sinking a ring rather than a smooth bowl and then pushing the top up. The trial has done its job: it found a forming habit that would fail the drawing, on scrap, before a customer blank was touched. The fix is a blank that needs less stretching, from Chapter 3, and a sinking sequence that spreads the work, from Chapter 4.
