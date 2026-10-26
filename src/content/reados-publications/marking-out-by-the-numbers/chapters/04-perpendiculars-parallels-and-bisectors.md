---
book: marking-out-by-the-numbers
chapterSlug: perpendiculars-parallels-and-bisectors
order: 4
title: "Perpendiculars, parallels and bisectors"
description: "Bisect lines and angles, erect and drop perpendiculars and draw parallels with dividers and trammel, and choose radii so that arcs cross squarely and errors stay small."
draft: false
---

A steel square gives a right angle at the edge of a sheet. Away from the edge, on an offcut with no square corner, at the middle of a long line, or at a size bigger than any square, the right angle has to be built. The constructions for doing it are more than two thousand years old: Euclid set them out with a compass and a straightedge, and every sheet metal handbook since has repeated them, including the 1910 tin-shop handbook that is one of this book's sources. On the bench, the compass becomes dividers or a trammel and the straightedge a steel rule.

What the old books seldom say is that the constructions are exact only on paper. On metal, each arc has a small error in its radius and each point is pricked a little off, and the result depends on how squarely the arcs cross. This chapter works through the constructions used on C-12, shows how to choose radii that keep the errors small, and ends with a centre line that moved 0.8 mm because a trammel left at the wrong setting struck its arcs at a shallow angle.

## Four constructions and a parallel

The constructions below are those of Euclid's Elements, Book I, Propositions 9 to 12, adapted to the bench. Each needs only a straightedge and dividers or a trammel.

```figure
type: steps
title: The basic constructions, with dividers or trammel
caption: Each construction gives two points on the required line. The farther apart the two points, the more accurately the line can be drawn through them.
- Bisect a line AB | arcs of equal radius from A and B, one pair above and one below the line; join the two crossings
- Bisect an angle | equal arcs from the vertex cut both arms; equal arcs from those cuts cross on the bisector
- Erect a perpendicular at a point P on a line | mark A and B equal distances either side of P; bisect AB
- Drop a perpendicular from a point Q to a line | an arc from Q cuts the line at A and B; bisect AB
- Draw a parallel at distance d | erect two perpendiculars far apart; mark d on each; join the marks
```

The last of these is the method of offsets. A parallel can also be drawn by sliding a set square along a straightedge held firmly to the sheet, as Osborne describes; it is quick, but the result depends on the straightedge not moving, and on long lines the method of offsets is more reliable.

## Where two arcs cross

Every construction above finds a point where two arcs cross. Suppose each arc's radius is slightly wrong, because the trammel point slipped, the divider leg flexed or the centre was pricked slightly off. Each error moves the crossing point, and how far it moves depends on the angle between the arcs where they cross.

```figure
type: bars
title: How the angle of crossing magnifies a radius error
unit: × the radius error
max: 6
caption: An error in one arc's radius moves the crossing along the other arc by the error divided by the sine of the crossing angle. Arcs that cross squarely give the smallest error; arcs that graze each other give a large one.
- * 90° | 1.00
- 60° | 1.15
- 45° | 1.41
- 30° | 2.00
- 20° | 2.92
- 15° | 3.86
- 10° | 5.76
```

The practical rule is to choose radii that make the arcs cross between about 60° and 120°. For the commonest case, bisecting a line, there is a neat result. If the two centres are a distance 2s apart and both arcs have radius R, the arcs cross at an angle of 2 × arcsin(s ÷ R). They cross at exactly 90° when R = s × √2, about 1.41 times half the length being bisected.

```figure
type: compare
title: Bisecting a 600 mm line: choice of radius
rowhead: Radius R, mm
cols: Crossing angle | Height of crossing above the line | Sideways shift of the bisector per 0.5 mm radius error
caption: Half-length s = 300 mm. The sideways shift of the bisector is R × δ ÷ (2s) for a radius error δ on one side. A radius near 1.41s crosses squarely and keeps the shift small; a long trammel left at a large setting does neither.
- 310 | 150.8° | 78.1 mm | 0.26 mm
- 350 | 118.0° | 180.3 mm | 0.29 mm
- * 424.3 | 90.0° | 300.0 mm | 0.35 mm
- 600 | 60.0° | 519.6 mm | 0.50 mm
- 1,000 | 34.9° | 953.9 mm | 0.83 mm
```

The last column comes from the geometry of two circles. If the arc from A has radius R and the arc from B has radius R + δ, their crossing points both move sideways, towards A, by R × δ ÷ (2s). The bisector stays parallel to where it should be but is displaced. A small radius reduces the displacement but puts the crossing points close to the line, so a line drawn through them is short and its direction is poorly fixed. A radius near 1.41s balances the two.

## Two points, as far apart as possible

