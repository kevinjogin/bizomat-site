---
title: "Selecting CAD objects with clear boundaries"
description: "Choose CAD selection methods deliberately, inspect the objects included and understand how selection boundaries change the result of an editing command."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - validation
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

A CAD edit can use the correct command and still change the wrong drawing content. The error often begins a moment earlier, when a selection includes one extra object, misses part of the intended geometry or treats a complete object as though it were a separate visible segment.

Selecting well means defining the scope of an operation before performing it. Window, crossing, polygon and fence methods offer different ways to express that scope. Understanding their boundaries is especially useful in crowded drawings, where a broad sweep of the cursor can include much more than the feature you intended to change.

## Treat selection as a drawing decision

A **selection set** is the collection of drawing objects chosen for an operation. Its contents answer the question of what the next command may affect. The command then determines how those objects will be interpreted and changed.

Before selecting anything, describe the intended scope in plain language. Move the three mounting-hole circles is a better instruction than move everything over here. It identifies an object type, a count and a purpose that can be checked against the highlighted result.

Also identify what should remain fixed. A construction line, neighbouring component or note may occupy the same part of the screen without belonging to the edit. Stating both the intended change and its boundary makes it easier to choose a suitable selection method.

This habit complements the broader workflow in [Editing CAD geometry without losing design intent](/reados/collections/cad-modelling-and-design-intent/editing-cad-geometry-without-losing-design-intent/). Here the focus is the selection itself: how to build it, inspect it and recognise when an editing command gives the same boundary a different meaning.

## Know whether you are choosing objects or editing grips

AutoCAD commonly allows selection before a command or at the command's Select objects prompt. The first approach starts with the objects and then chooses an action. The second starts with the action and then builds the set it will use. Settings and particular commands can affect which sequence is accepted.

Read the active prompt rather than relying on the cursor alone. A click made while the program requests a displacement point has a different meaning from a click made while it requests another object. Completing the selection stage deliberately prevents an intended pick from becoming an unintended location.

**Grips** are editable points displayed on selected objects. They provide access to changes such as moving a vertex or repositioning an object. Activating a grip begins an editing interaction; it is not merely another way to add an object to the current set.

When the screen becomes ambiguous, cancel the current interaction and rebuild a small, clear selection. That is usually easier to reason about than adding more clicks while uncertain which mode is active. The aim is a known command state before geometry changes.

## Choose between containment and contact

A **window selection** includes objects entirely contained within its rectangular boundary. A **crossing selection** includes objects inside the boundary and objects touched by it. That difference is the basis of many deliberate selection strategies.

In the familiar implied rectangular selection, specifying the second corner to the right of the first creates a window; specifying it to the left creates a crossing selection. The appearance of the boundary also distinguishes the modes, although colours and display details can vary with configuration.

Use containment when a complete local object should qualify. For example, a window around a group of separate symbols can leave a long construction line unselected when that line extends beyond the window. This can be helpful even when the construction line passes through the same region.

Use contact when touching the intended objects is the more precise rule. A narrow crossing band can catch several long parallel lines without enclosing their complete lengths. It will also catch unrelated objects crossing that band, so its convenience depends on inspecting what else occupies the region.

Do not decide the method solely from the shape you want to draw with the cursor. Decide whether an object should qualify because it is wholly inside or because it touches the boundary. That rule remains useful when the geometry becomes too irregular for a rectangle.

## Use polygons and fences for irregular groups

A **window polygon** uses a multi-sided boundary and selects fully enclosed objects. A **crossing polygon** uses a multi-sided boundary and also selects objects it crosses. These methods help fit a selection around neighbouring content that a rectangle would include.

Keep the polygon straightforward. Each added corner creates another boundary to inspect, and a self-crossing shape is unsuitable for these polygon methods. Often a simple polygon followed by a small correction is clearer than a complicated outline squeezed between many objects.

A **fence selection** follows an open path and selects objects that path crosses. It does not define an enclosed region. This makes it useful when the intended objects are arranged along a route rather than gathered in an area.

| Method | Selection rule | Useful situation | Main review point |
| --- | --- | --- | --- |
| Individual picks | Choose particular objects | A few distinct objects | Confirm the picked object is the intended one |
| Window | Complete containment | A compact group of whole objects | Check for objects extending beyond the boundary |
| Crossing | Containment or contact | Long objects passing through a narrow region | Check unrelated objects touched by the boundary |
| Window polygon | Complete containment in an irregular region | A group beside nearby obstacles | Inspect every edge of the polygon |
| Crossing polygon | Containment or contact in an irregular region | An irregular region requiring partial-object contact | Check both included objects and enclosed control points |
| Fence | Contact with an open path | Several objects along a route | Check every crossing along the path |

