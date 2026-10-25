---
book: welding-distortion-by-the-numbers
chapterSlug: transverse-shrinkage
order: 2
title: "Transverse shrinkage and closing gaps"
description: "Estimate how much a butt weld draws its plates together, see how groove shape changes it, allow for it in cutting, and control the closing of the gap ahead of the arc that Whittemore called creep."
draft: false
---

A butt weld across a joint pulls the two plates towards each other as it cools. The plates end up shorter across the seam than they were cut, sometimes by a couple of millimetres per weld, and a structure with several seams in a row can lose a centimetre or more. While the weld is being made, the same shrinkage acts ahead of the arc, drawing the unwelded edges together or pushing them apart, so that the gap the welder started with is not the gap the welder finishes with. Both effects are predictable enough to plan for.

This chapter estimates transverse shrinkage with a simple model, shows how the groove's shape changes it, explains how the shop allows for it when cutting parts, and describes the gap movement during welding, using Whittemore's 1910 observations of what Whittemore called creep.

## Shrinkage across the weld

A butt weld's transverse shrinkage comes from the weld metal and the heated metal beside it contracting across the joint as they cool. It is largest for thick welds made in many passes with high heat input, and smallest for thin, single-pass welds. Experience and tests show that the transverse shrinkage of a butt weld in steel grows roughly in proportion to the cross-sectional area of the weld divided by the plate thickness: a wide, heavy weld in a thin plate shrinks more than a narrow weld in a thick one.

```figure
type: formula
title: A simple estimate of transverse shrinkage in a steel butt weld
formula: S_t ≈ c × A_w ÷ t
caption: This is an illustration of a simplified teaching model. The coefficient c depends on the process, heat input, restraint and number of passes; 0.2 is an illustrative value, and each shop should calibrate it from its own measurements.
- A_w, weld cross-section: 12 mm plate, single-V, 60°, 2 mm gap | about 107 mm²
- t, plate thickness | 12 mm
- c, illustrative coefficient | 0.2
step: S_t ≈ 0.2 × 107 ÷ 12
step: S_t ≈ 1.8 mm across the seam
```

The model's value is less in its exact numbers than in what it shows: shrinkage rises with the weld's area, so anything that reduces the weld's cross-section, a narrower groove, a smaller gap, a double-sided preparation, reduces the shrinkage too.

## Groove shape and shrinkage

Using the same illustrative coefficient, the shrinkage of single-V and double-V butt welds in plates of several thicknesses can be compared.

```figure
type: bars
title: Illustrative transverse shrinkage of butt welds, single-V and double-V
unit: mm of shrinkage across the seam
max: 3
caption: This is an illustration from S_t ≈ 0.2 × A_w ÷ t, with 60° grooves and 2 mm root gaps. Double-V grooves need less weld metal and shrink less; real values depend on the process and should be measured.
- 8 mm, single-V | 1.32
- 8 mm, double-V | 0.86
- 12 mm, single-V | 1.79
- 12 mm, double-V | 1.09
- *20 mm, single-V | 2.71
- 20 mm, double-V | 1.55
```

A double-V preparation roughly halves the weld area for thick plate, and with it much of the shrinkage, as well as balancing the angular distortion that Chapter 4 describes. Designing Welded Joints by the Numbers compares the weld metal in different grooves in its chapter on butt welds.

## Fillet welds shrink across too

Fillet welds in tee joints also shrink across their width, pulling the standing plate slightly and shortening the flange plate across its width by a small amount for each fillet. The effect per weld is usually less than for a butt weld, because a fillet's weld area is smaller and much of its heat goes into the thicker part, but it accumulates where many stiffeners or attachments are welded across a plate. A long plate with twenty stiffeners welded across it can shorten noticeably.

## Root gap and shrinkage

The root gap is part of the weld's cross-section, and a gap larger than the procedure calls for adds weld metal and shrinkage. In the 12 mm single-V weld above, the 2 mm gap contributes 24 mm² of the 107 mm²; a 4 mm gap would add another 24 mm², raising the estimated shrinkage from about 1.8 mm to about 2.2 mm, and making penetration harder to control as well. Poor fit-up is therefore a source of distortion as well as of defects, and accurate cutting and fitting, so that joints come together at the gap the procedure specifies, is one of the simplest distortion controls a shop has.

