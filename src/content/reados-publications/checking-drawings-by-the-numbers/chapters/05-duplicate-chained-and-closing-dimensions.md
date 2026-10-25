---
book: checking-drawings-by-the-numbers
chapterSlug: duplicate-chained-and-closing-dimensions
order: 5
title: "Duplicate, chained and closing dimensions"
description: "Find closed dimension loops by counting faces and dimensions on each axis, show why their tolerances conflict, choose which dimension to drop, and catch chains that accumulate error."
draft: false
---

Chapter 4 counted dimensions feature by feature and found one missing and one duplicated. A subtler kind of surplus does not show up as two copies of the same number. It shows up as a chain of dimensions that closes on itself: the head length, the groove position, the groove width and the end land all given, and the overall length too. Each dimension is different, each looks reasonable, and together they define one length twice. With tolerances on every link, the drawing then permits parts that contradict each other.

This chapter shows how to find closed loops by counting, why their tolerances conflict, and which dimension to remove. It also deals with the opposite habit, chaining dimensions from feature to feature when they should run from a datum, which does not overdefine the part but lets errors accumulate where function cannot tolerate them. The running case finds a closed loop on the pivot pin and a chain on the arm.

## Faces and dimensions on one axis

Along any one direction, a part has a number of faces or features whose positions matter. If there are n of them, n − 1 independent dimensions fix their positions relative to one another. Give fewer and something is undefined; give more and at least one dimension is redundant, because it can be calculated from the others.

That makes the check a count, axis by axis. List the faces along the axis, count them, count the dimensions that run along the axis between them, and compare. If dimensions exceed faces less one, there is a closed loop. Reference dimensions, shown in brackets without tolerance, do not count, because they are explicitly for information.

```figure
type: formula
title: Dimensions needed along one axis
formula: independent dimensions = faces − 1        surplus = dimensions given − (faces − 1)
caption: Count only toleranced dimensions along the axis; reference dimensions in brackets are excluded. A surplus above zero means at least one closed loop.
- faces | Faces or features whose positions along the axis matter
- dimensions given | Toleranced dimensions running along the axis between them
step: Pin, along its axis: head top, head underside, groove inner face, groove outer face, free end, so 5 faces
step: Independent dimensions needed: 5 − 1 = 4
step: Dimensions given: head 5.0, groove position 34.0/34.1, groove width 1.10/1.24, end land 2.9, overall 43.0, so 5; surplus 1
```

## The running case: the pin's closed loop

This is an illustration. Along its axis, the pivot pin TA-202 has five faces that matter: the top of the head, the underside of the head, the inner and outer faces of the retaining ring groove, and the free end. The drawing gives five toleranced dimensions along that axis:

- head length 5.0 ±0.2 mm;
- groove inner face 34.0 to 34.1 mm from the underside of the head;
- groove width 1.10 to 1.24 mm, as the retaining ring supplier specifies in this illustration;
- end land, from the groove's outer face to the free end, 2.9 ±0.2 mm;
- overall length 43.0 ±0.2 mm.

Five faces need four dimensions. Five are given, so one is surplus. The loop is the overall length on one side and the head, groove position, groove width and end land on the other: nominally 5.0 + 34.0 + 1.1 + 2.9 = 43.0 mm, which agrees with the overall length. The nominal values close; the tolerances do not.

## Why the tolerances conflict

The four chained dimensions, each at its limits, give a sum anywhere from 4.8 + 34.0 + 1.10 + 2.7 = **42.60 mm** to 5.2 + 34.1 + 1.24 + 3.1 = **43.64 mm**. The overall length allows only 42.8 to 43.2 mm. A pin made with every chained dimension inside its tolerance can therefore have an overall length outside its tolerance, and a pin made inside the overall tolerance can force one of the chained dimensions out of its own.

Worse, a machinist who works from a subset of the dimensions can make a part that satisfies the dimensions they used and fails the one they did not. Turning from the free end, a machinist might set the overall length and the end land and then cut the groove. Take the overall length at its maximum, 43.2 mm, the head at its minimum, 4.8 mm, and the land at its minimum, 2.7 mm. The groove's outer face is then 43.2 − 4.8 − 2.7 = 35.7 mm from the underside of the head, and its inner face 35.7 − 1.1 = **34.6 mm** away, half a millimetre beyond the 34.1 mm limit that sets the arm's axial float. Every dimension the machinist used was in tolerance, and the critical one was not.

