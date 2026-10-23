---
title: "Circles, arcs, chords and bolt circles: hole patterns, rolled shells, bends and radius checks"
description: "How circumference, arc length, chords and sagitta solve practical problems, from bolt-circle hole coordinates and rolled cylinders to sheet metal bend allowances and finding a radius from a chord."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - manufacturing
  - design
  - quality
author: "KEVOS"
featured: false
draft: false
---

Circles are everywhere in engineering: flanges with rings of bolt holes, pulleys and wheels, rolled tanks and ducts, bends in sheet metal and pipe, curved edges on fabricated parts and arcs in CAD drawings and CNC programs. A machinist drilling a bolt pattern needs the coordinates of each hole. A fabricator rolling a cylinder from flat plate needs the length of plate to cut. A sheet metal designer needs to know how much flat material a bend consumes. An inspector checking a large curved part needs its radius but can only measure a chord across it and the height of the arc.

The geometry behind all of these tasks is compact: circumference, arc length, chord length and the sagitta, the height of an arc above its chord. With these relationships and a little trigonometry, almost any practical circle problem can be solved and checked. Most errors come from using the outside diameter where the mean diameter is needed, from mixing degrees and radians, or from forgetting that a bend's length depends on where the material neither stretches nor compresses.

This article explains the key circle relationships, bolt-circle coordinates and checks, rolled cylinders, sheet metal bend allowances, finding a radius from a chord and sagitta, and related practical problems, with worked examples throughout.

## Circle basics

For a circle of radius r and diameter d = 2r:

- **circumference** = π × d = 2 × π × r;
- **area** = π × r² = π × d² ÷ 4.

π is approximately 3.14159. Using a rounded value such as 3.14 introduces an error of about 0.05%, which is acceptable for estimates but not for precision work. Calculators and spreadsheets provide π to full precision.

## Degrees and radians

Angles can be measured in degrees, with 360° in a circle, or in **radians**, with 2π radians in a circle. One radian is about 57.3°. Radians make many formulas simpler, particularly for arc length. To convert, multiply degrees by π ÷ 180. Spreadsheet trigonometric functions use radians, so degrees must be converted before use.

## Arc length

The length of an arc of radius r subtending an angle θ is:

- arc length = r × θ, with θ in radians; or
- arc length = (θ ÷ 360) × π × d, with θ in degrees.

A 90° arc of radius 50 mm is (90 ÷ 360) × π × 100 ≈ 78.5 mm long.

## Chord length

A **chord** is a straight line joining two points on a circle. The chord spanning an angle θ at the centre has length:

chord = 2 × r × sin(θ ÷ 2)

Chords are useful because they can be measured with calipers or a tape, while arcs cannot easily be measured directly.

## Sagitta

The **sagitta**, s, is the height of an arc above the midpoint of its chord. For a chord of length c on a circle of radius r:

s = r − √(r² − (c ÷ 2)²)

Rearranged, the radius can be found from a measured chord and sagitta:

r = c² ÷ (8 × s) + s ÷ 2

This is a practical way to find the radius of a large curved surface, such as a rolled shell, a curved beam or a worn wheel, using only a straight edge and a ruler.

## Bolt circles and pitch circle diameters

Holes arranged evenly on a circle, such as bolt holes in a flange, are dimensioned by the **pitch circle diameter** (PCD), the number of holes and the angular position of the first hole. For n holes on a PCD of radius r, with the first hole at angle θ₀ measured anticlockwise from the positive X axis, the coordinates of hole i (counting from zero) are:

- x = r × cos(θ₀ + i × 360° ÷ n)
- y = r × sin(θ₀ + i × 360° ÷ n)

For six holes on a 120 mm PCD with the first hole on the X axis, the radius is 60 mm and the holes sit every 60°. Their coordinates are approximately (60, 0), (30, 51.96), (−30, 51.96), (−60, 0), (−30, −51.96) and (30, −51.96).

```figure
type: svg
title: Six holes on a 120 mm PCD
alt: A pitch circle of 120 millimetre diameter with six holes every 60 degrees, the first on the X axis at 60, 0. Adjacent holes are 60 millimetres apart.
caption: Holes every 60° at radius 60: adjacent pitch = 2 × 60 × sin 30° = 60 mm.
viewbox: 0 0 400 300
body:
<circle class="lf dsh" cx="200" cy="150" r="110"/>
<path class="lf" d="M60 150H340M200 10V290"/>
<circle class="fa pulse" cx="310" cy="150" r="10"/>
<circle class="fa" cx="255" cy="55" r="10"/>
<circle class="fa" cx="145" cy="55" r="10"/>
<circle class="fa" cx="90" cy="150" r="10"/>
<circle class="fa" cx="145" cy="245" r="10"/>
<circle class="fa" cx="255" cy="245" r="10"/>
<path class="la" d="M310 150L255 55"/>
<text class="tx txs" x="296" y="96">60 mm</text>
<text class="tx txs" x="318" y="176">60, 0</text>
<text class="tx txs" x="200" y="170" text-anchor="middle">PCD 120</text>
```

