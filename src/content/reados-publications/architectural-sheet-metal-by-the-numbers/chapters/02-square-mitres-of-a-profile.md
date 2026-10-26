---
book: architectural-sheet-metal-by-the-numbers
chapterSlug: square-mitres-of-a-profile
order: 2
title: "Square mitres of a profile"
description: "Develop the mitre where a profile turns a square corner: cut ordinates equal to each point's projection, external and internal corners, handed pieces, lap tabs and a mock-up before cutting."
draft: false
---

When a coping, fascia or capping turns a corner, the two lengths must meet in a joint that follows the corner's bisecting plane. On the building it looks like a single diagonal line across the profile. On the flat blank, before folding, it is a cut line that wanders up and down across the stretch-out, because each part of the profile sits at a different distance from the wall and so reaches the corner at a different point along its length. Developing that cut line used to be done on a drawing board by projecting lines from a full-size profile. It can be done just as well with a table of numbers, and the numbers are easier to check.

This chapter develops square mitres, where two runs of a profile meet at a 90° corner in plan, using W-40's parapet coping. It explains why each point's cut ordinate equals its projection, sets out the external corner's cut line, covers internal corners and the handing of left and right pieces, adds the lap tab that makes a mitre weatherproof, and uses a mock-up to prove the pattern. The failure case is a batch of corner pieces all cut to the same hand.

## The corners on the parapet

W-40's front parapet does not stop at the building's front corners. It **returns 2 m** along each side wall, so the coping turns two **external** corners, one at each end of the street front. Each corner joins a run along the front with a run along the side, meeting at 90° in plan.

The coping's profile, from Chapter 1, is described here by its distance **d inwards from the street face**, the outer face of the street leg, and its height h. Its six points are: the street drip edge at d = −15, the foot of the street leg at d = 0, the top of the street leg at d = 0, the inner edge of the top flat at d = 240, the foot of the roof leg at d = 240, and the roof-side drip edge at d = 255. The drip on the street side projects 15 mm outwards, beyond the face, so its d is negative.

## Why the ordinate equals the projection

Picture the two runs of coping meeting at the corner. Each fold line in the coping runs parallel to its wall, at its own distance d from the outside face. On the front run, a fold line at d = 240 lies 240 mm in from the street face; on the side run, the matching fold line lies 240 mm in from the side face. The two lines meet at a point on the diagonal through the corner. Measured along either run, that point is **240 mm** short of the outside corner line, because the diagonal of a square corner moves in by the same distance in both directions.

That is the whole rule for a square mitre: each point of the profile is cut **back from the corner line by its own projection d**. Points on the outside face, at d = 0, run right to the corner line. Points further in stop short of it by their distance in. The drip, at d = −15, runs 15 mm past the corner line.

On the flat blank, the cut line is set out from a base line square across the blank, representing the outside corner line. At each fold position along the stretch-out, the cut is measured back from the base line by that point's d. Between folds, along a straight flat, d changes evenly, so the cut is a straight line between the two ordinates.

```figure
type: compare
title: Cut ordinates for the coping's external square mitre
cols: Station on the stretch-out | Projection d | Cut ordinate from the corner line
caption: This is an illustration. Stations are running distances along the 445.2 mm girth from the street drip edge. A negative ordinate runs past the corner line; a positive one stops short of it.
- Street drip edge | 0 mm | −15 | 15 mm past the line
- Foot of the street leg | 15.0 mm | 0 | on the line
- Top of the street leg | 115.0 mm | 0 | on the line
- Inner edge of the top flat | 355.2 mm | 240 | 240 mm short
- Foot of the roof leg | 430.2 mm | 240 | 240 mm short
- *Roof-side drip edge | 445.2 mm | 255 | 255 mm short
```

