---
book: tolerances-that-work
chapterSlug: form-orientation-and-location
order: 5
title: "Form, orientation and location tolerances"
description: "Use flatness, perpendicularity, position, run-out and profile to control what size limits cannot, and understand why a cylindrical position zone accepts more good parts."
draft: false
---

Size limits say how big a feature may be. They say nothing reliable about whether a face is flat, whether a bore is square to a mounting face or whether a hole is where it should be relative to other features. Those properties often matter more to function than size does. Geometric tolerances control them directly.

This chapter introduces the main families of geometric tolerance, the tolerance zone each defines and the reasons positional tolerancing is usually better than the plus-and-minus coordinates it replaces. The examples continue with the Northgate housing, shaft and spacer.

## Every geometric tolerance defines a zone

The key idea in geometric tolerancing is the **tolerance zone**: a region of space within which the toleranced feature, or its derived axis or median plane, must lie. ISO 1101 defines the zones precisely. A few examples show the pattern:

- **Flatness 0.02** on a face: the whole surface must lie between two parallel planes 0.02 mm apart. The planes may take any orientation.
- **Perpendicularity Ø0.02 to datum A** on a bore: the bore's axis must lie inside a cylinder 0.02 mm in diameter whose axis is exactly perpendicular to datum plane A.
- **Position Ø0.5 relative to A and B** on a hole: the hole's axis must lie inside a cylinder 0.5 mm in diameter centred on its theoretically exact location in the A–B frame.

Reading a geometric tolerance is therefore always the same exercise: what is toleranced, what shape is the zone, how big is it and how is it oriented or located relative to the datums?

## The families

Geometric tolerances fall into groups with different relationships to datums.

```figure
type: tree
title: The families of geometric tolerance
caption: A location tolerance also limits orientation and form within its zone, so refinements must be smaller than what they refine.
- Geometric tolerances
  - Form, no datum | straightness, flatness, roundness, cylindricity
  - Orientation, datums needed | parallelism, perpendicularity, angularity
  - *Location, usually with datums | position, coaxiality, symmetry
  - Run-out, datum axis | circular and total run-out of rotating surfaces
  - Profile, datums optional | line or surface; shape alone, or with orientation and location
```

| Family | Examples | Datum needed? | Controls |
|---|---|---|---|
| Form | Straightness, flatness, roundness, cylindricity | No | The shape of a single feature |
| Orientation | Parallelism, perpendicularity, angularity | Yes | Angle relative to datums, not location |
| Location | Position, coaxiality, symmetry | Usually | Location relative to datums, and orientation as well |
| Run-out | Circular run-out, total run-out | Yes, an axis | Combined form, orientation and location of surfaces of revolution |
| Profile | Profile of a line, profile of a surface | Optional | Shape alone, or shape with orientation and location |

There is a natural hierarchy. A location tolerance also limits orientation and form within its zone, and an orientation tolerance also limits form. A face with a parallelism tolerance of 0.05 mm to a datum cannot be less flat than 0.05 mm. If flatness matters more tightly, a smaller flatness tolerance is added as a refinement. A refinement larger than the tolerance it refines adds nothing and suggests the requirement was not thought through.

## The Northgate housing

The functional analysis in Chapter 1 named four critical requirements for the housing. Each maps onto a geometric tolerance relative to the datum frame established in Chapter 4: A, the mounting face; B, the bore axis; and C, a bolt hole for clocking.

| Requirement | Control on the drawing |
|---|---|
| Mounting face seats on the frame | Flatness of datum feature A |
| Roller runs square to the frame | Perpendicularity of bore B to datum A |
| Four screws always assemble | Position of the four clearance holes relative to A and B |
| Bearing outer ring seats properly | Size H7 on the bore, with cylindricity if bearing guidance requires it |

The perpendicularity value can be traced directly to roller alignment. Suppose the bore is 40 mm deep and its axis may tilt within a cylindrical zone of Ø0.02 mm. The worst tilt is roughly 0.02 ÷ 40 = 0.0005 radians, about 0.03°. At a roller face 100 mm from the mounting face, that tilt displaces the roller by about 0.0005 × 100 = 0.05 mm. If the belt tracks acceptably with that error, Ø0.02 is adequate. If not, the requirement needs tightening, or the design should locate the roller differently. Either way, the number now has a reason.

## Position versus plus-and-minus coordinates

Before geometric tolerancing became common, hole positions were given by coordinates with plus-and-minus tolerances, such as 35 ± 0.1 in each direction. That creates a square tolerance zone 0.2 mm across. Its corners are 0.141 mm from the true position along the diagonal, while points on the sides are only 0.1 mm away. The drawing therefore accepts a hole 0.141 mm off diagonally but rejects one 0.11 mm off horizontally, although the second hole is closer to where it should be.

