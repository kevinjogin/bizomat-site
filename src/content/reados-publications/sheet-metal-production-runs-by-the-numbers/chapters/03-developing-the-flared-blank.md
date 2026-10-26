---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: developing-the-flared-blank
order: 3
title: "Developing the flared tray's blank"
description: "Develop the tray's one-piece blank: walls on their slant height, corner edges that check the pattern, 78.69° folds and their allowance, the corner notch, and walls cut to the vertical depth."
draft: false
---

The tote tray is folded from one flat blank: a base with a wall hinged on each side, each wall a trapezoid that leans outward when folded. Developing that blank is a small exercise in true lengths, because the walls slope in two directions at once, and a small exercise in bend allowance, because the folds are not right angles. For a production run, it is also the most important drawing in the job, because every one of five hundred trays is cut from it.

This chapter develops the running case's blank. It finds each wall's true height from the depth and the flare, checks it against the corner edge, works out the fold angle and its bend allowance, shapes the corner notch, adds the rim's hem allowance, and ends with a blank whose walls were drawn to the tray's vertical depth instead of their slant height.

## The walls are trapezoids

This is an illustration. From Chapters 1 and 2, the tray is 600 × 400 mm at the top, 518 × 318 mm at the base, both inside, and 205 mm deep, with every wall flaring 41 mm outward. Each wall is flat, and its top and bottom edges are parallel, so each wall is a trapezoid:

- each **long wall** runs from the base's 518 mm edge to the top's 600 mm edge;
- each **short wall** runs from the base's 318 mm edge to the top's 400 mm edge.

Each wall's true height, measured up its own surface, is not the 205 mm depth. The wall rises 205 mm while moving 41 mm outward, so its **slant height** is √(205² + 41²) = **209.06 mm**. That is the distance between the trapezoid's parallel edges on the blank.

## The corner edge checks the pattern

Each corner of the tray, where a long wall meets a short wall, is a sloping line from a base corner to a top corner. It rises 205 mm and moves 41 mm outward in both directions, so its true length is √(41² + 41² + 205²) = **213.04 mm**.

On the flat blank, each wall's sloping side edge is that corner edge, so each must measure 213.04 mm. A trapezoid with parallel edges of 518 and 600 mm, 209.06 mm apart, has sloping sides of √(41² + 209.06²) = **213.04 mm**, and so does the short wall's trapezoid, 318 and 400 mm on the same slant height. The pattern closes: when the walls are folded up, each pair of neighbouring side edges meets along a corner of the same length.

That agreement is the blank's main check. If a wall's sloping edge does not come out at the corner edge's true length, a wall's slant height or flare is wrong, and the corners will not meet.

```figure
type: formula
title: Wall and corner lengths of a flared tray
formula: slant height = √(H² + f²)        corner edge = √(H² + f² + f²)
caption: The running case tray: depth H = 205 mm, flare f = 41 mm on every wall. Each wall's sloping side on the blank must equal the corner edge.
- H | Depth of the tray, base to top of wall
- f | Flare of each wall, outward over the depth
step: Slant height = √(205² + 41²) = 209.06 mm, the trapezoids' height on the blank
step: Corner edge = √(205² + 41² + 41²) = 213.04 mm
step: Check: a trapezoid of 518 and 600 mm, 209.06 mm high, has sides √(41² + 209.06²) = 213.04 mm
```

## The fold and its allowance

Each wall folds up from the base by the angle between the base and the wall. The wall leans 11.31° out from vertical, so its inside angle with the base is 90° + 11.31° = 101.31°, and the fold, measured as the change of direction from flat, is **78.69°**.

A fold in 1.2 mm sheet to a small inside radius consumes length according to its bend allowance, as READOS's [Sheet Metal Parts by the Numbers](/reados/publications/sheet-metal-parts-by-the-numbers/neutral-axis-k-factor-and-bend-allowance/) explains. This is an illustration. With an inside radius of 1.2 mm and the shop's K-factor of 0.44 for this sheet and tooling, the bend allowance of a 78.69° fold is 1.3734 × (1.2 + 0.44 × 1.2) = **2.373 mm**. The inside setback, from the inside's virtual sharp to the bend's tangent line, is 1.2 × tan(78.69° ÷ 2) = **0.984 mm** on each side of the fold.

Dimensioning the base and walls to the inside, each flat portion is its inside dimension less one inside setback at the fold, and the fold adds its bend allowance. So each fold adds 2.373 − 2 × 0.984 = **0.406 mm** to the blank compared with simply adding the inside dimensions. Small, but on a blank that will be cut five hundred times, it is drawn in.

## The rim's hem

The rim is a 12 mm closed hem turned outward: the top 12 mm of each wall is folded back flat against the wall's outside. This is an illustration; the shop's hem allowance, found from trial strips, is 12 mm of blank for a 12 mm hem in 1.2 mm sheet. Each wall's flap on the blank therefore runs 209.06 + 0.406 + 12 = **221.47 mm** from the base's edge to the hem's edge.