```figure
type: range
title: Groove inner face position a machinist could reach from the other dimensions
min: 33
max: 35
unit: mm
caption: This is an illustration. Distance from the underside of the head, worked out from the overall length, head length, end land and groove width at their limits. The functional limit is 34.0 to 34.1 mm.
ticks: 33 | 33.5 | 34 | 34.5 | 35
- Reachable from the chain | 33.26 | 34.6
- *Required for the axial float | 34.0 | 34.1
```

## Which dimension to remove

When a loop closes, one dimension must go, or be converted to a reference dimension. The choice is not arbitrary: keep the dimensions that matter to function, and drop the one that matters least, so that the error accumulates there.

For the pin, the dimensions that matter are the groove's position from the underside of the head, which sets the axial float, and the groove's width, which the retaining ring needs. The head length matters a little, for clearance. The overall length and the end land matter least: the end land only needs to be long enough to keep the groove from breaking out, and the overall length is a consequence of the others. The checker asked for the end land to be shown as a reference dimension, (2.9), so that the free end's position is set by the overall length and the groove is set from the head, where it belongs. With four toleranced dimensions for five faces, the loop is open, and the end land simply takes up the variation. Its actual value follows from the overall length, the head and the groove, ranging from 42.8 − 5.2 − 34.1 − 1.24 = 2.26 mm to 43.2 − 4.8 − 34.0 − 1.10 = 3.30 mm, and its reference value tells the machinist roughly what to expect. The designer confirmed that even 2.26 mm of land keeps the groove clear of the end chamfer.

```figure
type: steps
title: Closing a dimension loop on the drawing
caption: This is an illustration for the pin. The functional dimension is kept toleranced; the least important one becomes a reference.
- Find the loop | Five faces, five toleranced dimensions along the axis
- Rank by function | Groove position and width first, head next, overall and land last
- Drop the least important | End land becomes the reference dimension (2.9)
- Check the remaining chain | Four dimensions, four independent positions; no surplus
- *Confirm the critical result | Groove inner face set directly from the head at 34.0 to 34.1 mm
```

## Chains that accumulate

The opposite of a closed loop is an open chain dimensioned in the wrong order. Each feature is located from its neighbour rather than from a datum, so the position of the last feature relative to the datum carries the sum of every tolerance in between. That is not overdimensioning; the drawing is consistent. But it may let a functional position vary far more than intended.

This is an illustration. On the arm, the spring anchor hole was first located from the spindle hole, 75 ±0.2 mm along the arm, while the spindle hole was located 120 ±0.1 mm from the pivot. The anchor hole's position from the pivot was therefore 45 mm nominal, with a worst-case spread of ±0.3 mm. The spring's lever arm about the pivot is what sets the belt tension, so the design brief needed it within ±0.2 mm. Relocating the anchor hole directly from the pivot, 45 ±0.2 mm, gave the function its own tolerance rather than inheriting one from an unrelated feature.

The checker's question for every chain is simply: what does the function need this feature located from? If the answer is a datum, the dimension should run from the datum.

## Baseline, chain and ordinate

Drawings use three arrangements for positions along an axis, and the checker should recognise what each implies.

**Baseline dimensioning** runs every position from one datum. Each position carries only its own tolerance, so it suits features whose function is their relation to the datum, such as the arm's features from the pivot.

**Chain dimensioning** runs each position from the previous one. Each spacing carries its own tolerance, so it suits features whose function is their spacing, such as a row of holes that must match a mating part's row, and it accumulates error towards the end.

**Ordinate dimensioning** writes each position as a coordinate from a zero line, without dimension lines. It is baseline dimensioning in a compact form and is common on plate and sheet metal parts.

None is wrong. The fault is a mismatch between the arrangement and the function: chain where the function needs baseline, as on the arm's anchor hole, or baseline where the function needs controlled spacing. The checker asks, for each axis, which relationships the function depends on, and whether the arrangement gives those relationships their own tolerances.

