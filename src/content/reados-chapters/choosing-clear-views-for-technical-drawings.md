---
title: "Choosing clear views for technical drawings"
description: "Choose orthographic, sectional and isometric views that explain a component clearly, with consistent projection conventions and checks between related views."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - manufacturing
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

A technical drawing can contain accurate lines and still leave the reader uncertain about the object. One view may hide an opening, another may leave its depth unclear, and a pictorial view may suggest a shape without locating it precisely. The useful question is which combination of views communicates the required information with the least ambiguity.

Alf Yarwood's *Introduction to AutoCAD 2011: 2D and 3D Design* explains orthographic and isometric drawing through related views of the same object. These principles extend beyond a particular software interface. For anyone using computer-aided design, or **CAD**, the task is to organise a coherent explanation of shape, rather than simply fill a sheet with pictures.

## Give each view a clear job

A **view** is a representation of an object from a chosen direction or under a defined cutting arrangement. Different views reveal different information. A front view may explain the main outline, while a top view locates features that overlap when seen from the front.

Start by listing the features a reader must understand. Include overall shape, significant openings, changes in thickness and relationships between features. Then identify the view that communicates each feature most clearly. This makes view selection a response to information needs rather than a fixed habit.

Do not assume every object requires the same number of views. A simple part may be described with a small set, while a complex internal feature may require a section or detail. More views are useful only when they remove uncertainty or support necessary dimensions.

Keep the intended use in mind. A concept review, a component drawing and an assembly explanation need different levels of information. A view set that makes a proposal understandable does not automatically provide all the details required for manufacturing or inspection.

## Understand orthographic projection

**Orthographic projection** represents an object through views taken perpendicular to selected viewing planes. Familiar examples include front, top and side views. Together, these can describe dimensions and relationships that a single perspective image cannot communicate clearly.

For a simple rectangular component, the front view shows width and height, the top view shows width and depth, and a side view shows depth and height. The shared dimensions provide a way to check consistency. A feature's height should not change merely because it appears in a different view.

The projected outline is not necessarily the object's full three-dimensional boundary. A circle viewed straight on appears circular, while the side view of a cylindrical feature may be represented by parallel edges. Read each view as a projection of the same object rather than as an unrelated shape.

When choosing a front view, favour a direction that explains important geometry and supports clear dimensions. The front of a drawing is a communication choice, not always the face someone would casually call the front of the product. State view labels where orientation might otherwise be uncertain.

## Keep the projection convention explicit

**First-angle projection** and **third-angle projection** use different arrangements of related views on the sheet. The object is viewed from the same relevant directions, but the position of each resulting view relative to the front view differs. Mixing the conventions makes a drawing difficult to interpret.

In third-angle projection, a top view is normally placed above the front view, and a right-side view to its right. In first-angle projection, the top view is normally placed below the front view, and the right-side view to its left. Use the convention required by the project and identify it through the applicable drawing practice.

| Related view | First-angle arrangement | Third-angle arrangement |
| --- | --- | --- |
| Top view | Below the front view | Above the front view |
| Right-side view | Left of the front view | Right of the front view |

```figure
type: svg
title: First-angle and third-angle layouts
alt: Two arrangements of the same three views. In first-angle projection the top view sits below the front view and the right-side view sits to the left. In third-angle projection the top view sits above the front view and the right-side view sits to the right.
caption: State the projection convention on the drawing; the same views swap positions.
viewbox: 0 0 640 260
body:
<text class="txb" x="150" y="20" text-anchor="middle">First angle</text>
<rect class="bxa" x="120" y="40" width="80" height="60" rx="2"/>
<text class="tx txs" x="160" y="74" text-anchor="middle">Front</text>
<rect class="bx" x="120" y="120" width="80" height="60" rx="2"/>
<text class="tx txs" x="160" y="154" text-anchor="middle">Top</text>
<rect class="bx" x="20" y="40" width="80" height="60" rx="2"/>
<text class="tx txs" x="60" y="74" text-anchor="middle">Right side</text>
<text class="txb" x="480" y="20" text-anchor="middle">Third angle</text>
<rect class="bxa" x="420" y="120" width="80" height="60" rx="2"/>
<text class="tx txs" x="460" y="154" text-anchor="middle">Front</text>
<rect class="bx" x="420" y="40" width="80" height="60" rx="2"/>
<text class="tx txs" x="460" y="74" text-anchor="middle">Top</text>
<rect class="bx" x="520" y="120" width="80" height="60" rx="2"/>
<text class="tx txs" x="560" y="154" text-anchor="middle">Right side</text>
<path class="lf" d="M320 30V240"/>
```

Do not infer the required convention from the country of the drafter alone. Drawings move between organisations and software environments. Confirm the project requirement and review any inherited drawing before adding views that might follow a different convention.

