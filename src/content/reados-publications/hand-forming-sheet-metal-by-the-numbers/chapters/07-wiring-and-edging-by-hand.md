---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: wiring-and-edging-by-hand
order: 7
title: "Wiring and edging by hand"
description: "Size a wired edge's allowance three ways and confirm it with a trial strip, work out the wire's length, wire an edge by hand, and catch a wired edge that stayed straighter than the ring."
draft: false
---

A wired edge wraps the edge of the sheet around a wire, leaving a smooth, round, strong rim. It is the traditional finish for the open edges of pails, trays, bins, hoods and guards, and it is still the best way to make an edge that hands will hold and knocks will not bend. On HF-01, the bottom edge of each mounting ring is wired, so that the housing stands on a round, robust edge rather than a cut one.

The 1918 trade text listed in the references gives wiring a chapter of its own, with rules for the allowance, a table for tin plate and a step-by-step method for wiring by hand and by machine. The methods have not changed much; the materials have. This chapter sizes HF-01's wire allowance, works out the wire's length, sets out the hand method in the order the workshop uses it, and records what happened when the wire was put in at the wrong stage.

## The wire allowance

The wire allowance is the extra width of sheet, beyond the finished edge, that wraps around the wire. Too little and the wire shows, the edge does not close and its cut edge stands proud and sharp. Too much and the edge cannot be closed tightly, leaving a loose, bulging bead.

There are three estimates. Two are the old shop rules: two and a half times the wire's diameter, written for thin tin plate; and twice the wire's diameter plus four times the sheet's thickness, written for heavier sheet. The third is geometry: the sheet's mid-thickness line wraps about three-quarters of a turn round a circle of diameter d + t before its edge tucks against the wall.

```figure
type: formula
title: Wire allowance for HF-01's ring, three ways
formula: A ≈ 2.5 d     A ≈ 2d + 4t     A ≈ 0.75 π (d + t)
caption: This is an illustration for a 3.15 mm aluminium wire in 1.6 mm sheet. The first rule ignores thickness and suits only thin sheet; the second and third agree within about 1.5 mm. A trial strip settled the value at 12.0 mm.
- d | Wire diameter, 3.15 mm
- t | Sheet thickness, 1.6 mm
step: 2.5 × 3.15 = 7.9 mm
step: 2 × 3.15 + 4 × 1.6 = 12.7 mm
step: 0.75 × π × (3.15 + 1.6) = 11.2 mm
step: Trial strip, wrapped and measured: 12.0 mm
```

The [seams, edges and notches](/reados/publications/sheet-metal-patterns-by-the-numbers/seams-edges-and-notches/) chapter of Sheet Metal Patterns by the Numbers compares the same rules for thin 0.8 mm duct sheet, where they agree closely. The spread between the rules here is a reminder that each was written for a material. With 1.6 mm sheet, which is thick by tin-plate standards, the first rule would leave the wire half exposed. The 1918 text's own advice is the right one: bend a narrow strip of the job's sheet tightly around a piece of the job's wire and measure how much it took. This is an illustration. The workshop's trial strip took 12.0 mm, between the two better estimates, and that figure went on the planning sheet.

### The wire

The wire should be of a metal that will not set up a galvanic cell with the sheet in damp conditions. For HF-01's aluminium ring, the workshop uses aluminium wire. Steel wire, traditional in tin-plate work, would corrode the aluminium around it where moisture collects in the curl. The wire's diameter is a matter of proportion and stiffness: a 3.15 mm wire suits a 30 mm band of 1.6 mm sheet, and a much thinner wire would be lost in the curl.

Wire from a coil has a set, a curvature left by coiling, and it must be straightened before it is laid into a straight edge, or pre-curved to the ring's diameter if it goes into a curved one, as this chapter's error shows. Its ends are cut square and deburred so that they butt neatly inside the curl. Where the edge must be continuous and strong, the butt can be brazed or welded before the curl is closed; on HF-01's ring, held closed by its riveted lap, a plain butt inside the curl is enough, because the curl itself holds the two ends in line.

## The wire's length

The wire runs around the ring inside the curl, and the curl lies just outside the band's wall. Its centre is therefore at a larger radius than the band's mid-thickness, by half the wire's diameter plus half the sheet's thickness, 1.575 + 0.8 = 2.375 mm.