```figure
type: compare
title: Containment or contact
cols: Selects | Check
caption: Window selects only what is fully inside; crossing also takes what the boundary touches.
- Window | Objects completely inside | Objects extending past the boundary are left out
- *Crossing | Objects inside or touching | Unrelated objects touched by the boundary
- Fence | Objects an open path crosses | Every crossing along the path
```

Autodesk's [SELECT command reference](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-LT-MAC/files/GUID-0DD5DA73-9DC5-4424-8FED-7BBE3BE52A4D.htm) describes these options and their prompts. Use the equivalent help for the installed product when confirming interface details; the important workflow choice is the geometric rule expressed by the selection.

## Remember that a visible segment may belong to a larger object

A **polyline** is one object containing connected line or arc segments. Selecting a visible part of a polyline ordinarily selects that object, not an independent copy of the segment you touched. This explains why a small crossing selection can highlight a much larger outline.

A **block reference** is an inserted instance of a reusable block definition. Its visible lines may look like ordinary separate geometry, but selecting the reference operates on the inserted object. Editing geometry within its definition is a different task from moving the reference.

Before using a broad edit, inspect an unfamiliar object's type through Properties or an appropriate inquiry command. A rectangle might consist of four separate lines, one closed polyline or a block. The same screen image can therefore produce different selection counts and editing behaviour.

Do not explode an object merely to make selection feel familiar. Changing its structure can discard useful organisation or relationships. First decide whether the intended operation belongs at the whole-object level or requires an appropriate editing method for that object's contents.

## Build a set in stages and inspect its membership

The first selection does not need to be perfect. It needs to be understandable enough to refine. Start with the main group, add any clear omissions and remove unintended objects before accepting the set.

At an object-selection prompt, Add and Remove modes provide explicit ways to adjust membership. Shift-based removal is also available in common selection workflows. If a shortcut behaves differently because of settings or context, use the prompt and visible feedback to establish what was actually removed.

Compare the selected result with the intended scope statement. If the task concerns three separate circles, an unexpected fourth circle deserves investigation. Counts are useful when the representation is known, but a matching count is not proof: three wrong objects can still produce the expected number.

Inspect the edges of the set as carefully as its centre. Accidental inclusions often occur where a construction line, hatch boundary or annotation crosses the selected region. In a dense drawing, zooming to inspect these boundary areas can be more informative than repeatedly selecting the obvious central objects.

Layer organisation can make this review easier. However, visibility alone should not be treated as an edit-protection policy. [Organising CAD drawings with layers and properties](/reados/collections/cad-drafting-and-drawing-standards/organising-cad-drawings-with-layers-and-properties/) explains the wider use of layers to make drawing purpose and properties explicit.

## Use Previous, Last and All for their actual meanings

The Previous option retrieves a recent selection set in supported command contexts. It can help apply another operation to the same objects, but it is temporary command history rather than a durable named record. Intervening operations or a change of drawing space can make assumptions about it unreliable.

The Last option concerns the most recently created eligible visible object. It does not mean the last group you happened to select. Confusing those two concepts can silently reduce a broad intended edit to a single object.

The All option is broader than everything currently visible on screen. Autodesk specifies that it selects objects in model space or the current layout, excluding those on frozen or locked layers. It can therefore include content outside the current view, and merely turning a layer off should not be assumed to protect its objects from this option.

Use these options only when their scope matches the task, then inspect the result. They are useful shortcuts for a known selection rule, not substitutes for deciding what should change. For a local adjustment in a crowded file, a visibly bounded set is often easier to review.

## Understand why Stretch needs a boundary, not just a list

The **STRETCH command** changes supported geometry by moving selected endpoints or vertices while leaving others fixed. A crossing window or crossing polygon tells the command which defining points lie in the moving region. Here the selection boundary becomes part of the edit's meaning.

An object completely enclosed by that crossing region is generally moved as a whole. For a partly enclosed supported line or polyline, points inside the region move while points outside remain in place. Selecting an object individually does not express the same partial-stretch instruction.

This means the same highlighted outline can be insufficient evidence for a stretch. You also need to know which of its defining points were enclosed. A boundary that crosses a line's middle without enclosing either endpoint does not identify the endpoint movement needed to lengthen that line.

Object type remains important. Circles, ellipses and ordinary block references do not become longer shapes through the generic STRETCH command. Autodesk's [STRETCH reference](https://help.autodesk.com/cloudhelp/2021/ENU/AutoCAD-Core/files/GUID-F000A502-D39E-4D31-A8E2-4A626473FB72.htm) describes the supported behaviour and limitations. Use a suitable object-specific method when changing their actual shape.

Treat stretching as a planned boundary operation: identify fixed points, identify moving points, choose the crossing region and then specify a deliberate displacement. Check the resulting geometry against those expectations before continuing with other edits.