```figure
type: svg
title: The external mitre cut on the flat coping blank
alt: A flat strip drawn lengthwise across the page with five vertical dashed fold lines. A heavy cut line starts at the left edge slightly above the base line, steps down to the base line at the first fold, runs along the base line to the second fold, then slopes steadily away from the base line across the top flat to the third fold, runs parallel past the roof leg, and finishes slightly further away at the right edge.
caption: This is an illustration of the cut line, with the stretch-out running left to right and the ordinates measured down from the corner line. The sloping part crosses the top flat, where each point is further in from the street face than the last.
viewbox: 0 0 640 290
body:
<path class="ln" d="M58 28H560"/>
<text class="tx txs" x="430" y="20">corner line, ordinate 0</text>
<path class="ln dsh" d="M58 28V270M178 28V270M466 28V270M556 28V270"/>
<path class="la draw" pathLength="1" d="M40 16L58 28H178L466 220H556L574 232"/>
<text class="tx txs" x="10" y="12">drip −15</text>
<text class="tx txs" x="90" y="46">street leg, 0</text>
<text class="tx txs" x="250" y="150">top flat, 0 to 240</text>
<text class="tx txs" x="470" y="214">roof leg, 240</text>
<text class="txa" x="480" y="252">drip 255</text>
<text class="tx txs" x="40" y="286">stations 0, 15, 115, 355.2, 430.2, 445.2 mm</text>
```

## Why height does not appear

Only the projection d enters a square mitre. The height h of each point, which locates it on the profile drawing, plays no part in the cut ordinates; it has already done its work in setting the stretch-out stations. That is why the coping's 10 mm fall across its top makes no difference to the mitre: the inner edge of the top flat is 240 mm in from the street face whether it is 10 mm lower or not. The fall changes the length of the flat, 240.2 mm instead of 240, and so the stations beyond it, but not the ordinates.

The same is true of any profile turning a corner in a horizontal plane. Height starts to matter only when one of the runs is inclined, which is the raking mitre of Chapter 4, where it changes the profile itself.

## External and internal corners

At an **external** corner, the outside of the building turns away from you, and the profile's outer points are the longest. The cut ordinates are measured back from the outside corner line, as above.

At an **internal** corner, where two walls meet inside an angle, the corner line is the line where the two fixing faces meet, and d is measured **outwards** from those faces. The rule is the same: each point is cut back from the corner line by its d. But because d now grows outwards, the points nearest the wall, at the smallest d, reach right into the corner, and the points furthest out stop short of it. A quick check avoids confusion: at an external corner, the visible face of the profile is the longest part of the piece; at an internal corner, it is the shortest. The rule never changes; only the face that d is measured from does.

## Handed pieces

The two lengths meeting at a corner are mirror images. The front run's corner piece ends with a mitre cut one way; the side run's corner piece ends with a mitre cut the other way. Using the same cut line, one is set out with the stretch-out reading left to right, and the other with it reading right to left. They are a **left-hand** and a **right-hand** piece.

W-40's two front corners need four corner pieces: at the eastern corner, a front piece and a side piece; at the western corner, the same pair reversed. Two are left-handed and two right-handed. Each pattern is marked with its hand and its corner, and each cut piece is marked the same way in pencil on its back face before it leaves the bench.

## The lap tab

Two mitred edges butted together leave a hairline gap that water will find. A weatherproof mitre has a **lap tab**: one of the two pieces is cut with an extra strip, typically 20 to 25 mm wide, following its mitre line, which is folded or simply lapped under the other piece and riveted and sealed. The tab goes on the piece that will be **underneath** where the water runs, so water flowing across the joint runs over the lap, not into it. On the coping, water runs across the top flat towards the roof side, and along each run towards the corners and away from them, so the tab is placed on the side piece, lapping under the front piece, and sealed.

W-40's corner patterns add a **25 mm** tab to each side-run piece, following its cut line exactly, with a small relief notch at each fold so the tab folds cleanly with the profile.

```figure
type: steps
title: Setting out a square mitre on the bench
caption: This is an illustration of the fabricator's sequence for each corner piece. The numbers come from the ordinate table, not from a drawing scaled by eye.
- Mark the stretch-out | fold positions as running distances across the blank
- Draw the corner line | square across the blank, near one end
- Mark the ordinates | at each fold position, measure back from the corner line by its projection d
- Join the points | straight lines between adjacent ordinates, because d changes evenly along each flat
- Add the lap tab | a 25 mm strip parallel to the cut line, on the piece that laps underneath
- *Mark the hand | left or right, and which corner, on the pattern and on the back of each piece
```

