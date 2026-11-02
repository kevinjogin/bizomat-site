---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: every-pattern-starts-with-a-solid
order: 1
title: "Every pattern starts with a solid"
description: "Read a fitting as cylinders, prisms, cones and planes, choose parallel line, radial line or triangulation, and set the conventions the rest of the book uses."
draft: false
---

Before a line is drawn, a pattern maker looks at the fitting and asks what solid it is cut from. A straight duct is a cylinder. A reducer is part of a cone. A hood that is square at the bottom and round at the top is neither, but it can be split into flat triangles and pieces of cones. Once the solid is named, the method of development follows from it, and the pattern is a matter of finding the true length of enough lines on its surface.

This chapter sets out that way of reading a fitting, the three methods of development, the conventions for lines and numbers that the rest of the book uses, and the running case: a branch line of dust extraction ductwork with eight different fittings. It ends with a mistake that comes from naming the solid wrongly.

## Surfaces that unroll and surfaces that do not

A pattern can be exact only if the surface it makes is **developable**: it can be rolled or folded out flat without stretching or shrinking any part of it. Planes are developable. So are cylinders and cones of any cross-section, because each is made of straight lines, its **generators**, that lie flat against a straight edge, and the surface between neighbouring generators does not twist. A sheet of paper can be rolled into a cylinder or a cone without creasing, and that is the practical test.

A sphere is not developable, nor is a torus, the shape of a smooth pipe bend. No flat pattern makes them exactly. Sheet metal workers make them by stretching and shrinking the metal, by hammering, wheeling or pressing, or they approximate them with developable pieces: a smooth bend becomes a segmented elbow of short cylinders, and a dome becomes a set of gores, each part of a cylinder or cone. The approximation is a choice about how many pieces to make, and it has a cost in seams and labour.

Everything in this book is developable or made of developable pieces. The fittings in the running case were chosen that way: every one can be set out flat, cut, formed and seamed without raising or stretching the metal.

```figure
type: tree
title: Choosing the method from the solid
caption: Every fitting in this book is one of these solids or is split into them. The method follows from the solid, not from the fitting's name.
- Developable surface | can be flattened without stretching
  - Prism or cylinder | generators parallel to one another
    - * Parallel line development | elevation lines are true lengths
  - Right pyramid or cone | generators meet at one apex on the axis
    - * Radial line development | true lengths found by rotation about the axis
  - Oblique cone, transition or any other ruled surface | generators neither parallel nor meeting on an axis
    - * Triangulation | split into triangles, find each side's true length
- Non-developable surface | sphere, torus, double curvature
  - Approximate with developable pieces, or raise and stretch the metal | segments, gores, wheeling, pressing
```

## The three methods

**Parallel line development** applies to prisms and cylinders. Their generators are parallel, so in an elevation drawn square to them, every generator appears at its true length. The pattern is laid out along a straight girth line, with each generator set up at its true length from that line. Pipes cut on a slant, mitred and segmented elbows, and branches entering a main are all parallel line patterns.

**Radial line development** applies to right cones and right pyramids, whose generators all pass through one apex on the axis. Every generator of a right cone has the same true length, the slant height, so the pattern of a cone is a sector of a circle centred on the apex. A cone cut by a sloping plane is still a radial line pattern, but its generators are cut at different lengths and each must be found by rotating it into the plane of the elevation.

**Triangulation** applies to everything else that is developable: oblique cones, transitions between shapes, and any surface made of straight generators that neither run parallel nor meet at a single point on an axis. The surface is divided into narrow triangles. The true length of each side is found from its plan length and its height, and the triangles are laid out side by side to build the pattern. Triangulation can also develop cylinders and cones, more slowly, which makes it a useful check on the other two methods.

## Conventions used in this book

A few conventions make the numbers in later chapters consistent.

