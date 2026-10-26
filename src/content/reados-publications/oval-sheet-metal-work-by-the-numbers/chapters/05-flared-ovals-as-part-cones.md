---
book: oval-sheet-metal-work-by-the-numbers
chapterSlug: flared-ovals-as-part-cones
order: 5
title: "Flared ovals as part cones"
description: "Why each wall of a flared oval is part of a right cone, the four cones share one half-angle of 9.46°, their apexes lie 1.8 m and 9.45 m below the rim, and a pattern radius taken as the apex depth."
draft: false
---

A flared round vessel is a frustum of a cone, and its pattern is a band of a sector. A flared oval looks harder, but it is not, provided it is a four-centre oval whose top and bottom are struck from the same centres. Then each of its four walls is part of a right cone, with its axis vertical through one of the four centres, and each develops by radial lines exactly like a round reducer. The only new ideas are that the four cones have very different apexes, and that two of those apexes are many metres away.

This chapter shows why the walls are part cones, works out the running case's cone half-angle, slant height, apex positions and pattern radii, explains why the four cones meet smoothly along straight seam lines, and ends with a pattern radius taken as the cone's vertical apex depth instead of its slant.

## Why the walls are cones

Take one end arc of the trough. At the top it is an arc of 300 mm radius centred on the end centre; at the bottom, an arc of 225 mm radius centred on the same point, directly below. Between them, Chapter 4 found, every horizontal section is an arc from the same centre, its radius shrinking steadily from 300 to 225 mm. A surface whose horizontal sections are circles about one vertical axis, with radii changing linearly with height, is a right cone. So the end wall is part of a right cone with its axis vertical through the end centre.

The same holds for each side wall, with its axis vertical through a side centre, 1,125 mm beyond the trough's centreline, and radii shrinking from 1,575 to 1,500 mm. The trough's wall is therefore made of four part cones: two small, steep-looking ones at the ends and two large, flat-looking ones along the sides.

## One half-angle for all four

Every wall moves inward by the same 75 mm over the same 450 mm depth, so every cone's wall leans at the same angle from vertical: atan(75 ÷ 450) = **9.46°**. That is each cone's half-angle, the angle between its generators and its axis.

The distance along the wall from rim to bottom, the **slant height**, is the same everywhere too: √(450² + 75²) = **456.21 mm**. A rule laid down the wall at any point, square to the rim, measures 456.21 mm.

The cones differ in where their apexes are. A cone's radius shrinks to zero at its apex, at the rate of 75 mm per 450 mm of depth, one sixth:

- each **end cone**'s radius of 300 mm at the rim shrinks to zero 300 × 6 = **1,800 mm** below the rim, 1,350 mm below the bottom;
- each **side cone**'s radius of 1,575 mm shrinks to zero 1,575 × 6 = **9,450 mm** below the rim, 9,000 mm below the bottom.

```figure
type: formula
title: Geometry of the trough's part cones
formula: half-angle α = atan(f ÷ H)        slant s = √(H² + f²)
formula: apex depth below the rim = r_top ÷ tan α        pattern radius = r ÷ sin α
caption: The running case: depth H = 450 mm, flare f = 75 mm all round. All four cones share α; their apexes and pattern radii differ.
- α | Half-angle of every wall cone
- r | Radius of a wall arc at the rim or the bottom
step: α = atan(75 ÷ 450) = 9.46°; sin α = 0.1644
step: Slant height s = 456.21 mm on every wall
step: End cones: apex 1,800 mm below the rim; pattern radii 300 ÷ 0.1644 = 1,824.8 and 225 ÷ 0.1644 = 1,368.6 mm
step: Side cones: apex 9,450 mm below the rim; pattern radii 9,580.4 and 9,124.1 mm
```

## Pattern radii

A cone's pattern is drawn from its apex, with the radius to each edge equal to that edge's distance from the apex measured along the wall, not vertically. For a right cone, that distance is the edge's radius divided by sin α. For the running case:

- **end walls**: 300 ÷ 0.1644 = **1,824.8 mm** to the rim and 225 ÷ 0.1644 = **1,368.6 mm** to the bottom;
- **side walls**: 1,575 ÷ 0.1644 = **9,580.4 mm** to the rim and 1,500 ÷ 0.1644 = **9,124.1 mm** to the bottom.

The difference between each pair is the slant height, 456.2 mm, as it must be. The end walls' patterns can be drawn with a long trammel. The side walls' cannot: their apex is nearly 9.6 metres from the rim edge, and Chapter 6 marks them by offsets from chords instead.