A line drawn through two marked points inherits the points' errors, and its direction error is the sideways error divided by the distance between the points. Two points 100 mm apart, each 0.2 mm off in opposite directions, give a line whose direction is out by 0.4 ÷ 100 radians, about 0.23°, which moves its far end 2.4 mm over 600 mm. The same errors on points 600 mm apart move it only 0.4 mm.

That is why the bisector is found from two crossings, one on each side of the line, rather than from one crossing and the midpoint of the line. With R = 424.3 mm on a 600 mm line, the crossings are 300 mm above and 300 mm below, 600 mm apart. When only one side of the line is available, as at the edge of a sheet or an offcut, the second point comes from a second pair of arcs of a different radius on the same side. With R = 424.3 and R = 500 mm, the two crossings are at 300 and 400 mm from the line, only 100 mm apart, and the direction is four to six times less certain. On one side only, it pays to make the two radii as different as the sheet allows.

## Bisecting an angle

An angle is bisected by striking equal arcs from its vertex to cut both arms, then striking equal arcs from those two cuts to cross between the arms. The bisector runs from the vertex through the crossing. The same rules apply: the cuts on the arms should be well away from the vertex, so that the final line is long, and the second pair of arcs should be struck with a radius that makes them cross squarely. Chapter 6 uses this construction to halve angles that have been set out by the tangent method, and Chapter 7 uses it to find the corners of polygons.

## Marking the base plate on an offcut

This is an illustration. The C-12 base plate is an octagon 600 mm across flats. To save a full sheet, the shop marks it on an offcut left from an earlier job, about 700 × 750 mm with one good sheared edge and three ragged ones. There is no square corner to work from, so both centre lines are constructed.

```figure
type: svg
title: Constructing the base plate's centre lines on an offcut
alt: An irregular offcut with a straight edge along the bottom. A datum line A runs parallel to the bottom edge. Two points 600 mm apart on line A each carry an arc of radius 424.3 mm; the arcs cross above line A, and a second pair of arcs of radius 500 mm crosses higher up. A vertical centre line passes through both crossings. At the centre point, 300 mm above line A on the vertical, a second centre line is drawn at right angles through two crossings left and right of the centre.
caption: This is an illustration, not to scale. The vertical centre line comes from two pairs of arcs on one side of datum line A; the horizontal centre line is erected at the centre point with arcs crossing squarely above and below it.
viewbox: 0 0 420 320
body:
<path class="lf" d="M30 290L390 290L395 60L360 30L60 20L25 70Z"/>
<path class="li" d="M45 275L375 275"/>
<text class="txs" x="380" y="279">A</text>
<circle class="fa" cx="90" cy="275" r="3"/>
<circle class="fa" cx="330" cy="275" r="3"/>
<text class="txs" x="80" y="300">P1</text>
<text class="txs" x="322" y="300">P2</text>
<path class="ln dsh" d="M245 160A170 170 0 0 0 158 120"/>
<path class="ln dsh" d="M195 160A170 170 0 0 1 282 120"/>
<path class="ln dsh" d="M238 118A200 200 0 0 0 180 82"/>
<path class="ln dsh" d="M202 118A200 200 0 0 1 260 82"/>
<path class="la" d="M210 40L210 280"/>
<circle class="fa" cx="210" cy="155" r="3"/>
<circle class="fa" cx="210" cy="115" r="3"/>
<circle class="bxa" cx="210" cy="155" r="5"/>
<path class="la" d="M80 155L340 155"/>
<text class="txs" x="216" y="150">centre</text>
<text class="txs" x="216" y="108">R 500 crossing</text>
<text class="txs" x="40" y="148">second centre line</text>
```

1. **Datum line A.** Check the sheared edge with a straightedge and scribe line A 15 mm in from it.
2. **Two points on A.** Mark P1 and P2 600 mm apart on A, centred on the offcut.
3. **Vertical centre line.** From P1 and P2 strike arcs of 424.3 mm to cross above A, 300 mm up. The offcut does not extend below A, so strike a second pair at 500 mm, crossing 400 mm up, and a third pair at 600 mm, crossing 519.6 mm up. Draw the centre line through the three crossings; they should lie on a straight line within 0.2 mm.
4. **Centre point.** On the centre line, mark the centre 300 mm from A, measured with a steel rule from a graduation.
5. **Horizontal centre line.** Mark two points 300 mm either side of the centre on the vertical line, strike arcs of 424.3 mm from each to cross 300 mm to the left and right of the centre, and join the crossings through the centre.
6. **Check.** Measure from the centre to line A along the vertical, 300.0 mm, and measure the four distances from the centre to the crossings, all of which should be 300 mm.

The third pair of arcs in step 3 is the shop's way of getting a long, well-fixed centre line from one side. The 600 mm radius crosses at 60°, slightly less square than ideal, but its crossing is 519.6 mm from A, which makes the line through the three points long.

## Parallels by offsets

