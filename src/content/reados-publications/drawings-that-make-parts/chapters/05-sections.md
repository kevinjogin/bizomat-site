---
book: drawings-that-make-parts
chapterSlug: sections
order: 5
title: "Sections that show the inside clearly"
description: "Place cutting planes, hatch cut surfaces and choose full, half, part, revolved and removed sections, following AS 1100.101, so the inside of a part reads without hidden lines."
draft: false
---

Most of the important features of a machined part are inside it: bores, shoulders, grooves, tapped holes, internal passages. In an ordinary view they appear as hidden lines, which are hard to read and easy to misinterpret. A section cuts the part open on paper and shows those features as visible outlines, with the cut surfaces hatched so that the reader can see what is solid and what is space.

This chapter applies AS 1100.101 Section 7 to the running case housing and its assembly. It covers cutting planes, hatching, the kinds of section, and the conventions for parts that are not hatched. Its error case is a hatching pattern that made a solid housing look like two parts.

## Cutting planes

A section starts with a cutting plane, shown on an adjacent view. AS 1100.101 clause 7.2 sets out how:

- Place the plane so that it cuts through the part's main features, preferably shown on an outside view rather than on another section.
- Draw it with a Type H line (in ISO numbering, a long-dashed dotted line, wide where it marks the plane's ends and changes of direction) across the whole part.
- Show the viewing direction with arrowheads, and place the identifying letters at the tails of the arrows.

The standard allows simplifications where clarity is not lost. If the plane lies on a main plane of symmetry, the centre line alone may serve as its indication. Where only one cutting plane appears on a drawing, its letters may be omitted. Where the sections are symmetrical or drawn in correct projection, the arrowheads may be omitted. Each section is titled below the view, for example "SECTION A-A", using the same letters as the cutting plane.

## Hatching

Hatching marks the surfaces the cutting plane passes through. Clause 7.3 sets the rules for mechanical drawings:

```figure
type: checklist
title: Hatching rules from AS 1100.101 clause 7.3
caption: Summarised from AS 1100.101-1992. Material-specific hatching for architectural and structural drawings is in AS 1100.301 and AS 1100.501, not in mechanical practice.
- x Equally spaced narrow continuous lines at about 45° to the sheet edges | another angle if 45° would run parallel to an outline
- x Spacing suited to the area; wide spacing preferred where clarity allows
- x Every cut area of the same part hatched at the same angle and spacing
- x Adjacent parts hatched at different angles, normally at right angles to each other
- x More than two adjacent parts distinguished by spacing or by other angles
- x Thin cut areas, such as gaskets and sheet metal, filled solid, with at least 1 mm between adjacent solid areas
- x Hatching interrupted around dimensions and lettering, and continuous across offset or curved cutting planes
```

Two rules do most of the work. Same part, same hatching: a reader sees one hatching pattern and knows it is one piece of material, however many separate regions the section cuts. Adjacent parts, different hatching: a change of angle at a boundary tells the reader the material changes there. When the hatching breaks either rule, the reader draws the wrong conclusion about what is one part and what is two.

## Parts that are not hatched

Some elements are shown in full outline even when the cutting plane passes through them. AS 1100.101 clause 7.4.9 lists two groups.

**Fastening and solid elements.** Where the cutting plane runs along the centre line of bolts, pins, rivets, keys, washers, nuts and screws, or of shafts, rods and ball and roller bearings, these are not sectioned but drawn in full outline. Cutting a bolt lengthwise adds hatching and tells the reader nothing new; showing it whole makes it instantly recognisable. The same logic applies to bearings: their rolling elements and rings are bought complete, so the assembly drawing needs to show where they sit, not what is inside them.

**Relatively thin elements.** Where the cutting plane passes along a web, rib, lug or spoke, its outline may be drawn without hatching to avoid a false impression of solidity. Alternatively, the hatching across the thin element may be double-spaced, with the boundary between thin and thick shown as a hidden outline. Where a section does not cut a spoke or rib that lies at an angle, the oblique spoke should be drawn as though it were on the cutting plane.

Clause 7.4.9.3 adds a related convention: holes in circular parts may be shown in a section even if they are not on the cutting plane, at their true radius from the centre instead of their foreshortened position. This lets a single section show a hole pattern's depth and diameter without an extra view. The end view still shows the true angular positions of the holes.

## Kinds of section

```figure
type: compare
title: Kinds of section and when to use them
cols: What it shows | Typical use
caption: Based on AS 1100.101 Section 7 and common practice. The running case uses a full section for the housing and a full section with unhatched elements for the assembly.
- *Full section | the whole part cut by one plane | turned parts, housings, castings with internal features
- Half section | one half in section, the other in outside view | symmetrical parts where the outside also matters
- Part (broken-out) section | a local area cut away, bounded by a freehand or zigzag line | one internal feature in an otherwise external view
- Revolved section | the cross-section turned into the view, outlined in narrow lines | the shape of an arm, rib or bar
- Removed section | the cross-section drawn away from the view and labelled | long parts with changing cross-sections
- Offset or aligned section | a cutting plane that steps or turns to pass through several features | holes and features not on one plane
```

Removed sections are useful when space is short. AS 1100.101 allows successive sections along a part to be drawn as removed sections if they cannot be arranged in normal projection. Each must still be labelled with its cutting plane letters.

## The running case: section A-A of the housing

This is an illustration. Chapter 4 replaced the housing's side view with a full section A-A through the axis. The designer placed the cutting plane on the front view of the flange end, passing vertically through the centre.

That plane cuts the flange through the top and bottom flange holes, which are at 12 and 6 o'clock. It does not pass through the rear tapped holes, which are at 45°. Rather than add an offset cutting plane, the designer used the convention in clause 7.4.9.3: one tapped hole is shown in the section at its true pitch radius of 39 mm (half of the 78 mm pitch circle), rotated into the plane. The section then shows, in visible lines:

- the bore and its shoulder;
- the spigot and its face;
- a flange hole through the 12 mm flange;
- a tapped hole with its thread length and drilled depth.

Because the section is symmetrical about the axis and drawn in correct projection, the arrowheads could have been omitted. The designer kept them, with the letters A at each end, because the drawing also carries an enlarged detail and a partial view, and explicit labelling avoided any doubt about which view was which.

## The assembly section

On the bearing cartridge's assembly drawing, a full section through the axis cuts the housing, the end cap, the bearing, the shaft, the lip seal and two cap screws. Following clause 7.4.9.1, the shaft, the bearing and the screws are drawn in full outline, not hatched. The housing is hatched at 45° one way and the end cap at 45° the other way, so their boundary is obvious. The paper gasket between them, too thin to hatch at full size, is filled solid. The lip seal is drawn in a simplified way, as Chapter 9 describes.

```figure
type: stats
title: What is hatched in the cartridge assembly section
caption: This is an illustration, following AS 1100.101 clauses 7.3 and 7.4.9.
- *Housing | hatched at 45° | one pattern for every cut area of the part
- End cap | hatched at 45° the other way | at right angles to the housing
- Gasket | filled solid | too thin to hatch; at least 1 mm gap to any other solid area
- Shaft, bearing, cap screws | full outline, not hatched | solid elements on the cutting plane
```

## The error: one part that looked like two

The first issue of the housing drawing had a section in which the material above the bore and the material below it were hatched at opposite angles. The CAD system had created two separate hatch regions, one on each side of the bore, and the drafter had accepted its default of alternating the angle for adjacent regions.

The machine shop's estimator read the section the way the standard intends it to be read: two hatching angles meeting at the bore meant two parts. He concluded that the bore was a separate liner pressed into the housing, and he quoted for making a liner and pressing it in. The quote was almost double the expected price. The buyer asked why, and the estimator pointed to the hatching.

The correction was to hatch both regions as one pattern at one angle and spacing, as clause 7.3.1 requires for every cut area of the same part. The business also changed its CAD template so that hatch regions created in one operation share a pattern, and added "same part, same hatching" to the drawing checklist. The error was harmless in the end, because a careful estimator asked before quoting. A less careful one might have quoted the simple part and been surprised at delivery, or made the liner.

The episode shows something about how drawings are read. Readers trust conventions more than they trust their own sense of what is likely. The estimator knew that bearing housings are usually solid castings, but the hatching told him otherwise, and the hatching won. That is the right instinct, because conventions exist precisely so that readers do not have to guess. It also means that a convention used carelessly is more dangerous than no convention at all: it carries authority it has not earned. The safest drawings are the ones whose conventions are applied as consistently as their dimensions.

## Common faults in sections

A review of sectioned views usually finds the same handful of faults. Checking for them takes a few minutes and saves queries later.

1. **Missing edges beyond the plane.** AS 1100.101 defines a section as the view at the cutting plane, typically including detail beyond it. A section that shows only the cut surface, without the visible edges behind it, such as the far side of a bore shoulder or the outline of a flange seen beyond the cut, leaves the reader to guess the depth of features.
2. **Hidden lines left in a section.** The point of a section is to remove hidden lines. Hidden lines behind the cutting plane are normally omitted unless they are needed to define a feature that is shown nowhere else.
3. **Hatching parallel to an outline.** A 45° pattern that runs parallel to a chamfered or sloping edge makes the edge hard to see. The standard allows another angle in that case.
4. **Letters that do not match.** A cutting plane marked B-B on the end view and a section titled A-A, or a letter used both for a section and for a detail, breaks the rule that each letter is used once and makes the reader hunt.
5. **A section out of projection without a label.** A section moved elsewhere on the sheet for space must be titled and its cutting plane shown with arrows, or the reader cannot tell which way it looks.
6. **Fasteners and shafts hatched in assemblies.** Hatching a bolt lengthwise does not make it clearer; it makes it look like a turned spacer.

## Choosing the cutting plane for the people downstream

The cutting plane is usually chosen to show the most features. It is worth also asking who will use the section. An inspector will measure features shown in the section, so a section through the features they must check, at the positions where they will check them, helps them plan. A machinist will set up the part to machine the bore and shoulder in one operation, so a section that shows the shoulder, bore and spigot together reflects the relationships they must hold.

In the running case, the vertical plane through the axis serves both: it shows the bore, shoulder and spigot as one connected profile, which is exactly the set of features that must be concentric and is machined in one set-up. Chapter 7 relies on this when it applies a runout tolerance across those features.

## Sections and dimensions

Sections are usually the best place for dimensions of internal features, because those features appear there as visible edges. The housing's bore diameter, shoulder diameter, bore depth, spigot length and tapped hole depth are all dimensioned on section A-A. The pitch circle diameters and the angular positions of the holes are dimensioned on the end views, where the circles are true shape. Chapter 6 covers how those dimensions are laid out.

One caution: hatching must be interrupted around dimension text and lettering placed within a hatched area, so that the numbers are not obscured. On a dense section, it is usually better to move the dimension outside the hatched area altogether. Where that is not possible, a short leader from a clear space to the feature is better than a number sitting on top of hatching that a reduced print will turn grey.

## Exercise: a section through a pulley

A cast iron V-belt pulley has a hub, a rim and four spokes at 90° intervals, with one spoke at 45° to the vertical. A full section is to be drawn on a vertical cutting plane through the axis. How should the spokes and the hub keyway be shown?

**Worked answer.** The vertical cutting plane does not pass through any spoke, because they are at 45°, 135°, 225° and 315°. Following AS 1100.101 clause 7.4.9.2, the oblique spokes should be drawn as though they were on the cutting plane, so that the section shows the spoke connecting hub and rim. The spoke is a relatively thin element cut lengthwise, so it is drawn in outline without hatching, or with double-spaced hatching and a hidden outline at its boundary with the hub and rim. Leaving it unhatched avoids the false impression that the pulley is a solid disc.

The hub and rim are hatched as one part, at one angle and spacing, since they are one casting. The keyway in the hub is shown in the section where the cutting plane passes through it; if it is not on the plane, it can be shown in a partial end view of the hub. A shaft and key, if shown in an assembly section, would be drawn in full outline, unhatched.
