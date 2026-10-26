---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: seams-edges-and-notches
order: 9
title: "Seams, edges and notches: the allowances"
description: "Turn net patterns into patterns that can be made: grooved seam, lap and slip joint allowances, wired edges by rule and by geometry, flange stretch on round ends, notches, and trial strips."
draft: false
---

A net pattern is the surface alone. Nothing made from it would hold together: it has no seam to lock, no lap to rivet, no edge to stiffen and no flange to bolt. Every fitting in this book needs material added beyond the net pattern for those purposes, and material removed where layers would pile up. The additions are allowances, the removals are notches, and the pattern is not finished until both are on it.

This chapter sets out the allowances used in the running case, explains where each number comes from, and shows how to calibrate them with trial strips rather than trusting a table. It tests a traditional wiring rule against geometry, works out how far a flange on a round end must stretch, and ends with a wired edge given the allowance for the wire but not for the sheet around it.

## Grooved seams

The running case closes every longitudinal seam with a grooved seam, sometimes called a lock seam: each edge is folded into a hook, the hooks are interlocked, and the joint is flattened and set down with a grooving tool so that it locks.

The allowance follows from the seam's geometry. Let the finished seam be W wide. Each sheet enters the seam, runs across it for W, and folds back on itself for another W. So each edge uses 2W of sheet beyond the point where the seam begins on its side. But the seam itself occupies W of the fitting's girth, and that W is already counted in the net pattern. The total extra sheet is therefore 2W + 2W − W = **3W**.

For the running case's 6 mm seam, that is 18 mm, split as 9 mm on each edge of the pattern, the value used since Chapter 2. A seam that is set down offset, so that the outside stays flush, uses a little more, roughly a few sheet thicknesses, and so does a seam in heavier sheet, because each fold takes up length around its radius. The geometry gives the starting value; a trial strip gives the shop's value.

```figure
type: formula
title: Allowance for a grooved seam
formula: allowance = 3 × W
caption: Derived from the seam's layers: each edge runs W across the seam and folds back W, and the seam occupies W of the girth already in the net pattern. The running case's 6 mm seam in 0.8 mm sheet.
- W | Finished width of the seam
step: Each edge: W across plus W folded back = 2W
step: Both edges: 4W, less the W already in the girth = 3W
step: W = 6 mm: allowance 18 mm, 9 mm on each edge
step: Confirm with a trial strip, because folds in real sheet take up a little extra length
```

## Laps, rivets and slip joints

A **lap seam** simply overlaps one edge on the other, and is riveted, soldered, sealed or spot welded. Its allowance is the lap width, added to one edge only. The running case uses 12 mm laps where pieces of a segmented elbow overlap, with 4 mm blind rivets at about 50 mm pitch, sealed with duct sealant. Those numbers are illustrations, set by the specification for a real job.

A **slip joint** between duct pieces needs a crimped or swaged end on one piece that slides inside the plain end of the next. The crimping machine reduces the end's diameter by corrugating it, so the crimped length needs no extra girth. It does need length: the running case allows 40 mm on each piece's crimped end, so a duct piece that must show 1,000 mm between joints is cut 1,040 mm long.

A **Pittsburgh lock** and other roll-formed seams are made on dedicated machines, each with its own allowance set by the machine's maker. A shop that uses one takes the allowance from the machine's documentation and confirms it with a trial piece.

```figure
type: compare
title: Allowances used in the running case
rowhead: Joint or edge
cols: Where | Allowance | Notes
caption: This is an illustration. Values for a real job come from its specification and the shop's trial strips.
- Grooved seam, 6 mm | Longitudinal seams | 18 mm, 9 mm each edge | 3 × seam width
- Lap, riveted and sealed | Elbow segments, collars | 12 mm on one edge | Rivets 4 mm at about 50 mm pitch
- Slip joint, crimped | Duct piece ends | 40 mm of length | No girth change
- Wired edge, 4 mm wire | Sander hood mouth | 11.2 mm | 2d + 4t rule, see below
- Turned-out flange | Fan transition, rectangle end | 20 mm | Corners notched 20 × 20 mm
- * Flange on a round end | Branch collars | 10 mm | Stretches 8% to 13%, see below
```

## Wired edges