```figure
type: compare
title: The trough's four part cones
rowhead: Wall
cols: Axis through | Rim radius | Apex below rim | Pattern radius, rim and bottom
caption: All four cones lean 9.46° from their axes and have a 456.21 mm slant. The end cones are small and close; the side cones are large and distant.
- End, each | End centre, x = ±600 mm | 300 mm | 1,800 mm | 1,824.8 and 1,368.6 mm
- * Side, each | Side centre, y = ∓1,125 mm | 1,575 mm | 9,450 mm | 9,580.4 and 9,124.1 mm
```

## Where the cones meet

At each tangent point of the oval, an end cone meets a side cone. The line that joins the tangent point at the rim to the tangent point at the bottom runs from (741.2, 264.7) at the rim to (705.9, 198.5) at the bottom, in plan, and its length in space is √(35.3² + 66.2² + 450²) = **456.21 mm**, the slant height. Both points lie on the line through the end centre and the side centre, so this straight line is a generator of the end cone and of the side cone at the same time.

The two cones therefore share a whole straight line, and along it they share a tangent plane: the wall turns smoothly from one cone to the other with no crease. That makes the line the natural place for a seam. The wall is cut into four pieces along the four shared generators, each piece a single cone, and when they are joined, the seams lie along straight lines and the wall is smooth across them.

```figure
type: svg
title: The trough's wall, divided into four part cones
alt: Plan view of the flared oval trough: the outer oval is the rim, the inner oval the bottom. Four short straight lines cross the wall at the four tangent points, joining the rim's tangent points to the bottom's. They divide the wall into two end pieces and two side pieces. Dashed lines run from the end and side centres through the tangent points.
caption: This is an illustration at 0.15 scale. The seam lines are shared generators of the neighbouring cones, so the wall is smooth across them.
viewbox: 0 0 400 240
body:
<path class="bx" d="M311.2 80.3A45 45 0 0 1 311.2 159.7A236.25 236.25 0 0 1 88.8 159.7A45 45 0 0 1 88.8 80.3A236.25 236.25 0 0 1 311.2 80.3Z"/>
<path class="bxi" d="M305.9 90.2A33.75 33.75 0 0 1 305.9 149.8A225 225 0 0 1 94.1 149.8A33.75 33.75 0 0 1 94.1 90.2A225 225 0 0 1 305.9 90.2Z"/>
<path class="la" d="M311.2 80.3L305.9 90.2M311.2 159.7L305.9 149.8M88.8 80.3L94.1 90.2M88.8 159.7L94.1 149.8"/>
<path class="lf dsh" d="M290 120L320 63.8M290 120L320 176.2"/>
<circle class="fa" cx="290" cy="120" r="3"/>
<circle class="fa" cx="110" cy="120" r="3"/>
<text class="txs" x="170" y="68">Side piece</text>
<text class="txs" x="316" y="124">End</text>
<text class="txs" x="40" y="124">End</text>
<text class="txs" x="170" y="185">Side piece</text>
<text class="txs" x="150" y="122">Bottom</text>
```

## The whole wall's pattern angle

There is a neat check on the four patterns together. Each piece's pattern angle is its arc's angle in plan times sin α: the end pieces' 123.86° become 123.86 × 0.1644 = **20.36°** each, and the side pieces' 56.14° become **9.23°** each. Added up, the four patterns span 2 × 20.36 + 2 × 9.23 = **59.18°**.

That is exactly 360° × sin α, the pattern angle of a single right cone with the same 9.46° half-angle. The arc angles in plan add to 360°, and each is scaled by the same sin α, so their patterns add to the same total as one cone's would. If the four pieces' pattern angles do not add to 360° × sin α, one of them has been calculated with the wrong radius or angle.

The check also shows that the whole wall is developable: laid out in order, the four pieces join along their shared seam lines into one continuous strip, curving more tightly through the end pieces and gently through the sides. A shop with sheet long enough, more than 4.4 metres, could cut the wall in one piece with a single seam. The running case uses four pieces because they handle, nest and roll more easily, not because the geometry requires it.

## Forming part cones

Each wall piece is formed to its cone, not to a cylinder. The end pieces taper strongly: their rim and bottom radii are 300 and 225 mm, a ratio of 1.33, so the bottom edge must be curved a third more tightly than the rim edge. They are formed on slip rolls with the bottom edge fed slightly behind the rim edge, so that it travels less, or by bumping on a brake along the radial lines marked from the pattern.

The side pieces barely taper: 1,575 and 1,500 mm, a ratio of 1.05. They are rolled almost as if they were cylinders, with a slight lead on the rim edge, and much of their final shape comes from being pulled to the bottom's flange and the rim's rod at assembly.

The radial lines marked on each pattern, Chapter 6's division lines, are the forming guide. On a correctly formed cone, every radial line becomes a straight generator running square to the rim, and a straightedge laid along it touches the wall from rim to bottom. A wall that is dished across a generator has been rolled as a cylinder, or with the edges fed unevenly, and it will not meet the bottom's flange evenly.

