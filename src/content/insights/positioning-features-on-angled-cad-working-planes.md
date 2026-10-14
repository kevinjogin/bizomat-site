---
title: "Positioning features on angled CAD working planes"
description: "Place holes and profiles on angled faces by separating viewing direction from working coordinates, then checking origins, axes and extrusion direction."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - prototyping
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A circle can appear correctly positioned on an angled face while actually lying on a different plane. In a three-dimensional view, depth is compressed onto the screen, so visual alignment can conceal a misplaced profile. The problem becomes more serious when that profile is extruded or used to remove material.

Alf Yarwood's *Introduction to AutoCAD 2011: 2D and 3D Design* uses coordinate-system changes to construct features on different faces. The useful principle is to make the local reference explicit before drawing. In computer-aided design, or **CAD**, reliable placement depends on knowing the working origin, axis directions and intended relationship to the existing model.

## Keep the model, view and coordinate system separate

A **model** contains the geometry. A **view** determines the direction from which that geometry is displayed. A **coordinate system** provides the origin and axes used to describe positions and directions. These three ideas interact, but changing one does not necessarily change the others.

Orbiting the view lets you inspect an angled face. It does not, by itself, guarantee that the next circle will be drawn in that face's plane. Similarly, changing a coordinate system does not mean the physical geometry has been rotated or moved.

This distinction is particularly important when an interface automatically adjusts the view after a coordinate change. The model may appear to turn even though its world-space geometry remains unchanged. Interpret the change through the active coordinates rather than relying on the screen's apparent movement.

Before creating a feature, state the intended operation in model terms. For example, the opening lies on a specified planar face, its centre is measured from a particular corner, and its axis is perpendicular to that face. Those requirements determine the working references.

## Understand world and local coordinates

The **world coordinate system**, or WCS, provides the drawing's underlying reference. A **user coordinate system**, or UCS, establishes a working origin and orientation that can be convenient for a particular construction. A UCS lets a sloping face be treated as a local drawing plane.

Within a local system, X and Y describe positions in the working plane, while Z is perpendicular to it. The same physical point has different coordinate values when measured from different origins or differently oriented axes. A changed coordinate readout does not necessarily mean the point moved.

Use local coordinates to simplify a clear task. A hole located 40 mm along a sloping face and 25 mm across it is easier to define in that face's coordinates than through several global offsets. The local system should express the design references rather than create another layer of ambiguity.

Keep an agreed world reference for the whole model. It remains useful for assembly placement, exchange and overall checks. A local construction convenience should not erase the information another person needs to understand where the completed part belongs.

## Select a meaningful origin

An **origin** is the point assigned coordinates of zero in the chosen system. For an angled face, a useful origin might be an identifiable corner or the intersection of two design references. It should be a point that can be selected and checked accurately.

Choose it according to the dimension scheme. If a feature is located from an edge and a corner, use a system that makes those references easy to express. If the feature must remain centred, a central reference or explicit relationship may be more appropriate.

Avoid selecting a point that only appears to lie on the face. Use precise geometry references and confirm its three-dimensional position. A point at the correct screen location but a different depth can create a parallel working plane displaced from the intended surface.

Record the reason for the origin when the system will be reused. A short description such as lower mounting corner gives more context than an unexplained sequence of coordinate values. This helps another person restore the construction method after a later revision.

## Establish the axis directions deliberately

A plane needs an orientation as well as a location. The positive X direction might follow a selected edge, while the positive Y direction lies across the face. Together, those directions establish which side of the plane is positive Z under the coordinate system's orientation.

In a three-point construction, the first point establishes the origin, a second establishes the positive X direction, and a third establishes the positive-Y side of the XY plane. The points must define a usable plane rather than lie on the same straight line.

Select those points from meaningful references. Swapping their order can reverse directions or establish an unintended plane. Inspect the resulting axis indicator before entering distances, even if all three selected points lie on the correct face.

Where a face-alignment tool is used, review its proposed orientation. The software can identify a face without choosing the origin and axis directions most convenient for your design. Adjust and verify the arrangement rather than treating automatic alignment as a complete placement decision.

