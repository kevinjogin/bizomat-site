---
title: "Deriving CAD elevations from a plan"
description: "Construct coordinated elevations from a plan using projection lines, explicit heights and shared references, then check changes across the complete drawing."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - systems
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A plan locates features across an object or space, but it does not fully describe their heights. An elevation adds that information. When each view is drawn independently, however, an opening can occupy one position in the plan and another in the elevation, with both drawings looking individually plausible.

Donnie Gladfelter's *AutoCAD 2011 and AutoCAD LT 2011: No Experience Required* develops elevations by projecting positions from a plan and intersecting them with defined height lines. For someone using computer-aided design, or **CAD**, this is a practical coordination method: carry across information that is already established, identify the information still needed, and check the relationships before presenting the finished views.

## Understand what each view contributes

A **plan** shows an object or space from above, using the conventions appropriate to the drawing's purpose. An **elevation** shows a face from a specified viewing direction. In a simple front elevation, horizontal positions come from the corresponding plan direction, while vertical positions come from separate height information.

**Orthographic projection** represents views using parallel projection perpendicular to the view plane. For faces aligned with the view, corresponding positions can be transferred without perspective effects. A useful way to work is to identify the dimensions shared between views and the dimensions that each view must introduce.

A plan's opening width can help establish the opening's width in an aligned elevation. Its sill height and head height still need another source. They might come from an agreed design dimension or a measured condition, but they cannot be inferred simply because the plan contains two lines for the opening.

Decide which views are needed before constructing them. This article concerns coordinating the geometry within those views; [Choosing clear views for technical drawings](/reados/collections/cad-drafting-and-drawing-standards/choosing-clear-views-for-technical-drawings/) addresses the broader choice of orthographic, sectional and pictorial views.

## Establish direction and references first

Write down the viewing direction in terms that another person can interpret. A face name, orientation arrow or clearly identified front can prevent left-right confusion. Avoid relying solely on where the drafter happens to place a view on the screen during construction.

A **datum** is an agreed reference from which positions or levels are measured. Choose a horizontal reference for feature positions and a vertical datum for heights. The two references should be identifiable in the working geometry and consistent across the views that use them.

Record the unit convention before drawing. If the model uses millimetres, keep the related plan and elevation geometry at that same real-world scale. The distance between views in the working drawing is an arrangement choice, not an extra physical dimension of the object.

Separate confirmed dimensions from assumptions. An unresolved height should remain an explicit decision to obtain, rather than becoming a line placed by eye. A neat elevation can otherwise make an incomplete design appear more settled than the available information supports.

## Organise working geometry for selective review

Create a clear distinction between plan geometry, elevation geometry and temporary construction aids. Layers are useful for this because they let you show, hide and inspect categories of objects without reconstructing the selection each time. Use names that describe the role of the information.

Do not hide the source plan so thoroughly that its relationship to the elevation becomes difficult to check. During construction, retain enough context to identify which edge or opening generated each projection. Remove visual clutter selectively, especially where annotation or hatching obscures the geometry being used.

A **construction line** is an infinite straight reference line used to establish alignment. A **ray** begins at one point and extends indefinitely in one direction. These differ from an ordinary line segment, which has two endpoints, and they can remain visible well beyond the intended elevation area.

Decide whether construction lines will be retained on a non-plotting layer for later coordination or removed once the work is checked. Either approach needs a final review. A line excluded from plotting can still interfere with selection, while a deleted reference may need to be recreated when the design changes.

## Build a deliberate set of height lines

Start with the vertical datum and list the heights required to describe the visible face. For a simple enclosure, these might include the base, top edge, opening sill and opening head. For more complex work, additional levels may be needed for projecting parts or changes in profile.

Create horizontal reference lines at the stated heights. Offsetting from a known datum makes the relationship explicit. Chaining offsets can also work, but the drafter must distinguish a height above the datum from a distance above the previous line.

Label the working references where similar levels could be confused. A top surface, underside and overall height may be close together while meaning different things. Giving each an identifiable purpose is more reliable than trusting their order on screen.

Check the height set before adding detail. Confirm that opening heights equal the intended differences between head and sill levels. Where a sloping outline connects known points, verify those points and the intended relationship; a visually plausible slope is not a substitute for defined geometry.

## Project only the positions you need

Identify the plan features that locate the visible elevation geometry. Typical candidates include outside corners, opening edges and the ends of projecting elements. Project from actual source points using appropriate object snaps, rather than placing reference lines approximately near them.

An **object snap** locates a defined feature of existing geometry, such as an endpoint or intersection. Use the snap that matches the intended reference. If several lines overlap, inspect the selected object so an interior face or centreline is not mistaken for the required outside edge.

