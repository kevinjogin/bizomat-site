---
book: architectural-sheet-metal-by-the-numbers
chapterSlug: mitres-at-any-angle
order: 3
title: "Mitres at any angle"
description: "Develop a profile mitre for any corner angle with the factor 1 ÷ tan(φ/2), measure a real corner on site, handle splays and polygons, and see what a square cut does on a corner that is not square."
draft: false
---

Square corners are the easy case. Buildings also have splayed corners, bay windows, polygonal kiosks, walls that meet at odd angles because the site boundary does, and corners meant to be square that are not quite. A profile turning any of those corners needs a mitre cut for the actual angle. A square mitre forced onto a corner of 91.5° leaves a tapering gap; one forced onto a 135° splay does not fit at all. The geometry is a short step from Chapter 2: one factor, calculated from the angle, scales every ordinate.

This chapter develops mitres for any corner angle. It derives the ordinate factor, tabulates it for common angles, measures a corner angle on site with a tape, applies the method to W-40's western parapet corner, which is 1.5° out of square, covers splays and polygons, and deals with acute corners, where ordinates grow larger than the profile. The failure case is the western corner as it would have been with square-cut pieces.

## The ordinate factor

Picture two runs of a profile meeting at a corner where their faces make an angle **φ** in plan, measured inside the building for an external corner. The mitre plane bisects that angle, so it makes an angle of φ/2 with each run. A fold line running parallel to one face, at a distance d from it, meets the bisecting plane at a point which, measured along the run from the corner line, is **d ÷ tan(φ/2)** away.

For a square corner, φ/2 is 45°, tan 45° is 1, and the ordinate is simply d, as Chapter 2 found. For any other angle, every ordinate from Chapter 2 is multiplied by the same factor.

```figure
type: formula
title: Cut ordinates for a mitre at any corner angle
formula: ordinate = d × k        where k = 1 ÷ tan(φ ÷ 2) and φ is the angle between the two faces
caption: This is an illustration. For φ = 90°, k = 1 and the ordinate equals the projection. Corners more open than square have k less than 1; sharper corners have k greater than 1.
- Square corner, φ = 90° | k = 1 ÷ tan 45° = 1.000
- Western parapet corner, φ = 91.5° | k = 1 ÷ tan 45.75° ≈ 0.974
- Splay or octagon corner, φ = 135° | k = 1 ÷ tan 67.5° ≈ 0.414
step: coping roof-side drip at d = 255: square 255 mm; at 91.5° about 248.4 mm; at 135° about 105.6 mm
```

The table below gives k for angles a fabricator meets often, with the ordinates for the coping's innermost points.

```figure
type: compare
title: The ordinate factor and the coping's largest ordinates, by corner angle
cols: Factor k | Ordinate at d = 240 | Ordinate at d = 255
caption: This is an illustration. Each ordinate is d × k, measured back from the corner line. At 60°, ordinates exceed the profile's own projection, so the mitre runs far along the blank.
- 60°, an acute corner | 1.732 | 415.7 mm | 441.7 mm
- *90°, square | 1.000 | 240.0 mm | 255.0 mm
- 91.5°, W-40's western corner | 0.974 | 233.8 mm | 248.4 mm
- 120°, a hexagon | 0.577 | 138.6 mm | 147.2 mm
- 135°, a splay or octagon | 0.414 | 99.4 mm | 105.6 mm
- 150°, a twelve-sided figure | 0.268 | 64.3 mm | 68.3 mm
```

## Measure the real angle

A corner's angle is measured on site, not taken from the drawing. The simplest method needs only a tape. From the corner, measure **1,000 mm** along each face and mark both points. Then measure the straight distance between the marks, the chord **c**. The angle follows from **φ = 2 × arcsin(c ÷ 2,000)**.

For a perfect square corner, the chord is about **1,414.2 mm**. At W-40's western corner, the site measurer recorded a chord of **1,432.6 mm**, which gives φ ≈ **91.5°**. At the eastern corner, the chord was **1,424 mm**, about 90.8°, within the half-degree the fabricator accepts as square for a profile this size. A longer baseline, 2,000 mm along each face, makes the measurement less sensitive to small errors in marking, and on a large, critical corner a laser or total station does better still.