## Use view-following as an optional aid

The book's exercises often turn on automatic view-following so that the screen looks squarely at the newly selected working plane. That can make construction easier to see. It should not be confused with a requirement that enables coordinate-system changes themselves.

Autodesk's [UCSFOLLOW reference](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-C07B8F08-8854-4A84-94A6-98C5B9A2522A.htm) states that a value of zero leaves the current view unchanged when the UCS changes, while a value of one generates a plan view of the new UCS in the current viewport. The setting controls the view response.

Choose whichever display arrangement helps the check. Looking squarely at a face can help place a profile, while an angled view can reveal whether it is on the correct surface. Use both at appropriate stages rather than expecting one view to answer every question.

If several viewports are open, confirm the active one and its working state. A remembered screen arrangement is less dependable than checking the current indicators. The view in another window may help inspection without sharing every setting of the window receiving input.

## Confirm the plane before constructing the feature

Begin with a small construction reference or a clearly defined profile. Check that its centre or vertices lie in the intended plane. This catches placement errors before the geometry is extended into a more complex result.

Use local dimensions that correspond to the design. A horizontal screen distance in an angled view is not generally the same as distance along the face. Define the profile using the working coordinates or suitable geometric references instead of measuring its apparent position on screen.

Inspect from an independent view. A profile that looks centred from the local plan view may still be displaced if the origin was chosen incorrectly. A side or angled view can reveal a gap between the profile and the intended surface.

Keep construction geometry distinguishable from the finished model. It may be useful for later checking or revision, but it should not be mistaken for an extra component or a physical marking. Give it an understood role in the drawing's organisation.

## Establish which direction enters the material

A **normal direction** is perpendicular to a plane or surface at the point of interest. For a planar working system, local Z supplies the direction normal to the XY plane. Positive and negative distances lead to opposite sides of that plane.

Before extruding a profile, identify whether the intended direction adds material away from the face or creates a cutting volume into the body. A positive number is not universally synonymous with outward or upward. Its meaning depends on the active references and the operation being used.

Preview or inspect the proposed extent. If the extrusion goes the wrong way, return to the axis definition and command behaviour rather than moving the result by eye until it appears to overlap. Correct the reference decision that caused the error.

Distinguish distance normal to the face from distance measured along a world axis. On an angled surface, a 10 mm normal movement has components in more than one global direction. This matters when a feature's depth is defined perpendicular to the face rather than vertically through the model.

## Work through an angled-plane example

This is an illustration. A planar face uses millimetres and has a chosen origin at world coordinates (100, 50, 20). Moving 50 mm along its local positive X direction moves 40 mm in world X and 30 mm in world Z. Its local positive Y direction is parallel to world positive Y.

The local X direction has length 50 mm because the square root of 40 squared plus 30 squared is 50. It therefore describes a slope in the world XZ plane. The origin, a point at (140, 50, 50) and a point at (100, 70, 20) can establish the intended plane and directions.

A proposed feature centre is 50 mm along local X and 30 mm along local Y from the origin. Its world position is (140, 80, 50): add 40 to world X, 30 to world Y and 30 to world Z. The local description is simpler, while the world position provides an independent placement check.

For this orientation, a 10 mm movement along local positive Z changes world X by minus 6 mm and world Z by plus 8 mm. The perpendicular movement has length 10 mm because the square root of 6 squared plus 8 squared is 10. It has no world Y component.

If the intended cutting direction is local negative Z, a 10 mm movement from the feature centre leads to (146, 80, 42). World X increases by 6 mm and world Z decreases by 8 mm. Simply moving vertically down by 10 mm would reach a different point and would not follow the same normal direction.

| Reference | World X | World Y | World Z |
| --- | ---: | ---: | ---: |
| Local origin | 100 mm | 50 mm | 20 mm |
| Feature centre on the face | 140 mm | 80 mm | 50 mm |
| Point 10 mm along local negative Z | 146 mm | 80 mm | 42 mm |

