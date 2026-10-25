---
book: drafting-geometry-by-the-numbers
chapterSlug: exact-geometry-starts-with-a-datum
order: 1
title: "Exact geometry starts with a datum"
description: "Why CAD geometry must be exact rather than close, how to choose an origin and datums for a part, and how chained values and display rounding quietly move features."
draft: false
---

On a drawing board, geometry only had to be good enough for the dimensions to explain it. A line drawn half a millimetre long did no harm, because the machinist worked from the numbers, not the pencil. CAD changed that bargain. The file is now the part: it is read by laser cutters, CNC programs, nesting software and inspection machines, and none of them reads the dimensions. If the geometry is wrong, the part is wrong, however good the drawing looks.

This chapter sets up the habits that the rest of the book depends on. It explains what "exact" means in a CAD file, how to choose an origin and datums so that every point has a clear reference, and how two everyday shortcuts, chaining rounded values and trusting the displayed precision, move features without anyone noticing. It introduces the running case, the motor mounting plate, and places its main features.

## What exact means in a CAD file

A CAD system stores each point as a pair of floating-point numbers, normally in double precision, which carries about 15 to 16 significant digits. For a part measured in millimetres, that is far finer than any machine can cut. Even a site drawing with coordinates in the millions of millimetres keeps a resolution of about a millionth of a millimetre. The stored geometry can therefore be exact for every practical purpose.

What the system does not do is make your inputs exact. It stores precisely what you give it. If you type 23.3 where the design needs 23.333…, it stores 23.3 with sixteen digits of confidence. If you pick a point by eye near an intersection, it stores wherever the cursor happened to be. Exactness is a property of the method, not of the software.

Three sources of input are exact:

1. **Typed values that are themselves exact**, such as 220 or 45, or values typed to enough decimal places that the remaining error is negligible.
2. **Object snaps to existing geometry**, such as endpoint, midpoint, centre, intersection, tangent and perpendicular, which take the stored value of the geometry they snap to.
3. **Constructions that the software calculates**, such as offsets, fillets, arrays and tangent arcs, which inherit the precision of their inputs.

Everything else, including picking on the grid without snap, picking near a line and eyeballing a midpoint, is approximate. The approximation may be tiny on the screen and still be enough to leave a profile open, a hole off its pitch circle or a dimension that reads 70.71 when the designer meant 70.711.

```figure
type: compare
title: Exact and approximate ways to place a point
cols: Exact? | Typical error | Use it for
caption: The CAD file stores every input to about 16 significant digits. Only the method decides whether the input was right.
- Typed whole-number coordinate | Yes | None | Datum features and round dimensions
- Typed value rounded to 1 decimal | No | Up to 0.05 mm per entry, accumulating | Never for derived values
- *Object snap to existing geometry | Yes | None | Ends, centres, intersections, tangents
- Construction command (offset, fillet, array) | Yes, if its inputs are exact | Inherited | Repeated and dependent geometry
- Pick on screen without snap | No | Depends on zoom; often 0.01 to 1 mm | Sketching only, then replace
```

## The origin and the datums

Every part needs a reference from which its geometry is defined. In CAD that reference has two layers that should be chosen together.

The **origin** is the point (0, 0) of the drawing's coordinate system. It costs nothing to place it well, and placing it badly costs time on every entry. The best origin is a feature that is itself fixed by the design and from which most other features can be reached by simple numbers: a corner of the blank, the centre of a main bore or the intersection of two machined faces.

The **datums** are the features from which the part is dimensioned, made and inspected. They come from function: the faces that locate the part in its assembly, the holes that take its fasteners, the bore that carries its shaft. On a finished drawing the datums are labelled and the dimensions run from them. In the geometry, the datums are what you should snap to and measure from while you construct the rest.

The two need not be the same feature, but the geometry is easier to build and to check when they are. If the dimensions on the finished drawing all run from the bottom and left edges, building the geometry with its origin at the bottom left corner means that every typed coordinate is also a dimension, and any reader can check the file against the drawing by reading coordinates.

## The running case: choosing the origin

This is an illustration. The motor mounting plate is a 10 mm mild steel plate, laser cut from sheet. Its outline is 220 mm long and 140 mm high, with a 45 × 45 mm chamfer at the top right and an R40 corner at the top left. Its functional features are:

- a Ø60 bore for the motor spigot, centred 110 mm from the left edge and 70 mm from the bottom;
- four Ø9 holes for the motor flange bolts on a 100 mm pitch circle around the bore, at 45°, 135°, 225° and 315°;
- a Ø11 pivot hole at 20 mm from the left and bottom edges, for an M10 pivot bolt;
- an arc slot 11 mm wide, centred on the pivot at a radius of 180 mm and running from 5° to 20°, for an M10 locking bolt.

Functionally, the plate has two datums that matter: the pivot hole, about which it turns, and the motor bore, which locates the motor. The bolt holes are related to the bore, and the arc slot to the pivot. The outer edges matter mainly for clearance and appearance.

