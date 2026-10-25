---
book: checking-drawings-by-the-numbers
chapterSlug: is-every-feature-defined
order: 4
title: "Is every feature defined? Counting dimensions"
description: "Count the dimensions each feature needs for its size, location and orientation, compare the count with the drawing feature by feature, and find missing dimensions that totals hide."
draft: false
---

A missing dimension is the classic drawing fault, and the hardest to see by reading. The eye slides over a well-dimensioned view and registers that it looks complete; it does not notice the absence of the one number that locates a boss in the third direction. The machinist notices, because they cannot set the tool without it, and then they either ask, which costs a day, or assume, which may cost the batch.

Counting finds what reading misses. Each feature needs a known number of dimensions to fix its size, its location and, where it is not implied, its orientation. Add those up feature by feature, compare with what the drawing gives, and every gap or surplus shows. This chapter sets out the count, applies it to the TA-201 arm, and shows why the totals can agree while the drawing is still wrong.

## What a feature needs

Each feature must have its **size** fixed, its **location** fixed relative to the datums or to related features, and its **orientation** fixed where the drawing's conventions do not imply it. The number of dimensions that takes depends on the feature.

- A **round hole square to a face** needs its diameter, its depth or "THRU", and its position in the two directions in the plane of the face: four items, of which depth may be a note.
- A **threaded hole** needs its thread designation in place of the diameter, its thread depth and drill depth if blind, and the same two positions.
- A **plane face** needs its position in the one direction square to it. Two parallel faces need one position and one thickness, or two positions.
- An **inclined feature** needs its angle in addition, measured from a stated face or axis.
- A **chamfer or edge break** needs its size and angle, often as a single callout such as 1 × 45°.
- A **pattern** of identical features needs one feature's size, the pattern's location, and enough to place the others: a pitch circle and an angle, or a pitch and a count.

Some items are implied by convention rather than dimensioned: a hole drawn square to a face is square unless stated, features drawn on a common centreline share it, and a symmetrical part dimensioned from its centreline is symmetrical. A checker counts implied items as satisfied only when the convention genuinely applies, and is suspicious when a dimension that would be awkward to give has been left to "obvious".

```figure
type: compare
title: Dimensions needed by common features
cols: Size | Location | Orientation | Typical total
caption: Counts assume the feature lies on or square to a principal face. Depth may be given by a note such as THRU.
- Round hole, through | Diameter | Two positions on the face | Implied square | 3, plus THRU
- Round hole, blind | Diameter and depth | Two positions | Implied square | 4
- Tapped hole, through | Thread designation | Two positions | Implied square | 3, plus THRU
- Plane face | None | One position | Implied parallel | 1
- Pair of parallel faces | Thickness | One position | Implied parallel | 2
- *Inclined hole | Diameter | Two positions on the entry face | Angle from a stated face | 4
- Chamfer | Size and angle | Implied at the edge | Implied | 1 callout
```

## Which datums the locations come from

A location dimension has two ends, and one of them should be a datum or a related feature that matters to function. Counting therefore goes with a second question: located from what? A hole located from a cast edge when it should be located from the machined bore is dimensioned, but not from the right place, and the count will not reveal that.

This is an illustration. The arm's functional datums are the pivot bore, which the arm turns on, and the pivot boss's front face, which sets the arm's axial position on its pin. Every machined feature that affects the belt's path should be located from those two: the spindle hole's distance from the pivot, the spindle boss's axial offset from the pivot boss front face, the stop lug face's distance from the pivot axis. The cast outline is located from the same datums on sheet 1 but carries the casting's general tolerance.

## The running case: counting the arm

This is an illustration. The checker listed the arm's machined features from the matrix in Chapter 3, wrote down what each needs, and then counted what sheets 1 and 2 actually give.