An open edge of thin sheet is weak and sharp. Wiring it, by rolling the edge around a steel wire, stiffens the edge and makes it safe to handle, and the running case wires the mouth of the sander hood with 4 mm wire.

A traditional rule for the allowance, stated in Evan Atkins's 1912 trade manual, is twice the wire's diameter plus four times the sheet's thickness. For 4 mm wire in 0.8 mm sheet that is 2 × 4 + 4 × 0.8 = **11.2 mm**.

The rule can be tested against geometry. Wrapped around the wire, the sheet's mean line follows a circle of diameter d + t, here 4.8 mm, whose circumference is π × 4.8 = 15.1 mm. A finished wired edge does not wrap the full circle: the sheet's edge tucks under to about three quarters of a turn, which needs 0.75 × 15.1 = **11.3 mm**. The old rule and the geometry agree to 0.1 mm, which is why the rule has lasted.

Atkins also noted that the rule is exact only for straight edges. On the large end of a cone wired outward, the allowance's edge lies on a larger circle than the wire, and the rule gives slightly too much; on a small end, slightly too little. For the sander hood the effect is small, because the mouth is large compared with the wire, but on a small funnel's spout it matters, and a trial on a scrap of the same cone settles it.

```figure
type: bars
title: Wired edge allowance for 4 mm wire in 0.8 mm sheet
unit: mm
max: 16
caption: The 1912 rule and a three-quarter wrap of the mean line agree closely. A full wrap is more than the edge needs; twice the wire diameter alone is far too little.
- Twice the wire diameter only | 8.0
- * Rule: 2d + 4t | 11.2
- Three-quarter wrap of the mean line | 11.3
- Full wrap of the mean line | 15.1
```

## Flanges on round ends

A flange turned on a round edge changes the length of that edge. Turned outward, the flange's outer edge lies on a larger circle than the pipe and must stretch; turned inward, it lies on a smaller circle and must shrink.

The strain at the flange's edge is the change in diameter divided by the original: for a flange of width w on a pipe of mean diameter D, about 2w ÷ D. A 10 mm outward flange on the Ø250 duct stretches its edge by 20 ÷ 250.8 = **8.0%**. On the Ø150 branch it is 13.3%, and on a Ø450 hood mouth only 4.4%.

Mild galvanised sheet stretches that much in a smooth edge, but a nick or a burr at the edge is a crack starter, so flange edges are deburred before turning, and a flange of more than about 10% stretch is turned in stages with a stretching hammer or a jenny, working round the edge evenly. An inward flange of the same width shrinks by the same percentage, and the sheet has nowhere to go but into wrinkles. Inward flanges on round edges are therefore notched: small V-notches around the flange, close enough together that each tab can close up without buckling.

The same thinking applies to the branch collars of Chapter 4. A collar flanged outward to sit on the main stretches at the saddle's low points and shrinks where it rises over the main's crown, so its flange is notched around the crown and worked carefully at the sides.

## Notches

Notches remove material where layers would pile up or where folds would collide. Three kinds appear in the running case.

1. **Seam-end notches.** Where a grooved seam meets a slip joint or a lap, the seam's four layers of sheet would have to pass through the joint. Cutting back the seam allowance at a 45° angle for the length of the joint leaves only two layers there.
2. **Corner notches.** Where two flanges meet at a corner, as on the transition's rectangle end, each flange is cut back by its own width so that they meet edge to edge instead of overlapping.
3. **Wire notches.** Where a wired edge crosses a seam, the seam allowance is cut back for the wire allowance's width, so that the wire is wrapped by two layers, not six.

A notch must be marked on the pattern, not cut by eye at the bench. Notching too little leaves a lump that will not close; notching too much leaves a hole at the corner.

```figure
type: checklist
title: Notching checks before a pattern is released
caption: Each item is a place where layers pile up. All three appear on the running case's fittings.
- Seam allowance cut back at 45° where it enters a slip joint or lap | two layers through the joint, not four
- Flange corners notched by the flange width | rectangle end of the fan transition
- Seam allowance cut back under a wired edge | wire wrapped by two layers
- V-notches on inward flanges of round edges | spacing set by trial
- x Notches cut by eye at the bench | lumps or holes at corners
```

## From net to gross: the roof piece