The hem stiffens the rim, removes a sharp edge where hands lift the tray, and gives the rim a rounded top, as Chapter 4 discusses. Its allowance is added along the trapezoid's wide edge, so each wall's flap becomes a trapezoid with a 12 mm strip along its top. At each end, the hem strip is cut back square to the wall's side edge by a few millimetres, so that the hems of neighbouring walls meet at the corner without overlapping when the walls are folded up. The cut-back is found on the first trial blank and then drawn on the cutting file, because a hem that collides with its neighbour at a corner stops that corner closing onto its lap tab.

## The corner notch

When the walls are folded up, their sloping edges meet at the corners. On the flat blank, those edges do not meet: between the end of a long wall and the end of a short wall, at each corner of the base, there is a notch.

Each wall's sloping edge leans outward from square to the base edge by atan(41 ÷ 209.06) = **11.10°**. At a base corner, the base takes 90°, and each wall's side edge leans 11.10° further round than square, so the notch between the two walls' edges on the flat blank is 360° − 90° − 2 × (90° + 11.10°) = **67.81°** wide.

That notch is where the corner joint goes. The running case closes each corner with a lap tab, a 15 mm strip added along the short wall's sloping edge, which folds round the corner and is riveted to the long wall, as Chapter 4 sets out. The tab is drawn on the blank inside the notch, along the short wall's edge, and the notch's remaining gap is cut away.

```figure
type: svg
title: The tray's one-piece blank
alt: A cross-shaped blank. In the centre, a rectangle for the 518 by 318 mm base. On each side, a trapezoidal wall flap wider at its outer edge, with a strip along the outer edge for the hem. At each corner of the base, a V-shaped notch between the flaps, with a narrow lap tab along each short wall's edge.
caption: This is an illustration at about 0.25 scale. The blank is 960.9 × 760.9 mm overall. Fold lines are dashed; the hems are the outer strips.
viewbox: 0 0 280 230
body:
<rect class="bx" x="75" y="75" width="130" height="80"/>
<path class="bxa" d="M75 75L65 23H215L205 75Z"/>
<path class="bxa" d="M75 155L65 207H215L205 155Z"/>
<path class="bxa" d="M75 75L23 65V165L75 155Z"/>
<path class="bxa" d="M205 75L257 65V165L205 155Z"/>
<path class="lf" d="M65 26H215M65 204H215M26 65V165M254 65V165"/>
<path class="li dsh" d="M75 75H205M75 155H205M75 75V155M205 75V155"/>
<path class="fs" d="M23 65L26 62L68 72L75 75Z"/>
<path class="fs" d="M257 65L254 62L212 72L205 75Z"/>
<path class="fs" d="M23 165L26 168L68 158L75 155Z"/>
<path class="fs" d="M257 165L254 168L212 158L205 155Z"/>
<text class="txs" x="112" y="120">Base 518 × 318</text>
<text class="txs" x="108" y="52">Long wall</text>
<text class="txs" x="28" y="120">Short</text>
<text class="txs" x="96" y="224">960.9 × 760.9 overall</text>
```

## Features drawn on the blank

Every feature that can be cut while the blank is flat is drawn on it, because cutting after folding is slow and inaccurate.

The **handle slots**, 120 × 30 mm with 15 mm end radii, are on the short walls, their top edges 40 mm below the rim measured vertically. On the flat flap, distances up the wall are slant distances, so 40 mm vertically is 40 ÷ cos 11.31° = **40.8 mm** along the wall. Measured from the fold line, the rim is 209.06 + 0.406 = 209.47 mm up the flap, so the slot's top edge is drawn 209.47 − 40.8 = **168.7 mm** from the fold line, and its centre 15 mm lower, centred across the short wall's width at that height.

The **denesting lugs** are pressed after cutting, but their positions are marked on the blank with small etched crosses, one near each corner on the long walls, so that the press operator places them consistently.

The **fill line**, specified as 20 mm below the rim, is etched lightly inside each long wall, 20 ÷ cos 11.31° = 20.4 mm down the slant from the rim, so that it survives coating as a visible line. An etched line costs nothing on a laser that is cutting the blank anyway, and it puts the fill line in exactly the place the capacity calculation assumed.

## Why one piece

The tray could be made from five pieces, a base and four walls, welded or riveted at every edge. The shop makes it from one blank because folding is faster than joining, the folded edges between base and walls are watertight and stiff without any joint, and one blank is one nest and one cut. Only the four corners need joining, and the lap tabs make each corner a simple riveted joint.

The price of one piece is the waste in the notches and around the cross-shaped outline, which Chapter 5 deals with, and the folding sequence, which must avoid the walls already folded fouling the press brake. Both are worth paying for a product made in hundreds.

## The fold sequence