```figure
type: compare
title: Dimension count for the TA-201 arm's machined features
cols: Needed | Given | Finding
caption: This is an illustration. The totals agree at 15, yet the drawing has one duplicate and one missing dimension.
- Pivot bore, Ø16.000 to 16.018 | 1 | 1 | Datum A
- Pivot boss length, front to rear face | 1 | 1 | 30.0 ±0.1
- Spindle hole, M12 thread, THRU | 1 | 1 | Agreed
- *Spindle hole position from the pivot | 1 | 2 | 120.0 ±0.1 given in both views: duplicate
- *Spindle boss, offset from pivot boss front face and thickness | 2 | 1 | Thickness only: offset missing
- Spring anchor hole: Ø, two positions, 15° angle | 4 | 4 | Complete after Chapter 3's section B–B
- Stop lug face: angle and distance from pivot axis | 2 | 2 | Agreed
- Bore chamfers and spindle countersink | 3 | 3 | Agreed
```

The total needed is 15 and the total given is 15. A checker who counted only the totals would have passed the drawing. Feature by feature, the spindle hole's position is given twice, once in the front view and once in section A–A, and the spindle boss's axial offset from the pivot boss front face is not given at all.

## Why the missing offset matters

The spindle boss carries the pulley. Its front face, measured axially from the pivot boss's front face, decides where the pulley sits along the pivot axis, and therefore whether the pulley lines up with the belt. The design brief requires the pulley's face to be within ±0.3 mm of the drive pulley's plane, and the designer's layout set the spindle boss's front face 4.0 mm behind the pivot boss's front face.

On the drawing, the spindle boss's thickness was given, 20 mm, but its position along the axis was not. A machine shop facing the spindle boss would take its position from somewhere: most likely, it would face the boss just enough to clean up the casting, leaving its position wherever the casting put it. The casting's general tolerance is ±1.5 mm, so the pulley could sit anywhere from 2.5 to 5.5 mm behind the pivot face, up to five times outside the ±0.3 mm alignment the belt needs.

The checker's mark-up asked for "SPINDLE BOSS FRONT FACE 4.0 ±0.1 FROM DATUM B", with datum B the pivot boss front face, and for the duplicate 120 mm dimension to be removed from section A–A, keeping the one in the front view where the hole appears as a circle.

```figure
type: range
title: Where the pulley face could sit along the pivot axis
min: 2
max: 6
unit: mm
caption: This is an illustration. Distance of the spindle boss front face behind the pivot boss front face. The belt needs the pulley within ±0.3 mm of the 4.0 mm design position.
ticks: 2 | 3 | 4 | 5 | 6
- Undimensioned, cast ±1.5 mm | 2.5 | 5.5
- *Dimensioned 4.0 ±0.1 mm | 3.9 | 4.1
- Belt alignment limit | 3.7 | 4.3
```

## Duplicates are faults too

A duplicated dimension is a smaller fault than a missing one, but not a harmless one. Two copies of 120.0 ±0.1 agree today. If the spindle hole moves in a later revision and the drafter updates one copy, the drawing then states two different positions for one hole, and the supplier must choose. Associative CAD dimensions reduce the risk, because both update with the geometry, but a dimension whose value has been overridden, or one in a view that was not regenerated, will not.

The rule is that each feature is dimensioned once, in the view where it is clearest. A dimension needed in a second view for a reader's convenience is shown as a reference dimension, in brackets, and carries no tolerance. Chapter 5 deals with duplicates that arise from chains.

## Tolerances belong to the count

Every dimension counted is also a tolerance: either its own, stated beside it, or the general tolerance in the title block. The count is a good moment to check that each functional dimension has the tolerance its function needs, and that the general tolerance is genuinely adequate for the rest.

This is an illustration. The arm's general tolerance for machined dimensions is ±0.5 mm. Of the 15 dimensions counted, eight are functional and carry their own tolerances: the bore limits, the boss length, the spindle position, the new spindle boss offset, the stop lug distance and angle, and the anchor hole's angle and position. The other seven, the M12 thread designation, the spindle boss thickness, the anchor hole's diameter and its second position, and the three chamfer and countersink callouts, are adequately controlled by their own specification or at ±0.5 mm. The checker confirmed each functional tolerance against the design brief or the calculation behind it, and marked none.

## The error that the count caught late

This is an illustration. The office had used the count on the arm, but not on a previous project's bracket, drawn by the same drafter. That bracket had a threaded hole whose depth was not given; the drawing said "M8" with a leader. The machine shop drilled and tapped it through, because through is the default when no depth is given, and the tap broke out into a cavity that held an O-ring on the other side. Twenty brackets were scrapped.