The drafter considered two origins. Putting the origin at the bore centre would make the motor holes simple (±35.355 mm in each direction) but would make the outline and pivot awkward negative numbers. Putting it at the bottom left corner of the outline makes the outline, bore and pivot all simple positive numbers, and the motor holes and slot follow from the bore and pivot by calculation.

The drafter chose the bottom left corner, named it A, and recorded the decision in a note on the construction layer: "Origin A = bottom left corner of blank. Functional datums: pivot hole P (20, 20) and bore O (110, 70)." The next reader of the file now knows where to start.

```figure
type: svg
title: The motor mounting plate on its coordinate system
alt: The plate outline drawn on x and y axes from the origin at the bottom left corner. The outline runs 220 mm along the bottom, up 95 mm on the right, along a 45 by 45 mm chamfer, left along the top at 140 mm, round an R40 corner and down the left edge. A large Ø60 bore sits at 110, 70 with four small holes on a dashed 100 mm pitch circle. A small pivot hole sits at 20, 20 and a curved slot near the right edge is centred on the pivot.
caption: This is an illustration. Origin A is the bottom left corner; P and O are the functional datums. Drawn at half the scale of the coordinates shown.
viewbox: 0 0 600 350
body:
<path class="lf" d="M60 310H540M60 310V10"/>
<text class="txs" x="530" y="328">x</text>
<text class="txs" x="44" y="20">y</text>
<path class="bx" d="M60 310H500V120L410 30H140A80 80 0 0 0 60 110Z"/>
<circle class="bxi" cx="280" cy="170" r="60"/>
<circle class="cl" cx="280" cy="170" r="100"/>
<circle class="bxi" cx="350.71" cy="99.29" r="9"/>
<circle class="bxi" cx="209.29" cy="99.29" r="9"/>
<circle class="bxi" cx="209.29" cy="240.71" r="9"/>
<circle class="bxi" cx="350.71" cy="240.71" r="9"/>
<circle class="bxa" cx="100" cy="270" r="11"/>
<path class="bxi" d="M469.59 237.67A371 371 0 0 0 448.63 143.11A11 11 0 0 0 427.95 150.63A349 349 0 0 1 447.67 239.58A11 11 0 0 0 469.59 237.67Z"/>
<path class="cl" d="M458.63 238.62A360 360 0 0 0 438.29 146.87"/>
<circle class="fa pulse" cx="60" cy="310" r="5"/>
<text class="txa" x="40" y="335">A (0, 0)</text>
<text class="txb" x="104" y="300">P (20, 20)</text>
<text class="txb" x="250" y="174">O (110, 70)</text>
<text class="txs" x="505" y="320">B (220, 0)</text>
<text class="txs" x="505" y="116">C (220, 95)</text>
<text class="txs" x="400" y="22">D (175, 140)</text>
<text class="txs" x="120" y="22">E (40, 140)</text>
<text class="txs" x="2" y="106">F (0, 100)</text>
<path class="la draw" pathLength="1" d="M100 270L280 170"/>
```

## Chained values and accumulated error

The most common way that exact intent becomes inexact geometry is chaining: placing each feature relative to the previous one with a rounded value. Each step introduces a small error, and the errors add.

Consider a simple case outside the plate. A designer wants seven equally spaced holes across a 140 mm span, so six equal pitches of 140 ÷ 6 = 23.333… mm. A drafter who types a relative distance of 23.3 six times ends at 6 × 23.3 = **139.8 mm**, 0.2 mm short of the end hole. The first pitch is out by only 0.033 mm, but the last hole is out by six times that.

The same holes placed from the datum, with coordinates 23.333, 46.667, 70, 93.333, 116.667 and 140, are each within 0.0005 mm of their intended positions, and the errors do not add, because each position is calculated from the datum independently.

There are three ways to avoid chained error:

- **Place from the datum.** Calculate each position from the origin or a datum feature, as the coordinate inspection will.
- **Let the software divide.** Commands that divide a line into equal parts, or arrays that space items by total length, calculate the exact pitch.
- **Carry enough decimals.** If you must chain, type the pitch to at least four decimal places for a part like this, so that the accumulated error stays below a thousandth of a millimetre.

Chaining is not always wrong. A row of holes whose function is their spacing, such as a hinge pattern, is properly dimensioned as a chain on the drawing. The geometry should still be built exactly, so that the chain on the drawing and the coordinates in the file agree.

```figure
type: bars
title: Position error of the last of seven holes across 140 mm
unit: mm
max: 0.2
caption: Six pitches of 23.333… mm. Chaining a rounded pitch multiplies its rounding error by six; placing each hole from the datum does not.
- Chained, pitch typed as 23.3 | 0.2
- Chained, pitch typed as 23.33 | 0.02
- Chained, pitch typed as 23.3333 | 0.0002
- *Each hole placed from the datum to 3 decimals | 0.0005
```

## Displayed precision is not stored precision

A CAD system displays coordinates and dimensions to a set number of decimal places, typically two or three for millimetre drawings. The display hides the stored value. A point stored at 74.6446609 displays as 74.64 at two decimal places and 74.645 at three. Nothing is wrong with that, as long as you remember that the display is rounded and the geometry is not.