Autodesk's [projection-angle documentation](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Core/files/GUID-96BD966E-F983-40ED-BD88-D3202F32AD47.htm) also notes that changing its model-documentation default affects newly created views rather than existing ones. A changed setting is therefore not evidence that an entire existing sheet has been converted consistently.

## Align corresponding information

Related views should make it easy to trace a feature between directions. The centre of a hole in the front view should correspond to the same feature in the top and side views. Alignment reduces the amount of interpretation the reader must perform.

When drafting separate two-dimensional views, use construction references to transfer positions deliberately. Do not redraw each view by eye. A small discrepancy can survive because each view looks reasonable when inspected alone.

If the views are generated from a model, inspect their relationship to that model and their update status. Generated views reduce some repeated drafting work, but they still depend on the intended source geometry and settings. They also need a final review after the source changes.

Keep sufficient space between views for dimensions and labels. Tight packing can force extension lines across unrelated geometry or make it unclear which view a note addresses. Arrange the sheet around readable information, then check the result at its intended output size.

## Distinguish visible, hidden and centre information

**Visible edges** represent boundaries seen from the selected direction. **Hidden-detail lines** communicate relevant boundaries obscured by material. **Centre lines** identify axes or centres associated with features such as holes, arcs and cylindrical components.

These categories should remain distinguishable using the project's line conventions. A hidden line drawn like a visible edge may suggest a step or groove on the surface. A centre line should not be mistaken for a physical feature that must be made.

Use hidden detail selectively enough to preserve readability while meeting the drawing's requirements. If a dense collection of hidden lines makes an internal arrangement difficult to understand, consider whether a section would communicate it more directly.

Check the categories after revisions. Removing material can turn a previously hidden boundary into a visible one. A new opening can also change which edges are seen from another direction. Updating the geometry without reviewing its representation can leave the drawing internally inconsistent.

## Use sections to reveal internal geometry

A **sectional view** shows the object as if cut by an identified plane. It can reveal wall thickness, internal openings and changes in cross-section that are difficult to explain with hidden lines alone. The cutting arrangement must be clear enough for the reader to relate the section to the other views.

A **cutting-plane indication** identifies where the imagined cut passes and how the resulting view is to be read. A matching section label connects that indication to the section itself. A section without a clear reference may show useful geometry while leaving its location uncertain.

Hatching distinguishes cut material according to the applicable convention. It should support the explanation of the section rather than fill every enclosed region indiscriminately. An opening contains no material at the cutting plane and should not accidentally be presented as solid because its boundary was included in a hatch selection.

Do not invent section conventions for a specialist drawing. Fasteners, ribs and other features may require particular treatment under the governing practice. Use the appropriate drafting standard and technical review where those details matter; the software's hatch command does not decide the convention.

## Separate a drawing section from a physical cut

A sectional drawing is an explanatory representation. It does not necessarily instruct anyone to cut the actual component at that location. Keep the section label and view arrangement clear so the reader understands its role.

The same distinction matters when deriving a view from a three-dimensional model. Some operations merely display a section, while others alter or divide model geometry. Preserve the working model when producing an explanatory cut and identify any derived copy used for illustration.

After generating or drafting a section, verify important thicknesses and openings against the underlying design. A visually tidy hatch can conceal a wrongly positioned cut. Inspect the location of the cutting plane as well as the appearance of the resulting view.

Use a detail view if only one small area needs enlargement. Enlarging a local feature can preserve a readable overall arrangement without requiring the entire drawing to occupy more space. Label its relationship and scale clearly under the project's convention.

## Use isometric drawing as an aid to understanding

An **isometric drawing** is a pictorial representation using three principal directions arranged to suggest three-dimensional form. Yarwood distinguishes a two-dimensional isometric drawing from a three-dimensional solid model. A collection of lines that looks like a solid does not thereby contain a volume.

A pictorial view can help an unfamiliar reader understand how the orthographic views relate. It is particularly useful when a feature is difficult to imagine from separate outlines. Its purpose can be orientation and explanation rather than the placement of every controlling dimension.

Keep the isometric representation consistent with the other views. If a hole is moved, revise both the dimensioned views and the explanatory picture. An outdated pictorial view can reintroduce the ambiguity that the formal views were intended to remove.

Do not treat a two-dimensional pictorial drawing as a substitute for model-based checks. It cannot support volume or interference calculations merely because it appears three-dimensional. Choose the representation according to the intended task and state any limits on its use.

## Represent circles on the correct isometric plane

In a two-dimensional isometric drawing, a circular feature on one of the principal faces is represented by an ellipse. The ellipse's orientation depends on the face being represented. A circle copied unchanged into that view will usually communicate the wrong appearance.