## Why the same centres matter

All of this depends on the bottom oval being struck from the same four centres as the top, with every radius reduced by the same flare. If the bottom were a four-centre oval of different proportions, say with an end radius of 250 mm instead of 225, its centres would not lie under the top's, the wall between them would not be part of any cone, and every pattern would have to be triangulated, as for a transition between different shapes.

So the specification for a flared oval states its flare as a single amount all round, and the bottom's radii follow: end radius 300 − 75 = 225 mm and side radius 1,575 − 75 = 1,500 mm. A drawing that gives the bottom as "1,650 × 750 oval" without its end radius leaves room for exactly the inconsistency that would turn four simple cones into a triangulation job.

## Checking the lean

Because every wall leans at the same 9.46°, one bevel gauge set to that angle checks the whole trough. Held against the wall with its stock on the rim's plane, the gauge's blade should lie along the wall at every point round the oval: at the ends, where the wall curves tightly, and along the sides, where it is nearly flat. A wall that leans more at the ends than the sides, or the reverse, has been formed with the wrong flare on one piece, and the rim will not be level when the bottom is.

The same check can be made with numbers. At any height z above the bottom, every point of the wall should be 75 × z ÷ 450 mm, one sixth of z, outside the bottom's outline. At the fill line, 400 mm up, that is 66.7 mm; at the rim, 75 mm. A square standing on the bottom plate and a rule measuring out to the wall at those heights confirms the flare at a dozen points round the trough in a few minutes.

## Different flares at ends and sides

Some oval vessels flare more at the ends than the sides, to make them easier to pour from or to nest. Then the end cones and side cones have different half-angles, and their seam lines are no longer shared generators: the two cones meet along a curve, with a crease between them. Such vessels are made, but their seams carry a fold, and their patterns are developed piece by piece with the seam curve found by intersection. The running case avoids that by flaring evenly, and so do most oval troughs and baths.

## The error: the apex depth used as the pattern radius

This is an illustration. A drafter setting out the end pattern took the distance from the rim to the cone's apex as the vertical 1,800 mm, and swung the rim arc at 1,800 mm and the bottom arc at 1,800 − 450 = 1,350 mm. The pattern's angle was then set by the rim arc's length, 648.5 mm ÷ 1,800 mm, about 20.64°.

The vertical apex depth is not the distance along the wall. The pattern radii should have been 1,824.8 and 1,368.6 mm, and the angle 20.36°. The drafter's pattern was a band only 450 mm wide where the wall is 456.21 mm along its slant, so the end pieces came out **6.2 mm short** from rim to bottom, and their bottom edges were too long for the bottom's arc.

The fault showed at the first trial assembly: the end pieces did not reach the bottom plate's flange where the side pieces did. The check that finds it on paper is the one this chapter keeps returning to: the difference between a cone pattern's two radii must equal the wall's slant height, 456.2 mm, not its depth. The drafter's 450 mm difference was the vertical depth, and it gave the error away. The same confusion between a cone's vertical height and its slant runs through every chapter of round pattern work; on a flared oval it simply appears four times, once for each cone.

```figure
type: checklist
title: Part-cone checks before drawing the patterns
caption: Each check confirms that the walls really are cones and that their patterns are measured along the wall.
- Top and bottom struck from the same four centres | flare 75 mm all round
- One half-angle for all four cones | 9.46°
- Pattern radii are radius ÷ sin α, not radius ÷ tan α | 1,824.8 not 1,800 mm
- Difference of each pattern's radii equals the slant height | 456.2 mm
- Seams on the shared generators at the tangent points | four straight seam lines
- x Vertical apex depth used as the pattern radius | end pieces 6.2 mm short
```

## Exercise: a steeper flare

A deeper-sided trough of the same top, 1,800 × 900 mm with a 300 mm end radius, is to flare 100 mm all round over the same 450 mm depth. Find the walls' half-angle and slant height, and the pattern radii of the end and side walls at the rim and bottom.

**Worked answer.**

- Half-angle: atan(100 ÷ 450) = **12.53°**; slant height √(450² + 100²) = **460.98 mm**; sin α = 100 ÷ 460.98 = 0.2169.
- Bottom radii: end 300 − 100 = 200 mm, side 1,575 − 100 = 1,475 mm.
- End wall pattern radii: 300 ÷ 0.2169 = **1,382.9 mm** and 200 ÷ 0.2169 = **922.0 mm**.
- Side wall pattern radii: 1,575 ÷ 0.2169 = **7,260.4 mm** and 1,475 ÷ 0.2169 = **6,799.4 mm**.

Each pair differs by 460.98 mm, the new slant height. A steeper flare brings every apex closer, so the patterns curve more and the side walls' apex, though still over 7 metres away, is closer than the running case's 9.6 metres.