Many flange standards place holes "off centre", straddling the main axes rather than on them, so that the holes are symmetric about both centrelines. For eight holes on a 200 mm PCD straddling the axes, the first hole is at 22.5°, and the coordinates begin at about (92.39, 38.27). Getting the starting angle wrong rotates the whole pattern, so drawings should show it clearly.

### Checking a bolt pattern

The distance between adjacent holes is a chord:

pitch = 2 × r × sin(180° ÷ n)

For six holes on a 120 mm PCD, the centre distance between adjacent holes is 2 × 60 × sin 30° = 60 mm. For eight holes on a 200 mm PCD, it is 2 × 100 × sin 22.5° ≈ 76.54 mm. Measuring hole-to-hole distances, allowing for hole diameter, gives a quick check of a drilled pattern without a coordinate measuring machine. Comparing opposite holes, which should be one PCD apart, is another simple check. The [drilling, reaming and tapping holes](/reados/collections/machining-and-metal-parts/drilling-reaming-and-tapping-holes/) article explains how to position and drill hole patterns accurately.

## Rolled cylinders: use the mean diameter

When a flat plate is rolled into a cylinder, the outside surface stretches and the inside surface compresses. The length of plate needed corresponds approximately to the circumference at the **mean diameter**, the average of the inside and outside diameters:

developed length ≈ π × (outside diameter − thickness)

For a cylinder with a 600 mm outside diameter rolled from 6 mm plate, the mean diameter is 594 mm, and the plate length is about π × 594 ≈ 1,866 mm. Using the outside diameter would give about 1,885 mm, roughly 19 mm too long. For thick plate and tight radii, the neutral position shifts slightly towards the inside, and fabricators adjust from experience or trials. Allowance must also be made for the weld gap and any trimming of flat ends that do not roll.

## Sheet metal bends

When sheet metal is bent, the material at the inside of the bend compresses and the outside stretches. Somewhere between lies the **neutral axis**, which keeps its original length. The flat length of a part is therefore found by adding the straight lengths to the **bend allowance**, the arc length of the neutral axis through each bend:

bend allowance = θ × (R + K × t)

where θ is the bend angle in radians, R the inside bend radius, t the thickness and K the **K-factor**, the position of the neutral axis as a fraction of the thickness from the inside surface. K-factors typically lie between about 0.3 and 0.5, depending on material, thickness, radius and the bending method.

For a 90° bend with a 3 mm inside radius in 3 mm sheet and a K-factor of 0.4, the bend allowance is (π ÷ 2) × (3 + 0.4 × 3) ≈ 6.6 mm. Because K-factors depend on the shop's tooling, it is best to establish them from test bends and use them consistently in CAD sheet metal settings. The [designing sheet metal parts for manufacture](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/) article covers bend radii, reliefs and other design rules.

## Roundness, concentricity and runout

A circular part can be the right size but the wrong shape. **Roundness** describes how closely a cross-section matches a true circle; an oval or lobed shaft may measure correctly in one direction and wrongly in another, so diameters should be measured at several angles. **Concentricity** and **runout** describe how well circular features share a common axis. Runout is checked by rotating the part about its datum axis, often between centres or in V-blocks, while a dial indicator reads the surface; the total indicator movement shows the combined effect of eccentricity and form errors. Excessive runout on shafts, pulleys and rotors causes vibration, uneven wear and noise, and drawings for rotating parts should specify acceptable runout with geometric tolerances.

## Partly filled tanks

The volume of liquid in a horizontal cylindrical tank is not proportional to its depth, because the cross-section of liquid is a **circular segment**. A tank half full by depth is half full by volume, but a tank filled to a quarter of its diameter holds only about 20% of its capacity. Dip charts that convert depth readings to volume are calculated from the segment area for each depth and are worth producing for any horizontal tank used for stock control.

## Arcs in CAD and CNC

CAD systems define arcs by centre, radius and angles, or by three points, and CNC programs describe them with start and end points and either a radius or the centre position relative to the start. Errors creep in when the direction is wrong, clockwise instead of anticlockwise, or when a rounded radius makes the start and end points inconsistent. Knowing that the chord between start and end points must equal 2 × r × sin(θ ÷ 2) gives a check on hand-calculated arc data. The [CNC programming and CAM](/reados/collections/machining-and-metal-parts/cnc-programming-and-cam-basics/) article explains how arcs are programmed and verified.