## A worked example: extending one end of an outline

This is an illustration. A simple drawing contains a closed rectangular polyline running from X = 0 to X = 200 and from Y = 0 to Y = 100. A smaller closed rectangular polyline, representing an internal feature, runs from X = 160 to X = 180 and from Y = 30 to Y = 70.

The intended edit is to extend the outer outline 40 units to the right while moving the internal feature by the same amount. The left side of the outer outline must remain fixed, and the internal feature must retain its width and height. Both objects are ordinary straight-segment polylines in the same drawing plane.

The author starts STRETCH and makes a crossing window covering X = 150 to X = 210 and Y = -10 to Y = 110. This region encloses both right-hand vertices of the outer rectangle and every vertex of the internal rectangle. It leaves the outer rectangle's left-hand vertices outside.

A displacement of 40 units in positive X then expresses the intended change. The outer rectangle's right side moves from X = 200 to X = 240, while its left side remains at X = 0. The internal rectangle moves from X = 160–180 to X = 200–220.

The checks are specific. The new outer width is 240 units and its height remains 100. The internal rectangle remains 20 units wide and 40 units high. Its right-side clearance remains 20 units because 240 minus 220 equals 20, matching the original 200 minus 180.

```figure
type: svg
title: Stretching one end of an outline
alt: An outer rectangle from X 0 to 200 contains an inner rectangle from X 160 to 180. A crossing window from X 150 to 210 encloses the outer rectangle's right-hand vertices and the whole inner rectangle. A 40-unit stretch moves the outer right side to 240 and the inner rectangle to 200 to 220, keeping the left side fixed and the 20-unit clearance.
caption: Vertices inside the crossing window move 40 units; the left side stays fixed and the inner feature keeps its size and 20-unit clearance.
viewbox: 0 0 640 210
body:
<rect class="bxa" x="20" y="40" width="480" height="120" rx="2"/>
<rect class="bx" x="420" y="76" width="40" height="48" rx="2"/>
<path class="lf dsh" d="M20 40H420V160H20ZM340 76H380V124H340Z"/>
<path class="ln dsh" d="M320 28H440V172H320Z"/>
<text class="tx txs" x="20" y="190">X = 0</text>
<text class="tx txs" x="420" y="190" text-anchor="middle">200</text>
<text class="txb" x="500" y="190" text-anchor="middle">240</text>
<text class="tx txs" x="380" y="20" text-anchor="middle">crossing window 150–210</text>
<path class="la flow" d="M520 100H600"/>
<text class="tx txs" x="560" y="90" text-anchor="middle">+40</text>
<text class="tx txs" x="200" y="104" text-anchor="middle">dashed: before</text>
```

If the crossing boundary instead enclosed only one right-hand vertex of the outer rectangle, the result could distort the outline. If the internal feature were a different object type, its behaviour would need separate consideration. The successful result depends on the chosen points and representation, not simply on seeing two objects highlighted.

## Use short checks to make the method repeatable

For recurring edits, a small practice drawing can expose selection behaviour without involving a live project. Include separate lines, a polyline, a circle, a block and a nearby note. Try containment, contact and partial stretching, then inspect what each operation actually changes.

This is useful for a small Australian business where drawing work may be occasional. A short demonstration based on familiar object types can be more practical than expecting everyone to remember every selection option. Keep the exercise focused on mistakes that could occur in the team's real files.

When reviewing a live change, check both intended movement and nearby content expected to stay fixed. If a result is uncertain, undo the edit and rebuild the selection while the original condition is still easy to recover. Repeated adjustments to an unexplained result make later checking harder.

Separate selection mistakes from displacement mistakes. If the correct objects moved in the wrong direction, the selection may have been sound. If neighbouring geometry changed, inspect membership and boundary placement first. Diagnosing the stage that failed gives a more useful correction than repeating the entire operation blindly.

## Questions to ask

- What exact objects or defining points should change?
- Does the selection rule require containment, contact or an open path?
- Are visible segments part of a polyline or block?
- Have unintended objects been removed before accepting the set?
- Does this command use the selection boundary to determine its behaviour?
- What nearby geometry should remain unchanged after the edit?

## Bringing it together

Reliable selection begins with a clear description of scope. Choose a method that expresses that scope, inspect the actual objects and consider how the command interprets them. For partial edits such as stretching, include the boundary and defining points in the review. A few deliberate checks before committing an edit can prevent a correct command from producing the wrong drawing.

---
*Source: Autodesk, Inc., Learning AutoCAD 2010, Volume 1 (2009), with supplementary Autodesk documentation linked above. The example and dimensions are illustrations. This article is general workflow information; confirm selection and editing behaviour in your software version and drawing.*