For a view arranged directly below an aligned plan, vertical projection lines can carry horizontal positions into the elevation workspace. Intersections with the height lines then locate corners. This separates two questions: where the feature sits across the face, and how high its edges should be.

Project the primary outline and openings first. Add smaller features once those relationships have been checked. Drawing every possible projection at once creates a dense grid in which choosing the wrong intersection becomes easier and tracing the source of a line becomes harder.

## Convert the reference grid into visible geometry

Once the key intersections are established, create or retain the segments that represent the visible outline. Trim unwanted extensions deliberately, checking the selected cutting boundaries and the side being removed. Command behaviour varies with settings and release, so read the prompts instead of relying on a remembered click sequence.

Work in small groups. Finish the main outline, then one opening, then the next feature. After each group, inspect the result with unnecessary construction aids temporarily hidden. This makes a missing edge or an unwanted continuation easier to identify.

Trimming an infinite construction line can change the resulting object into a ray or a finite segment. Inspect the object type where that distinction matters. A reference that appears to end at the edge of the visible screen may still extend far beyond it.

Keep geometry assigned to its intended layer as it changes role. A line used first for projection might become part of the visible elevation, but it should then carry the appropriate properties. Otherwise, the finished outline can disappear when construction aids are hidden or excluded from output.

## Distinguish visibility from coincidence

Two features can share the same projected position while lying at different depths. Projection establishes alignment; it does not decide which feature is visible from the selected direction. Review the physical arrangement described by the plan before keeping every projected edge as a visible line.

A projecting element may conceal part of the face behind it. An opening on the far side may not appear as an ordinary visible opening in the near-side elevation. Use the drawing conventions appropriate to the information being communicated, and add another view where the depth relationship remains unclear.

Check for coincident duplicates. Copying and trimming can leave two lines occupying the same location, so removing one may seem to have no effect. Selection tools can help identify the objects involved, but the decision about which one belongs still depends on its role in the drawing.

An **interior elevation** looks towards an internal face. A **section** represents a view associated with a cut through the object or space. They may share construction techniques, but they communicate different information. Label them according to what they actually show rather than using the terms interchangeably.

## Reuse common geometry without assuming symmetry

Opposite elevations often share overall heights and some outline geometry. Copying or mirroring a checked view can provide a useful starting point. It does not establish that the opposite face has the same openings, attachments or visible edges.

Before reusing a view, identify which features are genuinely common and which are specific to the original face. Remove or revise face-specific content deliberately. Then project the required positions from the plan for the new viewing direction.

Left and right reverse when the viewer moves to the opposite side. Check an identifiable asymmetric feature to establish orientation, rather than relying only on the symmetrical outside rectangle. A clearly located opening is a better orientation test than a centred ridge or a plain outline.

Treat a reused elevation as unfinished until this review is complete. Its apparent completeness makes it easy to overlook copied detail. The useful saving is reuse of verified common information, while the different face still receives its own geometry and visibility checks.

## Transfer heights and manage the working view

Adjacent elevations share vertical information even though they use different plan directions for horizontal positions. Transfer the checked height references into the new construction area. A common datum prevents the same component from acquiring slightly different heights in separate views.

The book uses copied and rotated reference geometry to help transfer levels. Keep those construction copies distinguishable from the final views. After the transfer, check the new geometry against the original stated levels rather than treating successful copying as sufficient evidence.

A **user coordinate system**, or **UCS**, defines the current coordinate origin and axes for working in the drawing. A **world coordinate system**, or **WCS**, provides the fixed global reference. Changing the working coordinate system and viewing orientation is different from physically rotating the model geometry.

Use named working views or coordinate systems when they help you return to a face consistently. Before continuing another task, confirm the current axes and view. [Positioning features on angled CAD working planes](/reados/collections/cad-modelling-and-design-intent/positioning-features-on-angled-cad-working-planes/) explains this distinction in a broader modelling context.

## Work through a coordinated elevation

This is an illustration. A small Australian product business is preparing a concept drawing of a rectangular display enclosure. The plan is 4,000 mm wide and 2,500 mm deep. The agreed overall height is 2,400 mm, measured from a base datum of zero.

The front face has one rectangular opening. Looking directly at that face, its left edge is 600 mm from the enclosure's left edge and its width is 1,200 mm. Its sill is 800 mm above the base, and its head is 2,000 mm above the base. These are hypothetical drafting dimensions, not a specification for a buildable product.

| Feature | Horizontal position from the left | Height above the base |
| --- | --- | --- |
| Left outside corner | 0 mm | 0 to 2,400 mm |
| Opening left edge | 600 mm | 800 to 2,000 mm |
| Opening right edge | 1,800 mm | 800 to 2,000 mm |
| Right outside corner | 4,000 mm | 0 to 2,400 mm |