The press brake folds the blank in this order, each step chosen so that nothing folded earlier gets in the way.

1. **Hems**, on all four flaps while the blank is flat: each hem is folded to an acute angle, then closed flat, two hits per hem.
2. **Lap tabs**, on the short walls' edges, folded slightly so that they will sit outside the long walls.
3. **Long walls**, folded up to 78.69° from flat, with the base held against the back gauge.
4. **Short walls**, folded last. With the long walls already standing up, the punch must fit between them, so the shop uses a segmented punch set to 318 mm, the base's width, and tall enough to clear the 205 mm deep walls.

Folding the short walls last also brings their lap tabs round the corners onto the long walls' outsides, ready for riveting. The sequence, the punch length and the punch height are recorded on the routing, because a different order on a later run would find a wall fouling the tooling partway through the batch.

## The overall blank

Adding up, the blank is 518 + 2 × 221.47 = **960.9 mm** long and 318 + 2 × 221.47 = **760.9 mm** wide, a cross shape whose four arms are the walls. Its area, the base plus four trapezoidal walls, the hem strips and the four lap tabs, less the two handle slots, is about **0.579 m²**, so each tray weighs about **5.45 kg** in 1.2 mm steel before coating. The blank fills 79% of the 960.9 × 760.9 mm rectangle that encloses it; the corners of that rectangle, outside the notches, are the waste that Chapter 5's nesting tries to use.

```figure
type: compare
title: The blank's dimensions and their checks
rowhead: Dimension
cols: Value | Check
caption: This is an illustration. Each number has a check that does not repeat the arithmetic that produced it.
- Wall slant height | 209.06 mm | √(205² + 41²)
- Wall side edge on the blank | 213.04 mm | equals the corner edge's true length
- Fold from flat | 78.69° | 90° less the wall's 11.31° lean
- Added length per fold | 0.406 mm | bend allowance 2.373 less two setbacks of 0.984
- * Flap from fold to hem edge | 221.47 mm | 209.06 + 0.406 + 12
- Overall blank | 960.9 × 760.9 mm | base plus two flaps each way
- Notch at each base corner | 67.81° | 360° − 90° − 2 × 101.10°
```

## The error: walls drawn to the vertical depth

This is an illustration. The first blank drawn for the tray used the specification's depth, 205 mm, as each wall's height on the blank, without converting it to the slant height. Every wall was therefore 4.06 mm short on the blank.

Folded up at its 78.69°, a wall 205 mm long reaches only 205 × cos 11.31° = **201.0 mm** above the base, and its top edge is 518 + 2 × 205 × sin 11.31° = **598.4 mm** long instead of 600. The tray came out 4 mm shallow and about 1.6 mm small across the top. Its capacity to the fill line, 20 mm below its lowered rim, was about **35.6 litres**, below the 36-litre requirement that Chapter 2 had built a margin for.

The fault was found on the first article, whose measured depth was 201 mm. The corner-edge check would have found it on paper: a trapezoid of 518 and 600 mm, 205 mm high, has sloping sides of √(41² + 205²) = 209.06 mm, not the corner edge's 213.04 mm, and the mismatch shows that the walls are not their true height. The shop's blank checklist now requires the corner-edge check on every flared product before the cutting file is released.

```figure
type: checklist
title: Blank checks before the cutting file is released
caption: The checks that would have caught the shallow tray on paper.
- Wall heights are slant heights, not the vertical depth | 209.06 mm
- Every wall's side edge equals the corner edge | 213.04 mm on both walls
- Bend allowance from the shop's K-factor for this sheet and tooling | 0.406 mm added per fold
- Hem allowance from trial strips | 12 mm
- Corner notch and lap tab drawn | 67.81° notch, 15 mm tab on the short walls
- x Wall height taken from the depth | the 201 mm tray, 35.6 L to the fill line
```

## Exercise: the half-size tray's blank

The half-size tray from Chapter 2's exercise is 400 × 300 mm at the top, 225 mm deep, with walls flaring 45 mm, in the same 1.2 mm sheet with the same fold and hem allowances. Find its slant height, corner edge, base, flap length and overall blank.

**Worked answer.**

- Slant height: √(225² + 45²) = **229.46 mm**.
- Corner edge: √(225² + 45² + 45²) = **233.83 mm**, which each wall's sloping side must equal.
- Base: 400 − 90 = **310 mm** by 300 − 90 = **210 mm**.
- Flap from fold to hem edge: 229.46 + 0.406 + 12 = **241.87 mm**.
- Overall blank: 310 + 2 × 241.87 = **793.7 mm** by 210 + 2 × 241.87 = **693.7 mm**.

The flare angle is the same as the full-size tray's, atan(45 ÷ 225) = 11.31°, so the fold is again 78.69° and the notch again 67.81°. Only the lengths change, which means the press brake's tooling and the corner jig's angles can be shared between the two products.