This is an illustration. The band's mid-thickness diameter is 321.6 mm, so the wire's centre lies on a circle of 321.6 + 2 × 2.375 = **326.35 mm**, and its length is π × 326.35 = **1,025.3 mm**, about 15 mm longer than the band's mid-thickness length of 1,010.3 mm. The wire is cut to 1,025 mm and its ends butt together when the ring closes; at the riveted lap, the wire runs through the curl of the overlapping end.

```figure
type: stats
title: Wiring numbers for one HF-01 ring
caption: This is an illustration. The strip's width is 30 mm of band plus 20 mm of flange plus the wire allowance, before the bend allowance for the band-to-flange fold is subtracted.
- *12.0 mm | Wire allowance | from a trial strip
- 1,025 mm | Wire length | centre on a 326.35 mm circle
- 62 mm | Strip width before bend allowance | 30 + 20 + 12
```

### Notching at the lap

Where the ring's ends overlap at the riveted lap, both ends carry a curl. If both curls ran to the ends, the lap would be four layers of sheet thick around the wire, too bulky to close. The traditional answer, which the 1918 text shows on its patterns, is to notch the wire allowance off the overlapping end for the length of the lap, so that only one curl surrounds the wire at the joint. For HF-01's 12 mm lap, the workshop cuts a 12 × 12 mm notch at the corner of the strip before any forming. Forgetting the notch is a classic way to spoil a wired joint, and it is the reason the notch is drawn on the strip's flat pattern rather than left to memory.

## Wiring by hand

A wiring machine, a pair of grooved rolls driven by a crank, closes the curl around the wire quickly and evenly. Many workshops do not have one, and the hand method works on any length.

```figure
type: steps
title: Wiring an edge by hand
caption: This is an illustration of the workshop's method for HF-01's ring, after the traditional sequence. A mallet and a stake are enough; a wiring machine, if available, does the last step faster.
- Mark | scribe the allowance line 12.0 mm from the edge, outside the finished band, and cut the lap notch
- Fold | bend the allowance to 90° along the line on the folder or over a bench edge
- Turn | bend it further with a mallet over a stake to an open hook, about two-thirds closed
- Insert | lay the wire into the hook, starting at one end and holding it in with a clamp
- Close | tap the edge over the wire with the mallet, a short length at a time, along the strip
- Set | tighten the curl against the wire with a setting hammer or the wiring rolls until the wire cannot turn
```

Two points make the difference between a neat edge and a poor one. The fold in the second step must be on the line, straight and at a consistent height, because every later step follows it; a wavy fold produces a wavy wired edge. And the closing must work progressively from one end, so that the wire is captured gradually and does not spring out.

## The error: a wired edge straighter than the ring

This is an illustration. The first ring to survive shrinking, after the scrapped one of Chapter 5, was wired in the flat, following the traditional sequence for straight-sided articles: wire the straight strip, fold the flange, then curve the band into a ring by shrinking the flange, as Chapter 5 describes. When the shrinking was complete, the ring's top, at the flange, measured close to 320 mm in every direction. Its wired bottom edge did not: it measured between 324 and 326 mm across, and the band flared slightly outwards from top to bottom.

The wire was the cause. A wired edge is a small, stiff bead at the bottom of the band. Shrinking the flange at the top curved the top to the right radius, but the bottom edge, stiffened by the wire, resisted bending and stayed a little straighter, so the bottom of the ring came out larger than the top. In traditional work this was avoided by forming the body in rolls, with the wired edge running in a groove at the end of the rolls so that it was bent along with the rest. HF-01's ring, curved by shrinking rather than rolling, had no such help.

That ring was corrected by working the wired edge round a grooved stake with a mallet, bending it in a little at a time, until the bottom matched the top within 1 mm. That took about 40 minutes. For the second ring, the workshop changed the sequence: the allowance was folded and turned into an open hook while the strip was flat, the wire was pre-curved separately on a former to about its 326 mm diameter, the ring was shrunk to shape with the hook still open, and the pre-curved wire was then laid into the hook and the curl closed by hand around the finished ring. The second ring's top and bottom matched within 1 mm without correction.

The lesson is not that the old sequence was wrong. Wiring in the flat is right for parts that are then rolled, because the rolls bend the wired edge with the rest. It is wrong when the part is curved by something that acts only on the other edge. **A wired edge is a stiffener, and a stiffener resists every later bend.** Any sequence that bends the part after wiring must bend the wired edge deliberately.