Function rarely cares about direction. A bolt passing through a clearance hole has the same allowance all around. A cylindrical position zone reflects that. If the square's corners are already acceptable, a circle through them, Ø0.283 mm, is just as acceptable in every direction. Its area is about 57% larger than the square's, so a process that meets the coordinate tolerance has more room under the equivalent position tolerance, with no loss of function.

```figure
type: svg
title: Square coordinate zone versus cylindrical position zone
alt: A square tolerance zone of plus or minus 0.1 millimetres sits inside a circle of diameter 0.283 millimetres through its corners, inside a larger circle of diameter 0.5 millimetres. A measured hole centre lies outside the square but inside the 0.5 millimetre circle.
caption: The circle through the square's corners has about 57% more area. The measured hole (Δx +0.12, Δy −0.09) fails the coordinates but sits inside a Ø0.5 position zone.
viewbox: 0 0 640 440
body:
<circle class="lf dsh" cx="320" cy="220" r="200"/>
<circle class="bxa" cx="320" cy="220" r="113"/>
<rect class="bxi" x="240" y="140" width="160" height="160"/>
<path class="cl" d="M90 220H550M320 10V430"/>
<circle class="fi" cx="320" cy="220" r="4"/>
<path class="la draw" pathLength="1" d="M320 220L416 292"/>
<circle class="fa pulse" cx="416" cy="292" r="9"/>
<text class="txb" x="430" y="320">Measured hole</text>
<text class="tx" x="430" y="340">radial 0.15 mm, position Ø0.30</text>
<text class="txb" x="248" y="132">Square ±0.1 mm</text>
<text class="txa" x="320" y="96" text-anchor="middle">Circle Ø0.283 mm</text>
<text class="tx" x="320" y="38" text-anchor="middle">Position tolerance Ø0.5 mm</text>
<text class="tx" x="326" y="214">True position</text>
```

| Zone | Size | Area (mm²) |
|---|---|---|
| Square from ±0.1 mm coordinates | 0.2 × 0.2 | 0.0400 |
| Circle through the square's corners | Ø0.283 | 0.0628 |

Positional tolerancing also removes the stacking of chained dimensions. When holes are dimensioned from each other with plus-and-minus tolerances, errors accumulate along the chain. With basic dimensions from datums, every hole is located independently from the same frame.

## Evaluating position from measurements

A coordinate measuring machine reports the measured location of a hole axis as deviations from true position, say Δx and Δy in the datum frame. The positional deviation, expressed as a diameter to compare with a Ø tolerance, is:

```figure
type: formula
title: Converting CMM deviations into a position value
formula: Position = 2 × √(Δx² + Δy²)
caption: The zone is a diameter, so the radial distance from true position is doubled before comparing with the tolerance.
- Δx, Δy | measured deviations from true position in the datum frame
- Position | diameter of the smallest zone containing the axis
step: √(0.12² + 0.09²) = √0.0225 = 0.15 mm radial
step: Position = 2 × 0.15 = Ø0.30 mm
step: Ø0.30 ≤ Ø0.5 tolerance: the hole conforms
```

**Position = 2 × √(Δx² + Δy²)**

This is an illustration. A Northgate housing hole measures Δx = +0.12 mm and Δy = −0.09 mm from its true position. Then √(0.12² + 0.09²) = 0.15 mm, and the position is Ø0.30 mm. With a positional tolerance of Ø0.5 mm, the hole conforms. Under ±0.1 mm coordinate tolerances, the same hole would have been rejected because Δx exceeds 0.1 mm, even though it assembles perfectly well.

The factor of two often trips people up. The tolerance zone diameter is twice the allowed radial distance from true position.

## Run-out and coaxiality on the shaft

The Northgate shaft has two bearing seats that should share an axis, and a roller seat that should run true to them. Two approaches are common:

- **Coaxiality** (concentricity in some older practice) controls the derived axis of one cylinder relative to a datum axis. It is functionally precise but requires extracting axes from measured points, which is not always easy to do in a workshop.
- **Run-out** controls the variation of a surface as the part rotates about a datum axis. Circular run-out checks each cross-section separately; total run-out checks the whole surface at once. Run-out is easily measured with a dial indicator while the shaft turns on its datum features, and it captures both eccentricity and form errors that would make the roller wobble.

For a rotating shaft, run-out to a common datum axis formed by both bearing seats, often written A–B, usually reflects function best: the shaft really does rotate about the line through its two bearings. Total run-out on the bearing seats themselves, relative to that common axis, controls their combined straightness and alignment.

## Profile for everything else

Profile of a surface is the most general geometric tolerance. It defines a uniform zone either side of the true profile defined by basic dimensions, and can control shape alone or shape plus orientation and location, depending on the datums referenced. It is particularly useful for curved or complex surfaces, castings and sheet metal outlines, where plus-and-minus dimensions to many points would be confusing. Some organisations use profile of a surface to tolerance nearly every non-feature-of-size surface on a part, with size tolerances only on holes, pins and slots.

## The spacer revisited