The octagon's flats are parallel to the centre lines at 300 mm. Each is drawn by the method of offsets: from the centre line, measure 300 mm along two perpendiculars well apart, and join the marks. Each offset has an error, and if they are in opposite directions, the line tilts by their sum over their separation. With ±0.2 mm on each offset and the offsets 800 mm apart, measured on construction lines that extend past the octagon, the flat's direction is out by at most 0.4 ÷ 800 radians, which moves its ends by 0.45 mm over 900 mm. Taking the offsets only at the ends of a 248.5 mm side would make the same errors three times worse.

## The error: a trammel left at a metre

This is an illustration. On the first base plate, a fabricator constructed the vertical centre line with a trammel that was still set at 700 mm from a previous job, reasoning that a bigger radius must be more accurate. The arcs from P1 and P2 crossed at about 51°, 632.7 mm above line A, near the top of the offcut. For a second point, the fabricator closed the trammel to 650 mm, which crossed 576.6 mm above A. The centre line was drawn through the two crossings, 56 mm apart, and extended down to A.

When the octagon was marked and cut, its opposite flats measured 297.1 and 302.9 mm from the centre punch. The hole circle, laid out on that centre, was nearly 3 mm off centre relative to the octagon, which on a cowl shows as badly uneven edge distances around the rivets. Tracing the fault, the fabricator found that the trammel's moving point had a slightly loose clamp, and under the pressure of striking the first long arc it had slipped by about half a millimetre.

The arithmetic explains the size. With R = 700 mm and s = 300 mm, a 0.5 mm slip moves the crossing sideways by 700 × 0.5 ÷ 600 = 0.58 mm. On its own, that would have been tolerable. But the line was drawn through two points only 56 mm apart and extended 277 mm beyond the lower one to reach the centre point, so the 0.58 mm became 0.58 × 277 ÷ 56 = 2.9 mm at the centre. Two decisions made a small slip large: a radius that crossed obliquely, and two points far too close together for the length of line drawn through them.

With radii of 424.3, 500 and 600 mm, as in the method above, the same slip would have moved the centre line by about 0.35 mm, and the three-point check in step 3 would have caught any crossing that did not line up. The shop now sets the trammel freshly for each construction, tightens and tests its clamp by striking the same arc twice, works out the radii on the job sheet, and never extends a constructed line more than its own length beyond the points that fix it. The plate was remade from another offcut.

## Prick marks and the centre of an arc

An arc is only as good as its centre. A divider or trammel point resting on a smooth sheet can skate a few tenths of a millimetre as the arc is swung, and the error goes straight into the radius. The centre should be a light prick mark, made with a fine prick punch and a gentle tap, just deep enough to seat the point. A heavy centre punch mark is too wide: its cone lets the point wander inside it.

Arcs are struck in one light, steady sweep, with the pressure on the centre leg, not the scribing leg. Pressing on the scribing leg flexes the dividers and shortens the radius. A short arc, just long enough to cross the other, is better than a long one, because there is less time for the point to move. When an arc must be struck twice, the second sweep should be checked against the first: if they do not coincide, the setting has moved and both should be struck again.

## How this applies to a small Australian business

Offcuts are money. A small shop that can mark accurately on an irregular offcut, without a square corner, uses material that would otherwise go to scrap and can take on one-off work without cutting into a full sheet. The constructions in this chapter make that possible, and the rule for choosing a radius turns them from approximate to reliable. Writing the radius on the job sheet, rather than leaving it to habit, costs nothing.

## Exercise: a perpendicular from one side

A fabricator must erect a perpendicular to a datum line at a point P, near the edge of a sheet, so that only one side of the line is available. They will mark A and B 200 mm either side of P and strike two pairs of arcs, with radii between 200 and 450 mm. Neither pair may magnify a radius error by more than 1.4, which means a crossing angle between 45° and 135°. Which two radii put the crossings as far apart as possible?

**Worked answer.** Here s = 200 mm. The crossing angle is 2 × arcsin(s ÷ R), the magnification is 1 ÷ sin(crossing angle), and the height of the crossing above the line is √(R² − s²).

- **Largest radius.** The top of the range, 450 mm, crosses at 2 × arcsin(0.444) = 52.8°, magnification 1.26, inside the limit. Its crossing is √(450² − 200²) = 403.1 mm above the line.
- **Smallest radius.** A crossing of 135° needs arcsin(200 ÷ R) = 67.5°, so R = 200 ÷ 0.924 = 216.5 mm. Rounding up to **220 mm** gives a crossing of 130.8°, magnification 1.32, and a height of √(220² − 200²) = 91.7 mm.

Choosing **220 mm and 450 mm** puts the crossings 403.1 − 91.7 = 311.4 mm apart, with P a further 91.7 mm below the lower one, so the perpendicular is fixed by three points spread over 403 mm. The fabricator should draw it through all three and check that they are in line within 0.2 mm before using it.
