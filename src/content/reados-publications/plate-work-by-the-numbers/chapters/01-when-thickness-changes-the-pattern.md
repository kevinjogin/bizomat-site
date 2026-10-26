---
book: plate-work-by-the-numbers
chapterSlug: when-thickness-changes-the-pattern
order: 1
title: "When thickness changes the pattern"
description: "Where plate thickness enters a pattern: rolled girths, corners, intersections, cones and holes. The running case's 2,400 mm bin, the conventions used, and a shell laid out on its inside girth."
draft: false
---

A sheet metal pattern treats the metal as a surface with no thickness, and for thin sheet that is close enough. Plate is different. Its thickness is a measurable share of every dimension that matters, and the question "which surface is this pattern for?" has a different answer at each joint. Plate work is the same geometry as sheet work with that question asked every time.

This chapter shows where thickness enters a plate pattern and how much it is worth, introduces the running case, a 2,400 mm diameter storage bin in 6 and 8 mm plate, and sets the conventions used in the rest of the book. It ends with the most common plate error of all: a shell plate laid out on its inside girth.

## How much the thickness is worth

A plate rolled into a cylinder has three girths: inside, mean and outside. The inside and outside differ from the mean by π × t each way, half the thickness on each radius, so the outside girth exceeds the inside by 2π × t.

For the running case's shell, 2,400 mm inside diameter in 6 mm plate:

- inside girth, π × 2,400 = 7,539.8 mm;
- mean girth, π × 2,406 = **7,558.7 mm**;
- outside girth, π × 2,412 = 7,577.5 mm.

A pattern developed on the inside is 18.8 mm short of the mean, and one developed on the outside 18.8 mm long. For 0.8 mm duct sheet, the same difference is 2.5 mm. The thickness does not change the geometry; it changes how much any carelessness about it costs.

```figure
type: bars
title: Girth error from developing on the inside instead of the mean line
unit: mm
max: 65
caption: The error is π × t, whatever the diameter. It grows in proportion to the thickness, which is why plate work treats the mean line as a rule and sheet work as a refinement.
- 0.8 mm sheet | 2.5
- 3 mm sheet | 9.4
- * 6 mm plate, the running case's shell | 18.8
- 8 mm plate, the running case's cone | 25.1
- 12 mm plate | 37.7
- 20 mm plate | 62.8
```

The error also compounds. A bin is a stack of parts that must meet: the lower course sits on the hopper's top edge, the upper course on the lower, the angle ring around the top and the roof inside the ring. If one of them is developed on the wrong line, it is out by π × t against every neighbour, and the mismatch shows as a step at the circumferential seam that no amount of fit-up clamping can remove. Two courses made on different lines, one inside and one mean, differ in mean diameter by 6 mm, so one stands 3 mm proud of the other all the way round. The welding procedure will usually allow some misalignment between plates at a seam, but a mismatch built into the patterns uses up that allowance before the fitter has started.

## Where the neutral line sits

When plate is bent, its outer fibres stretch, its inner fibres compress, and a surface between them keeps its length: the neutral surface. Trade texts have taught for more than a century that for plate rolled to a large radius, the neutral surface lies at the middle of the thickness, and the arithmetic agrees. The running case's shell is rolled to a mean radius of 1,203 mm, two hundred times its thickness. The strain at its outer surface is only t ÷ (2R) = 6 ÷ 2,406 = **0.25%**, the material barely yields, and the neutral surface stays at mid-thickness.

Tight bends are different. When plate is pressed to an inside radius of a few thicknesses, as at the folded corner of a hopper, the neutral surface moves towards the inside of the bend, and the bend allowance is calculated with a K-factor rather than the mean line. READOS's [Sheet Metal Parts by the Numbers](/reados/publications/sheet-metal-parts-by-the-numbers/neutral-axis-k-factor-and-bend-allowance/) works through that calculation; the same method applies to plate pressed on a brake.

So the convention for this book is: **rolled plate is developed on the mean line; pressed corners use a bend allowance.**

## Thickness relative to radius

It is tempting to think of plate work as sheet work with bigger numbers, and in one way the running case shows that it is. The ratio of radius to thickness is what governs how the metal behaves in bending. The 0.8 mm duct of a sheet metal job, Ø250 on a mean radius of 125.4 mm, has a radius 157 times its thickness. The running case's shell has a mean radius 200 times its thickness. In terms of strain, rolling the bin's shell is gentler than rolling a small duct.