1. **Diameters on drawings are inside diameters** unless stated, because each duct piece must slip over the spigot of the next.
2. **Patterns are developed on the mean line**, the middle of the metal's thickness. When sheet is rolled into a cylinder, the outer surface stretches and the inner surface compresses, and the mean line keeps its length. For 0.8 mm sheet the difference between inside and mean girth is small but not zero, as Chapter 2 shows.
3. **Cylinders and cones are divided into 12 equal parts** for drawing, numbered 0 to 12 from the seam, so that each part spans 30°. Calculations use the same 12 points, and a finer division of 24 is used where a curve changes quickly.
4. **The seam is at line 0**, usually on the shortest generator, so that the seam is short and the pattern is symmetrical about line 6.
5. **The net pattern** is the developed surface alone. **Allowances** for seams, edges, flanges and joints are added afterwards, and are shown separately on every pattern so that a checker can see them.

## The running case

This is an illustration. A joinery workshop is extending its dust extraction and has asked a small sheet metal shop for a branch line to two machines. The shop works in 0.8 mm galvanised steel, rolls round duct on a set of hand slip rolls, closes longitudinal seams with grooved seams, and joins pieces with crimped slip joints and pop rivets.

The branch line runs from the fan outlet up through the roof to a discharge, with a separate drop down to a sander. Read as solids, its fittings fall neatly into the three methods.

```figure
type: compare
title: The running case's fittings, read as solids
rowhead: Fitting
cols: Size | Solid | Method | Chapter
caption: This is an illustration. Eight fittings, three methods. The transition and the eccentric reducer are the only ones that need triangulation.
- Straight duct | Ø250, 0.8 mm | Cylinder | Parallel line | 2
- Roof pass-through cut on a 20° slant | Ø250 | Cylinder cut by a plane | Parallel line | 2
- 90° segmented elbow, five pieces | Ø250, 375 mm centreline radius | Five short cylinders | Parallel line | 3
- Square branch and 45° branch | Ø150 into Ø250 | Two cylinders intersecting | Parallel line | 4
- Concentric reducer | Ø250 to Ø200, 200 long | Frustum of a right cone | Radial line | 5
- Sander hood with slanted mouth | Ø450 to Ø150 | Right cone cut obliquely | Radial line | 6
- Eccentric reducer | Ø200 to Ø150, 250 long | Oblique cone | Triangulation | 7
- * Fan transition | 300 × 200 to Ø250, 350 long | Four triangles and four part cones | Triangulation | 8
```

The workshop's drawing gives centrelines, lengths and sizes. It does not give patterns. Turning those sizes into flat shapes, adding allowances, nesting the pieces on 2,400 × 1,200 mm sheets and checking the result is the shop's work, and the subject of this book.

```figure
type: svg
title: The branch line in elevation
alt: Schematic elevation of the duct run. A rectangular fan outlet at lower left feeds a transition to round duct, which rises vertically through a sloping roof line. A segmented elbow at the bottom turns the run horizontal, and two branches leave the horizontal main, one square and one at 45 degrees. A conical hood hangs below one branch over a sander, and two reducers sit along the main.
caption: This is an illustration, not to scale. Each fitting is labelled with the chapter that develops its pattern.
viewbox: 0 0 640 330
body:
<path class="lf" d="M20 300H620"/>
<path class="ln" d="M330 40L620 145"/>
<text class="txs" x="560" y="112">Roof at 20°</text>
<rect class="bx" x="40" y="250" width="70" height="40"/>
<text class="txs" x="48" y="275">Fan</text>
<path class="li" d="M110 258L160 248V202L110 192Z"/>
<text class="txa" x="118" y="186">Ch 8</text>
<path class="li" d="M160 205H200M160 245H200"/>
<path class="li" d="M200 205C236 205 240 200 240 165M200 245C262 245 280 230 280 165"/>
<text class="txa" x="214" y="268">Ch 3</text>
<path class="li" d="M240 165V60M280 165V60"/>
<path class="la" d="M240 112L280 127"/>
<text class="txa" x="290" y="132">Ch 2</text>
<path class="li" d="M200 205H160"/>
<path class="cl" d="M260 175V40"/>
<path class="li" d="M280 150H360M280 180H360"/>
<path class="li" d="M360 150L400 156V174L360 180"/>
<text class="txa" x="364" y="146">Ch 5</text>
<path class="li" d="M400 156H520M400 174H520"/>
<path class="li" d="M520 156L560 160V170L520 174"/>
<text class="txa" x="528" y="152">Ch 7</text>
<path class="li" d="M430 174V215M448 174V215"/>
<text class="txa" x="454" y="200">Ch 4</text>
<path class="li" d="M430 215L405 262M448 215L478 248"/>
<path class="la" d="M405 262L478 248"/>
<text class="txa" x="484" y="262">Ch 6</text>
<rect class="bxi" x="400" y="272" width="90" height="22"/>
<text class="txs" x="420" y="288">Sander</text>
<path class="li" d="M470 156L500 120M484 156L512 128"/>
<text class="txa" x="514" y="124">Ch 4</text>
```