The drafter projects the four horizontal positions from the plan and creates height references at 0, 800, 2,000 and 2,400 mm. Their intersections establish the outer face and opening. The opening is 1,200 mm wide because 1,800 minus 600 equals 1,200, and it is 1,200 mm high because 2,000 minus 800 equals 1,200.

The right-hand margin is 2,200 mm, calculated as 4,000 minus 1,800. The remaining height above the opening is 400 mm, calculated as 2,400 minus 2,000. These checks provide simple relationships that can be compared with measured drawing geometry.

```figure
type: svg
title: A front elevation from projected positions
alt: A front elevation 4,000 millimetres wide and 2,400 high. Vertical projection lines at 0, 600, 1,800 and 4,000 millimetres meet height lines at 0, 800, 2,000 and 2,400 millimetres. Their intersections define the outer face and a 1,200 by 1,200 millimetre opening, leaving a 2,200 millimetre right margin and 400 millimetres above the opening.
caption: Positions come from the plan, heights from the agreed references; their intersections define the face.
viewbox: 0 0 640 280
body:
<path class="lf dsh" d="M40 20V260M130 20V260M310 20V260M640 20V260"/>
<path class="lf dsh" d="M20 240H640M20 180H640M20 60H640M20 24H640"/>
<rect class="bxi" x="40" y="24" width="580" height="216" rx="1"/>
<rect class="bxa" x="130" y="60" width="180" height="120" rx="1"/>
<text class="txb" x="220" y="126" text-anchor="middle">1,200 × 1,200</text>
<text class="tx txs" x="460" y="126" text-anchor="middle">right margin 2,200</text>
<text class="tx txs" x="220" y="48" text-anchor="middle">400 above</text>
<text class="tx txs" x="130" y="274" text-anchor="middle">600</text>
<text class="tx txs" x="310" y="274" text-anchor="middle">1,800</text>
<text class="tx txs" x="620" y="274" text-anchor="end">4,000</text>
<text class="tx txs" x="34" y="184" text-anchor="end">800</text>
<text class="tx txs" x="34" y="64" text-anchor="end">2,000</text>
```

The design then moves the opening 200 mm to the right without changing its size or height. Its horizontal edges become 800 and 2,000 mm, and the right-hand margin becomes 2,000 mm. The sill and head stay at 800 and 2,000 mm respectively because this change affects position across the face, not vertical position.

The reviewer checks that the plan and front elevation both show the changed edges. If a copied rear elevation still contains the original opening, they first establish whether the rear face actually has an opening at all. Mirroring the front would not answer that design question.

For a side elevation, the overall horizontal extent comes from the 2,500 mm plan depth, while the vertical extent remains 2,400 mm. Using the front's 4,000 mm width would produce a plausible rectangle with the wrong meaning. The shared height and changed horizontal direction must both be checked.

```figure
type: balance
title: Front and side elevations take different widths
left: Front elevation
right: Side elevation
caption: Using the front's width for the side gives a plausible rectangle with the wrong size.
- 4,000 mm wide, from the plan width | 2,500 mm wide, from the plan depth
- 2,400 mm high | 2,400 mm high
```

## Review revisions across the drawing

Manually constructed two-dimensional views are separate drawing objects. Projection during initial drafting does not automatically create an ongoing relationship that moves every related edge after a later edit. Treat a design change as a reason to inspect each affected view.

Trace the changed feature through the plan, relevant elevations, dimensions and notes. Check both what should change and what should remain stable. Moving an opening horizontally should not alter its height, while increasing overall height may affect several adjacent elevations and their annotations.

Keep a short review note describing the changed feature and the views checked. This is particularly useful when one person makes the edit and another prepares the sheet. The note should identify the geometry involved, not merely state that the drawing has been updated.

Finish by reviewing the plotted arrangement. Confirm viewing labels, legibility and the absence of stray construction geometry. Keep the model geometry at its intended size and control its presentation through the sheet setup; shrinking a view's geometry to make it fit creates a different coordination problem.

## Questions to ask

- Is the viewing direction clear, including the meaning of left and right?
- Which positions come from the plan, and where do the heights come from?
- Are all views using the same agreed datum and unit convention?
- Have copied features been checked against the actual face being shown?
- Has the latest change been checked across every affected view and the output sheet?

## Bringing it together

Coordinated elevations come from clear references and deliberate transfer of information. Project established plan positions, combine them with verified heights, and review visibility from the stated direction. Continue those checks through revisions so the related views remain a consistent description of the design.

---

*Source: Donnie Gladfelter, AutoCAD 2011 and AutoCAD LT 2011: No Experience Required (2010), principally Chapter 10. Dimensions are illustrations, not construction specifications. This article explains drawing coordination and does not establish engineering suitability or regulatory compliance.*