## Restraint changes the shrinkage

The model gives the shrinkage of a joint that is free to move. A joint held rigidly, by clamps, strongbacks or the stiffness of the structure around it, shrinks less, and the difference stays in it as residual stress. A plate welded into an opening in a large, stiff structure, an insert in a ship's deck or a patch in a tank, cannot pull its surroundings in, and its weld is left in high tension, which is why such welds are prone to cracking, as Weld Repairs That Hold explains in its chapter on [patches and inserts](/reados/publications/weld-repairs-that-hold/patches-and-inserts/). Chapter 6 returns to restraint; for now, the point is that the shrinkage estimate is for free joints, and restrained joints trade shrinkage for stress.

## Measuring shrinkage

Calibrating the model needs measurements, and they are simple to make. Before welding, two centre-punch marks are made on the plate surface, one on each side of the joint, a known distance apart, perhaps 100 mm. After welding and cooling, the distance between the marks is measured again; the difference is the transverse shrinkage at that point. Marks at several points along the seam show whether the shrinkage is even or varies with the sequence. The shop made such measurements on its first three girder webs and its first two panels, and used them to set the cutting allowances, replacing the model's coefficient with its own.

## Shrinkage in multi-pass welds

In a thick butt weld made in many passes, the shrinkage builds up pass by pass, fastest in the early passes when the joint is thin and flexible, and more slowly later when the deposited metal stiffens it. Measuring the shrinkage after the root and a few fill passes gives an early warning of how much the finished joint will shrink, and lets the welder or supervisor adjust the sequence, for example by turning the joint and welding the other side of a double-V sooner, before the shrinkage has built up on one side.

## Allowing for shrinkage in cutting

If transverse shrinkage is predictable, it can be allowed for: parts are cut slightly oversize, by the expected shrinkage, so that they finish at the right size after welding. This is an illustration. The shop's stainless steel panels are made from strips joined by butt welds, and a 2 m panel made of four strips has three seams. If each 1.5 mm thick seam shrinks by about 0.5 mm, the panel finishes about 1.5 mm short unless the strips are cut oversize. For the girders, a web made of three plates butt-welded end to end, each seam in 12 mm plate shrinking about 1.8 mm, loses about 3.6 mm over its two seams, enough to matter for a girder that must fit between supports.

The shop's cutting lists now include a shrinkage allowance for each welded assembly with butt seams, set initially from the model and corrected from measurements of the first few assemblies made. The allowance is recorded on the cutting list, not left to the cutter's memory.

## Whittemore's creep

When Whittemore welded the test plates in 1910, the edges of the joint did not stay where they had been clamped. As the weld progressed from one end of the seam, the edges ahead of the blowpipe were drawn together by the cooling and contracting of the weld behind it. Whittemore called this creep, and to allow for it, clamped the plates with their edges touching at the starting end and open by a small gap at the far end of the seam, which was about 20 to 27 inches long, so that the edges would close up as the weld progressed.

Getting the allowance right took several attempts. On one strip, the allowance proved too small, and the thin edges crowded together and tended to overlap. On the next, it proved too large: the edges did not draw together enough to close the groove, and the flame burned through at intervals. A third strip, with an intermediate allowance, came out practically flat when cold. On a strip of square-edged plates, welded with no allowance at all because the square edges were expected to prevent overlapping, the plates crowded together, ended up offset from each other by a growing amount along the seam, and warped so badly that, with three corners on a flat surface, the fourth stood about an inch above it. The conclusion was simply that allowance should have been made for creep.

```figure
type: compare
title: Whittemore's allowances for creep, and what happened
cols: Allowance at the far end | Result
caption: Summarised from Whittemore's 1910 bulletin in new words. The behaviour, edges closing ahead of the weld, is the rotational distortion of modern terminology.
- Too small | edges crowded together and tended to overlap
- Too large | groove did not close; flame burned through at intervals
- *Intermediate | plates practically flat when cold
- None, square edges | plates offset along the seam and badly warped
```