## Speeds around a circle

A point on a rotating part moves at a surface speed equal to the circumference multiplied by the rotational speed. A 300 mm diameter pulley turning at 1,450 rpm has a rim speed of π × 0.3 × 1,450 ÷ 60 ≈ 22.8 m/s. Surface speeds determine cutting speeds in machining, belt speeds in drives and the limits on grinding wheels, which must never be run above their marked maximum speed.

## Belt and chain lengths

The length of a belt running around two pulleys can be estimated from the pulley diameters and centre distance. For two pulleys of equal size, it is simply twice the centre distance plus one circumference. For unequal pulleys, standard approximations include a correction for the difference in diameters, and belt and chain suppliers publish formulas and tables for selecting standard lengths.

## A worked example

This is an illustrative example. The figures are hypothetical.

A fabricator receives an order for a cylindrical tank with an outside diameter of 600 mm, made from 6 mm plate, with a flange drilled with eight 18 mm holes on a 200 mm PCD, straddling the centrelines.

For the shell, the plate is cut to π × 594 ≈ 1,866 mm plus the allowance for trimming the unrolled ends, and a test roll on an offcut confirms the result. After rolling and welding, the inspector checks the shell's radius by placing a 400 mm straight edge across the outside and measuring a sagitta of about 34 mm, which gives r ≈ 400² ÷ (8 × 34) + 34 ÷ 2 ≈ 605 mm. That is about twice the intended 300 mm outside radius, which cannot be right for a shell that fits its flange, so the inspector re-measures at several positions and finds a sagitta of 76.5 mm, giving r ≈ 400² ÷ (8 × 76.5) + 76.5 ÷ 2 ≈ 300 mm, as intended. The first reading had been taken across a flat spot near the weld, which is then corrected by re-rolling.

For the flange, the CNC programmer uses a first-hole angle of 22.5° and checks the program by measuring the adjacent-hole pitch of the first part, which should be about 76.5 mm, and the distance between opposite holes, which should be 200 mm.

```figure
type: compare
title: Checking a tank shell and flange
cols: Calculation | Check on the part
caption: Mean diameter for rolled plate; pitch and opposite-hole distances for the bolt pattern.
- Shell blank | π × 594 ≈ 1,866 mm | A test roll on an offcut
- *Flange: 8 holes, 200 PCD | First hole at 22.5° | Adjacent pitch about 76.5 mm
```

## How this applies to a small Australian business

- **Show the PCD, number of holes and first-hole angle** clearly on drawings.
- **Check bolt patterns with chord measurements** before assembly.
- **Use mean diameters for rolled shells** and confirm with test rolls.
- **Establish K-factors from test bends** and use them in CAD.
- **Use chord and sagitta measurements** to check large radii.
- **Produce dip charts** for horizontal tanks used for stock control.
- **Respect maximum surface speeds** for wheels, pulleys and grinding wheels.

## Common mistakes

- **Using the outside diameter** to cut plate for a rolled cylinder.
- **Starting a bolt pattern on the axis** when the standard straddles it.
- **Mixing degrees and radians** in spreadsheets.
- **Assuming one K-factor suits all materials and tools.**
- **Measuring sagitta across a flat spot** or weld.
- **Programming arcs in the wrong direction.**

## Frequently asked questions

**What is a pitch circle diameter?** The diameter of the circle on which the centres of a ring of holes lie.

**Why does a rolled cylinder need the mean diameter?** Because the outside of the plate stretches and the inside compresses during rolling, while the material near the middle keeps its length.

**How can the radius of a large curve be measured without special tools?** Lay a straight edge of known length across the curve, measure the gap at the middle, and use r = c² ÷ (8 × s) + s ÷ 2.

## Questions to ask

- Do our drawings specify bolt patterns unambiguously?
- How do we check hole patterns and radii on fabricated parts?
- Are our sheet metal K-factors based on our own test bends?
- Do our plate cutting calculations use mean diameters?
- Are surface speed limits checked for rotating equipment?

## Bringing it together

Circumference, arc length, chords and sagitta solve a wide range of practical problems. Bolt-circle coordinates come from simple trigonometry, and chord measurements check drilled patterns. Rolled cylinders need the mean diameter, sheet metal bends need a bend allowance based on the neutral axis and a measured K-factor, and large radii can be found from a straight edge and a ruler. Clear drawings, consistent units and simple physical checks keep circular work accurate.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