The measurement is taken along the line the profile will follow: for a coping, along the top of the parapet at its outer face, because the render or blockwork lower down may lean or bulge.

## The western corner

W-40's western parapet corner is **91.5°**. Its coping corner pieces are set out exactly as in Chapter 2, with each ordinate multiplied by **0.974**. The ordinates across the stretch-out become −14.6, 0, 0, 233.8, 233.8 and 248.4 mm, at the same stations as before. The lap tab follows the new cut line, and the pieces are marked "W corner, 91.5°", with their hands, so they cannot be confused with the eastern pair.

The difference from a square cut is small on the street face and grows towards the roof side: 6.6 mm at the roof-side drip on each piece. On a 270 mm deep cut line, that is the difference between a tight joint and a visible, tapering gap, as the failure case shows.

## Splays and polygons

A **splayed corner**, where a building's corner is cut off by a short diagonal wall, turns the profile through two corners of 135° each instead of one of 90°. A regular octagonal kiosk has eight 135° corners; a hexagonal one, six of 120°. At each corner, the ordinates are the projections multiplied by k for that angle: 0.414 for 135°, 0.577 for 120°.

For W-40's canopy fascia, with projections 0, 40, 40, 90, 90 and 70 mm, the 135° ordinates are **0, 16.6, 16.6, 37.3, 37.3 and 29.0 mm**. They are small, because at an open angle the two runs barely turn and the mitre crosses the profile at a shallow slant.

A useful check on a polygon: the angles of a closed polygon's corners add up to (n − 2) × 180° for n sides, so an octagon's eight corners add up to 1,080°, or 135° each if regular. If site measurements of a polygon's corners do not add up to the right total, at least one measurement is wrong.

## Check the corner once it is fixed

A mitre that was set out correctly can still be installed badly, with one piece pushed along too far or rotated on its fixings. After fixing, the installer checks each corner with a tape. Measured along the run from the outside corner line, the mitre at each fold should sit at its ordinate: on W-40's western corner, about 233.8 mm at the inner edge of the top flat on each run. If one run reads 228 mm and the other 240 mm, the joint is closed but the corner has been shifted along one run, which shows as a step at the next lap and an uneven reveal against the parapet below. The fix is to release the fixings, slide the pieces into position and refix them, before the sealant cures.

The same check confirms the corner looks right from the street. A correctly made mitre appears as a single straight line on the bisector of the corner, running across the whole profile without kinks. A kink at a fold means the ordinate at that fold was wrong; a gap opening along the line means the angle was. Both are much easier to correct on the bench than on the building, which is why the mock-up in Chapter 2 is worth its half hour on every new profile and every unusual angle.

## Acute corners

At corners sharper than 90°, the factor exceeds 1 and the ordinates become longer than the projections. At **60°**, the coping's roof-side drip would be cut back **441.7 mm** from the corner line, so the mitre runs a long way along the blank. Two practical consequences follow. The corner pieces must be cut from longer blanks. And the two pieces meet along a long, shallow joint that is harder to seal, so acute corners often use a separate folded corner cap over two square-cut ends instead of a true mitre. The designer decides which, case by case.

## Turning a corner in two steps

A large profile turning a square corner can look heavy, with a long diagonal joint across a deep face. Architects sometimes prefer to turn the corner in two steps: two 135° mitres with a short straight piece between them, which softens the corner and echoes a splay without changing the wall. The same factor applies at each step, 0.414 for 135°, so each mitre is shallow and easy to seal. The short middle piece has a mitre at each end, one left and one right, and its length along its outer face sets the size of the softened corner. The fabricator calculates it from the chosen splay width, cuts it from the same profile and marks both ends.

The two-step corner uses three pieces instead of two and two joints instead of one, so it costs more. It also spreads the corner's movement between two joints, which suits long copings, as Chapter 7 explains.

## Lap tabs on angled mitres

The lap tab from Chapter 2 follows the cut line, whatever the angle. At open angles such as 135°, the cut line is short and shallow, and a 25 mm tab is easy to fold and rivet. At acute angles, the cut line is long and steep across the blank, and the tab becomes a long, narrow strip that is hard to fold neatly around the profile's folds. Relief notches at each fold position, cut slightly deeper on acute mitres, let the tab follow the profile without buckling. The rule about which piece carries the tab does not change: it goes on the piece that will be underneath the water flowing across the joint.