A count would have found it: a tapped blind hole needs its thread, its thread depth, its drill depth and two positions, five items, and the drawing gave three. The office now runs the count on every machined part and records it on the check sheet, with the needed and given figures for each feature, so that a missing item is a visible mismatch rather than an absence the eye slides over.

## Doing the count quickly

The count sounds slow and is not, once it has a routine. The office's routine for a machined part takes about a minute per feature:

1. List the functional features from the view matrix, one per line.
2. Beside each, write what it needs: size, positions, orientation, depth.
3. Highlight each dimension on the print as it is matched to a feature, and tick the feature.
4. Note any feature with fewer ticks than it needs, and any dimension left unhighlighted at the end.
5. For every matched dimension, note the datum it runs from and whether its tolerance is its own or general.

Step 4's leftovers are the findings. An unhighlighted dimension is either a duplicate, a reference dimension that should be in brackets, or a dimension for a feature the list missed, which means the list needs another line.

## Counting a pattern

Patterns compress many features into a few dimensions, and the count must allow for that. This is an illustration. The tensioner arm has no hole patterns, but the office's earlier idler arm, drawn for a different conveyor, had four M5 tapped holes in its spindle boss for a pulley shield, on a 32 mm pitch circle about the spindle hole, at 45° to the arm's centreline. Its check is a good example of why patterns need their own line in the count. Counted one by one, four holes would need 4 × 3 = 12 items. As a pattern they need five: the thread designation and depth, the pitch circle diameter, the angular position of the first hole, and the count with "EQUALLY SPACED". The pattern's centre is the spindle hole's axis, already located.

The drawing gave "4 × M5 × 8 DEEP" with a leader, and a 32 mm pitch circle. It did not give the 45° angle. With four holes equally spaced, a reader would have to guess whether the first hole sits on the centreline or at 45° to it, and the shield, whose own holes are at 45°, would fit only one way. The count, five needed and four given, found it, and the angle was added. The same reasoning applies to linear patterns: a row of slots needs one slot's size, the first slot's position, the pitch and the count, and a row given as a chain of individual positions instead is not wrong but invites the accumulation and duplication problems of Chapter 5.

## Counting cast and fabricated features

Machined features have crisp counts. Cast outlines, fabricated profiles and formed shapes are less tidy: a cast profile may need dozens of radii and positions, most of which the pattern maker can take from the model. Offices handle this in one of two ways. The drawing can dimension the cast form fully, which is laborious but complete, or it can dimension the features that matter and state that the remaining cast form is "AS PER MODEL", with the model's revision given. The second is common and acceptable if the note is explicit and the model is supplied. The checker's job then is to confirm that every cast feature that matters to function or to machining, such as the cast datum surfaces and the machining allowances, is dimensioned on the drawing rather than left to the model.

## Exercise: counting the pin

The pivot pin, TA-202, is a turned part with a head Ø20 × 5 mm, a shank Ø11.973 to 11.984 mm, a retaining ring groove whose inner face is 34.0 to 34.1 mm from the underside of the head, a groove width of 1.1 mm and a groove diameter of 11.5 mm, a 0.5 × 45° chamfer at the free end and a 0.3 mm radius under the head. The overall length is 43.0 mm. How many dimensions does the pin need, and which should carry their own tolerances?

**Worked answer.** For a turned part on one axis, positions across the axis are implied by the common centreline, so each feature needs only its diameter and its axial position or length.

- Head: diameter and length, **2**.
- Shank: diameter, **1**; its length is set by the overall length.
- Overall length, **1**.
- Groove: axial position of its inner face from the underside of the head, width and diameter, **3**.
- Free-end chamfer, **1** callout.
- Radius under the head, **1**.

That is **9**. The functional ones, which need their own tolerances, are the shank diameter, because it sets the running clearance in the bush; the groove's inner face position, because it sets the axial float; and the groove's width and diameter, because the retaining ring supplier specifies them. The head size, overall length, chamfer and radius can sit under the pin's general tolerance. If the drawing gives nine dimensions in those places, from the underside of the head as datum, it is complete; Chapter 7 then checks whether the groove position is right.