The trap is to copy a displayed value back in as input. If the drafter lists a motor hole, reads 74.64 and types it as the start of a new construction, the new geometry is 0.0047 mm from the hole. That will never matter to a laser cutter, but it does matter to the software: the new line will not meet the hole's centre, a later snap may pick the wrong point, and a profile that should close may have a gap.

The rule is simple. Take derived values from the geometry by snapping, not from the display by reading. When a number must be typed, calculate it to full precision from the design values, not from a displayed result.

## The error: a plate that would not close

This is an illustration. The drafter's first version of the outline was drawn as separate lines and an arc. When the file went to the cutting contractor's nesting software, it was rejected: "open contour". The outline looked closed on screen at every zoom the drafter tried.

The drafter used the software's inquiry tools to list the endpoints of each segment. The arc at the top left ran from (40, 140) to (0, 100), as intended, but the left edge had been drawn upwards from (0, 0) to a point picked by eye near the arc's end, which was stored as (0.0000, 99.9960). The gap was 0.004 mm. At the highest useful zoom it was invisible.

The fix took a minute: the drafter redrew the left edge with an endpoint snap to the arc's end, then joined the six segments into a single closed polyline. The software reported the polyline as closed and gave an area, which is a quick confirmation that a boundary has no gaps. The lesson went into the office's checklist, which Chapter 9 develops: every cutting profile is joined into one closed boundary before release, and the join is confirmed by asking the software for the area.

```figure
type: steps
title: Building the plate outline so that it is exact
caption: This is an illustration. Each step uses typed exact values or snaps; nothing is picked by eye.
- Set the origin | Bottom left corner A at (0, 0); note the datums P and O on a construction layer
- Type the straight edges | A (0, 0) to B (220, 0) to C (220, 95), then the chamfer to D (175, 140) and the top edge to E (40, 140)
- Add the R40 corner | Arc centred at (40, 100) from E (40, 140) to F (0, 100)
- Close with snaps | Left edge from F to A using endpoint snaps at both ends
- *Join and confirm | Join into one polyline; the software reports it closed with an area of 29,444.14 mm²
```

## Recording construction so others can check it

Exact geometry is easier to trust when its construction can be seen. Three habits help.

**Keep construction geometry.** Lines, circles and points used to locate features, such as the pitch circle of the motor holes or the centreline of the arc slot, belong on a construction layer that does not plot. Deleting them saves nothing and removes the evidence of how the feature was placed.

**Name the datums.** A short note in the file, on a non-plotting layer, saying which features are the origin and the datums, saves the next person from reverse-engineering the drafter's intent.

**Prefer relationships to coincidences.** A hole that is centred on the pitch circle because it was arrayed about the bore will move with the bore if the design changes. A hole typed at a coordinate that happens to lie on the pitch circle will not. In 2D drafting the software rarely maintains such relationships automatically, so the drafter should at least build them so that they are true and visible.

## How much precision is enough

Exact does not mean unlimited decimal places on the drawing. The geometry should be exact; the drawing should show the precision the function needs. For the motor plate, the drafter will show the bore position to one decimal place with a tolerance, and the hole positions with a position tolerance on the pitch circle. The geometry under those dimensions is still built from 50 × cos 45° = 35.35533… mm, not from 35.4 mm.

The difference between the two can matter. Rounding the motor hole offsets to 35.4 mm places each hole at a radius of 35.4 × √2 = 50.063 mm, 0.063 mm outside the pitch circle. Rounding to 35.36 mm gives 50.0066 mm, and typing 35.355 mm gives 49.9995 mm. For a clearance hole cut by laser, all three are acceptable in practice. For a precision pattern inspected against a position tolerance, the first one uses up part of the tolerance before the part is even cut. Building the geometry exactly removes the question.

## Exercise: the rounded bolt pattern

A colleague drew the four motor holes by typing offsets of ±35.4 mm from the bore centre in both directions. The drawing will call up a position tolerance of Ø0.1 mm on the pitch circle for these holes, because the motor supplier's flange is a close fit. Is the geometry acceptable, and what should be done?

**Worked answer.** The intended offset is 50 × cos 45° = 35.3553 mm. With 35.4 mm, each hole lies at a radius of 35.4 × √2 = 50.0632 mm, so its centre is 0.0632 mm outside its true position. A position tolerance is a diameter, so the error uses 2 × 0.0632 = **0.126 mm** of the zone, which is already more than the Ø0.1 mm allowed. A perfectly made part cut from this file would fail inspection.

The diagonal between opposite holes shows the same thing: 2 × 35.4 × √2 = 100.126 mm instead of 100 mm, and the adjacent spacing reads 70.80 mm instead of 70.71 mm.

The geometry is not acceptable. The fix is to redraw the holes by construction rather than typing: draw the 100 mm pitch circle about the bore centre on the construction layer, place one hole by polar coordinates at 50 mm and 45° from the bore centre, and array it four times about the bore. Then check by inquiry that the diagonal is 100.000 mm and the adjacent spacing 70.711 mm. Chapter 5 covers polar arrays in detail.