The source describes isometric drawing planes and an isocircle option for constructing these representations. The durable lesson is to establish which face contains the feature before drawing its projected outline. Use the corresponding tools in the software version being used.

An isometric grid is a drawing aid, not evidence that every point has been placed accurately. Confirm the dimensions and relationships defining the feature. Snapping to a convenient grid point may still be wrong if the intended centre lies elsewhere.

Keep the represented diameter distinct from the apparent major or minor axis of the ellipse. The physical circular feature is defined by the design information, while the ellipse describes its appearance in the pictorial view. A reader should not have to measure the picture to infer the intended hole size.

## Work through a small view-selection example

This is an illustration. A rectangular spacer is 100 mm wide, 60 mm deep and 20 mm high. It contains one vertical through-hole of diameter 12 mm. In plan, the hole centre is 30 mm from the left edge and 20 mm from the front edge.

The top view shows the 100 by 60 mm outline and the circular hole. The front view shows a 100 by 20 mm outline, and the side view a 60 by 20 mm outline. These three outlines give a simple consistency check on the overall dimensions shared between views.

The hole centre is 70 mm from the right edge because 100 minus 30 equals 70. It is 40 mm from the back edge because 60 minus 20 equals 40. These are checking relationships, not a recommendation to add redundant controlling dimensions to the drawing.

```figure
type: compare
title: Three views of a 100 × 60 × 20 mm spacer
cols: Outline | Shows
caption: The outlines give a consistency check on overall size; the hole is Ø12 mm, 30 mm from the left and 20 mm from the front.
- *Top view | 100 × 60 mm | The outline and the circular hole
- Front view | 100 × 20 mm | Hole position 30 mm from the left
- Side view | 60 × 20 mm | Hole position 20 mm from the front
```

In a front view, the hole centre projects to the horizontal position 30 mm from the left edge. In a side view, its position must correspond to the stated 20 mm offset from the front, interpreted according to the selected viewing direction and projection convention. This is where a plausible-looking mirrored arrangement could otherwise escape notice.

A section through the hole axis can show that the opening passes through the full 20 mm thickness. If a blind hole were intended instead, its depth and remaining material would need to be defined. A top view containing the same circle would not distinguish those two designs on its own.

The drafter selects third-angle projection for this illustrative review and identifies that choice. A small isometric view helps explain the shape, but the dimensions and section carry the required geometric meaning. The example establishes a method of communication, not a complete manufacturing specification.

## Review changes across the whole view set

Treat related views as one description of the object. When a feature changes, list the views, dimensions, sections and notes that could be affected. This is more dependable than editing only the place where the change was first noticed.

Use a reference-based review. Check overall dimensions, then feature positions, then visibility and annotation. A change to a hole's location may affect a section's usefulness even if the section line still exists in the drawing.

Distinguish intentional simplification from an error. An explanatory isometric may omit fine detail, but that omission should not conflict with a controlling view. If a simplified picture creates a different impression of the object's operation, revise it or explain its limited purpose.

For dimensional review, [Keeping CAD dimensions connected to the design](/reados/collections/cad-drafting-and-drawing-standards/keeping-cad-dimensions-connected-to-the-design/) provides a complementary method. The combined task is to ensure that the values, references and view arrangement all describe the same intended geometry.

## Use a small review routine

A small Australian business can make this practical by reviewing one question at a time. First ask whether a reader can identify the object's overall shape. Then check whether each important feature can be located and understood without guessing.

Ask someone unfamiliar with the drawing to trace a feature across the views. Confusion about the viewing direction, a section label or the identity of a hole is useful evidence. It points to a communication problem that more linework alone may not resolve.

Finish by reviewing a plotted or exported sheet at its normal reading size. Confirm that line categories remain distinct, section labels are legible and the view arrangement survives the final presentation. Screen magnification can hide practical reading problems.

## Questions to ask

- What information does each view add?
- Is the projection convention clear and consistent?
- Do feature positions agree between related views?
- Would a section explain hidden geometry more clearly?
- Does the pictorial view match the dimensioned information?
- Can the intended reader understand the sheet at its output size?

## Bringing it together

Clear technical drawings use related views to explain one coherent object. Choose the directions and sections that reveal important geometry, apply a consistent projection convention and check the relationships between views.

Use pictorial views to support understanding while keeping dimensions and technical requirements explicit. The result should let the reader follow the design without reconstructing missing information from visual impressions.

---
*Source: Alf Yarwood, Introduction to AutoCAD 2011: 2D and 3D Design (2010), primarily chapter 7; Autodesk documentation linked above. Dimensions are original illustrations. Follow the applicable project drafting conventions; this article is not a manufacturing specification.*