## Angles close too

Loops are not only linear. The interior angles of a closed polygon are related: a four-sided outline's angles sum to 360°, so giving all four, each with a tolerance, overdefines it in the same way as a closed linear chain. A part drawn with three angles of 90° and a fourth "90°" is a closed angular loop. Usually the fourth angle should simply be left off, or shown as a reference, and the shape fixed by three angles and enough lengths. The count is the same in spirit: the shape has a known number of independent quantities, and any more are surplus.

## Duplicates across views and sheets

The most ordinary surplus is a dimension given twice, in two views or on two sheets of the same drawing. Chapter 4 found one on the arm. Two more patterns are worth looking for.

- **Detail views.** A dimension shown on the main view and again on an enlarged detail of the same region. The detail is usually the better place for it, and the main view should then not carry it, or should carry it as a reference.
- **Part and assembly.** A part dimension repeated on the assembly drawing. Assembly drawings should carry assembly dimensions, such as installed positions and clearances, not the parts' own dimensions, which belong on the detail drawings. A part dimension on the assembly is a second statement that can disagree with the first after a revision.

The arm's sheet 2 enlarged the bore chamfers and also repeated the 30 mm boss length from sheet 1. The checker asked for the sheet 2 copy to become a reference.

## Overrides hide loops

In a CAD drawing, a dimension normally shows the measured distance between the geometry it is attached to. A dimension whose text has been typed over shows whatever was typed. An overridden dimension in a loop is especially dangerous, because the loop's nominal values may appear to close while the geometry does not. A drafter who fixed a closure problem by retyping the end land as 2.9 when the model measured 3.0 would have hidden both the loop and the model error.

The checker's routine therefore includes listing the overridden dimensions on each sheet, which most CAD programs can highlight, before counting loops. Each override must be explained or removed, and the loop count is done on the measured values, not the displayed ones.

## The error: a reference that was not one

This is an illustration. On an earlier drawing, the office had shown an overall length in brackets to mark it as a reference, as the checker had asked. A later revision, made by a different drafter in a hurry, added a tolerance to the bracketed value to satisfy a supplier's query. The bracketed dimension now carried "(120.0 ±0.1)", which is a contradiction: a reference dimension has no tolerance, and a toleranced dimension should not be in brackets. The supplier, reasonably, treated it as toleranced, and the loop it closed had reappeared.

The office's check now includes a search for any bracketed dimension carrying a tolerance, and any loop count is redone after a revision that touches dimensions on the counted axis. A loop removed at the first check does not stay removed by itself.

## Exercise: the arm along the pivot axis

Along the pivot axis, the arm has four faces that matter: the pivot boss front face (datum B), the pivot boss rear face, the spindle boss front face and the spindle boss rear face. The revised drawing gives the boss length 30.0 ±0.1, the spindle boss offset 4.0 ±0.1 from datum B, the spindle boss thickness 20.0 ±0.2 and, on sheet 2, the distance from the spindle boss rear face to the pivot boss rear face, 6.0 ±0.2. Is there a closed loop, and if so, what should change?

**Worked answer.** Four faces need 4 − 1 = **3** independent dimensions. Four are given, so there is one surplus and a closed loop: datum B to the pivot rear face is 30.0; datum B to the spindle rear face is 4.0 + 20.0 = 24.0; so the spindle rear face to the pivot rear face is 30.0 − 24.0 = 6.0, which the fourth dimension states again.

The tolerances conflict. Calculated from the other three, that distance ranges from 29.9 − (4.1 + 20.2) = **5.6 mm** to 30.1 − (3.9 + 19.8) = **6.4 mm**, while the fourth dimension allows only 5.8 to 6.2 mm.

The spindle boss offset matters most, because it aligns the pulley; the boss length matters next, because it sets the axial float with the washers; the spindle boss thickness matters for the pulley's seating. The 6.0 mm distance on sheet 2 matters least and should become a reference, (6.0). With three toleranced dimensions for four faces, the loop is open, and each of the functional positions is set directly.