## Ordinates in a spreadsheet

The calculation is ideal for a spreadsheet. The fabricator keeps one sheet per profile, with the points' stations and projections in columns, the corner angle in a single cell, and the ordinates calculated as d × 1 ÷ tan(φ/2). Changing the angle updates every ordinate at once, and the sheet prints a cutting card for the bench with the profile's name, the corner, the angle, the hand and the ordinates in millimetres. Where a shop cuts profiles on a CNC machine or a folding line with a programmable back gauge, the same table becomes the cutting program's input, and the numbers are never retyped.

The spreadsheet is checked once against a hand calculation for a square corner, where every ordinate must equal its projection, and against a mock-up for one other angle. After that, it can be trusted for any angle, provided the angle itself is measured correctly.

## Different profiles meeting at a corner

The method assumes the same profile on both runs. Sometimes the profiles differ: a coping meeting a capping of another depth at a step in the parapet, for instance. Then the two runs' fold lines do not meet in pairs, and the joint becomes a transition piece or a stopend with a separate cover. That is a design decision to make at the drawing stage, not something to discover on site.

```figure
type: checklist
title: Before cutting a mitre for a corner that is not square
caption: This is an illustration of the fabricator's checks for W-40's corners.
- Corner angle measured on site along the profile's line, with a chord over at least 1,000 mm | recorded with the date and measurer
- Polygon angles add up to (n − 2) × 180° | catches a misread measurement
- Factor k = 1 ÷ tan(φ/2) calculated and applied to every ordinate | not estimated by eye
- Pieces marked with corner, angle and hand | "W corner, 91.5°, LH"
- ? Acute corner: true mitre or square ends with a corner cap | designer's decision
- x Using square-cut corner pieces from stock on a corner more than about half a degree out | leaves a tapering gap
```

## A failure case: square pieces on a corner that was not

This is an illustration. Had the fabricator cut W-40's western corner pieces square, as originally drawn, the street faces would have met cleanly. Moving across the profile, the gap would have opened steadily, reaching about **6.6 mm** on each piece at the roof-side drip, a total of about **13.2 mm** between the two pieces at the inner edge.

That is not hypothetical. The fabricator had seen it on an earlier job, where square corner pieces were fitted to a parapet corner that turned out to be about 1.5° out. The gap was filled with sealant, which looked acceptable for a year and then cracked as the coping moved, letting water into the top of the wall and staining the render below.

The detection on that earlier job came from the stain. On W-40, it came from the site measure before cutting, which is the point of measuring. The correction is in the method: every corner is measured, any corner more than about half a degree from its drawn angle is developed for its measured angle, and sealant is never used to close a mitre gap.

## How this applies to a small Australian business

Measure every corner's angle on site with a tape and a chord, along the line the profile will follow. Multiply every square-mitre ordinate by 1 ÷ tan(φ/2) for the measured angle. Check polygons by their angle sum. For acute corners, decide early between a long true mitre and square ends with a corner cap. Mark each piece with its corner, angle and hand. And never close a mitre gap with sealant: re-cut the piece.

## Exercise: an octagonal kiosk

The site's gatehouse is a regular octagonal kiosk whose roof edge carries W-40's canopy fascia profile all the way round. What angle is each corner, what is the factor k, and what are the cut ordinates at stations 0, 40.0, 80.0, 150.7, 280.7 and 316.8 mm? How many corner pieces are needed, and of which hands?

**Worked answer.** A regular octagon's corners add up to **(8 − 2) × 180° = 1,080°**, so each is **135°**. The factor is **k = 1 ÷ tan 67.5° ≈ 0.414**. The ordinates are the projections times 0.414: **0, 16.6, 16.6, 37.3, 37.3 and 29.0 mm**. With eight corners and two pieces at each, sixteen mitred ends are needed. If each of the eight straight lengths is cut with a mitre at both ends, there are eight pieces, each with one left-hand and one right-hand end; marking the two ends of each piece clearly avoids the mix-up described in Chapter 2.
