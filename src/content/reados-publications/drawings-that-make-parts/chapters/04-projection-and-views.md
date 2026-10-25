---
book: drawings-that-make-parts
chapterSlug: projection-and-views
order: 4
title: "Projection, view selection and the projection symbol"
description: "Choose the fewest views that define a part in third-angle projection, mark the projection method, label views correctly and see how a first-angle reading mirrors a feature."
draft: false
---

A detail drawing shows a three-dimensional part in flat views. The reader rebuilds the part in their head from those views, using a set of rules about where each view sits relative to the others. Two sets of rules are in common use, third-angle and first-angle projection, and they place the side views on opposite sides. A reader who applies the wrong rules builds a mirror image of any feature that is not symmetrical.

This chapter covers the projection methods recognised in AS 1100.101, the principles for choosing views, the rules for naming views and labelling features, and the special views that save space. The running case shows how the housing can be fully defined in three views, one of them partial, and how an unmarked projection turned into a mirrored lubrication hole.

## Methods of projection

AS 1100.101 Table 6.1 groups projection methods by whether the lines of sight are parallel or converging:

```figure
type: tree
title: Methods of projection, AS 1100.101 Table 6.1
caption: From AS 1100.101-1992. Orthogonal projection is used for dimensioned multiview drawings; the others give single pictorial views.
- Parallel lines of sight
  - Orthogonal | *third angle (preferred) or first angle | two-dimensional multiview drawings
  - Axonometric | isometric, dimetric or trimetric | single pictorial view
  - Oblique | cavalier, cabinet or general | single pictorial view
- Converging lines of sight
  - Perspective | one-point, two-point or three-point | single pictorial view
```

Detail drawings use orthogonal projection, in which each view is formed by lines of sight perpendicular to the plane of projection. Pictorial views, usually isometric, are useful on assembly and instruction drawings to help a reader understand the shape, but they are poor for dimensioning because most lengths are foreshortened.

## Third angle and first angle

AS 1100.101 clause 6.3 explains the two orthogonal methods in terms of where the projection plane sits. In **third-angle** projection, the plane is between the observer and the object, so each view is placed next to the side of the adjacent view that it represents: the view from the right is drawn to the right of the front view, and the view from above is drawn above it. In **first-angle** projection, the object is between the observer and the plane, so each view represents the side of the adjacent view remote from it: the view from the right is drawn on the left, and the view from above is drawn below.

The standard states that third-angle projection is preferred and that drawings must be marked to show which method is used, either by the projection symbol or by the words "3RD ANGLE PROJECTION" or "1ST ANGLE PROJECTION". The symbol is a small pair of views of a truncated cone; the arrangement of its two views shows the method.

```figure
type: compare
title: Where the views go in each method
cols: Third angle (AS 1100.101 preferred) | First angle
caption: Summarised from AS 1100.101 clause 6.3. Many European and Asian drawings use first-angle projection, so the symbol on every sheet matters.
- View from the right | drawn to the right of the front view | drawn to the left of the front view
- View from above (top view) | drawn above the front view | drawn below the front view
- View from the left | drawn to the left | drawn to the right
- *Rule of thumb | each view sits beside the face it shows | each view sits on the far side from the face it shows
```

## Choosing views

AS 1100.101 clause 6.3.4 gives three principles for selecting views:

1. Reduce the number of views needed to define the part.
2. Avoid the need for hidden outlines.
3. Avoid unnecessary repetition of detail.

It adds that the number of views must be enough to portray the shape without possibility of misinterpretation, that three views are sufficient for many objects, that any three adjacent views may be used, and that fewer views may be enough where notes or symbols supply the missing information. A turned part dimensioned with diameter symbols, for example, can often be shown in one view, because "Ø" tells the reader the feature is round.

The principles pull against each other at times. Removing a view can force hidden lines into the remaining ones; adding a section removes hidden lines but adds a view. The aim is the clearest complete set, not the smallest, and a reviewer should be able to say what each view is for.

### Which view is the front view?

The principal view, the one the others are arranged around, should be the one that shows the most about the part. For a turned part, that is usually a side view with the axis horizontal, because it shows every diameter and length. For a plate or bracket, it is usually the view showing the outline and hole pattern. Machinists also appreciate a principal view drawn in the attitude the part will be machined or used, because it matches what they will see on the machine.

The choice of front view also decides where the other views go and which features appear as hidden lines. Rotating the part on the sheet before choosing views often removes more hidden lines than any amount of later tidying.

### Views of the housing

This is an illustration. The housing is round, but not symmetrical end to end. The flange end carries the spigot and the four flange holes. The rear end carries the four M6 tapped holes, which sit at 45° to the flange holes so that the end cap screws clear the flange bolts. There is also a lubrication hole, tapped M8 × 1, through the body wall at 30° clockwise from the top when the housing is viewed from the flange end.

The designer's first layout had four views: a front view of the flange end, a side view, a top view and a rear view. Most of the side and top views were hidden lines. Applying the three principles reduced it to:

- **A front view of the flange end**, showing the flange outline, the four flange holes on their pitch circle and the lubrication hole's angular position.
- **A full section A-A through the axis**, replacing the side view, so that the bore, shoulder, spigot, a flange hole and a tapped hole are all shown in visible lines (Chapter 5).
- **A partial rear view**, placed to the right of the section as third-angle projection requires, showing only the rear face with the four tapped holes and their 45° offset.

The top view disappeared: everything it showed was either in the section or defined by diameter symbols.