## True length: the one idea underneath every method

Every pattern is built from lengths that a drawing does not show directly. A line on a fitting appears at its true length only in a view that looks square at it. In any other view it appears shorter, foreshortened by the cosine of the angle between the line and the drawing plane.

The parallel line method avoids the problem by choosing a view in which every generator is square to the eye: the elevation of a cylinder drawn with its axis in the paper. The radial line method uses the fact that the outline generator of a right cone, seen in elevation, is at its true length, and rotates any other generator about the axis until it lies on that outline. Triangulation finds the true length of any line from two numbers that the drawings do give: its length in plan and the difference in height between its ends.

True length = √(plan length² + height difference²)

That single formula, Pythagoras applied to a line in space, carries most of Chapters 6, 7 and 8. A drafter with a calculator can use it directly; a pattern maker on the bench uses the same idea with a right-angled triangle drawn to the side of the elevation, setting the plan length along the base and the height up the side, and measuring the hypotenuse.

```figure
type: formula
title: True length of a line from its plan and its height
formula: TL = √(p² + h²)
caption: The plan and elevation each give one component. The true length is the line's length in space. The example is the longest line on the running case's fan transition, from a corner of the rectangle to the far quarter point of the round.
- TL | True length, the length to set out on the pattern
- p | Length of the line in plan, from the plan view
- h | Difference in height between its ends, from the elevation
step: p = 152.5 mm, h = 350 mm
step: TL = √(152.5² + 350²) = √(23,256 + 122,500) = 381.8 mm
step: The elevation shows the same line as 350 mm or less. Setting out 350 would make that edge of the pattern 31.8 mm short.
```

## How accurate a pattern needs to be

A pattern's accuracy is set by what the fitting has to do. For the running case, three tolerances matter.

The **girth** must be right to within about a millimetre. A Ø250 duct with a girth 3 mm short is about 1 mm small in diameter and will not slip over its neighbour's spigot. A girth 3 mm long leaves a loose joint that leaks and rattles.

The **cut lines** where pieces meet must match one another more than they must match the drawing. If both pieces of a mitre are cut from the same pattern, small errors cancel; if each is set out separately, they add. Pattern makers cut matching pieces from one pattern for that reason.

The **overall lengths** of fittings matter least, because slip joints take up a few millimetres either way. A run of eight fittings each 2 mm long is 16 mm long overall, which the installer usually absorbs at one slip joint.

Before developing anything, the shop also settles three questions with the customer or from the drawing, because each one changes the pattern. Are the sizes inside, outside or mean? Which way does each slip joint face, so that the crimped end of one piece points downstream into the next? And where may seams go, given that a seam on the underside of a horizontal dust duct collects fine dust and is harder to keep tight? For the running case the answers are inside sizes, crimped ends facing the direction of airflow, and longitudinal seams on the top or sides of horizontal runs. Writing those answers on the job sheet takes a minute and prevents the most expensive kind of pattern error, the one that is correct for a different job.

