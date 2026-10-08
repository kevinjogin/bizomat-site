---
title: "Choosing and checking curves in CAD"
description: "Choose useful curve representations, control fit points and vertices, and check continuity, spacing and conversion before curved geometry is reused."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - manufacturing
  - validation
author: "KEVOS"
featured: false
draft: false
---

A smooth line on screen can represent several different kinds of geometry. It might be a circular arc, a polyline containing many segments or a spline controlled by points and mathematical parameters. Those differences become important when the curve must be edited, divided into intervals or transferred into another process.

George Omura's *Mastering AutoCAD 2011 and AutoCAD LT 2011* develops curve work through polylines, spline editing and the placement of regular markers. For users of computer-aided design, or **CAD**, the useful principle is to choose a representation that expresses the intended relationship, then check its geometry and behaviour rather than relying on a smooth appearance.

## Start with the information that defines the shape

Ask what is known about the curve. A specified centre and radius suggest a circle or circular arc. A series of straight and circular sections may suit a polyline. A smoothly varying freeform outline may need a spline, especially when a single radius does not describe it.

A **circular arc** is part of a circle and therefore has a constant radius. A **polyline** combines connected line or arc segments into one object. A **spline** represents a curve through mathematical control that can produce changing curvature along its length.

These are different ways of recording design information. If a radius is an explicit requirement, replacing the arc with a visually similar freeform spline makes that requirement harder to inspect. If the shape is genuinely freeform, forcing it into a collection of arbitrary arcs may make later changes unnecessarily awkward.

Identify the next operation as well as the current drawing task. A curve used only for presentation has different requirements from one used as a surface profile or manufacturing input. Check the recipient's supported geometry and required verification before deciding that the most flexible representation is the most useful one.

## Understand what a polyline preserves

A polyline maintains a connected sequence of segments as one object. This can simplify selection, boundary creation and editing. Its vertices record where the segments meet, and its segment types determine whether the path runs straight or follows circular arcs between those points.

**Closure** means that the path forms a closed boundary. A path that merely appears to return to its start may still contain a small gap or remain logically open. Inspect closure where it matters for hatching, area calculation or later modelling.

Polyline width is another distinct property. A wide polyline can look like a strip while its underlying path still describes a centre route. Do not confuse that visual width with a separately modelled physical boundary or thickness.

Keep the vertex count purposeful. Extra vertices can make a shape harder to edit and can conceal short unwanted segments. A simple outline expressed through a few meaningful lines and arcs is easier to check than a densely traced approximation of the same intended shape.

## Distinguish fitting from control

**Fit points** describe positions through or near which a spline is constructed. With zero fitting tolerance, the fit-point method makes the spline pass through the selected points. A nonzero tolerance allows a bounded departure from those points according to the tool's rules.

**Control vertices**, often shortened to CVs, influence the curve's shape through a control framework. They are not generally measurements that the curve must pass through. Moving a control vertex changes the shape, but interpreting every CV as a point on the finished outline would be misleading.

Choose fit points when the measured or specified positions themselves are important. Choose control vertices when shaping a continuous form is the main task and the control framework provides a more useful way to adjust it. Both approaches still require independent checks of the resulting curve.

Autodesk's [SPLINE command documentation](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-Core/files/GUID-5E7D51E2-1595-4E0C-85F8-2D7CBD166A08.htm) explains the fit-point and control-vertex methods. Its tolerance description is a reminder to inspect the actual setting rather than assuming that every displayed point lies exactly on the curve.

## Use the fewest controls that explain the intended shape

More points create more opportunities to change the curve, but they also create more relationships to manage. Closely spaced points can introduce small waves that are difficult to see at an overall view. Those waves may become obvious in an offset, a surface built from the curve or a close inspection of the outline.

Begin with the principal shape. Establish endpoints, major changes in direction and any required intermediate positions. Add controls only where the existing framework cannot describe a needed feature adequately.