The differences come from the absolute size of the thickness, not its proportion. Thickness is 6 mm at every edge, every joint and every hole, whatever the radius, so wherever two surfaces meet, whether at a seam, a corner, a branch or a weld preparation, the pattern maker must decide which of the plate's two faces each dimension belongs to. In sheet those decisions are worth a fraction of a millimetre. In plate they are worth several millimetres each, and they add up.

The hopper's outlet shows the other end of the range. Its 8 mm plate has a mean radius of about 205 mm at the outlet, and because the cone's wall slopes at 30° to its axis, the plate's actual radius of curvature there is 205 ÷ cos 30° = about 236 mm, only about 30 times the thickness. The outer fibre strain is about 1.7%, the plate yields well through its thickness, and the springback that dominates the shell's rolling is much smaller. One structure can span both kinds of behaviour.

## Weight changes the work

Plate is also heavy. One 2,400 × 6,000 mm sheet of 6 mm plate weighs 2.4 × 6.0 × 0.006 × 7,850 = **678 kg**, and the bin's shell uses four of them. Nothing in plate work is lifted by hand, turned over casually or held against a template while someone scribes around it.

That changes how patterns are used. A sheet metal worker cuts a template and scribes around it. A plater more often marks out directly on the plate from dimensions: datum edge, measured offsets, diagonals and arcs swung from a centre with a trammel or a steel tape. Templates are used for repeated details and for checking curvature, and they are made from thin sheet or timber so that they can be carried to the plate. The numbers in this book are written so that they can be marked out by measurement as well as drawn.

Weight also means that every lift is planned. The plate shop's crane, slings and lifting clamps must be rated for each plate, and a rolled course must be lifted with its shape supported so that it does not spring out of round. Chapter 10 returns to lifting and centre of gravity for the finished bin.

## Edges and bevels

A butt-welded plate edge is usually bevelled to let the weld reach the root. A bevel removes metal from one face and not the other, so the plate's length is different on its two faces. The convention that prevents argument is to mark and measure the plate's length at the **root face**, the unbevelled land at the edge, and to show the bevel on the cutting list as a separate operation. For the running case's shell seams, a single-V preparation with a 2 mm root gap is an illustration; the real joint preparation is set by the welding procedure, not the pattern maker.

## Where thickness enters a plate pattern

Thickness enters a plate pattern in six places, and each later chapter deals with one or more of them.

```figure
type: compare
title: Where thickness changes a plate pattern
rowhead: Where
cols: What changes | Running case example | Chapter
caption: The same question, which surface, has a different answer at each kind of joint.
- Rolled girths | Develop on the mean line | Shell 7,558.7 mm, not 7,539.8 | 2
- Rolling | The plate springs back further when thin relative to its radius | Shell rolled tighter than its final radius | 3
- Cones | The mean line is offset t ÷ (2 cos α) horizontally, not t ÷ 2 | 8 mm hopper cone | 4
- Corners and edges | Which plate laps which; bevels to suit | Square loading hopper | 5
- Intersections and holes | Which surfaces touch; holes marked in arcs on the mean line | Ø500 manway | 6
- * Rings and sections | Bend on the section's centroid, not its back | 75 × 75 × 6 angle ring | 7
```

## The running case

This is an illustration. A stockfeed business has ordered a steel bin from a plate fabrication shop. The bin has:

- a **cylindrical shell** of 2,400 mm inside diameter and 4,800 mm height, in two courses of 2,400 mm from 6 mm mild steel plate, with vertical butt-welded seams;
- a **conical hopper** below the shell, in 8 mm plate, its walls at 60° to the horizontal, from the shell's inside diameter down to a Ø400 outlet;
- a **75 × 75 × 6 equal angle** rolled into a ring around the top of the shell as a stiffener;
- a **Ø500 manway** set into the lower course, with a 6 mm plate neck;
- a **flat roof** of 5 mm plate with an inlet; and
- a separate **square loading hopper**, 1,200 mm square at the top and 300 mm square at the bottom, 600 mm deep, in 6 mm plate.

The shop buys plate in 2,400 × 6,000 mm sheets, cuts with plasma, rolls on a three-roll plate roll, and presses corners on a press brake. Its designer has supplied general arrangement drawings to inside dimensions, because the bin's capacity is set by its inside. The structural design, the support legs and the welding procedures are the designer's, and this book does not touch them.

```figure
type: stats
title: The running case in numbers
caption: This is an illustration. Masses are for steel at 7,850 kg/m³ and are calculated in Chapter 10.
- 2,400 mm | Shell inside diameter | 6 mm plate, two 2,400 mm courses
- 7,558.7 mm | Shell mean girth | the length of plate around each course
- 1,732 mm | Hopper cone height | 8 mm plate, walls at 60° to horizontal
- * 0.25% | Outer fibre strain when rolled | barely past yield, so springback is large
- about 2.5 t | Bin mass before fittings | shell, cone, ring and roof
```