## Rotational distortion today

Modern terminology calls Whittemore's creep rotational distortion: the movement of the unwelded part of a joint while the weld is being made. Whether the gap closes or opens depends on the process and the heat input. With slow, high-heat processes, such as the gas welding of those tests, the metal ahead of the weld is heated and expands while the weld behind cools, and the net effect often draws the edges together, as Whittemore saw. With fast, concentrated arc processes, the gap ahead can open instead. Either way, the gap the welder relies on for penetration changes along the seam, which causes the burn-through and lack of fusion Whittemore found.

## Tack welds

The usual modern control for rotational distortion is tack welding: short welds made at intervals along the joint before the main welding, which hold the edges at the intended gap while the weld progresses. Tacks must be strong enough not to crack as the weld's shrinkage pulls on them, close enough together to hold the gap, and made with the same care as the main weld, because they become part of it. Tacks spaced too far apart let the gap close between them; tacks too small crack, often without anyone noticing, and the crack is then buried in the weld. A common practice on long seams is to tack at the ends, then the middle, then the quarter points, and so on, so that the gap is held from the start.

## Strongbacks and wedges

On thick plate and long seams, tack welds alone may not hold the gap against the shrinkage forces. Strongbacks, stiff bars welded or clamped across the joint at intervals, and wedges driven between the plates hold the gap more firmly. They add restraint, and with it residual stress, so they are removed after welding with care, and the joint near their attachments is inspected for cracks. The shop uses clamped strongbacks with a shoulder that keeps the gap, rather than welded ones, on its girder web splices, so that nothing is welded to the web except the seam.

## Sequence along a seam

The direction and order in which a long seam is welded changes how the gap moves. Welding from one end to the other lets each part of the weld's shrinkage act on the unwelded remainder, accumulating gap change along the seam. Back-step welding, in which short lengths are welded in the direction opposite to the overall progress, and welding from the middle outwards, spread the shrinkage more evenly. Dunham advised in 1917 that a crack in a sheet steel fender should be welded from the centre outwards, without tacking the end, for a similar reason. Chapter 7 deals with sequence in detail; for transverse shrinkage, the point is that sequence affects the final dimensions as well as the gap during welding.

## The running case: the girder web

This is an illustration. The girder webs, three 12 mm plates butt-welded into a single web about 8 m long, were coming out about 4 mm short, which meant the girders' stiffeners and end plates did not line up with the drawing. The estimate above, about 1.8 mm per seam, accounted for most of it. The production manager added a 2 mm allowance per seam to the cutting list for the web plates, changed the seams from single-V to double-V preparations, which cut the estimated shrinkage to about 1.1 mm per seam, and reduced the allowance accordingly after measuring the first three girders. The webs now finish within a millimetre of length.

## A failure: the burn-through seam

This is an illustration. A welder making a long butt seam in 6 mm stainless steel tacked it at each end only and welded from one end. By the middle of the seam, the gap had opened far enough that the arc burned through repeatedly, and by the end it had closed so tightly that the root was not fused. The seam had to be cut out and remade.

The heat of the weld had moved the unwelded part of the seam, as Whittemore found a century earlier. Remade with tacks every 150 mm, in the order ends, middle, quarter points, and welded in back-step lengths, the seam held its gap throughout.

## Exercise: a panel's allowance

A 3 m wide stainless steel panel is made from five strips joined by four butt seams. Measurements on trial panels show each seam shrinks about 0.6 mm. How much should the strips be cut oversize in total, and how would you divide it?

The four seams shrink about 4 × 0.6 = **2.4 mm** in total, so the panel must be cut about 2.4 mm oversize across its width to finish at 3 m. Dividing the allowance equally, each seam needs about 0.6 mm, so each strip adjacent to a seam is cut about 0.3 mm wider at that edge; the two edge strips, with only one seam each, get 0.3 mm extra, and the three middle strips, with two seams each, get 0.6 mm extra.

The allowance should be checked on the first few production panels and adjusted, because the real shrinkage depends on the welder, the speed and the fit-up, as Whittemore's three attempts at the creep allowance showed.