## Other hand edges

How much each of these edges adds to a part's stiffness, as distinct from its safety and robustness, is worked out in the chapter on [openings, curls and wired edges](/reados/publications/stiffening-sheet-metal-by-the-numbers/openings-curls-and-wired-edges/) in Stiffening Sheet Metal by the Numbers. Not every edge needs a wire. The common alternatives, in increasing order of strength:

- **Deburred cut edge.** Filed and smoothed, it is adequate where the edge is hidden or not handled, such as the trimmed rim of HF-01's dome, which sits on the ring's flange.
- **Single hem.** The edge folded back flat on itself through 180°, removing the cut edge from reach. It adds little out-of-plane stiffness.
- **Double hem.** Folded twice, giving three layers and a thicker, more rounded edge.
- **Curl or false wire.** The edge rolled into a tube without a wire, which looks like a wired edge but is softer and dents more easily.
- **Wired edge.** The strongest and most robust edge for a free rim.

The 1918 text works through these in turn for tin plate, with allowances for each. The method for any of them is the same as for the wire: estimate the allowance, then confirm it with a trial strip in the job's material.

## Wiring a curved edge

A wired edge on a ring or a round article is not quite a straight edge bent round. The outer side of the curl lies further from the ring's axis than the band itself, by about the wire's diameter plus the sheet's thickness, and so it must be longer. On HF-01's ring, the outermost part of the curl is about 3.15 + 1.6 = 4.75 mm outside the band's mid-thickness radius of 160.8 mm, so it is stretched by about 4.75 / 160.8 = **3.0%**. That is easily within the sheet's capacity.

The same arithmetic sets a limit on small articles. On a can or a cup 60 mm across, with the same wire and sheet, the curl's outer side is stretched by about 4.75 / 30 = 16%, enough to crack a cut edge that has not been smoothed. That is why small round ware is wired with thin wire in thin sheet, and why the old tables pair each wire size with a sheet thickness. For a flared article, such as a pail or a hood whose wall slopes outwards, the edge is also on a cone rather than a cylinder, and the 1918 text's advice is to wire it after forming, with the edge already at its final shape, for the same reason HF-01's second ring was closed late.

## Checking a wired edge

A good wired edge passes four simple checks, which the workshop records for each ring:

1. **The wire is fully enclosed.** No wire shows along the edge, and the sheet's cut edge is tucked against the wall, not standing proud.
2. **The wire is tight.** Gripping a short length of the edge and twisting, the wire does not turn in its curl. A loose wire rattles, works the curl open and lets moisture in.
3. **The edge is straight and even.** Sighted along its length, the wired edge does not wave, and its height above the flange is the same all round, within the workshop's 1 mm.
4. **The ring is round at both ends.** The bottom diameter, measured at four positions, matches the top within 1 mm, which is the check that found this chapter's error.

This is an illustration. Wiring one HF-01 ring by hand, including the trial strip on the first, the pre-curved wire and the checks, took about 1.2 hours against a plan of 1.0 hour. With a wiring machine the closing step would take minutes rather than half an hour, but for two rings the workshop did not consider buying or borrowing one worthwhile.

## Exercise: a heavier wire

The customer asks whether a 4 mm wire would make the ring's bottom edge more robust.

1. Estimate the allowance by the three methods and the wire's length.
2. What else changes?

**Worked answer.**

1. 2.5 × 4 = **10.0 mm**; 2 × 4 + 4 × 1.6 = **14.4 mm**; 0.75 × π × (4 + 1.6) = **13.2 mm**. A trial strip would likely settle near 13 to 14 mm. The wire's centre is now 2.0 + 0.8 = 2.8 mm outside the band's mid-thickness, on a circle of 321.6 + 5.6 = 327.2 mm, so the wire is π × 327.2 = **1,027.9 mm** long.
2. The strip widens by about 1.5 to 2 mm, the lap notch grows to match the new allowance, and the wire itself, whose bending stiffness rises with the fourth power of its diameter, is about 2.6 times stiffer than the 3.15 mm wire. That makes the edge more robust, and it makes the problem in this chapter's error worse: a stiffer wired edge resists curving even more, so the pre-curved wire and late closing of the curl become essential rather than helpful.