Chapter 2 noted that the spacer's "length" is ambiguous if its end faces are not square to its bore. A practical specification is a size tolerance on length together with a perpendicularity tolerance on each end face relative to the bore axis, or a parallelism tolerance between the faces. The faces then push squarely against the bearing outer rings, and the length measurement means the same thing to the turner and the inspector.

## The failure case: a perpendicularity zone with one direction missing

This is an illustration. When Northgate first added the bore's perpendicularity to the housing drawing, the frame read "⊥ 0.02 A", without the diameter symbol. The designer meant a cylindrical zone of Ø0.02 mm, as calculated above. What the drawing specified was a zone between two parallel planes 0.02 mm apart, perpendicular to datum A. That zone controls the tilt of the bore axis in one direction only. It says nothing about tilt at right angles to it.

The supplier's coordinate measuring machine program evaluated the requirement exactly as drawn. It reported one value per housing, every one inside 0.02 mm. A housing in the first production batch had its bore axis tilted by about 0.03 mm over the 40 mm depth of the bore in the uncontrolled direction. It passed. At the roller face, 100 mm from the mounting face, that tilt displaced the roller by about 0.03 ÷ 40 × 100 = 0.075 mm, half as much again as the 0.05 mm the belt tracking had been judged to tolerate. The belt on that unit wandered, and it took two days to trace the cause back to a missing symbol.

### How it is detected

For each geometric tolerance, describe its zone in words: what shape it is, how large, and in which directions it constrains the feature. "Two planes, 0.02 mm apart, perpendicular to A" immediately raises the question: which way do they face? A measurement report that gives one number for an axis requirement, where function cares about every direction, is another clue.

### How it is corrected

The frame became "⊥ Ø0.02 A", and the supplier's program was changed to evaluate a cylindrical zone. The review checklist in Chapter 10 now asks, for every axis tolerance, whether the Ø symbol is present when function cares about all directions.

## Common mistakes

- **Perpendicularity without the Ø symbol** when an axis is toleranced. Without it the zone is two parallel planes, which controls only one direction of tilt.
- **Refinements that do not refine.** A flatness value larger than the related parallelism adds nothing.
- **Positional tolerances with toleranced locating dimensions.** Locations controlled by position should be basic dimensions; adding plus-and-minus tolerances to them creates two conflicting requirements.
- **Coaxiality where run-out would do.** If the function is a rotating surface running true, run-out is usually easier to verify and closer to function.
- **Geometric tolerances without datums that make sense.** A perpendicularity tolerance to an unstable or non-functional face controls the wrong thing.

## Questions to ask

- What zone does this tolerance create, and does that shape match the functional need?
- Could a cylindrical position zone replace coordinate tolerances and accept more good parts?
- Are refinements smaller than the tolerances they refine?
- How will the inspector evaluate this requirement, and is that consistent with the datum scheme?

## Exercise: evaluate four bolt holes

The four clearance holes of one Northgate housing are toleranced at position Ø0.5 mm relative to A and B, regardless of feature size, with a size of Ø9.0 to Ø9.2 mm. The measuring machine reports these deviations from true position in that frame: hole 1, Δx = +0.12 and Δy = −0.09 mm; hole 2, +0.21 and +0.10 mm; hole 3, −0.18 and +0.17 mm; hole 4, +0.05 and −0.26 mm. Each hole is within its size limits. Which holes conform? How would the old ±0.1 mm coordinate tolerances have judged them?

**Worked answer.** The [true position tool](/tools/true-position/) in BIZOMAT Tools converts measured deviations into a diametral position and compares it with the allowed tolerance.

| Hole | Δx, Δy (mm) | Position | Ø0.5 position | ±0.1 coordinates |
|---|---|---|---|---|
| 1 | +0.12, −0.09 | Ø0.300 | Conforms | Rejected: Δx over 0.1 |
| 2 | +0.21, +0.10 | Ø0.465 | Conforms | Rejected: Δx over 0.1 |
| 3 | −0.18, +0.17 | Ø0.495 | Conforms, only just | Rejected: both over 0.1 |
| 4 | +0.05, −0.26 | Ø0.530 | **Does not conform** | Rejected: Δy over 0.1 |

Three holes conform and the housing is rejected because of hole 4. The coordinate tolerances would have rejected all four. Hole 3 is the warning: at Ø0.495 mm it leaves almost nothing for measurement uncertainty, which Chapter 10 deals with. Hole 4 measures Ø9.12 mm, larger than its smallest permitted size. The next chapter shows how a material condition modifier would let that extra size count towards its position.

**Try it on your own drawing.** Take a drawing with hole positions given by plus-and-minus coordinates. Re-specify them with basic dimensions from functional datums and a cylindrical position tolerance equal to the diagonal of the original square zone. Calculate the area gained, then check whether any parts rejected in the past would have conformed.

Position tolerances become even more useful when they are linked to the actual size of the feature. The next chapter covers material condition modifiers, bonus tolerance and the classic fastener formulas.