When working from measured data, distinguish measurement variation from intentional geometry. Fitting every uncertain sample exactly can create a curve that follows noise. Any smoothing or approximation should have an explicit purpose and acceptance criterion, rather than being selected solely because the result looks cleaner.

Retain the original measurements or source curve when experimenting. This allows comparison of the modified shape with the information from which it was derived. A reduced set of controls can be useful, but it should not erase the evidence needed to judge the change.

## Check how curves meet

**Positional continuity** means that adjoining curves meet at the same location. It does not establish that they flow smoothly through the join. Two segments can share an endpoint and still form a visible corner.

**Tangency** means that the curves share a direction at the join. Tangent control at a spline's start or end can help it connect smoothly to neighbouring geometry. The chosen tangent direction should come from the intended relationship, not from an arbitrary cursor movement.

**Curvature** describes how rapidly a curve changes direction along its length. A tangent join can still show an abrupt change in curvature. Where surface appearance or a downstream process makes that distinction important, inspect more than endpoint coincidence and tangent direction.

Choose the required continuity deliberately. A designed corner should remain a corner, while a continuous visual transition may need a smoother relationship. Making every join as smooth as possible is not a substitute for understanding what the outline represents.

## Keep editing operations traceable

Spline editing offers different ways to modify fit data, vertices and endpoints. Some operations change which editing information remains available. The book warns that certain edits can remove fit data, so the drafter should not assume that every representation can be restored after arbitrary changes.

Before a significant edit, describe the intended effect. For example, preserve both endpoints while reducing a bulge, or move one fit point while retaining an agreed tangent at the other end. This turns an open-ended dragging operation into a change that can be assessed.

Inspect the whole curve after a local adjustment. A moved control may influence a broader region than expected. Compare overall length, important offsets and nearby clearances as well as the area where the edit was made.

Use recoverable working versions when changing representation or removing control data. A saved original provides a useful reference even if the edited curve becomes simpler and easier to handle. [Editing CAD geometry without losing design intent](/insights/editing-cad-geometry-without-losing-design-intent/) gives a wider framework for describing and reviewing such changes.

## Separate display smoothness from geometric accuracy

The screen represents mathematical geometry through a display process. A curve can appear faceted at one zoom level without its underlying definition being a set of straight segments. Conversely, a dense collection of short segments can look smooth while remaining an approximation.

Inspect the object type and properties before diagnosing the shape from appearance alone. If the issue is only display quality, rebuilding the curve may introduce unnecessary changes. If the object really is segmented, increasing visual smoothness will not turn it into a different mathematical representation.

Use numerical checks suited to the requirement. A circular feature can be checked by radius and centre. A freeform profile may require comparisons at specified positions or a deviation check against an agreed reference. Choose those checks before declaring the curve acceptable.

Avoid presenting many decimal places as evidence of source accuracy. A spline can pass exactly through points that were placed approximately. Numerical precision describes the stored geometry; confidence in the design also depends on where the inputs came from.

## Treat conversion as a new approximation to check

Converting a spline to a polyline can make it usable in a workflow that requires polylines. The resulting representation may approximate the original curve, and conversion settings affect its complexity. Keep the original spline until the receiving workflow has been checked.

A higher conversion setting may increase detail without resolving the real requirement. Decide what deviation matters, how the recipient will use the curve and what complexity the workflow can handle. Do not treat an arbitrary setting number as a tolerance expressed in millimetres.

Compare critical positions, endpoints and closure after conversion. Also inspect the entire outline for local changes. A matching overall bounding size does not establish that the shape between the extremes has been preserved adequately.

Test the converted object in the next application or operation. A file that imports successfully may still contain an open boundary, too many fragments or unsupported properties. [Checking CAD data when changing file formats](/insights/checking-cad-data-when-changing-file-formats/) extends this review to the complete transfer process.

## Place markers according to distance along the path

The book distinguishes two useful operations. DIVIDE marks a specified number of equal intervals along an eligible object. MEASURE places markers at a specified interval length along the object. Neither should be confused with cutting the original curve into separate pieces.