The example checks coordinate relationships only. It does not establish the face's physical thickness, a suitable hole depth or whether a cutting operation should pass through the component. Those requirements must be supplied by the design before constructing the final feature.

## Check the cutting volume before subtraction

When a profile becomes a cutting solid, inspect its position and extent before subtracting it from the main body. It should overlap the intended material and avoid unintended regions. A cutting solid that merely touches the face does not create the same result as one extending into the body.

For a through-feature, establish enough extent to pass through the relevant body along the chosen direction. Do not copy a depth from another orientation without checking the actual geometry. An angled path through a body can differ from its vertical or horizontal thickness.

For a blind feature, define the stopping condition deliberately. A visual overlap may conceal a depth that removes too much material or leaves an unintended wall. Use measurements or a suitable section to inspect the completed result.

After subtraction, review neighbouring faces and any openings on the far side. A correctly placed entry profile does not prove that the entire cutting operation affected only the intended volume. Preserve a recoverable model state so the operation can be revised without reconstructing unrelated work.

## Save useful systems with descriptive names

A **named UCS** records a working coordinate arrangement for later use. It can make repeated construction on the same face more consistent, particularly when several features use the same reference scheme. Save it after checking its origin and directions.

Choose names that identify purpose rather than the order of creation. A description such as angled mounting face is easier to interpret than a number with no explanation. Add a note if the system refers to a particular revision or construction assumption.

A saved coordinate system is not automatically a design constraint tied to a face. If the underlying geometry changes, inspect whether the saved origin and orientation still match the intended reference. Recalling a familiar name does not prove that it remains suitable.

Restore an agreed working system after a local task when that helps the team. This reduces surprises for the next operation. The important point is to make the active state visible, rather than enforce a ritual that nobody understands.

## Diagnose a misplaced feature systematically

First, check the geometry's actual position from more than one view. Establish whether the problem is a displaced plane, a wrong local coordinate, an incorrect extrusion direction or an unsuitable depth. These causes can produce similar-looking results from one angle.

Then inspect the origin and axis directions used during construction. A correct distance measured from the wrong corner remains the wrong location. A reversed axis can place a feature symmetrically on the opposite side while keeping all entered distances plausible.

Check the operation's inputs and resulting object types. A profile may have produced a surface when a cutting solid was needed. That is a construction issue rather than a coordinate error, and moving it will not repair the missing volume.

Correct the cause in a recoverable copy and repeat the relevant checks. Avoid stacking rotations and translations until the result looks right. An understandable sequence is easier to inspect and reuse than a chain of compensating adjustments.

## Make the method usable by another person

For a small Australian business, the useful record is brief: which face is being used, where its origin lies, how its axes run and which direction defines the feature depth. Include the feature's required position and any relevant limits.

Ask a colleague to identify those references from the model and note. If they must infer which corner was selected or which way is positive, improve the explanation before reusing the method. The benefit of local coordinates is reduced ambiguity, not merely fewer keystrokes.

Connect the construction check to the broader model review. [Choosing a 3D model that suits the design question](/insights/choosing-a-3d-model-that-suits-the-design-question/) explains the boundary between geometric evidence and physical design decisions. Accurate placement is one necessary part of that evidence, not the whole validation process.

## Questions to ask

- Which face and origin define the feature's position?
- Are the positive axis directions visible and meaningful?
- Has changing the view been mistaken for changing the working plane?
- Does the profile lie on the intended plane?
- Is the depth measured along the required direction?
- Have the completed feature and its far-side effects been checked?

## Bringing it together

Features on angled faces become easier to construct when their local references are explicit. Establish the plane, confirm its origin and axes, then check both profile placement and the direction of the resulting operation.

Use saved coordinate systems to support repeatable work, while reviewing them when the model changes. A clear reference scheme makes the geometry easier for both its author and the next reviewer to understand.

---
*Source: Alf Yarwood, Introduction to AutoCAD 2011: 2D and 3D Design (2010), primarily chapter 17; Autodesk documentation linked above corrects the book's treatment of UCSFOLLOW as a prerequisite. Coordinates are original illustrations. Confirm command behaviour and design requirements before applying the method.*