## Cut, fold and join

The mitre is cut on the flat blank before folding, with hand or power shears for the sloping parts and a guillotine for straight cuts, so the cut edges stay clean and the coating is not scorched. Cut edges are deburred lightly. The piece is then folded, and the folds near the mitre are checked, because a fold that starts slightly off position at the end of a blank shows immediately at a corner.

On site, the pieces are dry-fitted, then the lap is sealed with a bead of neutral-cure sealant compatible with the coating and riveted at about 40 mm centres along the tab. Excess sealant is tooled off the visible face. Sealant in a mitre lap keeps water out of the joint; it is not there to fill a gap, and a mitre that needs sealant to close it has been set out or folded wrongly.

## Mock up the corner

Before cutting all four corner pieces, the fabricator cut and folded one pair from offcuts, each about 300 mm long, and fitted them together on the bench at a framing square. The mitre closed along its whole length with no gap greater than about 1 mm, the tab lapped neatly under the front piece, and the faces lined up. A mock-up takes half an hour and proves three things at once: the ordinates, the hand and the tab.

The mock-up also exposed a detail that the numbers alone would not: at the drip, where two kicked-out edges meet at the corner, the overlapping drips needed a small cut-back so they did not clash. That cut-back was added to the pattern.

## Corners that are not quite square

Real buildings are rarely exactly square. Before cutting, the site measurer checked each parapet corner with a large square and by measuring diagonals. The eastern corner was within half a degree of square; the western one was nearly 1.5° out. A square mitre on a corner 1.5° out leaves a tapering gap of several millimetres across a 270 mm deep cut. Chapter 3 shows how to calculate the mitre for any angle, and the western corner's pieces were developed for the measured angle instead.

## A failure case: four left hands

This is an illustration. On an earlier job with eight corner pieces, the pattern for one corner piece was drawn and checked, and an apprentice was asked to cut eight from it. The apprentice laid the pattern on each blank the same way up and cut eight identical pieces.

On site, the first corner went together well: one piece from the batch, and its partner turned over... except that a coping cannot be turned over, because its profile has a top and a bottom and a street side and a roof side. Every piece was the same hand. Half of them could not pair with anything.

The detection came at the first corner on site, where the second piece would not fit against the first. The investigation found that the pattern had not been marked with its hand, and that the cutting instruction had said "eight corner pieces" rather than "four left, four right". The correction was to cut four new pieces of the opposite hand. The four mis-cut pieces went to stock for a future job of the same profile. The shop's patterns are now always marked "LH" or "RH" with a sketch of the corner, and cutting lists state the number of each hand.

## How this applies to a small Australian business

Treat a square mitre as a table of numbers: each point's cut ordinate is its projection from the face the corner is measured from. Set out from a square corner line, join the ordinates with straight lines, and add a lap tab on the piece that sits underneath the water flow. Remember that external and internal corners run in opposite directions, and that every corner needs a left-hand and a right-hand piece, marked as such. Check the building's corners are actually square, and mock up one pair before cutting the batch.

## Exercise: an internal fascia corner

A fascia with W-40's canopy fascia profile turns an **internal** square corner where the canopy meets a projecting wall. Its points have projections from the fixing board of A 0, B 40, C 40, D 90, E 90 and F 70 mm, at stations 0, 40.0, 80.0, 150.7, 280.7 and 316.8 mm. What are the cut ordinates, and what are they measured from? Which part of the fascia is shortest at the corner?

**Worked answer.** For any square mitre, the ordinates equal the projections: **0, 40, 40, 90, 90 and 70 mm** at the six stations. At an internal corner, they are measured back from **the line where the two fixing boards meet**, with d measured outwards from the boards. The back of the profile, at A with d = 0, runs right to that line. The main face DE, at 90 mm, stops **90 mm** short of it, and is therefore the **shortest** part at the corner, which is what the eye expects of the visible face at an internal corner. The drip at F stops 70 mm short. Each internal corner still needs a left-hand and a right-hand piece, with a lap tab on the piece that sits underneath.