These priorities explain the order of the book. Chapter 2 starts with girth, because nearly every fault traced back to a pattern starts there.

## The error: a transition read as a cone

This is an illustration. The shop's first apprentice, asked for the fan transition, reasoned that a fitting tapering from a large opening to a smaller round one is a reducer, and a reducer is a cone. The rectangle's perimeter is 2 × (300 + 200) = 1,000 mm, which is the girth of a circle of diameter 1,000 ÷ π = 318.3 mm. The apprentice developed a cone frustum from Ø318.3 to Ø250, 350 mm long, as in Chapter 5, rolled it, and expected to pinch the large end into a rectangle.

The large end would not take the shape. A cone's large end is a circle of generators all at one slope. Pinched into a rectangle, the long sides needed to be nearly vertical, sloping 4.1° from the vertical, while the corners needed to slope much more, and the round end twisted out of square as the corners were forced. The fitting was scrapped at the trial fit against the fan, and the cause was found by asking the question this chapter began with: what solid is this? A rectangle-to-round transition is four flat triangles, one on each side of the rectangle, and four part-cones at the corners, each with its apex at a corner of the rectangle. It is developed by triangulation in Chapter 8, and its pattern looks nothing like a cone's sector.

The general lesson is cheap to apply: before setting out any pattern, sketch the fitting and draw its generators. If they run parallel, use parallel lines. If they meet at one point on the axis, use radial lines. If they do neither, triangulate.

## A pattern maker's kit

Most of the work in this book needs only a steel rule, a scriber, dividers, a square, a trammel or beam compass for large radii, and a calculator. The calculations are arranged so that a spreadsheet can do them: each chapter's formulas take a few columns, and the 12 cut ordinates of a pipe or the true lengths of a transition can be tabulated and printed for the bench. The Library’s chapter on [circles, arcs, chords and bolt circles](/reados/collections/practical-mathematics-for-engineering/circles-arcs-chords-and-bolt-circles/) covers the circle geometry that girths and cone sectors rely on, and the KEVOS® [triangle solver](/tools/triangle-solver/) handles any true-length triangle.

CAD sheet metal programs unfold cylinders and cones automatically, and most can unfold a lofted transition. The methods in this book remain useful in two ways: they let a pattern maker work without CAD, and they let anyone check a CAD unfold with three or four numbers worked out by hand. Chapter 10 returns to that check.

## Exercise: name the solid

For each fitting, name the solid and the development method.

1. A rectangular duct 400 × 300 mm cut on a 30° slant where it meets a sloping wall.
2. A funnel tapering from Ø300 to Ø50 with both ends square to its axis and centred on one another.
3. A transition from a 400 × 400 square to a Ø300 round whose centre is 100 mm off the square's centre in plan.
4. A dome cap for a Ø600 tank.

**Worked answer.**

1. A rectangular duct is a **prism**: four flat sides with parallel edges. Cut on a slant it is still a prism, developed by **parallel line**. Each of its four edges is a true length in an elevation drawn square to the duct's axis, and the pattern is four rectangles with sloping tops, side by side along a girth line. Taking the sizes as mean-line sizes, that girth is 2 × (400 + 300) = 1,400 mm, and the corners are folded rather than rolled, so Chapter 9's bend allowances replace the rolled girth correction.
2. The funnel is a **frustum of a right cone**, developed by **radial line** as in Chapter 5. Its pattern is part of an annulus centred on the cone's apex.
3. With the round offset from the square, the generators do not meet on a single axis. The four corner pieces are parts of **oblique cones** and the sides are flat triangles. It is developed by **triangulation** as in Chapter 8, with each corner treated separately because the offset makes the four corners different.
4. A dome is part of a **sphere**, which is not developable. It must be raised or pressed from one blank, or approximated by **gores**, each developed as part of a cylinder or cone, with more gores giving a closer approximation and more seams.