## Conventions for this book

1. **Drawing dimensions are inside dimensions** unless stated, because the designer's capacity calculation uses them.
2. **Rolled plate is developed on the mean line.** For the shell, the mean diameter is 2,400 + 6 = 2,406 mm.
3. **Seams are butt welded with a root gap**, which the plate's length must allow for. The running case's welding procedure, an illustration, calls for a 2 mm root gap on each vertical seam, so each course's plates are shortened by 2 mm per seam.
4. **Plate is marked from a datum edge**, square to which everything else is set out, and checked by diagonals before cutting.
5. **Every pattern states its basis** in words: "mean line", "inside", "outside" or "centroid".

The last convention costs a few words on each drawing and prevents the error below.

## Tolerances come from the drawing

Plate structures are made to tolerances on diameter, roundness, straightness, seam alignment and the position of openings, and those tolerances matter structurally as well as for fit: a shell that is out of round or has a peaked seam carries load differently from a true cylinder. The tolerances that govern a real bin or tank come from its designer's drawings and the standards they call up, not from a fabrication book.

This book uses illustrative tolerances, chosen to make the arithmetic concrete, and says so each time. They are of the right kind but not necessarily the right size for any particular structure. Where a chapter shows that a fabrication method produces a given deviation, the reader should compare it with the tolerance on the actual drawing, and where the two are close, ask the designer before relying on either. That is especially true of pressure equipment, which this book does not cover, whose tolerances and inspection are tightly specified.

## The error: a shell plate on the inside girth

This is an illustration. The lower course of the shell was to be made from two plates, each half the course's girth less one root gap. A plater working from the general arrangement, which gives the inside diameter, calculated the girth as π × 2,400 = 7,539.8 mm, subtracted two 2 mm root gaps, and cut two plates each 3,767.9 mm long.

Both plates were rolled and stood up, the first seam was tacked, and the second seam would not close. The gap at the second seam was 18.8 mm wider than the 2 mm root gap allowed for, a total of about 20.8 mm. The course was 18.8 mm short in girth, which made its mean diameter 2,400.0 mm instead of 2,406.0, so its inside diameter was 6 mm small.

The fault was found at fit-up, not at the welding stage, because the shop's practice is to fit each course fully before welding any seam. The fix was expensive either way. Pulling the plates together to close a gap that size would need force the course could not take without distorting, and leaving the shell 6 mm small inside would have put its diameter outside the drawing's tolerance and made the hopper and roof not fit. A narrow infill plate would add two vertical seams, which the designer's drawing did not allow without approval. The plates were scrapped and recut on the mean line: 7,558.7 mm, less 4 mm of root gaps, giving two plates of **3,777.3 mm**.

The general rule is the one Chapter 2 develops: in plate, the girth is calculated on the mean diameter, and the drawing's diameter is converted to it in writing before any plate is marked.

```figure
type: checklist
title: Before marking any rolled plate
caption: The checks that would have caught the short shell course before a plate was cut.
- Drawing diameter identified as inside, outside or mean | the general arrangement gives inside
- Mean diameter written down | 2,406 mm for the 6 mm shell
- Mean girth calculated | π × 2,406 = 7,558.7 mm
- Root gaps subtracted, one per seam | 2 × 2 mm on a two-plate course
- Plate length written on the cutting list | 3,777.3 mm each
- x Plate length calculated from the inside diameter | 18.8 mm short per course
```

## Exercise: a thicker shell

A tank shell has an inside diameter of 1,500 mm in 10 mm plate, rolled from a single plate with one vertical seam and a 3 mm root gap. Find its inside, mean and outside girths and the length of plate to cut.

**Worked answer.**

- Inside girth: π × 1,500 = **4,712.4 mm**.
- Mean diameter: 1,500 + 10 = 1,510 mm, so mean girth = π × 1,510 = **4,743.8 mm**.
- Outside girth: π × 1,520 = **4,775.2 mm**.
- Plate length: the mean girth less one root gap, 4,743.8 − 3 = **4,740.8 mm**.

The inside and mean girths differ by π × 10 = 31.4 mm, so a plate cut to the inside girth would leave a gap of 31.4 + 3 = 34.4 mm at the seam. That number, more than three times the plate's thickness, is a quick sense check: in plate, a misplaced girth is never a small error.