```figure
type: checklist
title: View selection for the housing
caption: This is an illustration. Each view is kept only if it shows something no other view shows.
- x Front view of the flange end | flange holes, pitch circle, lubrication hole angle
- x Section A-A through the axis | bore, shoulder, spigot, depth of tapped and flange holes
- x Partial rear view, to the right of the section | tapped holes and their 45° offset
- x Top view removed | its information is in the section and the diameter symbols
- x Projection marked by symbol and words in the title block | AS 1100.101 clause 2.5.6
```

## Naming views and labelling features

AS 1100.101 clause 6.1 sets rules for the letters used to identify views, cutting planes, sections and features:

- The letters I, O and Q are not used, because they are easily confused with numerals.
- When the other 23 letters are used up, two-letter combinations follow: AA, AB, AC.
- Each letter or combination is used only once on a drawing, for whatever purpose. If "A" labels a view, it cannot also label a cutting plane.
- Cutting planes carry their letters at each end, and the matching section is titled with the letters separated by a hyphen, as in "SECTION A-A".

The standard also names the six principal views: front, top, left side, right side, bottom and rear. A view that deviates from the projection method in use, for example one placed elsewhere on the sheet for space, must be titled, with the viewing direction shown by an arrow about twice the size of a dimension arrowhead and a letter one size larger than the dimension characters (clause 6.3.5).

## Checking a drawing whose projection you are unsure of

When a drawing arrives without a projection symbol or words, do not guess. Ask the issuer. If an answer is not available quickly, there is a reliable check: find a feature that appears in two adjacent views and is not symmetrical, such as a hole off-centre, a flat on one side or a step. Build the part both ways in your head or with a quick sketch. Only one reading will make the views consistent with each other. If both readings are consistent, the views alone cannot settle it, and the drawing must not be used for that feature until the issuer confirms.

The same check is a useful self-test for a designer. If every feature on a part is symmetrical about the axes of the views, a missing projection marking may do no harm. If even one feature is asymmetric, as the housing's lubrication hole is, the marking is what stands between the part and its mirror image.

## Pictorial views

Isometric views are common on assembly drawings, exploded parts lists and instructions, because a reader can understand the arrangement without assembling orthographic views in their head. AS 1100.101 treats axonometric, oblique and perspective drawings as single-view pictorial methods. Because lines in a pictorial view are foreshortened by different amounts depending on their direction, dimensions should not be read or scaled from them. A pictorial view supports the orthographic views; it does not replace them.

## Views that save space

Several kinds of view reduce the size of a drawing without losing information:

- **Partial views** show only the part of a view that adds information, such as the housing's rear face. AS 1100.101 allows them where a full view would not improve the definition.
- **Half views of symmetrical parts** show one side of a line of symmetry, marked by two short parallel narrow lines at each end of that line.
- **Enlarged details**, labelled and drawn at a larger scale, show small features such as grooves and undercuts.
- **Auxiliary views** show the true shape of an inclined surface by projecting at right angles to it.
- **Removed and revolved sections** show the cross-section of a long part where it is cut, as in Chapter 5.

## The error: a mirrored lubrication hole

The business sent an early revision of the housing drawing to a machine shop that normally works for European customers. The template used for that revision had lost its projection symbol in a title block update, and the words were not there either. The shop, used to first-angle drawings, read the views that way.

Most features survived, because the housing is round. The lubrication hole did not. Under first-angle reading, the end view on the left of the section is taken to be the view from the right-hand end, not the flange end. The shop placed the lubrication hole at 30° anticlockwise from the top as seen from the flange end, instead of 30° clockwise. The parts looked right on inspection of individual dimensions, because the angle was correct, but the hole was on the wrong side. It was found at the first trial assembly, when the grease nipple fouled a rib on the pump casing.

The investigation took an hour once someone asked "which projection did you read this in?". The correction restored the symbol and the words to the template, added a check of the projection marking to the release checklist in Chapter 10, and added an angle note to the lubrication hole's dimension, "30° CW FROM TOP VIEWED FROM FLANGE END", because a feature whose position depends on the reading direction deserves to be stated in words as well as shown.

The error could have been caught earlier in two places. A first-article inspection that checked the lubrication hole against a simple fixture representing the pump casing, rather than only its angle with a protractor, would have found it before the batch was finished. And a supplier induction that asked new shops which projection they normally work in would have flagged the risk before the first order. The business now does both for any supplier whose usual customers are overseas. Neither is a substitute for a marked drawing, but together they turn a single point of failure into three independent checks.

The batch itself was recovered. Because the lubrication hole was the only asymmetric feature, the shop plugged the wrong hole with a sealed threaded plug, drilled and tapped a new hole in the correct position, and the business accepted the parts on a recorded concession after checking that the plug could not leak into the bearing cavity. The cost was a day of rework and the concession paperwork, which was small only because the error was found before the cartridges went into pumps.

## Exercise: views for a spacer bush

A plain steel spacer bush is 40 mm long, with an outside diameter of 30 mm, a bore of 20.5 mm and a 1 mm × 45° chamfer at each end of the outside diameter. How many views does it need, and which?

**Worked answer.** One view is enough. A single side view of the bush, dimensioned with "Ø30" for the outside, "Ø20.5" for the bore, "40" for the length and "1 × 45°" for the chamfers (noted as both ends), fully defines the shape. The diameter symbol tells the reader the features are round, which is the information an end view would add.

Showing the bore in the side view needs hidden lines. Applying the second principle, avoiding hidden outlines, the designer could draw the view as a full section or a half section instead (Chapter 5), which shows the bore in visible lines and still uses only one view. Adding an end view would repeat detail without adding information, against the third principle. The general rule is that turned parts usually need one view and a section, and prismatic parts usually need two or three. Whatever the count, every view should earn its place by showing something the others do not.