**Arc length** is distance measured along a curved path. The straight-line distance between two neighbouring markers is a chord and can be shorter than the path distance. Equal path intervals therefore do not necessarily produce equal straight-line spacing in a varying curve.

Choose which distance the task requires. Repeated locations along a route may use path distance, while a physical gap between components may require a different geometric check. A correctly executed spacing command can still answer the wrong question.

For fixed-length spacing on an open curve, inspect the starting end and the remainder. Starting from the other end changes the marker locations when the path length is not an exact multiple of the interval. Record the intended origin so a later revision does not reverse the sequence unnoticed.

## Work through a curve and marker example

This is an illustration. A small Australian business is exploring a curved display outline for a concept drawing. The checked path length is 1,200 mm. It wants six equal intervals for review markers, while a second option uses markers every 250 mm from an identified start point.

For six equal intervals, each interval is 1,200 divided by 6, or 200 mm along the path. There are five internal division positions between the two endpoints. If the review requires visible markers at both endpoints as well, those are an additional explicit requirement.

For the 250 mm option, internal markers lie at path distances of 250, 500, 750 and 1,000 mm. The final remainder is 200 mm. The end is not another full 250 mm interval, so silently adding a marker there would change the meaning of the spacing pattern.

| Method | Internal path distances from the start | Remaining distance to the end |
| --- | --- | --- |
| Six equal intervals | 200, 400, 600, 800, 1,000 mm | 200 mm |
| Fixed 250 mm intervals | 250, 500, 750, 1,000 mm | 200 mm |

The drafter then revises the curve while preserving its endpoints. Its measured length becomes 1,260 mm. Six equal intervals now require 210 mm each. Fixed 250 mm spacing produces five internal markers at 250, 500, 750, 1,000 and 1,250 mm, leaving a remainder of 10 mm.

That last calculation matters. Counting markers from the previous version would miss the newly available interval. The team reviews whether a marker only 10 mm from the end is useful for its purpose, rather than accepting it merely because the command can place it.

The markers also need orientation checks if they are blocks with a directional shape. Following the curve's local direction can be appropriate for one symbol and confusing for another. The team compares the intended reading direction before selecting the alignment behaviour.

Ordinary points or blocks placed by these commands should not be assumed to redistribute themselves when the source curve changes. Keep the marker set identifiable, remove superseded trial markers from the working result deliberately, and repeat the spacing check against the revised path. Otherwise, old and new markers can coexist and suggest a spacing rule that neither version intended.

## Review the curve as part of the design

A curve rarely stands alone. It may define a boundary, guide a sweep, control a surface or locate repeated objects. After changing it, inspect those dependent uses and determine which relationships update automatically and which require deliberate rebuilding.

For a small team, record a few meaningful properties: representation, intended units, important endpoints, required joins, checked length and any conversion decision. The record need not explain every command. It should let another person understand what must be preserved during the next edit.

Keep the distinction between geometric checking and physical suitability clear. A smooth profile does not establish manufacturability, strength or appropriate clearance. Those questions require their own criteria and evidence beyond the curve-editing workflow.

## Questions to ask

- Does the object type express the known geometry and intended next use?
- Are points measured requirements or controls used to shape the curve?
- Which joins need position, tangency or closer curvature review?
- Has conversion or editing changed endpoints, closure or significant offsets?
- Does spacing refer to path length, straight-line distance or another requirement?

## Bringing it together

Useful curve work begins with the relationship the geometry must represent. Choose an appropriate object type, control it deliberately and check the whole shape after edits. Treat conversion and marker placement as separate decisions so a smooth-looking outline remains understandable and usable downstream.

---

*Source: George Omura, Mastering AutoCAD 2011 and AutoCAD LT 2011 (2010), Chapter 19; Autodesk documentation linked above. Numbers are illustrations, not product specifications. Confirm geometry and receiving-system requirements before using converted curves in production.*