The roof piece from Chapter 2 shows how the allowances sit on one pattern. Its net pattern is 787.9 mm around the girth, with generators from 500.0 mm at the seam to 591.3 mm at line 6, measured from its bottom edge to the 20° cut.

1. **Around the girth**, the grooved seam adds 9 mm at each end: the blank is 805.9 mm wide.
2. **At the bottom**, the crimped slip joint adds 40 mm of length: every generator grows by 40 mm, so the blank's seam edge is 540.0 mm long and line 6 reaches 631.3 mm.
3. **At the top**, the cut sits under a flashing collar and needs no allowance, but a 10 mm upstand would be added if the roofer wanted one.
4. **Notches**: the seam allowance is cut back at 45° over the bottom 40 mm, so the crimper does not have to corrugate four layers.

The gross pattern is therefore 805.9 mm wide and 631.3 mm at its tallest, and that is the rectangle the shop allows on the sheet for nesting. The job sheet records both the net dimensions, for checking, and the gross dimensions, for cutting, with each allowance named. A checker who sees 805.9 and 540.0 can tell at once that the seam and the slip joint have both been allowed for, which is exactly what was missing from the short spare in Chapter 2.

## Calibrating with trial strips

Every allowance in this chapter is a starting value. The shop's own value depends on its folder, its grooving tool, its crimper and its sheet, and the way to find it is a **trial strip**: a strip of the same sheet, perhaps 300 mm long, with the allowance marked at each end, folded, seamed or wired exactly as production will do it, then measured.

For a grooved seam, take two strips and mark each with its net line, 9 mm in from the edge to be seamed, and a gauge line 50 mm further in. Form and lock the seam exactly as production will, then measure between the two gauge lines across the seam. With a perfect allowance the two net lines meet inside the seam and the gauge lines are 100.0 mm apart. If they measure 98.5 mm, the shop's tooling takes 1.5 mm more than the geometry says, and the allowance becomes 19.5 mm; if 101 mm, it becomes 17 mm. For a wired edge, wire a strip with the rule's allowance and see whether the wire is fully wrapped; if the edge stands proud, add a millimetre, and if it laps over itself, remove one.

The shop writes the results on a card kept with its patterns: sheet, thickness, joint, tool, allowance. That card is worth more than any table, including the one above.

## The error: wire allowed for, sheet forgotten

This is an illustration. The first sander hood's pattern was given a wiring allowance of 8 mm, twice the wire diameter, by a worker who remembered the first half of the rule. The pattern was otherwise correct.

The shop wires a trial strip from each new pattern's offcut, with the same allowance, before wiring the real piece. On the strip, the 8 mm of sheet wrapped only 8 ÷ 15.1, about 53%, of the way round the wire, about 191°. The edge could be turned over the wire but not tucked under it, and the wire sprang out when the strip was flexed.

The trial caught the fault before the hood itself was wired, but the hood had already been cut, and the 3.2 mm that was missing, the 4t of the rule, could not be added to a cut edge. The pattern was corrected to 11.2 mm and the hood recut. Had the shop cut the batch of three hoods before trialling, all three would have been lost; as it was, one hood and one strip of offcut were the price. The shop now trials the strip from the pattern before cutting any piece, not after cutting the first.

## Exercise: allowances for a branch blank

The Ø150 branch from Chapter 4 is to be made with a 6 mm grooved seam, a 3 mm wired edge at its top end and a 10 mm outward flange at its cut end to sit on the main. Find the blank's width around the girth, the wired edge allowance, and the strain at the flange's edge.

**Worked answer.**

- The mean girth is π × 150.8 = 473.8 mm, and the grooved seam adds 3 × 6 = 18 mm, so the blank is **491.8 mm** wide, with 9 mm of seam allowance on each edge.
- The wiring allowance by the rule is 2 × 3 + 4 × 0.8 = **9.2 mm**, added beyond the top end. A three-quarter wrap of the mean line, 0.75 × π × 3.8 = 8.95 mm, agrees closely. Confirm with a trial strip.
- The flange's edge stretches by about 2 × 10 ÷ 150.8 = **13.3%**, enough to turn in stages and to deburr the edge first. Around the saddle the flange must also be notched where it shrinks over the main's crown.

The seam allowance must be cut back at 45° where it meets the wired edge and the flange, so that neither has to pass through the seam's four layers.
